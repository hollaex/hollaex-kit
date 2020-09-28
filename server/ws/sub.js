'use strict';

const { addSubscriber, removeSubscriber, getChannels } = require('./channel');
const { WS_ORDERBOOK_CHANNEL, WS_TRADES_CHANNEL, WS_ORDER_CHANNEL, WS_WALLET_CHANNEL, WS_USER_TRADE_CHANNEL } = require('../constants');
const { each } = require('lodash');
const toolsLib = require('hollaex-tools-lib');
// receives data from hub, parse for topic, look for channel, publish data back to client

let orderbook = {};
let trades = {};

const initializeOrderbook = (ws, symbol) => {
	if (symbol) {
		addSubscriber(WS_ORDERBOOK_CHANNEL(symbol), ws);
		ws.send(JSON.stringify(orderbook[symbol]));
	} else {
		each(toolsLib.getKitPairs(), (pair) => {
			addSubscriber(WS_ORDERBOOK_CHANNEL(pair), ws);
			ws.send(JSON.stringify(orderbook[pair]));
		});
	}
};

const initializeTrade = (ws, symbol) => {
	if (symbol) {
		addSubscriber(WS_TRADES_CHANNEL(symbol), ws);
		ws.send(JSON.stringify(trades[symbol]));
	} else {
		each(toolsLib.getKitPairs(), (pair) => {
			addSubscriber(WS_TRADES_CHANNEL(pair), ws);
			ws.send(JSON.stringify(trades[pair]));
		});
	}
};

// const handleData = (data) => {
// 	try {
// 		data = JSON.parse(data);
// 	} catch (err) {
// 		console.log('err', err);
// 	}
// };

const handleOrderbookData = (data) => {
	try {
		data = JSON.parse(data);
	} catch (err) {
		console.log('err', err);
	}

	orderbook[data.symbol] = { ...data, action: 'parital' };

	each(getChannels()[WS_ORDERBOOK_CHANNEL(data.symbol)], (ws) => {
		ws.send(JSON.stringify(data));
	});
};

const handleTradesData = (data) => {
	try {
		data = JSON.parse(data);
	} catch (err) {
		console.log('err', err);
	}

	if (data.action === 'partial') {
		trades[data.symbol] = data;
	} else {
		const updatedTrades = data[data.symbol].concat(trades[data.symbol][data.symbol]);
		trades[data.symbol][data.symbol] = updatedTrades.length <= 50 ? updatedTrades : updatedTrades.slice(0, 50);
	}

	each(getChannels()[WS_TRADES_CHANNEL(data.symbol)], (ws) => {
		ws.send(JSON.stringify(data));
	});
};

module.exports = {
	initializeOrderbook,
	initializeTrade,
	handleOrderbookData,
	handleTradesData
};
