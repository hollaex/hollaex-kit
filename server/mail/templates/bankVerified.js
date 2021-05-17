'use strict';

const parseBanks = (bankAccounts) => {
	let result = '';
	bankAccounts.forEach((bank) => {
		let bankDetails = '';
		Object.entries(bank).map((field) => {
			if (field[0] !== 'id' && field[0] !== 'status') {
				bankDetails += `<li>${field[0]}: ${field[1]}</li>`;
			}
		});

		result += `
			<div>
				Bank ID: ${bank.id}:
				<ul>
					${bankDetails}
				</ul>
			</div>
		`;
	});

	return result;
};

const fetchMessage = (email, data, language, domain) => {
	return {
		html: html(email, data, language, domain),
		text: text(email, data, language, domain)
	};
};

const html = (email, data, language, domain) => {
	const link = `${domain}/verification`;
	const BANKVERIFIED = require('../strings').getStringObject(language, 'BANKVERIFIED');
	return `
		<div>
			<p>
				${BANKVERIFIED.GREETING(email)}
			</p>
			<p>
				${BANKVERIFIED.BODY[1]}
			</p>
			<div>
				<strong>Verified Bank Accounts:</strong>
				${parseBanks(data.bankAccounts)}
			</div>
			<p>
				<a href=${link}>${BANKVERIFIED.BODY[2]}</a>
			</p>
			<p>
				${BANKVERIFIED.CLOSING[1]}<br />
				${BANKVERIFIED.CLOSING[2]()}
			</p>
		</div>
	`;
};

const text = (email, data, language, domain) => {
	const BANKVERIFIED = require('../strings').getStringObject(language, 'BANKVERIFIED');
	return `
		${BANKVERIFIED.GREETING(email)}
		${BANKVERIFIED.BODY[1]}
		${BANKVERIFIED.BODY[2]}
		${BANKVERIFIED.CLOSING[1]} ${BANKVERIFIED.CLOSING[2]()}
	`;
};

module.exports = fetchMessage;
