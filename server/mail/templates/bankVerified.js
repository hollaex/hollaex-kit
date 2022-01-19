'use strict';
const { GET_EMAIL, GET_KIT_CONFIG } = require('../../constants');
const API_NAME = () => GET_KIT_CONFIG().api_name;

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
	const emailConfigurations = GET_EMAIL();
	if(emailConfigurations[language] && emailConfigurations[language]['BANKVERIFIED']) {
		const stringDynamic = emailConfigurations[language]['BANKVERIFIED'];
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

const htmlDynamic = (email, data, language, domain, stringDynamic) => {
	const link = `${domain}/verification`;
	return `
		<div>
			<p>
				${stringDynamic.GREETING.format(email)}
			</p>
			<p>
				${stringDynamic.BODY[1]}
			</p>
			<div>
				<strong>Verified Bank Accounts:</strong>
				${parseBanks(data.bankAccounts)}
			</div>
			<p>
				<a href=${link}>${stringDynamic.BODY[2]}</a>
			</p>
			<p>
				${stringDynamic.CLOSING[1]}<br />
				${stringDynamic.CLOSING[2].format(API_NAME())}
			</p>
		</div>
	`;
};

const textDynamic = (email, data, language, domain, stringDynamic) => {
	return `
		${stringDynamic.GREETING.format(email)}
		${stringDynamic.BODY[1]}
		${stringDynamic.BODY[2]}
		${stringDynamic.CLOSING[1]} ${stringDynamic.CLOSING[2].format(API_NAME())}
	`;
};

module.exports = fetchMessage;
