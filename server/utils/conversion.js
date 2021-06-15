'use strict';

const toBool = (value) => {
	return value === 'true' ? true : value === 'false' ? false : value;
};

const errorMessageConverter = (error) => {
	let message = error.message;

	if (error.name === 'SequelizeValidationError') {
		message = error.errors[0].message;
	} else if (error.statusCode) {
		if (typeof error.error === 'string') {
			try {
				error.error = JSON.parse(error.error);
				message = error.error.message;
			} catch (err) {
				message = error.message;
			}
		} else if (error.error.message) {
			message = error.error.message;
		}
	}

	return message;
};

module.exports = {
	toBool,
	errorMessageConverter
};