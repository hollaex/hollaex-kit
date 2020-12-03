'use strict';

const jwt = require('jsonwebtoken');
const { SECRET, ISSUER, GET_FROZEN_USERS } = require('../../constants');
const { intersection } = require('lodash');
const { ACCESS_DENIED, TOKEN_EXPIRED, INVALID_TOKEN, MISSING_HEADER, DEACTIVATED_USER } = require('./messages');

/**
	* Middleware function used for verifying tokens being passed by client in Authorization header. Format: Bearer <token>
*/
const verifyToken = (req, res, next) => {
	const sendError = (msg) => {
		return req.res.status(403).json({ message: ACCESS_DENIED(msg) });
	};

	const token = req.headers['authorization'];

	if (token && token.indexOf('Bearer ') === 0) {
		let tokenString = token.split(' ')[1];

		jwt.verify(tokenString, SECRET, (verificationError, decodedToken) => {
			if (!verificationError && decodedToken) {

				const issuerMatch = decodedToken.iss == ISSUER;

				if (!issuerMatch) {
					return sendError(TOKEN_EXPIRED);
				}

				if (GET_FROZEN_USERS()[decodedToken.sub.id]) {
					return sendError(DEACTIVATED_USER);
				} else {
					req.auth = decodedToken;
					return next();
				}
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
		return false;
	} else {
		return true;
	}
};

module.exports = {
	verifyToken,
	checkScopes
};