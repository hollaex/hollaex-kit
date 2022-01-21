'use strict';

const { GET_EMAIL, GET_KIT_CONFIG } = require('../../constants');
const API_NAME = () => GET_KIT_CONFIG().api_name;

const fetchMessage = (email, data, language, domain) => {
	const emailConfigurations = GET_EMAIL();
	if(emailConfigurations[language] && emailConfigurations[language]['USERVERIFICATIONREJECT']) {
		const stringDynamic = emailConfigurations[language]['USERVERIFICATIONREJECT'];
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
	const USERVERIFICATIONREJECT = require('../strings').getStringObject(language, 'USERVERIFICATIONREJECT');
	return `
	<div>
		<p>
		${USERVERIFICATIONREJECT.GREETING(email)}
		</p>
		<p>${USERVERIFICATIONREJECT.BODY[1](data.type)}</p>
		<p>${USERVERIFICATIONREJECT.BODY[2](data.message)}</p>
		<p>
		${USERVERIFICATIONREJECT.CLOSING[1]}<br />
		${USERVERIFICATIONREJECT.CLOSING[2]()}
		</p>
	</div>
	`;
};

const text = (email, data, language, domain) => {
	const USERVERIFICATIONREJECT = require('../strings').getStringObject(language, 'USERVERIFICATIONREJECT');
	return `
	${USERVERIFICATIONREJECT.GREETING(email)}
	${USERVERIFICATIONREJECT.BODY[1](data.type)}
	${USERVERIFICATIONREJECT.BODY[2](data.message)}
	${USERVERIFICATIONREJECT.CLOSING[1]} ${USERVERIFICATIONREJECT.CLOSING[2]()}
	`;
};

const htmlDynamic = (email, data, language, domain, stringDynamic) => {
	const USERVERIFICATIONREJECT = require('../strings').getStringObject(language, 'USERVERIFICATIONREJECT');

	return `
    <div>
      <p>
        ${stringDynamic.GREETING ? stringDynamic.GREETING.format(email) : USERVERIFICATIONREJECT.GREETING(email)}
      </p>
      <p>${(stringDynamic.BODY && stringDynamic.BODY[1]) ? stringDynamic.BODY[1].format(data.type) : USERVERIFICATIONREJECT.BODY[1](data.type)}</p>
      <p>${(stringDynamic.BODY && stringDynamic.BODY[2]) ? stringDynamic.BODY[2].format(data.message) : USERVERIFICATIONREJECT.BODY[2](data.message)}</p>
      <p>
      	${(stringDynamic.CLOSING && stringDynamic.CLOSING[1]) ? stringDynamic.CLOSING[1] : USERVERIFICATIONREJECT.CLOSING[1]}<br />
        	${(stringDynamic.CLOSING && stringDynamic.CLOSING[2]) ? stringDynamic.CLOSING[2].format(API_NAME()) : USERVERIFICATIONREJECT.CLOSING[2]()}
      </p>
    </div>
  `;
};

const textDynamic = (email, data, language, domain, stringDynamic) => {
	const USERVERIFICATIONREJECT = require('../strings').getStringObject(language, 'USERVERIFICATIONREJECT');

	return `
    ${stringDynamic.GREETING ? stringDynamic.GREETING.format(email) : USERVERIFICATIONREJECT.GREETING(email)}
    ${(stringDynamic.BODY && stringDynamic.BODY[1]) ? stringDynamic.BODY[1].format(data.type) : USERVERIFICATIONREJECT.BODY[1](data.type)}
    ${(stringDynamic.BODY && stringDynamic.BODY[2]) ? stringDynamic.BODY[2].format(data.message) : USERVERIFICATIONREJECT.BODY[2](data.message)}
	 ${(stringDynamic.CLOSING && stringDynamic.CLOSING[1]) ? stringDynamic.CLOSING[1] : USERVERIFICATIONREJECT.CLOSING[1]} ${(stringDynamic.CLOSING && stringDynamic.CLOSING[2]) ? stringDynamic.CLOSING[2].format(API_NAME()) : USERVERIFICATIONREJECT.CLOSING[2]()}
  `;
};

module.exports = fetchMessage;
