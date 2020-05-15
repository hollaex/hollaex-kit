'use strict';

/**
 * Checks if url given is a valid url.
 * @param {string} url - Ids of frozen users.
 * @returns {boolean} True if url is valid. False if not.
 */
const isUrl = (url) => {
	const pattern = /^(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)$/;
	return pattern.test(url);
};

module.exports = {
	isUrl
};