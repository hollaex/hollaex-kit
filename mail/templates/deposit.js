'use strict';

const { CONFIRMATION, EXPLORERS, CURRENCIES } = require('../../constants');
const PENDING = 'PENDING';
const COMPLETED = 'COMPLETED';

const fetchMessage = (email, data, language, domain) => {
	return {
		html: html(email, data, language, domain),
		text: text(email, data, language, domain)
	};
};

const html = (email, data, language, domain) => {
	const { DEPOSIT } = require(`../strings/${language}`);
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
		if (data.status === PENDING) {
			result += `
                <p>
                    ${DEPOSIT.BODY.PENDING[1](
						data.amount,
						CONFIRMATION[data.currency],
						data.currency.toUpperCase()
					)}
                </p>
                <p>
                    ${DEPOSIT.BODY.PENDING[2](
						data.amount,
						data.currency.toUpperCase()
					)}
					<br />
                    ${DEPOSIT.BODY.PENDING[3]}${
						data.transaction_id ? '<br />' : ''
					}
                    ${data.transaction_id
						? DEPOSIT.BODY.PENDING[4](data.transaction_id)
						: ''
					}
                </p>
                	${DEPOSIT.BODY.PENDING[5]}
                <ul>${explorers}</ul>
            `;
		} else if (data.status === COMPLETED) {
			result += `
				<p>${DEPOSIT.BODY.COMPLETED(
					data.amount,
					data.currency
				)}</p>
			`;
		}
	} else {
		result += '';
	}

	result += `
			<p>
				${DEPOSIT.CLOSING[1]}<br />
				${DEPOSIT.CLOSING[2]}
			</p>
		</div>
		`;
	return result;
};

const text = (email, data, language, domain) => {
	const { DEPOSIT } = require(`../strings/${language}`);
	let result = `${DEPOSIT.GREETING(email)}`;
	if (CURRENCIES.includes(data.currency)) {
		if (data.status === PENDING) {
			result += `
				${DEPOSIT.BODY.PENDING[1](
					data.amount,
					CONFIRMATION[data.currency],
					data.currency.toUpperCase()
				)}
				${DEPOSIT.BODY.PENDING[2](data.amount, data.currency.toUpperCase())}
				${DEPOSIT.BODY.PENDING[3]}
				${data.transaction_id ? DEPOSIT.BODY.PENDING[4](data.transaction_id) : ''}
      		`;
		} else if (data.status === COMPLETED) {
			result += DEPOSIT.BODY.COMPLETED(data.amount, data.currency);
		}
	} else {
		result += '';
	}
	result += `${DEPOSIT.CLOSING[1]} ${DEPOSIT.CLOSING[2]}`;
	return result;
};

module.exports = fetchMessage;
