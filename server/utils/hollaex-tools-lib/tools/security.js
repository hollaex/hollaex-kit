'use strict';

const rp = require('request-promise');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { intersection, has } = require('lodash');
const { isEmail } = require('validator');
const ipRangeCheck = require('ip-range-check');
const { SERVER_PATH } = require('../constants');
const {
	INVALID_CAPTCHA,
	USER_NOT_FOUND,
	TOKEN_OTP_MUST_BE_ENABLED,
	INVALID_OTP_CODE,
	ACCESS_DENIED,
	NOT_AUTHORIZED,
	TOKEN_EXPIRED,
	INVALID_TOKEN,
	MISSING_HEADER,
	DEACTIVATED_USER,
	TOKEN_NOT_FOUND,
	TOKEN_REVOKED,
	MULTIPLE_API_KEY,
	API_KEY_NULL,
	API_REQUEST_EXPIRED,
	API_SIGNATURE_NULL,
	API_KEY_INACTIVE,
	API_KEY_INVALID,
	API_KEY_EXPIRED,
	API_KEY_OUT_OF_SCOPE,
	API_KEY_NOT_PERMITTED,
	API_KEY_NOT_WHITELISTED,
	API_SIGNATURE_INVALID,
	INVALID_PASSWORD,
	INVALID_CREDENTIALS,
	SAME_PASSWORD,
	CODE_NOT_FOUND,
	INVALID_TOKEN_TYPE,
	NO_AUTH_TOKEN,
	WHITELIST_DISABLE_ADMIN,
	WHITELIST_NOT_PROVIDED,
	SESSION_NOT_FOUND
} = require(`${SERVER_PATH}/messages`);
const {
	NODE_ENV,
	CAPTCHA_ENDPOINT,
	BASE_SCOPES,
	ROLES,
	ISSUER,
	SECRET,
	TOKEN_TYPES,
	HMAC_TOKEN_EXPIRY,
	HMAC_TOKEN_KEY,
	ROLE_PERMISSIONS
} = require(`${SERVER_PATH}/constants`);
const { getNodeLib } = require(`${SERVER_PATH}/init`);
const { resolve, reject, promisify } = require('bluebird');
const { getKitSecrets, getKitConfig, getFrozenUsers, getNetworkKeySecret, getRoles } = require('./common');
const bcrypt = require('bcryptjs');
const { all } = require('bluebird');
const { sendEmail } = require(`${SERVER_PATH}/mail`);
const { MAILTYPE } = require(`${SERVER_PATH}/mail/strings`);
const { getModel } = require('./database/model');
const dbQuery = require('./database/query');
const otp = require('otp');
const { client } = require('./database/redis');
const { loggerAuth } = require(`${SERVER_PATH}/config/logger`);
const moment = require('moment');
const { generateHash, generateRandomString } = require(`${SERVER_PATH}/utils/security`);
const geoip = require('geoip-lite');

const getCountryFromIp = (ip) => {
	const geo = geoip.lookup(ip);
	if (!geo) {
		return '';
	}
	return geo.country;
};

const checkIp = async (remoteip = '') => {
	const dataGeofence = getKitConfig().black_list_countries;
	if (dataGeofence && dataGeofence.length > 0 && remoteip) {
		if (dataGeofence.includes(getCountryFromIp(remoteip))) {
			throw new Error('ERROR IP LOCATION');
		}
	}
	return;
};

const checkCaptcha = (captcha = '', remoteip = '') => {
	// Google Recaptcha is deprecated feature from v2.10.3.
	return;
};

const validatePassword = (userPassword, inputPassword) => {
	return bcrypt.compare(inputPassword, userPassword);
};

const isValidPassword = (value) => {
	return /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(value);
};

const resetUserPassword = (resetPasswordCode, newPassword) => {
	if (!isValidPassword(newPassword)) {
		return reject(new Error(INVALID_PASSWORD));
	}
	return getResetPasswordCode(resetPasswordCode)
		.then((user_id) => {
			return all([
				dbQuery.findOne('user', { where: { id: user_id } }),
				client.delAsync(`ResetPasswordCode:${resetPasswordCode}`)
			]);
		})
		.then(([user]) => {
			return user.update({ password: newPassword }, { fields: ['password'] });
		});
};

async function sendConfirmationEmail(userId, domain) {
	const user = await dbQuery.findOne('user', { where: { id: userId } });

	if (!user) {
		throw new Error(USER_NOT_FOUND);
	}

	const code = generateRandomString(20);

	// If another confirmation is requested within the timeout,
	// the previous one is invalidated by overwrite
	await client.setexAsync(`ConfirmationEmail:${userId}`, 60 * 5, code);

	sendEmail(
		MAILTYPE.CONFIRM_EMAIL,
		user.email,
		{ code },
		user.settings,
		domain);
}

async function confirmByEmail(userId, givenCode) {
	const code = await client.getAsync(`ConfirmationEmail:${userId}`);
	if (!code || code.length < 2) {
		return false;
	}
	if (!crypto.timingSafeEqual(Buffer.from(code), Buffer.from(givenCode))) {
		return false;
	}

	client.delAsync(`ConfirmationEmail:${userId}`);
	return true;
}

