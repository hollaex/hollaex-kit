'use strict';

// const model = require('./database').model;
const dbQuery = require('./database').query;
const { has, omit } = require('lodash');
const { isEmail } = require('validator');
const { SERVER_PATH, SETTING_KEYS, OMITTED_USER_FIELDS } = require('../constant');
const { getFrozenUsers } = require(`${SERVER_PATH}/init`);
const { publisher } = require('./database/redis');
const { INIT_CHANNEL } = require(`${SERVER_PATH}/constant`);
const { sendEmail } = require(`${SERVER_PATH}/mail`);
const { MAILTYPE } = require(`${SERVER_PATH}/mail/strings`);
const { getKit, getSecrets, getCoins, getPairs } = require(`${SERVER_PATH}/init`);

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
	where.raw = rawData;

	return dbQuery.findOne('user', {
		where
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
	omitUserFields
};