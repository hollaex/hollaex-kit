'use strict';

const FORMATDATE = 'YYYY/MM/DD HH:mm:ss A Z';

const MAILTYPE = {
	WELCOME: 'welcome',
	LOGIN: 'login',
	SIGNUP: 'signup',
	RESET_PASSWORD: 'resetPassword',
	USER_VERIFICATION_REJECT: 'userVerificationReject',
	ACCOUNT_UPGRADE: 'accountUpgrade',
	ACCOUNT_VERIFY: 'accountVerify',
	WITHDRAWAL_REQUEST: 'withdrawalRequest',
	DEPOSIT_CANCEL: 'depositCancel',
	DEPOSIT: 'deposit',
	WITHDRAWAL: 'withdrawal',
	CONTACT_FORM: 'contactForm',
	SUSPICIOUS_DEPOSIT: 'suspiciousDeposit',
	USER_VERIFICATION: 'userVerification',
	USER_DEACTIVATED: 'userDeactivated',
	INVALID_ADDRESS: 'invalidAddress',
	INVITED_OPERATOR: 'invitedOperator',
	ALERT: 'alert',
	DISCOUNT_UPDATE: 'discountUpdate',
	BANK_VERIFIED: 'bankVerified'
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
