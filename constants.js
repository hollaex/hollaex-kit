'use strict';

const path = require('path');

exports.SERVER_PATH = path.resolve(__dirname, '../../');

exports.SETTING_KEYS = [
	'language',
	'notification',
	'interface',
	'audio',
	'risk',
	'chat'
];

exports.OMITTED_USER_FIELDS = [
	'password',
	'is_admin',
	'is_support',
	'is_supervisor',
	'is_kyc',
	'is_tech',
	'flagged'
];

exports.DEFAULT_ORDER_RISK_PERCENTAGE = 90; // used in settings in percentage to display popups on big relative big orders of user

exports.API_KEY = () => process.env.API_KEY;
exports.API_SECRET = () => process.env.API_SECRET;
exports.EXCHANGE_ID = () => process.env.EXCHANGE_ID;
exports.NETWORK_URL = () => process.env.NETWORK_URL || 'https://api.testnet.hollaex.network';
exports.NETWORK_BASE_URL = () => process.env.NETWORK_BASE_URL || '/v2';
