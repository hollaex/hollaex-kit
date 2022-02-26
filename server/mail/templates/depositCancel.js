'use strict';

const { GET_EMAIL, GET_KIT_CONFIG } = require('../../constants');
const API_NAME = () => GET_KIT_CONFIG().api_name;

const fetchMessage = (email, data, language, domain) => {
	const emailConfigurations = GET_EMAIL();
	if(emailConfigurations[language] && emailConfigurations[language]['DEPOSITCANCEL']) {
		const stringDynamic = emailConfigurations[language]['DEPOSITCANCEL'];
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
	const DEPOSITCANCEL = require('../strings').getStringObject(language, 'DEPOSITCANCEL');
	return `
		<div>
			<p>
			${DEPOSITCANCEL.GREETING(email)}
			</p>
			<p>
			${DEPOSITCANCEL.BODY[data.type.toUpperCase()](
		data.currency,
		data.date,
		data.amount
	)}
			</p>
			<p>${DEPOSITCANCEL.BODY[1]}</p>
			<p>
			${DEPOSITCANCEL.BODY[2](data.transaction_id)}<br />
			${DEPOSITCANCEL.BODY[3](data.amount)}<br />
			${DEPOSITCANCEL.BODY[4]}
			</p>
			<p>
			${DEPOSITCANCEL.CLOSING[1]}<br />
			${DEPOSITCANCEL.CLOSING[2]()}
			</p>
		</div>
		`;
};

const text = (email, data, language, domain) => {
	const DEPOSITCANCEL = require('../strings').getStringObject(language, 'DEPOSITCANCEL');
	return `
	${DEPOSITCANCEL.GREETING(email)}
	${DEPOSITCANCEL.BODY[data.type.toUpperCase()](
		data.currency,
		data.date,
		data.amount
	)}
	${DEPOSITCANCEL.BODY[1]}
	${DEPOSITCANCEL.BODY[2](data.transaction_id)}
	${DEPOSITCANCEL.BODY[3](data.amount)}
	${DEPOSITCANCEL.BODY[4]}
	${DEPOSITCANCEL.CLOSING[1]} ${DEPOSITCANCEL.CLOSING[2]()}
	`;
};

const htmlDynamic = (email, data, language, domain, stringDynamic) => {
	const DEPOSITCANCEL = require('../strings').getStringObject(language, 'DEPOSITCANCEL');
	return `
        <div>
          <p>
            ${stringDynamic.GREETING ? stringDynamic.GREETING.format(email) : DEPOSITCANCEL.GREETING(email)}
          </p>
          <p>
            ${(stringDynamic.BODY && stringDynamic.BODY[data.type.toUpperCase()]) ? stringDynamic.BODY[data.type.toUpperCase()].format(
		data.currency,
		data.date,
		data.amount,
		API_NAME()
	) : DEPOSITCANCEL.BODY[data.type.toUpperCase()](
		data.currency,
		data.date,
		data.amount
	)}
          </p>
          <p>${(stringDynamic.BODY && stringDynamic.BODY[1]) ? stringDynamic.BODY[1] : DEPOSITCANCEL.BODY[1]}</p>
          <p>
            ${(stringDynamic.BODY && stringDynamic.BODY[2]) ? stringDynamic.BODY[2].format(data.transaction_id) : DEPOSITCANCEL.BODY[2](data.transaction_id)}<br />
            ${(stringDynamic.BODY && stringDynamic.BODY[3]) ?stringDynamic.BODY[3].format(data.amount) : DEPOSITCANCEL.BODY[3](data.amount)}<br />
            ${(stringDynamic.BODY && stringDynamic.BODY[4]) ? stringDynamic.BODY[4] : DEPOSITCANCEL.BODY[4]}
          </p>
          <p>
        		${(stringDynamic.CLOSING && stringDynamic.CLOSING[1]) ? stringDynamic.CLOSING[1] : DEPOSITCANCEL.CLOSING[1]}<br />
        		${(stringDynamic.CLOSING && stringDynamic.CLOSING[2]) ? stringDynamic.CLOSING[2].format(API_NAME()) : DEPOSITCANCEL.CLOSING[2]()}
      	</p>
        </div>
      `;
};

const textDynamic = (email, data, language, domain, stringDynamic) => {
	const DEPOSITCANCEL = require('../strings').getStringObject(language, 'DEPOSITCANCEL');

	return `
    ${stringDynamic.GREETING ? stringDynamic.GREETING.format(email) : DEPOSITCANCEL.GREETING(email)}
    ${(stringDynamic.BODY && stringDynamic.BODY[data.type.toUpperCase()]) ? stringDynamic.BODY[data.type.toUpperCase()].format(
		data.currency,
		data.date,
		data.amount,
		API_NAME()
	) : DEPOSITCANCEL.BODY[data.type.toUpperCase()](
		data.currency,
		data.date,
		data.amount
	)}
    ${(stringDynamic.BODY && stringDynamic.BODY[1]) ? stringDynamic.BODY[1] : DEPOSITCANCEL.BODY[1]}
    ${(stringDynamic.BODY && stringDynamic.BODY[2]) ? stringDynamic.BODY[2].format(data.transaction_id) : DEPOSITCANCEL.BODY[2](data.transaction_id)}<br />
	 ${(stringDynamic.BODY && stringDynamic.BODY[3]) ?stringDynamic.BODY[3].format(data.amount) : DEPOSITCANCEL.BODY[3](data.amount)}<br />
	 ${(stringDynamic.BODY && stringDynamic.BODY[4]) ? stringDynamic.BODY[4] : DEPOSITCANCEL.BODY[4]}
    ${(stringDynamic.CLOSING && stringDynamic.CLOSING[1]) ? stringDynamic.CLOSING[1] : DEPOSITCANCEL.CLOSING[1]} ${(stringDynamic.CLOSING && stringDynamic.CLOSING[2]) ? stringDynamic.CLOSING[2].format(API_NAME()) : DEPOSITCANCEL.CLOSING[2]()}
  `;
};

module.exports = fetchMessage;
