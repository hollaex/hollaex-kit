'use strict';

const { GET_EMAIL } = require('../../constants');
const fetchMessage = (email, data, language, domain) => {
	const emailConfigurations = GET_EMAIL();
	if(emailConfigurations[language] && emailConfigurations[language]['CONTACTFORM']) {
		const stringDynamic = emailConfigurations[language]['CONTACTFORM'];
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

const htmlDynamic = (email, data, language, domain, stringDynamic) => {
	return `
    <div>
      <h3>
        ${stringDynamic.BODY[1]}
      </h3>
      <div>
        ${stringDynamic.BODY[2].format(email)}<br />
        ${stringDynamic.BODY[3].format(data)}
      </div>
    </div>
  `;
};

const textDynamic = (email, data, language, domain, stringDynamic) => {
	return `
    ${stringDynamic.BODY[1]}
    ${stringDynamic.BODY[2].format(email)}
    ${stringDynamic.BODY[3].format(data)}
  `;
};

module.exports = fetchMessage;
