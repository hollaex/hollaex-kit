'use strict';

const { DOMAIN, DEFAULT_LANGUAGE, API_NAME } = require('../../constants');
const { TemplateEmail } = require('./helpers/common');
const { MAILTYPE } = require('../strings');

const generateMessageContent = (
	type,
	email,
	data = {},
	language = DEFAULT_LANGUAGE,
	domain = DOMAIN
) => {
	const STRINGS = require(`../strings/${language}`);
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
