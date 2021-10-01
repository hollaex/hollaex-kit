'use strict';

const { SERVER_PATH } = require('../constants');
const { getNodeLib } = require(`${SERVER_PATH}/init`);

const getExchangeConfig = (
	opts = {
		additionalHeaders: null
	}
) => {
	return getNodeLib().getExchange(opts);
};

const updateExchangeConfig = (
	fields = {
		info: null,
		isPublic: null,
		type: null,
		name: null,
		displayName: null,
		url: null,
		businessInfo: null,
		pairs: null,
		coins: null
	},
	opts = {
		additionalHeaders: null
	}
) => {
	return getNodeLib().updateExchange(fields, opts);
};

module.exports = {
	getExchangeConfig,
	updateExchangeConfig
};
