'use strict';

const { CONFIRMATION, EXPLORERS, GET_COINS } = require('../../constants');
const { GET_EMAIL, GET_KIT_CONFIG } = require('../../constants');
const API_NAME = () => GET_KIT_CONFIG().api_name;

const fetchMessage = (email, data, language, domain) => {
	const emailConfigurations = GET_EMAIL();
	if(emailConfigurations[language] && emailConfigurations[language]['DEPOSIT']) {
		const stringDynamic = emailConfigurations[language]['DEPOSIT'];
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
	const DEPOSIT = require('../strings').getStringObject(language, 'DEPOSIT');
	let result = `
        <div>
            <p>
                ${DEPOSIT.GREETING(email)}
			</p>
		`;

	if (Object.keys(GET_COINS()).includes(data.currency)) {
		let explorers = '';
		let confirmation = undefined;

		if (data.transaction_id && !data.transaction_id.includes('-')) {
			confirmation = CONFIRMATION[data.currency] || CONFIRMATION[data.network];
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
				${DEPOSIT.BODY[data.status](data.amount, confirmation, data.currency.toUpperCase())}
			</p>
			<p>
				${DEPOSIT.BODY[1](data.amount, data.currency.toUpperCase())}
				<br />
				${DEPOSIT.BODY[2](data.status)}
				${data.transaction_id && data.address ? '<br />' : ''}
				${data.transaction_id && data.address ? DEPOSIT.BODY[3](data.address) : ''}
				${data.transaction_id ? '<br />' : ''}
				${data.transaction_id ? DEPOSIT.BODY[4](data.transaction_id) : ''}
				${data.network ? '<br />' : ''}
				${data.network ? DEPOSIT.BODY[5](data.network) : ''}
				${data.fee ? '<br />' : ''}
				${data.fee ? `${DEPOSIT.BODY[6](data.fee)} ${data.fee_coin || data.currency}` : ''}
				${data.description ? '<br />' : ''}
				${data.description ? DEPOSIT.BODY[7](data.description) : ''}
			</p>
			${explorers.length > 0 ? DEPOSIT.BODY[8] : ''}
			${explorers.length > 0 ? `<ul>${explorers}</ul>` : ''}
		`;
	} else {
		result += '';
	}

	result += `
			<p>
				${DEPOSIT.CLOSING[1]}<br />
				${DEPOSIT.CLOSING[2]()}
			</p>
		</div>
		`;
	return result;
};

const text = (email, data, language, domain) => {
	const DEPOSIT = require('../strings').getStringObject(language, 'DEPOSIT');
	let result = `${DEPOSIT.GREETING(email)}`;
	if (Object.keys(GET_COINS()).includes(data.currency)) {
		let confirmation = undefined;
		if (data.transaction_id && !data.transaction_id.includes('-')) {
			confirmation = CONFIRMATION[data.currency] || CONFIRMATION[data.network];
		}
		result += `
			${DEPOSIT.BODY[data.status](data.amount, confirmation, data.currency.toUpperCase())}
			${DEPOSIT.BODY[1](data.amount, data.currency.toUpperCase())}
			${DEPOSIT.BODY[2](data.status)}
			${data.transaction_id && data.address ? DEPOSIT.BODY[3](data.address) : ''}
			${data.transaction_id ? DEPOSIT.BODY[4](data.transaction_id) : ''}
			${data.network ? DEPOSIT.BODY[5](data.network) : ''}
			${data.fee ? `${DEPOSIT.BODY[6](data.fee)} ${data.fee_coin || data.currency}` : ''}
			${data.description ? DEPOSIT.BODY[7](data.description) : ''}
		`;
	} else {
		result += '';
	}
	result += `${DEPOSIT.CLOSING[1]} ${DEPOSIT.CLOSING[2]()}`;
	return result;
};

const htmlDynamic = (email, data, language, domain, stringDynamic) => {
	let result = `
        <div>
            <p>
                ${stringDynamic.GREETING.format(email)}
			</p>
		`;

	if (Object.keys(GET_COINS()).includes(data.currency)) {
		let explorers = '';
		let confirmation = undefined;

		if (data.transaction_id && !data.transaction_id.includes('-')) {
			confirmation = CONFIRMATION[data.currency] || CONFIRMATION[data.network];
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
				${stringDynamic.BODY[data.status].format(data.amount, confirmation, data.currency.toUpperCase(), API_NAME())}
			</p>
			<p>
				${stringDynamic.BODY[1].format(data.amount, data.currency.toUpperCase())}
				<br />
				${stringDynamic.BODY[2].format(data.status)}
				${data.transaction_id && data.address ? '<br />' : ''}
				${data.transaction_id && data.address ? stringDynamic.BODY[3].format(data.address) : ''}
				${data.transaction_id ? '<br />' : ''}
				${data.transaction_id ? stringDynamic.BODY[4].format(data.transaction_id) : ''}
				${data.network ? '<br />' : ''}
				${data.network ? stringDynamic.BODY[5].format(data.network) : ''}
				${data.fee ? '<br />' : ''}
				${data.fee ? stringDynamic.BODY[6].format(data.fee) : ''}
				${data.description ? '<br />' : ''}
				${data.description ? stringDynamic.BODY[7].format(data.description) : ''}
			</p>
			${explorers.length > 0 ? stringDynamic.BODY[8] : ''}
			${explorers.length > 0 ? `<ul>${explorers}</ul>` : ''}
		`;
	} else {
		result += '';
	}

	result += `
			<p>
				${stringDynamic.CLOSING[1]}<br />
				${stringDynamic.CLOSING[2].format(API_NAME())}
			</p>
		</div>
		`;
	return result;
};

const textDynamic = (email, data, language, domain, stringDynamic) => {
	let result = `${stringDynamic.GREETING.format(email)}`;
	if (Object.keys(GET_COINS()).includes(data.currency)) {
		let confirmation = undefined;
		if (data.transaction_id && !data.transaction_id.includes('-')) {
			confirmation = CONFIRMATION[data.currency] || CONFIRMATION[data.network];
		}
		result += `
			${stringDynamic.BODY[data.status].format(data.amount, confirmation, data.currency.toUpperCase(), API_NAME())}
			${stringDynamic.BODY[1].format(data.amount, data.currency.toUpperCase())}
			${stringDynamic.BODY[2].format(data.status)}
			${data.transaction_id && data.address ? stringDynamic.BODY[3].format(data.address) : ''}
			${data.transaction_id ? stringDynamic.BODY[4].format(data.transaction_id) : ''}
			${data.network ? stringDynamic.BODY[5].format(data.network) : ''}
			${data.fee ? stringDynamic.BODY[6].format(data.fee) : ''}
			${data.description ? stringDynamic.BODY[7].format(data.description) : ''}
		`;
	} else {
		result += '';
	}
	result += `${stringDynamic.CLOSING[1]} ${stringDynamic.CLOSING[2].format(API_NAME())}`;
	return result;
};

module.exports = fetchMessage;
