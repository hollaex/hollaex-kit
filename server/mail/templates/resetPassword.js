'use strict';

const { Button } = require('./helpers/common');
const { GET_EMAIL, GET_KIT_CONFIG } = require('../../constants');
const API_NAME = () => GET_KIT_CONFIG().api_name;

const fetchMessage = (email, data, language, domain) => {
	const emailConfigurations = GET_EMAIL();
	if(emailConfigurations[language] && emailConfigurations[language]['RESETPASSWORD']) {
		const stringDynamic = emailConfigurations[language]['RESETPASSWORD'];
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

const htmlDynamic = (email, data, language, domain, stringDynamic) => {
	const link = `${domain}/reset-password/${data.code}`;
	return `
    <div>
      <p>
        ${stringDynamic.GREETING.format(email)}
      </p>
      <p>
        ${stringDynamic.BODY[1]}<br />
        ${stringDynamic.BODY[2]}<br />
      </p>
      ${Button(link, stringDynamic.BODY[3])}
      <p>
        ${stringDynamic.BODY[4]}
      </p>
      <p>
        ${stringDynamic.BODY[5].format(data.ip)}
      </p>
      <p>
        ${stringDynamic.CLOSING[1]}<br />
        ${stringDynamic.CLOSING[2].format(API_NAME())}
      </p>
    </div>
  `;
};

const textDynamic = (email, data, language, domain, stringDynamic) => {
	const link = `${domain}/reset-password/${data.code}`;
	return `
    ${stringDynamic.GREETING.format(email)}.
    ${stringDynamic.BODY[1]}
    ${stringDynamic.BODY[2]}
    ${stringDynamic.BODY[3]}(${link})
    ${stringDynamic.BODY[4]}
    ${stringDynamic.BODY[5].format(data.ip)}
    ${stringDynamic.CLOSING[1]}
    ${stringDynamic.CLOSING[2].format(API_NAME())}
  `;
};

module.exports = fetchMessage;
