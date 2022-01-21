'use strict';

const { GET_EMAIL } = require('../../constants');
const fetchMessage = (email, data, language, domain) => {
	const emailConfigurations = GET_EMAIL();
	if(emailConfigurations[language] && emailConfigurations[language]['USERVERIFICATION']) {
		const stringDynamic = emailConfigurations[language]['USERVERIFICATION'];
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

const htmlDynamic = (email, data, language, domain, stringDynamic) => {
	const USERVERIFICATION = require('../strings').getStringObject(language, 'USERVERIFICATION');

	return `
		<div>
			<h3>
				${(stringDynamic.BODY && stringDynamic.BODY[1]) ? stringDynamic.BODY[1] : USERVERIFICATION.BODY[1]}
			</h3>
			<div>
				${(stringDynamic.BODY && stringDynamic.BODY[2]) ? stringDynamic.BODY[2].format(email) : USERVERIFICATION.BODY[2](email)}
			</div>
		</div>
	`;
};

const textDynamic = (email, data, language, domain, stringDynamic) => {
	const USERVERIFICATION = require('../strings').getStringObject(language, 'USERVERIFICATION');

	return `
		${(stringDynamic.BODY && stringDynamic.BODY[1]) ? stringDynamic.BODY[1] : USERVERIFICATION.BODY[1]}
		${(stringDynamic.BODY && stringDynamic.BODY[2]) ? stringDynamic.BODY[2].format(email) : USERVERIFICATION.BODY[2](email)}
	`;
};

module.exports = fetchMessage;
