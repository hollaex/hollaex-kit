'use strict';

const { Button } = require('./helpers/common');
const fetchMessage = (email, data, language, domain) => {
	return {
		html: html(email, data, language, domain),
		text: text(email, data, language, domain)
	};
};

const html = (email, data, language, domain) => {
	const link = `${domain}/reset-password/${data.code}`;
  const RESETPASSWORD = require('../strings').getStringObject(language, 'RESETPASSWORD');
	return `
    <div>
      <p>
        ${RESETPASSWORD.GREETING(email)}
      </p>
      <p>
        ${RESETPASSWORD.BODY[1]}<br />
        ${RESETPASSWORD.BODY[2]}<br />
      </p>
      ${Button(link, RESETPASSWORD.BODY[3])}
      <p>
        ${RESETPASSWORD.BODY[4]}
      </p>
      <p>
        ${RESETPASSWORD.BODY[5](data.ip)}
      </p>
      <p>
        ${RESETPASSWORD.CLOSING[1]}<br />
        ${RESETPASSWORD.CLOSING[2]()}
      </p>
    </div>
  `;
};

const text = (email, data, language, domain) => {
	const link = `${domain}/reset-password/${data.code}`;
  const RESETPASSWORD = require('../strings').getStringObject(language, 'RESETPASSWORD');
	return `
    ${RESETPASSWORD.GREETING(email)}.
    ${RESETPASSWORD.BODY[1]}
    ${RESETPASSWORD.BODY[2]}
    ${RESETPASSWORD.BODY[3]}(${link})
    ${RESETPASSWORD.BODY[4]}
    ${RESETPASSWORD.BODY[5](data.ip)}
    ${RESETPASSWORD.CLOSING[1]}
    ${RESETPASSWORD.CLOSING[2]()}
  `;
};

module.exports = fetchMessage;
