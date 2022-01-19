'use strict';

const fetchMessage = (email, data, language, domain) => {
	return {
		html: html(email, data, language, domain),
		text: text(email, data, language, domain)
	};
};

const html = (email, data, language, domain) => {
	const PASSWORDCHANGED = require('../strings').getStringObject(language, 'PASSWORDCHANGED');
	return `
	<div>
		<p>
		${PASSWORDCHANGED.GREETING(email)}
		</p>
		<p>
		${PASSWORDCHANGED.BODY[1]}<br />
		${PASSWORDCHANGED.BODY[2]}<br />
		</p>
		<p>
		${PASSWORDCHANGED.CLOSING[1]}<br />
		${PASSWORDCHANGED.CLOSING[2]()}
		</p>
	</div>
	`;
};

const text = (email, data, language, domain) => {
	const PASSWORDCHANGED = require('../strings').getStringObject(language, 'PASSWORDCHANGED');
	return `
	${PASSWORDCHANGED.GREETING(email)}.
	${PASSWORDCHANGED.BODY[1]}
	${PASSWORDCHANGED.BODY[2]}
	${PASSWORDCHANGED.CLOSING[1]}
	${PASSWORDCHANGED.CLOSING[2]()}
	`;
};

module.exports = fetchMessage;
