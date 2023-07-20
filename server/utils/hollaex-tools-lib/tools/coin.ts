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
		search: null,
		additionalHeaders: null
	}
) => {
	return getNodeLib().getCoins(opts);
};

const createCoin = async (
	symbol,
	fullname,
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

	return getNodeLib().createCoin(formattedSymbol, fullname, opts);
};

const updateCoin = async (
	code,
	fields = {
		fullname: null,
		withdrawalFee: null,
		description: null,
		withdrawalFees: null,
		depositFees: null,
		min: null,
		max: null,
		isPublic: null,
		incrementUnit: null,
		logo: null,
		meta: null,
		estimatedPrice: null,
		type: null,
		network: null,
		standard: null,
		allowDeposit: null,
		allowWithdrawal: null
	},
	opts = {
		additionalHeaders: null
	}
) => {
	return getNodeLib().updateCoin(code, fields, opts);
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
