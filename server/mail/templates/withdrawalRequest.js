'use strict';

const { Button } = require('./helpers/common');
const { GET_EMAIL, GET_KIT_CONFIG } = require('../../constants');
const API_NAME = () => GET_KIT_CONFIG().api_name;

const fetchMessage = (email, data, language, domain) => {
	const emailConfigurations = GET_EMAIL();
	if(emailConfigurations[language] && emailConfigurations[language]['WITHDRAWALREQUEST']) {
		const stringDynamic = emailConfigurations[language]['WITHDRAWALREQUEST'];
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
	const WITHDRAWALREQUEST = require('../strings').getStringObject(language, 'WITHDRAWALREQUEST');
	const link = data.confirmation_link || `${domain}/confirm-withdraw/${data.transaction_id}`;
	return `
		<div>
			<p>
				${WITHDRAWALREQUEST.GREETING(email)}
			</p>
			<p>
				${WITHDRAWALREQUEST.BODY[1](data.currency, data.amount, data.address)}<br /><br />
				${WITHDRAWALREQUEST.BODY[2](data.amount)}<br />
				${data.fee ? `${WITHDRAWALREQUEST.BODY[3](data.fee)} ${data.fee_coin || data.currency}<br />` : ''}
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
	const link = data.confirmation_link || `${domain}/confirm-withdraw/${data.transaction_id}`;
	return `
		${WITHDRAWALREQUEST.GREETING(email)}
		${WITHDRAWALREQUEST.BODY[1](data.currency, data.amount, data.address)}
		${WITHDRAWALREQUEST.BODY[2](data.amount)}
		${data.fee ? `${WITHDRAWALREQUEST.BODY[3](data.fee)} ${data.fee_coin || data.currency}` : ''}
		${WITHDRAWALREQUEST.BODY[4](data.address)}
		${data.network ? `${WITHDRAWALREQUEST.BODY[5](data.network)}` : ''}
		${WITHDRAWALREQUEST.BODY[6]}
		${Button(link, WITHDRAWALREQUEST.BODY[7])}
		${WITHDRAWALREQUEST.CLOSING[1]} ${WITHDRAWALREQUEST.CLOSING[2]()}
	`;
};

const htmlDynamic = (email, data, language, domain, stringDynamic) => {
	const link = `${domain}/confirm-withdraw/${data.transaction_id}`;
	return `
		<div>
			<p>
				${stringDynamic.GREETING.format(email)}
			</p>
			<p>
				${stringDynamic.BODY[1].format(data.currency, data.amount, data.address)}<br /><br />
				${stringDynamic.BODY[2].format(data.amount)}<br />
				${stringDynamic.BODY[3].format(data.fee)}<br />
				${stringDynamic.BODY[4].format(data.address)}<br />
				${data.network ? `${stringDynamic.BODY[5].format(data.network)}<br /><br />` : '<br />'}
				${stringDynamic.BODY[6]}<br />
			</p>
			<p>
			${Button(link, stringDynamic.BODY[7])}
			</p>
			<p>
				${stringDynamic.BODY[8]}
			</p>
			<p>
				${stringDynamic.BODY[9].format(data.ip)}
			</p>
			<p>
				${stringDynamic.CLOSING[1]}<br />
				${stringDynamic.CLOSING[2].format(API_NAME())}
			</p>
		</div>
	`;
};

const textDynamic = (email, data, language, domain, stringDynamic) => {
	const link = `${domain}/confirm-withdraw/${data.transaction_id}`;
	return `
		${stringDynamic.GREETING.format(email)}
		${stringDynamic.BODY[1].format(data.currency, data.amount, data.address)}
		${stringDynamic.BODY[2].format(data.amount)}
		${stringDynamic.BODY[3].format(data.fee)}
		${stringDynamic.BODY[4].format(data.address)}
		${data.network ? `${stringDynamic.BODY[5].format(data.network)}` : ''}
		${stringDynamic.BODY[6]}
		${Button(link, stringDynamic.BODY[7])}
		${stringDynamic.CLOSING[1]} ${stringDynamic.CLOSING[2].format(API_NAME())}
	`;
};
module.exports = fetchMessage;
