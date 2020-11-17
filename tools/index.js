'use strict';

module.exports = {
	...require('./common'),
	auth: require('./auth'),
	database: require('./database'),
	order: require('./order'),
	plugin: require('./plugin'),
	user: require('./user'),
	balance: require('./balance'),
	image: require('./image'),
	transaction: require('./transaction'),
	tier: require('./tier'),
	security: require('security'),
	otp: require('otp')
};
