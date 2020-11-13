'use strict';

const WebSocket = require('ws');
const moment = require('moment');
const toolsLib = require('hollaex-tools-lib');
const { setWsHeartbeat } = require('ws-heartbeat/client');
const { loggerWebsocket } = require('../config/logger');
const { checkStatus } = require('../init');
const { subscriber } = require('../db/pubsub');
const { WS_HUB_CHANNEL, WEBSOCKET_CHANNEL } = require('../constants');
const { each } = require('lodash');
const { getChannels, resetChannels } = require('./channel');
const { updateOrderbookData, updateTradeData, resetPublicData } = require('./publicData');

const HE_NETWORK_WS_ENDPOINT = 'wss://api.testnet.hollaex.network/stream';
let connected = false;
const hubConnected = () => connected;
let ws;

const reconnectInterval = 5000; // 5 seconds

subscriber.on('message', (channel, message) => {
	if (channel === WS_HUB_CHANNEL) {
		const { action } = JSON.parse(message);
		switch(action) {
			case 'restart':
				if (ws) {
					ws.close();
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
		.then(([ exchange, status ]) => {
			const apiExpires = moment().toISOString() + 60;
			const signature = toolsLib.auth.createHmacSignature(status.api_secret, 'CONNECT', '/stream', apiExpires);
			ws = new WebSocket(`${HE_NETWORK_WS_ENDPOINT}?exchange_id=${exchange.id}`, {
				headers : {
					'api-key': status.api_key,
					'api-signature': signature,
					'api-expires': apiExpires
				}
			});

			ws.on('open', () => {
				loggerWebsocket.info('ws/hub open');
				connected = true;
				ws.send(JSON.stringify({
					op: 'subscribe',
					args: ['orderbook', 'trade']
				}));
			});

			ws.on('error', (err) => {
				loggerWebsocket.error('ws/hub err', err.message);
				ws.close();
			});

			ws.on('close', () => {
				loggerWebsocket.info('ws/hub close', ws.id);
				connected = false;
				closeAllClients();
				setTimeout(connect, reconnectInterval);
			});

			ws.on('message', (data) => {
				if (data !== 'pong') {
					try {
						data = JSON.parse(data);
					} catch (err) {
						loggerWebsocket.error('ws/hub message err', err.message);
					}
					handleHubData(data);
				}
			});

			setWsHeartbeat(ws, 'ping', {
				pingTimeout: 60000,
				pingInterval: 25000,
			});
		});
};

const sendNetworkWsMessage = (op, topic, networkId) => {
	if (ws) {
		ws.send(JSON.stringify({ op, args: [`${topic}:${networkId}`] }));
	}
};

const handleHubData = (data) => {
	switch (data.topic) {
		case 'orderbook':
			updateOrderbookData(data);
			each(getChannels()[WEBSOCKET_CHANNEL(data.topic, data.symbol)], (ws) => {
				ws.send(JSON.stringify(data));
			});
			break;
		case 'trade':
			updateTradeData(data);
			each(getChannels()[WEBSOCKET_CHANNEL(data.topic, data.symbol)], (ws) => {
				ws.send(JSON.stringify(data));
			});
			break;
		case 'order':
		case 'wallet':
			each(getChannels()[WEBSOCKET_CHANNEL(data.topic, data.user_id)], (ws) => {
				ws.send(JSON.stringify(data));
			});
			break;
		default:
			break;
	}
};

const closeAllClients = () => {
	each(getChannels(), (channel) => {
		each(channel, (ws) => {
			ws.close();
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
