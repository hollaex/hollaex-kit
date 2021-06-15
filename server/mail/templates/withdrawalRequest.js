'use strict';

const { Button } = require('./helpers/common');

const fetchMessage = (email, data, language, domain) => {
	return {
		html: html(email, data, language, domain),
		text: text(email, data, language, domain)
	};
};

const html = (email, data, language, domain) => {
	const WITHDRAWALREQUEST = require('../strings').getStringObject(language, 'WITHDRAWALREQUEST');
	const link = `${domain}/confirm-withdraw/${data.transaction_id}`;
	return `
		<div>
			<p>
				${WITHDRAWALREQUEST.GREETING(email)}
			</p>
			<p>
				${WITHDRAWALREQUEST.BODY[1](data.currency, data.amount, data.address)}<br /><br />
				${WITHDRAWALREQUEST.BODY[2](data.amount)}<br />
				${WITHDRAWALREQUEST.BODY[3](data.fee)}<br />
				${WITHDRAWALREQUEST.BODY[4](data.address)}<br />
				${data.network ? `${WITHDRAWALREQUEST.BODY[5](data.network)}<br /><br />` : '<br />'}
				${WITHDRAWALREQUEST.BODY[6]}<br />
			</p>
			<p>
			${Button(link, WITHDRAWALREQUEST.BODY[7])}
			</p>
			<p>
				${WITHDRAWALREQUEST.BODY[8]}
			</p>
			<p>
				${WITHDRAWALREQUEST.BODY[9](data.ip)}
			</p>
			<p>
				${WITHDRAWALREQUEST.CLOSING[1]}<br />
				${WITHDRAWALREQUEST.CLOSING[2]()}
			</p>
		</div>
	`;
};

const text = (email, data, language, domain) => {
	const WITHDRAWALREQUEST = require('../strings').getStringObject(language, 'WITHDRAWALREQUEST');
	const link = `${domain}/confirm-withdraw/${data.transaction_id}`;
	return `
		${WITHDRAWALREQUEST.GREETING(email)}
		${WITHDRAWALREQUEST.BODY[1](data.currency, data.amount, data.address)}
		${WITHDRAWALREQUEST.BODY[2](data.amount)}
		${WITHDRAWALREQUEST.BODY[3](data.fee)}
		${WITHDRAWALREQUEST.BODY[4](data.address)}
		${data.network ? `${WITHDRAWALREQUEST.BODY[5](data.network)}` : ''}
		${WITHDRAWALREQUEST.BODY[6]}
		${Button(link, WITHDRAWALREQUEST.BODY[7])}
		${WITHDRAWALREQUEST.CLOSING[1]} ${WITHDRAWALREQUEST.CLOSING[2]()}
	`;
};

module.exports = fetchMessage;
