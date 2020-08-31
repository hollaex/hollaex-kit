module.exports = (opts = {}) => {
	if (opts.apiKey && opts.apiSecret && opts.exchangeId) {
		process.env.API_KEY = opts.apiKey;
		process.env.API_SECRET = opts.apiSecret;
		process.env.EXCHANGE_ID = opts.exchangeId;
	}
	return require('./tools');
};