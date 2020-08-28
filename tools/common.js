'use strict';

const { SERVER_PATH } = require('../constant');
const { getKit, getSecrets } = require(`${SERVER_PATH}/init`);

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

};

module.exports = {
	isUrl
};
