'use strict';

const jwt = require('jsonwebtoken');
const { SECRET, ISSUER } = require('../../constants');
const { intersection } = require('lodash');
const { ACCESS_DENIED, NOT_AUTHORIZED, TOKEN_EXPIRED, INVALID_TOKEN, MISSING_HEADER } = require('./messages');

/**
	* Middleware function used for verifying tokens being passed by client in Authorization header. Format: Bearer <token>
*/
const verifyToken = (req, res, next) => {
	const sendError = (msg) => {
		return req.res.status(403).json({ message: ACCESS_DENIED(msg)});
	};

	const token = req.headers['authorization'];

	if (token && token.indexOf('Bearer ') === 0) {
		let tokenString = token.split(' ')[1];

		jwt.verify(tokenString, SECRET, (verificationError, decodedToken) => {
			if (!verificationError && decodedToken) {

				const issuerMatch = decodedToken.iss == ISSUER;

				if (issuerMatch) {
					req.auth = decodedToken;
					next();
				} else {
					sendError(TOKEN_EXPIRED);
				}
			} else {
				sendError(INVALID_TOKEN);
			}
		});
	} else {
		sendError(MISSING_HEADER);
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

module.exports = {
	verifyToken,
	checkScopes
};