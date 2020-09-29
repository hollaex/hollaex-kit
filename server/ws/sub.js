'use strict';

const { addSubscriber, removeSubscriber, getChannels } = require('./channel');
const { WEBSOCKET_CHANNEL } = require('../constants');
const { each } = require('lodash');
const toolsLib = require('hollaex-tools-lib');
const { userNetworkSubscribe } = require('./hub');
const { WS_AUTHENTICATION_REQUIRED } = require('../messages');
// receives data from hub, parse for topic, look for channel, publish data back to client

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
			addSubscriber(WEBSOCKET_CHANNEL(topic, ws.auth.networkId), ws);
			userNetworkSubscribe(ws.auth.networkId, topic);
			break;
		default:
			break;
	}
};

const handleHubData = (data) => {
	try {
		data = JSON.parse(data);
	} catch (err) {
		console.log('err', err);
	}

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
			each(getChannels()[WEBSOCKET_CHANNEL(data.topic, data.userId)], (ws) => {
				ws.send(JSON.stringify(data));
			});
			break;
		default:
			break;
	}
};

module.exports = {
	initializeTopic,
	handleHubData
};
