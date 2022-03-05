'use strict';

const FORMATDATE = 'YYYY/MM/DD HH:mm:ss A Z';

const MAILTYPE = {
	WELCOME: 'welcome',
	LOGIN: 'login',
	SIGNUP: 'signup',
	RESET_PASSWORD: 'reset_password',
	CHANGE_PASSWORD: 'change_password',
	PASSWORD_CHANGED: 'password_changed',
	USER_ID_VERIFICATION_REJECT: 'user_id_verification_reject',
	USER_BANK_VERIFICATION_REJECT: 'user_bank_verification_reject',
	ACCOUNT_UPGRADE: 'account_upgrade',
	ACCOUNT_VERIFY: 'account_verify',
	WITHDRAWAL_REQUEST: 'with_drawal_request',
	DEPOSIT_CANCEL: 'deposit_cancel',
	WITHDRAWAL_CANCEL: 'withdrawal_cancel',
	DEPOSIT: 'deposit',
	WITHDRAWAL: 'withdrawal',
	CONTACT_FORM: 'contactForm',
	SUSPICIOUS_DEPOSIT: 'suspicious_deposit',
	USER_VERIFICATION: 'user_verification',
	USER_DEACTIVATED: 'user_deactivated',
	USER_ACTIVATED: 'user_activated',
	INVALID_ADDRESS: 'invalid_address',
	INVITED_OPERATOR: 'invitedOperator',
	ALERT: 'alert',
	DISCOUNT_UPDATE: 'discount_update',
	BANK_VERIFIED: 'bank_verified',
	CONFIRM_EMAIL: 'confirmEmail'
};

const languageFile = (lang) => {
	let langFile = undefined;
	try {
		langFile = require(`./${lang}`);
	} catch (err) {
		if (err.code === 'MODULE_NOT_FOUND') {
			langFile = require('./en');
		}
	}
	return langFile;
};

const getStringObject = (lang, type) => {
	let langFile = undefined;
	let result = undefined;
	try {
		langFile = require(`./${lang}`);
		result = langFile[type];
		if (!result) {
			langFile = require('./en');
			result = langFile[type];
		}
	} catch (err) {
		if (err.code === 'MODULE_NOT_FOUND') {
			langFile = require('./en');
			result = langFile[type];
		}
	}

	return result;
};

module.exports = {
	FORMATDATE,
	MAILTYPE,
	languageFile,
	getStringObject
};
