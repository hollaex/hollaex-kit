'use strict';

const { CURRENCIES, EXPLORERS } = require('../../constants');

const fetchMessage = (email, data, language, domain) => {
	return {
		html: html(email, data, language, domain),
		text: text(email, data, language, domain)
	};
};

const html = (email, data, language, domain) => {
	const { WITHDRAWAL } = require(`../strings/${language}`);
	let result = `<div>
        <p>
        ${WITHDRAWAL.GREETING(email)}
		</p>`;

	if (CURRENCIES.includes(data.currency)) {
		let explorers = '';
		if (EXPLORERS[data.currency]){
			EXPLORERS[data.currency].forEach((explorer) => {
				explorers += `<li><a href=${explorer.baseUrl}${explorer.txPath}/${
					data.transaction_id
				}>${explorer.name}</a></li>`;
			});
		}
		result += `
			<p>
				${WITHDRAWAL.BODY.COIN[data.status](
					data.amount,
					data.address,
					data.currency.toUpperCase()
				)}
				<br />
				${WITHDRAWAL.BODY.FEE(data.fee)}${data.transaction_id ? '<br />' : ''}
				${data.transaction_id ? WITHDRAWAL.BODY.COIN[1](data.transaction_id) : ''}
			</p>
			${data.transaction_id ? WITHDRAWAL.BODY.COIN[2] : ''}
			<ul>${data.transaction_id ? explorers : ''}</ul>
		`;
	} else {
		result += '';
	}
	result += `<p>
			${WITHDRAWAL.CLOSING[1]}<br />
			${WITHDRAWAL.CLOSING[2]}
			</p>
		</div>`;
	return result;
};

const text = (email, data, language, domain) => {
	const { WITHDRAWAL } = require(`../strings/${language}`);
	let result = `${WITHDRAWAL.GREETING(email)}`;
	if (CURRENCIES.includes(data.currency)) {
		result += `
			${WITHDRAWAL.BODY.COIN[data.status](
				data.amount,
				data.address,
				data.currency.toUpperCase()
			)}
			${WITHDRAWAL.BODY.FEE(data.fee)}
			${data.transaction_id ? WITHDRAWAL.BODY.COIN[1](data.transaction_id) : ''}
		`;
	} else {
		result += '';
	}
	result += `${WITHDRAWAL.CLOSING[1]} ${WITHDRAWAL.CLOSING[2]}`;
	return result;
};

module.exports = fetchMessage;
