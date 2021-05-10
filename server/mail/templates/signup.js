'use strict';

const { Button } = require('./helpers/common');

const fetchMessage = (email, data, language, domain) => {
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

module.exports = fetchMessage;
