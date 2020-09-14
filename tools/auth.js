'use strict';

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { intersection, has } = require('lodash');
const {
	ACCESS_DENIED,
	NOT_AUTHORIZED,
	TOKEN_EXPIRED,
	INVALID_TOKEN,
	MISSING_HEADER,
	DEACTIVATED_USER,
	INVALID_CAPTCHA,
	INVALID_OTP_CODE,
	INVALID_PASSWORD,
	TOKEN_OTP_MUST_BE_ENABLED,
	TOKEN_NOT_FOUND,
	TOKEN_REVOKED
} = require('../messages');
const { SERVER_PATH } = require('../constants');
const { NODE_ENV, CAPTCHA_ENDPOINT, BASE_SCOPES, ROLES, ISSUER, SECRET, TOKEN_TYPES, HMAC_TOKEN_EXPIRY } = require(`${SERVER_PATH}/constants`);
const rp = require('request-promise');
const { getKitSecrets, getKitConfig } = require('./common');
// const { getUserByEmail, getUserByKitId } = require('./users');
const dbQuery = require('./database').query;
const otp = require('otp');
const bcrypt = require('bcryptjs');
const { getModel } = require('./database/model');
const uuid = require('uuid/v4');
const { all } = require('bluebird');
const { getFrozenUsers } = require('./users');
const { sendEmail } = require(`${SERVER_PATH}/mail`);
const { MAILTYPE } = require(`${SERVER_PATH}/mail/strings`);
const { loggerAuth } = require(`${SERVER_PATH}/config/logger`);

//Here we setup the security checks for the endpoints
//that need it (in our case, only /protected). This
//function will be called every time a request to a protected
//endpoint is received
const verifyBearerToken = (req, authOrSecDef, token, cb, isSocket = false) => {
	const sendError = (msg) => {
		if (isSocket) {
			return new Error(msg);
		} else {
			return req.res.status(403).json({ message: msg });
		}
	};

	if (!has(req.headers, 'api-key') && !has(req.headers, 'authorization')) {
		return sendError('Bearer or api-key authentication required');
	}

	if (has(req.headers, 'api-key') && has(req.headers, 'authorization')) {
		return sendError();
	} else if (!has(req.headers, 'api-key') && has(req.headers, 'authorization')) {

		// Swagger endpoint scopes
		const endpointScopes = req.swagger
			? req.swagger.operation['x-security-scopes']
			: BASE_SCOPES;
		const ip = req.headers ? req.headers['x-real-ip'] : undefined;

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

						return sendError('User does not have permission to access this service');
					}

					if (decodedToken.iss !== ISSUER) {
						loggerAuth.error(
							'helpers/auth/verifyToken unverified_token',
							ip
						);
						//return the error in the callback if there is one
						return sendError('Token is expired');
					}

					if (getFrozenUsers()[decodedToken.sub.id]) {
						loggerAuth.error(
							'helpers/auth/verifyToken deactivated account',
							decodedToken.sub.email
						);
						//return the error in the callback if there is one
						return sendError('This account is deactivated');
					}

					req.auth = decodedToken;
					return cb(null);
				} else {
					//return the error in the callback if the JWT was not verified
					return sendError('Invalid token');
				}
			});
		} else {
			//return the error in the callback if the Authorization header doesn't have the correct format
			return sendError('Missing header');
		}
	}
};

// /**
//  * Express middleware function that checks validity of bearer token.
//  * @param {string} secret - Secret used to generate token.
//  * @param {string} issuer - Issuer of valid tokens.
//  * @param {array} frozenUsers - (OPTIONAL) User ids that are deactivated.
//  * @param {array} endpointScopes - (OPTIONAL) Valid user scopes for the endpoint.
//  */
// const verifyBearerToken = (secret, issuer, frozenUsers, endpointScopes) => (
// 	req,
// 	res,
// 	next
// ) => {
// 	const sendError = (msg) => {
// 		return req.res.status(403).json({ message: ACCESS_DENIED(msg) });
// 	};

// 	const token = req.headers['authorization'];

// 	if (token && token.indexOf('Bearer ') === 0) {
// 		let tokenString = token.split(' ')[1];

// 		jwt.verify(tokenString, secret, (verificationError, decodedToken) => {
// 			if (!verificationError && decodedToken) {
// 				const issuerMatch = decodedToken.iss == issuer;

