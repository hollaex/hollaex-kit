'use strict';

const { getCurrencies } = require('../../init');

const isValidCurrency = (currency = '') => {
	return getCurrencies().includes(currency);
};

const isValidAmount = (amount) => {
	return amount > 0;
};

module.exports = {
	isValidCurrency,
	isValidAmount
};
