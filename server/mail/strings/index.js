'use strict';

const FORMATDATE = 'YYYY/MM/DD HH:mm:ss A Z';

const MAILTYPE = {
	WELCOME: 'welcome',
	LOGIN: 'login',
	SIGNUP: 'signup',
	RESET_PASSWORD: 'reset_password',
	CHANGE_PASSWORD: 'change_password',
	PASSWORD_CHANGED: 'password_changed',
	USER_VERIFICATION_REJECT: 'user_verification_reject',
	ACCOUNT_UPGRADE: 'account_upgrade',
	ACCOUNT_VERIFY: 'account_verify',
	WITHDRAWAL_REQUEST: 'withdrawal_request',
	DEPOSIT_CANCEL: 'deposit_cancel',
	DEPOSIT: 'deposit',
	WITHDRAWAL: 'withdrawal',
	CONTACT_FORM: 'contactForm',
	SUSPICIOUS_DEPOSIT: 'suspicious_deposit',
	USER_VERIFICATION: 'user_verification',
	USER_DEACTIVATED: 'user_deactivated',
	INVALID_ADDRESS: 'invalid_address',
	INVITED_OPERATOR: 'invitedOperator',
	ALERT: 'alert',
	DISCOUNT_UPDATE: 'discount_update',
	BANK_VERIFIED: 'bank_verified',
	CONFIRM_EMAIL: 'confirm_email',

	// USER_VERIFICATION_REJECT split
	USER_ID_VERIFICATION_REJECT: 'user_id_verification_reject',
	USER_BANK_VERIFICATION_REJECT: 'user_bank_verification_reject',

	// DEPOSIT_CANCEL split
	WITHDRAWAL_CANCEL: 'withdrawal_cancel',

	// USER_DEACTIVATED split
	USER_ACTIVATED: 'user_activated',

	// WITHDRAWAL split
	WITHDRAWAL_PENDING: 'withdrawal_pending' ,
	WITHDRAWAL_COMPLETED: 'withdrawal_completed',

	// DEPOSIT split
	DEPOSIT_PENDING: 'deposit_pending',
	DEPOSIT_COMPLETED: 'deposit_completed',

	// KYC
	DOC_REJECTED: 'doc_rejected',
	DOC_VERIFIED: 'doc_verified'
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
