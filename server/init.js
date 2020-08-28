'use strict';

const Kit = require('hollaex-node-lib');
const { all } = require('bluebird');
const rp = require('request-promise');
const cron = require('node-cron');
const { getStatus } = require('./api/helpers/status');
const { loggerGeneral } = require('./config/logger');
const { User } = require('./db/models');

const HE_NETWORK_ENDPOINT = 'https://api.testnet.hollaex.network';
const HE_NETWORK_BASE_URL = '/v2';
const PATH_ACTIVATE = '/exchange/activate';

let kit; // kit object based on hollaex node lib

const { subscriber, publisher } = require('./db/pubsub');
const { INIT_CHANNEL, CONFIGURATION_CHANNEL, STATUS_FROZENUSERS_DATA } = require('./constants');
const { each } = require('lodash');
const redis = require('./db/redis').duplicate();

subscriber.on('message', (channel, message) => {
	if (channel === INIT_CHANNEL) {
		const { type, data } = JSON.parse(message);
		switch(type) {
			case 'coins':
				updateConfiguration(type, data, data.symbol);
				break;
			case 'pairs':
				updateConfiguration(type, data, data.name);
				break;
			case 'kit':
				updateConfiguration(type, data.constants);
				break;
			case 'secret':
				updateSecrets(data.key, data.secrets);
				break;
			case 'freezeUser':
				addFrozenUser(data);
				break;
			case 'unfreezeUser':
				removeFrozenUser(data);
				break;
			default:
				break;
		}
	}
	return;
});

subscriber.subscribe(INIT_CHANNEL);

let configuration = {
	coins: {}, // network variable, admin cant change
	pairs: {}, // network variable, admin cant chgange
	kit: { // kit endpoint, status.kit in db
		info: {}, // kit endpoint
		captcha: {},
		defaults: {},
		plugins: {
			configuration: {}
		},
		status: false
	}
};

// /kit endpoint with constants, info values above
// /constant endpoint only sending coins and pairs

let secrets = {
	broker: {},
	security: {},
	accounts: {},
	captcha: {},
	emails: {},
	smtp: {},
	vault: {},
	plugins: {
		s3: {
			key: {},
			secret: {}
		},
		sns: {},
		freshdesk: {}
	}
};

let frozenUsers = {};

const getCurrencies = () => {
	return Object.keys(configuration.coins);
};

const getPairs = () => {
	return configuration.pairs;
};

const checkStatus = () => {
	loggerGeneral.verbose('init/checkStatus', 'checking exchange status');

	return getStatus()
		.then((status) => {
			loggerGeneral.info('init/checkStatus');
			if (!status) {
				stop();
				throw new Error('Exchange is not initialized yet');
			} else if (status.blocked) {
				stop();
				throw new Error('Exchange is locked');
			} else if (!status.activation_code) {
				stop();
				throw new Error('Exchange activation code is not set');
			} else if (!status.api_key || !status.api_secret) {
				stop();
				throw new Error('Exchange keys are not set.');
			} else if (!status.activated) {
				stop();
				throw new Error('Exchange is expired');
			} else {
				secrets = status.secrets;
				configuration.kit = status.kit;
				return all([
					checkActivation(
						status.name,
						status.url,
						status.activation_code,
						status.constants
					),
					status.dataValues
				]);
			}
		})
		.then(([exchange, status]) => {
			loggerGeneral.info('init/checkStatus/activation', exchange.name, exchange.active);
			configuration.coins = exchange.coins;
			configuration.pairs = exchange.pairs;
			configuration.kit.info = {
				name: exchange.name,
				active: exchange.active,
				url: exchange.url,
				is_trial: exchange.is_trial,
				created_at: exchange.created_at,
				expiry: exchange.expiry,
				status: true
			};
			kit = new Kit({
				apiURL: HE_NETWORK_ENDPOINT ,
				baseURL: HE_NETWORK_BASE_URL,
				apiKey: status.api_key,
				apiSecret: status.secret,
				exchange_id: exchange.id,
				activation_code: exchange.activation_code
			});

			return User.findAll({
				where: {
					activated: false
				}
			});
		})
		.then((users) => {
			loggerGeneral.info('init/checkStatus/activation', users.length, 'users deactivated');
			each(users, (user) => {
				addFrozenUser(user.dataValues.id);
			});
			publisher.publish(CONFIGURATION_CHANNEL, JSON.stringify({ configuration, secrets, frozenUsers }));
			return redis.setAsync(STATUS_FROZENUSERS_DATA, JSON.stringify({ configuration, secrets, frozenUsers }));
		})
		.then(() => {
			loggerGeneral.info('init/checkStatus/activation complete');
		})
		.catch((err) => {
			let message = 'Initialization failed';
			if (err.message) {
				message = err.message;
			}
			if (err.statusCode && err.statusCode === 402) {
				message = err.error.message;
			}
			loggerGeneral.error('init/checkStatus Error ', message);
			setTimeout(() => { process.exit(1); }, 60 * 1000 * 5);
		});
};

