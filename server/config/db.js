'use strict';

const { loggerDb } = require('../config/logger');
const { toBool } = require('../utils/conversion');

const logging = (sql, options) => {
	loggerDb.silly(sql);
	// loggerDb.debug(options);
};

let requireSSL =  process.env.DB_SSL || false;
requireSSL = toBool(requireSSL);

let ssl;
if (requireSSL) {
	ssl = {
		require: true,
		rejectUnauthorized: false
	};
}

let replication = {
	read: [
		{ host: process.env.DB_HOST }
	],
	write: {
		host: process.env.DB_HOST
	}
};

const DB_READ_MODE = process.env.DB_READ_MODE || 'main'; // the default mode that only reads from the main db host

if (DB_READ_MODE === 'replica') {
	if (process.env.DB_HOST_REPLICA) {
		replication.read = [{ host: process.env.DB_HOST_REPLICA }]; // only reads from the replica
	}
} else if (DB_READ_MODE === 'all') {
	if (process.env.DB_HOST_REPLICA) {
		replication.read.push({ host: process.env.DB_HOST_REPLICA }); // reads from main and replica db
	}
}

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
		define: {
			createdAt: 'created_at',
			updatedAt: 'updated_at'
		},
		replication,
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
		define: {
			createdAt: 'created_at',
			updatedAt: 'updated_at'
		},
		replication,
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
		define: {
			createdAt: 'created_at',
			updatedAt: 'updated_at'
		},
		replication,
		logging
	}
};
