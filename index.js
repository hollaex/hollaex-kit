module.exports = (opts = {}) => {
	if (opts.apiKey && opts.apiSecret && opts.exchangeId) {
		process.env.API_KEY = opts.apiKey;
		process.env.API_SECRET = opts.apiSecret;
		process.env.EXCHANGE_ID = opts.exchangeId;
		process.env.NETWORK_URL = opts.apiURL;
		process.env.NETWORK_BASE_URL = opts.baseURL;
	}
	return require('./tools');
};