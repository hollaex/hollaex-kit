'use strict';

const { GET_EMAIL, GET_KIT_CONFIG } = require('../../constants');
const API_NAME = () => GET_KIT_CONFIG().api_name;

const fetchMessage = (email, data, language, domain) => {
	const emailConfigurations = GET_EMAIL();
	if(emailConfigurations[language] && emailConfigurations[language]['INVALIDADDRESS']) {
		const stringDynamic = emailConfigurations[language]['INVALIDADDRESS'];
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
	const INVALIDADDRESS = require('../strings').getStringObject(language, 'INVALIDADDRESS');
	return `
		<div>
			<p>
				${INVALIDADDRESS.GREETING(email)}
			</p>
			<p>
				${INVALIDADDRESS.BODY[1](data.currency, data.amount)}
			</p>
			<p>
				${INVALIDADDRESS.BODY[2](data.address)}
			</p>
			<p>
				${INVALIDADDRESS.CLOSING[1]}<br />
				${INVALIDADDRESS.CLOSING[2]()}
			</p>
		</div>
	`;
};

const text = (email, data, language, domain) => {
	const INVALIDADDRESS = require('../strings').getStringObject(language, 'INVALIDADDRESS');
	return `
		${INVALIDADDRESS.GREETING(email)}
		${INVALIDADDRESS.BODY[1](data.currency, data.amount)}
		${INVALIDADDRESS.BODY[2](data.address)}
		${INVALIDADDRESS.CLOSING[1]} ${INVALIDADDRESS.CLOSING[2]()}
	`;
};

const htmlDynamic = (email, data, language, domain, stringDynamic) => {
	return `
		<div>
			<p>
				${stringDynamic.GREETING.format(email)}
			</p>
			<p>
				${stringDynamic.BODY[1].format(data.currency, data.amount)}
			</p>
			<p>
				${stringDynamic.BODY[2].format(data.address)}
			</p>
			<p>
				${stringDynamic.CLOSING[1]}<br />
				${stringDynamic.CLOSING[2].format(API_NAME())}
			</p>
		</div>
	`;
};

const textDynamic = (email, data, language, domain, stringDynamic) => {
	return `
		${stringDynamic.GREETING.format(email)}
		${stringDynamic.BODY[1].format(data.currency, data.amount)}
		${stringDynamic.BODY[2].format(data.address)}
		${stringDynamic.CLOSING[1]} ${stringDynamic.CLOSING[2].format(API_NAME())}
	`;
};

module.exports = fetchMessage;
