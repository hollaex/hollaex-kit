'use strict';

const initializeMode = (modeString = '') => {
	let modes = [];
	modeString.split(',').forEach((mode = '') => {
		modes.push(mode.toLowerCase().trim());
	});
	return modes;
};

const initializeCurrencies = (currenciesString = '') => {
	const currencies = [];

	currenciesString.split(',').forEach((currency) => {
		currencies.push(currency);
	});
	return currencies;
};

const initializePairs = (pairsString = '') => {
	if (pairsString === '') {
		throw new Error('Trading pairs are not configured');
	}
	const pairs = {};
	pairsString.split(',').forEach((pairString = '') => {
		const name = pairString;
		const [pair_base, pair_2] = pairString.split('-');
		const envPair = `${pair_base.toUpperCase()}_${pair_2.toUpperCase()}`;
		pairs[name.toLowerCase()] = {
			pair_base: pair_base.toLowerCase(),
			pair_2: pair_2.toLowerCase(),
			increment_price: process.env[`${envPair}_INCREMENT_PRICE`],
			increment_size: process.env[`${envPair}_INCREMENT_SIZE`],
			min_price: process.env[`${envPair}_MIN_PRICE`],
			max_price: process.env[`${envPair}_MAX_PRICE`],
			min_size: process.env[`${envPair}_MIN_SIZE`],
			max_size: process.env[`${envPair}_MAX_SIZE`]
		};
	});
	return pairs;
};

module.exports = {
	initializePairs,
	initializeMode,
	initializeCurrencies
};
