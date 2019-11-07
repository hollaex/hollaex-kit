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
	USER_VERIFICATION: 'userVerification'
};

module.exports = {
	FORMATDATE,
	MAILTYPE
};
