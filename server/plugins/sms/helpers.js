'use strict';

const redis = require('../../db/redis').duplicate();
const otp = require('otp');
const Promise = require('bluebird');
const PhoneNumber = require('awesome-phonenumber');
const {
	SMS_CODE_KEY,
	SMS_CODE_EXPIRATION_TIME
} = require('../constants');
const { GET_KIT_CONFIG } = require('../../constants');
const {
	SMS_ERROR,
	SMS_PHONE_DONT_MATCH,
	SMS_CODE_INVALID,
	SMS_CODE_EXPIRED,
	INVALID_PHONE_NUMBER
} = require('./messages');

const DEFAULT_LANGUAGE = () => GET_KIT_CONFIG().constants.defaults.language;
const OTP_NAME = () => GET_KIT_CONFIG().constants.api_name;
const sns = () => require('./sns')();

const generateUserKey = (user_id) => `${SMS_CODE_KEY}:${user_id}`;

const createSMSCode = () => {
	return generateOtp();
}

const generateOtp = (secret) => {
	const options = {
		name: OTP_NAME(),
		secret
	};

	const totp = otp(options).totp();
	return totp;
};

const storeSMSCode = (user_id, phone, code) => {
	const userKey = generateUserKey(user_id);
	const data = {
		phone,
		code
	};

	return redis.setAsync(
		userKey,
		JSON.stringify(data),
		'EX',
		SMS_CODE_EXPIRATION_TIME
	);
};

const checkSMSCode = (user_id, phone, code) => {
	const userKey = generateUserKey(user_id);
	return redis
		.getAsync(userKey)
		.then((data) => {
			if (!data) {
				throw new Error(SMS_CODE_EXPIRED);
			}
			return JSON.parse(data);
		})
		.then((data) => {
			if (data.phone !== phone) {
				throw new Error(SMS_PHONE_DONT_MATCH);
			} else if (data.code !== code) {
				throw new Error(SMS_CODE_INVALID);
			}
			return data;
		});
};

const deleteSMSCode = (user_id) => {
	const userKey = generateUserKey(user_id);
	return redis.delAsync(userKey);
};

const sendAwsSMS = (phoneNumber, message) => {
	const params = {
		Message: message,
		MessageStructure: 'string',
		PhoneNumber: phoneNumber
	};

	return new Promise((resolve, reject) => {
		sns().publish(params, (err, data) => {
			if (err) {
				const error = new Error(SMS_ERROR);
				error.statusCode = 400;
				return reject(error);
			}
			return resolve(data);
		});
	});
};

const sendSMS = (number = '', data = {}) => {
	const phoneNumber = new PhoneNumber(number);

	if (!phoneNumber.isValid()) {
		return Promise.resolve(INVALID_PHONE_NUMBER);
	} else {
		const message = data.message;
		return sendAwsSMS(phoneNumber.getNumber(), message);
	}
};

const sendSMSDeposit = (
	type,
	currency,
	phoneNumber,
	amount,
	timestamp,
	language = DEFAULT_LANGUAGE()
) => {
	const { SMS } = require(`../../mail/strings/${language}`);
	let message;
	if (type === 'deposit' || type === 'withdrawal') {
		message = SMS[type](currency, amount);
	} else {
		throw new Error(`Invalid type ${type}`);
	}

	const data = {
		message
	};
	return sendSMS(phoneNumber, data).catch((err) => {
		return;
	});
};

const updateUserPhoneNumber = (user, phone_number, options = {}) => {
	return user.update(
		{ phone_number },
		{ fields: ['phone_number'], ...options }
	);
};

module.exports = {
	createSMSCode,
	storeSMSCode,
	checkSMSCode,
	deleteSMSCode,
	sendSMS,
	sendSMSDeposit,
	updateUserPhoneNumber
}