const confirmChangeUserPassword = (code, domain) => {
	return getChangePasswordCode(code)
		.then((data) => {
			const dataValues = JSON.parse(data);
			return all([
				dbQuery.findOne('user', { where: { id: dataValues.id } }),
				dataValues,
				client.delAsync(`ChangePasswordCode:${code}`)
			]);
		})
		.then(([user, dataValues]) => {
			return user.update({ password: dataValues.password }, { fields: ['password'], hooks: false });
		})
		.then(async (user) => {
			const { revokeAllUserSessions } = require('./user');

			await revokeAllUserSessions(user.id);
			sendEmail(
				MAILTYPE.PASSWORD_CHANGED,
				user.email,
				{ code },
				user.settings,
				domain
			);
			return;
		});
};

const changeUserPassword = (email, oldPassword, newPassword, ip, domain, otpCode) => {
	if (oldPassword === newPassword) {
		return reject(new Error(SAME_PASSWORD));
	}
	if (!isValidPassword(newPassword)) {
		return reject(new Error(INVALID_PASSWORD));
	}
	return dbQuery.findOne('user', { where: { email } })
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			}
			return all([user, verifyOtpBeforeAction(user.id, otpCode), validatePassword(user.password, oldPassword)]);
		})
		.then(([user, otp, passwordIsValid]) => {
			if (!otp) {
				throw new Error(INVALID_OTP_CODE);
			}
			if (!passwordIsValid) {
				throw new Error(INVALID_CREDENTIALS);
			}
			return all([createChangePasswordCode(user.id, newPassword), user]);
		})
		.then(([code, user]) => {
			sendEmail(
				MAILTYPE.CHANGE_PASSWORD,
				email,
				{ code, ip },
				user.settings,
				domain
			);
			return;
		});
};

const getChangePasswordCode = (code) => {
	return client.getAsync(`ChangePasswordCode:${code}`)
		.then((data) => {
			if (!data) {
				const error = new Error(CODE_NOT_FOUND);
				error.status = 404;
				throw error;
			}
			return data;
		});
};

const createChangePasswordCode = (userId, newPassword) => {
	//Generate new random code
	const code = crypto.randomBytes(20).toString('hex');
	//Code is expire in 5 mins
	return generateHash(newPassword)
		.then((hashedPassword) => {
			return client.setexAsync(`ChangePasswordCode:${code}`, 60 * 5, JSON.stringify({
				id: userId,
				password: hashedPassword
			}));
		})
		.then(() => {
			return code;
		});
};

const getResetPasswordCode = (code) => {
	return client.getAsync(`ResetPasswordCode:${code}`)
		.then((user_id) => {
			if (!user_id) {
				const error = new Error(CODE_NOT_FOUND);
				error.status = 404;
				throw error;
			}
			return user_id;
		});
};

const createResetPasswordCode = (userId) => {
	//Generate new random code
	const code = crypto.randomBytes(20).toString('hex');

	//Code is expire in 5 mins
	return client.setexAsync(`ResetPasswordCode:${code}`, 60 * 5, userId)
		.then(() => {
			return code;
		});
};

const sendResetPasswordCode = (email, captcha, ip, domain) => {
	if (typeof email !== 'string' || !isEmail(email)) {
		return reject(new Error(USER_NOT_FOUND));
	}

	return dbQuery.findOne('user', { where: { email } })
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			}
			return all([createResetPasswordCode(user.id), user, checkCaptcha(captcha, ip)]);
		})
		.then(([code, user]) => {
			sendEmail(
				MAILTYPE.RESET_PASSWORD,
				email,
				{ code, ip },
				user.settings,
				domain
			);
			return;
		});
};

const generateOtp = (secret, epoch = 0) => {
	const options = {
		name: getKitConfig().api_name,
		secret,
		epoch
	};
	const totp = otp(options).totp();
	return totp;
};

const verifyOtp = (userSecret, userDigits) => {
	const serverDigits = [generateOtp(userSecret, 30), generateOtp(userSecret), generateOtp(userSecret, -30)];
	return serverDigits.includes(userDigits);
};

const getUserOtpCode = (user_id, usedParam = true) => {
	return dbQuery.findOne('otp code', {
		where: {
			used: usedParam,
			user_id
		},
		attributes: ['id', 'secret'],
		order: [['updated_at', 'DESC']]
	})
		.then((otpCode) => {
			return generateOtp(otpCode.secret, 30)
		})
};

const hasUserOtpEnabled = (id) => {
	return dbQuery.findOne('user', {
		where: { id },
		attributes: ['otp_enabled']
	}).then((user) => {
		return user.otp_enabled;
	});
};

const verifyUserOtpCode = (user_id, otp_code) => {
	return dbQuery.findOne('otp code', {
		where: {
			used: true,
			user_id
		},
		attributes: ['id', 'secret'],
		order: [['updated_at', 'DESC']]
	})
		.then((otpCode) => {
			return verifyOtp(otpCode.secret, otp_code);
		})
		.then((validOtp) => {
			if (!validOtp) {
				throw new Error(INVALID_OTP_CODE);
			}
			return true;
		});
};

