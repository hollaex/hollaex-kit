'use strict';

const jwt = require('jsonwebtoken');
const { intersection } = require('lodash');
const { ACCESS_DENIED, NOT_AUTHORIZED, TOKEN_EXPIRED, INVALID_TOKEN, MISSING_HEADER, DEACTIVATED_USER } = require('./messages');

/**
	* Express middleware function that checks validity of bearer token.
	* @param {string} secret - Secret used to generate token.
	* @param {string} issuer - Issuer of valid tokens.
	* @param {array} frozenUsers - (OPTIONAL) User ids that are deactivated.
	* @param {array} endpointScopes - (OPTIONAL) Valid user scopes for the endpoint.
*/
const verifyBearerToken = (secret, issuer, frozenUsers, endpointScopes) => (req, res, next) => {
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

				if (endpointScopes && intersection(endpointScopes, decodedToken.scopes).length === 0) {
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
	* Function that checks to see if user's scope is valid for the endpoint. Will throw Error if user doesn't have valid scope.
	* @param {array} endpointScopes - Authorized scopes for the endpoint.
	* @param {array} userScopes - Scopes of the user.
*/
const checkScopes = (endpointScopes, userScopes) => {
	if (intersection(endpointScopes, userScopes).length === 0) {
		throw new Error(NOT_AUTHORIZED);
	}
};

/**
	* Function that checks to see if user's account is frozen. Will throw Error if user account is frozen.
	* @param {array} frozenUsers - Ids of frozen users.
	* @param {array} userId - Id of user.
*/
const checkFrozenUser = (frozenUsers, userId) => {
	if (frozenUsers[userId]) {
		throw new Error(DEACTIVATED_USER);
	}
};

module.exports = {
	verifyBearerToken,
	checkScopes,
	checkFrozenUser
};