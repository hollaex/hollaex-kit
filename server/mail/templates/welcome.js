'use strict';

const fetchMessage = (email, data, language, domain) => {
	return {
		html: html(email, data, language, domain),
		text: text(email, data, language, domain)
	};
};

const html = (email, data, language, domain) => {
	const linkAccount = `${domain}/account`;
	const linkDeposit = `${domain}/deposit`;
  const WELCOME = require('../strings').getStringObject(language, 'WELCOME');
	return `
    <div>
      <p>
        ${WELCOME.GREETING(email)}
      </p>
      <p>
        ${WELCOME.BODY[1]()}
      </p>
      <p>
        ${WELCOME.BODY[2](
          `<a href="${linkAccount}" target="_blank">${WELCOME.BODY[3]}</a>`,
          `<a href="${linkDeposit}" target="_blank">${WELCOME.BODY[4]}</a>`
        )}
      </p>
      <p>
        ${WELCOME.BODY[5]}
      </p>
      <p>
        ${WELCOME.CLOSING[1]}<br />
        ${WELCOME.CLOSING[2]()}
      </p>
    </div>
  `;
};

const text = (email, data, language, domain) => {
	const linkAccount = `${domain}/account`;
	const linkDeposit = `${domain}/deposit`;
  const WELCOME = require('../strings').getStringObject(language, 'WELCOME');
	return `
    ${WELCOME.GREETING(email)}
    ${WELCOME.BODY[1]()}
    ${WELCOME.BODY[2](
			`${WELCOME.BODY[3]}(${linkAccount})`,
			`${WELCOME.BODY[4]}(${linkDeposit})`
		)}
    ${WELCOME.BODY[5]}
    ${WELCOME.CLOSING[1]} ${WELCOME.CLOSING[2]()}
  `;
};

module.exports = fetchMessage;