const verifyOtpBeforeAction = (user_id, otp_code) => {
	return hasUserOtpEnabled(user_id).then((otp_enabled) => {
		if (otp_enabled) {
			return verifyUserOtpCode(user_id, otp_code);
		} else {
			return true;
		}
	});
};

const checkOtp = (userId) => {
	return hasUserOtpEnabled(userId).then((otp_enabled) => {
		if (otp_enabled) {
			throw new Error('OTP is already enabled');
		}
		return findUserOtp(userId);
	});
};

/*
	Function generate the otp secret.
	Return the otp secret.
 */
const generateOtpSecret = () => {
	const seed = otp({
		name: getKitConfig().api_name,
		keySize: 16
	});
	return seed.secret;
};

/*
	Function to find the user otp code, should take one parameter:
	Param 1(integer): user id
	Return a promise with the otp code row from the db.
 */
const findUserOtp = (user_id) => {
	return dbQuery.findOne('otp code', {
		where: {
			used: false,
			user_id
		},
		attributes: ['id', 'secret']
	});
};

/*
	Function to create a user otp code, should take one parameter:
	Param 1(integer): user id
	Return a promise with the otp secret created.
 */
const createOtp = (user_id) => {
	const secret = generateOtpSecret();
	return getModel('otp code').create({
		user_id,
		secret
	})
		.then((otpCode) => otpCode.secret);
};

/*
  Function to find update the uset otp_enabled field,
  should take two parameter:

  Param 1(integer): user id
  Param 2(boolean): otp_enabled

  Return a promise with the updated user.
 */
const updateUserOtpEnabled = (id, otp_enabled = false, transaction) => {
	return dbQuery.findOne('user', {
		where: { id },
		attributes: ['id', 'otp_enabled']
	}).then((user) => {
		return user.update(
			{ otp_enabled },
			{ fields: ['otp_enabled'], transaction }
		);
	});
};

/*
	Function to set used to true in the user otp code and update the user and set otp_enabled to true, should take one parameter:
	Param 1(integer): user id
	Return a promise with the user updated.
 */
const setActiveUserOtp = (user_id) => {
	return getModel('sequelize').transaction((transaction) => {
		return findUserOtp(user_id)
			.then((otp) => {
				return otp.update(
					{ used: true },
					{ fields: ['used'], transaction }
				);
			})
			.then(() => {
				return updateUserOtpEnabled(user_id, true, transaction);
			});
	});
};

const userHasOtpEnabled = (userId) => {
	return dbQuery.findOne('user', {
		where: { id: userId },
		raw: true,
		attributes: ['otp_enabled']
	})
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			}
			return user.otp_enabled;
		});
};

const checkUserOtpActive = (userId, otpCode) => {
	return all([
		dbQuery.findOne('user', {
			where: { id: userId },
			raw: true,
			attributes: ['otp_enabled']
		}),
		verifyOtpBeforeAction(userId, otpCode)
	]).then(([user, validOtp]) => {
		if (!user.otp_enabled) {
			throw new Error(TOKEN_OTP_MUST_BE_ENABLED);
		} else if (!validOtp) {
			throw new Error(INVALID_OTP_CODE);
		}
		return;
	});
};

const verifyAuthTokenMiddleware = (req, authOrSecDef, token, cb, isSocket = false) => {

	if (req.swagger && req.swagger.operation['security'].length > 0 && req.swagger.operation['security'][0].Token) {
		const endpointTypes = req.swagger.operation['x-security-types'];
		if (has(req.headers, 'authorization') && !endpointTypes.includes('bearer')) {
			return req.res.status(401).json({ message: ACCESS_DENIED(INVALID_TOKEN_TYPE) });
		}

		if (has(req.headers, 'api-key') && !endpointTypes.includes('hmac')) {
			return req.res.status(401).json({ message: ACCESS_DENIED(INVALID_TOKEN_TYPE) });
		}

		if (!has(req.headers, 'authorization') && !has(req.headers, 'api-key')) {
			return req.res.status(401).json({ message: ACCESS_DENIED(NO_AUTH_TOKEN) });
		}

		if (has(req.headers, 'authorization') && endpointTypes.includes('bearer')) {
			verifyBearerTokenMiddleware(req, authOrSecDef, req.headers['authorization'], cb, isSocket);
		}
		else if (has(req.headers, 'api-key') && endpointTypes.includes('hmac')) {
			verifyHmacTokenMiddleware(req, authOrSecDef, req.headers['api-key'], cb, isSocket);
		}

	}
};


