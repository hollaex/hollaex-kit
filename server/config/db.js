'use strict';

const { loggerDb } = require('../config/logger');
const { toBool } = require('../utils/conversion');

const logging = (sql, options) => {
	loggerDb.silly(sql);
	// loggerDb.debug(options);
};

let ssl = process.env.DB_SSL || false;
ssl = toBool(ssl);

module.exports = {
	development: {
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
		dialect: process.env.DB_DIALECT,
		port: process.env.DB_PORT,
		dialectOptions: {
			ssl
		},
		logging
	},
	test: {
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
		dialect: process.env.DB_DIALECT,
		port: process.env.DB_PORT,
		dialectOptions: {
			ssl
		},
		logging
	},
	production: {
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
		dialect: process.env.DB_DIALECT,
		port: process.env.DB_PORT,
		dialectOptions: {
			ssl
		},
		logging
	}
};
