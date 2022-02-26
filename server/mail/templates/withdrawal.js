'use strict';

const { GET_COINS, EXPLORERS, GET_KIT_CONFIG, GET_EMAIL } = require('../../constants');
const API_NAME = () => GET_KIT_CONFIG().api_name;

const fetchMessage = (email, data, language, domain) => {
	const emailConfigurations = GET_EMAIL();
	if(emailConfigurations[language] && emailConfigurations[language]['WITHDRAWAL']) {
		const stringDynamic = emailConfigurations[language]['WITHDRAWAL'];
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
	const WITHDRAWAL = require('../strings').getStringObject(language, 'WITHDRAWAL');
	let result = `<div>
        <p>
        ${WITHDRAWAL.GREETING(email)}
		</p>`;

	if (Object.keys(GET_COINS()).includes(data.currency)) {
		let explorers = '';

		if (data.transaction_id && !data.transaction_id.includes('-')) {
			if (EXPLORERS[data.currency]) {
				EXPLORERS[data.currency].forEach((explorer) => {
					explorers += `<li><a href=${explorer.baseUrl}${explorer.txPath}/${
						data.transaction_id
					}>${explorer.name}</a></li>`;
				});
			} else if (EXPLORERS[data.network]) {
				EXPLORERS[data.network].forEach((explorer) => {
					explorers += `<li><a href=${explorer.baseUrl}${explorer.txPath}/${
						data.transaction_id
					}>${explorer.name}</a></li>`;
				});
			}
		}

		result += `
			<p>
				${WITHDRAWAL.BODY[data.status](data.amount, data.currency.toUpperCase())}
			</p>
			<p>
				${WITHDRAWAL.BODY[1](data.amount, data.currency)}
				${data.fee ? '<br />' : ''}
				${data.fee ? `${WITHDRAWAL.BODY[2](data.fee)} ${data.fee_coin || data.currency}` : ''}
				<br />
				${WITHDRAWAL.BODY[3](data.status)}
				${data.transaction_id && data.address ? '<br />' : ''}
				${data.transaction_id && data.address ? WITHDRAWAL.BODY[4](data.address) : ''}
				${data.transaction_id ? '<br />' : ''}
				${data.transaction_id ? WITHDRAWAL.BODY[5](data.transaction_id) : ''}
				${data.network ? '<br />' : ''}
				${data.network ? WITHDRAWAL.BODY[6](data.network) : ''}
				${data.description ? '<br />' : ''}
				${data.description ? WITHDRAWAL.BODY[7](data.description) : ''}
			</p>
			${explorers.length > 0 ? WITHDRAWAL.BODY[8] : ''}
			${explorers.length > 0 ? `<ul>${explorers}</ul>` : ''}
		`;
	} else {
		result += '';
	}
	result += `<p>
			${WITHDRAWAL.CLOSING[1]}<br />
			${WITHDRAWAL.CLOSING[2]()}
			</p>
		</div>`;
	return result;
};

const text = (email, data, language, domain) => {
	const WITHDRAWAL = require('../strings').getStringObject(language, 'WITHDRAWAL');
	let result = `${WITHDRAWAL.GREETING(email)}`;
	if (Object.keys(GET_COINS()).includes(data.currency)) {
		result += `
			${WITHDRAWAL.BODY[data.status](data.amount, data.currency.toUpperCase())}
			${WITHDRAWAL.BODY[1](data.amount, data.currency)}
			${data.fee ? `${WITHDRAWAL.BODY[2](data.fee)} ${data.fee_coin || data.currency}` : ''}
			${WITHDRAWAL.BODY[3](data.status)}
			${data.transaction_id && data.address ? WITHDRAWAL.BODY[4](data.address) : ''}
			${data.transaction_id ? WITHDRAWAL.BODY[5](data.transaction_id) : ''}
			${data.network ? WITHDRAWAL.BODY[6](data.network) : ''}
			${data.description ? WITHDRAWAL.BODY[7](data.description) : ''}
		`;
	} else {
		result += '';
	}
	result += `${WITHDRAWAL.CLOSING[1]} ${WITHDRAWAL.CLOSING[2]()}`;
	return result;
};

const htmlDynamic = (email, data, language, domain, stringDynamic) => {
	const WITHDRAWAL = require('../strings').getStringObject(language, 'WITHDRAWAL');

	let result = `<div>
        <p>
            ${stringDynamic.GREETING ? stringDynamic.GREETING.format(email) : WITHDRAWAL.GREETING(email)}
		</p>`;

	if (Object.keys(GET_COINS()).includes(data.currency)) {
		let explorers = '';

		if (data.transaction_id && !data.transaction_id.includes('-')) {
			if (EXPLORERS[data.currency]) {
				EXPLORERS[data.currency].forEach((explorer) => {
					explorers += `<li><a href=${explorer.baseUrl}${explorer.txPath}/${
						data.transaction_id
					}>${explorer.name}</a></li>`;
				});
			} else if (EXPLORERS[data.network]) {
				EXPLORERS[data.network].forEach((explorer) => {
					explorers += `<li><a href=${explorer.baseUrl}${explorer.txPath}/${
						data.transaction_id
					}>${explorer.name}</a></li>`;
				});
			}
		}

		result += `
			<p>
				${(stringDynamic.BODY && stringDynamic.BODY[data.status]) ? stringDynamic.BODY[data.status].format(data.amount, data.currency.toUpperCase()) : WITHDRAWAL.BODY[data.status](data.amount, data.currency.toUpperCase())}
			</p>
			<p>
				${(stringDynamic.BODY && stringDynamic.BODY[1]) ? stringDynamic.BODY[1].format(data.amount, data.currency) : WITHDRAWAL.BODY[1](data.amount, data.currency)}
				${data.fee ? '<br />' : ''}
				${data.fee ? `${((stringDynamic.BODY && stringDynamic.BODY[2]) ? stringDynamic.BODY[2].format(data.fee) : WITHDRAWAL.BODY[2](data.fee))} ${data.fee_coin || data.currency}`  : ''}
				<br />
				${(stringDynamic.BODY && stringDynamic.BODY[3]) ? stringDynamic.BODY[3].format(data.status) : WITHDRAWAL.BODY[3](data.status)}
				${data.transaction_id && data.address ? '<br />' : ''}
				${data.transaction_id && data.address ? ((stringDynamic.BODY && stringDynamic.BODY[4]) ? stringDynamic.BODY[4].format(data.address) : WITHDRAWAL.BODY[4](data.address)) : ''}
				${data.transaction_id ? '<br />' : ''}
				${data.transaction_id ? ((stringDynamic.BODY && stringDynamic.BODY[5]) ? stringDynamic.BODY[5].format(data.transaction_id) : WITHDRAWAL.BODY[5](data.transaction_id)) : ''}
				${data.network ? '<br />' : ''}
				${data.network ? ((stringDynamic.BODY && stringDynamic.BODY[6]) ? stringDynamic.BODY[6].format(data.network) : WITHDRAWAL.BODY[6](data.network)) : ''}
				${data.description ? '<br />' : ''}
				${data.description ? ((stringDynamic.BODY && stringDynamic.BODY[7]) ? stringDynamic.BODY[7].format(data.description) : WITHDRAWAL.BODY[7](data.description)) : ''}
			</p>
			${explorers.length > 0 ? ((stringDynamic.BODY && stringDynamic.BODY[8]) ? stringDynamic.BODY[8] : WITHDRAWAL.BODY[8]) : ''}
			${explorers.length > 0 ? `<ul>${explorers}</ul>` : ''}
		`;
	} else {
		result += '';
	}
	result += `
			<p>
				${(stringDynamic.CLOSING && stringDynamic.CLOSING[1]) ? stringDynamic.CLOSING[1] : WITHDRAWAL.CLOSING[1]}<br />
        		${(stringDynamic.CLOSING && stringDynamic.CLOSING[2]) ? stringDynamic.CLOSING[2].format(API_NAME()) : WITHDRAWAL.CLOSING[2]()}
			</p>
		</div>`;
	return result;
};

const textDynamic = (email, data, language, domain, stringDynamic) => {
	const WITHDRAWAL = require('../strings').getStringObject(language, 'WITHDRAWAL');
	let result = `${stringDynamic.GREETING ? stringDynamic.GREETING.format(email) : WITHDRAWAL.GREETING(email)}`;
	if (Object.keys(GET_COINS()).includes(data.currency)) {
		result += `
			${(stringDynamic.BODY && stringDynamic.BODY[data.status]) ? stringDynamic.BODY[data.status].format(data.amount, data.currency.toUpperCase()) : WITHDRAWAL.BODY[data.status](data.amount, data.currency.toUpperCase())}
			${(stringDynamic.BODY && stringDynamic.BODY[1]) ? stringDynamic.BODY[1].format(data.amount, data.currency) : WITHDRAWAL.BODY[1](data.amount, data.currency)}
			${data.fee ? `${((stringDynamic.BODY && stringDynamic.BODY[2]) ? stringDynamic.BODY[2].format(data.fee) : WITHDRAWAL.BODY[2](data.fee))} ${data.fee_coin || data.currency}`  : ''}
			${(stringDynamic.BODY && stringDynamic.BODY[3]) ? stringDynamic.BODY[3].format(data.status) : WITHDRAWAL.BODY[3](data.status)}
			${data.transaction_id && data.address ? ((stringDynamic.BODY && stringDynamic.BODY[4]) ? stringDynamic.BODY[4].format(data.address) : WITHDRAWAL.BODY[4](data.address)) : ''}
			${data.transaction_id ? ((stringDynamic.BODY && stringDynamic.BODY[5]) ? stringDynamic.BODY[5].format(data.transaction_id) : WITHDRAWAL.BODY[5](data.transaction_id)) : ''}
			${data.network ? ((stringDynamic.BODY && stringDynamic.BODY[6]) ? stringDynamic.BODY[6].format(data.network) : WITHDRAWAL.BODY[6](data.network)) : ''}
			${data.description ? ((stringDynamic.BODY && stringDynamic.BODY[7]) ? stringDynamic.BODY[7].format(data.description) : WITHDRAWAL.BODY[7](data.description)) : ''}
		`;
	} else {
		result += '';
	}
	result += `${(stringDynamic.CLOSING && stringDynamic.CLOSING[1]) ? stringDynamic.CLOSING[1] : WITHDRAWAL.CLOSING[1]} ${(stringDynamic.CLOSING && stringDynamic.CLOSING[2]) ? stringDynamic.CLOSING[2].format(API_NAME()) : WITHDRAWAL.CLOSING[2]()}`;
	return result;
};

module.exports = fetchMessage;