//Here we setup the security checks for the endpoints
//that need it (in our case, only /protected). This
//function will be called every time a request to a protected
//endpoint is received
const verifyBearerTokenMiddleware = (req, authOrSecDef, token, cb, isSocket = false) => {
	const sendError = (msg) => {
		if (isSocket) {
			return cb(new Error(ACCESS_DENIED(msg)));
		} else {
			let statusCode = 401;
			if (msg.indexOf(NOT_AUTHORIZED) > -1) {
				statusCode = 403;
			}
			return req.res.status(statusCode).json({ message: ACCESS_DENIED(msg) });
		}
	};

	if (!has(req.headers, 'api-key') && !has(req.headers, 'authorization')) {
		return sendError(MISSING_HEADER);
	}

	if (has(req.headers, 'api-key') && has(req.headers, 'authorization')) {
		return sendError(MULTIPLE_API_KEY);
	} else if (!has(req.headers, 'api-key') && has(req.headers, 'authorization')) {

		let ip = req.headers ? req.headers['x-real-ip'] : undefined;

		//validate the 'Authorization' header. it should have the following format:
		//'Bearer tokenString'
		if (token && token.indexOf('Bearer ') === 0) {
			const tokenString = token.split(' ')[1];

			jwt.verify(tokenString, SECRET, async (verificationError, decodedToken) => {
				//check if the JWT was verified correctly
				if (!verificationError && decodedToken) {
					loggerAuth.verbose(
						'helpers/auth/verifyToken verified_token',
						'ip',
						ip,
						'token ip',
						decodedToken.ip,
						'user id',
						decodedToken.sub?.id,
						'email',
						decodedToken.sub?.email,
					);

					if (decodedToken.iss !== ISSUER) {
						loggerAuth.error(
							'helpers/auth/verifyToken unverified_token',
							ip
						);
						//return the error in the callback if there is one
						return sendError(TOKEN_EXPIRED);
					}

					if (getFrozenUsers()[decodedToken.sub.id]) {
						loggerAuth.error(
							'helpers/auth/verifyToken deactivated account',
							decodedToken.sub.email
						);
						//return the error in the callback if there is one
						return sendError(DEACTIVATED_USER);
					}

					try {
						const session = await verifySession(tokenString);
						if (session) req.session_id = session.id;
					} catch (err) {
						return sendError(err.message);
					}

					try {
						if (!isSocket) {
							checkPermission(req, decodedToken);
						}
					} catch (err) {
						return sendError(err.message);
					}

					req.auth = decodedToken;
					return cb(null);
				} else {
					//return the error in the callback if the JWT was not verified
					return sendError(INVALID_TOKEN);
				}
			});
		} else {
			//return the error in the callback if the Authorization header doesn't have the correct format
			return sendError(MISSING_HEADER);
		}
	}
};

const verifyHmacTokenMiddleware = (req, definition, apiKey, cb, isSocket = false) => {
	const sendError = (msg) => {
		if (isSocket) {
			return cb(new Error(ACCESS_DENIED(msg)));
		} else {
			let statusCode = 401;
			if (msg.indexOf(NOT_AUTHORIZED) > -1) {
				statusCode = 403;
			}
			return req.res.status(statusCode).json({ message: ACCESS_DENIED(msg) });
		}
	};
	// Swagger endpoint scopes
	const endpointPermissions = req.swagger ? req.swagger.operation['x-token-permissions'] : ['can_read'];

	const apiSignature = req.headers ? req.headers['api-signature'] : undefined;
	const apiExpires = req.headers ? req.headers['api-expires'] : undefined;

	let ip = req.headers ? req.headers['x-real-ip'] : undefined;

	loggerAuth.verbose('helpers/auth/checkHmacKey ip', ip);

	if (has(req.headers, 'api-key') && has(req.headers, 'authorization')) {
		return sendError(MULTIPLE_API_KEY);
	} else if (has(req.headers, 'api-key') && !has(req.headers, 'authorization')) {
		verifyHmacTokenPromise(
			apiKey,
			apiSignature,
			apiExpires,
			req.method,
			req.originalUrl,
			req.body,
			endpointPermissions,
			ip)
			.then((auth) => {
				req.auth = auth;
				cb();
			})
			.catch((err) => {
				loggerAuth.error('helpers/auth/checkApiKey catch', err);
				return sendError(err.message);
			});
	}
};

const verifyNetworkHmacToken = (req) => {
	const givenApiKey = req.headers ? req.headers['api-key'] : undefined;
	const apiSignature = req.headers ? req.headers['api-signature'] : undefined;
	const apiExpires = req.headers ? req.headers['api-expires'] : undefined;

	if (!givenApiKey) {
		return reject(new Error(API_KEY_NULL));
	} else if (!apiSignature) {
		return reject(new Error(API_SIGNATURE_NULL));
	} else if (moment().unix() > apiExpires) {
		return reject(new Error(API_REQUEST_EXPIRED));
	}

	return getNetworkKeySecret()
		.then(({ apiKey, apiSecret }) => {
			if (givenApiKey !== apiKey) {
				throw new Error(API_KEY_INVALID);
			}
			const isSignatureValid = checkHmacSignature(
				apiSecret,
				req
			);
			if (!isSignatureValid) {
				throw new Error(API_SIGNATURE_INVALID);
			} else {
				return;
			}
		});
};


