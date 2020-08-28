'use strict';

const { SERVER_PATH } = require('../constant');
const { getKit, getSecrets, getCoins, getPairs } = require(`${SERVER_PATH}/init`);

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

module.exports = {
	isUrl,
	getKitConfig,
	getKitSecrets,
	getKitCoins,
	getKitPairs
};
