'use strict';

const rp = require('request-promise');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { intersection, has } = require('lodash');
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
	API_SIGNATURE_INVALID
} = require(`${SERVER_PATH}/messages`);
const {
	NODE_ENV,
	CAPTCHA_ENDPOINT,
	INVALID_PASSWORD,
	CODE_NOT_FOUND,
	CODE_USED,
	SAME_PASSWORD,
	BASE_SCOPES,
	ROLES,
	ISSUER,
	SECRET,
	TOKEN_TYPES,
	HMAC_TOKEN_EXPIRY,
	HMAC_TOKEN_KEY
} = require(`${SERVER_PATH}/constants`);
const { resolve, reject, promisify } = require('bluebird');
const { getKitSecrets, getKitConfig, getFrozenUsers, getNetworkKeySecret } = require('./common');
const bcrypt = require('bcryptjs');
const uuid = require('uuid/v4');
const { all } = require('bluebird');
const { sendEmail } = require(`${SERVER_PATH}/mail`);
const { MAILTYPE } = require(`${SERVER_PATH}/mail/strings`);
const { getModel } = require('./database/model');
const dbQuery = require('./database/query');
const otp = require('otp');
const { client } = require('./database/redis');
const { loggerAuth } = require(`${SERVER_PATH}/config/logger`);
const moment = require('moment');

const checkCaptcha = (captcha = '', remoteip = '') => {
	if (!captcha) {
		if (NODE_ENV === 'development') {
			return resolve();
		} else {
			return reject(new Error(INVALID_CAPTCHA));
		}
	} else if (!getKitSecrets().captcha || !getKitSecrets().captcha.secret_key) {
		return resolve();
	}

	const options = {
		method: 'POST',
		form: {
			secret: getKitSecrets().captcha.secret_key,
			response: captcha,
			remoteip
		},
		uri: CAPTCHA_ENDPOINT
	};

	return rp(options)
		.then((response) => JSON.parse(response))
		.then((response) => {
			if (!response.success) {
				throw new Error(INVALID_CAPTCHA);
			}
			return;
		});
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
		.then((code) => {
			if (code.used) {
				throw new Error(CODE_USED);
			}
			return code.update({ used: true }, { fields: ['used'] });
		})
		.then((code) => dbQuery.findOne('user', { where: { id: code.user_id } }))
		.then((user) => user.update({ password: newPassword }, { fields: ['password'] }));
};

const changeUserPassword = (email, oldPassword, newPassword) => {
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
			return all([ user, validatePassword(user.password, oldPassword) ]);
		})
		.then(([ user, passwordIsValid ]) => {
			if (!passwordIsValid) {
				throw new Error(INVALID_PASSWORD);
			} else {
				return user;
			}
		})
		.then((user) => {
			return user.update({ password: newPassword });
		});
};

const getResetPasswordCode = (code) => {
	return dbQuery.findOne('reset password code', { where: { code } })
		.then((code) => {
			if (!code) {
				const error = new Error(CODE_NOT_FOUND);
				error.status = 404;
				throw error;
			}
			return code;
		});
};

const createResetPasswordCode = (userId) => {
	return dbQuery.findOne('reset password code', {
		where: { user_id: userId, used: false },
		attributes: ['code']
	})
		.then((code) => {
			if (code) {
				return code;
			}
			return getModel('reset password code').create({
				user_id: userId,
				code: uuid()
			});
		})
		.then((code) => code.code);
};

