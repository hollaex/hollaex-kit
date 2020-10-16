'use strict';
const redis = require('redis');
const config = require('../config/redis');
const { loggerRedis } = require('../config/logger');
const client = redis.createClient(config.pubsub);

client.on('ready', () => {
	if (loggerRedis) loggerRedis.info('PubSub is ready');
});

client.on('connect', () => {
	if (loggerRedis) loggerRedis.verbose('Connect to PubSub');
	if (config.pubsub.password) {
		client.auth(config.pubsub.password, () => {
			if (loggerRedis) loggerRedis.verbose('Authenticated to PubSub');
		});
	}
});

client.on('error', (err) => {
	if (loggerRedis) loggerRedis.error('PUBSUBS', err.message);
	if (loggerRedis) loggerRedis.error(err);
	process.exit(0);
});

module.exports = {
	publisher: client.duplicate(),
	subscriber: client.duplicate()
};