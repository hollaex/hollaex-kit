'use strict';

const { CONFIRMATION, EXPLORERS, CURRENCIES } = require('../../constants');

const fetchMessage = (email, data, language, domain) => {
	return {
		html: html(email, data, language, domain),
		text: text(email, data, language, domain)
	};
};

const html = (email, data, language, domain) => {
	const { DEPOSIT } = require('../strings').languageFile(language);
	let result = `
        <div>
            <p>
                ${DEPOSIT.GREETING(email)}
			</p>
		`;

	if (CURRENCIES.includes(data.currency)) {
		let explorers = '';
		if (EXPLORERS[data.currency]) {
			EXPLORERS[data.currency].forEach((explorer) => {
				explorers += `<li><a href=${explorer.baseUrl}${explorer.txPath}/${
					data.transaction_id
				}>${explorer.name}</a></li>`;
			});
		}

		result += `
			<p>
				${DEPOSIT.BODY[data.status](
					data.amount,
					CONFIRMATION[data.currency],
					data.currency.toUpperCase()
				)}
			</p>
			<p>
				${DEPOSIT.BODY[1](
					data.amount,
					data.currency.toUpperCase()
				)}
				<br />
				${DEPOSIT.BODY[2](data.status)}
				${data.transaction_id ? '<br />' : ''}
				${data.transaction_id ? DEPOSIT.BODY[3](data.address) : ''}
				${data.transaction_id ? '<br />' : ''}
				${data.transaction_id ? DEPOSIT.BODY[4](data.transaction_id) : ''}
			</p>
			${data.transaction_id && explorers.length > 0 ? DEPOSIT.BODY[5] : ''}
			<ul>${data.transaction_id ? explorers : ''}</ul>
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
	const { DEPOSIT } = require('../strings').languageFile(language);
	let result = `${DEPOSIT.GREETING(email)}`;
	if (CURRENCIES.includes(data.currency)) {
		result += `
			${DEPOSIT.BODY[data.status](
				data.amount,
				CONFIRMATION[data.currency],
				data.currency.toUpperCase()
			)}
			${DEPOSIT.BODY[1](data.amount, data.currency.toUpperCase())}
			${DEPOSIT.BODY[2](data.status)}
			${data.transaction_id ? DEPOSIT.BODY[3](data.address) : ''}
			${data.transaction_id ? DEPOSIT.BODY[4](data.transaction_id) : ''}
		`;
	} else {
		result += '';
	}
	result += `${DEPOSIT.CLOSING[1]} ${DEPOSIT.CLOSING[2]()}`;
	return result;
};

module.exports = fetchMessage;