const sendResetPasswordCode = (email, captcha, ip, domain) => {
	return dbQuery.findOne('user', { where: { email } })
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			}
			return all([ createResetPasswordCode(user.id), user, checkCaptcha(captcha, ip) ]);
		})
		.then(([ code, user ]) => {
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
		name: getKitConfig().api_name
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
		attributes: [ 'otp_enabled' ]
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
			attributes: [ 'otp_enabled' ]
		}),
		verifyOtpBeforeAction(userId, otpCode)
	]).then(([ user, validOtp ]) => {
		if (!user.otp_enabled) {
			throw new Error(TOKEN_OTP_MUST_BE_ENABLED);
		} else if (!validOtp) {
			throw new Error(INVALID_OTP_CODE);
		}
		return;
	});
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
			return req.res.status(403).json({ message: ACCESS_DENIED(msg) });
		}
	};

	if (!has(req.headers, 'api-key') && !has(req.headers, 'authorization')) {
		return sendError(MISSING_HEADER);
	}

	if (has(req.headers, 'api-key') && has(req.headers, 'authorization')) {
		return sendError(MULTIPLE_API_KEY);
	} else if (!has(req.headers, 'api-key') && has(req.headers, 'authorization')) {

		// Swagger endpoint scopes
		const endpointScopes = req.swagger
			? req.swagger.operation['x-security-scopes']
			: BASE_SCOPES;

		let ip;
		if (isSocket) {
			ip = req.socket ? req.socket.remoteAddress : undefined;
		} else {
			ip = req.headers ? req.headers['x-real-ip'] : undefined;
		}

		//validate the 'Authorization' header. it should have the following format:
		//'Bearer tokenString'
		if (token && token.indexOf('Bearer ') === 0) {
			const tokenString = token.split(' ')[1];

			jwt.verify(tokenString, SECRET, (verificationError, decodedToken) => {
				//check if the JWT was verified correctly
				if (!verificationError && decodedToken) {
					loggerAuth.verbose(
						'helpers/auth/verifyToken verified_token',
						ip,
						decodedToken.ip,
						decodedToken.sub
					);

					// Check set of permissions that are available with the token and set of acceptable permissions set on swagger endpoint
					if (intersection(decodedToken.scopes, endpointScopes).length === 0) {
						loggerAuth.error(
							'verifyToken',
							'not permission',
							decodedToken.sub.email,
							decodedToken.scopes,
							endpointScopes
						);

						return sendError(NOT_AUTHORIZED);
					}

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
			return req.res.status(403).json({ message: ACCESS_DENIED(msg) });
		}
	};

	// Swagger endpoint scopes
	const endpointScopes = req.swagger ? req.swagger.operation['x-security-scopes'] : BASE_SCOPES;

	const apiSignature = req.headers ? req.headers['api-signature'] : undefined;
	const apiExpires = req.headers ? req.headers['api-expires'] : undefined;

	let ip;
	if (isSocket) {
		ip = req.socket ? req.socket.remoteAddress : undefined;
	} else {
		ip = req.headers ? req.headers['x-real-ip'] : undefined;
	}

	loggerAuth.verbose('helpers/auth/checkHmacKey ip', ip);

	if (has(req.headers, 'api-key') && has(req.headers, 'authorization')) {
		return sendError(MULTIPLE_API_KEY);
	} else if (has(req.headers, 'api-key') && !has(req.headers, 'authorization')) {
		if (!apiKey) {
			loggerAuth.error('helpers/auth/checkHmacKey null key', apiKey);
			return sendError(API_KEY_NULL);
		} else if (moment().unix() > apiExpires) {
			loggerAuth.error('helpers/auth/checkHmacKey expired', apiExpires);
			return sendError(API_REQUEST_EXPIRED);
		} else if (!apiSignature) {
			loggerAuth.error('helpers/auth/checkHmacKey null secret', apiKey);
			return sendError(API_SIGNATURE_NULL);
		} else {
			findTokenByApiKey(apiKey)
				.then((token) => {
					if (!token) {
						loggerAuth.error(
							'helpers/auth/checkApiKey/findTokenByApiKey invalid key',
							apiKey
						);
						return sendError(API_KEY_INVALID);
					} else if (!endpointScopes.includes(token.type)) {
						loggerAuth.error(
							'helpers/auth/checkApiKey/findTokenByApiKey out of scope',
							apiKey,
							token.type
						);
						return sendError(API_KEY_OUT_OF_SCOPE);
					} else if (new Date(token.expiry) < new Date()) {
						loggerAuth.error(
							'helpers/auth/checkApiKey/findTokenByApiKey expired key',
							apiKey
						);
						return sendError(API_KEY_EXPIRED);
					} else if (!token.active) {
						loggerAuth.error(
							'helpers/auth/checkApiKey/findTokenByApiKey inactive',
							apiKey
						);
						return sendError(API_KEY_INACTIVE);
					} else {
						const isSignatureValid = checkHmacSignature(
							token.secret,
							req
						);
						if (!isSignatureValid) {
							return sendError(API_SIGNATURE_INVALID);
						} else {
							req.auth = {
								sub: { id: token.user.id, email: token.user.email, networkId: token.user.network_id }
							};
							cb();
						}
					}
				})
				.catch((err) => {
					loggerAuth.error('helpers/auth/checkApiKey catch', err);
					return sendError(err);
				});
		}
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

const verifyBearerTokenPromise = (token, ip, scopes = BASE_SCOPES) => {
	if (token && token.indexOf('Bearer ') === 0) {
		const tokenString = token.split(' ')[1];
		const jwtVerifyAsync = promisify(jwt.verify, jwt);

		return jwtVerifyAsync(tokenString, SECRET)
			.then((decodedToken) => {
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
				return decodedToken;
			});
	} else {
		//return the error in the callback if the Authorization header doesn't have the correct format
		return reject(new Error(MISSING_HEADER));
	}
};

const verifyHmacTokenPromise = (apiKey, apiSignature, apiExpires, method, originalUrl, body, scopes = BASE_SCOPES) => {
	if (!apiKey) {
		return reject(new Error(API_KEY_NULL));
	} else if (!apiSignature) {
		return reject(new Error(API_SIGNATURE_NULL));
	} else if (moment().unix() > apiExpires) {
		return reject(new Error(API_REQUEST_EXPIRED));
	} else {
		return findTokenByApiKey(apiKey)
			.then((token) => {
				if (!token) {
					loggerAuth.error(
						'helpers/auth/checkApiKey/findTokenByApiKey invalid key',
						apiKey
					);
					throw new Error(API_KEY_INVALID);
				} else if (!scopes.includes(token.type)) {
					loggerAuth.error(
						'helpers/auth/checkApiKey/findTokenByApiKey out of scope',
						apiKey,
						token.type
					);
					throw new Error(API_KEY_OUT_OF_SCOPE);
				} else if (new Date(token.expiry) < new Date()) {
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
				} else {
					const isSignatureValid = checkHmacSignature(
						token.secret,
						{ body, headers: { 'api-signature': apiSignature, 'api-expires': apiExpires }, method, originalUrl }
					);
					if (!isSignatureValid) {
						throw new Error(API_SIGNATURE_INVALID);
					} else {
						return {
							sub: { id: token.user.id, email: token.user.email, networkId: token.user.network_id }
						};
					}
				}
			});
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
	isAdmin = false,
	isSupport = false,
	isSupervisor = false,
	isKYC = false,
	isCommunicator = false
) => {
	// Default scope is ['user']
	let scopes = [].concat(BASE_SCOPES);

	if (checkAdminIp(getKitSecrets().admin_whitelist, ip)) {
		if (isAdmin) {
			scopes = scopes.concat(ROLES.ADMIN);
		}
		if (isSupport) {
			scopes = scopes.concat(ROLES.SUPPORT);
		}
		if (isSupervisor) {
			scopes = scopes.concat(ROLES.SUPERVISOR);
		}
		if (isKYC) {
			scopes = scopes.concat(ROLES.KYC);
		}
		if (isCommunicator) {
			scopes = scopes.concat(ROLES.COMMUNICATOR);
		}
	}

	const token = jwt.sign(
		{
			sub: {
				id,
				email,
				networkId
			},
			scopes,
			ip,
			iss: ISSUER
		},
		SECRET,
		{
			expiresIn: getKitSecrets().security.token_time
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
	created: tokenData.created_at
});

const getUserKitHmacTokens = (userId) => {
	return dbQuery.findAndCountAllWithRows('token', {
		where: {
			user_id: userId,
			type: TOKEN_TYPES.HMAC
		},
		attributes: {
			exclude: ['user_id', 'updated_at']
		},
		order: [['created_at', 'DESC'], ['id', 'ASC']],
	})
		.then(({ count, data }) => {
			const result = {
				count: count,
				data: data.map(formatTokenObject)
			};
			return result;
		});
};

const createUserKitHmacToken = (userId, otpCode, ip, name) => {
	const key = crypto.randomBytes(20).toString('hex');
	const secret = crypto.randomBytes(25).toString('hex');
	const expiry = Date.now() + HMAC_TOKEN_EXPIRY;

	return checkUserOtpActive(userId, otpCode)
		.then(() => {
			return getModel('token').create({
				user_id: userId,
				ip,
				key,
				secret,
				expiry,
				role: ROLES.USER,
				type: TOKEN_TYPES.HMAC,
				name,
				active: true,
			});
		})
		.then(() => {
			return {
				apiKey: key,
				secret
			};
		});
};

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
							attributes: ['id', 'email', 'network_id'],
						}
					]
				});
				client.hsetAsync(HMAC_TOKEN_KEY, apiKey, JSON.stringify(token));
				return token;
			} else {
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

module.exports = {
	checkCaptcha,
	resetUserPassword,
	isValidPassword,
	validatePassword,
	sendResetPasswordCode,
	changeUserPassword,
	hasUserOtpEnabled,
	verifyOtpBeforeAction,
	verifyOtp,
	checkOtp,
	generateOtp,
	generateOtpSecret,
	findUserOtp,
	setActiveUserOtp,
	updateUserOtpEnabled,
	createOtp,
	userHasOtpEnabled,
	checkUserOtpActive,
	verifyBearerTokenPromise,
	verifyHmacTokenPromise,
	verifyBearerTokenMiddleware,
	verifyHmacTokenMiddleware,
	verifyNetworkHmacToken,
	userScopeIsValid,
	userIsDeactivated,
	findToken,
	issueToken,
	getUserKitHmacTokens,
	createUserKitHmacToken,
	deleteUserKitHmacToken,
	checkHmacSignature,
	createHmacSignature
};