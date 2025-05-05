'use strict';

const { getModel } = require('./database/model');
const dbQuery = require('./database/query');
const {
	has,
	omit,
	pick,
	each,
	differenceWith,
	isEqual,
	isString,
	isNumber,
	isBoolean,
	isPlainObject,
	isNil,
	isArray,
	isInteger,
	isEmpty,
	uniq,
	uniqWith
} = require('lodash');
const { isEmail } = require('validator');
const randomString = require('random-string');
const { SERVER_PATH } = require('../constants');
const {
	SIGNUP_NOT_AVAILABLE,
	PROVIDE_VALID_EMAIL,
	USER_EXISTS,
	INVALID_PASSWORD,
	INVALID_VERIFICATION_CODE,
	USER_NOT_FOUND,
	USER_NOT_VERIFIED,
	USER_NOT_ACTIVATED,
	INVALID_CREDENTIALS,
	INVALID_OTP_CODE,
	USERNAME_CANNOT_BE_CHANGED,
	USERNAME_IS_TAKEN,
	INVALID_USERNAME,
	ACCOUNT_NOT_VERIFIED,
	INVALID_VERIFICATION_LEVEL,
	USER_EMAIL_NOT_VERIFIED,
	VERIFICATION_CODE_EXPIRED,
	NO_DATA_FOR_CSV,
	PROVIDE_USER_CREDENTIALS,
	PROVIDE_KIT_ID,
	PROVIDE_NETWORK_ID,
	CANNOT_DEACTIVATE_ADMIN,
	USER_ALREADY_DEACTIVATED,
	USER_NOT_DEACTIVATED,
	CANNOT_CHANGE_ADMIN_ROLE,
	USER_VERIFIED,
	USER_NOT_REGISTERED_ON_NETWORK,
	SESSION_NOT_FOUND,
	SESSION_ALREADY_REVOKED,
	WRONG_USER_SESSION,
	USER_ALREADY_RECOVERED,
	CANNOT_CHANGE_ADMIN_EMAIL,
	EMAIL_IS_SAME,
	EMAIL_EXISTS,
	REFERRAL_HISTORY_NOT_ACTIVE,
	REFERRAL_UNSUPPORTED_EXCHANGE_PLAN,
	CANNOT_CHANGE_DELETED_EMAIL,
	SERVICE_NOT_SUPPORTED,
	BALANCE_HISTORY_NOT_ACTIVE,
	ADDRESSBOOK_MISSING_FIELDS,
	PAYMENT_DETAIL_NOT_FOUND,
	ADDRESSBOOK_ALREADY_EXISTS,
	UNAUTHORIZED_UPDATE_METHOD,
	ADDRESSBOOK_NOT_FOUND
} = require(`${SERVER_PATH}/messages`);
const { publisher, client } = require('./database/redis');
const {
	CONFIGURATION_CHANNEL,
	AUDIT_KEYS,
	USER_FIELD_ADMIN_LOG,
	ADDRESS_FIELDS,
	CRYPTO_ADDRESS_FIELDS,
	ID_FIELDS,
	SETTING_KEYS,
	OMITTED_USER_FIELDS,
	DEFAULT_ORDER_RISK_PERCENTAGE,
	AFFILIATION_CODE_LENGTH,
	REFERRAL_HISTORY_SUPPORTED_PLANS,
	LOGIN_TIME_OUT,
	TOKEN_TIME_LONG,
	TOKEN_TIME_NORMAL,
	VERIFY_STATUS,
	EVENTS_CHANNEL,
	BALANCE_HISTORY_SUPPORTED_PLANS,
	ROLE_PERMISSIONS,
	KIT_CONFIG_KEYS,
	KIT_SECRETS_KEYS,
} = require(`${SERVER_PATH}/constants`);
const { sendEmail } = require(`${SERVER_PATH}/mail`);
const { MAILTYPE } = require(`${SERVER_PATH}/mail/strings`);
const { getKitConfig, isValidTierLevel, getKitTier, isDatetime, getAssetsPrices, getRoles, getKitSecrets, sendCustomEmail, emailHtmlBoilerplate, getDomain, updateKitConfigSecrets, sleep, getKitCoins, getKitCoin, subscribedToCoin, getQuickTrades } = require('./common');
const { isValidPassword, createSession } = require('./security');
const { getNodeLib } = require(`${SERVER_PATH}/init`);
const { all, reject } = require('bluebird');
const { Op, fn, col, literal } = require('sequelize');
const { paginationQuery, timeframeQuery, orderingQuery, convertSequelizeCountAndRows } = require('./database/helpers');
const { parse } = require('json2csv');
const flatten = require('flat');
const uuid = require('uuid/v4');
const { checkCaptcha, validatePassword, verifyOtpBeforeAction } = require('./security');
const geoip = require('geoip-lite');
const moment = require('moment');
const mathjs = require('mathjs');
const { loggerUser } = require('../../../config/logger');
const BigNumber = require('bignumber.js');
const { INVALID_AUTOTRADE_CONFIG } = require('../../../messages');
const sequelize = require('sequelize');

let networkIdToKitId = {};
let kitIdToNetworkId = {};
/* Onboarding*/

const storeVerificationCode = (user, verification_code) => {
	const data = { code: verification_code, id: user.id, email: user.email };
	client.setexAsync(`verification_code:user${verification_code}`, 5 * 60, JSON.stringify(data));
};

const signUpUser = (email, password, opts = { referral: null }) => {
	if (!getKitConfig().new_user_is_activated) {
		return reject(new Error(SIGNUP_NOT_AVAILABLE));
	}

	if (!email || !isEmail(email)) {
		return reject(new Error(PROVIDE_VALID_EMAIL));
	}

	if (!isValidPassword(password)) {
		return reject(new Error(INVALID_PASSWORD));
	}

	email = email.toLowerCase();

	return dbQuery.findOne('user', {
		where: { email },
		attributes: ['email']
	})
		.then((user) => {
			if (user) {
				throw new Error(USER_EXISTS);
			}
			return getModel('sequelize').transaction((transaction) => {
				return getModel('user').create({
					email,
					password,
					verification_level: 1,
					email_verified: false,
					settings: INITIAL_SETTINGS()
				}, { transaction })
					.then((user) => {
						return all([
							createUserOnNetwork(email),
							user
						]);
					})
					.then(([networkUser, user]) => {
						return user.update(
							{ network_id: networkUser.id },
							{ fields: ['network_id'], returning: true, transaction }
						);
					});
			});
		})
		.then((user) => {
			const verification_code = uuid();
			storeVerificationCode(user, verification_code);
			return all([
				verification_code,
				user
			]);
		})
		.then(([verificationCode, user]) => {
			publisher.publish(EVENTS_CHANNEL, JSON.stringify({
				type: 'user',
				data: {
					action: 'signup',
					user_id: user.id
				}
			}));

			sendEmail(
				MAILTYPE.SIGNUP,
				email,
				verificationCode,
				{}
			);
			if (opts.referral && isString(opts.referral)) {
				checkAffiliation(opts.referral, user.id);
			}
			return user;
		});
};

const verifyUser = (email, code, domain) => {
	email = email?.toLowerCase();
	return client.getAsync(`verification_code:user${code}`)
		.then((verificationCode) => {
			if (!verificationCode) {
				throw new Error(VERIFICATION_CODE_EXPIRED);
			}
			verificationCode = JSON.parse(verificationCode);
			return all([
				verificationCode,
				dbQuery.findOne('user',
					{ where: { id: verificationCode.id }, attributes: ['id', 'email', 'settings', 'network_id', 'email_verified'] }),
			]);
		})
		.then(([verificationCode, user]) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			}

			if (user.email_verified) {
				throw new Error(USER_VERIFIED);
			}

			if (code !== verificationCode.code) {
				throw new Error(INVALID_VERIFICATION_CODE);
			}

			client.delAsync(`verification_code:user${verificationCode.code}`);
			return all([
				user,
				user.update(
					{ email_verified: true },
					{ fields: ['email_verified'] }
				)
			]);
		})
		.then(([user]) => {
			publisher.publish(EVENTS_CHANNEL, JSON.stringify({
				type: 'user',
				data: {
					action: 'verify',
					user_id: user.id
				}
			}));
			sendEmail(
				MAILTYPE.WELCOME,
				user.email,
				{},
				user.settings,
				domain
			);
			return user;
		});
};

const createUser = (
	email,
	password,
	opts = {
		role: 'user',
		id: null,
		email_verified: false,
		referral: null,
		additionalHeaders: null
	}
) => {
	email = email.toLowerCase();
	return getModel('sequelize').transaction((transaction) => {
		return dbQuery.findOne('user', {
			where: { email }
		})
			.then(async (user) => {
				if (user) {
					throw new Error(USER_EXISTS);
				}

				let role = null;
				if (opts.role === 'admin') {
					const Role = getModel('role');
					const adminRole = await Role.findOne({ where: { role_name: 'admin' } });
					if (!adminRole) throw new Error('Role not found');
					role = adminRole.role_name;
				}

				const options = {
					email,
					password,
					settings: INITIAL_SETTINGS(),
					email_verified: opts.email_verified,
					role
				};

				if (isNumber(opts.id)) {
					options.id = opts.id;
				}

				return getModel('user').create(options, { transaction });
			})
			.then((user) => {
				return all([
					user,
					getNodeLib().createUser(email, { additionalHeaders: opts.additionalHeaders })
				]);
			})
			.then(([kitUser, networkUser]) => {
				return kitUser.update({
					network_id: networkUser.id
				}, { returning: true, fields: ['network_id'], transaction });
			});
	})
		.then((user) => {
			if (opts.referral && isString(opts.referral)) {
				checkAffiliation(opts.referral, user.id);
			}

			return all([
				user
			]);
		})
		.then(([user]) => {
			sendEmail(
				MAILTYPE.WELCOME,
				user.email,
				{},
				user.settings
			);
			return;
		});
};

const createUserOnNetwork = (email, opts = {
	additionalHeaders: null
}) => {
	if (!isEmail(email)) {
		return reject(new Error(PROVIDE_VALID_EMAIL));
	}

	return getNodeLib().createUser(email, opts);
};

const loginUser = (email, password, otp_code, captcha, ip, device, domain, origin, referer) => {
	return getUserByEmail(email.toLowerCase())
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			}
			if (user.verification_level === 0) {
				throw new Error(USER_NOT_VERIFIED);
			} else if (getKitConfig().email_verification_required && !user.email_verified) {
				throw new Error(USER_EMAIL_NOT_VERIFIED);
			} else if (!user.activated) {
				throw new Error(USER_NOT_ACTIVATED);
			}
			return all([
				user,
				validatePassword(user.password, password)
			]);
		})
		.then(([user, passwordIsValid]) => {
			if (!passwordIsValid) {
				throw new Error(INVALID_CREDENTIALS);
			}

			if (!user.otp_enabled) {
				return all([user, checkCaptcha(captcha, ip)]);
			} else {
				return all([
					user,
					verifyOtpBeforeAction(user.id, otp_code).then((validOtp) => {
						if (!validOtp) {
							throw new Error(INVALID_OTP_CODE);
						} else {
							return checkCaptcha(captcha, ip);
						}
					})
				]);
			}
		})
		.then(([user]) => {
			if (ip) {
				registerUserLogin(user.id, ip, device, domain, origin, referer);
			}
			return user;
		});
};

const registerUserLogin = (
	userId,
	ip,
	opts = {
		device: null,
		domain: null,
		origin: null,
		referer: null,
		token: null,
		expiry: null,
		status: true,
		country: null
	}
) => {
	const login = {
		user_id: userId,
		ip
	};

	if (isString(opts.device)) {
		login.device = opts.device;
	}

	if (isString(opts.domain)) {
		login.domain = opts.domain;
	}

	if (isString(opts.origin)) {
		login.origin = opts.origin;
	}

	if (isString(opts.referer)) {
		login.referer = opts.referer;
	}

	if (isBoolean(opts.status)) {
		login.status = opts.status;
	}

	if (opts.status === false) {
		login.attempt = 1;
	}
	if (isString(opts.country)) {
		login.country = opts.country;
	}

	const geo = geoip.lookup(ip);
	if (geo?.country && !opts?.country) login.country = geo.country;
	return getModel('login').create(login)
		.then((loginData) => {
			if (opts.token && opts.status) {
				return createSession(opts.token, loginData.id, userId, opts.expiry);
			}
			return loginData;
		})
		.catch(err => reject(err));
};

const updateLoginAttempt = (loginId) => {
	return getModel('login').increment('attempt', { by: 1, where: { id: loginId } });
};

const updateLoginStatus = (loginId) => {
	return getModel('login').update({ status: true }, { where: { id: loginId } });
};

const createUserLogin = async (user, ip, device, domain, origin, referer, token, long_term, status) => {
	const loginData = status == false && await findUserLatestLogin(user, status);

	if (!loginData) {
		return registerUserLogin(user.id, ip, {
			device,
			domain,
			origin,
			referer,
			token,
			status,
			expiry: long_term ? TOKEN_TIME_LONG : TOKEN_TIME_NORMAL
		});
	}
	else if (loginData.status == false) {
		await updateLoginAttempt(loginData.id);
		return loginData;
	}

	return null;
};

const createSuspiciousLogin = async (user, ip, device, country, domain, origin, referer, token, long_term) => {
	const loginData = await getModel('login').findOne({
		order: [['id', 'DESC'], ['status', 'ASC']],
		where: {
			user_id: user.id,
			status: false,
			device,
			country,
			created_at: {
				[Op.gte]: moment().subtract(5, 'minutes').toDate()
			}
		}
	});

	if (!loginData) {
		loggerUser.verbose(
			'tools/user/loginPost creating suspicious login record',
			'user id',
			user.id,
			'country',
			country,
			'device',
			device,

		);
		return registerUserLogin(user.id, ip, {
			device,
			domain,
			origin,
			referer,
			token,
			status: false,
			expiry: long_term ? TOKEN_TIME_LONG : TOKEN_TIME_NORMAL,
			country
		});
	}
	loggerUser.verbose(
		'tools/user/loginPost existing suspicious login record found, updating attempt counter',
		'user id',
		user.id,
		'country',
		country,
		'device',
		device,

	);
	await updateLoginAttempt(loginData.id);
	return loginData;
};


const findUserLatestLogin = (user, status) => {
	return getModel('login').findOne({
		order: [['id', 'DESC'], ['status', 'ASC']],
		where: {
			user_id: user.id,
			...(status != null && { status }),
		}
	}).then(loginData => {
		if (loginData && new Date().getTime() - new Date(loginData.updated_at).getTime() < LOGIN_TIME_OUT) return loginData;
		return null;
	});
};
const findUserLastLogins = (user, status) => {
	return getModel('login').findAll({
		order: [['id', 'DESC'], ['status', 'ASC']],
		limit: 10,
		where: {
			user_id: user.id,
			...(status != null && { status }),
		}
	});
};

/* Public Endpoints*/

const confirmUserLogin = async (token) => {
	let data = await client.getAsync(`user:confirm-login:${token}`);
	data = data && JSON.parse(data);

	if (!data || !data.id) {
		throw new Error('Token is expired');
	}

	const loginData = await getModel('login').findOne({
		order: [['id', 'DESC']],
		where: {
			id: data.id,
			user_id: data.user_id,
			status: false,
		}
	});

	if (loginData && new Date().getTime() - new Date(loginData.updated_at).getTime() < LOGIN_TIME_OUT) {
		return loginData.update({
			status: true
		});
	}

	throw new Error('Login record not found');
};

