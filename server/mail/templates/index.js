'use strict';

const { DOMAIN, GET_KIT_CONFIG, GET_EMAIL } = require('../../constants');
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
	if (
		type === MAILTYPE.INVITED_OPERATOR ||
		type === MAILTYPE.SMS ||
		type === MAILTYPE.ALERT ||
		type === MAILTYPE.CONTACTFORM ||
		type === MAILTYPE.DEPOSIT ||
		type === MAILTYPE.WITHDRAWAL

	) {
		let EMAIL_STRING_OBJECT = languageFile(language)[type.toUpperCase()];
		if (!EMAIL_STRING_OBJECT) {
			EMAIL_STRING_OBJECT = languageFile('en')[type.toUpperCase()];
		}

		if (type === MAILTYPE.ALERT) {
			title = EMAIL_STRING_OBJECT.TITLE(data.type);
		} else if (
			type === MAILTYPE.WITHDRAWAL ||
			type === MAILTYPE.DEPOSIT
		) {
			title = EMAIL_STRING_OBJECT.TITLE(data.currency);
		} else {
			title = EMAIL_STRING_OBJECT.TITLE;
		}
		message = require(`./${type}`)(email, data, language, domain);

	} else {
		const EMAIL_CONFIGURATIONS = GET_EMAIL();
		if (EMAIL_CONFIGURATIONS[language] && EMAIL_CONFIGURATIONS[language][type.toUpperCase()]) {
			let MAILTYPE_CONFIGURATIONS = EMAIL_CONFIGURATIONS['en'][type.toUpperCase()];
			title = getTitle(type, MAILTYPE_CONFIGURATIONS['title'], data);
			message = {
				html: replaceHTMLContent(type, MAILTYPE_CONFIGURATIONS['html'].toString(), email, data, language, domain),
				text: ''
			};
		}
	}
	const subject = `${API_NAME()} ${title}`;

	let result = {
		subject: subject,
		html: (TemplateEmail({ title }, message.html, language, domain)).replace(/\r?\n|\t|\r/g, ''),
		text: message.text
	};
	return result;
};

