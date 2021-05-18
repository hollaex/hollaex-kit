'use strict';

const fetchMessage = (email, data, language, domain) => {
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

module.exports = fetchMessage;
