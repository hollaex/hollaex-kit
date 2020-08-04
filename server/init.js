'use strict';

const rp = require('request-promise');
const cron = require('node-cron');
const { getStatus, getCoinsPairs } = require('./api/helpers/status');
const { loggerGeneral } = require('./config/logger');
const { User } = require('./db/models');

const BRIDGE_ENDPOINT = 'https://api.bitholla.com/v1';

const PATH_ACTIVATE = '/exchange/activate';
const { subscriber, publisher } = require('./db/pubsub');
const { INIT_CHANNEL, CONFIGURATION_CHANNEL, STATUS_FROZENUSERS_DATA } = require('./constants');
const { omit, each } = require('lodash');
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
			case 'constants':
				updateConfiguration(type, data.constants);
				updateSecrets(data.secrets);
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
	coins: {},
	pairs: {},
	info: {},
	constants: {
		captcha: {},
		accounts: {},
		defaults: {},
		emails: {},
		plugins: {
			configuration: {}
		}
	},
	status: false
};

let secrets = {
	broker: {},
	security: {},
	captcha: {},
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
			} else if (!status.name) {
				stop();
				throw new Error('Exchange name is not set');
			} else if (!status.activation_code) {
				stop();
				throw new Error('Exchange activation code is not set');
			} else if (!status.activated) {
				stop();
				throw new Error('Exchange is expired');
			} else {
				Object.assign(secrets, status.constants.secrets);
				const constants = omit(status.constants, 'secrets');
				setConfiguration({
					constants
				});
				return checkActivation(
					status.name,
					status.url,
					status.activation_code,
					status.constants
				);
			}
		})
		.then((activation) => {
			loggerGeneral.info('init/checkStatus/activation', activation.name, activation.active);
			setConfiguration({
				info: {
					name: activation.name,
					active: activation.active,
					url: activation.url,
					is_trial: activation.is_trial,
					created_at: activation.created_at,
					expiry: activation.expiry
				}
			});
			return getCoinsPairs();
		})
		.then((coinsPairs) => {
			setConfiguration({ ...coinsPairs, status: true });
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
	secrets = {};
	setConfiguration({ coins: {}, pairs: {}, status: false, info: {}, constants: {} });
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
		uri: `${BRIDGE_ENDPOINT}${PATH_ACTIVATE}`,
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

const setConfiguration = (config) => {
	Object.assign(configuration, config);
	return configuration;
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

const getConfiguration = () => {
	return configuration;
};

const getCoin = (coin) => {
	return configuration.coins[coin];
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
	getConfiguration,
	getCurrencies,
	getPairs,
	getCoin,
	getSecrets,
	getFrozenUsers
};