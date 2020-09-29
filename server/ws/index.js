
const wss = require('./server');
const uuid = require('uuid/v4');
const { loggerWebsocket } = require('../config/logger');
const {
	WS_EMPTY_MESSAGE,
	WS_WRONG_INPUT,
	WS_WELCOME,
	WS_UNSUPPORTED_OPERATION,
	WS_USER_AUTHENTICATED
} = require('../messages');
const { initializeTopic, terminateTopic, authorizeUser } = require('./sub');
const { connect } = require('./hub');

wss.on('connection', (ws, req) => {
	// attaching unique id and authorization to the socket
	ws.id = uuid();
	ws.auth = req.auth;

	// send welcome message
	ws.send(JSON.stringify({ message: WS_WELCOME }));

	// send authenticated message if authenticated
	if (ws.auth.sub) {
		ws.send(JSON.stringify({ message: WS_USER_AUTHENTICATED(ws.auth.sub.email) }));
	}

	ws.on('message', async (message) => {
		try {
			loggerWebsocket.info('ws/index/message', message);

			// throw error if empty message
			if (!message || message.length === 0) {
				throw new Error(WS_EMPTY_MESSAGE);
			}

			if (message === 'ping') {
				ws.send('pong');
			} else {
				message = JSON.parse(message);
				const { op, args } = message;
				if (op === 'subscribe') {
					args.forEach(arg => {
						let [topic, symbol] = arg.split(':');
						initializeTopic(topic, ws, symbol);
					});
				} else if (op === 'unsubscribe') {
					args.forEach(arg => {
						let [topic, symbol] = arg.split(':');
						terminateTopic(topic, ws, symbol);
					});
				} else if (op === 'auth') {
					const credentials = args[0];
					const ip = req.socket ? req.socket.remoteAddress : undefined;
					authorizeUser(credentials, ws, ip);
				} else {
					throw new Error(WS_UNSUPPORTED_OPERATION);
				}
			}
		} catch (err) {
			if (err && err.message) {
				loggerWebsocket.error('ws/index/message catch', err.message);
				ws.send(JSON.stringify({ error: err.message}));
			} else {
				loggerWebsocket.error('ws/index/message catch', err);
				ws.send(JSON.stringify({ error: WS_WRONG_INPUT}));
			}
		}
	});
});

connect();