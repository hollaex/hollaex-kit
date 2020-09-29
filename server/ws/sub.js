'use strict';

const { addSubscriber, removeSubscriber, getChannels } = require('./channel');
const { WEBSOCKET_CHANNEL } = require('../constants');
const { each, size } = require('lodash');
const toolsLib = require('hollaex-tools-lib');
const {
	WS_AUTHENTICATION_REQUIRED,
	WS_USER_AUTHENTICATED,
	MULTIPLE_API_KEY,
	WS_ALREADY_AUTHENTICATED,
	WS_MISSING_HEADER,
	WS_INVALID_TOPIC
} = require('../messages');

let publicData = {
	orderbook: {},
	trades: {}
};

const initializeTopic = (topic, ws, symbol) => {
	switch (topic) {
		case 'orderbook':
		case 'trades':
			if (symbol) {
				addSubscriber(WEBSOCKET_CHANNEL(topic, symbol), ws);
				ws.send(JSON.stringify(publicData[topic][symbol]));
			} else {
				each(toolsLib.getKitPairs(), (pair) => {
					addSubscriber(WEBSOCKET_CHANNEL(topic, pair), ws);
					ws.send(JSON.stringify(publicData[topic][pair]));
				});
			}
			break;
		case 'order':
		case 'wallet':
		case 'userTrade':
			if (!ws.auth.sub) { // throw unauthenticated error if req.auth.sub does not exist
				throw new Error(WS_AUTHENTICATION_REQUIRED);
			}
			if (size(getChannels(WEBSOCKET_CHANNEL(topic, ws.auth.sub.networkId))) === 0) {
				addSubscriber(WEBSOCKET_CHANNEL(topic, ws.auth.sub.networkId), ws);
				require('./hub').sendNetworkWsMessage('subscribe', topic, ws.auth.sub.networkId);
			} else {
				addSubscriber(WEBSOCKET_CHANNEL(topic, ws.auth.sub.networkId), ws);
			}
			break;
		default:
			throw new Error(WS_INVALID_TOPIC(topic));
	}
};

const terminateTopic = (topic, ws, symbol) => {
	switch (topic) {
		case 'orderbook':
		case 'trades':
			if (symbol) {
				removeSubscriber(WEBSOCKET_CHANNEL(topic, symbol), ws);
				ws.send(JSON.stringify({ message: `Unsubscribed from channel ${topic}:${symbol}`}));
			} else {
				each(toolsLib.getKitPairs(), (pair) => {
					addSubscriber(WEBSOCKET_CHANNEL(topic, pair), ws);
					ws.send(JSON.stringify(publicData[topic][pair]));
				});
				ws.send(JSON.stringify({ message: `Unsubscribed from channel ${topic}`}));
			}
			break;
		case 'order':
		case 'wallet':
		case 'userTrade':
			if (!ws.auth.sub) { // throw unauthenticated error if req.auth.sub does not exist
				throw new Error(WS_AUTHENTICATION_REQUIRED);
			}
			removeSubscriber(WEBSOCKET_CHANNEL(topic, ws.auth.sub.networkId), ws);
			if (size(getChannels(WEBSOCKET_CHANNEL(topic, ws.auth.sub.networkId))) === 0) {
				require('./hub').sendNetworkWsMessage('unsubscribe', topic, ws.auth.sub.networkId);
			}
			ws.send(JSON.stringify({ message: `Unsubscribed from channel ${topic}`}));
			break;
		default:
			throw new Error(WS_INVALID_TOPIC(topic));
	}
};

const authorizeUser = async (credentials, ws, ip) => {
	// throw error if user is already authenticated
	if (ws.auth.sub) {
		throw new Error(WS_ALREADY_AUTHENTICATED);
	}

	// first element in args array should be object with credentials
	const bearerToken = credentials.authorization;
	const hmacKey = credentials['api-key'];

	if (bearerToken && hmacKey) { // throw error if both authentication methods are given
		throw new Error(MULTIPLE_API_KEY);
	} else if (bearerToken) {

		// get authenticated user data and set as ws.auth.
		// Function will throw an error if there is an issue which will be caught below
		const auth = await toolsLib.auth.verifyBearerTokenPromise(bearerToken, ip);

		// If authentication was successful, set ws.auth to new auth object and send authenticated message
		ws.auth = auth;
		ws.send(JSON.stringify({ message: WS_USER_AUTHENTICATED(ws.auth.sub.email) }));
	} else if (hmacKey) {
		const apiSignature = credentials['api-signature'];
		const apiExpires = credentials['api-expires'];
		const method = 'CONNECT';
		const url = '/stream';

		// get authenticated user data and set as ws.auth.
		// Function will throw an error if there is an issue which will be caught below
		const auth = await toolsLib.auth.verifyHmacTokenPromise(hmacKey, apiSignature, apiExpires, method, url);

		// If authentication was successful, set ws.auth to new auth object and send authenticated message
		ws.auth = auth;
		ws.send(JSON.stringify({ message: WS_USER_AUTHENTICATED(ws.auth.sub.email) }));
	} else {
		// throw error if bearer and hmac token are missing
		throw new Error(WS_MISSING_HEADER);
	}
};

const terminateClosedChannels = (ws) => {
	if (ws.auth.sub) {
		removeSubscriber(WEBSOCKET_CHANNEL('order', ws.auth.sub.networkId), ws);
		if (size(getChannels()[WEBSOCKET_CHANNEL('order', ws.auth.sub.networkId)]) === 0) {
			require('./hub').sendNetworkWsMessage('unsubscribe', 'order', ws.auth.sub.networkId);
		}

		removeSubscriber(WEBSOCKET_CHANNEL('wallet', ws.auth.sub.networkId), ws);
		if (size(getChannels()[WEBSOCKET_CHANNEL('wallet', ws.auth.sub.networkId)]) === 0) {
			require('./hub').sendNetworkWsMessage('unsubscribe', 'wallet', ws.auth.sub.networkId);
		}

		removeSubscriber(WEBSOCKET_CHANNEL('userTrade', ws.auth.sub.networkId), ws);
		if (size(getChannels()[WEBSOCKET_CHANNEL('userTrade', ws.auth.sub.networkId)]) === 0) {
			require('./hub').sendNetworkWsMessage('unsubscribe', 'userTrade', ws.auth.sub.networkId);
		}
	}
};

const handleHubData = (data) => {
	switch (data.topic) {
		case 'orderbook':
			publicData[data.topic][data.symbol] = { ...data, action: 'parital' };

			each(getChannels()[WEBSOCKET_CHANNEL(data.topic, data.symbol)], (ws) => {
				ws.send(JSON.stringify(data));
			});
			break;
		case 'trades':
			if (data.action === 'partial') {
				publicData[data.topic][data.symbol] = data;
			} else {
				const updatedTrades = data[data.symbol].concat(publicData[data.topic][data.symbol][data.symbol]);
				publicData[data.topic][data.symbol][data.symbol] = updatedTrades.length <= 50 ? updatedTrades : updatedTrades.slice(0, 50);
			}
			each(getChannels()[WEBSOCKET_CHANNEL(data.topic, data.symbol)], (ws) => {
				ws.send(JSON.stringify(data));
			});
			break;
		case 'order':
		case 'wallet':
		case 'userTrade':
			each(getChannels()[WEBSOCKET_CHANNEL(data.topic, data.user_id)], (ws) => {
				ws.send(JSON.stringify(data));
			});
			break;
		default:
			break;
	}
};

module.exports = {
	initializeTopic,
	terminateTopic,
	handleHubData,
	authorizeUser,
	terminateClosedChannels
};
