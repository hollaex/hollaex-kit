'use strict';

const { all } = require('bluebird');
const {
	User,
	Balance,
	VerificationImage,
	Login,
	sequelize
} = require('../../db/models');
const { DEFAULT_ORDER_RISK_PERCENTAGE } = require('../../constants');
const { Op } = require('sequelize');
const { convertSequelizeCountAndRows } = require('./general');
const cache = require('./cache');
const {
	USER_NOT_FOUND,
	USENAME_IS_TAKEN
} = require('../../messages');
const { getCurrencies, getConfiguration } = require('../../init');
const { loggerLogin } = require('../../config/logger');

/*
	Function that remove values before send the user to the response,
	should take one parameter:
	Param 1(Object): User data from DB
	Return the user data values.
 */
const cleanUserFromDb = (user) => {
	const userData = {
		...user
	};

	userData.balance = user.balance.dataValues;

	if (userData.id_data) {
		if (!userData.id_data.issued_date) {
			delete userData.id_data.issued_date;
		}
		if (!userData.id_data.expiration_date) {
			delete userData.id_data.expiration_date;
		}
	}
	if (!userData.dob) {
		delete userData.dob;
	}

	return userData;
};

/*
	Function to query the DB to find a user, should take one parameter:
	Param 1(object): query parameters of the search
	Return a promise with the user, if the user is not in the DB, it throws an error.
 */
const findUser = (query) =>{
	return User.findOne(query).then((user) => {
		if (!user) {
			const error = new Error(USER_NOT_FOUND);
			error.status = 404;
			throw error;
		}

		return user;
	});
};

/*
	Function to query the DB to find all the users, should take one parameter:
	Param 1(object): query parameters of the search
	Return a promise with the users.
 */
const findUsers = (query = {}) => {
	return User.findAll(query);
};

const findUsersByCryptoAddress = (currency, address) => {
	return User.findAll({
		where: { crypto_wallet: { [currency]: address } },
		attributes: ['id', 'email', 'crypto_wallet', 'settings', 'phone_number']
	});
};

/*
	Function to find a user by the email, it will exclude the password, should take one parameter:
	Param 1(String): User email
	Param 2(array[string], optional): Keys of fields for the query
	Return a promise with the user, if the dob of the user is not set, it will not return it.
	If the user is not found, it will throw an error.
 */
const getUserValuesByEmail = (email, include) => {
	return findUser({
		where: { email: email.toLowerCase() },
		attributes: include || {
			exclude: ['password', 'is_admin', 'is_support', 'is_supervisor', 'is_kyc', 'is_tech', 'note']
		},
		include: [
			{
				model: Balance,
				as: 'balance',
				attributes: {
					exclude: ['id', 'user_id', 'created_at']
				}
			},
			{
				model: VerificationImage,
				as: 'images',
				attributes: ['id']
			}
		]
	})
		.then((data) => {
			return all([
				data.dataValues,
				// findUserPairFees(data.verification_level)
				// TODO
			]);
		})
		.then(([userData, fees]) => {
			return {
				...userData,
				fees
			};
		})
		.then(cleanUserFromDb);
};

/*
	Function to find a user by the email in the cache to avoid DB call to query for user id,
	should take one parameter:
	Param 1(String): User email
	Return a promise with the user.
	If the user is not found, it will throw an error.
 */
const findUserByEmail = (userEmail) => {
	const email = userEmail.toLowerCase();
	return new Promise((resolve, reject) => {
		const userKey = `user_${email}`;
		if (cache.hasKey(userKey)) {
			resolve(cache.getKey(userKey));
		} else {
			findUser({
				where: { email },
				attributes: ['id', 'email', 'crypto_wallet', 'settings']
			})
				.then((user) => {
					cache.setKey(userKey, user.dataValues);
					resolve(user.dataValues);
				})
				.catch((err) => {
					reject(err);
				});
		}
	});
};

const checkUsernameIsTaken = (username = '') =>
	findUsers({
		where: { username },
		attributes: ['id', 'username']
	}).then((users) => {
		if (users.length > 0) {
			throw new Error(USENAME_IS_TAKEN);
		}
		return true;
	});

const usernameRegEx = /^[a-z0-9_]{3,15}$/;
const isValidUsername = (username) => {
	return usernameRegEx.test(username);
};

const SETTING_KEYS = [
	'language',
	'notification',
	'interface',
	'audio',
	'risk',
	'chat'
];

const DEFAULT_SETTINGS = {
	language: getConfiguration().constants.defaults.language,
	orderConfirmationPopup: true
};

const joinSettings = (userSettings = {}, newSettings = {}) => {
	const joinedSettings = {};
	SETTING_KEYS.forEach((key) => {
		if (newSettings.hasOwnProperty(key)) {
			joinedSettings[key] = newSettings[key];
		} else if (userSettings.hasOwnProperty(key)) {
			joinedSettings[key] = userSettings[key];
		} else {
			joinedSettings[key] = DEFAULT_SETTINGS[key];
		}
	});
	return joinedSettings;
};

const updateUserSettings = (settings) => (user, options = {}) => {
	if (Object.keys(settings).length > 0) {
		settings = joinSettings(user.dataValues.settings, settings);
	}
	return user.update({ settings }, {
		fields: [
			'settings'
		],
		...options
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
			theme: getConfiguration().constants.defaults.theme
		},
		language: getConfiguration().constants.defaults.language,
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

const registerLogin = (
	user_id,
	ip,
	device = '',
	domain = '',
	origin = '',
	referer = ''
) => {
	loggerLogin.info(
		'helpers/logins/registerLogin',
		Date.now(),
		user_id,
		ip,
		device,
		domain,
		origin,
		referer
	);
	Login.create({
		user_id,
		ip,
		device,
		domain,
		origin,
		referer
	}).catch((err) => {
		loggerLogin.error(err);
	});
};

const findUserLogins = (user_id, pagination = {}, timeframe, format) => {
	loggerLogin.verbose('helpers/logins/findUserLogins', user_id, pagination, timeframe);
	let options = {
		where: {},
		attributes: {
			exclude: ['id', 'origin', 'referer']
		},
		order: [['timestamp', 'desc']]
	};
	if (!format) {
		options = { ...options, ...pagination};
	}

	if (user_id) options.where.user_id = user_id;

	if (timeframe) options.where.timestamp = timeframe;

	loggerLogin.verbose('helpers/logins/findUserLogins options', options);
	return Login.findAndCountAll(options).then(convertSequelizeCountAndRows);
};

module.exports = {
	findUser,
	findUsers,
	getUserValuesByEmail,
	isValidUsername,
	updateUserSettings,
	checkUsernameIsTaken,
	findUserByEmail,
	INITIAL_SETTINGS,
	registerLogin,
	findUserLogins,
	findUsersByCryptoAddress
};