const stop = () => {
	frozenUsers = {};
	secrets = {
		broker: {},
		security: {},
		accounts: {},
		captcha: {},
		emails: {},
		smtp: {},
		vault: {},
		plugins: {
			s3: {
				key: {},
				secret: {}
			},
			sns: {},
			freshdesk: {}
		}
	};
	configuration = {
		coins: {},
		pairs: {},
		kit: {
			info: {},
			captcha: {},
			defaults: {},
			plugins: {
				configuration: {}
			},
			status: false
		}
	};
};

const checkActivation = (name, url, activation_code, constants = {}) => {
	const options = {
		method: 'POST',
		body: {
			name,
			url,
			activation_code,
			constants
		},
		uri: `${HE_NETWORK_ENDPOINT}${HE_NETWORK_BASE_URL}${PATH_ACTIVATE}`,
		json: true
	};
	return rp(options);
};

const updateConfiguration = (type, config, value = undefined) => {
	if (value) {
		Object.assign(configuration[type][value], config);
	} else {
		Object.assign(configuration[type], config);
	}
	publisher.publish(CONFIGURATION_CHANNEL, JSON.stringify({ configuration }));
	redis.set(STATUS_FROZENUSERS_DATA, JSON.stringify({ configuration, secrets, frozenUsers }));
};

const updateSecrets = (newSecrets) => {
	Object.assign(secrets, newSecrets);
	publisher.publish(CONFIGURATION_CHANNEL, JSON.stringify({ secrets }));
	redis.set(STATUS_FROZENUSERS_DATA, JSON.stringify({ configuration, secrets, frozenUsers }));
};

const addFrozenUser = (userId) => {
	frozenUsers[userId] = true;
	publisher.publish(CONFIGURATION_CHANNEL, JSON.stringify({ frozenUsers }));
	redis.set(STATUS_FROZENUSERS_DATA, JSON.stringify({ configuration, secrets, frozenUsers }));
};

const removeFrozenUser = (userId) => {
	delete frozenUsers[userId];
	publisher.publish(CONFIGURATION_CHANNEL, JSON.stringify({ frozenUsers }));
	redis.set(STATUS_FROZENUSERS_DATA, JSON.stringify({ configuration, secrets, frozenUsers }));
};

const getKit = () => {
	return configuration.kit;
};

const getCoin = (coin) => {
	return configuration.coins[coin];
};

const getCoins = () => {
	return configuration.coins;
};

const getSecrets = () => {
	return secrets;
};

const getFrozenUsers = () => {
	return frozenUsers;
};

checkStatus();
const task = cron.schedule('0 15 * * *', () => {
	checkStatus();
}, {
	timezone: 'Asia/Seoul'
});

task.start();

module.exports = {
	checkStatus,
	checkActivation,
	getCurrencies,
	getPairs,
	getCoin,
	getCoins,
	getSecrets,
	getFrozenUsers,
	kit,
	getKit
};