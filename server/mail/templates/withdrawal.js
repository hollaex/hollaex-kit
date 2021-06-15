'use strict';

const { GET_COINS, EXPLORERS } = require('../../constants');

const fetchMessage = (email, data, language, domain) => {
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
				${data.fee ? WITHDRAWAL.BODY[2](data.fee) : ''}
				<br />
				${WITHDRAWAL.BODY[3](data.status)}
				${data.transaction_id && data.address ? '<br />' : ''}
				${data.transaction_id && data.address ? WITHDRAWAL.BODY[4](data.address) : ''}
				${data.transaction_id ? '<br />' : ''}
				${data.transaction_id ? WITHDRAWAL.BODY[5](data.transaction_id) : ''}
				${data.network ? '<br />' : ''}
				${data.network ? WITHDRAWAL.BODY[6](data.network) : ''}
			</p>
			${explorers.length > 0 ? WITHDRAWAL.BODY[7] : ''}
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
			${data.fee ? WITHDRAWAL.BODY[2](data.fee) : ''}
			${WITHDRAWAL.BODY[3](data.status)}
			${data.transaction_id && data.address ? WITHDRAWAL.BODY[4](data.address) : ''}
			${data.transaction_id ? WITHDRAWAL.BODY[5](data.transaction_id) : ''}
			${data.network ? WITHDRAWAL.BODY[6](data.network) : ''}
		`;
	} else {
		result += '';
	}
	result += `${WITHDRAWAL.CLOSING[1]} ${WITHDRAWAL.CLOSING[2]()}`;
	return result;
};

module.exports = fetchMessage;
