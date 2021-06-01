'use strict';

const fetchMessage = (email, data, language, domain) => {
	return {
		html: html(email, data, language, domain),
		text: text(email, data, language, domain)
	};
};

const html = (email, data, language, domain) => {
	const INVALIDADDRESS = require('../strings').getStringObject(language, 'INVALIDADDRESS');
	return `
		<div>
			<p>
				${INVALIDADDRESS.GREETING(email)}
			</p>
			<p>
				${INVALIDADDRESS.BODY[1](data.currency, data.amount)}
			</p>
			<p>
				${INVALIDADDRESS.BODY[2](data.address)}
			</p>
			<p>
				${INVALIDADDRESS.CLOSING[1]}<br />
				${INVALIDADDRESS.CLOSING[2]()}
			</p>
		</div>
	`;
};

const text = (email, data, language, domain) => {
	const INVALIDADDRESS = require('../strings').getStringObject(language, 'INVALIDADDRESS');
	return `
		${INVALIDADDRESS.GREETING(email)}
		${INVALIDADDRESS.BODY[1](data.currency, data.amount)}
		${INVALIDADDRESS.BODY[2](data.address)}
		${INVALIDADDRESS.CLOSING[1]} ${INVALIDADDRESS.CLOSING[2]()}
	`;
};

module.exports = fetchMessage;
