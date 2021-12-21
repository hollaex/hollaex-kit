'use strict';

const { GET_EMAIL } = require('../../constants');
const fetchMessage = (email, data, language, domain) => {
	const emailConfigurations = GET_EMAIL();
	if(emailConfigurations[language] && emailConfigurations[language]['USERDEACTIVATED']) {
		const stringDynamic = emailConfigurations[language]['USERDEACTIVATED'];
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

const htmlDynamic = (email, data, language, domain, stringDynamic) => {
	return `
		<div>
			<p>
				${stringDynamic.BODY[data.type.toUpperCase()].format(email)}
			</p>
			<p>
				${stringDynamic.CLOSING[1]}<br />
				${stringDynamic.CLOSING[2]}
			</p>
		</div>
	`;
};

const textDynamic = (email, data, language, domain, stringDynamic) => {
	return `
		${stringDynamic.BODY[data.type.toUpperCase()].format(email)}
		${stringDynamic.CLOSING[1]} ${stringDynamic.CLOSING[2]}
	`;
};

module.exports = fetchMessage;
