'use strict';

const { formatDate, getCountryFromIp, sendSMTPEmail, sendSMTPTestEmail } = require('./utils');
const payloadTemplate = require('./templates/helpers/payloadTemplate');
const { loggerEmail } = require('../config/logger');
const { getValidLanguage } = require('./utils');
const { MAILTYPE } = require('./strings');
const generateMessageContent = require('./templates');
const { GET_KIT_CONFIG, GET_KIT_SECRETS, DOMAIN } = require('../constants');
const AUDIT_EMAIL = () => GET_KIT_SECRETS().emails.audit;
const SENDER_EMAIL = () => GET_KIT_SECRETS().emails.sender;
const SEND_EMAIL_COPY = () => GET_KIT_SECRETS().emails.send_email_to_support;
const API_NAME = () => GET_KIT_CONFIG().api_name;
const SUPPORT_SOURCE = () => `'${API_NAME()} Support <${SENDER_EMAIL()}>'`;
const BCC_ADDRESSES = () => SEND_EMAIL_COPY() ? [AUDIT_EMAIL()] : [];
const SMTP_SERVER = () => GET_KIT_SECRETS().smtp.server;
const SMTP_USER = () => GET_KIT_SECRETS().smtp.user;

const DEFAULT_LANGUAGE = () => {
	try {
		return GET_KIT_CONFIG().defaults.language;
	} catch (err) {
		return 'en';
	}
};

const sendEmail = (
	type,
	receiver,
	data,
	{ language = DEFAULT_LANGUAGE() },
	domain = DOMAIN
) => {
	language = getValidLanguage(language);
	let from = SUPPORT_SOURCE();
	let to = {
		ToAddresses: [receiver]
	};
	switch (type) {
		case MAILTYPE.WELCOME: {
			break;
		}
		case MAILTYPE.LOGIN: {
			if (data.time) data.time = formatDate(data.time, language);
			if (data.ip && !data.country) data.country = getCountryFromIp(data.ip);
			break;
		}
		case MAILTYPE.SIGNUP:
		case MAILTYPE.RESET_PASSWORD:
		case MAILTYPE.CHANGE_PASSWORD:
		case MAILTYPE.PASSWORD_CHANGED:
		case MAILTYPE.USER_VERIFICATION_REJECT:
		case MAILTYPE.ACCOUNT_UPGRADE:
		case MAILTYPE.ACCOUNT_VERIFY:
		case MAILTYPE.INVALID_ADDRESS:
		case MAILTYPE.USER_DEACTIVATED:
		case MAILTYPE.INVITED_OPERATOR:
		case MAILTYPE.DISCOUNT_UPDATE:
		case MAILTYPE.WITHDRAWAL_REQUEST:
		case MAILTYPE.BANK_VERIFIED:
		case MAILTYPE.CONFIRM_EMAIL:
		case MAILTYPE.LOCKED_ACCOUNT:
		case MAILTYPE.SUSPICIOUS_LOGIN:
		case MAILTYPE.SUSPICIOUS_LOGIN_CODE:
		case MAILTYPE.USER_DELETED:
		case MAILTYPE.DEPOSIT:
		case MAILTYPE.WITHDRAWAL:
		case MAILTYPE.P2P_MERCHANT_IN_PROGRESS:
		case MAILTYPE.P2P_BUYER_PAID_ORDER:
		case MAILTYPE.P2P_ORDER_EXPIRED:
		case MAILTYPE.P2P_BUYER_CANCELLED_ORDER:
		case MAILTYPE.P2P_BUYER_APPEALED_ORDER:
		case MAILTYPE.P2P_VENDOR_CONFIRMED_ORDER:
		case MAILTYPE.P2P_VENDOR_CANCELLED_ORDER:
		case MAILTYPE.P2P_VENDOR_APPEALED_ORDER:
		case MAILTYPE.AUTO_TRADE_ERROR:
		case MAILTYPE.AUTO_TRADE_FILLED:
		case MAILTYPE.AUTO_TRADE_REMINDER:
		case MAILTYPE.DOC_REJECTED:
		case MAILTYPE.DOC_VERIFIED: {
			to.BccAddresses = BCC_ADDRESSES();
			break;
		}
		case MAILTYPE.DEPOSIT_CANCEL: {
			if (data.date) data.date = formatDate(data.date);
			to.BccAddresses = BCC_ADDRESSES();
			break;
		}
		case MAILTYPE.ALERT:
		case MAILTYPE.SUSPICIOUS_DEPOSIT:
		case MAILTYPE.USER_VERIFICATION:
		case MAILTYPE.CONTACT_FORM: {
			to.ToAddresses = [AUDIT_EMAIL()];
			break;
		}
		case MAILTYPE.OTP_DISABLED:
		case MAILTYPE.OTP_ENABLED: {
			if (data.time) data.time = formatDate(data.time, language);
			if (data.ip) data.country = getCountryFromIp(data.ip);
			to.BccAddresses = BCC_ADDRESSES();
			break;
		}
		default:
			return;
	}
	const messageContent = generateMessageContent(
		type,
		receiver,
		data,
		language,
		domain
	);
	const payload = payloadTemplate(from, to, messageContent);
	return send(payload);
};

const sendRawEmail = (
	receivers,
	title,
	html,
	text
) => {
	let from = SUPPORT_SOURCE();

	const payload = {
		from,
		to: receivers,
		subject: `${API_NAME()} ${title || ''}`,
		html,
		text: text || ''
	};

	return send(payload);
};

const send = (params) => {
	if (SMTP_SERVER() && SMTP_USER() && SMTP_SERVER().length > 1) {
		return sendSMTPEmail(params)
			.then((info) => {
				return info;
			})
			.catch((error) => {
				loggerEmail.error('mail/index/sendSTMPEmail', error);
			});
	}
};

const testSendSMTPEmail = (receiver = '', smtp = {}) => {
	const to = { ToAddresses: [receiver] };
	const messageContent = {
		'subject': 'Test Email Config SMTP',
		'html': '<div><p>Test email is sent successfully</p></div>',
		'text': 'test content'
	};
	let from = SUPPORT_SOURCE();

	if (Object.keys(smtp).length > 0) {
		from = `'SMTP User <${smtp.user}>'`;
	}

	const payload = payloadTemplate(from, to, messageContent);

	return sendSMTPTestEmail(payload, smtp);
};

module.exports = {
	sendEmail,
	testSendSMTPEmail,
	sendRawEmail
};
