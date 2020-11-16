'use strict';

const rp = require('request-promise');
const { SERVER_PATH } = require('../constants');
const { INVALID_CAPTCHA, USER_NOT_FOUND } = require('../messages');
const {
	NODE_ENV,
	CAPTCHA_ENDPOINT,
	INVALID_PASSWORD,
	CODE_NOT_FOUND,
	CODE_USED,
	SAME_PASSWORD
} = require(`${SERVER_PATH}/constants`);
const { resolve, reject } = require('bluebird');
const { getKitSecrets } = require('./common');
const bcrypt = require('bcryptjs');
const uuid = require('uuid/v4');
const { all } = require('bluebird');
const { sendEmail } = require(`${SERVER_PATH}/mail`);
const { MAILTYPE } = require(`${SERVER_PATH}/mail/strings`);
const { getModel } = require('./database/model');
const dbQuery = require('./database/query');

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

module.exports = {
	checkCaptcha,
	resetUserPassword,
	isValidPassword,
	validatePassword,
	sendResetPasswordCode,
	changeUserPassword
};