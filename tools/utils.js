'use strict';

const { API_KEY, API_SECRET, EXCHANGE_ID, HE_NETWORK_ENDPOINT, HE_NETWORK_BASE_URL } = require('../constants');
const hollaexNodeLib = require('hollaex-node-lib');
const nodeLib  = new hollaexNodeLib({
	apiKey: API_KEY(),
	apiSecret: API_SECRET(),
	exchange_id: EXCHANGE_ID(),
	apiURL: HE_NETWORK_ENDPOINT,
	baseURL: HE_NETWORK_BASE_URL
});

module.exports = {
	nodeLib
};