const freezeUserByCode = async (token) => {
	let data = await client.getAsync(`user:freeze-account:${token}`);
	data = data && JSON.parse(data);

	if (!data || !data.id) {
		throw new Error('Token is expired');
	}

	return freezeUserById(data.user_id);
};

const generateAffiliationCode = () => {
	return randomString({
		length: AFFILIATION_CODE_LENGTH,
		numeric: true,
		letters: true
	}).toUpperCase();
};

const getUserByAffiliationCode = (affiliationCode) => {
	const code = affiliationCode.trim();
	return dbQuery.findOne('referralCode', {
		where: { code },
		attributes: ['id', 'user_id', 'discount', 'earning_rate']
	});
};

const checkAffiliation = (affiliationCode, user_id) => {
	return getUserByAffiliationCode(affiliationCode)
		.then((referrer) => {
			if (referrer) {
				return all([getModel('affiliation').create({
					user_id,
					referer_id: referrer.user_id,
					earning_rate: referrer.earning_rate,
					code: affiliationCode,
				}),
				referrer,
				getModel('referralCode').increment('referral_count', { by: 1, where: { id: referrer.id } })
				]);
			} else {
				return [];
			}
		})
		.then(([affiliation, referrer]) => {
			if (affiliation?.user_id) {
				return getModel('user').update(
					{
						discount: referrer.discount
					},
					{
						where: {
							id: affiliation.user_id
						},
						fields: ['discount']
					}
				);
			}
			return;
		});
};

const getAffiliationCount = (userId, opts = {
	limit: null,
	page: null,
	order_by: null,
	order: null,
	start_date: null,
	end_date: null
}) => {

	if (!isInteger(userId)) {
		throw new Error('Invalid user id');
	}

	const pagination = paginationQuery(opts.limit, opts.page);
	const timeframe = timeframeQuery(opts.start_date, opts.end_date);
	const ordering = orderingQuery(opts.order_by, opts.order);

	return dbQuery.findAndCountAllWithRows('affiliation', {
		where: {
			referer_id: userId,
			created_at: timeframe
		},
		include: [
			{
				model: getModel('user'),
				as: 'user',
				attributes: ['id', 'email']
			}
		],
		attributes: {
			exclude: ['id', 'referer_id', 'user_id']
		},
		order: [ordering],
		...pagination
	});
};

const getUserReferer = (userId) => {
	if (!isInteger(userId)) {
		throw new Error('Invalid user id');
	}

	return dbQuery.findOne('affiliation', {
		where: {
			user_id: userId
		},
		include: [
			{
				model: getModel('user'),
				as: 'referer',
				attributes: ['id', 'email']
			}
		],
		attributes: {
			exclude: ['id', 'referer_id', 'user_id']
		}
	})
		.then((data) => {
			let email = '';
			if (!data) {
				email = 'No Referer';
			} else {
				email = data.referer.email;
			}
			return !data ? email : data;
		});

};

const isValidUsername = (username) => {
	return /^[a-z0-9_]{3,15}$/.test(username);
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
	return dbQuery.findAll('user', {
		attributes: {
			exclude: OMITTED_USER_FIELDS
		}
	});
};

const getAllUsersAdmin = (opts = {
	id: null,
	user_id: null,
	search: null,
	pending: null,
	pending_type: null,
	limit: null,
	page: null,
	order_by: null,
	order: null,
	start_date: null,
	end_date: null,
	format: null,
	type: null,
	email: null,
	username: null,
	full_name: null,
	dob_start_date: null,
	dob_end_date: null,
	gender: null,
	nationality: null,
	verification_level: null,
	email_verified: null,
	otp_enabled: null,
	phone_number: null,
	kyc: null,
	bank: null,
	id_number: null,
	additionalHeaders: null
}) => {
	const {
		id,
		user_id,
		gender,
		email_verified,
		otp_enabled,
		dob_start_date,
		dob_end_date,
		id_number
	} = opts;

	const pagination = paginationQuery(opts.limit, opts.page);
	const timeframe = timeframeQuery(opts.start_date, opts.end_date);
	const dob_timeframe = timeframeQuery(dob_start_date, dob_end_date);

	let orderBy = 'id';
	let order = 'desc';
	if (opts.order_by) {
		orderBy = opts.order_by;
	}
	if (opts.order) {
		order = opts.order;
	}
	const ordering = orderingQuery(orderBy, order);
	let query = {
		where: {
			created_at: timeframe,
			...(id != null && { id }),
			...(user_id != null && { id: user_id }),
			...((dob_start_date != null || dob_end_date != null) && { dob: dob_timeframe }),
			...(email_verified != null && { email_verified }),
			...(gender != null && { gender }),
			...(otp_enabled != null && { otp_enabled }),
			[Op.and]: [],
		},
		order: [ordering]
	};
	query.attributes = {
		exclude: ['balance', 'password']
	};

	if (opts.search) {
		query.attributes = {
			exclude: ['balance', 'password']
		};
		if (opts.id) {
			query.where.id = opts.id;
		}
		query.where = {
			[Op.or]: [
				{
					email: {
						[Op.like]: `%${opts.search}%`
					}
				},
				{
					username: {
						[Op.like]: `%${opts.search}%`
					}
				},
				{
					full_name: {
						[Op.like]: `%${opts.search}%`
					}
				},
				{
					phone_number: {
						[Op.like]: `%${opts.search}%`
					}
				},
				getModel('sequelize').literal(`id_data ->> 'number'='${opts.search}'`)
			]
		};
	}
	Object.keys(pick(opts, ['email', 'nationality', 'username', 'full_name', 'phone_number'])).forEach(key => {
		if (opts[key] != null) {
			query.where[Op.and].push(
				{
					[key]: {
						[Op.iLike]: `%${opts[key].toLowerCase()}%`
					}
				}
			);
		}
	});

	if (isNumber(opts.verification_level)) {
		query.where[Op.and].push({ verification_level: opts.verification_level });
	}

	if (isBoolean(opts.pending) && opts.pending) {
		query.order = [['updated_at', 'desc']];

		if ((opts.kyc && Object.values(VERIFY_STATUS).includes(opts.kyc)) || opts.pending_type === 'id') {
			query.where[Op.and] = [
				...query.where[Op.and],
				{ activated: true },
				{
					id_data: {
						status: opts.kyc != null ? opts.kyc : 1 // users that have a pending id waiting for admin to confirm
					}
				},
			];
		}

		if (opts.bank || opts.pending_type === 'bank') {
			query.where[Op.and] = [
				...query.where[Op.and],
				{ activated: true },
				getModel('sequelize').literal('bank_account @> \'[{"status":1}]\'') // users that have a pending bank waiting for admin to confirm
			];
		}
	}

	if (id_number) {
		query.where[Op.and].push(
			{
				id_data: {
					number: id_number
				}
			}
		);
	}

	if (!opts.format) {
		query = { ...query, ...pagination };
	} else if (isBoolean(opts.pending) && !opts.pending) {
		query.attributes.exclude.push('settings');
	}

	if (opts.format) {
		query.attributes = ['id', 'email', 'password', 'full_name', 'gender', 'nationality', 'dob', 'phone_number', 'crypto_wallet', 'verification_level', 'note', 'created_at', 'updated_at', 'is_admin', 'is_supervisor', 'is_support', 'is_kyc', 'is_communicator', 'otp_enabled', 'address', 'bank_account', 'id_data', 'activated', 'settings', 'username', 'flagged', 'affiliation_code', 'affiliation_rate', 'network_id', 'email_verified', 'discount', 'meta', 'role'];
		return dbQuery.fetchAllRecords('user', query)
			.then(async ({ count, data }) => {
				if (opts.id || opts.search) {
					if (count > 0 && data[0].verification_level > 0 && data[0].network_id) {
						const userNetworkData = await getNodeLib().getUser(data[0].network_id, { additionalHeaders: opts.additionalHeaders });
						data[0].balance = userNetworkData.balance;
						data[0].wallet = userNetworkData.wallet;
						return { count, data };
					}
				}
				return { count, data };
			})
			.then(async (users) => {
				if (opts.format && opts.format === 'csv') {
					if (users.data.length === 0) {
						throw new Error(NO_DATA_FOR_CSV);
					}
					const flatData = users.data.map((user) => {
						let id_data;
						if (user.id_data) {
							id_data = user.id_data;
							user.id_data = {};
						}
						const result = flatten(user, { safe: true });
						if (id_data) result.id_data = id_data;
						return result;
					});
					const csv = parse(flatData, Object.keys(flatData[0]));
					return csv;
				} else {
					return users;
				}
			});
	} else {
		return dbQuery.findAndCountAllWithRows('user', query)
			.then(async ({ count, data }) => {
				if (opts.id || opts.search) {
					if (count > 0 && data[0].verification_level > 0 && data[0].network_id) {
						const userNetworkData = await getNodeLib().getUser(data[0].network_id, { additionalHeaders: opts.additionalHeaders });
						data[0].balance = userNetworkData.balance;
						data[0].wallet = userNetworkData.wallet;
						return { count, data };
					}
				}
				return { count, data };
			});
	}
};

const getUser = (identifier = {}, rawData = true, networkData = false, opts = {
	additionalHeaders: null
}) => {
	if (!identifier.email && !identifier.kit_id && !identifier.network_id) {
		return reject(new Error(PROVIDE_USER_CREDENTIALS));
	}

	const where = {};
	if (identifier.email) {
		where.email = identifier.email;
	} else if (identifier.kit_id) {
		where.id = identifier.kit_id;
	} else {
		where.network_id = identifier.network_id;
	}

	return dbQuery.findOne('user', {
		where,
		raw: rawData
	})
		.then(async (user) => {
			if (user && networkData) {
				const networkData = await getNodeLib().getUser(user.network_id, opts);
				user.balance = networkData.balance;
				user.wallet = networkData.wallet;
				if (!rawData) {
					user.dataValues.balance = networkData.balance;
					user.dataValues.wallet = networkData.wallet;
				}
			}
			return user;
		});
};

const getUserNetwork = (networkId, opts = {
	additionalHeaders: null
}) => {
	return getNodeLib().getUser(networkId, opts);
};

const getUsersNetwork = (opts = {
	additionalHeaders: null
}) => {
	return getNodeLib().getUsers(opts);
};

const getUserByEmail = (email, rawData = true, networkData = false, opts = {
	additionalHeaders: null
}) => {
	if (!email || !isEmail(email)) {
		return reject(new Error(PROVIDE_VALID_EMAIL));
	}
	return getUser({ email }, rawData, networkData, opts);
};

const getUserByKitId = (kit_id, rawData = true, networkData = false, opts = {
	additionalHeaders: null
}) => {
	if (!kit_id) {
		return reject(new Error(PROVIDE_KIT_ID));
	}
	return getUser({ kit_id }, rawData, networkData, opts);
};

const getUserTier = (user_id) => {
	return getUser({ user_id }, true)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			}
			if (user.verification_level < 1) {
				throw new Error('User is not verified');
			}
			return dbQuery.findOne('tier', {
				where: {
					id: user.verification_level
				},
				raw: true
			});
		});
};

const getUserByNetworkId = (network_id, rawData = true, networkData = false, opts = {
	additionalHeaders: null
}) => {
	if (!network_id) {
		return reject(new Error(PROVIDE_NETWORK_ID));
	}
	return getUser({ network_id }, rawData, networkData, opts);
};

const freezeUserById = (userId) => {

	return getUserByKitId(userId, false)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			}
			if (!user.activated) {
				throw new Error(USER_ALREADY_DEACTIVATED);
			}
			if (user.is_admin || user.role === 'admin') {
				throw new Error(CANNOT_DEACTIVATE_ADMIN);
			}
			return user.update({ activated: false }, { fields: ['activated'], returning: true });
		})
		.then(async (user) => {
			await revokeAllUserSessions(userId);

			publisher.publish(CONFIGURATION_CHANNEL, JSON.stringify({ type: 'freezeUser', data: user.id }));
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

const freezeUserByEmail = (email) => {
	return getUserByEmail(email, false)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			}
			if (user.is_admin || user.role === 'admin') {
				throw new Error(CANNOT_DEACTIVATE_ADMIN);
			}
			if (!user.activated) {
				throw new Error(USER_ALREADY_DEACTIVATED);
			}
			return user.update({ activated: false }, { fields: ['activated'], returning: true });
		})
		.then((user) => {
			publisher.publish(CONFIGURATION_CHANNEL, JSON.stringify({ type: 'freezeUser', data: user.id }));
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

const unfreezeUserById = (userId) => {
	return getUserByKitId(userId, false)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			}
			if (user.activated) {
				throw new Error(USER_NOT_DEACTIVATED);
			}
			return user.update({ activated: true }, { fields: ['activated'], returning: true });
		})
		.then((user) => {
			publisher.publish(CONFIGURATION_CHANNEL, JSON.stringify({ type: 'unfreezeUser', data: user.id }));
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

const unfreezeUserByEmail = (email) => {
	return getUserByEmail(email, false)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			}
			if (user.activated) {
				throw new Error(USER_NOT_DEACTIVATED);
			}
			return user.update({ activated: true }, { fields: ['activated'], returning: true });
		})
		.then((user) => {
			publisher.publish(CONFIGURATION_CHANNEL, JSON.stringify({ type: 'unfreezeUser', data: user.id }));
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
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			}
			if (user.is_admin) {
				return 'admin';
			} else if (user.is_supervisor) {
				return 'supervisor';
			} else if (user.is_support) {
				return 'support';
			} else if (user.is_kyc) {
				return 'kyc';
			} else if (user.is_communicator) {
				return 'communicator';
			} else {
				return 'user';
			}
		});
};

const updateUserRole = async (user_id, role_name, admin_id, otp_code) => {
	const Role = getModel('role');
	const User = getModel('user');

	if (role_name === 'admin') {
		throw new Error('Cannot assign admin role');
	}

	const admin = await User.findOne({ where: { id: admin_id } });
	if (!admin) throw new Error('User not found');

	if (!admin.otp_enabled) { 
		throw new Error('OTP is not enabled');
	} else {
		if (!otp_code) {
			throw new Error(INVALID_OTP_CODE);
		}
		try {
			const validOtp = await verifyOtpBeforeAction(admin_id, otp_code);
			if (!validOtp) {
				throw new Error(INVALID_OTP_CODE);
			}
		} catch (error) {
			throw new Error(INVALID_OTP_CODE);
		}
	}

	const user = await User.findOne({ where: { id: user_id } });
	if (!user) throw new Error('User not found');

	if (user.role == 'admin') {
		throw new Error(CANNOT_CHANGE_ADMIN_ROLE);
	}

	if(role_name === 'user') {
		user.role = null;
		await user.save();
		await revokeAllUserSessions(user_id);
		return user;
	} else {
		const role = await Role.findOne({ where: { role_name } });
		if (!role) throw new Error('Role not found');

		user.role = role.role_name;
		await user.save();
		await revokeAllUserSessions(user_id);
		return { message: 'Success' };
	}

};

const DEFAULT_SETTINGS = {
	language: getKitConfig().defaults.language,
	orderConfirmationPopup: true
};

