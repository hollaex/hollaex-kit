'use strict';

const { API_KEY, API_SECRET, EXCHANGE_ID, NETWORK_URL, NETWORK_BASE_URL } = require('../constants');
const hollaexNodeLib = require('hollaex-node-lib');
const nodeLib  = new hollaexNodeLib({
	apiKey: API_KEY(),
	apiSecret: API_SECRET(),
	exchange_id: EXCHANGE_ID(),
	apiURL: NETWORK_URL,
	baseURL: NETWORK_BASE_URL
});

module.exports = {
	nodeLib
};