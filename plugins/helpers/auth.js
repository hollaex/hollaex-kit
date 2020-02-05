'use strict';

const jwt = require('jsonwebtoken');
const { SECRET, ISSUER, TOKEN_TIME } = require('../constants');
const { intersection } = require('lodash');

/**
	* Middleware function used for verifying tokens being passed by client in Authorization header. Format: Bearer <token>
*/
const verifyToken = (req, res, next) => {
	const sendError = (msg) => {
		res.json({ message: `Access Denied: ${msg}`});
	};

	const token = req.headers['authorization'];

	if (token && token.indexOf('Bearer ') === 0) {
		let tokenString = token.split(' ')[1];

		jwt.verify(tokenString, SECRET, (verificationError, decodedToken) => {
			if (!verificationError && decodedToken) {

				const issuerMatch = decodedToken.iss == ISSUER;
				const dateMatch = Date.now() - decodedToken.expiry < TOKEN_TIME;

				if (dateMatch && issuerMatch) {
					req.auth = decodedToken;
					next();
				} else {
					sendError('Token is expired');
				}
			} else {
				sendError('Invalid Token');
			}
		});
	} else {
		sendError('Missing Header');
	}
};

/**
	* Function that checks to see if user's scope is valid for the endpoint. Will throw Error if user doesn't have valid scope.
	* @param {array} endpointScopes - Authorized scopes for the endpoint.
	* @param {array} userScopes - Scopes of the user.
*/
const checkScopes = (endpointScopes, userScopes) => {
	if (intersection(endpointScopes, userScopes).length === 0) {
		throw new Error('Not Authorized');
	}
};

module.exports = {
	verifyToken,
	checkScopes
};