const joinSettings = (userSettings = {}, newSettings = {}) => {
	const joinedSettings = {};
	SETTING_KEYS.forEach((key) => {
		if (has(newSettings, key)) {
			if (
				key === 'chat' &&
				(!isPlainObject(newSettings[key]) || !isBoolean(newSettings[key].set_username))
			) {
				throw new Error('set-username must be a boolean value');
			} else if (
				key === 'language' &&
				(!isString(newSettings[key]) || getKitConfig().valid_languages.indexOf(newSettings[key]) === -1)
			) {
				throw new Error('Invalid language given');
			}
			joinedSettings[key] = newSettings[key];
		} else if (has(userSettings, key)) {
			joinedSettings[key] = userSettings[key];
		} else {
			joinedSettings[key] = DEFAULT_SETTINGS[key];
		}
	});
	return joinedSettings;
};

const updateUserSettings = (userOpts = {}, settings = {}) => {
	return getUser(userOpts, false)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			}
			if (Object.keys(settings).length > 0) {
				settings = joinSettings(user.dataValues.settings, settings);
			}
			return user.update({ settings }, {
				fields: ['settings'],
				returning: true
			});
		})
		.then((user) => {
			return omitUserFields(user.dataValues);
		});
};

const INITIAL_SETTINGS = () => {
	return {
		notification: {
			popup_order_confirmation: true,
			popup_order_completed: true,
			popup_order_partially_filled: true,
			popup_order_new: true,
			popup_order_canceled: true
		},
		interface: {
			order_book_levels: 10,
			theme: getKitConfig().defaults.theme
		},
		language: getKitConfig().defaults.language,
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

const verifyUserEmailByKitId = (kitId) => {
	return getUserByKitId(kitId, false)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			}
			if (user.email_verified) {
				throw new Error('User email already verified');
			}
			return user.update(
				{ email_verified: true },
				{ fields: ['email_verified'], returning: true }
			);
		});
};

const updateUserNote = (userId, note, auditInfo) => {
	return getUserByKitId(userId, false)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			}
			createAuditLog({ email: auditInfo.userEmail, session_id: auditInfo.sessionId }, auditInfo.apiPath, auditInfo.method, { note, user_id: user.id }, { note: user.note, user_id: user.id });
			return user.update({ note }, { fields: ['note'] });
		});
};

const updateUserDiscount = (userId, discount, auditInfo) => {
	if (discount < 0 || discount > 100) {
		return reject(new Error(`Invalid discount rate ${discount}. Min: 0. Max: 1`));
	}

	return getUserByKitId(userId, false)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			} else if (user.discount === discount) {
				throw new Error(`User discount is already ${discount}`);
			}
			return all([
				user.discount,
				user.update({ discount }, { fields: ['discount'] })
			]);
		})
		.then(([previousDiscountRate, user]) => {
			if (user.discount > previousDiscountRate) {
				createAuditLog({ email: auditInfo.userEmail, session_id: auditInfo.sessionId }, auditInfo.apiPath, auditInfo.method, user.discount, previousDiscountRate);
				sendEmail(
					MAILTYPE.DISCOUNT_UPDATE,
					user.email,
					{
						rate: user.discount
					},
					user.settings
				);
			}
			return pick(user.dataValues, ['id', 'discount']);
		});
};

const changeUserVerificationLevelById = (userId, newLevel, domain) => {
	if (!isValidTierLevel(newLevel)) {
		return reject(new Error(INVALID_VERIFICATION_LEVEL(newLevel)));
	}

	let currentVerificationLevel = 0;
	return getUserByKitId(userId, false)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			}
			if (user.verification_level === 0) {
				throw new Error(ACCOUNT_NOT_VERIFIED);
			}
			currentVerificationLevel = user.verification_level;
			return user.update(
				{ verification_level: newLevel },
				{ fields: ['verification_level'], returning: true }
			);
		})
		.then((user) => {
			if (currentVerificationLevel < user.verification_level) {
				sendEmail(
					MAILTYPE.ACCOUNT_UPGRADE,
					user.email,
					getKitTier(user.verification_level).name,
					user.settings,
					domain
				);
			}
			return;
		});
};

const deactivateUserOtpById = (userId) => {
	return getUserByKitId(userId, false)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			}
			return user.update(
				{ otp_enabled: false },
				{ fields: ['otp_enabled'] }
			);
		});
};

const toggleFlaggedUserById = (userId) => {
	return getUserByKitId(userId, false)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			}
			return user.update(
				{ flagged: !user.flagged },
				{ fields: ['flagged'] }
			);
		});
};

const getUserLogins = (opts = {
	userId: null,
	status: null,
	country: null,
	ip: null,
	limit: null,
	page: null,
	orderBy: null,
	order: null,
	startDate: null,
	endDate: null,
	format: null
}) => {
	const pagination = paginationQuery(opts.limit, opts.page);
	const timeframe = timeframeQuery(opts.startDate, opts.endDate);
	const ordering = orderingQuery(opts.orderBy, opts.order);
	let options = {
		where: {
			timestamp: timeframe,
			...(opts.status != null && { status: opts.status }),
			...(opts.country != null && { country: opts.country }),
			...(opts.ip != null && { ip: { [Op.like]: `%${opts.ip}%` } })
		},
		attributes: {
			exclude: ['origin', 'referer']
		},
		order: [ordering]
	};
	if (!opts.format) {
		options = { ...options, ...pagination };
	}

	if (opts.userId) options.where.user_id = opts.userId;

	if (opts.format) {
		options.attributes = ['id', 'user_id', 'ip', 'device', 'domain', 'timestamp', 'attempt', 'status', 'country', 'updated_at', 'created_at'];
		return dbQuery.fetchAllRecords('login', options)
			.then((logins) => {
				if (opts.format && opts.format === 'csv') {
					if (logins.data.length === 0) {
						throw new Error(NO_DATA_FOR_CSV);
					}
					const csv = parse(logins.data, Object.keys(logins.data[0]));
					return csv;
				} else {
					return logins;
				}
			});
	}
	else {
		return dbQuery.findAndCountAllWithRows('login', options);
	}
};

const bankComparison = (bank1, bank2, description) => {
	let difference = [];
	let note = '';
	if (bank1.length === bank2.length) {
		note = 'bank info updated';
		difference = differenceWith(bank1, bank2, isEqual);
	} else if (bank1.length > bank2.length) {
		note = 'bank removed';
		difference = differenceWith(bank1, bank2, isEqual);
	} else if (bank1.length < bank2.length) {
		note = 'bank added';
		difference = differenceWith(bank2, bank1, isEqual);
	}

	// bank data is changed
	if (difference.length > 0) {
		description.note = note;
		description.new.bank_account = bank2;
		description.old.bank_account = bank1;
	}
	return description;
};

const createAuditDescription = (userId, prevData = {}, newData = {}) => {
	let description = {
		userId,
		note: `Change in user ${userId} information`,
		old: {},
		new: {}
	};
	for (const key in newData) {
		if (USER_FIELD_ADMIN_LOG.includes(key)) {
			let prevRecord = prevData[key] || 'empty';
			let newRecord = newData[key] || 'empty';
			if (key === 'bank_account') {
				description = bankComparison(
					prevData.bank_account,
					newData.bank_account,
					description
				);
			} else if (key === 'id_data') {
				ID_FIELDS.forEach((field) => {
					if (newRecord[field] != prevRecord[field]) {
						description.old[field] = prevRecord[field];
						description.new[field] = newRecord[field];
					}
				});
			} else if (key === 'address') {
				ADDRESS_FIELDS.forEach((field) => {
					if (prevRecord[field] != newRecord[field]) {
						description.old[field] = prevRecord[field];
						description.new[field] = newRecord[field];
					}
				});
			} else {
				if (prevRecord.toString() != newRecord.toString()) {
					description.old[key] = prevRecord;
					description.new[key] = newRecord;
				}
			}
		}
	}
	return description;
};

const createAudit = (adminId, event, ip, opts = {
	userId: null,
	prevUserData: null,
	newUserData: null,
	domain: null
}) => {
	const options = {
		admin_id: adminId,
		event,
		description: createAuditDescription(opts.userId, opts.prevUserData, opts.newUserData),
		ip
	};
	if (opts.domain) {
		options.domain = opts.domain;
	}
	return getModel('audit').create({
		admin_id: adminId,
		event,
		description: createAuditDescription(opts.userId, opts.prevUserData, opts.newUserData),
		ip
	});
};

const getUpdatedKeys = (oldData, newData) => {
	const data = uniq([...Object.keys(oldData), ...Object.keys(newData)]);

	let keys = [];
	for (const key of data) {
		if (!isEqual(oldData[key], newData[key])) {
			keys.push(key);
		}
	}

	return keys;
};

const getValues = (data, prevData) => {
	const updatedKeys = getUpdatedKeys(prevData, data);
	const updatedValues = updatedKeys.map(key => data[key]);
	const oldValues = updatedKeys.map(key => prevData[key]);

	updatedValues.forEach((value, index) => {
		if (typeof value === 'object' && value.constructor === Object) {
			const values = getValues(value, oldValues[index]);
			updatedKeys[index] = values.updatedKeys;
			updatedValues[index] = values.updatedValues;
			oldValues[index] = values.oldValues;
		}
	});

	return { updatedKeys, oldValues, updatedValues };
};

const createAuditLog = (subject, adminEndpoint, method, data = {}, prevData = null) => {
	try {
		if (!subject?.email) return;

		const methodDescriptions = {
			get: 'viewed',
			post: 'inserted',
			put: 'updated',
			delete: 'deleted'
		};
		const excludedKeys = ['password', 'apiKey', 'secret', 'api-key', 'api-secret', 'hmac'];

		const action = adminEndpoint.split('/').slice(1).join(' ');
		let description;

		let user_id;
		if (method === 'get') {
			user_id = data?.user_id?.value;
			data = Object.fromEntries(Object.entries(data).filter(([k, v]) => (v.value != null && excludedKeys.indexOf(k) === -1)));
			const str = Object.keys(data).map((key) => '' + key + ':' + data[key].value).join(', ');
			description = `${action} service ${methodDescriptions[method]}${str ? ` with ${str}` : ''}`;
		}
		else if (method === 'put' && prevData) {
			user_id = data?.user_id;
			prevData = Object.fromEntries(Object.entries(prevData).filter(([k, v]) => (v != null && excludedKeys.indexOf(k) === -1)));
			data = Object.fromEntries(Object.entries(data).filter(([k, v]) => (v != null && excludedKeys.indexOf(k) === -1)));
			const { updatedKeys, oldValues, updatedValues } = getValues(data, prevData);
			description = `${updatedKeys.join(', ')} field(s) updated to the value(s) ${updatedValues?.join(', ')?.length > 0 ? updatedValues.join(', ') : 'Null'} from ${oldValues?.join(', ')?.length > 0 ? oldValues.join(', ') : 'Null'} in ${action} service`;
		}
		else {
			user_id = data?.user_id;
			data = Object.fromEntries(Object.entries(data).filter(([k, v]) => (v != null && excludedKeys.indexOf(k) === -1)));
			description = `${Object.keys(data).join(', ')} field(s) ${methodDescriptions[method]} by the value(s) ${Object.values(data).join(', ')} in ${action} service`;
		}

		return getModel('audit').create({
			subject: subject.email,
			session_id: subject?.session_id,
			description,
			user_id,
			timestamp: new Date(),
		}).then(res => res).catch(err => err);
	} catch (error) {
		return error;
	}

};

const getUserAudits = (opts = {
	user_id: null,
	subject: null,
	limit: null,
	page: null,
	orderBy: null,
	order: null,
	startDate: null,
	endDate: null,
	format: null
}) => {
	const exchangeInfo = getKitConfig().info;

	if (!BALANCE_HISTORY_SUPPORTED_PLANS.includes(exchangeInfo.plan)) {
		throw new Error(SERVICE_NOT_SUPPORTED);
	}

	const pagination = paginationQuery(opts.limit, opts.page);
	const timeframe = timeframeQuery(opts.startDate, opts.endDate);
	const ordering = orderingQuery(opts.orderBy, opts.order);
	let options = {
		where: {
			timestamp: timeframe,
			...(opts.user_id && { user_id: opts.user_id }),
			...(opts.subject && {
				subject: {
					[Op.like]: `%${opts.subject}%`
				}
			}),
		},
		order: [ordering]
	};

	if (!opts.format) {
		options = { ...options, ...pagination };
	}

	if (opts.format) {
		return dbQuery.fetchAllRecords('audit', options)
			.then((audits) => {
				if (opts.format && opts.format === 'csv') {
					if (audits.data.length === 0) {
						throw new Error(NO_DATA_FOR_CSV);
					}
					const flatData = audits.data.map((audit) => flatten(audit, { maxDepth: 2 }));
					const csv = parse(flatData, AUDIT_KEYS);
					return csv;
				} else {
					return audits;
				}
			});
	}
	else {
		return dbQuery.findAndCountAllWithRows('audit', options);
	}
};

const checkUsernameIsTaken = (username) => {
	return getModel('user').count({ where: { username } })
		.then((count) => {
			if (count > 0) {
				throw new Error(USERNAME_IS_TAKEN);
			} else {
				return true;
			}
		});
};

const setUsernameById = (userId, username) => {
	if (!isValidUsername(username)) {
		return reject(new Error(INVALID_USERNAME));
	}
	return getUserByKitId(userId, false)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			}
			if (user.settings.chat.set_username) {
				throw new Error(USERNAME_CANNOT_BE_CHANGED);
			}
			return all([user, checkUsernameIsTaken(username)]);
		})
		.then(([user]) => {
			return user.update(
				{
					username,
					settings: {
						...user.settings,
						chat: {
							set_username: true
						}
					}
				},
				{ fields: ['username', 'settings'] }
			);
		});
};

const disableUserWithdrawal = async (user_id, opts = { expiry_date: null }) => {
	const user = await getUserByKitId(user_id, false);
	let { expiry_date } = opts;

	if (!user) {
		throw new Error(USER_NOT_FOUND);
	}

	let withdrawal_blocked = null;

	if (expiry_date) {
		withdrawal_blocked = moment(expiry_date).toISOString();
	}

	return user.update(
		{ withdrawal_blocked },
		{ fields: ['withdrawal_blocked'], returning: true }
	);
};


const createUserCryptoAddressByNetworkId = (networkId, crypto, opts = {
	network: null,
	additionalHeaders: null
}) => {
	if (!networkId) {
		return reject(new Error(USER_NOT_REGISTERED_ON_NETWORK));
	}
	return getNodeLib().createUserCryptoAddress(networkId, crypto, opts);
};

const createUserCryptoAddressByKitId = async (kitId, crypto, opts = {
	network: null,
	additionalHeaders: null
}) => {
	// check mapKitIdToNetworkId
	const idDictionary = await mapKitIdToNetworkId([kitId]);

	if (!has(idDictionary, kitId)) {
		throw new Error(USER_NOT_FOUND);
	} else if (!idDictionary[kitId]) {
		throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
	}
	return getNodeLib().createUserCryptoAddress(idDictionary[kitId], crypto, opts);
};

