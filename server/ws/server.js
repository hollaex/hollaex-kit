'use strict';

const WebSocket = require('ws');
const { loggerWebsocket } = require('../config/logger');
const toolsLib = require('hollaex-tools-lib');
const { MULTIPLE_API_KEY } = require('../messages');
const url = require('url');
const { hubConnected } = require('./hub');

const PORT = process.env.WEBSOCKET_PORT || 10080;

const wss = new WebSocket.Server({
	port: PORT,
	verifyClient: (info, next) => {
		try {
			if (!hubConnected()) {
				throw new Error('Hub websocket is disconnected');
			}

			const query = url.parse(info.req.url, true).query;
			const bearerToken = query.authorization;
			const hmacKey = query['api-key'];
			info.req.auth = {};
			if (bearerToken && hmacKey) {
				// throw error if both bearer and hmac authentication methods are given
				loggerWebsocket.error('ws/server', MULTIPLE_API_KEY);
				return next(false, 400, MULTIPLE_API_KEY);
			} else if (bearerToken) {
				// Function will set req.auth to authenticated token object if successful
				info.req.headers.authorization = bearerToken;
				toolsLib.security.verifyBearerTokenMiddleware(info.req, null, bearerToken, (err) => {
					if (err) {
						loggerWebsocket.error('ws/server', err);
						return next(false, 403, err.message);
					} else {
						return next(true);
					}
				}, true);
			} else if (hmacKey) {
				info.req.headers['api-key'] = hmacKey;
				info.req.headers['api-signature'] = query['api-signature'];
				info.req.headers['api-expires'] = query['api-expires'];
				info.req.method = 'CONNECT';
				info.req.originalUrl = '/stream';
				// Function will set req.auth to authenticated token object if successful
				toolsLib.security.verifyHmacTokenMiddleware(info.req, null, hmacKey, (err) => {
					if (err) {
						loggerWebsocket.error('ws/server', err);
						return next(false, 403, err.message);
					} else {
						return next(true);
					}
				}, true);
			} else {
				// No authentication given so req.auth is empty
				return next(true);
			}
		} catch (err) {
			loggerWebsocket.error('ws/server/catch', err.message);
			return next(false, 400, err.message);
		}
	}
});
loggerWebsocket.verbose(`Ẃebsocket server listening on port: ${PORT}`);


module.exports = wss;
