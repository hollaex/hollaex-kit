
const wss = require('./server');
const uuid = require('uuid/v4');
const { subscriber } = require('../db/pubsub');
const { loggerWebsocket } = require('../config/logger');
const { publishPublicOrderbookFromDB, publishPublicTrades } = require('./utils');
const {
	WEBSOCKET_CHANNEL,
} = require('../constants');

const {
	WS_EMPTY_MESSAGE,
	WS_WRONG_CHANNEL_FROMAT,
	WS_EXCHANGE_NOT_SUPPORTED,
	WS_EVENT_NOT_SUPPORTED,
	WS_WRONG_INPUT,
	WS_WELCOME,
	WS_UNSUPPORTED_OPERATION
} = require('../messages');

// // PUBLIC SOCKET
// const publicSocket = io.of(WEBSOCKET_PUBLIC_CHANNEL);
// initializePublicWS(publicSocket);

// // USER PRIVATE SOCKET
// const user = io.of(WEBSOCKET_USER_CHANNEL);
// initializeUserWS(user);

// message: {'op; 'subscribe/unsubscribe', args: []}

wss.on('connection', (ws) => {
	ws.id = uuid(); // attaching unique id to the socket
	ws.auth = {}// user is authenticated
	ws.send(JSON.stringify({ message: WS_WELCOME}));

	ws.on('message', (message) => {
		try {
			loggerWebsocket.info('ws/index/message', message);
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
						switch(topic) {
							case 'orderbook':
								// initializeOrderbook(ws, symbol);
								break;
							case 'trade':
								// initializeTrade(ws, symbol);
								break;
							case 'wallet':
								break;
							case 'order':
								break;
							case 'userTrade':
								break;
							default:
								break;
						}
					});


				} else if (op === 'unsubscribe') {
					// TODO
				} else if (op === 'auth') {
					// set authentication
				} else {
					throw new Error(WS_UNSUPPORTED_OPERATION);
				}
			}
		} catch (err) {
			if (err && err.message) {
				ws.send(JSON.stringify({ error: err.message}));
			} else {
				loggerWebsocket.error('ws/index/message catch', err);
				ws.send(JSON.stringify({ error: WS_WRONG_INPUT}));
			}
		}
	});
});