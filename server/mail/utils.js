'use strict';

const momentTz = require('moment-timezone');
const moment = require('moment');
const geoip = require('geoip-lite');
const { FORMATDATE } = require('./strings');
const { GET_KIT_CONFIG, GET_KIT_SECRETS } = require('../constants');

const DEFAULT_LANGUAGE = () => GET_KIT_CONFIG().defaults.language;
const VALID_LANGUAGES  = () => GET_KIT_CONFIG().valid_languages;
const DEFAULT_TIMEZONE = () => GET_KIT_SECRETS().emails.timezone;

const SMTP_SERVER = () => GET_KIT_SECRETS().smtp.server;
const SMTP_PORT = () => parseInt(GET_KIT_SECRETS().smtp.port);
const SMTP_USER = () => GET_KIT_SECRETS().smtp.user;
const SMTP_PASSWORD = () => GET_KIT_SECRETS().smtp.password;

const formatTimezone = (date, timezone = DEFAULT_TIMEZONE()) => {
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
	language = DEFAULT_LANGUAGE(),
	timezone = DEFAULT_TIMEZONE()
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

const transport = () => {
	return nodemailer.createTransport({
		host: SMTP_SERVER(),
		port: SMTP_PORT(),
		auth: {
			user: SMTP_USER(),
			pass: SMTP_PASSWORD()
		},
		logger: true
	});
};

const sendSMTPEmail = (params) => {
	return transport().sendMail(params);
};

const getValidLanguage = (language = DEFAULT_LANGUAGE()) => {
	if (VALID_LANGUAGES() && VALID_LANGUAGES().indexOf(language) > -1) {
		return language;
	}
	return DEFAULT_LANGUAGE();
};

const sendSMTPTestEmail = async (params, smtp) => {
	return new Promise((resolve, reject) => {
		let transport;
		if (Object.keys(smtp).length > 0) {
			transport = nodemailer.createTransport({
				host: smtp.server,
				port: smtp.port,
				auth: {
					user: smtp.user,
					pass: smtp.password
				},
				logger: true
			});
		} else {
			transport = nodemailer.createTransport({
				host: SMTP_SERVER(),
				port: SMTP_PORT(),
				auth: {
					user: SMTP_USER(),
					pass: SMTP_PASSWORD()
				},
				logger: true
			});
		}

		transport.sendMail(params, (err, info) => {
			if (err) {
				return reject(err);
			}
			return resolve();
		});
	});
};

module.exports = {
	// sendAwsEmail,
	// sendAwsRawEmail,
	formatDate,
	formatTimezone,
	getCountryFromIp,
	sendSMTPEmail,
	getValidLanguage,
	sendSMTPTestEmail
};
