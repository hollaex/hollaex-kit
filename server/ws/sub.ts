'use strict';

import WebSocket from 'ws';
import { getPublicData } from './publicData';
import { addSubscriber, removeSubscriber, getChannels } from './channel';
import {
	WEBSOCKET_CHANNEL,
	WS_PUBSUB_DEPOSIT_CHANNEL,
	WS_PUBSUB_WITHDRAWAL_CHANNEL,
	ROLES
} from '../constants';
import { each } from 'lodash';
import toolsLib from 'hollaex-tools-lib';
import { loggerWebsocket } from '../config/logger';
import {
	WS_AUTHENTICATION_REQUIRED,
	WS_USER_AUTHENTICATED,
	MULTIPLE_API_KEY,
	WS_ALREADY_AUTHENTICATED,
	WS_MISSING_HEADER,
	WS_INVALID_TOPIC,
	NOT_AUTHORIZED
} from '../messages';
import { subscriber } from '../db/pubsub';
import { sendInitialMessages, addMessage, deleteMessage } from './chat';
import { getUsername, changeUsername } from './chat/username';
import { sendBannedUsers, banUser, unbanUser } from './chat/ban';
import { sendNetworkWsMessage } from './hub';

subscriber.subscribe(WS_PUBSUB_DEPOSIT_CHANNEL);
subscriber.subscribe(WS_PUBSUB_WITHDRAWAL_CHANNEL);

subscriber.on('message', (channel, data) => {
	if (channel === WS_PUBSUB_DEPOSIT_CHANNEL) {
		try {
			data = JSON.parse(data);
			handleDepositWithdrawalData(data);
			notifyAdmin(data)
		} catch (err) {
			loggerWebsocket.error('ws/sub/subscriber deposit message', err.message);
		}
	} else if (channel === WS_PUBSUB_WITHDRAWAL_CHANNEL) {
		try {
			data = JSON.parse(data);
			handleDepositWithdrawalData(data);
			notifyAdmin(data)
		} catch (err) {
			loggerWebsocket.error('ws/sub/subscriber withdrawal message', err.message);
		}
	}
});

const initializeTopic = (topic, ws, symbol) => {
	switch (topic) {
		case 'orderbook':
		case 'trade':
			if (symbol) {
				if (!toolsLib.subscribedToPair(symbol)) {
					throw new Error('Invalid symbol');
				}
				addSubscriber(WEBSOCKET_CHANNEL(topic, symbol), ws);
				if (getPublicData()[topic][symbol]) {
					ws.send(JSON.stringify(getPublicData()[topic][symbol]));
				}
			} else {
				each(toolsLib.getKitPairs(), (pair) => {
					try {
						addSubscriber(WEBSOCKET_CHANNEL(topic, pair), ws);
						if (getPublicData()[topic][pair]) {
							ws.send(JSON.stringify(getPublicData()[topic][pair]));
						}
					} catch (err) {
						ws.send(JSON.stringify({ message: err.message }));
					}
				});
			}
			break;
		case 'order':
		case 'usertrade':
		case 'wallet':
			if (!ws.auth.sub) { // throw unauthenticated error if req.auth.sub does not exist
				throw new Error(WS_AUTHENTICATION_REQUIRED);
			}
			if (!getChannels()[WEBSOCKET_CHANNEL(topic, ws.auth.sub.networkId)]) {
				addSubscriber(WEBSOCKET_CHANNEL(topic, ws.auth.sub.networkId), ws);
				sendNetworkWsMessage('subscribe', topic, ws.auth.sub.networkId);
			} else {
				sendNetworkWsMessage('unsubscribe', topic, ws.auth.sub.networkId);
				addSubscriber(WEBSOCKET_CHANNEL(topic, ws.auth.sub.networkId), ws);
				sendNetworkWsMessage('subscribe', topic, ws.auth.sub.networkId);
			}
			break;
		case 'deposit':
			if (!ws.auth.sub) { // throw unauthenticated error if req.auth.sub does not exist
				throw new Error(WS_AUTHENTICATION_REQUIRED);
			}
			addSubscriber(WEBSOCKET_CHANNEL(topic, ws.auth.sub.networkId), ws);
			break;
		case 'withdrawal':
			if (!ws.auth.sub) { // throw unauthenticated error if req.auth.sub does not exist
				throw new Error(WS_AUTHENTICATION_REQUIRED);
			}
			addSubscriber(WEBSOCKET_CHANNEL(topic, ws.auth.sub.networkId), ws);
			break;
		case 'chat':
			addSubscriber(WEBSOCKET_CHANNEL(topic, undefined), ws);
			sendInitialMessages(ws);
			break;
		case 'admin':
			// this channel can only be subscribed by the exchange admin
			if (!ws.auth.sub) {
				throw new Error(WS_AUTHENTICATION_REQUIRED);
			}
			if (!ws.auth.scopes.includes(ROLES.ADMIN)) {
				loggerWebsocket.verbose(ws.id, 'ws/sub/initializeTopic abuse admin', ws.auth);
				throw new Error(NOT_AUTHORIZED);
			}
			loggerWebsocket.verbose(ws.id, 'ws/sub/initializeTopic admin', ws.auth);
			addSubscriber(WEBSOCKET_CHANNEL(topic, undefined), ws);

			break;
		default:
			throw new Error(WS_INVALID_TOPIC(topic));
	}
};

