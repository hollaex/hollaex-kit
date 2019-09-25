'use strict';

const fetchMessage = (email, data, language, domain) => {
	return {
		html: html(email, data, language, domain),
		text: text(email, data, language, domain)
	};
};

const html = (email, data, language, domain) => {
	const { DEPOSITDOUBLESPENT } = require(`../strings/${language}`);
	return `
    <div>
      <h3>${DEPOSITDOUBLESPENT.BODY[1]}</h3>
      <div>
        ${DEPOSITDOUBLESPENT.BODY[2](email)}<br />
        ${DEPOSITDOUBLESPENT.BODY[3](data.txid)}
        <h4>${DEPOSITDOUBLESPENT.BODY[4]}</h4>
        <div>${DEPOSITDOUBLESPENT.BODY[5](data)}</div>
      </div>
    </div>
  `;
};

const text = (email, data, language, domain) => {
	const { DEPOSITDOUBLESPENT } = require(`../strings/${language}`);
	return `
    ${DEPOSITDOUBLESPENT.BODY[1]}
    ${DEPOSITDOUBLESPENT.BODY[2](email)}
    ${DEPOSITDOUBLESPENT.BODY[3](data.txid)}
    ${DEPOSITDOUBLESPENT.BODY[4]} ${DEPOSITDOUBLESPENT.BODY[5](data)}
  `;
};

module.exports = fetchMessage;
