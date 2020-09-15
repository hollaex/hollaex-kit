'use strict';

const { intersection } = require('lodash');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { loggerAuth } = require('../../config/logger');
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
const toolsLib = require('hollaex-tools-lib');

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
			toolsLib.auth.checkToken(apiKey)
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
						const isSignatureValid = toolsLib.auth.checkHmacSignature(
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

module.exports = {
	verifyToken,
	checkHmacKey
};
