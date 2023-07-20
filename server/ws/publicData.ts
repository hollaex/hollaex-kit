'use strict';

let publicData = {
	orderbook: {},
	trade: {}
};

const getPublicData = () => publicData;

const resetPublicData = () => {
	publicData = {
		orderbook: {},
		trade: {}
	};
};

const updateOrderbookData = (data) => {
	publicData.orderbook[data.symbol] = { ...data, action: 'partial' };
};

const updateTradeData = (data) => {
	if (data.action === 'partial') {
		publicData.trade[data.symbol] = data;
	} else {
		const updatedTrades = data.data.concat(publicData.trade[data.symbol].data);
		publicData.trade[data.symbol].time = data.time;
		publicData.trade[data.symbol].data = updatedTrades.length <= 50 ? updatedTrades : updatedTrades.slice(0, 50);
	}
};

module.exports = {
	getPublicData,
	resetPublicData,
	updateOrderbookData,
	updateTradeData
};