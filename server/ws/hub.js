'use strict';

const { loggerWebsocket } = require('../config/logger');
const { checkStatus, getNodeLib } = require('../init');
const { subscriber } = require('../db/pubsub');
const { WS_HUB_CHANNEL, WEBSOCKET_CHANNEL } = require('../constants');
const { each } = require('lodash');
const { getChannels, resetChannels } = require('./channel');
const { updateOrderbookData, updateTradeData, resetPublicData } = require('./publicData');

let connected = false;
const hubConnected = () => connected;
let ws;

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
		.then(() => {
			ws = getNodeLib().connect();

			ws.on('open', () => {
				loggerWebsocket.info('ws/hub open');
				connected = true;
				ws.subscribe([
					'orderbook',
					'trade'
				]);
			});

			ws.on('error', (err) => {
				loggerWebsocket.error('ws/hub err', err.message);
			});

			ws.on('close', () => {
				loggerWebsocket.info('ws/hub close', ws.id);
				connected = false;
				closeAllClients();
			});

			ws.on('message', (data) => {
				handleHubData(data);
			});

			setTimeout(() => {
				ws.close()
			}, 5000)
		});
};

const sendNetworkWsMessage = (op, topic, networkId) => {
	if (ws) {
		ws[op]([`${topic}:${networkId}`]);
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