const verifyBearerTokenExpressMiddleware = (scopes = BASE_SCOPES) => (req, res, next) => {
	const sendError = (msg) => {
		let statusCode = 401;
		if (msg.indexOf(NOT_AUTHORIZED) > -1) {
			statusCode = 403;
		}
		return req.res.status(statusCode).json({ message: ACCESS_DENIED(msg) });
	};

	const token = req.headers['authorization'];

	if (token && token.indexOf('Bearer ') === 0) {
		let tokenString = token.split(' ')[1];

		jwt.verify(tokenString, SECRET, async (verificationError, decodedToken) => {
			if (!verificationError && decodedToken) {

				const issuerMatch = decodedToken.iss == ISSUER;

				if (!issuerMatch) {
					return sendError(TOKEN_EXPIRED);
				}

				if (intersection(decodedToken.scopes, scopes).length === 0) {
					loggerAuth.error(
						'verifyToken',
						'not permission',
						decodedToken.sub.email,
						decodedToken.scopes,
						scopes
					);

					return sendError(NOT_AUTHORIZED);
				}

				if (getFrozenUsers()[decodedToken.sub.id]) {
					loggerAuth.error(
						'helpers/auth/verifyToken deactivated account',
						decodedToken.sub.email
					);
					//return the error in the callback if there is one
					return sendError(DEACTIVATED_USER);
				}

				try {
					const session = await verifySession(tokenString);
					if (session) req.session_id = session.id;
				} catch (err) {
					return sendError(err.message);
				}

				try {
					checkPermission({ swagger: { apiPath: req.originalUrl || req?.swagger?.apiPath }, method: req.method }, decodedToken);
				} catch (err) {
					return sendError(err.message);
				}

				req.auth = decodedToken;
				return next();
			} else {
				return sendError(INVALID_TOKEN);
			}
		});
	} else {
		return sendError(MISSING_HEADER);
	}
};

const verifyBearerTokenPromise = (token, ip, scopes = BASE_SCOPES) => {
	if (token && token.indexOf('Bearer ') === 0) {
		const tokenString = token.split(' ')[1];
		const jwtVerifyAsync = promisify(jwt.verify, jwt);

		return jwtVerifyAsync(tokenString, SECRET)
			.then(async (decodedToken) => {
				loggerAuth.verbose(
					'helpers/auth/verifyToken verified_token',
					ip,
					decodedToken.ip,
					decodedToken.sub
				);

				// Check set of permissions that are available with the token and set of acceptable permissions set on swagger endpoint
				if (intersection(decodedToken.scopes, scopes).length === 0) {
					loggerAuth.error(
						'verifyToken',
						'not permission',
						decodedToken.sub.email,
						decodedToken.scopes,
						scopes
					);

					throw new Error(NOT_AUTHORIZED);
				}

				if (decodedToken.iss !== ISSUER) {
					loggerAuth.error(
						'helpers/auth/verifyToken unverified_token',
						ip
					);
					//return the error in the callback if there is one
					throw new Error(TOKEN_EXPIRED);
				}

				if (getFrozenUsers()[decodedToken.sub.id]) {
					loggerAuth.error(
						'helpers/auth/verifyToken deactivated account',
						decodedToken.sub.email
					);
					throw new Error(DEACTIVATED_USER);
				}
				await verifySession(tokenString);
				return decodedToken;
			});
	} else {
		//return the error in the callback if the Authorization header doesn't have the correct format
		return reject(new Error(MISSING_HEADER));
	}
};

const verifyHmacTokenPromise = (apiKey, apiSignature, apiExpires, method, originalUrl, body, permissions = [], ip = undefined) => {
	if (!apiKey) {
		return reject(new Error(API_KEY_NULL));
	} else if (!apiSignature) {
		return reject(new Error(API_SIGNATURE_NULL));
	} else if (moment().unix() > apiExpires) {
		return reject(new Error(API_REQUEST_EXPIRED));
	} else {
		return findTokenByApiKey(apiKey)
			.then((token) => {

				if (token.whitelisting_enabled && token.whitelisted_ips.length > 0) {
					const found = token.whitelisted_ips.find((wlip) => {
						return ipRangeCheck(ip, wlip);
					});
					if (!found) {
						loggerAuth.error(
							'helpers/auth/checkApiKey/findTokenByApiKey not whitelisted',
							apiKey,
							token.whitelisted_ips,
							ip
						);
						throw new Error(API_KEY_NOT_WHITELISTED);
					}
				}
				if (new Date(token.expiry) < new Date()) {
					loggerAuth.error(
						'helpers/auth/checkApiKey/findTokenByApiKey expired key',
						apiKey
					);
					throw new Error(API_KEY_EXPIRED);
				} else if (!token.active) {
					loggerAuth.error(
						'helpers/auth/checkApiKey/findTokenByApiKey inactive',
						apiKey
					);
					throw new Error(API_KEY_INACTIVE);
				} else if (!permissions.every((permission) => token[permission] === true)) {
					loggerAuth.error(
						'helpers/auth/checkApiKey/findTokenByApiKey not permitted',
						apiKey
					);
					throw new Error(API_KEY_NOT_PERMITTED);
				} else {
					const isSignatureValid = checkHmacSignature(
						token.secret,
						{ body, headers: { 'api-signature': apiSignature, 'api-expires': apiExpires }, method, originalUrl }
					);
					if (!isSignatureValid) {
						throw new Error(API_SIGNATURE_INVALID);
					} else {
						checkPermission({ swagger: { apiPath: originalUrl }, method }, token);
						return {
							sub: { id: token.user.id, email: token.user.email, networkId: token.user.network_id },
							scopes: [token.role]
						};
					}
				}
			});
	}
};


