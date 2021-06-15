'use strict';

const fetchMessage = (email, data, language, domain) => {
	return {
		html: html(email, data, language, domain),
		text: text(email, data, language, domain)
	};
};

const html = (email, data, language, domain) => {
	const USERVERIFICATION = require('../strings').getStringObject(language, 'USERVERIFICATION');
	return `
		<div>
			<h3>
				${USERVERIFICATION.BODY[1]}
			</h3>
			<div>
				${USERVERIFICATION.BODY[2](email)}
			</div>
		</div>
	`;
};

const text = (email, data, language, domain) => {
	const USERVERIFICATION = require('../strings').getStringObject(language, 'USERVERIFICATION');
	return `
		${USERVERIFICATION.BODY[1]}
		${USERVERIFICATION.BODY[2](email)}
	`;
};

module.exports = fetchMessage;
