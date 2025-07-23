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
	LOCKED_ACCOUNT: 'locked_account',
	USER_DELETED: 'user_deleted',

	// USER_VERIFICATION_REJECT split
	USER_ID_VERIFICATION_REJECT: 'user_id_verification_reject',
	USER_BANK_VERIFICATION_REJECT: 'user_bank_verification_reject',

	// DEPOSIT_CANCEL split
	WITHDRAWAL_CANCEL: 'withdrawal_cancel',

	// USER_DEACTIVATED split
	USER_ACTIVATED: 'user_activated',

	// WITHDRAWAL split
	WITHDRAWAL_PENDING: 'withdrawal_pending',
	WITHDRAWAL_COMPLETED: 'withdrawal_completed',

	// DEPOSIT split
	DEPOSIT_PENDING: 'deposit_pending',
	DEPOSIT_COMPLETED: 'deposit_completed',

	// KYC
	DOC_REJECTED: 'doc_rejected',
	DOC_VERIFIED: 'doc_verified',

	// OTP
	OTP_DISABLED: 'otp_disabled',
	OTP_ENABLED: 'otp_enabled',

	//P2P
	P2P_MERCHANT_IN_PROGRESS: 'p2p_merchant_in_progress',
	P2P_BUYER_PAID_ORDER: 'p2p_buyer_paid_order',
	P2P_ORDER_EXPIRED: 'p2p_order_expired',
	P2P_ORDER_CLOSED: 'p2p_order_closed',
	P2P_BUYER_CANCELLED_ORDER: 'p2p_buyer_cancelled_order',
	P2P_BUYER_APPEALED_ORDER: 'p2p_buyer_appealed_order',
	P2P_VENDOR_CONFIRMED_ORDER: 'p2p_vendor_confirmed_order',
	P2P_VENDOR_CANCELLED_ORDER: 'p2p_vendor_cancelled_order',
	P2P_VENDOR_APPEALED_ORDER: 'p2p_vendor_appealed_order',

	//AUTO TRADE
	AUTO_TRADE_ERROR: 'auto_trade_error',
	AUTO_TRADE_REMINDER: 'auto_trade_reminder',
	AUTO_TRADE_FILLED: 'auto_trade_filled',


	// SUSPICIOUS LOGIN
	SUSPICIOUS_LOGIN: 'suspicious_login',
	SUSPICIOUS_LOGIN_CODE: 'suspicious_login_code',
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
