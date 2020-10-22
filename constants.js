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
	'is_communicator',
	'flagged'
];

exports.DEFAULT_ORDER_RISK_PERCENTAGE = 90; // used in settings in percentage to display popups on big relative big orders of user
