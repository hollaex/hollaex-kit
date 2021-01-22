'use strict';

const toBool = (value) => {
	return value === 'true' ? true : value === 'false' ? false : value;
};

module.exports = {
	toBool
};