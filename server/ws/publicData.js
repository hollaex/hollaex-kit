'use strict';

let publicData = {
	orderbook: {},
	trade: {},
	price: { data: {}, time: null }
};

const getPublicData = () => publicData;

const resetPublicData = () => {
	publicData = {
		orderbook: {},
		trade: {},
		price: { data: {}, time: null }
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

const updatePriceData = (data) => {
	if (data.action === 'partial') {
		publicData.price = { data: data.data, time: data.time };
	} else if (data.action === 'update') {
		const symbol = data.symbol;
		if (publicData.price && publicData.price.data) {
			publicData.price.data[symbol] = data.data;
			publicData.price.time = data.time;
		}
	}
};

module.exports = {
	getPublicData,
	resetPublicData,
	updateOrderbookData,
    updateTradeData,
    updatePriceData
};