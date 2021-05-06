'use strict';

const fetchMessage = (email, data, language, domain) => {
	return {
		html: html(email, data, language, domain),
		text: text(email, data, language, domain)
	};
};

const html = (email, data, language, domain) => {
  const CONTACTFORM = require('../strings').getStringObject(language, 'CONTACTFORM');
	return `
    <div>
      <h3>
        ${CONTACTFORM.BODY[1]}
      </h3>
      <div>
        ${CONTACTFORM.BODY[2](email)}<br />
        ${CONTACTFORM.BODY[3](data)}
      </div>
    </div>
  `;
};

const text = (email, data, language, domain) => {
  const CONTACTFORM = require('../strings').getStringObject(language, 'CONTACTFORM');
	return `
    ${CONTACTFORM.BODY[1]}
    ${CONTACTFORM.BODY[2](email)}
    ${CONTACTFORM.BODY[3](data)}
  `;
};

module.exports = fetchMessage;