const createSession = async (token, loginId, userId) => {

	const user = await dbQuery.findOne('user', { where: { id: userId } });
	const userRole = user.role || 'user';
	const base64Payload = token.split('.')[1];
	const payloadBuffer = Buffer.from(base64Payload, 'base64');
	const decoded = JSON.parse(payloadBuffer.toString());

	const hashedToken = crypto.createHash('md5').update(token).digest('hex');

	return getModel('session').create({
		token: hashedToken,
		role: userRole,
		login_id: loginId,
		status: true,
		last_seen: new Date(),
		expiry_date: new Date(decoded.exp * 1000)
	});
};

const getExpirationDateInSeconds = (expiryDate) => {
	const end = moment(expiryDate);
	const now = moment(new Date());
	const duration = moment.duration(moment(end).diff(now));
	return Number(duration.asSeconds().toFixed(0));
};

const verifySession = async (token) => {

	const session = await findSession(token);

	if (!session) {
		loggerAuth.error(
			'security/verifySession session not found');
		throw new Error(SESSION_NOT_FOUND);
	}

	if (!session.status) {
		loggerAuth.error(
			'security/verifySession invalid session',
			session.status
		);
		throw new Error(TOKEN_REVOKED);
	}

	if (new Date(session.expiry_date).getTime() < new Date().getTime()) {
		throw new Error(TOKEN_EXPIRED);
	}

	if (new Date(session.last_seen).getTime() + 1000 * 60 * 5 < new Date().getTime()) {
		const hashedToken = crypto.createHash('md5').update(token).digest('hex');
		const sessionData = await dbQuery.findOne('session', { where: { token: hashedToken } });
		const updatedSession = await sessionData.update(
			{ last_seen: new Date() }
		);
		const expirationInSeconds = getExpirationDateInSeconds(updatedSession.dataValues.expiry_date);
		client.setexAsync(updatedSession.dataValues.token, expirationInSeconds, JSON.stringify(updatedSession.dataValues));
	}

	return session;
};

const findSession = async (token) => {

	const hashedToken = crypto.createHash('md5').update(token).digest('hex');

	let session = await client.getAsync(hashedToken);

	if (!session) {
		loggerAuth.verbose(
			'security/findSession jwt token not found in redis',
			hashedToken
		);

		session = await dbQuery.findOne('session', {
			where: {
				token: hashedToken
			}
		});

		if (session && session.status && new Date(session.expiry_date).getTime() > new Date().getTime()) {
			const expirationInSeconds = getExpirationDateInSeconds(session.expiry_date);
			client.setexAsync(hashedToken, expirationInSeconds, JSON.stringify(session));

			loggerAuth.verbose(
				'security/findSession token stored in redis',
				hashedToken
			);
		}

		return session;
	} else {
		loggerAuth.debug(
			'security/findSession token found in redis',
			hashedToken
		);
		return JSON.parse(session);
	}
};

/**
 * Function that checks to see if user's scope is valid for the endpoint.
 * @param {array} endpointScopes - Authorized scopes for the endpoint.
 * @param {array} userScopes - Scopes of the user.
 * @returns {boolean} True if user scope is authorized for endpoint. False if not.
 */
const userScopeIsValid = (endpointScopes, userScopes) => {
	if (intersection(endpointScopes, userScopes).length === 0) {
		return false;
	} else {
		return true;
	}
};

/**
 * Function that checks to see if user's account is deactivated.
 * @param {array} deactivatedUsers - Ids of deactivated users.
 * @param {array} userId - Id of user.
 * @returns {boolean} True if user account is deactivated. False if not.
 */
const userIsDeactivated = (deactivatedUsers, userId) => {
	if (deactivatedUsers[userId]) {
		return true;
	} else {
		return false;
	}
};

const checkAdminIp = (whiteListedIps = [], ip = '') => {
	if (whiteListedIps.length === 0) {
		return true; // no ip restriction for admin
	} else {
		return whiteListedIps.includes(ip);
	}
};

const issueToken = (
	id,
	networkId,
	email,
	ip,
	expiresIn = getKitSecrets().security.token_time, // 24 hours by default
	lang = 'en',
	permissions = [],
	configs = [],
	role = 'user'
) => {
	// Default scope is ['user']
	let scopes = [].concat(BASE_SCOPES);

	if (checkAdminIp(getKitSecrets().admin_whitelist, ip)) {
		scopes.push(role);
	}

	const token = jwt.sign(
		{
			sub: {
				id,
				email,
				networkId,
				lang,
				role
			},
			scopes,
			ip,
			iss: ISSUER
		},
		SECRET,
		{
			expiresIn
		}
	);
	return token;
};

