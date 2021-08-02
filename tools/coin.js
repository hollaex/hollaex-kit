'use strict';

const { SERVER_PATH } = require('../constants');
const { getNodeLib } = require(`${SERVER_PATH}/init`);
const {
	subscribedToCoin,
	getKitCoin,
	getKitCoins,
	getKitCoinsConfig
} = require('./common');

const getNetworkCoins = (
	opts = {
		additionalHeaders: null
	}
) => {
	return getNodeLib().getAllCoins(opts);
};

const createCoin = async (
	symbol,
	fullName,
	opts = {
		code: null,
		withdrawalFee: null,
		min: null,
		max: null,
		incrementUnit: null,
		logo: null,
		meta: null,
		estimatedPrice: null,
		type: null,
		network: null,
		standard: null,
		allowDeposit: null,
		allowWithdrawal: null,
		additionalHeaders: null
	}
) => {
	const formattedSymbol = symbol.trim().toLowerCase();

	return getNodeLib().createCoin(formattedSymbol, fullName, opts);
};

const updateCoin = async (
	symbol,
	opts = {
		fullName: null,
		active: null,
		allowDeposit: null,
		allowWithdrawal: null,
		withdrawalFee: null,
		min: null,
		max: null,
		incrementUnit: null,
		additionalHeaders: null
	}
) => {
	const formattedSymbol = symbol.trim().toLowerCase();

	return getNodeLib().updateCoin(formattedSymbol, opts);
};

module.exports = {
	subscribedToCoin,
	getKitCoin,
	getKitCoins,
	getKitCoinsConfig,
	createCoin,
	updateCoin,
	getNetworkCoins
};
