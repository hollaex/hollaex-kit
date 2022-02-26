'use strict';

const { GET_EMAIL, GET_KIT_CONFIG } = require('../../constants');
const API_NAME = () => GET_KIT_CONFIG().api_name;

const fetchMessage = (email, data, language, domain) => {
	const emailConfigurations = GET_EMAIL();
	if(emailConfigurations[language] && emailConfigurations[language]['WELCOME']) {
		const stringDynamic = emailConfigurations[language]['WELCOME'];
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
	const linkAccount = `${domain}/account`;
	const linkDeposit = `${domain}/deposit`;
	const WELCOME = require('../strings').getStringObject(language, 'WELCOME');
	return `
    <div>
      <p>
        ${WELCOME.GREETING(email)}
      </p>
      <p>
        ${WELCOME.BODY[1]()}
      </p>
      <p>
        ${WELCOME.BODY[2](
		`<a href="${linkAccount}" target="_blank">${WELCOME.BODY[3]}</a>`,
		`<a href="${linkDeposit}" target="_blank">${WELCOME.BODY[4]}</a>`
	)}
      </p>
      <p>
        ${WELCOME.BODY[5]}
      </p>
      <p>
        ${WELCOME.CLOSING[1]}<br />
        ${WELCOME.CLOSING[2]()}
      </p>
    </div>
  `;
};

const text = (email, data, language, domain) => {
	const linkAccount = `${domain}/account`;
	const linkDeposit = `${domain}/deposit`;
	const WELCOME = require('../strings').getStringObject(language, 'WELCOME');
	return `
    ${WELCOME.GREETING(email)}
    ${WELCOME.BODY[1]()}
    ${WELCOME.BODY[2](
		`${WELCOME.BODY[3]}(${linkAccount})`,
		`${WELCOME.BODY[4]}(${linkDeposit})`
	)}
    ${WELCOME.BODY[5]}
    ${WELCOME.CLOSING[1]} ${WELCOME.CLOSING[2]()}
  `;
};

const htmlDynamic = (email, data, language, domain, stringDynamic) => {
	const linkAccount = `${domain}/account`;
	const linkDeposit = `${domain}/deposit`;
	const WELCOME = require('../strings').getStringObject(language, 'WELCOME');

	return `
    <div>
      <p>
        ${stringDynamic.GREETING ? stringDynamic.GREETING.format(email) : WELCOME.GREETING(email)}
      </p>
      <p>
        ${(stringDynamic.BODY && stringDynamic.BODY[1]) ? stringDynamic.BODY[1].format(API_NAME()) : WELCOME.BODY[1]()}
      </p>
      <p>
        ${(stringDynamic.BODY && stringDynamic.BODY[2]) ? stringDynamic.BODY[2].format(
		`<a href='${linkAccount}' target='_blank'>${(stringDynamic.BODY && stringDynamic.BODY[3]) ? stringDynamic.BODY[3] : WELCOME.BODY[3]}</a>`,
		`<a href='${linkDeposit}' target='_blank'>${(stringDynamic.BODY && stringDynamic.BODY[4]) ? stringDynamic.BODY[4] : WELCOME.BODY[4]}</a>`
	) : WELCOME.BODY[2](
		`<a href='${linkAccount}' target='_blank'>${(stringDynamic.BODY && stringDynamic.BODY[3]) ? stringDynamic.BODY[3] : WELCOME.BODY[3]}</a>`,
		`<a href='${linkDeposit}' target='_blank'>${(stringDynamic.BODY && stringDynamic.BODY[4]) ? stringDynamic.BODY[4] : WELCOME.BODY[4]}</a>`
	)}
      </p>
      <p>
        ${(stringDynamic.BODY && stringDynamic.BODY[5]) ? stringDynamic.BODY[5] : WELCOME.BODY[5]}
      </p>
      <p>
      	${(stringDynamic.CLOSING && stringDynamic.CLOSING[1]) ? stringDynamic.CLOSING[1] : WELCOME.CLOSING[1]}<br />
        	${(stringDynamic.CLOSING && stringDynamic.CLOSING[2]) ? stringDynamic.CLOSING[2].format(API_NAME()) : WELCOME.CLOSING[2]()}
      </p>
    </div>
  `;
};

const textDynamic = (email, data, language, domain, stringDynamic) => {
	const linkAccount = `${domain}/account`;
	const linkDeposit = `${domain}/deposit`;
	const WELCOME = require('../strings').getStringObject(language, 'WELCOME');

	return `
    ${stringDynamic.GREETING ? stringDynamic.GREETING.format(email) : WELCOME.GREETING(email)}
    ${(stringDynamic.BODY && stringDynamic.BODY[1]) ? stringDynamic.BODY[1].format(API_NAME()) : WELCOME.BODY[1]()}
    ${(stringDynamic.BODY && stringDynamic.BODY[2]) ? stringDynamic.BODY[2].format(
		`${stringDynamic.BODY[3]}(${linkAccount})`,
		`${stringDynamic.BODY[4]}(${linkDeposit})`
	) : WELCOME.BODY[2](
		`${stringDynamic.BODY[3]}(${linkAccount})`,
		`${stringDynamic.BODY[4]}(${linkDeposit})`
	)}
    ${(stringDynamic.BODY && stringDynamic.BODY[5]) ? stringDynamic.BODY[5] : WELCOME.BODY[5]}
	 ${(stringDynamic.CLOSING && stringDynamic.CLOSING[1]) ? stringDynamic.CLOSING[1] : WELCOME.CLOSING[1]} ${(stringDynamic.CLOSING && stringDynamic.CLOSING[2]) ? stringDynamic.CLOSING[2].format(API_NAME()) : WELCOME.CLOSING[2]()}
  `;
};

module.exports = fetchMessage;