const getUserStatsByKitId = async (userId, opts = {
	additionalHeaders: null
}) => {
	// check mapKitIdToNetworkId
	const idDictionary = await mapKitIdToNetworkId([userId]);

	if (!has(idDictionary, userId)) {
		throw new Error(USER_NOT_FOUND);
	} else if (!idDictionary[userId]) {
		throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
	}

	return getNodeLib().getUserStats(idDictionary[userId], opts);
};

const getUserStatsByNetworkId = (networkId, opts = {
	additionalHeaders: null
}) => {
	if (!networkId) {
		return reject(new Error(USER_NOT_REGISTERED_ON_NETWORK));
	}
	return getNodeLib().getUserStats(networkId, opts);
};

const getExchangeOperators = (opts = {
	limit: null,
	page: null,
	orderBy: null,
	order: null,
	email: null
}) => {
	const pagination = paginationQuery(opts.limit, opts.page);
	const ordering = orderingQuery(opts.orderBy, opts.order);

	const operatorRoleNames = getRoles().map(role => role.role_name);
	const options = {
		where: {
			role: {
				[Op.in]: operatorRoleNames
			},
			...(opts.email && { email: { [Op.iLike]: `%${opts.email}%` } })
			
		},
		attributes: ['id', 'email', 'role'], 
		order: [ordering],
		...pagination
	};

	return dbQuery.findAndCountAllWithRows('user', options);
};

const updateUserMeta = async (id, givenMeta = {}, opts = { overwrite: null }, auditInfo) => {
	const { user_meta: referenceMeta } = getKitConfig();

	const user = await getUserByKitId(id, false);

	if (!user) {
		throw new Error(USER_NOT_FOUND);
	}

	const deletedKeys = [];

	for (let key in user.meta) {
		if (!referenceMeta[key] && isNil(user.meta[key])) {
			delete user.meta[key];
		}
	}

	for (let key in givenMeta) {
		if (!referenceMeta[key]) {
			if (!has(user.meta, key)) {
				throw new Error(`Field ${key} does not exist in the user meta reference`);
			} else {
				if (isNil(givenMeta[key])) {
					deletedKeys.push(key);
				} else {
					const storedDataType = isDatetime(user.meta[key]) ? 'date-time' : typeof user.meta[key];
					const givenDataType = isDatetime(givenMeta[key]) ? 'date-time' : typeof givenMeta[key];

					if (storedDataType !== givenDataType) {
						throw new Error(`Wrong data type given for field ${key}: ${givenDataType}. Expected data type: ${storedDataType}`);
					}
				}
			}
		} else {
			if (isNil(givenMeta[key]) && referenceMeta[key].required) {
				throw new Error(`Field ${key} is a required value`);
			} else if (!isNil(givenMeta[key])) {
				const givenDataType = isDatetime(givenMeta[key]) ? 'date-time' : typeof givenMeta[key];

				if (referenceMeta[key].type !== givenDataType) {
					throw new Error(`Wrong data type given for field ${key}: ${givenDataType}. Expected data type: ${referenceMeta[key].type}`);
				}
			}
		}
	}

	const updatedUserMeta = opts.overwrite ? omit(givenMeta, ...deletedKeys) : omit({ ...user.meta, ...givenMeta }, ...deletedKeys);

	const updatedUser = await user.update({
		meta: updatedUserMeta
	});
	createAuditLog({ email: auditInfo.userEmail, session_id: auditInfo.sessionId }, auditInfo.apiPath, auditInfo.method, updatedUserMeta, user.meta);
	return pick(updatedUser, 'id', 'email', 'meta');
};

const [mapNetworkIdToKitId, mapKitIdToNetworkId] = (() => {
	return [
		async (networkIds = []) => {
			if (!isArray(networkIds)) {
				throw new Error('networkIds must be an array');
			}

			networkIds = uniq(networkIds);

			const opts = {
				attributes: ['id', 'network_id'],
				raw: true
			};

			const result = {};

			if (networkIds.length === 0) {
				return result;
			} else if (networkIds.length > 0) {
				if (networkIds.some((id) => !isInteger(id) || id <= 0)) {
					throw new Error('networkIds can only contain integers greater than 0');
				}

				networkIds.forEach((nid) => {
					result[nid] = networkIdToKitId[nid];
				});

				const cacheMisses = Object.entries(result)
					.filter(([_, value]) => value === undefined)
					.map(([key, _]) => key);

				if (cacheMisses.length === 0) {
					return result;
				}

				opts.where = {
					network_id: cacheMisses
				};
			}

			const users = await dbQuery.findAll('user', opts);

			users.forEach((user) => {
				if (user.network_id) {
					networkIdToKitId[user.network_id] = user.id;
					kitIdToNetworkId[user.id] = user.network_id;

					result[user.network_id] = user.id;
				}
			}, {});

			if (Object.keys(result).length === 0) {
				throw new Error('No users found with given networkIds');
			}

			// Object.entries(result)
			// 	.filter(([_, value]) => value === undefined)
			// 	.forEach(([key, _]) => {
			// 		delete result[key];
			// 	});

			return result;
		},
		async (kitIds = []) => {
			let result = {};

			if (!isArray(kitIds)) {
				throw new Error('kitIds must be an array');
			}

			kitIds = uniq(kitIds);

			const opts = {
				attributes: ['id', 'network_id'],
				raw: true
			};

			if (kitIds.length === 0) {
				return result;
			} else if (kitIds.length > 0) {
				if (kitIds.some((id) => !isInteger(id) || id <= 0)) {
					throw new Error('kitIds can only contain integers greater than 0');
				}

				kitIds.forEach((nid) => {
					result[nid] = kitIdToNetworkId[nid];
				});

				const cacheMisses = Object.entries(result)
					.filter(([_, value]) => value === undefined)
					.map(([key, _]) => key);

				if (cacheMisses.length === 0) {
					return result;
				}

				opts.where = {
					id: cacheMisses
				};
			}

			const users = await dbQuery.findAll('user', opts);

			users.forEach((user) => {
				if (user.network_id) {
					networkIdToKitId[user.network_id] = user.id;
					kitIdToNetworkId[user.id] = user.network_id;

					result[user.id] = user.network_id;
				}
			}, {});

			if (Object.keys(result).length === 0) {
				throw new Error('No users found with given kitIds');
			}

			// Object.entries(result)
			// 	.filter(([_, value]) => value === undefined)
			// 	.forEach(([key, _]) => {
			// 		delete result[key];
			// 	});

			return result;
		}];
})();

const updateUserInfo = async (userId, data = {}, auditInfo) => {
	if (!isInteger(userId) || userId <= 0) {
		throw new Error('UserId must be a positive integer');
	}
	if (!isPlainObject(data)) {
		throw new Error('Update data must be an object');
	}

	if (isEmpty(data)) {
		throw new Error('No fields to update');
	}

	const user = await getUserByKitId(userId, false);

	if (!user) {
		throw new Error('User not found');
	}

	const updateData = { user_id: userId };

	for (const field in data) {
		const value = data[field];

		switch (field) {
			case 'full_name':
			case 'nationality':
			case 'phone_number':
				if (isString(value)) {
					updateData[field] = value;
				}
				break;
			case 'gender':
				if (isBoolean(value)) {
					updateData[field] = value;
				}
				break;
			case 'dob':
				if (isDatetime(value)) {
					updateData[field] = value;
				}
				break;
			case 'address':
				if (isPlainObject(value)) {
					updateData[field] = {
						...user.address,
						...pick(value, ['address', 'city', 'country', 'postal_code'])
					};
				}
				break;
			case 'id_data':
				if (isPlainObject(value)) {
					updateData[field] = {
						...user.id_data,
						...pick(value, ['type', 'status', 'number', 'issued_date', 'expiration_date'])
					};
				}
				break;
			default:
				break;
		}
	}

	if (isEmpty(updateData)) {
		throw new Error('No fields to update');
	}
	const oldValues = { user_id: userId };
	Object.keys(updateData).forEach(key => { oldValues[key] = user.dataValues[key]; });

	await user.update(
		updateData,
		{ fields: Object.keys(updateData) }
	);

	createAuditLog({ email: auditInfo.userEmail, session_id: auditInfo.sessionId }, auditInfo.apiPath, auditInfo.method, updateData, oldValues);
	return omitUserFields(user.dataValues);
};

const getExchangeUserSessions = (opts = {
	user_id: null,
	last_seen: null,
	status: null,
	limit: null,
	page: null,
	order_by: null,
	order: null,
	start_date: null,
	end_date: null,
	format: null
}) => {

	const pagination = paginationQuery(opts.limit, opts.page);
	const ordering = orderingQuery(opts.order_by, opts.order);
	const timeframe = timeframeQuery(opts.start_date, opts.end_date);

	let lastSeenHour;

	if (opts.last_seen) {
		lastSeenHour = opts.last_seen.split('h')[0];
	}

	const query = {
		where: {
			...(opts.status == true && {
				status: opts.status,
				expiry_date: {
					[Op.gt]: new Date()
				}
			}),
			...(opts.status == false && {
				[Op.or]: [
					{
						status: opts.status,
						expiry_date: {
							[Op.lt]: new Date()
						}
					}]
			}),
			created_at: timeframe,
			...(opts.last_seen && {
				last_seen:
				{
					[Op.gt]: moment().subtract(lastSeenHour, 'hours').toDate()
				}
			}),
		},
		attributes: {
			exclude: ['token']
		},
		include: [
			{
				model: getModel('login'),
				as: 'login',
				...(opts.user_id && { where: { user_id: opts.user_id } }),
				include: [
					{
						model: getModel('user'),
						attributes: ['id', 'email']
					},
				]
			}
		],
		order: [ordering],
		...(!opts.format && pagination),
	};

	if (opts.format) {
		query.attributes = ['id', 'login_id', 'status', 'last_seen', 'expiry_date', 'role', 'created_at', 'updated_at'];
		return dbQuery.fetchAllRecords('session', query)
			.then((sessions) => {
				if (opts.format && opts.format === 'csv') {
					if (sessions.data.length === 0) {
						throw new Error(NO_DATA_FOR_CSV);
					}

					const csv = parse(sessions.data, Object.keys(sessions.data[0]));
					return csv;
				} else {
					return sessions;
				}
			});
	} else {
		return dbQuery.findAndCountAllWithRows('session', query);
	}

};

const revokeExchangeUserSession = async (sessionId, userId = null) => {
	const session = await getModel('session').findOne({
		include: [
			{
				model: getModel('login'),
				as: 'login',
				attributes: ['user_id'],
				...(userId && { where: { user_id: userId } })
			}
		],
		where: { id: sessionId }
	});


	if (!session) {
		throw new Error(SESSION_NOT_FOUND);
	}

	if (!session.status) {
		throw new Error(SESSION_ALREADY_REVOKED);
	}

	if (userId && session.login.user_id !== userId) {
		throw new Error(WRONG_USER_SESSION);
	}

	client.delAsync(session.token);

	const updatedSession = await session.update({ status: false }, {
		fields: ['status']
	});

	delete updatedSession.dataValues.token;
	updatedSession.dataValues.user_id = session.login.user_id;
	return updatedSession.dataValues;
};

const getAllBalancesAdmin = async (opts = {
	user_id: null,
	currency: null,
	format: null,
	additionalHeaders: null
}) => {

	let network_id = null;
	if (opts.user_id) {
		// check mapKitIdToNetworkId
		const idDictionary = await mapKitIdToNetworkId([opts.user_id]);
		if (!has(idDictionary, opts.user_id)) {
			throw new Error(USER_NOT_FOUND);
		} else if (!idDictionary[opts.user_id]) {
			throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
		} else {
			network_id = idDictionary[opts.user_id];
		}
	}

	return getNodeLib().getBalances({
		userId: network_id,
		currency: opts.currency,
		format: (opts.format && (opts.format === 'csv' || opts.format === 'all')) ? 'all' : null, // for csv get all data,
		additionalHeaders: opts.additionalHeaders
	})
		.then(async (balances) => {
			if (balances.data.length > 0) {
				const networkIds = balances.data.map((balance) => balance.user_id).filter(id => id);
				const idDictionary = await mapNetworkIdToKitId(networkIds);
				for (let balance of balances.data) {
					const user_kit_id = idDictionary[balance.user_id];
					balance.network_id = balance.user_id;
					balance.user_id = user_kit_id;
					if (balance.User) balance.User.id = user_kit_id;
				}
			}

			if (opts.format && opts.format === 'csv') {
				if (balances.data.length === 0) {
					throw new Error(NO_DATA_FOR_CSV);
				}
				const csv = parse(balances.data, Object.keys(balances.data[0]));
				return csv;
			} else {
				return balances;
			}
		});
};

// set all active sessions of the user to false and remove them from redis
const revokeAllUserSessions = async (userId) => {

	const sessions = await getModel('session').findAll(
		{
			where: { status: true },
			include: [
				{
					model: getModel('login'),
					as: 'login',
					attributes: ['user_id'],
					where: { user_id: userId }
				}
			]
		});

	for (const session of sessions) {
		await session.update({ status: false }, { fields: ['status'] });
		client.delAsync(session.token);
	}
	return true;
};

const deleteKitUser = async (userId, sendEmail = true) => {
	const user = await dbQuery.findOne('user', {
		where: {
			id: userId
		},
		attributes: [
			'id',
			'email',
			'activated',
			'role'
		]
	});

	if (!user) {
		throw new Error(USER_NOT_FOUND);
	}
	if (user.role === 'admin') {
		throw new Error(CANNOT_CHANGE_ADMIN_EMAIL);
	}
	await revokeAllUserSessions(userId);
	// we simply add _deleted at the end of users email. This way he won't be able to login anymore and he can create another account.
	const userEmail = user.email;
	const updatedUser = await user.update(
		{ email: userEmail + '_deleted', activated: false },
		{ fields: ['email', 'activated'], returning: true }
	);

	if (sendEmail) {
		sendEmail(
			MAILTYPE.USER_DELETED,
			userEmail,
			{},
			user.settings
		);
	}

	return updatedUser;
};

const restoreKitUser = async (userId) => {
	const user = await dbQuery.findOne('user', {
		where: {
			id: userId
		},
		attributes: [
			'id',
			'email',
			'activated'
		]
	});

	if (!user) {
		throw new Error(USER_NOT_FOUND);
	}

	if (!user.email.includes('_deleted')) {
		throw new Error(USER_ALREADY_RECOVERED);
	}

	const userEmail = user.email.split('_deleted')[0];

	return user.update(
		{ email: userEmail, activated: true },
		{ fields: ['email', 'activated'], returning: true }
	);
};

