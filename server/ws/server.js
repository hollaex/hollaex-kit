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
const url = require('url');
const { set } = require('lodash');
const { loggerWebsocket } = require('../config/logger');
const { checkHmacKey } = require('../api/helpers/auth');

const PORT = process.env.WEBSOCKET_PORT || 10080;

const wss = new WebSocket.Server({
	port: PORT,
	// check for beaerer/hmac, if so, authenticate
	verifyClient: (info, next) => {
		try {
			const key = info.req.headers['api-key'];
			info.req.method = 'CONNECT';
			info.req.originalUrl = '/stream';
			if (!key) {
				return next(false, 403, 'Unauthorized');
			}
			// check type
			checkHmacKey(info.req, null, key, (err) => {
				if (err) {
					loggerWebsocket.error('ws/server', err);
					return next(false, 400, err.message);
				}
				return next(true);
			}, true);
		} catch (err) {
			loggerWebsocket.error('ws/server/catch', err);
			return next(false, 400, 'Wrong format. Follow /stream?exchange_id=<exchangeId> format');
		}
	}
});
loggerWebsocket.verbose(`Ẃebsocket server listening on port: ${PORT}`);


module.exports = wss;
