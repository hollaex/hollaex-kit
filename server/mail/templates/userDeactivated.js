'use strict';

const fetchMessage = (email, data, language, domain) => {
	return {
		html: html(email, data, language, domain),
		text: text(email, data, language, domain)
	};
};

const html = (email, data, language, domain) => {
	const USERDEACTIVATED = require('../strings').getStringObject(language, 'USERDEACTIVATED');
	return `
		<div>
			<p>
				${USERDEACTIVATED.BODY[data.type.toUpperCase()](email)}
			</p>
			<p>
				${USERDEACTIVATED.CLOSING[1]}<br />
				${USERDEACTIVATED.CLOSING[2]()}
			</p>
		</div>
	`;
};

const text = (email, data, language, domain) => {
	const USERDEACTIVATED = require('../strings').getStringObject(language, 'USERDEACTIVATED');
	return `
		${USERDEACTIVATED.BODY[data.type.toUpperCase()](email)}
		${USERDEACTIVATED.CLOSING[1]} ${USERDEACTIVATED.CLOSING[2]()}
	`;
};

module.exports = fetchMessage;
