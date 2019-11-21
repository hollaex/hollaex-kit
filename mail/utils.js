'use strict';

const Promise = require('bluebird');
const ses = require('../config/aws')('ses');
const { loggerEmail } = require('../config/logger');

const sendAwsRawEmail = (params) =>
	new Promise((resolve, reject) => {
		ses.sendRawEmail(params, (err, data) => {
			if (err) {
				loggerEmail.error('mail/index/sendRawEmail', err);
				reject(err);
			}
			resolve(data);
		});
	});

const sendAwsEmail = (params) =>
	new Promise((resolve, reject) => {
		ses.sendEmail(params, (err, data) => {
			if (err) {
				loggerEmail.error('mail/index/sendEmail', err);
				reject(err);
			}
			resolve(data);
		});
	});

const momentTz = require('moment-timezone');
const moment = require('moment');
const geoip = require('geo-from-ip');
const { FORMATDATE } = require('./strings');

const { DEFAULT_LANGUAGE, DEFAULT_TIMEZONE } = require('../constants');

const formatTimezone = (date, timezone = DEFAULT_TIMEZONE) => {
	let tzTime;
	if (timezone) {
		tzTime = momentTz.tz(date, timezone).format(FORMATDATE);
	} else {
		tzTime = moment(date).format(FORMATDATE);
	}
	return tzTime;
};

const formatDate = (
	date,
	language = DEFAULT_LANGUAGE,
	timezone = DEFAULT_TIMEZONE
) => {
	const momentDate = moment(date);
	let formatedDate;
	if (timezone) {
		formatedDate = momentDate.tz(timezone).format(FORMATDATE);
	} else {
		formatedDate = momentDate.format(FORMATDATE);
	}
	return formatedDate;
};

const getCountryFromIp = (ip) => {
	const geo = geoip.allData(ip);
	if (!geo) {
		return '';
	}
	return `${geo.city ? `${geo.city}, ` : ''}${
		geo.country ? `${geo.country}` : ''
	}`;
};

const nodemailer = require('nodemailer');
const {
	SMTP_SERVER,
	SMTP_PORT,
	SMTP_USER,
	SMTP_PASSWORD
} = require('../constants');

const transport = nodemailer.createTransport({
	host: SMTP_SERVER,
	port: SMTP_PORT,
	auth: {
		user: SMTP_USER,
		pass: SMTP_PASSWORD
	},
	logger: true,
});

const sendSMTPEmail = (params) => {
	return transport.sendMail(params);
};

module.exports = {
	sendAwsEmail,
	sendAwsRawEmail,
	formatDate,
	formatTimezone,
	getCountryFromIp,
	sendSMTPEmail
};
