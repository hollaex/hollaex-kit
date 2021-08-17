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
		additionalHeaders: null
	}
) => {
	return getNodeLib().getAllPairs(opts);
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

	return getNodeLib().updatePair(
		formattedName,
		formattedBaseCoin,
		formattedQuoteCoin,
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
