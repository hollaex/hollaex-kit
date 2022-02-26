'use strict';

const { GET_EMAIL, GET_KIT_CONFIG } = require('../../constants');
const API_NAME = () => GET_KIT_CONFIG().api_name;

const fetchMessage = (email, data, language, domain) => {
	const emailConfigurations = GET_EMAIL();
	if(emailConfigurations[language] && emailConfigurations[language]['LOGIN']) {
		const stringDynamic = emailConfigurations[language]['LOGIN'];
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
	const LOGIN = require('../strings').getStringObject(language, 'LOGIN');
	return `
	<div>
		<p>
		${LOGIN.GREETING(email)}
		</p>
		<p>
		${LOGIN.BODY[1]}
		</p>
		<div>
		${data.time ? `<div>${LOGIN.BODY[2](data.time)}</div>` : ''}
		${data.country ? `<div>${LOGIN.BODY[3](data.country)}</div>` : ''}
		${/* data.device ? `<div>${LOGIN.BODY[4](data.device)}</div>` : */ '' }
		${data.ip ? `<div>${LOGIN.BODY[5](data.ip)}</div>` : ''}
		</div>
		<p>
		${LOGIN.BODY[6]}
		</p>
		<p>
		${LOGIN.CLOSING[1]}<br />
		${LOGIN.CLOSING[2]()}
		</p>
	</div>
	`;
};

const text = (email, data, language, domain) => {
	const LOGIN = require('../strings').getStringObject(language, 'LOGIN');
	return `
	${LOGIN.GREETING(email)}
	${LOGIN.BODY[1]}
	${data.time ? `<div>${LOGIN.BODY[2](data.time)}</div>` : ''}
	${data.country ? `<div>${LOGIN.BODY[3](data.country)}</div>` : ''}
	${/* false && data.device ? `<div>${LOGIN.BODY[4](data.device)}</div>` : */ ''}
	${data.ip ? `<div>${LOGIN.BODY[5](data.ip)}</div>` : ''}
	${LOGIN.BODY[6]}
	${LOGIN.CLOSING[1]} ${LOGIN.CLOSING[2]()}
	`;
};

const htmlDynamic = (email, data, language, domain, stringDynamic) => {
	const LOGIN = require('../strings').getStringObject(language, 'LOGIN');

	return `
    <div>
      <p>
        ${(stringDynamic.GREETING && stringDynamic.GREETING.format(email)) ? stringDynamic.GREETING.format(email) : LOGIN.GREETING(email)}
      </p>
      <p>
        ${(stringDynamic.BODY && stringDynamic.BODY[1]) ? stringDynamic.BODY[1] : LOGIN.BODY[1]}
      </p>
      <div>
        ${data.time ? `<div>${(stringDynamic.BODY && stringDynamic.BODY[2]) ? stringDynamic.BODY[2].format(data.time) : LOGIN.BODY[2](data.time)}</div>` : ''}
        ${data.country ? `<div>${(stringDynamic.BODY && stringDynamic.BODY[3]) ? stringDynamic.BODY[3].format(data.country) : LOGIN.BODY[3](data.country)}</div>` : ''}
       
        ${data.ip ? `<div>${(stringDynamic.BODY && stringDynamic.BODY[5]) ? stringDynamic.BODY[5].format(data.ip) : LOGIN.BODY[5](data.ip)}</div>` : ''}
      </div>
      <p>
        ${(stringDynamic.BODY && stringDynamic.BODY[6]) ? stringDynamic.BODY[6] : LOGIN.BODY[6]}
      </p>
      <p>
        ${(stringDynamic.CLOSING && stringDynamic.CLOSING[1]) ? stringDynamic.CLOSING[1] : LOGIN.CLOSING[1]}<br />
        ${(stringDynamic.CLOSING && stringDynamic.CLOSING[2]) ? stringDynamic.CLOSING[2].format(API_NAME()) : LOGIN.CLOSING[2]()}
      </p>
    </div>
  `;
};

const textDynamic = (email, data, language, domain, stringDynamic) => {
	const LOGIN = require('../strings').getStringObject(language, 'LOGIN');

	return `
    ${(stringDynamic.GREETING && stringDynamic.GREETING.format(email)) ? stringDynamic.GREETING.format(email) : LOGIN.GREETING(email)}
    ${(stringDynamic.BODY && stringDynamic.BODY[1]) ? stringDynamic.BODY[1] : LOGIN.BODY[1]}
    ${data.time ? `<div>${(stringDynamic.BODY && stringDynamic.BODY[2]) ? stringDynamic.BODY[2].format(data.time) : LOGIN.BODY[2](data.time)}</div>` : ''}
    ${data.country ? `<div>${(stringDynamic.BODY && stringDynamic.BODY[3]) ? stringDynamic.BODY[3].format(data.country) : LOGIN.BODY[3](data.country)}</div>` : ''}
    // ${false && data.device ? `<div>${(stringDynamic.BODY && stringDynamic.BODY[4]) ? stringDynamic.BODY[4].format(data.device) : LOGIN.BODY[4](data.device)}</div>` : ''}
    ${data.ip ? `<div>${(stringDynamic.BODY && stringDynamic.BODY[5]) ? stringDynamic.BODY[5].format(data.ip) : LOGIN.BODY[5](data.ip)}</div>` : ''}
    ${(stringDynamic.BODY && stringDynamic.BODY[6]) ? stringDynamic.BODY[6] : LOGIN.BODY[6]}
    ${(stringDynamic.CLOSING && stringDynamic.CLOSING[1]) ? stringDynamic.CLOSING[1] : LOGIN.CLOSING[1]} ${(stringDynamic.CLOSING && stringDynamic.CLOSING[2]) ? stringDynamic.CLOSING[2].format(API_NAME()) : LOGIN.CLOSING[2]()}
  `;
};

module.exports = fetchMessage;
