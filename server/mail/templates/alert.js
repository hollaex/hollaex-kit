'use strict';

const { GET_EMAIL } = require('../../constants');
const fetchMessage = (email, data, language, domain) => {
	const emailConfigurations = GET_EMAIL();
	if(emailConfigurations[language] && emailConfigurations[language]['ALERT']) {
		const stringDynamic = emailConfigurations[language]['ALERT'];
		return {
			html: htmlDynamic(email, data, language, domain, stringDynamic),
			text: textDynamic(email, data, language, domain, stringDynamic)
		};
	}
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

const htmlDynamic = (email, data, language, domain, stringDynamic) => {
	const ALERT = require('../strings').getStringObject(language, 'ALERT');

	return `
		<div>
			<h3>${(stringDynamic.BODY && stringDynamic.BODY[1]) ? stringDynamic.BODY[1].format(data.type) : ALERT.BODY[1](data.type)}</h3>
			<div>
				<pre>${JSON.stringify(data.data, undefined, 2)}</pre>
			</div>
		</div>
	`;
};

const textDynamic = (email, data, language, domain, stringDynamic) => {
	const ALERT = require('../strings').getStringObject(language, 'ALERT');

	return `
		${(stringDynamic.BODY && stringDynamic.BODY[1]) ? stringDynamic.BODY[1].format(data.type) : ALERT.BODY[1](data.type)}
		${data.data}
	`;
};

module.exports = fetchMessage;