const createHmacSignature = (secret, verb, path, expires, data = '') => {
	const stringData = typeof data === 'string' ? data : JSON.stringify(data);

	const signature = crypto
		.createHmac('sha256', secret)
		.update(verb + path + expires + stringData)
		.digest('hex');
	return signature;
};

const maskToken = (token = '') => {
	return token.substr(0, 3) + '********';
};
/*
  Function that transform the token object from the db to a formated object
  Takes one parameter:

  Parameter 1(object): token object from the db

  Retuns a json objecet
*/
const formatTokenObject = (tokenData) => ({
	id: tokenData.id,
	name: tokenData.name,
	apiKey: tokenData.key,
	secret: maskToken(tokenData.secret),
	active: tokenData.active,
	revoked: tokenData.revoked,
	expiry: tokenData.expiry,
	created: tokenData.created_at,
	whitelisted_ips: tokenData.whitelisted_ips,
	whitelisting_enabled: tokenData.whitelisting_enabled,
	can_read: tokenData.can_read,
	can_trade: tokenData.can_trade,
	can_withdraw: tokenData.can_withdraw,
	role: tokenData.role
});

const getUserKitHmacTokens = (userId) => {
	return dbQuery.findAndCountAllWithRows('token', {
		where: {
			user_id: userId,
			type: TOKEN_TYPES.HMAC,
			active: true
		},
		attributes: {
			exclude: ['user_id', 'updated_at']
		},
		order: [['created_at', 'DESC'], ['id', 'ASC']]
	})
		.then(({ count, data }) => {
			const result = {
				count: count,
				data: data.map(formatTokenObject)
			};
			return result;
		});
};

const createUserKitHmacToken = async (userId, otpCode, ip, name, role = ROLES.USER, whitelisted_ips) => {
	const key = crypto.randomBytes(20).toString('hex');
	const secret = crypto.randomBytes(25).toString('hex');
	const expiry = Date.now() + HMAC_TOKEN_EXPIRY;
	const user = await getModel('user').findOne({ where: { id: userId } });
	if (role !== ROLES.USER && user.role !== 'admin') {
		throw new Error(NOT_AUTHORIZED);
	}
	if (role !== ROLES.USER && role !== ROLES.ADMIN) {
		// role can only be admin or user
		throw new Error(NOT_AUTHORIZED);
	}

	if (!whitelisted_ips && role === ROLES.ADMIN) {
		throw new Error(WHITELIST_NOT_PROVIDED);
	}

	return checkUserOtpActive(userId, otpCode)
		.then(() => {
			return getModel('token').create({
				user_id: userId,
				ip,
				key,
				secret,
				expiry,
				role: role || ROLES.USER,
				type: TOKEN_TYPES.HMAC,
				name,
				active: true,
				can_read: true,
				...(role === ROLES.ADMIN && { whitelisted_ips }),
				...(role === ROLES.ADMIN && { whitelisting_enabled: true })
			});
		})
		.then((token) => {
			return token;
		});
};

async function updateUserKitHmacToken(userId, otpCode, ip, token_id, name, permissions, whitelisted_ips, whitelisting_enabled) {
	await checkUserOtpActive(userId, otpCode);
	const token = await findToken({ where: { id: token_id, user_id: userId } });

	if (!token) {
		throw new Error(TOKEN_NOT_FOUND);
	} else if (token.revoked) {
		throw new Error(TOKEN_REVOKED);
	}

	if (whitelisted_ips && whitelisted_ips.length == 0 && token.role === ROLES.ADMIN) {
		throw new Error(WHITELIST_DISABLE_ADMIN);
	}

	if (whitelisting_enabled == false && token.role === ROLES.ADMIN) {
		throw new Error(WHITELIST_DISABLE_ADMIN);
	}

	const values = {
		...permissions,
		name,
		...(whitelisted_ips != null && { whitelisted_ips }),
		...(whitelisting_enabled != null && { whitelisting_enabled }),
	};

	Object.entries(values).forEach((key, value) => {
		if (value === undefined) {
			delete values[key];
		}
	});

	let newToken = await token.update(values, {
		returning: true,
		fields: [
			'name',
			'can_read',
			'can_trade',
			'can_withdraw',
			'whitelisting_enabled',
			'whitelisted_ips',
		]
	});
	client.hdelAsync(HMAC_TOKEN_KEY, token.key);
	return formatTokenObject(newToken);
}

const deleteUserKitHmacToken = (userId, otpCode, tokenId) => {
	return checkUserOtpActive(userId, otpCode)
		.then(() => {
			return dbQuery.findOne('token', {
				where: {
					id: tokenId,
					user_id: userId
				}
			});
		})
		.then((token) => {
			if (!token) {
				throw new Error(TOKEN_NOT_FOUND);
			} else if (token.revoked) {
				throw new Error(TOKEN_REVOKED);
			}
			return token.update(
				{
					active: false,
					revoked: true
				},
				{ fields: ['active', 'revoked'], returning: true }
			);
		})
		.then((token) => {
			client.hdelAsync(HMAC_TOKEN_KEY, token.key);
			return formatTokenObject(token);
		});
};

const findToken = (query) => {
	return dbQuery.findOne('token', query);
};

