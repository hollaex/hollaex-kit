'use strict';

const initializeMode = (modeString = '') => {
	let modes = [];
	modeString.split(',').forEach((mode = '') => {
		modes.push(mode.toLowerCase().trim());
	});
	return modes;
};

module.exports = {
	initializeMode
};