// 				if (!issuerMatch) {
// 					return sendError(TOKEN_EXPIRED);
// 				}

// 				if (frozenUsers && frozenUsers[decodedToken.sub.id]) {
// 					return sendError(DEACTIVATED_USER);
// 				}

// 				if (
// 					endpointScopes &&
// 					intersection(endpointScopes, decodedToken.scopes).length === 0
// 				) {
// 					return sendError(NOT_AUTHORIZED);
// 				}

// 				req.auth = decodedToken;
// 				return next();
// 			} else {
// 				return sendError(INVALID_TOKEN);
// 			}
// 		});
// 	} else {
// 		return sendError(MISSING_HEADER);
// 	}
// };

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

const checkCaptcha = (captcha = '', remoteip = '') => {
	if (!captcha) {
		if (NODE_ENV === 'development') {
			return new Promise((resolve) => resolve());
		} else {
			return new Promise((resolve, reject) => reject(INVALID_CAPTCHA));
		}
	} else if (!getKitSecrets().captcha.secret_key) {
		return new Promise((resolve) => resolve());
	}

	const options = {
		method: 'POST',
		form: {
			secret: getKitSecrets().catpcha.secret_key,
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

const checkAdminIp = (whiteListedIps = [], ip = '') => {
	if (whiteListedIps.length === 0) {
		return true; // no ip restriction for admin
	} else {
		return whiteListedIps.includes(ip);
	}
};

const issueToken = (
	id,
	email,
	ip,
	isAdmin = false,
	isSupport = false,
	isSupervisor = false,
	isKYC = false,
	isTech = false
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
		if (isTech) {
			scopes = scopes.concat(ROLES.TECH);
		}
	}

	const token = jwt.sign(
		{
			sub: {
				id,
				email
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

const validatePassword = (userPassword, inputPassword) => {
	return bcrypt.compare(inputPassword, userPassword);
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

const getResetPasswordCode = (code) => {
	return dbQuery.findOne('reset password code', { where: { code } })
		.then((code) => {
			if (!code) {
				const error = new Error('Code not found');
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
	return require('./users').getUserByEmail(email)
		.then((user) => {
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

const resetUserPassword = (resetPasswordCode, newPassword) => {
	return getResetPasswordCode(resetPasswordCode)
		.then((code) => {
			if (code.used) {
				throw new Error('Code is already used');
			}
			return code.update({ used: true }, { fields: ['used'] });
		})
		.then((code) => require('./users').getUserByKitId(code.user_id, false))
		.then((user) => user.update({ password: newPassword }, { fields: ['password'] }));
};

const changeUserPassword = (email, oldPassword, newPassword) => {
	return require('./users').getUserByEmail(email, false)
		.then((user) => {
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

const userHasOtpEnabled = (userId) => {
	return require('./users').getUserByKitId(userId)
		.then((user) => {
			return user.otp_enabled;
		});
};

const checkUserOtpActive = (userId, otpCode) => {
	return all([
		require('./users').getUserByKitId(userId),
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
			role: TOKEN_TYPES.HMAC
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
				id: userId,
				key: {
					apiKey: key,
					secret
				}
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
				},
				raw: true
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
		.then(formatTokenObject);
};

const findToken = (query) => {
	return dbQuery.findOne('token', query);
};

const findTokenByApiKey = (apiKey) => {
	return dbQuery.findOne('token', {
		where: {
			key: apiKey,
			active: true
		},
		include: [
			{
				model: getModel('user'),
				as: 'user',
				attributes: ['id', 'email']
			}
		]
	});
};

const checkToken = (token) => {
	return findTokenByApiKey(token);
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
	verifyBearerToken,
	userScopeIsValid,
	userIsDeactivated,
	checkCaptcha,
	verifyOtpBeforeAction,
	verifyOtp,
	findToken,
	checkToken,
	issueToken,
	validatePassword,
	generateOtp,
	generateOtpSecret,
	findUserOtp,
	setActiveUserOtp,
	updateUserOtpEnabled,
	createOtp,
	sendResetPasswordCode,
	resetUserPassword,
	changeUserPassword,
	getUserKitHmacTokens,
	userHasOtpEnabled,
	createUserKitHmacToken,
	deleteUserKitHmacToken,
	checkHmacSignature
};
