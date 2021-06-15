'use strict';

const fetchMessage = (email, data, language, domain) => {
	return {
		html: html(email, data, language, domain),
		text: text(email, data, language, domain)
	};
};

const html = (email, data, language, domain) => {
	const ALERT = require('../strings').getStringObject(language, 'ALERT');
	return `
		<div>
			<h3>${ALERT.BODY[1](data.type)}</h3>
			<div>
				<pre>${JSON.stringify(data.data, undefined, 2)}</pre>
			</div>
		</div>
	`;
};

const text = (email, data, language, domain) => {
	const ALERT = require('../strings').getStringObject(language, 'ALERT');
	return `
		${ALERT.BODY[1](data.type)}
		${data.data}
	`;
};

module.exports = fetchMessage;
