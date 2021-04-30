'use strict';

const toBool = (value) => {
	return value === 'true' ? true : value === 'false' ? false : value;
};

const errorMessageConverter = (error) => {
	let message = error.message;

	if (error.name === 'SequelizeValidationError') {
		message = error.errors[0].message;
	} else if (error.statusCode) {
		message = error.error.message;
	}

	return message;
};

module.exports = {
	toBool,
	errorMessageConverter
};