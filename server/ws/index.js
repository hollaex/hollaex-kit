'use strict';

const wss = require('./server');
const uuid = require('uuid/v4');
const { loggerWebsocket } = require('../config/logger');
const {
	WS_EMPTY_MESSAGE,
	WS_WRONG_INPUT,
	WS_WELCOME,
	WS_UNSUPPORTED_OPERATION,
	WS_USER_AUTHENTICATED,
	WS_MISSING_HEADER
} = require('../messages');
const { initializeTopic, terminateTopic, authorizeUser, terminateClosedChannels, handleChatData, handleP2pData } = require('./sub');
const { connect, hubConnected } = require('./hub');
const { setWsHeartbeat } = require('ws-heartbeat/server');
const WebSocket = require('ws');

const clientMessageCounts = new Map();
const RATE_LIMIT_WINDOW_MS = 3000;
const MAX_MESSAGES_PER_WINDOW = parseInt(process.env.WEBSOCKET_MAX_MESSAGES_PER_SECOND, 10) || 20;

wss.on('connection', (ws, req) => {
	// attaching unique id and authorization to the socket
	ws.id = uuid();
	ws.auth = req.auth;

	if (ws.readyState === WebSocket.OPEN) {
		// send welcome message
		ws.send(JSON.stringify({ message: WS_WELCOME }));

		// send authenticated message if authenticated
		if (ws.auth.sub) {
			ws.send(JSON.stringify({ message: WS_USER_AUTHENTICATED(ws.auth.sub.email) }));
		}
	}

	ws.on('message', (message) => {
		try {
			// throw error if empty message
			if (!message || message.length === 0) {
				throw new Error(WS_EMPTY_MESSAGE);
			}

			try {
				message = JSON.parse(message);
			} catch (err) {
				throw new Error(WS_WRONG_INPUT);
			}

			if (!message || typeof message !== 'object' || Array.isArray(message)) {
				throw new Error(WS_WRONG_INPUT);
			}

			const { op, args } = message;

			// Rate limit: exclude ping (keepalive) from counting
			if (op !== 'ping') {
				const now = Date.now();
				let clientData = clientMessageCounts.get(ws.id) || { count: 0, timestamp: now };

				if (now - clientData.timestamp >= RATE_LIMIT_WINDOW_MS) {
					clientData = { count: 0, timestamp: now };
				}
				clientData.count += 1;

				if (clientData.count > MAX_MESSAGES_PER_WINDOW) {
					throw new Error(`Error: Rate limit exceeded for ${ws.id}. Please slow down. Maximum ${MAX_MESSAGES_PER_WINDOW} messages per ${RATE_LIMIT_WINDOW_MS / 1000} seconds. Your current rate: ${clientData.count}`);
				}

				clientMessageCounts.set(ws.id, clientData);
			}

			if (op === 'ping') {
				ws.send(JSON.stringify({ message: 'pong' }));
			} else if (op === 'subscribe') {
				if (!Array.isArray(args)) {
					throw new Error(WS_WRONG_INPUT);
				}
				loggerWebsocket.info(ws.id, 'ws/index/message', message);
				args.forEach((arg) => {
					let [topic, symbol] = arg.split(':');
					initializeTopic(topic, ws, symbol);
				});
			} else if (op === 'unsubscribe') {
				if (!Array.isArray(args)) {
					throw new Error(WS_WRONG_INPUT);
				}
				loggerWebsocket.info(ws.id, 'ws/index/message', message);
				args.forEach((arg) => {
					let [topic, symbol] = arg.split(':');
					terminateTopic(topic, ws, symbol);
				});
			} else if (op === 'auth') {
				loggerWebsocket.info(ws.id, 'ws/index/message auth');
				const credentials = args && Array.isArray(args) ? args[0] : undefined;
				if (!credentials || typeof credentials !== 'object') {
					throw new Error(WS_MISSING_HEADER);
				}
				const ip = req.headers['x-real-ip'];
				authorizeUser(credentials, ws, ip).catch((err) => {
					loggerWebsocket.error(ws.id, 'ws/index/auth catch', err.message);
					if (ws.readyState === WebSocket.OPEN) {
						ws.send(JSON.stringify({ error: err.message || WS_WRONG_INPUT }));
					}
				});
			} else if (op === 'chat') {
				if (!Array.isArray(args)) {
					throw new Error(WS_WRONG_INPUT);
				}
				loggerWebsocket.info(ws.id, 'ws/index/message', message);
				args.forEach((arg) => {
					const { action, data } = arg;
					handleChatData(action, ws, data);
				});
			} 
			else if (op === 'p2pChat') {
				if (!Array.isArray(args)) {
					throw new Error(WS_WRONG_INPUT);
				}
				loggerWebsocket.info(ws.id, 'ws/index/message', message);
				args.forEach((arg) => {
					const { action, data } = arg;
					handleP2pData(action, ws, data);
				});
			} else {
				throw new Error(WS_UNSUPPORTED_OPERATION);
			}
		} catch (err) {
			if (err && err.message) {
				loggerWebsocket.error(ws.id, 'ws/index/message catch', err.message);
				ws.send(JSON.stringify({ error: err.message }));
			} else {
				loggerWebsocket.error(ws.id, 'ws/index/message catch', err);
				ws.send(JSON.stringify({ error: WS_WRONG_INPUT }));
			}
		}
	});

	ws.on('close', () => {
		clientMessageCounts.delete(ws.id);
		if (hubConnected()) {
			terminateClosedChannels(ws);
		}
	});
});

// If no message received within a minute, close connection
setWsHeartbeat(wss, () => {}, 60000);

connect();