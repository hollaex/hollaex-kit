'use strict';
const redis = require('redis');
const config = require('../config/redis');
const { loggerRedis } = require('../config/logger');
const client = redis.createClient(config.pubsub);

client.on('ready', () => {
	loggerRedis.info('PubSub is ready');
});

client.on('connect', () => {
	loggerRedis.verbose('Connect to PubSub');
	if (config.pubsub.password) {
		client.auth(config.pubsub.password, () => {
			loggerRedis.verbose('Authenticated to PubSub');
		});
	}
});

client.on('error', (err) => {
	loggerRedis.error('PUBSUBS', err.message);
	loggerRedis.error(err);
	process.exit(0);
});

module.exports = {
	publisher: client.duplicate(),
	subscriber: client.duplicate()
};