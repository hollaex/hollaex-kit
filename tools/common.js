'use strict';

const { SERVER_PATH } = require('../constants');
const dbQuery = require('./database/query');
const {
	SECRET_MASK,
	KIT_CONFIG_KEYS,
	KIT_SECRETS_KEYS,
	TECH_AUTHORIZED_KIT_CONFIG,
	TECH_AUTHORIZED_KIT_SECRETS,
	ROLES,
	CONFIGURATION_CHANNEL,
	INIT_CHANNEL,
	SEND_CONTACT_US_EMAIL,
	GET_COINS,
	GET_PAIRS,
	GET_KIT_CONFIG,
	GET_KIT_SECRETS,
	GET_FROZEN_USERS
} = require(`${SERVER_PATH}/constants`);
const { each, difference, isPlainObject } = require('lodash');
const { publisher } = require('./database/redis');
const { sendEmail } = require(`${SERVER_PATH}/mail`);
const { MAILTYPE } = require(`${SERVER_PATH}/mail/strings`);
const { reject } = require('bluebird');
const { NO_NEW_DATA, SUPPORT_DISABLED, TECH_CANNOT_UPDATE, MASK_VALUE_GIVEN } = require('../messages');
const flatten = require('flat');

/**
 * Checks if url given is a valid url.
 * @param {string} url - Ids of frozen users.
 * @returns {boolean} True if url is valid. False if not.
 */
const isUrl = (url) => {
	const pattern = /^(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)$/;
	return pattern.test(url);
};

const subscribedToCoin = (coin) => {
	return getKitCoins().includes(coin);
};

const subscribedToPair = (pair) => {
	return getKitPairs().includes(pair);
};

const getKitConfig = () => {
	return GET_KIT_CONFIG();
};

const getKitSecrets = () => {
	return GET_KIT_SECRETS();
};

const getKitCoin = (coin) => {
	return getKitCoinsConfig()[coin];
};

const getKitCoinsConfig = () => {
	return GET_COINS();
};

const getKitCoins = () => {
	return Object.keys(getKitCoinsConfig());
};

const getKitPair = (pair) => {
	return getKitPairsConfig()[pair];
};

const getKitPairsConfig = () => {
	return GET_PAIRS();
};

const getKitPairs = () => {
	return Object.keys(getKitPairsConfig());
};

const getFrozenUsers = () => {
	return GET_FROZEN_USERS();
};

const maskSecrets = (secrets) => {
	secrets = JSON.parse(JSON.stringify(secrets));
	each(secrets, (secret, secretKey) => {
		if (secretKey === 'captcha') {
			secret.secret_key = SECRET_MASK;
		} else if (secretKey === 'smtp') {
			secret.password = SECRET_MASK;
		} else if (secretKey === 'plugins') {
			each(secret, (plugin, pluginKey) => {
				if (pluginKey === 's3') {
					plugin.secret =  SECRET_MASK;
				} else if (pluginKey === 'sns') {
					plugin.secret = SECRET_MASK;
				} else if (pluginKey === 'freshdesk') {
					plugin.key = SECRET_MASK;
					plugin.auth = SECRET_MASK;
				} else if (pluginKey === 'zendesk') {
					plugin.key = SECRET_MASK;
				}
			});
		}
	});
	return secrets;
};

const updateKitConfigSecrets = (data = {}, scopes) => {
	let role = 'admin';

	if (!data.kit && !data.secrets) {
		return reject(new Error(NO_NEW_DATA));
	}

	if (scopes.indexOf(ROLES.TECH) > -1) {
		role = 'tech';
		let unauthorizedKeys = [];
		if (data.kit) {
			unauthorizedKeys = unauthorizedKeys.concat(difference(Object.keys(data.kit), TECH_AUTHORIZED_KIT_CONFIG));
		}
		if (data.secrets) {
			unauthorizedKeys = unauthorizedKeys.concat(difference(Object.keys(data.secrets), TECH_AUTHORIZED_KIT_SECRETS));
		}
		if (unauthorizedKeys.length > 0) {
			return reject(new Error(TECH_CANNOT_UPDATE(unauthorizedKeys)));
		}
	}

	return dbQuery.findOne('status', {
		attributes: ['id', 'kit', 'secrets']
	})
		.then((status) => {
			if (data.kit && Object.keys(data.kit).length > 0) {
				data.kit = joinKitConfig(status.dataValues.kit, data.kit, role);
			}
			if (data.secrets && Object.keys(data.secrets).length > 0) {
				data.secrets = joinKitSecrets(status.dataValues.secrets, data.secrets, role);
			}
			return status.update(data, {
				fields: [
					'kit',
					'secrets'
				],
				returning: true
			});
		})
		.then((status) => {
			publisher.publish(
				CONFIGURATION_CHANNEL,
				JSON.stringify({
					type: 'update', data: { kit: status.dataValues.kit, secrets: status.dataValues.secrets }
				})
			);
			return {
				kit: status.dataValues.kit,
				secrets: maskSecrets(status.dataValues.secrets)
			};
		});
};

