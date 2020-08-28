'use strict';

module.exports = {
	...require('./common'),

	// auth
	auth: require('./auth'),

	// database
	database: require('./database'),

	// Constants/Secrets

	// logger
	logger: require('./logger'),

	// plugins
	plugins: require('./plugins')
};
