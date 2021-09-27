'use strict';

const { SERVER_PATH } = require('../constants');
const { getNodeLib } = require(`${SERVER_PATH}/init`);
const {
	subscribedToCoin,
	getKitCoin,
	getKitCoins,
	getKitCoinsConfig,
	subscribedToPair,
	getKitPair,
	getKitPairs,
	getKitPairsConfig
} = require('./common');

const getNetworkPairs = (
	opts = {
		search: null,
		active: null,
		verified: null,
		limit: null,
		page: null,
		orderBy: null,
		order: null,
		startDate: null,
		endDate: null,
		additionalHeaders: null
	}
) => {
	return getNodeLib().getPairs(opts);
};

const createPair = async (
	name,
	baseCoin,
	quoteCoin,
	opts = {
		code: null,
		active: null,
		minSize: null,
		maxSize: null,
		minPrice: null,
		maxPrice: null,
		incrementSize: null,
		incrementPrice: null,
		estimatedPrice: null,
		isPublic: null,
		additionalHeaders: null
	}
) => {
	const formattedName = name.trim().toLowerCase();
	const formattedBaseCoin = baseCoin.trim().toLowerCase();
	const formattedQuoteCoin = quoteCoin.trim().toLowerCase();

	return getNodeLib().createPair(
		formattedName,
		formattedBaseCoin,
		formattedQuoteCoin,
		opts
	);
};

const updatePair = async (
	code,
	fields = {
		minSize: null,
		maxSize: null,
		minPrice: null,
		maxPrice: null,
		incrementSize: null,
		incrementPrice: null,
		estimatedPrice: null,
		isPublic: null,
		circuitBreaker: null
	},
	opts = {
		additionalHeaders: null
	}
) => {
	return getNodeLib().updatePair(
		code,
		fields,
		opts
	);
};

module.exports = {
	subscribedToPair,
	getKitPair,
	getKitPairs,
	getKitPairsConfig,
	createPair,
	updatePair,
	getNetworkPairs
};
