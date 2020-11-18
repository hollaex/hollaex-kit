'use strict';

const rp = require('request-promise');
const { SERVER_PATH } = require('../constants');
const { INVALID_CAPTCHA, USER_NOT_FOUND, TOKEN_OTP_MUST_BE_ENABLED, INVALID_OTP_CODE } = require('../messages');
const {
	NODE_ENV,
	CAPTCHA_ENDPOINT,
	INVALID_PASSWORD,
	CODE_NOT_FOUND,
	CODE_USED,
	SAME_PASSWORD
} = require(`${SERVER_PATH}/constants`);
const { resolve, reject } = require('bluebird');
const { getKitSecrets, getKitConfig } = require('./common');
const bcrypt = require('bcryptjs');
const uuid = require('uuid/v4');
const { all } = require('bluebird');
const { sendEmail } = require(`${SERVER_PATH}/mail`);
const { MAILTYPE } = require(`${SERVER_PATH}/mail/strings`);
const { getModel } = require('./database/model');
const dbQuery = require('./database/query');
const otp = require('otp');

const checkCaptcha = (captcha = '', remoteip = '') => {
	if (!captcha) {
		if (NODE_ENV === 'development') {
			return resolve();
		} else {
			return reject(new Error(INVALID_CAPTCHA));
		}
	} else if (!getKitSecrets().captcha || !getKitSecrets().captcha.secret_key) {
		return resolve();
	}

	const options = {
		method: 'POST',
		form: {
			secret: getKitSecrets().captcha.secret_key,
			response: captcha,
			remoteip
		},
		uri: CAPTCHA_ENDPOINT
	};

	return rp(options)
		.then((response) => JSON.parse(response))
		.then((response) => {
			if (!response.success) {
				throw new Error(INVALID_CAPTCHA);
			}
			return;
		});
};

const validatePassword = (userPassword, inputPassword) => {
	return bcrypt.compare(inputPassword, userPassword);
};

const isValidPassword = (value) => {
	return /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(value);
};

const resetUserPassword = (resetPasswordCode, newPassword) => {
	if (!isValidPassword(newPassword)) {
		return reject(new Error(INVALID_PASSWORD));
	}
	return getResetPasswordCode(resetPasswordCode)
		.then((code) => {
			if (code.used) {
				throw new Error(CODE_USED);
			}
			return code.update({ used: true }, { fields: ['used'] });
		})
		.then((code) => dbQuery.findOne('user', { where: { id: code.user_id } }))
		.then((user) => user.update({ password: newPassword }, { fields: ['password'] }));
};

const changeUserPassword = (email, oldPassword, newPassword) => {
	if (oldPassword === newPassword) {
		return reject(new Error(SAME_PASSWORD));
	}
	if (!isValidPassword(newPassword)) {
		return reject(new Error(INVALID_PASSWORD));
	}
	return dbQuery.findOne('user', { where: { email } })
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			}
			return all([ user, validatePassword(user.password, oldPassword) ]);
		})
		.then(([ user, passwordIsValid ]) => {
			if (!passwordIsValid) {
				throw new Error(INVALID_PASSWORD);
			} else {
				return user;
			}
		})
		.then((user) => {
			return user.update({ password: newPassword });
		});
};

const getResetPasswordCode = (code) => {
	return dbQuery.findOne('reset password code', { where: { code } })
		.then((code) => {
			if (!code) {
				const error = new Error(CODE_NOT_FOUND);
				error.status = 404;
				throw error;
			}
			return code;
		});
};

const createResetPasswordCode = (userId) => {
	return dbQuery.findOne('reset password code', {
		where: { user_id: userId, used: false },
		attributes: ['code']
	})
		.then((code) => {
			if (code) {
				return code;
			}
			return getModel('reset password code').create({
				user_id: userId,
				code: uuid()
			});
		})
		.then((code) => code.code);
};

const sendResetPasswordCode = (email, captcha, ip, domain) => {
	return dbQuery.findOne('user', { where: { email } })
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			}
			return all([ createResetPasswordCode(user.id), user, checkCaptcha(captcha, ip) ]);
		})
		.then(([ code, user ]) => {
			sendEmail(
				MAILTYPE.RESET_PASSWORD,
				email,
				{ code, ip },
				user.settings,
				domain
			);
			return;
		});
};

