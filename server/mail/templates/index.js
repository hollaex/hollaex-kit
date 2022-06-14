'use strict';

const { CONFIRMATION, EXPLORERS, DOMAIN, GET_KIT_CONFIG, GET_EMAIL } = require('../../constants');
const DEFAULT_LANGUAGE = () => GET_KIT_CONFIG().defaults.language;
const API_NAME = () => GET_KIT_CONFIG().api_name;
const { TemplateEmail } = require('./helpers/common');
const { MAILTYPE, languageFile } = require('../strings');

String.prototype.format = function() {
	let a = this;
	for (let k in arguments) {
		a = a.replace('{' + k + '}', arguments[k]);
	}
	return a;
};

const generateMessageContent = (
	type,
	email,
	data = {},
	language = DEFAULT_LANGUAGE(),
	domain = DOMAIN
) => {
	let title;
	let message;
	let result;
	if (
		type === MAILTYPE.INVITED_OPERATOR ||
		type === MAILTYPE.SMS ||
		type === MAILTYPE.ALERT ||
		type === MAILTYPE.CONTACTFORM
	) {
		let EMAIL_STRING_OBJECT = languageFile(language)[type.toUpperCase()];
		if (!EMAIL_STRING_OBJECT) {
			EMAIL_STRING_OBJECT = languageFile('en')[type.toUpperCase()];
		}

		if (type === MAILTYPE.ALERT) {
			title = EMAIL_STRING_OBJECT.TITLE(data.type);
		} else {
			title = EMAIL_STRING_OBJECT.TITLE;
		}
		message = require(`./${type}`)(email, data, language, domain);

		let subject = `${API_NAME()} ${title}`;

		result = {
			subject: subject,
			html: TemplateEmail({ title }, message.html, language, domain),
			text: message.text
		};

	} else {
		const EMAIL_CONFIGURATIONS = GET_EMAIL();
		let new_type = findMailtype(type, data);

		if (EMAIL_CONFIGURATIONS[language] === undefined || EMAIL_CONFIGURATIONS[language][new_type.toUpperCase()] === undefined) {
			language = 'en';
		}

		let MAILTYPE_CONFIGURATIONS = EMAIL_CONFIGURATIONS[language][new_type.toUpperCase()];
		title = getTitle(new_type, MAILTYPE_CONFIGURATIONS['title'], data);
		message = {
			html: replaceHTMLContent(new_type, MAILTYPE_CONFIGURATIONS['html'].toString(), email, data, language, domain),
			text: ''
		};
		let subject = `${API_NAME()} ${title}`;

		result = {
			subject: subject,
			html: (TemplateEmail({ title }, message.html, language, domain)).replace(/\r?\n|\t|\r/g, ''),
			text: message.text
		};
	}

	return result;
};

