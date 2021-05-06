'use strict';

const { CONFIRMATION, EXPLORERS, GET_COINS } = require('../../constants');

const fetchMessage = (email, data, language, domain) => {
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
			</p>
			${explorers.length > 0 ? DEPOSIT.BODY[6] : ''}
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
		`;
	} else {
		result += '';
	}
	result += `${DEPOSIT.CLOSING[1]} ${DEPOSIT.CLOSING[2]()}`;
	return result;
};

module.exports = fetchMessage;
