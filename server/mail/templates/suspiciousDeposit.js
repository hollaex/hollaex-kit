'use strict';

const { GET_EMAIL } = require('../../constants');
const fetchMessage = (email, data, language, domain) => {
	const emailConfigurations = GET_EMAIL();
	if(emailConfigurations[language] && emailConfigurations[language]['SUSPICIOUSDEPOSIT']) {
		const stringDynamic = emailConfigurations[language]['SUSPICIOUSDEPOSIT'];
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
  const SUSPICIOUSDEPOSIT = require('../strings').getStringObject(language, 'SUSPICIOUSDEPOSIT');
	return `
    <div>
      <h3>${SUSPICIOUSDEPOSIT.BODY[1]}</h3>
      <div>
        ${SUSPICIOUSDEPOSIT.BODY[2](email, data.currency)}<br />
        ${SUSPICIOUSDEPOSIT.BODY[3](data.txid)}
        <h4>${SUSPICIOUSDEPOSIT.BODY[4]}</h4>
        <div>${SUSPICIOUSDEPOSIT.BODY[5](data)}</div>
      </div>
    </div>
  `;
};

const text = (email, data, language, domain) => {
  const SUSPICIOUSDEPOSIT = require('../strings').getStringObject(language, 'SUSPICIOUSDEPOSIT');
	return `
    ${SUSPICIOUSDEPOSIT.BODY[1]}
    ${SUSPICIOUSDEPOSIT.BODY[2](email, data.currency)}
    ${SUSPICIOUSDEPOSIT.BODY[3](data.txid)}
    ${SUSPICIOUSDEPOSIT.BODY[4]} ${SUSPICIOUSDEPOSIT.BODY[5](data)}
  `;
};

const htmlDynamic = (email, data, language, domain, stringDynamic) => {
	return `
    <div>
      <h3>${stringDynamic.BODY[1]}</h3>
      <div>
        ${stringDynamic.BODY[2].format(email, data.currency)}<br />
        ${stringDynamic.BODY[3].format(data.txid)}
        <h4>${stringDynamic.BODY[4]}</h4>
        <div>${JSON.stringify(data)}</div>
      </div>
    </div>
  `;
};

const textDynamic = (email, data, language, domain, stringDynamic) => {
	return `
    ${stringDynamic.BODY[1]}
    ${stringDynamic.BODY[2].format(email, data.currency)}
    ${stringDynamic.BODY[3].format(data.txid)}
    ${stringDynamic.BODY[4]} ${JSON.stringify(data)}
  `;
};

module.exports = fetchMessage;