const replaceHTMLContent = (type, html = '', email, data, language, domain) => {
	if (type === MAILTYPE.LOGIN) { // ok
		html = html.replace(/\$\{time\}/g, data.time || '');
		html = html.replace(/\$\{country\}/g, data.country || '');
		html = html.replace(/\$\{ip\}/g, data.ip || '');
		html = html.replace(/\$\{name\}/g, email || '');
		html = html.replace(/\$\{api_name\}/g, API_NAME() || '');
	}
	else if (type === MAILTYPE.SIGNUP) { // ok
		html = html.replace(/\$\{name\}/g, email);
		html = html.replace(/\$\{api_name\}/g, API_NAME());
		html = html.replace(/\$\{link\}/g, `${domain}/verify/${data}`);
	}
	else if (type === MAILTYPE.WELCOME) { //ok
		html = html.replace(/\$\{name\}/g, email || '');
		html = html.replace(/\$\{api_name\}/g, API_NAME() || '');
		html = html.replace(/\$\{link_account\}/g, `${domain}/account`);
		html = html.replace(/\$\{link_deposit\}/g, `${domain}/deposit`);
	}
	else if (type === MAILTYPE.RESET_PASSWORD) { // ok
		html = html.replace(/\$\{name\}/g, email || '');
		html = html.replace(/\$\{ip\}/g, data.ip || '');
		html = html.replace(/\$\{api_name\}/g, API_NAME() || '');
		html = html.replace(/\$\{link\}/g, `${domain}/reset-password/${data.code}`);

	}
	else if (type === MAILTYPE.CHANGE_PASSWORD) { // ok
		html = html.replace(/\$\{name\}/g, email || '');
		html = html.replace(/\$\{ip\}/g, data.ip || '');
		html = html.replace(/\$\{api_name\}/g, API_NAME() || '');
		html = html.replace(/\$\{link\}/g, `${domain}/confirm-change-password/${data.code}`);

	}
	else if (type === MAILTYPE.PASSWORD_CHANGED) { // ok
		html = html.replace(/\$\{name\}/g, email || '');
		html = html.replace(/\$\{api_name\}/g, API_NAME());
	}
	else if (type === MAILTYPE.DEPOSIT_PENDING) {

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
		let currency = data.currency || '';
		let fee_coin = data.fee_coin || data.currency || '';
		html = html.replace(/\$\{currency\}/g, currency.toUpperCase());
		html = html.replace(/\$\{fee_coin\}/g, fee_coin.toUpperCase());
		html = html.replace(/\$\{name\}/g, email || '');
		html = html.replace(/\$\{amount\}/g, data.amount || '');
		html = html.replace(/\$\{confirmation\}/g, confirmation || '');
		html = html.replace(/\$\{status\}/g, data.status || '');
		html = html.replace(/\$\{address\}/g, data.address || '');
		html = html.replace(/\$\{transaction_id\}/g, data.transaction_id || '');
		html = html.replace(/\$\{fee\}/g, data.fee || '0');
		html = html.replace(/\$\{description\}/g, data.description || '');
		html = html.replace(/\$\{explorers\}/g, explorers || '');
		html = html.replace(/\$\{api_name\}/g, API_NAME() || '');
		if(data.network) {
			html = html.replace(/\$\{network\}/g, data.network || '');
		} else {
			html = html.replace(/id="network"/g, 'style="display: none"');
		}

	}
	else if (type === MAILTYPE.DEPOSIT_COMPLETED) {

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
		let currency = data.currency || '';
		let fee_coin = data.fee_coin || data.currency || '';
		html = html.replace(/\$\{currency\}/g, currency.toUpperCase());
		html = html.replace(/\$\{fee_coin\}/g, fee_coin.toUpperCase());

		html = html.replace(/\$\{name\}/g, email || ''); //
		html = html.replace(/\$\{amount\}/g, data.amount || ''); //
		html = html.replace(/\$\{confirmation\}/g, confirmation || '');
		html = html.replace(/\$\{status\}/g, data.status || '');
		html = html.replace(/\$\{address\}/g, data.address || '');
		html = html.replace(/\$\{transaction_id\}/g, data.transaction_id || '');
		html = html.replace(/\$\{fee\}/g, data.fee || '0');
		html = html.replace(/\$\{description\}/g, data.description || '');
		html = html.replace(/\$\{explorers\}/g, explorers || '');
		html = html.replace(/\$\{api_name\}/g, API_NAME() || '');
		if(data.network) {
			html = html.replace(/\$\{network\}/g, data.network || '');
		} else {
			html = html.replace(/id="network"/g, 'style="display: none"');
		}

	}
	else if (type === MAILTYPE.WITHDRAWAL_PENDING) {

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

		let currency = data.currency || '';
		let fee_coin = data.fee_coin || data.currency || '';
		html = html.replace(/\$\{currency\}/g, currency.toUpperCase());
		html = html.replace(/\$\{fee_coin\}/g, fee_coin.toUpperCase());

		html = html.replace(/\$\{name\}/g, email || '');
		html = html.replace(/\$\{api_name\}/g, API_NAME() || '');
		html = html.replace(/\$\{amount\}/g, data.amount || '');
		html = html.replace(/\$\{fee\}/g, data.fee || '0');
		html = html.replace(/\$\{status\}/g, data.status || '');
		html = html.replace(/\$\{address\}/g, data.address || '');
		html = html.replace(/\$\{description\}/g, data.description || '');
		html = html.replace(/\$\{explorers\}/g, explorers || '');
		html = html.replace(/\$\{transaction_id\}/g, data.transaction_id || '');
		if(data.network) {
			html = html.replace(/\$\{network\}/g, data.network || '');
		} else {
			html = html.replace(/id="network"/g, 'style="display: none"');
		}
	}
	else if (type === MAILTYPE.WITHDRAWAL_COMPLETED) {

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
		let currency = data.currency || '';
		let fee_coin = data.fee_coin || data.currency || '';
		html = html.replace(/\$\{currency\}/g, currency.toUpperCase());
		html = html.replace(/\$\{fee_coin\}/g, fee_coin.toUpperCase());

		html = html.replace(/\$\{name\}/g, email || '');
		html = html.replace(/\$\{api_name\}/g, API_NAME() || '');
		html = html.replace(/\$\{amount\}/g, data.amount || '');
		html = html.replace(/\$\{fee\}/g, data.fee || '0');
		html = html.replace(/\$\{status\}/g, data.status || '');
		html = html.replace(/\$\{address\}/g, data.address || '');
		html = html.replace(/\$\{description\}/g, data.description || '');
		html = html.replace(/\$\{explorers\}/g, explorers || '');
		html = html.replace(/\$\{transaction_id\}/g, data.transaction_id || '');
		if(data.network) {
			html = html.replace(/\$\{network\}/g, data.network || '');
		} else {
			html = html.replace(/id="network"/g, 'style="display: none"');
		}
	}
	else if (type === MAILTYPE.ACCOUNT_VERIFY) { //ok
		html = html.replace(/\$\{name\}/g, email || '');
		html = html.replace(/\$\{api_name\}/g, API_NAME() || '');
		html = html.replace(/\$\{link\}/g, `${domain}/trade`);
	}
	else if (type === MAILTYPE.ACCOUNT_UPGRADE) { //ok
		html = html.replace(/\$\{name\}/g, email || '');
		html = html.replace(/\$\{api_name\}/g, API_NAME() || '');
		html = html.replace(/\$\{tier\}/g, data || '');
		html = html.replace(/\$\{link\}/g, `${domain}/trade`);
	}
	else if (type === MAILTYPE.DEPOSIT_CANCEL) {
		let currency = data.currency || '';

		html = html.replace(/\$\{name\}/g, email || '');
		html = html.replace(/\$\{api_name\}/g, API_NAME() || '');
		html = html.replace(/\$\{currency\}/g, currency.toUpperCase());
		html = html.replace(/\$\{date\}/g, data.date || '');
		html = html.replace(/\$\{amount\}/g, data.amount || '');
		html = html.replace(/\$\{txid\}/g, data.transaction_id || '');
	}
	else if (type === MAILTYPE.WITHDRAWAL_CANCEL) {
		let currency = data.currency || '';

		html = html.replace(/\$\{name\}/g, email || '');
		html = html.replace(/\$\{api_name\}/g, API_NAME() || '');
		html = html.replace(/\$\{currency\}/g, currency.toUpperCase());
		html = html.replace(/\$\{date\}/g, data.date || '');
		html = html.replace(/\$\{amount\}/g, data.amount || '');
		html = html.replace(/\$\{txid\}/g, data.transaction_id || '');
	}
	else if (type === MAILTYPE.WITHDRAWAL_REQUEST) {
		let currency = data.currency || '';
		let fee_coin = data.fee_coin || data.currency || '';
		html = html.replace(/\$\{currency\}/g, currency.toUpperCase());
		html = html.replace(/\$\{fee_coin\}/g, fee_coin.toUpperCase());

		html = html.replace(/\$\{name\}/g, email || '');
		html = html.replace(/\$\{api_name\}/g, API_NAME() || '');
		html = html.replace(/\$\{amount\}/g, data.amount || '');
		html = html.replace(/\$\{fee\}/g, data.fee || '0');
		html = html.replace(/\$\{address\}/g, data.address || '');
		html = html.replace(/\$\{ip\}/g, data.ip || '');
		html = html.replace(/\$\{link\}/g, data.confirmation_link || `${domain}/confirm-withdraw/${data.transaction_id}`);
		if(data.network) {
			html = html.replace(/\$\{network\}/g, data.network || '');
		} else {
			html = html.replace(/id="network"/g, 'style="display: none"');
		}
	}
	else if (type === MAILTYPE.INVALID_ADDRESS) {
		let currency = data.currency || '';

		html = html.replace(/\$\{name\}/g, email || '');
		html = html.replace(/\$\{api_name\}/g, API_NAME() || '');
		html = html.replace(/\$\{currency\}/g, currency.toUpperCase() || '');
		html = html.replace(/\$\{amount\}/g, data.amount || '');
		html = html.replace(/\$\{address\}/g, data.address || '');
	}
	else if (type === MAILTYPE.USER_ID_VERIFICATION_REJECT) { // ok1
		html = html.replace(/\$\{name\}/g, email || '');
		html = html.replace(/\$\{api_name\}/g, API_NAME() || '');
		html = html.replace(/\$\{message\}/g, data.message || '');
	}
	else if (type === MAILTYPE.USER_BANK_VERIFICATION_REJECT) { // ok1
		html = html.replace(/\$\{name\}/g, email || '');
		html = html.replace(/\$\{api_name\}/g, API_NAME() || '');
		html = html.replace(/\$\{message\}/g, data.message || '');
	}
	else if (type === MAILTYPE.USER_DEACTIVATED) { // ok1
		html = html.replace(/\$\{api_name\}/g, API_NAME() || '');
		html = html.replace(/\$\{email\}/g, email || '');
	}
	else if (type === MAILTYPE.USER_ACTIVATED) {  // ok1
		html = html.replace(/\$\{api_name\}/g, API_NAME() || '');
		html = html.replace(/\$\{email\}/g, email || '');
	}
	else if (type === MAILTYPE.USER_VERIFICATION) { //ok1
		html = html.replace(/\$\{email\}/g, email || '');
	}
	else if (type === MAILTYPE.SUSPICIOUS_DEPOSIT) { //ok1
		let currency = data.currency || '';

		html = html.replace(/\$\{email\}/g, email || '');
		html = html.replace(/\$\{currency\}/g, currency.toUpperCase());
		html = html.replace(/\$\{txid\}/g, data.txid || '');
		html = html.replace(/\$\{data\}/g, JSON.stringify(data) || '');
	}
	else if (type === MAILTYPE.DISCOUNT_UPDATE) { //ok1
		html = html.replace(/\$\{name\}/g, email || '');
		html = html.replace(/\$\{api_name\}/g, API_NAME() || '');
		html = html.replace(/\$\{rate\}/g, data.rate || '');
	}
	else if (type === MAILTYPE.BANK_VERIFIED) {
		let result = '';
		data.bankAccounts.forEach((bank) => {
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

		html = html.replace(/\$\{name\}/g, email || '');
		html = html.replace(/\$\{api_name\}/g, API_NAME() || '');
		html = html.replace(/\$\{list_detail_bank_account\}/g, result || '');
		html = html.replace(/\$\{link_verification\}/g, `${domain}/verification`);
	}
	else if (type === MAILTYPE.CONFIRM_EMAIL) {
		html = html.replace(/\$\{name\}/g, email || '');
		html = html.replace(/\$\{api_name\}/g, API_NAME() || '');
		html = html.replace(/\$\{code\}/g, data.code || '');
	}
	else if (type === MAILTYPE.DOC_REJECTED) { // done
		html = html.replace(/\$\{email\}/g, email || '');
		html = html.replace(/\$\{api_name\}/g, API_NAME() || '');
		html = html.replace(/\$\{doc_information\}/g, data.doc_information || '');
	}
	else if (type === MAILTYPE.DOC_VERIFIED) { // done
		html = html.replace(/\$\{email\}/g, email || '');
		html = html.replace(/\$\{api_name\}/g, API_NAME() || '');
		html = html.replace(/\$\{doc_information\}/g, data.doc_information || '');
		html = html.replace(/\$\{link\}/g, data.link || '');
	}

	return html;
};

const getTitle = (type, title = '', data) => {
	if (
		type === MAILTYPE.WITHDRAWAL ||
		type === MAILTYPE.DEPOSIT ||
		type === MAILTYPE.WITHDRAWAL_PENDING ||
		type === MAILTYPE.WITHDRAWAL_COMPLETED ||
		type === MAILTYPE.DEPOSIT_PENDING ||
		type === MAILTYPE.DEPOSIT_COMPLETED ||
		type === MAILTYPE.WITHDRAWAL_REQUEST ||
		type === MAILTYPE.DEPOSIT_CANCEL ||
		type === MAILTYPE.WITHDRAWAL_CANCEL
	) {
		let currency = data.currency || '';

		title = title.replace(/\$\{currency\}/g, currency.toUpperCase());
	} else if (
		type === MAILTYPE.USER_ID_VERIFICATION_REJECT ||
		type === MAILTYPE.USER_BANK_VERIFICATION_REJECT ||
		type === MAILTYPE.USER_DEACTIVATED ||
		type === MAILTYPE.USER_ACTIVATED
	) {
		title = title.replace(/\$\{type\}/g, data.type);
	}

	return title;
};

const findMailtype = (type, data) => {
	if (type === MAILTYPE.WITHDRAWAL) {
		if (data.status.toUpperCase() === 'PENDING') {
			type = MAILTYPE.WITHDRAWAL_PENDING;
		} else if (data.status.toUpperCase() === 'COMPLETED') {
			type = MAILTYPE.WITHDRAWAL_COMPLETED;
		}
	} else if (type === MAILTYPE.DEPOSIT) {
		if (data.status.toUpperCase() === 'PENDING') {
			type = MAILTYPE.DEPOSIT_PENDING;
		} else if (data.status.toUpperCase() === 'COMPLETED') {
			type = MAILTYPE.DEPOSIT_COMPLETED;
		}
	} else if (type === MAILTYPE.USER_DEACTIVATED) {
		if (data.type.toUpperCase() === 'ACTIVATED') {
			type = MAILTYPE.USER_ACTIVATED;
		} else if (data.type.toUpperCase() === 'DEACTIVATED') {
			type = MAILTYPE.USER_DEACTIVATED;

		}
	} else if (type === MAILTYPE.USER_VERIFICATION_REJECT) {
		if (data.type === 'id') {
			type = MAILTYPE.USER_ID_VERIFICATION_REJECT;
		} else {
			type = MAILTYPE.USER_BANK_VERIFICATION_REJECT;
		}
	} else if (type === MAILTYPE.DEPOSIT_CANCEL) {
		if (data.type.toUpperCase() === 'DEPOSIT') {
			type = MAILTYPE.DEPOSIT_CANCEL;
		} else if (data.type.toUpperCase() === 'WITHDRAWAL') {
			type = MAILTYPE.WITHDRAWAL_CANCEL;
		}
	}
	return type;
};


module.exports = generateMessageContent;
