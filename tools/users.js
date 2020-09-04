'use strict';

const { getModel } = require('./database').model;
const dbQuery = require('./database').query;
const { has, omit } = require('lodash');
const { isEmail } = require('validator');
const { SERVER_PATH, SETTING_KEYS, OMITTED_USER_FIELDS, DEFAULT_ORDER_RISK_PERCENTAGE } = require('../constants');
const { SIGNUP_NOT_AVAILABLE, PROVIDE_VALID_EMAIL, USER_EXISTS, INVALID_PASSWORD, INVALID_VERIFICATION_CODE } = require('../messages');
const { getFrozenUsers } = require(`${SERVER_PATH}/init`);
const { publisher } = require('./database/redis');
const { INIT_CHANNEL } = require(`${SERVER_PATH}/constants`);
const { sendEmail } = require(`${SERVER_PATH}/mail`);
const { MAILTYPE } = require(`${SERVER_PATH}/mail/strings`);
const { getKit, getSecrets, getCoins, getPairs, getKitLib } = require(`${SERVER_PATH}/init`);
const { all } = require('bluebird');

const signUpUser = (email, password, referral) => {
	if (!getKit().new_user_is_activated) {
		throw new Error(SIGNUP_NOT_AVAILABLE);
	}

	if (!email || !isEmail(email)) {
		throw new Error(PROVIDE_VALID_EMAIL);
	}

	if (!isValidPassword(password)) {
		throw new Error(INVALID_PASSWORD);
	}

	return dbQuery.findOne('user', {
		where: { email: email.toLowerCase() },
		attributes: ['email']
	})
		.then((user) => {
			if (user) {
				throw new Error(USER_EXISTS);
			}
			return getModel('user').create({
				email,
				password,
				settings: INITIAL_SETTINGS()
			});
		})
		.then((user) => {
			return all([
				findVerificationCodeByUserId(user.id),
				user
			]);
		})
		.then(([ verificationCode, user ]) => {
			sendEmail(
				MAILTYPE.SIGNUP,
				email,
				verificationCode.code,
				{}
			);
			if (referral) {
				checkAffiliation(referral, user.id);
			}
			return user;
		});
};

const verifyUser = (email, verificationCode) => {
	return findVerificationCodeByUserEmail(email)
		.then((code) => {
			if (verificationCode !== code) {
				throw new Error(INVALID_VERIFICATION_CODE);
			}
			return verificationCode.update({ verified: true }, { returning: true });
		})
		.then((verificationCode) => {
			return dbQuery.findOne('user', {
				where: { id: verificationCode.user_id },
				attributes: ['email', 'settings']
			});
		})
		.then((user) => {
			return all([user, getKitLib().createUserNetwork(email)]);
		})
		.then((data) => {
			return data;
		});
};

const isValidPassword = (value) => {
	return /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(value);
};

const findVerificationCodeByUserEmail = (email) => {
	return getUserByEmail(email)
		.then((user) => {
			return findVerificationCodeByUserId(user.id);
		});
};

const findVerificationCodeByUserId = (user_id) => {
	return dbQuery.findOne('verification code', {
		where: { user_id },
		attributes: ['id', 'code', 'verified', 'user_id']
	}).then((verificationCode) => {
		if (verificationCode.verified) {
			throw new Error('User is verified');
		}
		return verificationCode;
	});
};

const findUserByAffiliationCode = (affiliationCode) => {
	const code = affiliationCode.toUpperCase().trim();
	return dbQuery.finOne('user', {
		where: { affiliation_code: code },
		attributes: ['id', 'email', 'affiliation_code']
	});
};

const checkAffiliation = (affiliationCode, user_id) => {
	let discount = 0; // default discount rate in percentage
	return findUserByAffiliationCode(affiliationCode)
		.then((referrer) => {
			if (getSecrets().plugins.affiliation && getSecrets().plugins.affiliation.discount) {
				discount = getSecrets().plugins.affiliation.discount;
			}

			return getModel('affiliation').create({
				user_id,
				referer_id: referrer.id
			});
		})
		.then((affiliation) => {
			return getModel('user').update(
				{
					discount
				},
				{
					where: {
						id: affiliation.user_id
					},
					fields: ['discount']
				}
			);
		});
};

/**
 *
 * @param {object} user - User object
 * @return {object}
 */
const omitUserFields = (user) => {
	return omit(user, OMITTED_USER_FIELDS);
};

const getAllUsers = () => {
	return dbQuery.findAndCountAllWithRows('user', {
		attributes: {
			exclude: OMITTED_USER_FIELDS
		}
	});
};

const getUserByCryptoAddress = (currency, address) => {
	if (!currency || !address) {
		throw new Error('Please provide the user\'s currency and crypto address');
	}
	return dbQuery.findOne('user', {
		where: { crypto_wallet: { [currency]: address } }
	});
};

