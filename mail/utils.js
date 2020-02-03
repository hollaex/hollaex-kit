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
const geoip = require('geoip-lite');
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
	const geo = geoip.lookup(ip);
	if (!geo) {
		return '';
	}
	return `${geo.city ? `${geo.city}, ` : ''}${
		geo.country ? `${geo.country}` : ''
	}`;
};

const { transport } = require('../config/nodemailer');

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
