'use strict';

const jwt = require('jsonwebtoken');

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
}