const generateOtp = (secret, epoch = 0) => {
	const options = {
		name: getKitConfig().api_name,
		secret,
		epoch
	};
	const totp = otp(options).totp();
	return totp;
};

const verifyOtp = (userSecret, userDigits) => {
	const serverDigits = [generateOtp(userSecret, 30), generateOtp(userSecret), generateOtp(userSecret, -30)];
	return serverDigits.includes(userDigits);
};

const hasUserOtpEnabled = (id) => {
	return dbQuery.findOne('user', {
		where: { id },
		attributes: ['otp_enabled']
	}).then((user) => {
		return user.otp_enabled;
	});
};

const verifyUserOtpCode = (user_id, otp_code) => {
	return dbQuery.findOne('otp code', {
		where: {
			used: true,
			user_id
		},
		attributes: ['id', 'secret'],
		order: [['updated_at', 'DESC']]
	})
		.then((otpCode) => {
			return verifyOtp(otpCode.secret, otp_code);
		})
		.then((validOtp) => {
			if (!validOtp) {
				throw new Error(INVALID_OTP_CODE);
			}
			return true;
		});
};

const verifyOtpBeforeAction = (user_id, otp_code) => {
	return hasUserOtpEnabled(user_id).then((otp_enabled) => {
		if (otp_enabled) {
			return verifyUserOtpCode(user_id, otp_code);
		} else {
			return true;
		}
	});
};

const checkOtp = (userId) => {
	return hasUserOtpEnabled(userId).then((otp_enabled) => {
		if (otp_enabled) {
			throw new Error('OTP is already enabled');
		}
		return findUserOtp(userId);
	});
};

/*
	Function generate the otp secret.
	Return the otp secret.
 */
const generateOtpSecret = () => {
	const seed = otp({
		name: getKitConfig().api_name
	});
	return seed.secret;
};

/*
	Function to find the user otp code, should take one parameter:
	Param 1(integer): user id
	Return a promise with the otp code row from the db.
 */
const findUserOtp = (user_id) => {
	return dbQuery.findOne('otp code', {
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
	return getModel('otp code').create({
		user_id,
		secret
	})
		.then((otpCode) => otpCode.secret);
};

/*
  Function to find update the uset otp_enabled field,
  should take two parameter:

  Param 1(integer): user id
  Param 2(boolean): otp_enabled

  Return a promise with the updated user.
 */
const updateUserOtpEnabled = (id, otp_enabled = false, transaction) => {
	return dbQuery.findOne('user', {
		where: { id },
		attributes: ['id', 'otp_enabled']
	}).then((user) => {
		return user.update(
			{ otp_enabled },
			{ fields: ['otp_enabled'], transaction }
		);
	});
};

/*
	Function to set used to true in the user otp code and update the user and set otp_enabled to true, should take one parameter:
	Param 1(integer): user id
	Return a promise with the user updated.
 */
const setActiveUserOtp = (user_id) => {
	return getModel('sequelize').transaction((transaction) => {
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

const userHasOtpEnabled = (userId) => {
	return dbQuery.findOne('user', {
		where: { id: userId },
		raw: true,
		attributes: [ 'otp_enabled' ]
	})
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			}
			return user.otp_enabled;
		});
};

const checkUserOtpActive = (userId, otpCode) => {
	return all([
		dbQuery.findOne('user', {
			where: { id: userId },
			raw: true,
			attributes: [ 'otp_enabled' ]
		}),
		verifyOtpBeforeAction(userId, otpCode)
	]).then(([ user, validOtp ]) => {
		if (!user.otp_enabled) {
			throw new Error(TOKEN_OTP_MUST_BE_ENABLED);
		} else if (!validOtp) {
			throw new Error(INVALID_OTP_CODE);
		}
		return;
	});
};

module.exports = {
	checkCaptcha,
	resetUserPassword,
	isValidPassword,
	validatePassword,
	sendResetPasswordCode,
	changeUserPassword,
	hasUserOtpEnabled,
	verifyOtpBeforeAction,
	verifyOtp,
	checkOtp,
	generateOtp,
	generateOtpSecret,
	findUserOtp,
	setActiveUserOtp,
	updateUserOtpEnabled,
	createOtp,
	userHasOtpEnabled,
	checkUserOtpActive
};