const { toBool } = require('./utils/conversion');

exports.HOLLAEX_NETWORK_ENDPOINT = process.env.NETWORK_URL || (process.env.NETWORK === 'testnet' ? 'https://api.testnet.hollaex.network' : 'https://api.hollaex.network');
exports.HOLLAEX_NETWORK_BASE_URL = '/v2';
exports.HOLLAEX_NETWORK_PATH_ACTIVATE = '/exchange/activate';

exports.DEFAULT_FEES = {
	fiat: {
		maker: 0,
		taker: 0
	},
	boost: {
		maker: 0,
		taker: 0
	},
	crypto: {
		maker: 0.05,
		taker: 0.1
	},
	basic: {
		maker: 0.2,
		taker: 0.2
	}
};

exports.TOKEN_TYPES = {
	HMAC: 'hmac'
};

exports.ROLES = {
	SUPERVISOR: 'supervisor',
	SUPPORT: 'support',
	ADMIN: 'admin',
	KYC: 'kyc',
	COMMUNICATOR: 'communicator',
	USER: 'user',
	HMAC: 'hmac'
};
exports.APM_ENABLED = toBool(process.env.APM_ENABLED) || false; // apm is used for sending logs etc
exports.DEFAULT_ORDER_RISK_PERCENTAGE = 90; // used in settings in percentage to display popups on big relative big orders of user
