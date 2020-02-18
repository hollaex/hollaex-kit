'use strict';

const Promise = require('bluebird');
// const ses = require('../config/aws')('ses');
const { loggerEmail } = require('../config/logger');

// const sendAwsRawEmail = (params) =>
// 	new Promise((resolve, reject) => {
// 		ses.sendRawEmail(params, (err, data) => {
// 			if (err) {
// 				loggerEmail.error('mail/index/sendRawEmail', err);
// 				reject(err);
// 			}
// 			resolve(data);
// 		});
// 	});

// const sendAwsEmail = (params) =>
// 	new Promise((resolve, reject) => {
// 		ses.sendEmail(params, (err, data) => {
// 			if (err) {
// 				loggerEmail.error('mail/index/sendEmail', err);
// 				reject(err);
// 			}
// 			resolve(data);
// 		});
// 	});

const momentTz = require('moment-timezone');
const moment = require('moment');
const geoip = require('geoip-lite');
const { FORMATDATE } = require('./strings');

const DEFAULT_LANGUAGE = process.env.NEW_USER_DEFAULT_LANGUAGE || 'en';
const VALID_LANGUAGES = process.env.VALID_LANGUAGES || (DEFAULT_LANGUAGE ? DEFAULT_LANGUAGE.split(',') : 'en');

const SMTP_SERVER = process.env.SMTP_SERVER || 'smtp.gmail.com';
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const DEFAULT_TIMEZONE = process.env.EMAILS_TIMEZONE || '';

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
	const geo = geoip.lookup(ip);
	if (!geo) {
		return '';
	}
	return `${geo.city ? `${geo.city}, ` : ''}${
		geo.country ? `${geo.country}` : ''
	}`;
};

const nodemailer = require('nodemailer');

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

const getValidLanguage = (language = DEFAULT_LANGUAGE) => {
	if (VALID_LANGUAGES.indexOf(language) > -1) {
		return language;
	}
	return DEFAULT_LANGUAGE;
};

module.exports = {
	// sendAwsEmail,
	// sendAwsRawEmail,
	formatDate,
	formatTimezone,
	getCountryFromIp,
	sendSMTPEmail,
	getValidLanguage
};