const replaceHTMLContent = (type, html = '', email, data, language, domain) => {
	if (type === MAILTYPE.LOGIN) { // ok
		html = html.replace(/\$\{time\}/g, data.time);
		html = html.replace(/\$\{country\}/g, data.country);
		html = html.replace(/\$\{ip\}/g, data.ip);
		html = html.replace(/\$\{name\}/g, email);
		html = html.replace(/\$\{api_name\}/g, API_NAME());
	} else if (type === MAILTYPE.SIGNUP) { // ok
		html = html.replace(/\$\{name\}/g, email);
		html = html.replace(/\$\{api_name\}/g, API_NAME());
		html = html.replace(/\$\{link\}/g, `${domain}/verify/${data}`);
	} else if (type === MAILTYPE.WELCOME) { //ok
		html = html.replace(/\$\{name\}/g, email);
		html = html.replace(/\$\{api_name\}/g, API_NAME());
		html = html.replace(/\$\{link_account\}/g, `${domain}/account`);
		html = html.replace(/\$\{link_deposit\}/g, `${domain}/deposit`);
	} else if (type === MAILTYPE.RESET_PASSWORD) { // ok
		html = html.replace(/\$\{name\}/g, email);
		html = html.replace(/\$\{ip\}/g, data.ip);
		html = html.replace(/\$\{api_name\}/g, API_NAME());
		html = html.replace(/\$\{link\}/g, `${domain}/reset-password/${data.code}`);

	} else if (type === MAILTYPE.CHANGE_PASSWORD) { // ok
		html = html.replace(/\$\{name\}/g, email);
		html = html.replace(/\$\{ip\}/g, data.ip);
		html = html.replace(/\$\{api_name\}/g, API_NAME());
		html = html.replace(/\$\{link\}/g, `${domain}/change-password-confirm/${data.code}`);

	} else if (type === MAILTYPE.PASSWORD_CHANGED) { // ok
		html = html.replace(/\$\{name\}/g, email);
		html = html.replace(/\$\{api_name\}/g, API_NAME());
	}
		// else if (type === MAILTYPE.DEPOSIT) {
		// 	html = html.replace(/\$\{name\}/g, email);
		// 	html = html.replace(/\$\{currency\}/g, data.currency.toUpperCase());
		// 	html = html.replace(/\$\{amount\}/g, data.amount);
		// 	html = html.replace(/\$\{confirmation\}/g, data.confirmation);
		// 	html = html.replace(/\$\{currency\}/g, data.currency.toUpperCase());
		// 	html = html.replace(/\$\{status\}/g, data.status);
		// 	html = html.replace(/\$\{address\}/g, data.address);
		// 	html = html.replace(/\$\{txid\}/g, data.txid);
		// 	html = html.replace(/\$\{network\}/g, data.network);
		// 	html = html.replace(/\$\{fee\}/g, data.fee);
		// 	html = html.replace(/\$\{description\}/g, data.description);
	// }
	else if (type === MAILTYPE.ACCOUNT_VERIFY) { //ok
		html = html.replace(/\$\{name\}/g, email);
		html = html.replace(/\$\{api_name\}/g, API_NAME());
		html = html.replace(/\$\{link\}/g, `${domain}/trade`);
	} else if (type === MAILTYPE.ACCOUNT_UPGRADE) { //ok
		html = html.replace(/\$\{name\}/g, email);
		html = html.replace(/\$\{api_name\}/g, API_NAME());
		html = html.replace(/\$\{tier\}/g, data);
		html = html.replace(/\$\{link\}/g, `${domain}/trade`);
	} else if (type === MAILTYPE.DEPOSIT_CANCEL) {// ok
		html = html.replace(/\$\{name\}/g, email);
		html = html.replace(/\$\{api_name\}/g, API_NAME());
		html = html.replace(/\$\{currency\}/g, data.currency.toUpperCase());
		html = html.replace(/\$\{date\}/g, data.date);
		html = html.replace(/\$\{amount\}/g, data.amount);
		html = html.replace(/\$\{txid\}/g, data.txid);
	} else if (type === MAILTYPE.WITHDRAWAL_CANCEL) { // ok
		html = html.replace(/\$\{name\}/g, email);
		html = html.replace(/\$\{api_name\}/g, API_NAME());
		html = html.replace(/\$\{currency\}/g, data.currency.toUpperCase());
		html = html.replace(/\$\{date\}/g, data.date);
		html = html.replace(/\$\{amount\}/g, data.amount);
		html = html.replace(/\$\{txid\}/g, data.txid);
	}
		// else if (type === MAILTYPE.WITHDRAWAL) {
		// 	html = html.replace(/\$\{name\}/g, email);
		// 	html = html.replace(/\$\{api_name\}/g, API_NAME());
		// 	html = html.replace(/\$\{currency\}/g, data.currency.toUpperCase());
		// 	html = html.replace(/\$\{amount\}/g, data.amount);
		// 	html = html.replace(/\$\{fee\}/g, data.fee);
		// 	html = html.replace(/\$\{status\}/g, data.status);
		// 	html = html.replace(/\$\{address\}/g, data.address);
		// 	html = html.replace(/\$\{txid\}/g, data.txid);
		// 	html = html.replace(/\$\{network\}/g, data.network);
		// 	html = html.replace(/\$\{description\}/g, data.description);
	// }
	else if (type === MAILTYPE.WITHDRAWAL_REQUEST) {
		html = html.replace(/\$\{name\}/g, email);
		html = html.replace(/\$\{api_name\}/g, API_NAME());
		html = html.replace(/\$\{currency\}/g, data.currency.toUpperCase());
		html = html.replace(/\$\{amount\}/g, data.amount);
		html = html.replace(/\$\{fee\}/g, data.fee);
		html = html.replace(/\$\{address\}/g, data.address);
		html = html.replace(/\$\{network\}/g, data.network);
		html = html.replace(/\$\{ip\}/g, data.ip);
		html = html.replace(/\$\{link\}/g, data.confirmation_link || `${domain}/confirm-withdraw/${data.transaction_id}`);
	} else if (type === MAILTYPE.INVALID_ADDRESS) { // ok1
		html = html.replace(/\$\{name\}/g, email);
		html = html.replace(/\$\{api_name\}/g, API_NAME());
		html = html.replace(/\$\{currency\}/g, data.currency.toUpperCase());
		html = html.replace(/\$\{amount\}/g, data.amount);
		html = html.replace(/\$\{address\}/g, data.address);
	} else if (type === MAILTYPE.USER_ID_VERIFICATION_REJECT) { // ok1
		html = html.replace(/\$\{name\}/g, email);
		html = html.replace(/\$\{api_name\}/g, API_NAME());
		html = html.replace(/\$\{message\}/g, data.message);
	} else if (type === MAILTYPE.USER_BANK_VERIFICATION_REJECT) { // ok1
		html = html.replace(/\$\{name\}/g, email);
		html = html.replace(/\$\{api_name\}/g, API_NAME());
		html = html.replace(/\$\{message\}/g, data.message);
	} else if (type === MAILTYPE.USER_DEACTIVATED) { // ok1
		html = html.replace(/\$\{api_name\}/g, API_NAME());
		html = html.replace(/\$\{email\}/g, email);
	} else if (type === MAILTYPE.USER_ACTIVATED) {  // ok1
		html = html.replace(/\$\{api_name\}/g, API_NAME());
		html = html.replace(/\$\{email\}/g, email);
	} else if (type === MAILTYPE.USER_VERIFICATION) { //ok1
		html = html.replace(/\$\{email\}/g, email);
	} else if (type === MAILTYPE.SUSPICIOUS_DEPOSIT) { //ok1
		html = html.replace(/\$\{email\}/g, email);
		html = html.replace(/\$\{currency\}/g, data.currency.toUpperCase());
		html = html.replace(/\$\{txid\}/g, data.txid);
		html = html.replace(/\$\{data\}/g, JSON.stringify(data));
	} else if (type === MAILTYPE.DISCOUNT_UPDATE) { //ok1
		html = html.replace(/\$\{name\}/g, email);
		html = html.replace(/\$\{api_name\}/g, API_NAME());
		html = html.replace(/\$\{rate\}/g, data.rate);
	} else if (type === MAILTYPE.BANK_VERIFIED) {
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

		html = html.replace(/\$\{name\}/g, email);
		html = html.replace(/\$\{api_name\}/g, API_NAME());
		html = html.replace(/\$\{list_detail_bank_account\}/g, result);
		html = html.replace(/\$\{link_verification\}/g, `${domain}/verification`);
	}
	return html;
};

const getTitle = (type, title = '', data) => {
	if (
		type === MAILTYPE.WITHDRAWAL ||
		type === MAILTYPE.DEPOSIT ||
		type === MAILTYPE.WITHDRAWAL_REQUEST
	) {
		title = title.replace(/\$\{currency\}/g, data.currency);
	} else if (
		type === MAILTYPE.DEPOSIT_CANCEL ||
		type === MAILTYPE.WITHDRAWAL_CANCEL
	) {
		title = title.replace(/\$\{currency\}/g, data.currency);
		title = title.replace(/\$\{type\}/g, data.type);
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

module.exports = generateMessageContent;