const terminateTopic = (topic, ws, symbol) => {
	switch (topic) {
		case 'orderbook':
		case 'trade':
			if (symbol) {
				if (!toolsLib.subscribedToPair(symbol)) {
					throw new Error('Invalid symbol');
				}
				removeSubscriber(WEBSOCKET_CHANNEL(topic, symbol), ws);
				ws.send(JSON.stringify({ message: `Unsubscribed from channel ${topic}:${symbol}` }));
			} else {
				each(toolsLib.getKitPairs(), (pair) => {
					try {
						removeSubscriber(WEBSOCKET_CHANNEL(topic, pair), ws);
						ws.send(JSON.stringify({ message: `Unsubscribed from channel ${topic}:${symbol}` }));
					} catch (err) {
						ws.send(JSON.stringify({ message: err.message }));
					}
				});
			}
			break;
		case 'order':
		case 'usertrade':
		case 'wallet':
			if (!ws.auth.sub) { // throw unauthenticated error if req.auth.sub does not exist
				throw new Error(WS_AUTHENTICATION_REQUIRED);
			}
			removeSubscriber(WEBSOCKET_CHANNEL(topic, ws.auth.sub.networkId), ws, 'private');
			if (!getChannels()[WEBSOCKET_CHANNEL(topic, ws.auth.sub.networkId)]) {
				sendNetworkWsMessage('unsubscribe', topic, ws.auth.sub.networkId);
			}
			ws.send(JSON.stringify({ message: `Unsubscribed from channel ${topic}:${ws.auth.sub.networkId}` }));
			break;
		case 'deposit':
			if (!ws.auth.sub) { // throw unauthenticated error if req.auth.sub does not exist
				throw new Error(WS_AUTHENTICATION_REQUIRED);
			}
			removeSubscriber(WEBSOCKET_CHANNEL(topic, ws.auth.sub.networkId), ws, 'private');
			ws.send(JSON.stringify({ message: `Unsubscribed from channel ${topic}:${ws.auth.sub.networkId}` }));
			break;
		case 'withdrawal':
			if (!ws.auth.sub) { // throw unauthenticated error if req.auth.sub does not exist
				throw new Error(WS_AUTHENTICATION_REQUIRED);
			}
			removeSubscriber(WEBSOCKET_CHANNEL(topic, ws.auth.sub.networkId), ws, 'private');
			ws.send(JSON.stringify({ message: `Unsubscribed from channel ${topic}:${ws.auth.sub.networkId}` }));
			break;
		case 'chat':
			removeSubscriber(WEBSOCKET_CHANNEL(topic, undefined), ws);
			ws.send(JSON.stringify({ message: `Unsubscribed from channel ${topic}:${ws.auth.sub.id}` }));
			break;
		case 'admin':
			if (!ws.auth.sub) {
				throw new Error(WS_AUTHENTICATION_REQUIRED);
			}
			removeSubscriber(WEBSOCKET_CHANNEL(topic, undefined), ws, 'private');
			ws.send(JSON.stringify({ message: `Unsubscribed from channel ${topic}` }));
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
		const auth = await toolsLib.security.verifyBearerTokenPromise(bearerToken, ip);

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
		const auth = await toolsLib.security.verifyHmacTokenPromise(hmacKey, apiSignature, apiExpires, method, url, undefined, undefined);

		// If authentication was successful, set ws.auth to new auth object and send authenticated message
		ws.auth = auth;
		ws.send(JSON.stringify({ message: WS_USER_AUTHENTICATED(ws.auth.sub.email) }));
	} else {
		// throw error if bearer and hmac token are missing
		throw new Error(WS_MISSING_HEADER);
	}
};

