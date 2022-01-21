'use strict';

const { Button } = require('./helpers/common');
const { GET_EMAIL, GET_KIT_CONFIG } = require('../../constants');
const API_NAME = () => GET_KIT_CONFIG().api_name;

const fetchMessage = (email, data, language, domain) => {
	const emailConfigurations = GET_EMAIL();
	if(emailConfigurations[language] && emailConfigurations[language]['SIGNUP']) {
		const stringDynamic = emailConfigurations[language]['SIGNUP'];
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
	const link = `${domain}/verify/${data}`;
	const SIGNUP = require('../strings').getStringObject(language, 'SIGNUP');
	return `
	<div>
		<p>
		${SIGNUP.GREETING(email)}
		</p>
		<p>
		${SIGNUP.BODY[1]()}
		</p>
		<p>
		${SIGNUP.BODY[2]}
		</p>
		${Button(link, SIGNUP.BODY[3])}
		<p>
		${SIGNUP.CLOSING[1]}<br />
		${SIGNUP.CLOSING[2]()}
		</p>
	</div>
	`;
};

const text = (email, data, language, domain) => {
	const link = `${domain}/verify/${data}`;
	const SIGNUP = require('../strings').getStringObject(language, 'SIGNUP');
	return `
	${SIGNUP.GREETING(email)}
	${SIGNUP.BODY[1]()}
	${SIGNUP.BODY[2]}
	${SIGNUP.BODY[3]}(${link})
	${SIGNUP.CLOSING[1]} ${SIGNUP.CLOSING[2]()}
	`;
};

const htmlDynamic = (email, data, language, domain, stringDynamic) => {
	const link = `${domain}/verify/${data}`;
	const SIGNUP = require('../strings').getStringObject(language, 'SIGNUP');
	return `
    <div>
      <p>
        ${stringDynamic.GREETING ? stringDynamic.GREETING.format(email) : SIGNUP.GREETING(email)}
      </p>
      <p>
        ${(stringDynamic.BODY && stringDynamic.BODY[1]) ? stringDynamic.BODY[1]() : SIGNUP.BODY[1]()}<br />
      </p>
      <p>
        ${(stringDynamic.BODY && stringDynamic.BODY[2]) ? stringDynamic.BODY[2] : SIGNUP.BODY[2]}
      </p>
      ${Button(link, (stringDynamic.BODY && stringDynamic.BODY[3]) ? stringDynamic.BODY[3] : SIGNUP.BODY[3])}
      <p>
      	${(stringDynamic.CLOSING && stringDynamic.CLOSING[1]) ? stringDynamic.CLOSING[1] : SIGNUP.CLOSING[1]}<br />
        	${(stringDynamic.CLOSING && stringDynamic.CLOSING[2]) ? stringDynamic.CLOSING[2].format(API_NAME()) : SIGNUP.CLOSING[2]()}
      </p>
    </div>
  `;
};

const textDynamic = (email, data, language, domain, stringDynamic) => {
	const link = `${domain}/verify/${data}`;
	const SIGNUP = require('../strings').getStringObject(language, 'SIGNUP');
	return `
    ${stringDynamic.GREETING ? stringDynamic.GREETING.format(email) : SIGNUP.GREETING(email)}
    ${(stringDynamic.BODY && stringDynamic.BODY[1]) ? stringDynamic.BODY[1]() : SIGNUP.BODY[1]()}
    ${(stringDynamic.BODY && stringDynamic.BODY[2]) ? stringDynamic.BODY[2] : SIGNUP.BODY[2]}
    ${(stringDynamic.BODY && stringDynamic.BODY[3]) ? stringDynamic.BODY[3] : SIGNUP.BODY[3]}(${link})
	 ${(stringDynamic.CLOSING && stringDynamic.CLOSING[1]) ? stringDynamic.CLOSING[1] : SIGNUP.CLOSING[1]} ${(stringDynamic.CLOSING && stringDynamic.CLOSING[2]) ? stringDynamic.CLOSING[2].format(API_NAME()) : SIGNUP.CLOSING[2]()}
  `;
};

module.exports = fetchMessage;
