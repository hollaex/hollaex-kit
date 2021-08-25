'use strict';

const { Button } = require('./helpers/common');
const fetchMessage = (email, data, language, domain) => {
	return {
		html: html(email, data, language, domain),
		text: text(email, data, language, domain)
	};
};

const html = (email, data, language, domain) => {
	const link = `${domain}/confirm-change-password/${data.code}`;
  const CHANGEPASSWORD = require('../strings').getStringObject(language, 'CHANGEPASSWORD');
	return `
    <div>
      <p>
        ${CHANGEPASSWORD.GREETING(email)}
      </p>
      <p>
        ${CHANGEPASSWORD.BODY[1]}<br />
        ${CHANGEPASSWORD.BODY[2]}<br />
      </p>
      ${Button(link, CHANGEPASSWORD.BODY[3])}
      <p>
        ${CHANGEPASSWORD.BODY[4]}
      </p>
      <p>
        ${CHANGEPASSWORD.BODY[5](data.ip)}
      </p>
      <p>
        ${CHANGEPASSWORD.CLOSING[1]}<br />
        ${CHANGEPASSWORD.CLOSING[2]()}
      </p>
    </div>
  `;
};

const text = (email, data, language, domain) => {
	const link = `${domain}/change-password-confirm/${data.code}`;
  const CHANGEPASSWORD = require('../strings').getStringObject(language, 'CHANGEPASSWORD');
	return `
    ${CHANGEPASSWORD.GREETING(email)}.
    ${CHANGEPASSWORD.BODY[1]}
    ${CHANGEPASSWORD.BODY[2]}
    ${CHANGEPASSWORD.BODY[3]}(${link})
    ${CHANGEPASSWORD.BODY[4]}
    ${CHANGEPASSWORD.BODY[5](data.ip)}
    ${CHANGEPASSWORD.CLOSING[1]}
    ${CHANGEPASSWORD.CLOSING[2]()}
  `;
};

module.exports = fetchMessage;
