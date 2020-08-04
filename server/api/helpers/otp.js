'use strict';

const otp = require('otp');
const { loggerOtp } = require('../../config/logger');
const { OtpCode, User, sequelize } = require('../../db/models');
const { getConfiguration } = require('../../init');
const { INVALID_OTP_CODE } = require('../../messages');
const OTP_NAME = () => getConfiguration().constants.api_name;

/*
	Function generate the otp totp code, should take one parameter:
	Param 1(string): otp secret
	Return the totp code.
 */
const generateOtp = (secret, epoch = 0) => {
	loggerOtp.debug('helpers/otp/generateOtp/parameters', secret);
	const options = {
		name: OTP_NAME(),
		secret,
		epoch
	};

	loggerOtp.debug('helpers/otp/generateOtp/options', options);

	const totp = otp(options).totp();
	loggerOtp.debug('helpers/otp/generateOtp/totp', totp);
	return totp;
};

/*
	Function generate the otp secret.
	Return the otp secret.
 */
const generateOtpSecret = () => {
	const seed = otp({
		name: OTP_NAME()
	});
	loggerOtp.debug('helpers/otp/generateOtpSecret/seed', seed);
	return seed.secret;
};

/*
	Function to verify if the secret matches the otp code, should take two parameter:
	Param 1(string): user otp secret
	Param 1(string): user otp code
	Return the verification of the secret with the code.
 */
const verifyOtp = (userSecret, userDigits) => {
	loggerOtp.debug('helpers/otp/verifyOtp/parameters', userSecret, userDigits);
	const serverDigits = [generateOtp(userSecret, 30), generateOtp(userSecret), generateOtp(userSecret, -30)];
	loggerOtp.debug('helpers/otp/verifyOtp/serverDigits', serverDigits);
	return serverDigits.includes(userDigits);
};

/*
	Function to find the user otp code, should take one parameter:
	Param 1(integer): user id
	Return a promise with the otp code row from the db.
 */
const findUserOtp = (user_id) => {
	loggerOtp.debug('helpers/otp/findUserOtp', user_id);
	return OtpCode.findOne({
		where: {
			used: false,
			user_id
		},
		attributes: ['id', 'secret']
	});
};

/*
	Function to create a user otp code, should take one parameter:
	Param 1(integer): user id
	Return a promise with the otp secret created.
 */
const createOtp = (user_id) => {
	const secret = generateOtpSecret();
	loggerOtp.debug('helpers/otp/createOtp', user_id, secret);
	return OtpCode.create({
		user_id,
		secret
	}).then((otpCode) => otpCode.secret);
};

/*
	Function to set used to true in the user otp code and update the user and set otp_enabled to true, should take one parameter:
	Param 1(integer): user id
	Return a promise with the user updated.
 */
const setActiveUserOtp = (user_id) => {
	loggerOtp.debug('helpers/otp/setActiveUserOtp', user_id);
	return sequelize.transaction((transaction) => {
		return findUserOtp(user_id)
			.then((otp) => {
				return otp.update(
					{ used: true },
					{ fields: ['used'], transaction }
				);
			})
			.then(() => {
				return updateUserOtpEnabled(user_id, true, transaction);
			});
	});
};

const verifyUserOtpCode = (user_id, otp_code) => {
	loggerOtp.debug('helpers/otp/verifyUserOtpCode', user_id);
	return OtpCode.findOne({
		where: {
			used: true,
			user_id
		},
		attributes: ['id', 'secret'],
		order: [['updated_at', 'DESC']]
	})
		.then((otpCode) => {
			loggerOtp.debug(
				'helpers/otp/verifyUserOtpCode otpCode',
				otpCode.dataValues,
				otp_code
			);
			return verifyOtp(otpCode.secret, otp_code);
		})
		.then((validOtp) => {
			if (!validOtp) {
				throw new Error(INVALID_OTP_CODE);
			}
			return true;
		});
};

/*
	Function to verify if the secret matches the otp code, should take two parameter:
	Param 1(integer): user id
	Param 1(string): user otp code
	Return the verification of the secret with the code.
 */
const verifyOtpBeforeAction = (user_id, otp_code) => {
	loggerOtp.debug('helpers/otp/verifyOtpBeforeAction', user_id);
	return hasUserOtpEnabled(user_id).then((otp_enabled) => {
		loggerOtp.debug(
			'helpers/otp/verifyOtpBeforeAction otp_enabled',
			otp_enabled
		);
		if (otp_enabled) {
			return verifyUserOtpCode(user_id, otp_code);
		} else {
			return true;
		}
	});
};

/*
	Function to find if a user has otp_enabled,
	should take one parameter:
	Param 1(integer): user id
	Return a promise with a boolean with the otp_enabled status.
 */
const hasUserOtpEnabled = (id) => {
	return User.findOne({
		where: { id },
		attributes: ['otp_enabled']
	}).then((user) => {
		return user.otp_enabled;
	});
};

/*
  Function to find update the uset otp_enabled field,
  should take two parameter:

  Param 1(integer): user id
  Param 2(boolean): otp_enabled

  Return a promise with the updated user.
 */
const updateUserOtpEnabled = (id, otp_enabled = false, transaction) => {
	return User.findOne({
		where: { id },
		attributes: ['id', 'otp_enabled']
	}).then((user) => {
		return user.update(
			{ otp_enabled },
			{ fields: ['otp_enabled'], transaction }
		);
	});
};

module.exports = {
	generateOtp,
	generateOtpSecret,
	verifyOtp,
	findUserOtp,
	createOtp,
	setActiveUserOtp,
	verifyOtpBeforeAction,
	hasUserOtpEnabled
};
