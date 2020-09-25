// 'use strict';

// const { createServer } = require('http');
// const SockerIO = require('socket.io');
// const redis = require('socket.io-redis');
// const config = require('../config/redis');
// const { loggerWebsocket } = require('../config/logger');



// const PORT = process.env.WEBSOCKET_PORT || 10080;

// const server = createServer();

// const io = new SockerIO(server);

// const adapter = redis(config.redis);

// adapter.pubClient.on('error', (err) => {
// 	loggerWebsocket.error('Error in PubClient');
// 	loggerWebsocket.error(err);
// });

// adapter.subClient.on('error', (err) => {
// 	loggerWebsocket.error('Error in SubClient');
// 	loggerWebsocket.error(err);
// });

// io.adapter(adapter);

// server.listen(PORT, () => {
// 	loggerWebsocket.debug(`Ẃebsocket server listening on port: ${PORT}`);
// });

// server.on('error', (error) => {
// 	loggerWebsocket.error(error);
// });

// module.exports = io;

'use strict';

const WebSocket = require('ws');
const { loggerWebsocket } = require('../config/logger');
const toolsLib = require('hollaex-tools-lib');
const { MULTIPLE_API_KEY } = require('../messages');

const PORT = process.env.WEBSOCKET_PORT || 10080;

const wss = new WebSocket.Server({
	port: PORT,
	verifyClient: (info, next) => {
		try {
			info.req.auth = {};
			const bearerToken = info.req.headers.authorization;
			const hmacKey = info.req.headers['api-key'];
			if (bearerToken && hmacKey) {
				// throw error if both bearer and hmac authentication methods are given
				loggerWebsocket.error('ws/server', MULTIPLE_API_KEY);
				return next(false, 400, MULTIPLE_API_KEY);
			} else if (bearerToken) {
				// Function will set req.auth to authenticated token object if successful
				toolsLib.auth.verifyBearerTokenMiddleware(info.req, null, bearerToken, (err) => {
					if (err) {
						loggerWebsocket.error('ws/server', err);
						return next(false, 403, err.message);
					} else {
						return next(true);
					}
				}, true);
			} else if (hmacKey) {
				info.req.method = 'CONNECT';
				info.req.originalUrl = '/stream';
				// Function will set req.auth to authenticated token object if successful
				toolsLib.auth.verifyHmacTokenMiddleware(info.req, null, hmacKey, (err) => {
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
			loggerWebsocket.error('ws/server/catch', err);
			return next(false, 400, 'Wrong format. Follow /stream?exchange_id=<exchangeId> format');
		}
	}
});
loggerWebsocket.verbose(`Ẃebsocket server listening on port: ${PORT}`);


module.exports = wss;
