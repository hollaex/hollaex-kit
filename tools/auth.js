'use strict';

const jwt = require('jsonwebtoken');
const { intersection } = require('lodash');
const {
	ACCESS_DENIED,
	NOT_AUTHORIZED,
	TOKEN_EXPIRED,
	INVALID_TOKEN,
	MISSING_HEADER,
	DEACTIVATED_USER,
	INVALID_CAPTCHA
} = require('../messages');
const { SERVER_PATH } = require('../constant');
const { NODE_ENV, CAPTCHA_ENDPOINT } = require(`${SERVER_PATH}/constants`);
const rp = require('request-promse');
const { getKitSecrets } = require('./common');

/**
 * Express middleware function that checks validity of bearer token.
 * @param {string} secret - Secret used to generate token.
 * @param {string} issuer - Issuer of valid tokens.
 * @param {array} frozenUsers - (OPTIONAL) User ids that are deactivated.
 * @param {array} endpointScopes - (OPTIONAL) Valid user scopes for the endpoint.
 */
const verifyBearerToken = (secret, issuer, frozenUsers, endpointScopes) => (
	req,
	res,
	next
) => {
	const sendError = (msg) => {
		return req.res.status(403).json({ message: ACCESS_DENIED(msg) });
	};

	const token = req.headers['authorization'];

	if (token && token.indexOf('Bearer ') === 0) {
		let tokenString = token.split(' ')[1];

		jwt.verify(tokenString, secret, (verificationError, decodedToken) => {
			if (!verificationError && decodedToken) {
				const issuerMatch = decodedToken.iss == issuer;

				if (!issuerMatch) {
					return sendError(TOKEN_EXPIRED);
				}

				if (frozenUsers && frozenUsers[decodedToken.sub.id]) {
					return sendError(DEACTIVATED_USER);
				}

				if (
					endpointScopes &&
					intersection(endpointScopes, decodedToken.scopes).length === 0
				) {
					return sendError(NOT_AUTHORIZED);
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
			throw new Error(INVALID_CAPTCHA);
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

module.exports = {
	verifyBearerToken,
	userScopeIsValid,
	userIsDeactivated,
	checkCaptcha
};
