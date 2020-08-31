'use strict';

const path = require('path');

exports.SERVER_PATH = path.resolve(__dirname, '../');

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