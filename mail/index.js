'use strict';

const { sendAwsEmail, formatDate, getCountryFromIp } = require('./utils');
const payloadTemplate = require('./templates/helpers/payloadTemplate');
const { loggerEmail } = require('../config/logger');
const {
	SUPPORT_SOURCE,
	BCC_ADDRESSES,
	SUPPORT_EMAIL,
	MASTER_EMAIL,
	INQUIRY_EMAIL,
	DEFAULT_LANGUAGE,
	SEND_EMAIL_TO_SUPPORT,
	DOMAIN
} = require('../constants');
const { getValidLanguage } = require('../utils/strings');
const { MAILTYPE } = require('./strings');
const generateMessageContent = require('./templates');
const { sendSMSDeposit } = require('../api/helpers/sms');
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
			if (data.status) data.status = getStatusText(data.status);
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
	return sendAwsEmail(params)
		.then((result) => {
			loggerEmail.debug('email/send', result);
			return result;
		})
		.catch((err) => {
			loggerEmail.error('email/send catch', err);
		});
};

module.exports = {
	sendEmail
};
