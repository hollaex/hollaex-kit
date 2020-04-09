'use strict';

const fetchMessage = (email, data, language, domain) => {
	return {
		html: html(email, data, language, domain),
		text: text(email, data, language, domain)
	};
};

const html = (email, data, language, domain) => {
	const { USERDEACTIVATED } = require('../strings').languageFile(language);
	return `
		<div>
			${USERDEACTIVATED.BODY[data.type.toUpperCase()](data.email)}
		</div>
	`;
};

const text = (email, data, language, domain) => {
	const { USERDEACTIVATED } = require('../strings').languageFile(language);
	return `
		${USERDEACTIVATED.BODY[data.type.toUpperCase()](data.email)}
	`;
};

module.exports = fetchMessage;