const changeKitUserEmail = async (userId, newEmail, auditInfo) => {
	const user = await dbQuery.findOne('user', {
		where: {
			id: userId
		},
		attributes: [
			'id',
			'email',
			'is_admin',
			'role'
		]
	});

	if (!user) {
		throw new Error(USER_NOT_FOUND);
	}
	if (user.is_admin || user.role === 'admin') {
		throw new Error(CANNOT_CHANGE_ADMIN_EMAIL);
	}

	if (!isEmail(newEmail)) {
		return reject(new Error(PROVIDE_VALID_EMAIL));
	}

	const userEmail = user.email;
	if (userEmail === newEmail) {
		throw new Error(EMAIL_IS_SAME);
	}

	if (userEmail.includes('_deleted')) {
		throw new Error(CANNOT_CHANGE_DELETED_EMAIL);
	}

	const isExists = await dbQuery.findOne('user', {
		where: {
			email: newEmail
		},
		attributes: [
			'id',
			'email',
		]
	});

	if (isExists) {
		throw new Error(EMAIL_EXISTS);
	}

	await revokeAllUserSessions(userId);

	const updatedUser = await user.update(
		{ email: newEmail },
		{ fields: ['email'], returning: true }
	);
	createAuditLog({ email: auditInfo.userEmail, session_id: auditInfo.sessionId }, auditInfo.apiPath, auditInfo.method, { user_id: userId, email: userEmail }, { user_id: userId, email: newEmail });
	sendEmail(
		MAILTYPE.ALERT,
		null,
		{
			type: 'Email changed',
			data: `User email ${userEmail} changed to ${newEmail} by admin`
		},
		{}
	);

	return updatedUser;
};

const getAllAffiliations = (query = {}) => {
	return dbQuery.findAndCountAll('affiliation', query);
};

const applyEarningRate = (amount, earning_rate) => {
	return mathjs.number(
		mathjs.multiply(
			mathjs.bignumber(amount),
			mathjs.divide(
				mathjs.bignumber(earning_rate),
				mathjs.bignumber(100)
			)
		)
	);
};

const addAmounts = (amount1, amount2) => {
	return mathjs.number(
		mathjs.add(
			mathjs.bignumber(amount1),
			mathjs.bignumber(amount2)
		)
	);
};
const sortTopVolumes = (volumeData, topN = 4) => {
	const topSortedVolumes = {};

	for (const period in volumeData) {
		const periodData = volumeData[period];

		if (Object.keys(periodData).length > 0) {
			topSortedVolumes[period] = Object.entries(periodData)
				.sort(([, valueA], [, valueB]) => valueB - valueA)
				.slice(0, topN)
				.map(([key, value]) => ({ [key]: value }));
		}
	}

	return topSortedVolumes;
};

const multiplyAmounts = (x, y) => {
	return mathjs.number(
		mathjs.multiply(mathjs.bignumber(x), mathjs.bignumber(y))
	);
};

const getUserReferralCodes = async (
	opts = {
		user_id: null,
		limit: null,
		page: null,
		order_by: null,
		order: null,
		start_date: null,
		end_date: null,
		format: null
	}) => {

	const pagination = paginationQuery(opts.limit, opts.page);
	const ordering = orderingQuery(opts.order_by, opts.order);
	const timeframe = timeframeQuery(opts.start_date, opts.end_date);

	const query = {
		where: {
			created_at: timeframe,
			...(opts.user_id && { user_id: opts.user_id })
		},
		order: [ordering],
		...(!opts.format && pagination),
	};

	if (opts.format) {
		return dbQuery.fetchAllRecords('referralCode', query)
			.then((codes) => {
				if (opts.format && opts.format === 'csv') {
					if (codes.data.length === 0) {
						throw new Error(NO_DATA_FOR_CSV);
					}
					const csv = parse(codes.data, Object.keys(codes.data[0]));
					return csv;
				} else {
					return codes;
				}
			});
	} else {
		const referralCodes = await dbQuery.findAndCountAllWithRows('referralCode', query);

		const affiliations = await getModel('affiliation').findAll({
			where: {
				code: { [Op.in]: referralCodes?.data?.map(rc => rc.code) }
			},
		});
		referralCodes.data = referralCodes.data.map(rc => ({
			...rc,
			affiliations: affiliations.filter(aff => aff.code === rc.code)
		}));
		return referralCodes;
	}
};

const createUserReferralCode = async (data) => {
	const { user_id, discount, earning_rate, code, is_admin } = data;

	const {
		earning_rate: EARNING_RATE,
	} = getKitConfig()?.referral_history_config || {};

	if (discount < 0) {
		throw new Error('discount cannot be negative');
	}

	if (discount > 100) {
		throw new Error('discount cannot be more than 100');
	}

	if (discount % 10 !== 0) {
		throw new Error('discount must be in increments of 10');
	}

	if (earning_rate < 1) {
		throw new Error('earning rate cannot be less than 1');
	}

	if (earning_rate > 100) {
		throw new Error('earning rate cannot be more than 100');
	}

	if (earning_rate % 10 !== 0) {
		throw new Error('earning rate must be in increments of 10');
	}

	if (!is_admin && (earning_rate + discount > EARNING_RATE)) {
		throw new Error('discount and earning rate combined cannot exceed exchange earning rate');
	}

	if (!is_admin && code.length !== 6) {
		throw new Error('invalid referral code');
	}

	const user = await getUserByKitId(user_id);

	if (!user) {
		throw new Error(USER_NOT_FOUND);
	}

	if (!is_admin) {
		const userReferralCodes = await getModel('referralCode').findAll({
			where: {
				user_id
			}
		});
		if (userReferralCodes.length > 3) {
			throw new Error('you cannot create more than 3 referral codes');
		}
	}

	const referralCode = await getModel('referralCode').create(data, {
		fields: [
			'user_id',
			'discount',
			'earning_rate',
			'code'
		]
	});
	return referralCode;
};

const getUnrealizedReferral = async (user_id) => {
	const exchangeInfo = getKitConfig().info;

	if (!REFERRAL_HISTORY_SUPPORTED_PLANS.includes(exchangeInfo.plan)) {
		throw new Error(REFERRAL_UNSUPPORTED_EXCHANGE_PLAN);
	}

	const { active } = getKitConfig()?.referral_history_config || {};
	if (!active) {
		throw new Error(REFERRAL_HISTORY_NOT_ACTIVE);
	}

	const referralHistoryModel = getModel('ReferralHistory');
	const unrealizedRecords = await referralHistoryModel.findAll({
		where: { referer: user_id, status: false },
		attributes: [
			'referer',
			[fn('sum', col('accumulated_fees')), 'accumulated_fees'],
		],
		group: ['referer'],
	});

	return unrealizedRecords;
};

const getRealizedReferral = async (opts = {
	user_id: null,
	limit: null,
	page: null,
	order_by: null,
	order: null,
	start_date: null,
	end_date: null,
	format: null
}) => {
	const pagination = paginationQuery(opts.limit, opts.page);
	const ordering = orderingQuery(opts.order_by, opts.order);
	const timeframe = timeframeQuery(opts.start_date, opts.end_date);

	const query = {
		where: {
			created_at: timeframe,
			status: true,
			...(opts.user_id && { referer: opts.user_id })
		},
		order: [ordering],
		...(!opts.format && pagination),
	};

	if (opts.format) {
		return dbQuery.fetchAllRecords('ReferralHistory', query)
			.then((file) => {
				if (opts.format && opts.format === 'csv') {
					if (file.data.length === 0) {
						throw new Error(NO_DATA_FOR_CSV);
					}
					const csv = parse(file.data, Object.keys(file.data[0]));
					return csv;
				} else {
					return file;
				}
			});
	} else {
		return dbQuery.findAndCountAllWithRows('ReferralHistory', query);
	}
};

const createUnrealizedReferralFees = async (currentTime) => {
	const {
		earning_period: EARNING_PERIOD,
		distributor_id: DISTRIBUTOR_ID,
		date_enabled: DATE_ENABLED
	} = getKitConfig()?.referral_history_config || {};

	const exchangeInfo = getKitConfig().info;

	if (!REFERRAL_HISTORY_SUPPORTED_PLANS.includes(exchangeInfo.plan)) {
		throw new Error(REFERRAL_UNSUPPORTED_EXCHANGE_PLAN);
	}

	const { getAllTradesNetwork } = require('./order');
	const referralHistoryModel = getModel('ReferralHistory');

	let userLastSettleDate = moment(DATE_ENABLED).toISOString();

	const userLastTrade = await referralHistoryModel.findOne({
		order: [['last_settled', 'DESC']],
	});

	if (userLastTrade) {
		userLastSettleDate = moment(userLastTrade.last_settled).toISOString();
	}

	return all([
		getUserByKitId(DISTRIBUTOR_ID, true, true),
		getAllTradesNetwork(
			null,
			null,
			null,
			'timestamp',
			'desc',
			userLastSettleDate ? moment(userLastSettleDate).add(1, 'ms').toISOString() : null,
			null,
			'all'
		)
	])
		.then(([distributor, { count, data: trades }]) => {
			if (!distributor) {
				throw new Error('No distributor found');
			}

			if (count === 0) {
				throw new Error('No trades to settle');
			}

			const lastSettledTrade = trades[0].timestamp;

			const accumulatedFees = {};

			for (let trade of trades) {
				const {
					maker_network_id,
					taker_network_id,
					maker_fee,
					taker_fee,
					maker_fee_coin,
					taker_fee_coin
				} = trade;

				if (maker_fee > 0 && maker_fee_coin) {
					if (!accumulatedFees[maker_network_id]) {
						accumulatedFees[maker_network_id] = {};
					}

					if (!isNumber(accumulatedFees[maker_network_id][maker_fee_coin])) {
						accumulatedFees[maker_network_id][maker_fee_coin] = 0;
					}

					accumulatedFees[maker_network_id][maker_fee_coin] = addAmounts(
						accumulatedFees[maker_network_id][maker_fee_coin],
						maker_fee
					);
				}

				if (taker_fee > 0 && taker_fee_coin) {
					if (!accumulatedFees[taker_network_id]) {
						accumulatedFees[taker_network_id] = {};
					}

					if (!isNumber(accumulatedFees[taker_network_id][taker_fee_coin])) {
						accumulatedFees[taker_network_id][taker_fee_coin] = 0;
					}

					accumulatedFees[taker_network_id][taker_fee_coin] = addAmounts(
						accumulatedFees[taker_network_id][taker_fee_coin],
						taker_fee
					);
				}
			}

			const tradeUsers = Object.keys(accumulatedFees);
			const tradeUsersAmount = tradeUsers.length;

			if (tradeUsersAmount === 0) {
				throw new Error('No trades made with fees');
			}


			return all([
				accumulatedFees,
				lastSettledTrade,
				getAllAffiliations({
					where: {
						'$user.network_id$': tradeUsers,
						...(EARNING_PERIOD && {
							created_at: {
								[Op.gt]: moment(currentTime).subtract(EARNING_PERIOD, 'months').toISOString(),
								[Op.lte]: currentTime
							}
						})
					},
					include: [
						{
							model: getModel('user'),
							as: 'user',
							attributes: [
								'id',
								'email',
								'network_id'
							]
						},
						{
							model: getModel('user'),
							as: 'referer',
							attributes: [
								'id',
								'email',
								'network_id'
							]
						}
					]
				})
			]);
		})
		.then(async ([accumulatedFees, lastSettledTrade, { count, rows: affiliations }]) => {
			const filteredFees = {};
			const referralHistory = [];
			if (count === 0) {
				throw new Error('No trades made by affiliated users');
			}

			for (let affiliation of affiliations) {
				const refereeUser = affiliation.user;
				const referer = affiliation.referer;

				if (accumulatedFees[refereeUser.network_id]) {
					// refererKey includes user kit id, user network id, and user email separated by colons
					const refererKey = `${referer.id}:${referer.network_id}:${referer.email}`;
					if (!filteredFees[refererKey]) {
						filteredFees[refererKey] = {};
					}

					for (let coin in accumulatedFees[refereeUser.network_id]) {
						if (!isNumber(filteredFees[refererKey][coin])) {
							filteredFees[refererKey][coin] = 0;
						}

						filteredFees[refererKey][coin] = addAmounts(
							filteredFees[refererKey][coin],
							accumulatedFees[refereeUser.network_id][coin]
						);


						const refIndex = referralHistory.findIndex(data => data.referee === refereeUser.id && data.referer === referer.id && data.coin === coin);
						if (refIndex >= 0) {
							referralHistory[refIndex].accumulated_fees = filteredFees[refererKey][coin];
						} else {
							referralHistory.push({
								referer: referer.id,
								referee: refereeUser.id,
								last_settled: lastSettledTrade,
								code: affiliation.code,
								earning_rate: affiliation.earning_rate,
								coin,
								accumulated_fees: filteredFees[refererKey][coin]
							});
						}
					}
				}
			}

			const nativeCurrency = getKitConfig()?.referral_history_config?.currency;

			if (!nativeCurrency) {
				throw new Error('currency in referral config not defined');
			}

			const exchangeCoins = referralHistory.map(record => record.coin) || [];
			const conversions = await getNodeLib().getOraclePrices(exchangeCoins, {
				quote: nativeCurrency,
				amount: 1
			});

			for (let record of referralHistory) {
				record.accumulated_fees = applyEarningRate(record.accumulated_fees, record.earning_rate);

				if (conversions[record.coin] === -1) continue;
				record.accumulated_fees = new BigNumber(record.accumulated_fees).multipliedBy(conversions[record.coin]).toNumber();
				record.status = false;
			}

			return referralHistoryModel.bulkCreate(referralHistory);
		})
		.catch(err => err);
};

const settleFees = async (user_id) => {
	const { active, distributor_id, minimum_amount } = getKitConfig()?.referral_history_config || {};
	if (!active) {
		throw new Error(REFERRAL_HISTORY_NOT_ACTIVE);
	}

	const exchangeInfo = getKitConfig().info;

	if (!REFERRAL_HISTORY_SUPPORTED_PLANS.includes(exchangeInfo.plan)) {
		throw new Error(REFERRAL_UNSUPPORTED_EXCHANGE_PLAN);
	}

	const distributor = await getUserByKitId(distributor_id, true, true);

	const nativeCurrency = getKitConfig()?.referral_history_config?.currency;

	if (!nativeCurrency) {
		throw new Error('currency in referral config not defined');
	}

	const { transferAssetByKitIds } = require('./wallet');
	const referralHistoryModel = getModel('ReferralHistory');

	const unrealizedRecords = await referralHistoryModel.findAll({
		where: { referer: user_id, status: false },
	});

	let totalValue = 0;
	for (let record of unrealizedRecords) {
		totalValue = new BigNumber(record.accumulated_fees).plus(totalValue).toNumber();
	}

	if (totalValue < minimum_amount) {
		throw new Error('Total unrealized earned fees are too small to be converted to realized earnings');
	}

	const coinConfiguration = getKitCoin(nativeCurrency);
	const { increment_unit } = coinConfiguration;
	const decimalPoint = new BigNumber(increment_unit).dp();
	totalValue = new BigNumber(totalValue).decimalPlaces(decimalPoint, BigNumber.ROUND_DOWN).toNumber();

	if (distributor.balance[`${nativeCurrency}_available`] < totalValue) {
		// send email to admin for insufficient balance
		sendEmail(
			MAILTYPE.ALERT,
			null,
			{
				type: 'Insufficient balance for fee settlement!',
				data: `<div><p>Distributor with ID ${distributor_id} does not have enough balance to proceed with the settlement, Required amount: ${totalValue} ${nativeCurrency.toUpperCase()}, Available Amount: ${distributor.balance[`${nativeCurrency}_available`]} ${nativeCurrency.toUpperCase()}</div></p>`
			},
			{}
		);

		throw new Error('Settlement is not available at the moment, please retry later');
	}

	try {
		const settledIds = unrealizedRecords.map(record => record.id);
		await referralHistoryModel.update({ status: true }, { where: { id: settledIds } });

		await transferAssetByKitIds(
			distributor_id,
			user_id,
			nativeCurrency,
			totalValue,
			'Referral Settlement',
			false
		);

	} catch (error) {
		// send mail to admin
		sendEmail(
			MAILTYPE.ALERT,
			null,
			{
				type: 'Error during fee settlement!',
				data: `<div><p>Error occured during a fee settlement operation for user id: ${user_id}, error message: ${error.message}</div></p>`
			},
			{}
		);

		// obfuscate the message for the end user
		throw new Error('Something went wrong');
	}
};

