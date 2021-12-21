'use strict';

const { GET_EMAIL } = require('../../constants');
const fetchMessage = (email, data, language, domain) => {
	const emailConfigurations = GET_EMAIL();
	if(emailConfigurations[language] && emailConfigurations[language]['DISCOUNTUPDATE']) {
		const stringDynamic = emailConfigurations[language]['DISCOUNTUPDATE'];
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

const htmlDynamic = (email, data, language, domain, stringDynamic) => {
	return `
        <div>
          <p>
            ${stringDynamic.GREETING.format(email)}
          </p>
          <p>
            ${stringDynamic.BODY[1](data.rate)}
          </p>
          <p>
            ${stringDynamic.CLOSING[1]}<br />
            ${stringDynamic.CLOSING[2]}
          </p>
        </div>
      `;
};

const textDynamic = (email, data, language, domain, stringDynamic) => {
	return `
		${stringDynamic.GREETING.format(email)}
		${stringDynamic.BODY[1](data.rate)}
		${stringDynamic.CLOSING[1]} ${stringDynamic.CLOSING[2]}
	`;
};

module.exports = fetchMessage;
