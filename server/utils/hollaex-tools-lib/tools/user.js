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
	uniq
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
	CANNOT_CHANGE_DELETED_EMAIL,
	SERVICE_NOT_SUPPORTED,
	DEVICE_TOKEN_EXITS,
	DEVICE_TOKEN_NOT_FOUND
} = require(`${SERVER_PATH}/messages`);
const { publisher, client } = require('./database/redis');
const {
	CONFIGURATION_CHANNEL,
	AUDIT_KEYS,
	USER_FIELD_ADMIN_LOG,
	ADDRESS_FIELDS,
	ID_FIELDS,
	SETTING_KEYS,
	OMITTED_USER_FIELDS,
	DEFAULT_ORDER_RISK_PERCENTAGE,
	AFFILIATION_CODE_LENGTH,
	LOGIN_TIME_OUT,
	TOKEN_TIME_LONG,
	TOKEN_TIME_NORMAL,
	VERIFY_STATUS,
	EVENTS_CHANNEL
} = require(`${SERVER_PATH}/constants`);
const { sendEmail } = require(`${SERVER_PATH}/mail`);
const { MAILTYPE } = require(`${SERVER_PATH}/mail/strings`);
const { getKitConfig, isValidTierLevel, getKitTier, isDatetime } = require('./common');
const { isValidPassword, createSession } = require('./security');
const { getNodeLib } = require(`${SERVER_PATH}/init`);
const { all, reject } = require('bluebird');
const { Op } = require('sequelize');
const { paginationQuery, timeframeQuery, orderingQuery } = require('./database/helpers');
const { parse } = require('json2csv');
const flatten = require('flat');
const uuid = require('uuid/v4');
const { checkCaptcha, validatePassword, verifyOtpBeforeAction } = require('./security');
const geoip = require('geoip-lite');
const moment = require('moment');

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
		additionalHeaders: null
	}
) => {
	email = email.toLowerCase();
	return getModel('sequelize').transaction((transaction) => {
		return dbQuery.findOne('user', {
			where: { email }
		})
			.then((user) => {
				if (user) {
					throw new Error(USER_EXISTS);
				}
				const roles = {
					is_admin: false,
					is_supervisor: false,
					is_support: false,
					is_kyc: false,
					is_communicator: false
				};

				if (opts.role !== 'user') {
					const userRole = 'is_' + opts.role.toLowerCase();
					if (roles[userRole] === undefined) {
						throw new Error('Role does not exist');
					}
					each(roles, (value, key) => {
						if (key === userRole) {
							roles[key] = true;
						}
					});
				}

				const options = {
					email,
					password,
					settings: INITIAL_SETTINGS(),
					email_verified: opts.email_verified,
					...roles
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
	const geo = geoip.lookup(ip);
	if (geo?.country) login.country = geo.country;
	return getModel('login').create(login)
		.then((loginData) => {
			if(opts.token && opts.status) {
				return createSession(opts.token, loginData.id, userId, opts.expiry);
			}
			return loginData;
		})
		.catch(err => reject(err));
};

const updateLoginAttempt = (loginId) => {
	return getModel('login').increment('attempt', { by: 1, where: { id: loginId }});
};

const updateLoginStatus = (loginId) => {
	return getModel('login').update( { status: true }, { where: { id: loginId } });
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
	}

	return null;
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

/* Public Endpoints*/



const generateAffiliationCode = () => {
	return randomString({
		length: AFFILIATION_CODE_LENGTH,
		numeric: true,
		letters: true
	}).toUpperCase();
};

const getUserByAffiliationCode = (affiliationCode) => {
	const code = affiliationCode.toUpperCase().trim();
	return dbQuery.findOne('user', {
		where: { affiliation_code: code },
		attributes: ['id', 'email', 'affiliation_code']
	});
};

const checkAffiliation = (affiliationCode, user_id) => {
	// let discount = 0; // default discount rate in percentage
	return getUserByAffiliationCode(affiliationCode)
		.then((referrer) => {
			if (referrer) {
				return getModel('affiliation').create({
					user_id,
					referer_id: referrer.id
				});
			} else {
				return;
			}
		});
	// .then((affiliation) => {
	// 	return getModel('user').update(
	// 		{
	// 			discount
	// 		},
	// 		{
	// 			where: {
	// 				id: affiliation.user_id
	// 			},
	// 			fields: ['discount']
	// 		}
	// 	);
	// });
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
			return email;
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
	pending_verification: null,
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
	const ordering = orderingQuery(opts.order_by, opts.order);
	let query = {
		where: {
			created_at: timeframe,
			...(id != null && { id }),
			...((dob_start_date != null || dob_end_date != null) && { dob: dob_timeframe }),
			...(email_verified != null && { email_verified }),
			...(gender != null && { gender }),
			...(otp_enabled != null && { otp_enabled }),
			[Op.and]: [],
		},
		order: [ordering]
	};
	query.attributes = {
		exclude: ['balance', 'password', 'updated_at']
	};

	if (opts.search) {
		query.attributes = {
			exclude: ['balance', 'password', 'updated_at']
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
		query.attributes = ['id', 'email', 'password', 'full_name', 'gender', 'nationality', 'dob', 'phone_number', 'crypto_wallet', 'verification_level', 'note', 'created_at', 'updated_at', 'is_admin', 'is_supervisor', 'is_support', 'is_kyc', 'is_communicator', 'otp_enabled', 'address', 'bank_account', 'id_data', 'activated', 'settings', 'username', 'flagged', 'affiliation_code', 'affiliation_rate', 'network_id', 'email_verified', 'discount', 'meta'];
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
	if (userId === 1) {
		return reject(new Error(CANNOT_DEACTIVATE_ADMIN));
	}
	return getUserByKitId(userId, false)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			}
			if (!user.activated) {
				throw new Error(USER_ALREADY_DEACTIVATED);
			}
			if (user.is_admin) {
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
			if (user.is_admin) {
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

const updateUserRole = (user_id, role) => {
	if (user_id === 1) {
		return reject(new Error(CANNOT_CHANGE_ADMIN_ROLE));
	}
	return dbQuery.findOne('user', {
		where: {
			id: user_id
		},
		attributes: [
			'id',
			'email',
			'is_admin',
			'is_support',
			'is_supervisor',
			'is_kyc',
			'is_communicator'
		]
	})
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			}
			const roles = pick(
				user.dataValues,
				'is_admin',
				'is_supervisor',
				'is_support',
				'is_kyc',
				'is_communicator'
			);

			const roleChange = 'is_' + role.toLowerCase();

			if (roles[roleChange]) {
				throw new Error(`User already has role ${role}`);
			}

			each(roles, (value, key) => {
				if (key === roleChange) {
					roles[key] = true;
				} else {
					roles[key] = false;
				}
			});

			return all([user, roles]);
		})
		.then(([user, roles]) => {
			return user.update(
				roles,
				{ fields: ['is_admin', 'is_support', 'is_supervisor', 'is_kyc', 'is_communicator'], returning: true }
			);
		})
		.then((user) => {
			const result = pick(
				user,
				'id',
				'email',
				'is_admin',
				'is_support',
				'is_supervisor',
				'is_kyc',
				'is_communicator'
			);
			return result;
		});
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
			popup_order_partially_filled: true
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
			createAuditLog({ email: auditInfo.userEmail, session_id: auditInfo.sessionId }, auditInfo.apiPath, auditInfo.method, note, user.note);
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
	for(const key of data){
		if(!isEqual(oldData[key], newData[key])){
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
		if(typeof value === 'object' && value.constructor === Object) {
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
			const str = Object.keys(data).map((key) =>  '' + key + ':' + data[key].value).join(', ');
			description = `${action} service ${methodDescriptions[method]}${str ? ` with ${str}` : ''}`;
		}
		else if(method === 'put' && prevData) {
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

	if(!['fiat', 'boost', 'enterprise'].includes(exchangeInfo.plan)) {
		throw new Error(SERVICE_NOT_SUPPORTED);
	}

	const pagination = paginationQuery(opts.limit, opts.page);
	const timeframe = timeframeQuery(opts.startDate, opts.endDate);
	const ordering = orderingQuery(opts.orderBy, opts.order);
	let options = {
		where: {
			timestamp: timeframe,
			...(opts.user_id && { user_id: opts.user_id }),
			...(opts.subject && { subject: {
				[Op.like]: `%${opts.subject}%`
			}}),
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
	order: null
}) => {
	const pagination = paginationQuery(opts.limit, opts.page);
	const ordering = orderingQuery(opts.orderBy, opts.order);

	const options = {
		where: {
			[Op.or]: [
				{ is_admin: true },
				{ is_supervisor: true },
				{ is_support: true },
				{ is_kyc: true },
				{ is_communicator: true }
			]
		},
		attributes: ['id', 'email', 'is_admin', 'is_supervisor', 'is_support', 'is_kyc', 'is_communicator'],
		order: [ordering],
		...pagination
	};

	return dbQuery.findAndCountAllWithRows('user', options);
};

const inviteExchangeOperator = (invitingEmail, email, role, opts = {
	additionalHeaders: null
}) => {
	const roles = {
		is_admin: false,
		is_supervisor: false,
		is_support: false,
		is_kyc: false,
		is_communicator: false
	};

	if (!email || !isEmail(email)) {
		return reject(new Error(PROVIDE_VALID_EMAIL));
	}

	role = role.toLowerCase();
	const roleToUpdate = `is_${role}`;

	if (role === 'user') {
		return reject(new Error('Must invite user as an operator role'));
	} else {
		if (roles[roleToUpdate] === undefined) {
			return reject(new Error('Invalid role'));
		} else {
			roles[roleToUpdate] = true;
		}
	}

	const tempPassword = uuid();

	return getModel('sequelize').transaction((transaction) => {
		return getModel('user').findOrCreate({
			defaults: {
				email,
				password: tempPassword,
				...roles,
				settings: INITIAL_SETTINGS()
			},
			where: { email },
			transaction
		})
			.then(async ([user, created]) => {
				if (created) {
					const networkUser = await getNodeLib().createUser(email, opts);
					return all([
						user.update(
							{ network_id: networkUser.id },
							{ returning: true, fields: ['network_id'], transaction }
						),
						created
					]);
				} else {
					if (user.is_admin || user.is_supervisor || user.is_support || user.is_kyc || user.is_communicator) {
						throw new Error('User is already an operator');
					}
					return all([
						user.update({ ...roles }, { returning: true, fields: Object.keys(roles), transaction }),
						created
					]);
				}
			});
	})
		.then(async ([user, created]) => {
			sendEmail(
				MAILTYPE.INVITED_OPERATOR,
				user.email,
				{
					invitingEmail,
					created,
					password: created ? tempPassword : undefined,
					role
				},
				user.settings
			);
			return;
		});
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

	const updateData = { user_id: userId  };

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
		where: { id: sessionId } });


	if(!session) {
		throw new Error(SESSION_NOT_FOUND);
	}

	if(!session.status) {
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

const deleteKitUser = async (userId) => {
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
	await revokeAllUserSessions(userId);
	// we simply add _deleted at the end of users email. This way he won't be able to login anymore and he can create another account.
	const userEmail = user.email;
	const updatedUser = await user.update(
		{ email: userEmail + '_deleted', activated: false },
		{ fields: ['email', 'activated'], returning: true }
	);

	sendEmail(
		MAILTYPE.USER_DELETED,
		userEmail,
		{},
		user.settings
	);
	
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
		]
	});

	if (!user) {
		throw new Error(USER_NOT_FOUND);
	}
	if (user.is_admin) {
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
	createAuditLog({ email: auditInfo.userEmail, session_id: auditInfo.sessionId }, auditInfo.apiPath, auditInfo.method, { user_id: userId, email: userEmail  }, { user_id: userId, email: newEmail });
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

const createUserDeviceToken = async (userId, token, device) => {
	const user = await dbQuery.findOne('user', {
		where: {
			id: userId
		},
		attributes: [
			'id',
			'email'
		]
	});

	if (!user) {
		throw new Error(USER_NOT_FOUND);
	}

	const userToken = await dbQuery.findOne('deviceToken', {
		where: {
			token,
			status: true
		},
	});

	if (userToken) {
		throw new Error(DEVICE_TOKEN_EXITS);
	}

	return getModel('deviceToken').create({
		user_id: userId,
		token,
		device,
	})

}

const getUserDeviceToken = async (userId, device) => {

	const user = await dbQuery.findOne('user', {
		where: {
			id: userId
		},
		attributes: [
			'id',
			'email'
		]
	});

	if (!user) {
		throw new Error(USER_NOT_FOUND);
	}

	const token = await dbQuery.findOne('deviceToken', {
		where: {
			user_id: userId,
			device,
			status: true
		},
	});

	
	if (!token) {
		throw new Error(DEVICE_TOKEN_NOT_FOUND);
	}
	return { token };
}

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
	getExchangeOperators,
	inviteExchangeOperator,
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
	revokeAllUserSessions,
	changeKitUserEmail,
	storeVerificationCode,
	signUpUser,
	verifyUser,
	createUserDeviceToken,
	getUserDeviceToken
};
