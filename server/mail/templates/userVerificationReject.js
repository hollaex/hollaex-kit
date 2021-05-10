'use strict';

const fetchMessage = (email, data, language, domain) => {
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

module.exports = fetchMessage;