const findTokenByApiKey = (apiKey) => {
	return client.hgetAsync(HMAC_TOKEN_KEY, apiKey)
		.then(async (token) => {
			if (!token) {
				loggerAuth.verbose(
					'security/findTokenByApiKey apiKey not found in redis',
					apiKey
				);

				token = await dbQuery.findOne('token', {
					where: {
						key: apiKey,
						active: true
					},
					raw: true,
					nest: true,
					include: [
						{
							model: getModel('user'),
							as: 'user',
							attributes: ['id', 'email', 'network_id']
						}
					]
				});

				if (!token) {
					loggerAuth.error(
						'security/findTokenByApiKey invalid key',
						apiKey
					);
					throw new Error(API_KEY_INVALID);
				}

				client.hsetAsync(HMAC_TOKEN_KEY, apiKey, JSON.stringify(token));

				loggerAuth.verbose(
					'security/findTokenByApiKey apiKey stored in redis',
					apiKey
				);

				return token;
			} else {
				loggerAuth.debug(
					'security/findTokenByApiKey apiKey found in redis',
					apiKey
				);
				return JSON.parse(token);
			}
		});
};

const calculateSignature = (secret = '', verb, path, nonce, data = '') => {
	const stringData = typeof data === 'string' ? data : JSON.stringify(data);

	const signature = crypto
		.createHmac('sha256', secret)
		.update(verb + path + nonce + stringData)
		.digest('hex');

	return signature;
};

const checkHmacSignature = (
	secret,
	{ body, headers, method, originalUrl }
) => {
	const signature = headers['api-signature'];
	const expires = headers['api-expires'];

	const calculatedSignature = calculateSignature(
		secret,
		method,
		originalUrl,
		expires,
		body
	);
	return calculatedSignature === signature;
};

const isValidScope = (endpointScopes, userScopes) => {
	if (intersection(endpointScopes, userScopes).length === 0) {
		return false;
	} else {
		return true;
	}
};

const generateDashToken = (opts = {
	additionalHeaders: null
}) => {
	return getNodeLib().generateDashToken({ additionalHeaders: opts.additionalHeaders });
};

const checkPermission = (req, user) => {
	// Extract path and method from request
	let apiPath = req?.swagger?.apiPath; // admin/user/role
	const method = req.method.toLowerCase(); // "get", "post", etc.

	if (!apiPath) {
		throw new Error(NOT_AUTHORIZED);
	}
	apiPath = apiPath.replace(/\?.*$/, '');
	apiPath = apiPath.replace(/^\/v[0-9]+\//, '/');

	if (!apiPath.includes('admin')) return;
	if (apiPath.includes('plugins')) return;

	// Convert path to permission key
	// ["admin", "user", "role"]
	const pathParts = apiPath.split('/').filter(Boolean);

	// Navigate through permissions object
	let currentLevel = ROLE_PERMISSIONS;
	for (const part of pathParts) {
		currentLevel = currentLevel[part];
		if (!currentLevel) break;
	}

	//Get required permission string
	const requiredPermission = currentLevel?.[method];

	if (!requiredPermission) {
		throw new Error(`No permission configured for ${apiPath} ${method.toUpperCase()}`);
	}

	// Check if user has permission
	const userHasPermission = checkUserPermission(user, requiredPermission);

	if (!userHasPermission) {
		throw new Error(`${NOT_AUTHORIZED} Required permission: ${requiredPermission}`);
	}
};

const checkUserPermission = (user, requiredPermission) => {
	const roles = getRoles();
	const userRole = roles.find(role => role.role_name === (user?.role || user?.sub?.role));
	if (!userRole) {
		throw new Error('User role not found');
	}

	return userRole.permissions.includes(requiredPermission);
};

module.exports = {
	checkCaptcha,
	resetUserPassword,
	isValidPassword,
	validatePassword,
	sendResetPasswordCode,
	changeUserPassword,
	confirmChangeUserPassword,
	hasUserOtpEnabled,
	verifyOtpBeforeAction,
	verifyOtp,
	checkOtp,
	generateOtp,
	generateOtpSecret,
	getUserOtpCode,
	findUserOtp,
	setActiveUserOtp,
	updateUserOtpEnabled,
	createOtp,
	userHasOtpEnabled,
	checkUserOtpActive,
	verifyBearerTokenPromise,
	verifyHmacTokenPromise,
	verifyAuthTokenMiddleware,
	verifyBearerTokenMiddleware,
	verifyHmacTokenMiddleware,
	verifyNetworkHmacToken,
	userScopeIsValid,
	userIsDeactivated,
	findToken,
	issueToken,
	getUserKitHmacTokens,
	createUserKitHmacToken,
	updateUserKitHmacToken,
	deleteUserKitHmacToken,
	checkHmacSignature,
	createHmacSignature,
	isValidScope,
	verifyBearerTokenExpressMiddleware,
	getCountryFromIp,
	checkIp,
	sendConfirmationEmail,
	confirmByEmail,
	calculateSignature,
	generateDashToken,
	createSession,
	verifySession,
	findSession
};