const fetchUserReferrals = async (opts = {
	user_id: null,
	limit: null,
	page: null,
	order_by: null,
	order: null,
	start_date: null,
	end_date: null,
	format: null
}) => {
	const referralHistoryModel = getModel('ReferralHistory');
	const timeframe = timeframeQuery(opts.start_date, opts.end_date);

	const dateTruc = fn('date_trunc', 'day', col('last_settled'));
	let query = {
		where: {
			referer: opts.user_id
		},
		attributes: [
			[fn('sum', col('accumulated_fees')), 'accumulated_fees']
		],
		group: []
	};

	if (!opts.format) { query.where.created_at = timeframe; query = { ...query }; }

	if (opts.order_by === 'referee') {
		query.attributes.push('referee');
		query.group.push('referee');

		return referralHistoryModel.findAll(query)
			.then(async (referrals) => {
				return { count: referrals.length, data: referrals };
			});
	} else {
		query.attributes.push([dateTruc, 'date']);
		query.group.push('date');

		let result = {};
		let referrals = await referralHistoryModel.findAll(query);
		result = { count: referrals.length, data: referrals };

		query = {
			where: {
				referer: opts.user_id
			},
			attributes: [
				[fn('sum', col('accumulated_fees')), 'accumulated_fees']
			],
			group: []
		};

		referrals = await referralHistoryModel.findAll(query);
		result.total = referrals?.[0]?.accumulated_fees;
		return result;
	}
};

const getUserBalanceHistory = (opts = {
	user_id: null,
	limit: null,
	page: null,
	orderBy: null,
	order: null,
	startDate: null,
	endDate: null,
	format: null
}) => {

	const exchangeInfo = getKitConfig().info;

	if (!['fiat', 'boost', 'enterprise'].includes(exchangeInfo.plan)) {
		throw new Error(SERVICE_NOT_SUPPORTED);
	}


	if (!getKitConfig()?.balance_history_config?.active) { throw new Error(BALANCE_HISTORY_NOT_ACTIVE); }

	const timeframe = timeframeQuery(opts.startDate, opts.endDate);
	const ordering = orderingQuery(opts.orderBy, opts.order);
	let options = {
		where: {
			created_at: timeframe,
			...(opts.user_id && { user_id: opts.user_id }),
		},
		order: [ordering]
	};


	if (opts.format) {
		return dbQuery.fetchAllRecords('balanceHistory', options)
			.then(async (balance) => {
				if (opts.format && opts.format === 'csv') {
					if (balance.data.length === 0) {
						throw new Error(NO_DATA_FOR_CSV);
					}
					const csv = parse(balance.data, Object.keys(balance.data[0]));
					return csv;
				} else {
					return balance;
				}
			});
	}
	else {
		return dbQuery.findAndCountAllWithRows('balanceHistory', options)
			.then(async (balances) => {
				if (opts.user_id && (moment(opts.startDate).format('LL') !== moment(opts.endDate).subtract(1, 'days').format('LL'))) {

					const nativeCurrency = getKitConfig()?.balance_history_config?.currency || 'usdt';

					const exchangeCoins = getKitCoins();
					const conversions = await getNodeLib().getOraclePrices(exchangeCoins, {
						quote: nativeCurrency,
						amount: 1
					});

					let symbols = {};

					const { getUserBalanceByKitId } = require('./wallet');

					const balance = await getUserBalanceByKitId(opts.user_id);

					for (const key of Object.keys(balance)) {
						if (key.includes('balance') && balance[key]) {
							let symbol = key?.split('_')?.[0];
							symbols[symbol] = balance[key];
						}
					}


					const coins = Object.keys(symbols);

					let total = 0;
					let history = {};
					for (const coin of coins) {
						if (!conversions[coin]) continue;
						if (conversions[coin] === -1) continue;

						const nativeCurrencyValue = new BigNumber(symbols[coin]).multipliedBy(conversions[coin]).toNumber();

						history[coin] = { original_value: new BigNumber(symbols[coin]).toNumber(), native_currency_value: nativeCurrencyValue };
						total = new BigNumber(total).plus(nativeCurrencyValue).toNumber();
					}

					balances.count += 1;
					balances.data.unshift({
						user_id: Number(opts.user_id),
						balance: history,
						total,
						created_at: new Date()
					});
				}

				return balances;
			});
	}
};



const fetchUserProfitLossInfo = async (user_id, opts = { period: 7 }) => {

	const exchangeInfo = getKitConfig().info;

	if (!BALANCE_HISTORY_SUPPORTED_PLANS.includes(exchangeInfo.plan)) {
		throw new Error(SERVICE_NOT_SUPPORTED);
	}


	if (!getKitConfig()?.balance_history_config?.active) { throw new Error(BALANCE_HISTORY_NOT_ACTIVE); }

	const data = await client.getAsync(`${user_id}-${opts.period}user-pl-info`);
	if (data) return JSON.parse(data);

	const { getAllUserTradesByKitId } = require('./order');
	const { getUserWithdrawalsByKitId, getUserDepositsByKitId } = require('./wallet');

	const balanceHistoryModel = getModel('balanceHistory');
	const startDate = moment().subtract(opts.period, 'days').toDate();
	const endDate = moment().toDate();
	const timeframe = timeframeQuery(startDate, endDate);
	const userTrades = await getAllUserTradesByKitId(user_id, null, null, null, 'timestamp', 'asc', startDate, endDate, 'all');

	const userWithdrawals = await getUserWithdrawalsByKitId(user_id, null, null, null, null, null, null, null, null, 'created_at', 'asc', startDate, endDate, null, null, 'all');
	const userDeposits = await getUserDepositsByKitId(user_id, null, null, null, null, null, null, null, null, 'created_at', 'asc', startDate, endDate, null, null, 'all');
	const userBalanceHistory = await balanceHistoryModel.findAll({
		where: {
			user_id,
			created_at: timeframe
		}
	});


	const nativeCurrency = getKitConfig()?.balance_history_config?.currency || 'usdt';

	const exchangeCoins = getKitCoins();
	const conversions = await getNodeLib().getOraclePrices(exchangeCoins, {
		quote: nativeCurrency,
		amount: 1
	});

	let symbols = {};

	const { getUserBalanceByKitId } = require('./wallet');

	const balance = await getUserBalanceByKitId(user_id);

	for (const key of Object.keys(balance)) {
		if (key.includes('balance') && balance[key]) {
			let symbol = key?.split('_')?.[0];
			symbols[symbol] = balance[key];
		}
	}


	const coins = Object.keys(symbols);

	let total = 0;
	let history = {};
	for (const coin of coins) {
		if (!conversions[coin]) continue;
		if (conversions[coin] === -1) continue;

		const nativeCurrencyValue = new BigNumber(symbols[coin]).multipliedBy(conversions[coin]).toNumber();

		history[coin] = { original_value: new BigNumber(symbols[coin]).toNumber(), native_currency_value: nativeCurrencyValue };
		total = new BigNumber(total).plus(nativeCurrencyValue).toNumber();
	}
	userBalanceHistory.push({
		user_id: Number(user_id),
		balance: history,
		total,
		created_at: new Date()
	});



	const findClosestBalanceRecord = (date) => {
		return userBalanceHistory.reduce((closestRecord, entry) => {
			const entryDate = new Date(entry.created_at).getTime();
			const closestDate = new Date(closestRecord.created_at).getTime();
			const currentDate = new Date(date).getTime();

			if (Math.abs(currentDate - entryDate) < Math.abs(currentDate - closestDate)) {
				return entry;
			}

			return closestRecord;
		}, userBalanceHistory[0]);
	};

	const filterByInterval = (data, interval, conditionalDate) => {
		const dateThreshold = moment();

		switch (interval) {
			case '1d':
				dateThreshold.subtract(1, 'day');
				break;
			case '7d':
				dateThreshold.subtract(7, 'day');
				break;
			case '1m':
				dateThreshold.subtract(1, 'month');
				break;
			case '3m':
				dateThreshold.subtract(3, 'months');
			case '6m':
				dateThreshold.subtract(6, 'months');
				break;
			case '1y':
				dateThreshold.subtract(1, 'year');
				break;
			default:
				return data;
		}

		return data.filter((entry) => (moment(entry.created_at || entry.timestamp).isSameOrAfter(dateThreshold)) && (conditionalDate ? moment(entry.created_at || entry.timestamp).isAfter(moment(conditionalDate)) : true));
	};

	const timeIntervals = ['1d', '7d', '1m', '3m', '6m', '1y'];

	const results = {};

	for (const interval of timeIntervals) {
		const filteredBalanceHistory = filterByInterval(userBalanceHistory, interval, null);
		if (!filteredBalanceHistory[0]) continue;
		const initialBalances = filteredBalanceHistory[0]?.balance;
		const initialBalanceDate = filteredBalanceHistory[0]?.created_at;
		const filteredTrades = filterByInterval(userTrades.data, interval, initialBalanceDate);

		const filteredDeposits = filterByInterval(userDeposits.data, interval, initialBalanceDate);
		const filteredWithdrawals = filterByInterval(userWithdrawals.data, interval, initialBalanceDate);

		if (!initialBalances) continue;

		const netInflowFromDepositsPerAsset = {};
		filteredDeposits.forEach((deposit) => {
			const asset = deposit.currency.toLowerCase();
			if (!netInflowFromDepositsPerAsset[asset]) {
				netInflowFromDepositsPerAsset[asset] = 0;
			}
			const closestRecord = findClosestBalanceRecord(deposit.created_at);

			if (closestRecord.balance[asset]) {
				const marketPrice = closestRecord.balance[asset].native_currency_value / closestRecord.balance[asset].original_value;
				netInflowFromDepositsPerAsset[asset] += deposit.amount * marketPrice;
			}

		});

		const netInflowFromTradesPerAsset = filteredTrades.reduce((netInflow, trade) => {
			const asset = trade.symbol.split('-')[0].toLowerCase();
			const tradeValue = trade.size * trade.price;

			if (!netInflow[asset]) {
				netInflow[asset] = 0;
			}

			if (trade.side === 'buy') {
				netInflow[asset] += tradeValue;
			} else if (trade.side === 'sell') {
				netInflow[asset] -= tradeValue;
			}

			return netInflow;
		}, {});

		const netOutflowFromWithdrawalsPerAsset = {};
		filteredWithdrawals.forEach((withdrawal) => {
			const asset = withdrawal.currency.toLowerCase();
			if (!netOutflowFromWithdrawalsPerAsset[asset]) {
				netOutflowFromWithdrawalsPerAsset[asset] = 0;
			}
			const closestRecord = findClosestBalanceRecord(withdrawal.created_at);
			if (closestRecord.balance[asset]) {
				const marketPrice = closestRecord.balance[asset].native_currency_value / closestRecord.balance[asset].original_value;
				netOutflowFromWithdrawalsPerAsset[asset] -= withdrawal.amount * marketPrice;
			}

		});

		const finalBalances = filteredBalanceHistory[filteredBalanceHistory.length - 1].balance;

		results[interval] = {};
		let initalTotalBalance = 0;
		let finalTotalBalance = 0;
		let totalDeposits = 0;
		let totalWithdrawals = 0;

		let totalDay1Assets = 0;
		let totalInflow = 0;
		Object.keys(finalBalances).forEach(async (asset) => {

			if (!initialBalances?.[asset]?.native_currency_value) {
				initialBalances[asset] = {};
				initialBalances[asset].native_currency_value = 0;
				initialBalances[asset].original_value = 0;
			}

			initalTotalBalance += initialBalances?.[asset]?.native_currency_value || 0;
			finalTotalBalance += finalBalances[asset].native_currency_value || 0;
			totalDeposits += netInflowFromDepositsPerAsset[asset] || 0;
			totalWithdrawals += netOutflowFromWithdrawalsPerAsset[asset] || 0;


			totalDay1Assets += initialBalances[asset].native_currency_value;
			totalInflow += netInflowFromDepositsPerAsset[asset] || 0;

		});


		let cumulativePNL =
			finalTotalBalance -
			initalTotalBalance -
			totalDeposits -
			totalWithdrawals;

		const cumulativePNLPercentage =
			cumulativePNL / (totalDay1Assets + totalInflow) * 100;


		results[interval].total = cumulativePNL?.toFixed(2) || 0;
		results[interval].totalPercentage = cumulativePNLPercentage?.toFixed(2) || 0;
	}

	client.setexAsync(`${user_id}-${opts.period}user-pl-info`, 3600, JSON.stringify(results));

	return results;
};

const fetchUserAddressBook = async (user_id) => {
	const user = await getUserByKitId(user_id);

	if (!user) {
		throw new Error(USER_NOT_FOUND);
	}

	const userAddressBook = await getModel('userAddressBook').findOne({ where: { user_id } });

	if (!userAddressBook) {
		return {
			user_id: user.id,
			addresses: []
		};
	}

	return userAddressBook;
};




const updateUserAddresses = async (user_id, data) => {
	const { addresses } = data;

	let userAddressBook = await getModel('userAddressBook').findOne({ where: { user_id } });

	addresses.forEach((addressObj) => {
		if (!addressObj.address || !addressObj.network || !addressObj.label || !addressObj.currency) {
			throw new Error(ADDRESSBOOK_MISSING_FIELDS);
		}

		Object.keys(addressObj).forEach((key) => {
			if (!CRYPTO_ADDRESS_FIELDS.includes(key)) {
				throw new Error(ADDRESSBOOK_MISSING_FIELDS);
			}
		});

		const hasCreatedAt = userAddressBook?.addresses?.find?.(address => address.label === addressObj.label)?.created_at;
		if (!hasCreatedAt) {
			addressObj.created_at = moment().toISOString();
		} else {
			addressObj.created_at = hasCreatedAt;
		}
	});

	// Check for duplicate labels in the payload
	const labels = addresses.map(a => a.label);
	const uniqueLabels = new Set(labels);
	if (uniqueLabels.size !== labels.length) {
		throw new Error(ADDRESSBOOK_ALREADY_EXISTS);
	}

	// Check for duplicate address in the payload
	const uniqueAddresses = uniqWith(addresses, (addresssA, addressB) => addresssA.address === addressB.address && addresssA.network === addressB.network && addresssA.currency === addressB.currency);
	if (uniqueAddresses.length != addresses.length) {
		throw new Error(ADDRESSBOOK_ALREADY_EXISTS);
	}

	const user = await getUserByKitId(user_id);

	if (!user) {
		throw new Error(USER_NOT_FOUND);
	}

	if (!userAddressBook) {
		userAddressBook = await getModel('userAddressBook').create({
			user_id,
			addresses
		});
	} else {
		// Update the addresses
		userAddressBook = await userAddressBook.update({ addresses }, {
			fields: ['addresses']
		});
	}

	return userAddressBook;
};

