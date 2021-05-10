'use strict';

const { DOMAIN, GET_KIT_CONFIG } = require('../../constants');
const DEFAULT_LANGUAGE = () => GET_KIT_CONFIG().defaults.language;
const API_NAME = () => GET_KIT_CONFIG().api_name;
const { TemplateEmail } = require('./helpers/common');
const { MAILTYPE, languageFile } = require('../strings');

const generateMessageContent = (
	type,
	email,
	data = {},
	language = DEFAULT_LANGUAGE(),
	domain = DOMAIN
) => {
	let EMAIL_STRING_OBJECT = languageFile(language)[type.toUpperCase()];
	if (!EMAIL_STRING_OBJECT) {
		EMAIL_STRING_OBJECT = languageFile('en')[type.toUpperCase()];
	}
	let title;
	if (
		type === MAILTYPE.WITHDRAWAL ||
		type === MAILTYPE.DEPOSIT ||
		type === MAILTYPE.WITHDRAWAL_REQUEST
	) {
		title = EMAIL_STRING_OBJECT.TITLE(data.currency);
	} else if (type === MAILTYPE.DEPOSIT_CANCEL) {
		title = EMAIL_STRING_OBJECT.TITLE(data.currency, data.type);
	} else if (type === MAILTYPE.USER_VERIFICATION_REJECT || type === MAILTYPE.USER_DEACTIVATED || type === MAILTYPE.ALERT) {
		title = EMAIL_STRING_OBJECT.TITLE(data.type);
	} else {
		title = EMAIL_STRING_OBJECT.TITLE;
	}
	const subject = `${API_NAME()} ${title}`;
	const message = require(`./${type}`)(email, data, language, domain);
	const result = {
		subject: subject,
		html: TemplateEmail({ title }, message.html, language, domain),
		text: message.text
	};
	return result;
};

module.exports = generateMessageContent;
