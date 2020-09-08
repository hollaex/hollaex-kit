'use strict';

const { SERVER_PATH } = require('../constants');
const { getKit, getSecrets, getCoins, getPairs } = require(`${SERVER_PATH}/init`);
const { SECRET_MASK } = require(`${SERVER_PATH}/constants`);
const { each } = require('lodash');

/**
 * Checks if url given is a valid url.
 * @param {string} url - Ids of frozen users.
 * @returns {boolean} True if url is valid. False if not.
 */
const isUrl = (url) => {
	const pattern = /^(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)$/;
	return pattern.test(url);
};

const getKitConfig = () => {
	return getKit();
};

const getKitSecrets = () => {
	return getSecrets();
};

const getKitCoins = () => {
	return getCoins();
};

const getKitPairs = () => {
	return getPairs();
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

module.exports = {
	isUrl,
	getKitConfig,
	getKitSecrets,
	getKitCoins,
	getKitPairs,
	maskSecrets
};
