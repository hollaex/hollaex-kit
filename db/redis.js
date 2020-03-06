'use strict';
const { promisifyAll } = require('bluebird');
const redis = require('redis');
const config = require('../config/redis');
const { loggerRedis } = require('../config/logger');

promisifyAll(redis.RedisClient.prototype);
promisifyAll(redis.Multi.prototype);

const client = redis.createClient(config.client);

client.on('ready', () => {
	loggerRedis.info('Redis is ready');
});

client.on('connect', () => {
	loggerRedis.verbose('Connect to redis');
	if (config.client.password) {
		client.auth(config.client.password, () => {
			if (loggerRedis) loggerRedis.verbose('Authenticated to redis');
		});
	}
});

client.on('error', (err) => {
	loggerRedis.error('REDIS', err.message);
	loggerRedis.error(err);
	process.exit(0);
});


module.exports = client;