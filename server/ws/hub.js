'use strict';

const { loggerWebsocket } = require('../config/logger');
const { checkStatus } = require('../init');
const { subscriber, publisher } = require('../db/pubsub');
const { WS_HUB_CHANNEL, WEBSOCKET_CHANNEL, INIT_CHANNEL } = require('../constants');
const { each } = require('lodash');
const { getChannels, resetChannels } = require('./channel');
const { updateOrderbookData, updateTradeData, resetPublicData } = require('./publicData');
const WebSocket = require('ws');

let networkNodeLib = null;
let wsConnected = false;
const hubConnected = () => wsConnected;

subscriber.on('message', (channel, message) => {
	if (channel === WS_HUB_CHANNEL) {
		const { action } = JSON.parse(message);
		switch (action) {
			case 'restart':
				loggerWebsocket.info(
					'ws/hub subscriber action restart',
					hubConnected(),
					networkNodeLib.wsConnected()
				);
				if (hubConnected() && networkNodeLib && networkNodeLib.wsConnected()) {
					networkNodeLib.disconnect();
					connect();
				}
				break;
			default:
				break;
		}
	}
	return;
});

subscriber.subscribe(WS_HUB_CHANNEL);

const connect = () => {
	checkStatus()
		.then((nodeLib) => {
			loggerWebsocket.info(
				'ws/hub Initializing Network Websocket'
			);
			networkNodeLib = nodeLib;
			networkNodeLib.connect(['orderbook', 'trade', 'coin', 'pair']);

			networkNodeLib.ws.on('open', () => {
				wsConnected = true;
				loggerWebsocket.info('ws/hub open');
			});

			networkNodeLib.ws.on('unexpected-response', () => {
				wsConnected = false;
				loggerWebsocket.error('ws/hub unexpected-response');
			});

			networkNodeLib.ws.on('error', (err) => {
				wsConnected = false;
				loggerWebsocket.error('ws/hub err', err.message);
			});

			networkNodeLib.ws.on('close', () => {
				wsConnected = false;
				loggerWebsocket.info('ws/hub close');
				closeAllClients();
			});

			networkNodeLib.ws.on('message', (data) => {
				if (data !== 'pong') {
					try {
						data = JSON.parse(data);
						handleHubData(data);
					} catch (err) {
						loggerWebsocket.error('ws/hub message err', err.message);
					}
				}
			});

			loggerWebsocket.info(
				'ws/hub Network Websocket initialized'
			);
		})
		.catch((err) => {
			let message = 'Websocket Initialization failed';
			if (err.message) {
				message = err.message;
			}
			if (err.statusCode && err.statusCode === 402) {
				message = err.error.message;
			}
			loggerWebsocket.error('ws/hub/connect/checkStatus Error ', message);
			setTimeout(() => {
				process.exit(1);
			}, 5000);
		});

	// check after 10 seconds to make sure stream is connected
	setTimeout(() => {
		if (!hubConnected()) {
			loggerWebsocket.error('ws/hub/connect hub not connected');
			process.exit(1);
		}
	}, 10000);
};

const sendNetworkWsMessage = (op, topic, networkId) => {
	if (hubConnected()) {
		networkNodeLib[op]([`${topic}:${networkId}`]);
	}
};

const handleHubData = (data) => {
	switch (data.topic) {
		case 'orderbook':
			updateOrderbookData(data);
			each(getChannels()[WEBSOCKET_CHANNEL(data.topic, data.symbol)], (ws) => {
				if (ws.readyState === WebSocket.OPEN) {
					ws.send(JSON.stringify(data));
				}
			});
			break;
		case 'trade':
			updateTradeData(data);
			each(getChannels()[WEBSOCKET_CHANNEL(data.topic, data.symbol)], (ws) => {
				if (ws.readyState === WebSocket.OPEN) {
					ws.send(JSON.stringify(data));
				}
			});
			break;
		case 'order':
		case 'usertrade':
		case 'wallet':
			each(getChannels()[WEBSOCKET_CHANNEL(data.topic, data.user_id)], (ws) => {
				if (ws.readyState === WebSocket.OPEN) {
					ws.send(JSON.stringify(data));
				}
			});
			break;
		case 'coin':
		case 'pair':
			publisher.publish(INIT_CHANNEL, JSON.stringify({ type: 'refreshInit' }));
			break;
		default:
			break;
	}
};

const closeAllClients = () => {
	each(getChannels(), (channel) => {
		each(channel, (ws) => {
			if (ws.readyState !== WebSocket.CONNECTING) {
				ws.close();
			}
		});
	});
	resetChannels();
	resetPublicData();
};

module.exports = {
	sendNetworkWsMessage,
	connect,
	hubConnected
};
