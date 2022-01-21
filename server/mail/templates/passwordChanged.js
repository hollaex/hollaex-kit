'use strict';

const { GET_EMAIL, GET_KIT_CONFIG } = require('../../constants');
const API_NAME = () => GET_KIT_CONFIG().api_name;

const fetchMessage = (email, data, language, domain) => {
	const emailConfigurations = GET_EMAIL();
	if (emailConfigurations[language] && emailConfigurations[language]['PASSWORDCHANGED']) {
		const stringDynamic = emailConfigurations[language]['PASSWORDCHANGED'];
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

const htmlDynamic = (email, data, language, domain, stringDynamic) => {
	const PASSWORDCHANGED = require('../strings').getStringObject(language, 'PASSWORDCHANGED');
	return `
    <div>
      <p>
        ${stringDynamic.GREETING ? stringDynamic.GREETING.format(email) : PASSWORDCHANGED.GREETING(email)}
      </p>
      <p>
        ${(stringDynamic.BODY && stringDynamic.BODY[1]) ? stringDynamic.BODY[1] : PASSWORDCHANGED.BODY[1]}<br />
        ${(stringDynamic.BODY && stringDynamic.BODY[2]) ? stringDynamic.BODY[2] : PASSWORDCHANGED.BODY[2]}<br />    
      </p>
      <p>
        	${(stringDynamic.CLOSING && stringDynamic.CLOSING[1]) ? stringDynamic.CLOSING[1] : PASSWORDCHANGED.CLOSING[1]}<br />
        	${(stringDynamic.CLOSING && stringDynamic.CLOSING[2]) ? stringDynamic.CLOSING[2].format(API_NAME()) : PASSWORDCHANGED.CLOSING[2]()}
      </p>
      </p>
    </div>
  `;
};

const textDynamic = (email, data, language, domain, stringDynamic) => {
	const PASSWORDCHANGED = require('../strings').getStringObject(language, 'PASSWORDCHANGED');
	return `
        ${stringDynamic.GREETING ? stringDynamic.GREETING.format(email) : PASSWORDCHANGED.GREETING(email)}
        ${(stringDynamic.BODY && stringDynamic.BODY[1]) ? stringDynamic.BODY[1] : PASSWORDCHANGED.BODY[1]}<br />
        ${(stringDynamic.BODY && stringDynamic.BODY[2]) ? stringDynamic.BODY[2] : PASSWORDCHANGED.BODY[2]}<br />    
    	  ${(stringDynamic.CLOSING && stringDynamic.CLOSING[1]) ? stringDynamic.CLOSING[1] : PASSWORDCHANGED.CLOSING[1]} ${(stringDynamic.CLOSING && stringDynamic.CLOSING[2]) ? stringDynamic.CLOSING[2].format(API_NAME()) : PASSWORDCHANGED.CLOSING[2]()}
  `;
};

module.exports = fetchMessage;
