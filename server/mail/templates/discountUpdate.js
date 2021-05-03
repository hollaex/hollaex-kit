'use strict';

const fetchMessage = (email, data, language, domain) => {
	return {
		html: html(email, data, language, domain),
		text: text(email, data, language, domain)
	};
};

const html = (email, data, language, domain) => {
  const DISCOUNTUPDATE = require('../strings').getStringObject(language, 'DISCOUNTUPDATE');
	return `
        <div>
          <p>
            ${DISCOUNTUPDATE.GREETING(email)}
          </p>
          <p>
            ${DISCOUNTUPDATE.BODY[1](data.rate)}
          </p>
          <p>
            ${DISCOUNTUPDATE.CLOSING[1]}<br />
            ${DISCOUNTUPDATE.CLOSING[2]()}
          </p>
        </div>
      `;
};

const text = (email, data, language, domain) => {
  const DISCOUNTUPDATE = require('../strings').getStringObject(language, 'DISCOUNTUPDATE');
	return `
		${DISCOUNTUPDATE.GREETING(email)}
		${DISCOUNTUPDATE.BODY[1](data.rate)}
		${DISCOUNTUPDATE.CLOSING[1]} ${DISCOUNTUPDATE.CLOSING[2]()}
	`;
};

module.exports = fetchMessage;
