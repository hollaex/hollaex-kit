'use strict';
const env = process.env.NODE_ENV || 'development';

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

const PUBSUB_HOST = process.env.PUBSUB_HOST;
const PUBSUB_PORT = process.env.PUBSUB_PORT;
const PUBSUB_PASSWORD = process.env.PUBSUB_PASSWORD;

const redisClientConfig = {
	host: REDIS_HOST,
	port: REDIS_PORT
};

const redisPubsubConfig = {
	host: PUBSUB_HOST,
	port: PUBSUB_PORT
};

const defaultConfig = {
	client: redisClientConfig,
	redis: redisClientConfig,
	pubsub: redisPubsubConfig
};

const productionConfig = {
	client: REDIS_PASSWORD
		? {
			...redisClientConfig,
			password: REDIS_PASSWORD,
			auth: REDIS_PASSWORD
		}
		: redisClientConfig,
	redis: REDIS_PASSWORD
		? {
			...redisClientConfig,
			password: REDIS_PASSWORD,
			auth: REDIS_PASSWORD
		}
		: redisClientConfig,
	pubsub: PUBSUB_PASSWORD
		? {
			...redisPubsubConfig,
			password: PUBSUB_PASSWORD,
			auth: PUBSUB_PASSWORD
		}
		: redisPubsubConfig
};

const config = {
	development: productionConfig,
	test: productionConfig,
	production: productionConfig
};

module.exports = config[env] || defaultConfig;
