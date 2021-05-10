'use strict';

const fetchMessage = (email, data, language, domain) => {
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

module.exports = fetchMessage;
