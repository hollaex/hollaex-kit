'use strict';

exports.PLUGIN_PORT = process.env.PLUGIN_PORT || 10011;

// List of available plugins
exports.AVAILABLE_PLUGINS = [
	'announcement',
	'bank',
	'chat',
	'freshdesk',
	'kyc',
	'sms',
	'vault',
	'xht_fee',
	'zendesk'
];

// SMS_CONSTANTS
exports.SMS_CODE_KEY = 'user:sms';
exports.SMS_CODE_EXPIRATION_TIME = 6 * 60; // seconds -> 6 min

// KYC_BANK_CONSTANTS
exports.ID_FIELDS = [
	'type',
	'number',
	'issued_date',
	'expiration_date',
	'status'
];
exports.USER_FIELD_ADMIN_LOG = [
	'full_name',
	'email',
	'dob',
	'gender',
	'nationality',
	'phone_number',
	'address',
	'id_data',
	'bank_account',
	'settings',
	'username'
];
exports.ADDRESS_FIELDS = ['city', 'address', 'country', 'postal_code'];
exports.VERIFY_STATUS = {
	EMPTY: 0,
	PENDING: 1,
	REJECTED: 2,
	COMPLETED: 3
};

exports.ERC_TOKENS = [
	'eth',
	'xht',
	'usdt',
	'dai',
	'mkr',
	'tusd',
	'usdc',
	'leo',
	'xaut',
	'busd'
];