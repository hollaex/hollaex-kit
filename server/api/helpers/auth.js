'use strict';

const { intersection } = require('lodash');
const uuid = require('uuid/v4');
const bcrypt = require('bcryptjs');
const { ResetPasswordCode, User, VerificationCode } = require('../../db/models');
const { findUserByEmail, findUser } = require('../helpers/user');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { loggerAuth } = require('../../config/logger');
const { checkToken } = require('./token');
const { checkHmacSignature } = require('./security');
const { getFrozenUsers } = require('../../init');
const {
	SECRET,
	ISSUER,
	BASE_SCOPES,
} = require('../../constants');
const {
	MULTIPLE_API_KEY,
	API_KEY_NULL,
	API_REQUEST_EXPIRED,
	API_SIGNATURE_NULL,
	API_KEY_INVALID,
	API_KEY_OUT_OF_SCOPE,
	API_KEY_EXPIRED,
	API_KEY_INACTIVE,
	API_SIGNATURE_INVALID
} = require('../../messages');
const passwordRegEx = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;

/*
	Function that check if a value matches the regular expression for a password. Takes one parameters
	Param 1(string): value to check
	Return a boolean with the result of the match
*/
const isValidPassword = (value) => {
	return passwordRegEx.test(value);
};

/*
	Functions to verify the password with the hash stored in the DB, should take two parameters:
	Param 1(String): hash value stored in the DB
	Param 2(String): password provided by the user
	Return a promise with one parameter(boolean) that indicates if the password matches the hash stored.
 */
const validatePassword = (userPassword, inputPassword) => {
	return bcrypt.compare(inputPassword, userPassword);
};

const createResetPasswordCode = (user_id) => {
	return ResetPasswordCode.findOne({
		where: { user_id, used: false },
		attributes: ['code']
	})
		.then((code) => {
			if (code) {
				return code;
			}
			return ResetPasswordCode.create({
				user_id,
				code: uuid()
			});
		})
		.then((code) => code.code);
};

const findResetPasswordCode = (options) => {
	return ResetPasswordCode.findOne(options).then((code) => {
		if (!code) {
			const error = new Error('Code not found.');
			error.status = 404;
			throw error;
		}
		return code;
	});
};

const setUsedResetPasswordCode = (resetPasswordCode, password) => {
	return findResetPasswordCode({
		where: { code: resetPasswordCode },
		attributes: ['id', 'user_id', 'code', 'used']
	})
		.then((code) => {
			if (code.used) {
				throw new Error('Code is already used.');
			}
			return code.update({ used: true }, { fields: ['used'] });
		})
		.then((code) => User.findById(code.user_id))
		.then((user) => user.update({ password }, { fields: ['password'] }));
};

//Here we setup the security checks for the endpoints
//that need it (in our case, only /protected). This
//function will be called every time a request to a protected
//endpoint is received
const verifyToken = (req, authOrSecDef, token, cb, isSocket = false) => {
	const sendError = (msg) => {
		if (isSocket) {
			return new Error(msg);
		} else {
			return req.res.status(403).json({ message: msg });
		}
	};

	if (!req.headers.hasOwnProperty('api-key') && !req.headers.hasOwnProperty('authorization')) {
		return sendError('Bearer or api-key authentication required');
	}

	if (req.headers.hasOwnProperty('api-key') && req.headers.hasOwnProperty('authorization')) {
		return sendError(MULTIPLE_API_KEY);
	} else if (!req.headers.hasOwnProperty('api-key') && req.headers.hasOwnProperty('authorization')) {
		// Swagger endpoint scopes
		const endpointScopes = req.swagger
			? req.swagger.operation['x-security-scopes']
			: BASE_SCOPES;
		const ip = req.headers ? req.headers['x-real-ip'] : undefined;

		//validate the 'Authorization' header. it should have the following format:
		//'Bearer tokenString'
		if (token && token.indexOf('Bearer ') === 0) {
			let tokenString = token.split(' ')[1];

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
						return sendError(
							'User does not have permission to access this service'
						);
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
					return sendError('Invalid Token');
				}
			});
		} else {
			//return the error in the callback if the Authorization header doesn't have the correct format
			return sendError('Missing Header');
		}
	}
};

