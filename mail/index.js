'use strict';

const { sendAwsEmail, formatDate, getCountryFromIp, sendSMTPEmail } = require('./utils');
const payloadTemplate = require('./templates/helpers/payloadTemplate');
const { loggerEmail } = require('../config/logger');
const SUPPORT_EMAIL = require('../init').getConfiguration().constants.accounts.support;
const INQUIRY_EMAIL = require('../init').getConfiguration().constants.accounts.support;
const MASTER_EMAIL = require('../init').getConfiguration().constants.accounts.admin;

const SEND_EMAIL_TO_SUPPORT = (require('../init').getConfiguration().constants.emails.send_email_to_support &&
	require('../init').getConfiguration().constants.emails.send_email_to_support === 'true') ||
	process.env.NODE_ENV === 'production';
const API_NAME = require('../init').getConfiguration().constants.api_name;
const SUPPORT_SOURCE = `'${API_NAME} Support <${SENDER_EMAIL}>'`;
const BCC_ADDRESSES = SEND_EMAIL_TO_SUPPORT ? [exports.MASTER_EMAIL] : [];
const DOMAIN = require('../init').getConfiguration().constants.domain;
const DEFAULT_LANGUAGE = require('../init').getConfiguration().constants.defaults.language;
const { getValidLanguage } = require('../utils/strings');
const { MAILTYPE } = require('./strings');
const generateMessageContent = require('./templates');
const { sendSMSDeposit } = require('../plugins/sms/helpers');
const getStatusText = (status) => {
	return status ? 'COMPLETED' : 'PENDING';
};

const sendEmail = (
	type,
	receiver,
	data,
	{ language = DEFAULT_LANGUAGE },
	domain = DOMAIN
) => {
	language = getValidLanguage(language);
	let from = SUPPORT_SOURCE;
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
		case MAILTYPE.WITHDRAWAL_REQUEST: {
			to.BccAddresses = BCC_ADDRESSES;
			break;
		}
		case MAILTYPE.DEPOSIT_CANCEL: {
			if (data.date) data.date = formatDate(data.date);
			to.BccAddresses = BCC_ADDRESSES;
			break;
		}
		case MAILTYPE.DEPOSIT:
		case MAILTYPE.WITHDRAWAL: {
			data.status = getStatusText(data.status);
			if (data.phoneNumber && data.status)
				sendSMSDeposit(
					type,
					data.currency,
					data.phoneNumber,
					data.amount,
					formatDate(),
					language
				);
			to.BccAddresses = BCC_ADDRESSES;
			break;
		}
		case MAILTYPE.SUSPICIOUS_DEPOSIT: {
			if (!SEND_EMAIL_TO_SUPPORT) return;
			to.ToAddresses = [MASTER_EMAIL];
			break;
		}
		case MAILTYPE.USER_VERIFICATION:
		case MAILTYPE.CONTACT_FORM: {
			if (!SEND_EMAIL_TO_SUPPORT) return;
			to.ToAddresses = [INQUIRY_EMAIL, SUPPORT_EMAIL, MASTER_EMAIL];
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
