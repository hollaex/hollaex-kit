'use strict';

const DOMAIN = process.env.DOMAIN || (process.env.NODE_ENV === 'production' ? 'https://hollaex.com' : 'http://localhost:3000');
const DEFAULT_LANGUAGE = process.env.NEW_USER_DEFAULT_LANGUAGE || 'en';
const API_NAME = process.env.API_NAME || 'HollaEx';
const { TemplateEmail } = require('./helpers/common');
const { MAILTYPE } = require('../strings');

const generateMessageContent = (
	type,
	email,
	data = {},
	language = DEFAULT_LANGUAGE,
	domain = DOMAIN
) => {
	const STRINGS = require('../strings').languageFile(language);
	let title;
	if (
		type === MAILTYPE.WITHDRAWAL ||
		type === MAILTYPE.DEPOSIT ||
		type === MAILTYPE.WITHDRAWAL_REQUEST
	) {
		title = STRINGS[type.toUpperCase()].TITLE(data.currency);
	} else if (type === MAILTYPE.DEPOSIT_CANCEL) {
		title = STRINGS[type.toUpperCase()].TITLE(data.currency, data.type);
	} else if (type === MAILTYPE.USER_VERIFICATION_REJECT) {
		title = STRINGS[type.toUpperCase()].TITLE(data.type);
	} else {
		title = STRINGS[type.toUpperCase()].TITLE;
	}
	const subject = `${API_NAME} ${title}`;
	const message = require(`./${type}`)(email, data, language, domain);
	const result = {
		subject: subject,
		html: TemplateEmail({ title }, message.html, language, domain),
		text: message.text
	};
	return result;
};

module.exports = generateMessageContent;
