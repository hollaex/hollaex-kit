'use strict';

const { SERVER_PATH } = require('../constants');
const { getKit, getSecrets, getCoins, getPairs } = require(`${SERVER_PATH}/init`);
const dbQuery = require('./database/query');
const {
	SECRET_MASK,
	KIT_CONFIG_KEYS,
	KIT_SECRETS_KEYS,
	TECH_AUTHORIZED_KIT_CONFIG,
	TECH_AUTHORIZED_KIT_SECRETS,
	ROLES,
	INIT_CHANNEL,
	SEND_CONTACT_US_EMAIL
} = require(`${SERVER_PATH}/constants`);
const { each, difference } = require('lodash');
const { publisher } = require('./database/redis');

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
	return getKit();
};

const getKitSecrets = () => {
	return getSecrets();
};

const getKitCoin = (coin) => {
	return getKitCoinsConfig()[coin];
};

const getKitCoinsConfig = () => {
	return getCoins();
};

const getKitCoins = () => {
	return Object.keys(getKitCoinsConfig());
};

const getKitPair = (pair) => {
	return getKitPairsConfig()[pair];
};

const getKitPairsConfig = () => {
	return getPairs();
};

const getKitPairs = () => {
	return Object.keys(getKitPairsConfig());
};

const maskSecrets = (secrets) => {
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
		return new Promise((resolve, reject) => reject('No new data given'));
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
			return new Promise((resolve, reject) => reject(`Tech users cannot update these values: ${unauthorizedKeys}`));
		}
	}

	return dbQuery.findOne('status', {
		attributes: ['id', 'kit'],
		raw: true
	})
		.then((status) => {
			if (Object.keys(data.kit).length > 0) {
				data.kit = joinKitConfig(status.kit, data.kit, role);
			}
			if (Object.keys(data.secrets).length > 0) {
				data.secrets = joinKitSecrets(status.secrets, data.secrets, role);
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
				INIT_CHANNEL,
				JSON.stringify({
					type: 'config', data: { kit: status.kit, secrets: status.secrets }
				})
			);
			return {
				kit: status.kit,
				secrets: maskSecrets(status.secrets)
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
	KIT_CONFIG_KEYS.forEach((key) => {
		if (newKitConfig[key]) {
			if (!Array.isArray(existingKitConfig[key]) && typeof existingKitConfig[key] === 'object') {
				joinedKitConfig[key] = { ...existingKitConfig[key], ...newKitConfig[key] };
			} else {
				joinedKitConfig[key] = newKitConfig[key];
			}
		} else {
			joinedKitConfig[key] = existingKitConfig[key];
		}
	});
	return joinedKitConfig;
};

const joinKitSecrets = (existingKitSecrets = {}, newKitSecrets = {}, role) => {
	const joinedKitSecrets = {};
	KIT_SECRETS_KEYS.forEach((key) => {
		if (newKitSecrets[key]) {
			if (role === 'tech' && key === 'emails' && newKitSecrets[key] && newKitSecrets[key].send_email_to_support !== existingKitSecrets[key].send_email_to_support) {
				return new Promise((resolve, reject) => reject('Tech users cannot update the value of send_email_copy'));
			}
			if (!Array.isArray(existingKitSecrets[key]) && typeof existingKitSecrets[key] === 'object') {
				if (Object.values(newKitSecrets[key]).includes(SECRET_MASK)) {
					return new Promise((resolve, reject) => reject('Masked value given'));
				}
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
	const { sendEmail } = require(`${SERVER_PATH}/mail`);
	const { MAILTYPE } = require(`${SERVER_PATH}/mail/strings`);

	if (!SEND_CONTACT_US_EMAIL) {
		return new Promise((resolve, reject) => reject('Cannot send email to support at this time'));
	}

	const emailData = {
		email,
		category,
		subject,
		description
	};
	return sendEmail(MAILTYPE.CONTACT_FORM, email, emailData, {});
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
	getKitPairs,
	getKitPairsConfig,
	maskSecrets,
	updateKitConfig,
	updateKitSecrets,
	updateKitConfigSecrets,
	sendEmailToSupport
};
