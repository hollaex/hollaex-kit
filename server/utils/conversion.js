'use strict';

const {
	INVALID_CAPTCHA,
	INVALID_CREDENTIALS
} = require('../messages');

const {
	getMessage, functionMessages
} = require('./lang-messages');

const toBool = (value) => {
	return value === 'true' ? true : value === 'false' ? false : value;
};

const errorMessageConverter = (error, lang = 'en') => {
	let message = error.message;

	if (error.name === 'SequelizeValidationError') {
		message = error.errors[0].message;
	} else if (error.message === INVALID_CAPTCHA) {
		message = INVALID_CREDENTIALS;
	} else if (error.statusCode) {
		if (typeof error.error === 'string') {
			try {
				error.error = JSON.parse(error.error);
				message = error.error.message;
			} catch (err) {
				message = error.message;
			}
		} else if (error.error && error.error.message) {
			message = error.error.message;
		}
	}

	let response = getMessage(message, lang);

	if (response?.message) return response;
	else {
		try {
			const messageKeys = Object.keys(functionMessages);
			const Index = Object.keys(functionMessages).findIndex(x => message.startsWith(x))
			if (Index > -1) {
				let difference = message.split(' ').filter(x => !(functionMessages[messageKeys[Index]]('')['en'].split(' ')).includes(x));
				return response = { message: functionMessages[messageKeys[Index]](difference)[lang], code: Index };
			} else return response = { message, lang };
		} catch (error) {
			return { message, lang };
		}
	}
};

module.exports = {
	toBool,
	errorMessageConverter
};