const getUser = (opts = {}, rawData = true) => {
	if (!opts.email && !opts.kit_id && !opts.network_id) {
		throw new Error('Please provide the user\'s kit id, network id, or email');
	}

	const where = {};
	if (opts.email) {
		where.email = opts.email;
	} else if (opts.kit_id) {
		where.id = opts.kit_id;
	} else {
		where.network_id = opts.network_id;
	}

	return dbQuery.findOne('user', {
		where,
		raw: rawData
	})
		.then((user) => {
			if (!user) {
				throw new Error('User does not exist');
			} else {
				return user;
			}
		});
};

const getUserByEmail = (email, rawData = true) => {
	if (!email || !isEmail(email)) {
		throw new Error('Please provide a valid email address');
	}
	return getUser({ email }, rawData);
};

const getUserByKitId = (kit_id, rawData = true) => {
	if (!kit_id) {
		throw new Error('Please provide a kit id');
	}
	return getUser({ kit_id }, rawData);
};

const getUserByNetworkId = (network_id, rawData = true) => {
	if (!network_id) {
		throw new Error('Please provide a network id');
	}
	return getUser({ network_id }, rawData);
};

const freezeUser = (opts = {}, rawData = true) => {
	return getUser(opts, false)
		.then((user) => {
			if (!user.activated) {
				throw new Error('User account is already frozen');
			}
			return user.update({ activated: false }, { fields: ['activated'], returning: true, raw: rawData });
		})
		.then((user) => {
			publisher.publish(INIT_CHANNEL, JSON.stringify({type: 'freezeUser', data: user.id }));
			sendEmail(
				MAILTYPE.USER_DEACTIVATED,
				user.email,
				{
					type: 'deactivated'
				},
				user.settings
			);
			return user;
		});
};

const unfreezeUser = (opts = {}, rawData = true) => {
	return getUser(opts, false)
		.then((user) => {
			if (user.activated) {
				throw new Error('User account is not frozen');
			}
			return user.update({ activated: true }, { fields: ['activated'], returning: true, raw: rawData });
		})
		.then((user) => {
			publisher.publish(INIT_CHANNEL, JSON.stringify({type: 'unfreezeUser', data: user.id }));
			sendEmail(
				MAILTYPE.USER_DEACTIVATED,
				user.email,
				{
					type: 'activated'
				},
				user.settings
			);
			return user;
		});
};

const getUserRole = (opts = {}) => {
	return getUser(opts, true)
		.then((user) => {
			if (user.is_admin) {
				return 'admin';
			} else if (user.is_supervisor) {
				return 'supervisor';
			} else if (user.is_support) {
				return 'support';
			} else if (user.is_kyc) {
				return 'kyc';
			} else if (user.is_tech) {
				return 'tech';
			} else {
				return 'user';
			}
		});
};

const DEFAULT_SETTINGS = {
	language: getKit().defaults.language,
	orderConfirmationPopup: true
};

const joinSettings = (userSettings = {}, newSettings = {}) => {
	const joinedSettings = {};
	SETTING_KEYS.forEach((key) => {
		if (has(newSettings, key)) {
			joinedSettings[key] = newSettings[key];
		} else if (has(userSettings, key)) {
			joinedSettings[key] = userSettings[key];
		} else {
			joinedSettings[key] = DEFAULT_SETTINGS[key];
		}
	});
	return joinedSettings;
};

const updateUserSettings = (opts = {}, settings = {}, rawData = true) => {
	return getUser(opts, false)
		.then((user) => {
			if (Object.keys(settings).length > 0) {
				settings = joinSettings(user.dataValues.settings, settings);
			}
			return user.update({ settings }, {
				fields: [
					'settings'
				],
				returning: true,
				raw: rawData
			});
		})
		.then((user) => {
			return user;
		});
};

const INITIAL_SETTINGS = () => {
	return {
		notification: {
			popup_order_confirmation: true,
			popup_order_completed: true,
			popup_order_partially_filled: true
		},
		interface: {
			order_book_levels: 10,
			theme: getKit().defaults.theme
		},
		language: getKit().defaults.language,
		audio: {
			order_completed: true,
			order_partially_completed: true,
			public_trade: false
		},
		risk: {
			order_portfolio_percentage: DEFAULT_ORDER_RISK_PERCENTAGE
		},
		chat: {
			set_username: false
		}
	};
};

const findUserEmailByVerificationCode = (code) => {
	return dbQuery.findOne('verification code', {
		where: { code },
		attributes: ['id', 'code', 'verified', 'user_id']
	})
		.then((verificationCode) => {
			if (!verificationCode) {
				throw new Error('Verification Code invalid');
			} else if (verificationCode.verified) {
				throw new Error('Verification Code used');
			}
			return dbQuery.findOne('user', {
				where: { id: verificationCode.user_id },
				attributes: ['email']
			});
		})
		.then((user) => {
			return user.email;
		});
};

module.exports = {
	getUserByEmail,
	getUserByKitId,
	getUserByNetworkId,
	getUserByCryptoAddress,
	getFrozenUsers,
	freezeUser,
	unfreezeUser,
	getAllUsers,
	getUserRole,
	updateUserSettings,
	omitUserFields,
	signUpUser,
	verifyUser,
	findVerificationCodeByUserEmail,
	findUserEmailByVerificationCode
};