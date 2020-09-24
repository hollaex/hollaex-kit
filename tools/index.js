'use strict';

module.exports = {
	...require('./common'),

	// auth
	auth: require('./auth'),

	// database
	database: require('./database'),

	order: require('./order'),

	// logger
	logger: require('./logger'),

	// plugins
	plugins: require('./plugins'),

	user: require('./user')
};