const getPaymentDetails = async (user_id, opts = {
	limit: null,
	page: null,
	order_by: null,
	order: null,
	start_date: null,
	end_date: null,
	is_p2p: null,
	is_fiat_control: null,
	status: null,
}) => {
	const pagination = paginationQuery(opts.limit, opts.page);
	const ordering = orderingQuery(opts.order_by, opts.order);
	const timeframe = timeframeQuery(opts.start_date, opts.end_date);

	const query = {
		where: {
			created_at: timeframe,
			...(user_id && { user_id }),
			...(opts.is_p2p && { is_p2p: opts.is_p2p }),
			...(opts.is_fiat_control && { is_fiat_control: opts.is_fiat_control }),
			...(opts.status && { status: opts.status })
		},
		order: [ordering],
		...(!opts.format && pagination),
	};


	return dbQuery.findAndCountAllWithRows('paymentDetail', query);
};

const createPaymentDetail = async (data) => {
	const { user_id, name, label, details, is_p2p, is_fiat_control, status } = data;

	const user = await getUserByKitId(user_id);

	if (!user) {
		throw new Error(USER_NOT_FOUND);
	}

	const adminAccount = await getUserByKitId(1);

	sendEmail(
		MAILTYPE.ALERT,
		adminAccount.email,
		{
			type: 'An exchange user added a new payment method, Awaiting your approval',
			data: `User ID: ${user_id} added a new payment method. Account details: <ul>${details.fields.map(field => (`<li key=${field.id}>${field.name}: ${field.value}</li>`))}</ul>`
		},
		adminAccount.settings
	);

	const paymentDetail = await getModel('paymentDetail').create({
		user_id,
		name,
		label,
		details,
		is_p2p,
		is_fiat_control,
		status
	});
	return paymentDetail;
};

const updatePaymentDetail = async (id, data, isAdmin = false) => {
	const paymentDetail = await getModel('paymentDetail').findOne({ where: { id, user_id: data.user_id } });
	if (!paymentDetail) {
		throw new Error(PAYMENT_DETAIL_NOT_FOUND);
	}

	if (!isAdmin) { delete data.status; }

	if (data.status === 3) {
		const user = await getUserByKitId(data.user_id);
		sendEmail(MAILTYPE.BANK_VERIFIED, user.email, { bankAccounts: paymentDetail?.details?.fields }, user.settings);
	}

	if (!isAdmin && paymentDetail.status === 3) {
		throw new Error(UNAUTHORIZED_UPDATE_METHOD);
	}

	await paymentDetail.update(data, {
		fields: [
			'name',
			'label',
			'details',
			'is_p2p',
			'is_fiat_control',
			'status'
		]
	});
	return paymentDetail;
};

const deletePaymentDetail = async (id, user_id) => {
	const paymentDetail = await getModel('paymentDetail').findOne({ where: { id, user_id } });
	if (!paymentDetail) {
		throw new Error(PAYMENT_DETAIL_NOT_FOUND);
	}
	await paymentDetail.destroy();
};


const getOracleIndex = async () => {
	const coins = getKitCoins();
	const data = await getAssetsPrices(
		coins,
		getKitConfig().native_currency
	);

	return data;
};


const fetchUserTradingVolume = async (user_id, opts = {
	to: null,
	from: null
}) => {

	let { to, from } = opts;
	const currentTime = moment().seconds(0).milliseconds(0).toISOString();

	const { getAllUserTradesByKitId } = require('./order');

	if (from && to) {
		let volume = {};

		const oracleIndex = await getOracleIndex();

		const trades = await getAllUserTradesByKitId(
			user_id,
			null,
			null,
			null,
			null,
			null,
			from,
			to,
			'all'
		);

		if (trades.data && trades.data.length > 0) {
			for (const trade of trades.data) {
				const { symbol } = trade;
				let size = trade.size;

				const basePair = symbol.split('-')[0];

				if (basePair !== getKitConfig().native_currency) {
					if (!isNumber(oracleIndex[basePair]) || oracleIndex[basePair] <= 0) {
						continue;
					}
					size = multiplyAmounts(oracleIndex[basePair], size);
				}
				volume[basePair] = addAmounts(volume[basePair] || 0, size);
			}
		}

		return { user_id, volume };
	} else {
		const data = await client.getAsync(`${user_id}-asset-volumes`);
		if (data) return JSON.parse(data);
		let volume = {
			1: {},
			7: {},
			30: {},
			90: {},
		};

		let volumeNative = {
			1: {},
			7: {},
			30: {},
			90: {},
		};

		const to = moment(currentTime).toISOString();
		const from90Days = moment(currentTime).subtract(90, 'days').toISOString();

		const oracleIndex = await getOracleIndex();
		const trades = await getAllUserTradesByKitId(
			user_id,
			null,
			null,
			null,
			null,
			null,
			from90Days,
			to,
			'all'
		);

		if (trades.data && trades.data.length > 0) {
			for (const trade of trades.data) {
				const { symbol, timestamp } = trade;
				let size = trade.size;
				let nativeSize = trade.size;
				const basePair = symbol.split('-')[0];

				if (basePair !== getKitConfig().native_currency) {
					if (!isNumber(oracleIndex[basePair]) || oracleIndex[basePair] <= 0) {
						continue;
					}
					size = multiplyAmounts(oracleIndex[basePair], size);
				}

				const tradeDate = moment(timestamp);
				const daysDiff = moment(currentTime).diff(tradeDate, 'days');

				if (daysDiff <= 1) {
					volume[1][basePair] = addAmounts(volume[1][basePair] || 0, size);
					volumeNative[1][basePair] = addAmounts(volumeNative[1][basePair] || 0, nativeSize);
				}
				if (daysDiff <= 7) {
					volume[7][basePair] = addAmounts(volume[7][basePair] || 0, size);
					volumeNative[7][basePair] = addAmounts(volumeNative[7][basePair] || 0, nativeSize);
				}
				if (daysDiff <= 30) {
					volume[30][basePair] = addAmounts(volume[30][basePair] || 0, size);
					volumeNative[30][basePair] = addAmounts(volumeNative[30][basePair] || 0, nativeSize);
				}
				volume[90][basePair] = addAmounts(volume[90][basePair] || 0, size);
				volumeNative[90][basePair] = addAmounts(volumeNative[90][basePair] || 0, nativeSize);
			}
		}

		for (const period in volume) {
			const periodData = volume[period];
			let totalGain = 0;

			for (const coin in periodData) {
				totalGain += periodData[coin];
			}

			volume[period].total = totalGain;
		}

		const sortedVolumes = sortTopVolumes(volume);

		await client.setexAsync(`${user_id}-asset-volumes`, 60 * 60 * 2, JSON.stringify({ user_id, volume: sortedVolumes, volumeNative }));

		return { user_id, volume: sortedVolumes, volumeNative };

	}


};
const fetchUserAutoTrades = async (user_id, opts = {
	limit: null,
	page: null,
	order_by: null,
	order: null,
	start_date: null,
	end_date: null,
	active: null
}) => {

	const pagination = paginationQuery(opts.limit, opts.page);
	const ordering = orderingQuery(opts.order_by, opts.order);
	const timeframe = timeframeQuery(opts.start_date, opts.end_date);

	const query = {
		where: {
			created_at: timeframe,
			user_id,
			...(opts.active != null && { active: opts.active })
		},
		order: [ordering],
		...pagination
	};

	return dbQuery.findAndCountAllWithRows('AutoTradeConfig', query);
};

const createUserAutoTrade = async (user_id, {
	spend_coin,
	buy_coin,
	spend_amount,
	frequency,
	week_days,
	day_of_month,
	trade_hour,
	active,
	description
}, ip) => {

	if (!subscribedToCoin(buy_coin)) {
		throw new Error('Invalid coin ' + buy_coin);
	}

	if (!subscribedToCoin(spend_coin)) {
		throw new Error('Invalid coin ' + spend_coin);
	}

	const originalPair = `${spend_coin}-${buy_coin}`;
	const flippedPair = `${buy_coin}-${spend_coin}`;

	const { getUserQuickTrade } = require('./order');
	const opts = {
		additionalHeaders: {
			'x-forwarded-for': ip
		}
	};
	await getUserQuickTrade(
		spend_coin, spend_amount, null, buy_coin,
		null, ip, opts, { headers: { 'api-key': null } }, { user_id: user_id, network_id: null }
	);

	const quickTrades = getQuickTrades();
	let quickTradeConfig = quickTrades.find(quickTrade => quickTrade.symbol === originalPair);

	if (!quickTradeConfig) {
		quickTradeConfig = quickTrades.find(quickTrade => quickTrade.symbol === flippedPair);
	}

	if (!quickTradeConfig) {
		throw new Error(INVALID_AUTOTRADE_CONFIG);
	}

	if (week_days && !week_days.every(day => day >= 0 && day <= 6)) {
		throw new Error('invalid week_days');
	}

	const daysInMonth = moment().daysInMonth();
	if (day_of_month && (day_of_month < 1 || day_of_month > daysInMonth)) {
		throw new Error('Iinvalid day_of_month');
	}

	if (trade_hour < 0 || trade_hour > 23) {
		throw new Error('invalid trade_hour');
	}
	const autoTradeModel = getModel('AutoTradeConfig');

	const userAutoTrades = await autoTradeModel.findAll({ where: { user_id } });
	if (userAutoTrades?.length > 20) {
		throw new Error('You can\'t have more than 20 auto trades');
	}

	const { getUserBalanceByKitId } = require('./wallet');
	const balance = await getUserBalanceByKitId(user_id);
	if (balance[`${spend_coin}_available`] < spend_amount) {
		throw new Error(`Balance insufficient for auto trade: ${spend_coin} size: ${spend_amount}`);
	}

	return autoTradeModel.create({
		user_id,
		spend_coin,
		buy_coin,
		spend_amount,
		frequency,
		week_days,
		day_of_month,
		trade_hour,
		active,
		description
	});
};

const updateUserAutoTrade = async (user_id, {
	id,
	spend_coin,
	buy_coin,
	spend_amount,
	frequency,
	week_days,
	day_of_month,
	trade_hour,
	active,
	description
}, ip) => {

	if (!subscribedToCoin(buy_coin)) {
		throw new Error('Invalid coin ' + buy_coin);
	}

	if (!subscribedToCoin(spend_coin)) {
		throw new Error('Invalid coin ' + spend_coin);
	}

	const originalPair = `${spend_coin}-${buy_coin}`;
	const flippedPair = `${buy_coin}-${spend_coin}`;

	const quickTrades = getQuickTrades();
	let quickTradeConfig = quickTrades.find(quickTrade => quickTrade.symbol === originalPair);

	if (!quickTradeConfig) {
		quickTradeConfig = quickTrades.find(quickTrade => quickTrade.symbol === flippedPair);
	}

	if (!quickTradeConfig) {
		throw new Error(INVALID_AUTOTRADE_CONFIG);
	}

	if (spend_amount) {
		const { getUserQuickTrade } = require('./order');
		const opts = {
			additionalHeaders: {
				'x-forwarded-for': ip
			}
		};
		await getUserQuickTrade(
			spend_coin, spend_amount, null, buy_coin,
			null, ip, opts, { headers: { 'api-key': null } }, { user_id: user_id, network_id: null }
		);
	}

	if (week_days && !week_days.every(day => day >= 0 && day <= 6)) {
		throw new Error('invalid week_days');
	}

	if (week_days && !week_days.every(day => day >= 0 && day <= 6)) {
		throw new Error('invalid week_days');
	}

	const daysInMonth = moment().daysInMonth();
	if (day_of_month && (day_of_month < 1 || day_of_month > daysInMonth)) {
		throw new Error('invalid day_of_month');
	}

	if (trade_hour < 0 || trade_hour > 23) {
		throw new Error('invalid trade_hour');
	}

	const trade = await getModel('AutoTradeConfig').findOne({
		where: {
			id,
			user_id
		}
	});

	if (!trade) {
		throw new Error('Auto trade not found');
	}

	const { getUserBalanceByKitId } = require('./wallet');
	const balance = await getUserBalanceByKitId(user_id);
	if (balance[`${spend_coin}_available`] < spend_amount) {
		throw new Error(`Balance insufficient for auto trade: ${spend_coin} size: ${spend_amount}`);
	}

	return await trade.update({
		spend_coin,
		buy_coin,
		spend_amount,
		frequency,
		week_days,
		day_of_month,
		trade_hour,
		active,
		description
	});
};

const deleteUserAutoTrade = async (removed_ids, user_id) => {
	const trades = await getModel('AutoTradeConfig').findAll({
		where: {
			id: removed_ids,
			user_id
		}
	});

	if (trades?.length === 0) {
		throw new Error('Auto trade not found');
	}

	const promises = trades.map(async (trade) => {
		return await trade.destroy();
	});

	const results = await Promise.all(promises);
	return results;
};


const getAnnouncements = async (opts = {
	limit: null,
	page: null,
	order_by: null,
	order: null,
	start_date: null,
	end_date: null,
	is_popup: null,
	is_navbar: null,
	is_dropdown: null,
}) => {
	const pagination = paginationQuery(opts.limit, opts.page);
	const ordering = orderingQuery(opts.order_by, opts.order);
	const timeframe = timeframeQuery(opts.start_date, opts.end_date);

	const queryOptions = {
		where: {
			...(opts.is_navbar != null && { is_navbar: opts.is_navbar }),
			...(opts.is_popup != null && { is_popup: opts.is_popup }),
			...(opts.is_dropdown != null && { is_dropdown: opts.is_dropdown }),
		},
		order: [ordering],
		attributes: {
			exclude: ['created_by']
		},
		...pagination
	};

	const announcementModel = getModel('announcement');
	if (timeframe) queryOptions.where.created_at = timeframe;

	const results = await announcementModel.findAndCountAll(queryOptions);
	return convertSequelizeCountAndRows(results);
};

const createAnnouncement = async ({ title, message, type = 'info', user_id, end_date, start_date, is_popup, is_navbar, is_dropdown }) => {
	const exchangeInfo = getKitConfig().info;

	if (exchangeInfo.plan !== 'fiat') {
		throw new Error('Exchange plan does not support this feature');
	}

	const announcementModel = getModel('announcement');
	const announcement = await announcementModel.create({
		created_by: user_id,
		title,
		message,
		type,
		end_date,
		start_date,
		is_popup,
		is_navbar,
		is_dropdown
	});

	return announcement;
};

const updateAnnouncement = async (id, { title, message, type, user_id, end_date, start_date, is_popup, is_navbar, is_dropdown }) => {
	const announcementModel = getModel('announcement');

	const announcement = await announcementModel.findOne({ where: { id } });

	if (!announcement) {
		throw new Error('Not found');
	}

	await announcement.update({
		title,
		message,
		type,
		end_date,
		start_date,
		is_popup,
		is_navbar,
		is_dropdown,
		updated_by: user_id
	});

	return announcement;
};


const deleteAnnouncement = async (id) => {

	const announcementModel = getModel('announcement');
	const announcement = await announcementModel.findOne({ where: { id } });

	if (!announcement) {
		throw new Error('Not found');
	}

	await announcement.destroy();
	return { message: 'Success' };
};