const updateKitConfig = (kit, scopes) => {
	return updateKitConfigSecrets({ kit }, scopes);
};

const updateKitSecrets = (secrets, scopes) => {
	return updateKitConfigSecrets({ secrets }, scopes);
};

const joinKitConfig = (existingKitConfig = {}, newKitConfig = {}) => {
	const joinedKitConfig = {};
	const existingKeys = Object.keys(existingKitConfig);

	KIT_CONFIG_KEYS.forEach((key) => {
		if (newKitConfig[key] === undefined) {
			joinedKitConfig[key] = existingKitConfig[key];
		} else {
			if (isPlainObject(existingKitConfig[key])) {
				joinedKitConfig[key] = { ...existingKitConfig[key], ...newKitConfig[key] };
			} else {
				joinedKitConfig[key] = newKitConfig[key];
			}
		}
	});

	const newKeys = difference(Object.keys(newKitConfig), existingKeys);

	newKeys.forEach((key) => {
		joinedKitConfig[key] = newKitConfig[key];
	});

	return joinedKitConfig;
};

const joinKitSecrets = (existingKitSecrets = {}, newKitSecrets = {}, role) => {
	const flattenedNewKitSecrets = flatten(newKitSecrets);
	if (Object.values(flattenedNewKitSecrets).includes(SECRET_MASK)) {
		throw new Error(MASK_VALUE_GIVEN);
	}
	const joinedKitSecrets = {};
	KIT_SECRETS_KEYS.forEach((key) => {
		if (newKitSecrets[key]) {
			if (role === 'tech' && key === 'emails' && newKitSecrets[key] && newKitSecrets[key].send_email_to_support !== existingKitSecrets[key].send_email_to_support) {
				throw new Error(TECH_CANNOT_UPDATE('send_email_copy'));
			}
			if (isPlainObject(existingKitSecrets[key])) {
				joinedKitSecrets[key] = { ...existingKitSecrets[key], ...newKitSecrets[key] };
			} else {
				joinedKitSecrets[key] = newKitSecrets[key];
			}
		} else {
			joinedKitSecrets[key] = existingKitSecrets[key];
		}
	});
	return joinedKitSecrets;
};

const sendEmailToSupport = (email, category, subject, description) => {
	if (!SEND_CONTACT_US_EMAIL) {
		return reject(new Error(SUPPORT_DISABLED));
	}

	const emailData = {
		email,
		category,
		subject,
		description
	};
	return sendEmail(MAILTYPE.CONTACT_FORM, email, emailData, {});
};

const getNetworkKeySecret = () => {
	dbQuery.findOne('status')
		.then((status) => {
			return {
				apiKey: status.dataValues.api_key,
				apiSecret: status.dataValues.api_secret
			};
		});
};

const setExchangeInitialized = () => {
	return dbQuery.findOne('status')
		.then((status) => {
			if (status.dataValues.initialized === true) {
				throw new Error('Exchange already initialized');
			}
			return status.update({ initialized: true }, { returning: true, fields: ['initialized'] });
		})
		.then((status) => {
			publisher.publish(
				CONFIGURATION_CHANNEL,
				JSON.stringify({
					type: 'update', data: { info: { initialized: status.initialized } }
				})
			);
			return;
		});
};

const setExchangeSetupCompleted = () => {
	return dbQuery.findOne('status')
		.then((status) => {
			if (status.dataValues.secrets.setup_completed) {
				throw new Error('Exchange setup is already flagged as completed');
			}
			const secrets = {
				...status.dataValues.secrets,
				setup_completed: true
			};
			return status.update({
				secrets
			}, { returning: true, fields: ['secrets'] });
		})
		.then((status) => {
			publisher.publish(
				CONFIGURATION_CHANNEL,
				JSON.stringify({
					type: 'update', data: { secrets: status.secrets }
				})
			);
			return;
		});
};

const updateNetworkKeySecret = (apiKey, apiSecret) => {
	if (!apiKey || !apiSecret) {
		return reject(new Error('Must provide both key and secret'));
	}

	return dbQuery.findOne('status')
		.then((status) => {
			const secrets = joinKitSecrets(status.dataValues.secrets, { exchange_credentials_set: true });
			return status.update({
				api_key: apiKey,
				api_secret: apiSecret,
				secrets
			}, { fields: ['api_key', 'api_secret', 'secrets'] });
		})
		.then(() => {
			publisher.publish(
				INIT_CHANNEL,
				JSON.stringify({ type: 'refreshInit' })
			);
			return;
		});
};

module.exports = {
	isUrl,
	getKitConfig,
	getKitSecrets,
	subscribedToCoin,
	getKitCoin,
	getKitCoins,
	getKitCoinsConfig,
	subscribedToPair,
	getKitPair,
	getFrozenUsers,
	getKitPairs,
	getKitPairsConfig,
	maskSecrets,
	updateKitConfig,
	updateKitSecrets,
	updateKitConfigSecrets,
	sendEmailToSupport,
	getNetworkKeySecret,
	setExchangeInitialized,
	setExchangeSetupCompleted,
	updateNetworkKeySecret
};
