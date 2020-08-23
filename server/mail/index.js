'use strict';

const { formatDate, getCountryFromIp, sendSMTPEmail } = require('./utils');
const payloadTemplate = require('./templates/helpers/payloadTemplate');
const { loggerEmail } = require('../config/logger');
const { getValidLanguage } = require('./utils');
const { MAILTYPE } = require('./strings');
const generateMessageContent = require('./templates');
const { sendSMSDeposit } = require('../plugins/sms/helpers');
const getStatusText = (status) => {
	return status ? 'COMPLETED' : 'PENDING';
};
const { GET_CONFIGURATION, DOMAIN } = require('../constants');
const AUDIT_EMAIL = () => GET_CONFIGURATION().constants.accounts.admin;
const SENDER_EMAIL = () => GET_CONFIGURATION().constants.emails.sender;
const SEND_EMAIL_COPY = () => GET_CONFIGURATION().constants.emails.send_email_to_support;
const API_NAME = () => GET_CONFIGURATION().constants.api_name;
const SUPPORT_SOURCE = () => `'${API_NAME()} Support <${SENDER_EMAIL()}>'`;
const BCC_ADDRESSES = () => SEND_EMAIL_COPY() ? [AUDIT_EMAIL()] : [];
const DEFAULT_LANGUAGE = () => GET_CONFIGURATION().constants.defaults.language;

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
			if (data.ip) data.country = getCountryFromIp(data.ip);
			break;
		}
		case MAILTYPE.SIGNUP:
		case MAILTYPE.RESET_PASSWORD:
		case MAILTYPE.USER_VERIFICATION_REJECT:
		case MAILTYPE.ACCOUNT_UPGRADE:
		case MAILTYPE.ACCOUNT_VERIFY:
		case MAILTYPE.INVALID_ADDRESS:
		case MAILTYPE.USER_DEACTIVATED:
		case MAILTYPE.WITHDRAWAL_REQUEST: {
			to.BccAddresses = BCC_ADDRESSES();
			break;
		}
		case MAILTYPE.DEPOSIT_CANCEL: {
			if (data.date) data.date = formatDate(data.date);
			to.BccAddresses = BCC_ADDRESSES();
			break;
		}
		case MAILTYPE.DEPOSIT:
		case MAILTYPE.WITHDRAWAL: {
			data.status = getStatusText(data.status);
			if (data.phoneNumber && data.status === 'COMPLETED')
				sendSMSDeposit(
					type,
					data.currency,
					data.phoneNumber,
					data.amount,
					formatDate(),
					language
				);
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

const send = (params) => {
	return sendSMTPEmail(params)
		.then((info) => {
			return info;
		})
		.catch((error) => {
			loggerEmail.error('mail/index/sendSTMPEmail', error);
		});
};

module.exports = {
	sendEmail
};