const validateRoutePermissions = (inputPermissions) => {
	if (!isArray(inputPermissions)) {
		throw new Error('Permissions must be an array');
	}

	// Check for duplicates in input
	const uniquePermissions = [...new Set(inputPermissions)];
	if (uniquePermissions.length !== inputPermissions.length) {
		const duplicates = findDuplicates(inputPermissions);
		throw new Error(
			`Duplicate permissions found: ${duplicates.join(', ')}\n` +
			`Unique permissions would be: ${uniquePermissions.join(', ')}`
		);
	}

	// Flatten all valid permissions from our structure
	const allValidPermissions = flattenPermissionStructure(ROLE_PERMISSIONS);

	//Check for invalid permissions
	const invalidPerms = inputPermissions.filter(
		perm => !allValidPermissions.includes(perm)
	);

	if (invalidPerms.length > 0) {
		throw new Error(
			'Invalid permissions detected:\n' +
			`- Invalid: ${invalidPerms.join(', ')}\n` +
			`- Valid options: ${allValidPermissions.slice(0, 5).join(', ')}...` +
			`(showing 5 of ${allValidPermissions.length})`
		);
	}


	return true;
};

const findDuplicates = (arr) => {
	return arr.filter((item, index) => arr.indexOf(item) !== index);
};

const flattenPermissionStructure = (permStructure) => {
	let results = [];

	const traverse = (obj) => {
		for (const [key, value] of Object.entries(obj)) {
			if (typeof value === 'object') {
				// If it has HTTP methods, add them to results
				if ('get' in value || 'post' in value || 'put' in value || 'delete' in value) {
					if (value.get) results.push(value.get);
					if (value.post) results.push(value.post);
					if (value.put) results.push(value.put);
					if (value.delete) results.push(value.delete);
				}
				// Always keep traversing nested objects
				traverse(value);
			}
		}
	};

	traverse(permStructure);
	return results;
};
const getExchangeUserRoles = async (opts = {
	limit: null,
	page: null,
	order_by: null,
	order: null,
	search: null,
	start_date: null,
	end_date: null,
}) => {
	const pagination = paginationQuery(opts.limit, opts.page);
	const ordering = orderingQuery(opts.order_by, opts.order);
	const timeframe = timeframeQuery(opts.start_date, opts.end_date);

	const queryOptions = {
		where: {
			...(opts.search && {
				[Op.or]: [
					{ name: { [Op.iLike]: `%${opts.search}%` } },
					{ description: { [Op.iLike]: `%${opts.search}%` } }
				]
			})
		},
		order: [ordering],
		...pagination
	};

	if (timeframe) queryOptions.where.created_at = timeframe;
	// queryOptions.include = [{
	// 	model: getModel('user'),
	// 	as: 'users',
	// 	attributes: ['id', 'email']
	// }];

	return dbQuery.findAndCountAllWithRows('Role', {});
};
const validateConfigPermissions = (configPermissions) => {

	configPermissions.forEach(permission => {
		if (!KIT_CONFIG_KEYS.includes(permission)) {
			throw new Error(`Invalid config permission: ${permission}`);
		}
	});
};

const validateSecretPermissions = (secretPermissions) => {
	secretPermissions.forEach(permission => {
		if (!KIT_SECRETS_KEYS.includes(permission)) {
			throw new Error(`Invalid secret permission: ${permission}`);
		}
	});
};
const createExchangeUserRole = async ({ name, description, rolePermissions, configs, user_id, otp_code, color, restrictions }) => {

	const exchangeInfo = getKitConfig().info;

	if (exchangeInfo.plan !== 'fiat')
		throw new Error('Exchange plan does not support this feature');

	const Role = getModel('role');
	const User = getModel('user');
	if (!name) throw new Error('Role name is required');
	if (!isArray(rolePermissions)) throw new Error('Permissions must be an array');
	if (!isArray(configs)) throw new Error('Configs must be an array');

	const admin = await User.findOne({ where: { id: user_id } });
	if (!admin) throw new Error('User not found');

	if (!admin.otp_enabled) {
		throw new Error('OTP is not enabled');
	} else {
		if (!otp_code) {
			throw new Error(INVALID_OTP_CODE);
		}
		try {
			const validOtp = await verifyOtpBeforeAction(user_id, otp_code);
			if (!validOtp) {
				throw new Error(INVALID_OTP_CODE);
			}
		} catch (error) {
			throw new Error(INVALID_OTP_CODE);
		}
	}
	
	const validationGroups = {
		route: [],
		config: [],
		secret: []
	};

	const permissionsToStore = [];
	const configsToStore = [];

	// Categorize and validate permissions
	rolePermissions.forEach(permission => {
		if (typeof permission !== 'string') {
			throw new Error(`Invalid permission type: ${permission}`);
		}

		// Extract the base permission without prefix
		let basePermission, permissionType;

		if (permission.startsWith('route:')) {
			const withoutPrefix = permission.replace('route:', '');
			const lastDotIndex = withoutPrefix.lastIndexOf('.');

			if (lastDotIndex === -1) {
				throw new Error(`Invalid route permission format: ${permission}`);
			}

			const path = withoutPrefix.substring(0, lastDotIndex);
			const method = withoutPrefix.substring(lastDotIndex + 1);

			basePermission = `/admin/${path.replace(/\./g, '/')}:${method}`;
			permissionType = 'route';
		}
		else {
			throw new Error(`Invalid permission prefix: ${permission}. Must start with route:, config:, or secret:`);
		}

		// Add to validation group
		validationGroups[permissionType].push(basePermission);
		// Add to storage array (without prefix)
		permissionsToStore.push(basePermission);
	});

	configs.forEach(permission => {
		if (typeof permission !== 'string') {
			throw new Error(`Invalid permission type: ${permission}`);
		}

		// Extract the base permission without prefix
		let basePermission, permissionType;

		if (permission.startsWith('config:')) {
			basePermission = permission.replace('config:', '');
			permissionType = 'config';
		}
		else if (permission.startsWith('secret:')) {
			basePermission = permission.replace('secret:', '');
			permissionType = 'secret';
		}
		else {
			throw new Error(`Invalid permission prefix: ${permission}. Must start with route:, config:, or secret:`);
		}

		// Add to validation group
		validationGroups[permissionType].push(basePermission);
		// Add to storage array (without prefix)
		configsToStore.push(basePermission);
	});

	// Validate each permission type
	try {
		if (validationGroups.route.length > 0) {
			validateRoutePermissions(validationGroups.route);
		}

		if (validationGroups.config.length > 0) {
			validateConfigPermissions(validationGroups.config);
		}

		if (validationGroups.secret.length > 0) {
			validateSecretPermissions(validationGroups.secret);
		}
	} catch (error) {
		throw new Error(`Permission validation failed: ${error.message}`);
	}


	return Role.create({
		role_name: name.toLowerCase().replace(/\s+/g, ''),
		description,
		permissions: permissionsToStore,
		configs: configsToStore,
		color, restrictions
	});
};

const updateExchangeUserRole = async (roleId, { description, rolePermissions, configs, user_id, otp_code, color, restrictions }) => {
	
	const exchangeInfo = getKitConfig().info;

	if (exchangeInfo.plan !== 'fiat')
		throw new Error('Exchange plan does not support this feature');

	const Role = getModel('role');
	const User = getModel('user');

	const role = await Role.findOne({
		where: { id: roleId },
		attributes: ['id', 'description', 'permissions', 'configs'],
	});

	if (!role) {
		throw new Error('Role not found');
	}

	if (role.role_name === 'admin') {
		throw new Error('Admin role cannot be updated');
	}

	
	const admin = await User.findOne({ where: { id: user_id } });
	if (!admin) throw new Error('User not found');

	if (!admin.otp_enabled) {
		throw new Error('OTP is not enabled');
	} else {
		if (!otp_code) {
			throw new Error(INVALID_OTP_CODE);
		}
		try {
			const validOtp = await verifyOtpBeforeAction(user_id, otp_code);
			if (!validOtp) {
				throw new Error(INVALID_OTP_CODE);
			}
		} catch (error) {
			throw new Error(INVALID_OTP_CODE);
		}
	}

	const updates = {};
	if (description !== undefined && description !== role.description) {
		updates.description = description;
	}
	if (color !== undefined && color !== role.color) {
		updates.color = color;
	}
	if (restrictions !== undefined && restrictions !== role.restrictions) {
		updates.restrictions = restrictions;
	}

	if (rolePermissions !== undefined) {
		if (!isArray(rolePermissions)) {
			throw new Error('Permissions must be an array');
		}
		if (!isArray(configs)) {
			throw new Error('Configs must be an array');
		}

		const validationGroups = {
			route: [],
			config: [],
			secret: []
		};

		const permissionsToStore = [];
		const configsToStore = [];

		rolePermissions.forEach(permission => {
			if (typeof permission !== 'string') {
				throw new Error(`Invalid permission type: ${permission}`);
			}

			let basePermission, permissionType;

			if (permission.startsWith('route:')) {
				const withoutPrefix = permission.replace('route:', '');
				const lastDotIndex = withoutPrefix.lastIndexOf('.');

				if (lastDotIndex === -1) {
					throw new Error(`Invalid route permission format: ${permission}`);
				}

				const path = withoutPrefix.substring(0, lastDotIndex);
				const method = withoutPrefix.substring(lastDotIndex + 1);

				basePermission = `/admin/${path.replace(/\./g, '/')}:${method}`;
				permissionType = 'route';
			}
			else {
				throw new Error(`Invalid permission prefix: ${permission}. Must start with route:, config:, or secret:`);
			}

			validationGroups[permissionType].push(basePermission);
			permissionsToStore.push(basePermission);
		});

		configs.forEach(permission => {
			if (typeof permission !== 'string') {
				throw new Error(`Invalid permission type: ${permission}`);
			}

			let basePermission, permissionType;

			if (permission.startsWith('config:')) {
				basePermission = permission.replace('config:', '');
				permissionType = 'config';
			}
			else if (permission.startsWith('secret:')) {
				basePermission = permission.replace('secret:', '');
				permissionType = 'secret';
			}
			else {
				throw new Error(`Invalid permission prefix: ${permission}. Must start with route:, config:, or secret:`);
			}

			validationGroups[permissionType].push(basePermission);
			configsToStore.push(basePermission);
		});

		try {
			if (validationGroups.route.length > 0) {
				validateRoutePermissions(validationGroups.route);
			}
			if (validationGroups.config.length > 0) {
				validateConfigPermissions(validationGroups.config);
			}
			if (validationGroups.secret.length > 0) {
				validateSecretPermissions(validationGroups.secret);
			}
		} catch (error) {
			throw new Error(`Permission validation failed: ${error.message}`);
		}

		const currentPermissions = role.permissions || [];
		const permissionsChanged = (
			currentPermissions.length !== permissionsToStore.length ||
			!currentPermissions.every(p => permissionsToStore.includes(p))
		);

		if (permissionsChanged) {
			updates.permissions = permissionsToStore;
		}

		const currentConfigs = role.configs || [];
		const configsChanged = (
			currentConfigs.length !== configsToStore.length ||
			!currentConfigs.every(p => configsToStore.includes(p))
		);

		if (configsChanged) {
			updates.configs = configsToStore;
		}
	}

	if (Object.keys(updates).length > 0) {
		const [affectedRows] = await Role.update(updates, {
			where: { id: roleId }
		});

		if (affectedRows === 0) {
			throw new Error('Update failed - no rows affected');
		}
	}

	const updatedRole = await Role.findByPk(roleId);
	return updatedRole;
};

const deleteExchangeUserRole = async (id, user_id, otp_code) => {

	const exchangeInfo = getKitConfig().info;

	if (exchangeInfo.plan !== 'fiat')
		throw new Error('Exchange plan does not support this feature');
	
	const Role = getModel('role');
	const User = getModel('user');

	const role = await Role.findOne({
		where: { id },
	});

	if (!role) {
		throw new Error('Role not found');
	}

	if (role.role_name === 'admin') {
		throw new Error('Cannot delete admin role');
	}

	const admin = await User.findOne({ where: { id: user_id } });
	if (!admin) throw new Error('User not found');

	if (!admin.otp_enabled) {
		throw new Error('OTP is not enabled');
	} else {
		if (!otp_code) {
			throw new Error(INVALID_OTP_CODE);
		}
		try {
			const validOtp = await verifyOtpBeforeAction(user_id, otp_code);
			if (!validOtp) {
				throw new Error(INVALID_OTP_CODE);
			}
		} catch (error) {
			throw new Error(INVALID_OTP_CODE);
		}
	}

	const usersWithRole = await User.count({ where: { role: role.role_name } });
	if (usersWithRole > 0) {
		throw new Error('Cannot delete role: it is assigned to one or more users');
	}

	await role.destroy();
	return { message: 'Role deleted successfully' };
};


module.exports = {
	loginUser,
	getUserTier,
	createUser,
	getUserByEmail,
	getUserByKitId,
	getUserByNetworkId,
	freezeUserById,
	freezeUserByEmail,
	unfreezeUserById,
	unfreezeUserByEmail,
	getAllUsers,
	getUserRole,
	updateUserSettings,
	omitUserFields,
	registerUserLogin,
	getAllUsersAdmin,
	updateUserRole,
	updateUserNote,
	updateUserDiscount,
	changeUserVerificationLevelById,
	deactivateUserOtpById,
	toggleFlaggedUserById,
	getUserLogins,
	getUserAudits,
	setUsernameById,
	getAffiliationCount,
	getUserReferer,
	isValidUsername,
	createUserCryptoAddressByKitId,
	createAudit,
	createAuditLog,
	getUserStatsByKitId,
	disableUserWithdrawal,
	getExchangeOperators,
	createUserOnNetwork,
	getUserNetwork,
	getUsersNetwork,
	createUserCryptoAddressByNetworkId,
	getUserStatsByNetworkId,
	checkAffiliation,
	verifyUserEmailByKitId,
	generateAffiliationCode,
	updateUserMeta,
	mapNetworkIdToKitId,
	mapKitIdToNetworkId,
	updateUserInfo,
	updateLoginAttempt,
	getExchangeUserSessions,
	revokeExchangeUserSession,
	updateLoginStatus,
	findUserLatestLogin,
	createUserLogin,
	getAllBalancesAdmin,
	deleteKitUser,
	restoreKitUser,
	getUserBalanceHistory,
	fetchUserProfitLossInfo,
	revokeAllUserSessions,
	changeKitUserEmail,
	storeVerificationCode,
	signUpUser,
	verifyUser,
	getAllAffiliations,
	applyEarningRate,
	addAmounts,
	settleFees,
	getUnrealizedReferral,
	getRealizedReferral,
	fetchUserReferrals,
	createUnrealizedReferralFees,
	getUserReferralCodes,
	createUserReferralCode,
	fetchUserTradingVolume,
	updateUserAddresses,
	fetchUserAddressBook,
	getPaymentDetails,
	createPaymentDetail,
	updatePaymentDetail,
	deletePaymentDetail,
	fetchUserAutoTrades,
	createUserAutoTrade,
	updateUserAutoTrade,
	deleteUserAutoTrade,
	getAnnouncements,
	createAnnouncement,
	deleteAnnouncement,
	updateAnnouncement,
	confirmUserLogin,
	findUserLastLogins,
	freezeUserByCode,
	createSuspiciousLogin,
	getExchangeUserRoles,
	createExchangeUserRole,
	updateExchangeUserRole,
	deleteExchangeUserRole
};
