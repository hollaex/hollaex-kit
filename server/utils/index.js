'use strict';

const initializeMode = (modeString = '') => {
	let modes = [];
	modeString.split(',').forEach((mode = '') => {
		modes.push(mode.toLowerCase().trim());
	});
	return modes;
};

const safeJsonParse = (payload, defaultValue = null) => {
	if (payload === undefined || payload === null) {
		return defaultValue;
	}
	if (typeof payload === 'object') {
		return payload;
	}
	try {
		return JSON.parse(payload);
	} catch (err) {
		return defaultValue;
	}
};

module.exports = {
	initializeMode,
	safeJsonParse
};