const terminateClosedChannels = (ws) => {
	try {
		removeSubscriber(WEBSOCKET_CHANNEL('chat', undefined), ws);
	} catch (err) {
		loggerWebsocket.debug(ws.id, 'ws/sub/terminateClosedChannels', err.message);
	}

	each(toolsLib.getKitPairs(), (pair) => {
		try {
			removeSubscriber(WEBSOCKET_CHANNEL('orderbook', pair), ws);
		} catch (err) {
			loggerWebsocket.debug(ws.id, 'ws/sub/terminateClosedChannels', err.message);
		}

		try {
			removeSubscriber(WEBSOCKET_CHANNEL('trade', pair), ws);
		} catch (err) {
			loggerWebsocket.debug(ws.id, 'ws/sub/terminateClosedChannels', err.message);
		}
	});
	if (ws.auth.sub) {
		try {
			removeSubscriber(WEBSOCKET_CHANNEL('order', ws.auth.sub.networkId), ws, 'private');
			if (!getChannels()[WEBSOCKET_CHANNEL('order', ws.auth.sub.networkId)]) {
				sendNetworkWsMessage('unsubscribe', 'order', ws.auth.sub.networkId);
			}
		} catch (err) {
			loggerWebsocket.debug(ws.id, 'ws/sub/terminateClosedChannels', err.message);
		}

		try {
			removeSubscriber(WEBSOCKET_CHANNEL('usertrade', ws.auth.sub.networkId), ws, 'private');
			if (!getChannels()[WEBSOCKET_CHANNEL('usertrade', ws.auth.sub.networkId)]) {
				sendNetworkWsMessage('unsubscribe', 'usertrade', ws.auth.sub.networkId);
			}
		} catch (err) {
			loggerWebsocket.debug(ws.id, 'ws/sub/terminateClosedChannels', err.message);
		}

		try {
			removeSubscriber(WEBSOCKET_CHANNEL('wallet', ws.auth.sub.networkId), ws, 'private');
			if (!getChannels()[WEBSOCKET_CHANNEL('wallet', ws.auth.sub.networkId)]) {
				sendNetworkWsMessage('unsubscribe', 'wallet', ws.auth.sub.networkId);
			}
		} catch (err) {
			loggerWebsocket.debug(ws.id, 'ws/sub/terminateClosedChannels', err.message);
		}

		try {
			removeSubscriber(WEBSOCKET_CHANNEL('deposit', ws.auth.sub.networkId), ws, 'private');
			removeSubscriber(WEBSOCKET_CHANNEL('withdrawal', ws.auth.sub.networkId), ws, 'private');
			removeSubscriber(WEBSOCKET_CHANNEL('admin', undefined), ws, 'private');
		} catch (err) {
			loggerWebsocket.debug(ws.id, 'ws/sub/terminateClosedChannels', err.message);
		}
	}
};

const handleChatData = (action, ws, data) => {
	if (!ws.auth.sub) {
		throw new Error('Not authorized');
	} else if (action === 'deleteMessage' || action === 'getBannedUsers' || action === 'banUser' || action === 'unbanUser') {
		if (
			ws.auth.scopes.indexOf(ROLES.ADMIN) === -1 &&
			ws.auth.scopes.indexOf(ROLES.SUPERVISOR) === -1 &&
			ws.auth.scopes.indexOf(ROLES.SUPPORT) === -1
		) {
			throw new Error('Not authorized');
		}
	}
	getUsername(ws.auth.sub.id)
		.then(({ username, verification_level }) => {
			switch (action) {
				case 'addMessage':
					addMessage(username, verification_level, ws.auth.sub.id, data);
					break;
				case 'deleteMessage':
					deleteMessage(data);
					break;
				case 'getBannedUsers':
					sendBannedUsers(ws);
					break;
				case 'banUser':
					banUser(data);
					break;
				case 'unbanUser':
					unbanUser(data);
					break;
				case 'changeUsername':
					changeUsername(data);
					break;
				default:
					throw new Error('Invalid action');
			}
		})
		.catch((err) => {
			loggerWebsocket.error(ws.id, 'ws/sub/handleChatData', err.message);
			ws.send(JSON.stringify({ error: err.message }));
		});
};

const handleDepositWithdrawalData = (data) => {
	switch (data.topic) {
		case 'deposit':
		case 'withdrawal':
			each(getChannels()[WEBSOCKET_CHANNEL(data.topic, data.user_id)], (ws) => {
				if (ws.readyState === WebSocket.OPEN) {
					ws.send(JSON.stringify(data));
				}
			});
			break;
		default:
			break;
	}
};

const notifyAdmin = (data) => {
	each(getChannels()[WEBSOCKET_CHANNEL('admin', undefined)], (ws) => {
		if (ws.readyState === WebSocket.OPEN) {
			ws.send(JSON.stringify(data));
		}
	});
};

export {
	initializeTopic,
	terminateTopic,
	authorizeUser,
	terminateClosedChannels,
	handleChatData
};