/*
	HMAC Signature validators consists of check API key, nonce and signature
*/
const checkHmacKey = (req, definition, apiKey, cb, isSocket = false) => {
	const sendError = (error) => {
		if (isSocket) {
			return new Error(error);
		} else {
			return req.res.status(403).json({ message: error });
		}
	};

	// Swagger endpoint scopes
	const endpointScopes = req.swagger ? req.swagger.operation['x-security-scopes'] : BASE_SCOPES;

	const ip = req.headers ? req.headers['x-real-ip'] : undefined;
	const apiSignature = req.headers ? req.headers['api-signature'] : undefined;
	const apiExpires = req.headers ? req.headers['api-expires'] : undefined;

	loggerAuth.verbose('helpers/auth/checkHmacKey ip', ip);

	if (req.headers.hasOwnProperty('api-key') && req.headers.hasOwnProperty('authorization')) {
		return sendError(MULTIPLE_API_KEY);
	} else if (req.headers.hasOwnProperty('api-key') && !req.headers.hasOwnProperty('authorization')) {
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
			checkToken(apiKey)
				.then((token) => {
					if (!token) {
						loggerAuth.error(
							'helpers/auth/checkApiKey/checkToken invalid key',
							apiKey
						);
						return sendError(API_KEY_INVALID);
					} else if (!endpointScopes.includes(token.type)) {
						loggerAuth.error(
							'helpers/auth/checkApiKey/checkToken out of scope',
							apiKey,
							token.type
						);
						return sendError(API_KEY_OUT_OF_SCOPE);
					} else if (new Date(token.expiry) < new Date()) {
						loggerAuth.error(
							'helpers/auth/checkApiKey/checkToken expired key',
							apiKey
						);
						return sendError(API_KEY_EXPIRED);
					} else if (!token.active) {
						loggerAuth.error(
							'helpers/auth/checkApiKey/checkToken inactive',
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
								sub: { id: token.user.id, email: token.user.email }
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

/*
  Function to query the DB to find a verification code by the user email, should take one parameter:

  Param 1(string): user email

  Return a promise with verification code(object).
 */
const findVerificationCodeByUserEmail = (email) => {
	return findUserByEmail(email).then((user) =>
		findVerificationCodeByUserId(user.id)
	);
};

/*
  Function to query the DB to find a verification code by the user id, should take one parameter:

  Param 1(integer): user email

  Return a promise with verification code(object).
 */
const findVerificationCodeByUserId = (user_id) => {
	return VerificationCode.findOne({
		where: { user_id },
		attributes: ['id', 'code', 'verified', 'user_id']
	}).then((verificationCode) => {
		if (verificationCode.verified) {
			throw new Error('User is verified');
		}
		return verificationCode;
	});
};

/*
  Function to query the DB to find the email of a verificationCode, should take one parameter:

  Param 1(string): verification code

  Return a promise with (string) user emal.
 */
const findUserEmailByVerificationCode = (code) => {
	return VerificationCode.findOne({
		where: { code },
		attributes: ['id', 'code', 'verified', 'user_id']
	})
		.then((verificationCode) => {
			if (!verificationCode) {
				throw new Error('Verification Code invalid');
			} else if (verificationCode.verified) {
				throw new Error('Verification Code used');
			}
			return findUser({
				where: { id: verificationCode.user_id },
				attributes: ['email']
			});
		})
		.then((user) => {
			return user.email;
		});
};

module.exports = {
	isValidPassword,
	validatePassword,
	createResetPasswordCode,
	setUsedResetPasswordCode,
	verifyToken,
	checkHmacKey,
	findVerificationCodeByUserEmail,
	findVerificationCodeByUserId,
	findUserEmailByVerificationCode
};
