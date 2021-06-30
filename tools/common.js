'use strict';

const { SERVER_PATH } = require('../constants');
const dbQuery = require('./database/query');
const {
	SECRET_MASK,
	KIT_CONFIG_KEYS,
	KIT_SECRETS_KEYS,
	COMMUNICATOR_AUTHORIZED_KIT_CONFIG,
	ROLES,
	CONFIGURATION_CHANNEL,
	INIT_CHANNEL,
	SEND_CONTACT_US_EMAIL,
	GET_COINS,
	GET_PAIRS,
	GET_TIERS,
	GET_KIT_CONFIG,
	GET_KIT_SECRETS,
	GET_FROZEN_USERS,
	HOLLAEX_NETWORK_ENDPOINT,
	HOLLAEX_NETWORK_BASE_URL,
	USER_META_KEYS,
	VALID_USER_META_TYPES,
	DOMAIN
} = require(`${SERVER_PATH}/constants`);
const {
	COMMUNICATOR_CANNOT_UPDATE,
	MASK_VALUE_GIVEN,
	SUPPORT_DISABLED,
	NO_NEW_DATA
} = require(`${SERVER_PATH}/messages`);
const { each, difference, isPlainObject, isString, pick, isNil, omit } = require('lodash');
const { publisher } = require('./database/redis');
const { sendEmail: sendSmtpEmail } = require(`${SERVER_PATH}/mail`);
const { sendSMTPEmail: nodemailerEmail } = require(`${SERVER_PATH}/mail/utils`);
const { errorMessageConverter: handleCatchError } = require(`${SERVER_PATH}/utils/conversion`);
const { TemplateEmail } = require(`${SERVER_PATH}/mail/templates/helpers/common`);
const { MAILTYPE } = require(`${SERVER_PATH}/mail/strings`);
const { reject, resolve } = require('bluebird');
const flatten = require('flat');
const { getNodeLib } = require(`${SERVER_PATH}/init`);
const rp = require('request-promise');
const { isEmail: isValidEmail } = require('validator');
const moment = require('moment');

/**
 * Checks if url given is a valid url.
 * @param {string} url - Ids of frozen users.
 * @returns {boolean} True if url is valid. False if not.
 */
const isUrl = (url) => {
	const pattern = /^(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)$/;
	return pattern.test(url);
};

const subscribedToCoin = (coin) => {
	return getKitCoins().includes(coin);
};

const subscribedToPair = (pair) => {
	return getKitPairs().includes(pair);
};

const getKitTiers = () => {
	return GET_TIERS();
};

const getKitTier = (tier) => {
	return GET_TIERS()[tier];
};

const isValidTierLevel = (level) => {
	const levels = Object.keys(getKitTiers()).map((tier) => parseInt(tier));
	if (!levels.includes(level)) {
		return false;
	} else {
		return true;
	}
};

const getTierLevels = () => {
	return Object.keys(getKitTiers());
};

const getKitConfig = () => {
	return GET_KIT_CONFIG();
};

const getKitSecrets = () => {
	return GET_KIT_SECRETS();
};

const getKitCoin = (coin) => {
	return getKitCoinsConfig()[coin];
};

const getKitCoinsConfig = () => {
	return GET_COINS();
};

const getKitCoins = () => {
	return Object.keys(getKitCoinsConfig());
};

const getKitPair = (pair) => {
	return getKitPairsConfig()[pair];
};

const getKitPairsConfig = () => {
	return GET_PAIRS();
};

const getKitPairs = () => {
	return Object.keys(getKitPairsConfig());
};

const getFrozenUsers = () => {
	return GET_FROZEN_USERS();
};

const maskSecrets = (secrets) => {
	each(secrets, (secret, secretKey) => {
		if (secretKey === 'captcha') {
			secret.secret_key = SECRET_MASK;
		} else if (secretKey === 'smtp') {
			secret.password = SECRET_MASK;
		}
	});
	return secrets;
};

const updateKitConfigSecrets = (data = {}, scopes) => {
	let role = 'admin';

	if (!data.kit && !data.secrets) {
		return reject(new Error(NO_NEW_DATA));
	}

	if (scopes.indexOf(ROLES.COMMUNICATOR) > -1) {
		role = 'communicator';

		if (data.secrets) {
			return reject(new Error('Communicator operators cannot update secrets values'));
		}

		let unauthorizedKeys = [];
		if (data.kit) {
			unauthorizedKeys = unauthorizedKeys.concat(difference(Object.keys(data.kit), COMMUNICATOR_AUTHORIZED_KIT_CONFIG));
		}
		if (unauthorizedKeys.length > 0) {
			return reject(new Error(COMMUNICATOR_CANNOT_UPDATE(unauthorizedKeys)));
		}
	}

	return dbQuery.findOne('status', {
		attributes: ['id', 'kit', 'secrets']
	})
		.then((status) => {
			const updatedKitConfig = {};
			if (data.kit && Object.keys(data.kit).length > 0) {
				updatedKitConfig.kit = joinKitConfig(status.dataValues.kit, data.kit, role);
			}
			if (data.secrets && Object.keys(data.secrets).length > 0) {
				updatedKitConfig.secrets = joinKitSecrets(status.dataValues.secrets, data.secrets, role);
			}
			return status.update(updatedKitConfig, {
				fields: [
					'kit',
					'secrets'
				],
				returning: true
			});
		})
		.then((status) => {
			const info = getKitConfig().info;
			publisher.publish(
				CONFIGURATION_CHANNEL,
				JSON.stringify({
					type: 'update', data: { kit: status.dataValues.kit, secrets: status.dataValues.secrets }
				})
			);
			return {
				kit: { ...status.dataValues.kit, info },
				secrets: maskSecrets(status.dataValues.secrets)
			};
		});
};

const updateKitConfig = (kit, scopes) => {
	return updateKitConfigSecrets({ kit }, scopes);
};

const updateKitSecrets = (secrets, scopes) => {
	return updateKitConfigSecrets({ secrets }, scopes);
};

const joinKitConfig = (existingKitConfig = {}, newKitConfig = {}) => {
	const newKeys = difference(Object.keys(newKitConfig), KIT_CONFIG_KEYS);
	if (newKeys.length > 0) {
		throw new Error(`Invalid kit keys given: ${newKeys}`);
	}

	if (newKitConfig.user_meta) {
		for (let metaKey in newKitConfig.user_meta) {
			const isValid = kitUserMetaFieldIsValid(metaKey, newKitConfig.user_meta[metaKey]);

			if (!isValid.success) {
				throw new Error(isValid.message);
			}

			newKitConfig.user_meta[metaKey] = pick(
				newKitConfig.user_meta[metaKey],
				...USER_META_KEYS
			);
		}
	}

	const joinedKitConfig = {};

	KIT_CONFIG_KEYS.forEach((key) => {
		if (newKitConfig[key] === undefined) {
			joinedKitConfig[key] = existingKitConfig[key];
		} else {
			if (
				key === 'strings'
				|| key === 'icons'
				|| key === 'meta'
				|| key === 'color'
				|| key === 'injected_values'
				|| key === 'injected_html'
			) {
				joinedKitConfig[key] = newKitConfig[key];
			} else if (isPlainObject(existingKitConfig[key])) {
				joinedKitConfig[key] = { ...existingKitConfig[key], ...newKitConfig[key] };
			} else {
				joinedKitConfig[key] = newKitConfig[key];
			}
		}
	});

	return joinedKitConfig;
};

const joinKitSecrets = (existingKitSecrets = {}, newKitSecrets = {}) => {
	const newKeys = difference(Object.keys(newKitSecrets), KIT_SECRETS_KEYS);
	if (newKeys.length > 0) {
		throw new Error(`Invalid secret keys given: ${newKeys}`);
	}

	const flattenedNewKitSecrets = flatten(newKitSecrets);
	if (Object.values(flattenedNewKitSecrets).includes(SECRET_MASK)) {
		throw new Error(MASK_VALUE_GIVEN);
	}

	const joinedKitSecrets = {};

	KIT_SECRETS_KEYS.forEach((key) => {
		if (newKitSecrets[key]) {
			if (isPlainObject(existingKitSecrets[key])) {
				joinedKitSecrets[key] = { ...existingKitSecrets[key], ...newKitSecrets[key] };
			} else {
				joinedKitSecrets[key] = newKitSecrets[key];
			}
		} else {
			joinedKitSecrets[key] = existingKitSecrets[key];
		}
	});
	return joinedKitSecrets;
};

const sendEmailToSupport = (email, category, subject, description) => {
	if (!SEND_CONTACT_US_EMAIL) {
		return reject(new Error(SUPPORT_DISABLED));
	}

	const emailData = {
		email,
		category,
		subject,
		description
	};
	sendSmtpEmail(MAILTYPE.CONTACT_FORM, email, emailData, {});
	return resolve();
};

const getNetworkKeySecret = () => {
	return dbQuery.findOne('status')
		.then((status) => {
			return {
				apiKey: status.api_key,
				apiSecret: status.api_secret
			};
		});
};

const setExchangeInitialized = () => {
	return dbQuery.findOne('status')
		.then((status) => {
			if (status.dataValues.initialized === true) {
				throw new Error('Exchange already initialized');
			}
			return status.update({ initialized: true }, { returning: true, fields: ['initialized'] });
		})
		.then((status) => {
			publisher.publish(
				CONFIGURATION_CHANNEL,
				JSON.stringify({
					type: 'update', data: { info: { initialized: status.initialized } }
				})
			);
			return;
		});
};

const setExchangeSetupCompleted = () => {
	return dbQuery.findOne('status')
		.then((status) => {
			if (status.dataValues.kit.setup_completed) {
				throw new Error('Exchange setup is already flagged as completed');
			}
			const kit = {
				...status.dataValues.kit,
				setup_completed: true
			};
			return status.update({
				kit
			}, { returning: true, fields: ['kit'] });
		})
		.then((status) => {
			publisher.publish(
				CONFIGURATION_CHANNEL,
				JSON.stringify({
					type: 'update', data: { kit: status.kit }
				})
			);
			return;
		});
};

const updateNetworkKeySecret = (apiKey, apiSecret) => {
	if (!apiKey || !apiSecret) {
		return reject(new Error('Must provide both key and secret'));
	}

	return dbQuery.findOne('status')
		.then((status) => {
			return status.update({
				api_key: apiKey,
				api_secret: apiSecret
			}, { fields: ['api_key', 'api_secret'] });
		})
		.then(() => {
			publisher.publish(
				INIT_CHANNEL,
				JSON.stringify({ type: 'refreshInit' })
			);
			return;
		});
};

const getAssetsPrices = (assets = [], quote, amount) => {
	for (let asset of assets) {
		if (!subscribedToCoin(asset)) {
			return reject(new Error('Invalid asset'));
		}
	}

	if (amount <= 0) {
		return reject(new Error('Amount must be greater than 0'));
	}

	return getNodeLib().getOraclePrices(assets, { quote, amount });
};

const storeImageOnNetwork = async (image, name) => {
	if (image.mimetype.indexOf('image/') !== 0) {
		return reject(new Error('Invalid file type'));
	}

	const { apiKey } = await getNetworkKeySecret();
	const exchangeId = getNodeLib().exchange_id;
	const exchangeName = getKitConfig().info.name;

	const options = {
		method: 'POST',
		uri: `${HOLLAEX_NETWORK_ENDPOINT}${HOLLAEX_NETWORK_BASE_URL}/exchange/icon`,
		formData: {
			exchange_id: exchangeId,
			exchange_name: exchangeName,
			file_name: name,
			file: {
				value: image.buffer,
				options: {
					filename: image.originalname
				}
			}
		},
		headers: {
			'api-key': apiKey,
			'Content-Type': 'multipart/form-data'
		}
	};

	return rp(options)
		.then(JSON.parse);
};

const getPublicTrades = (symbol) => {
	return getNodeLib().getPublicTrades({ symbol });
};

const getOrderbook = (symbol) => {
	return getNodeLib().getOrderbook(symbol);
};

const getOrderbooks = () => {
	return getNodeLib().getOrderbooks();
};

const getChart = (from, to, symbol, resolution) => {
	return getNodeLib().getChart(from, to, symbol, resolution);
};

const getCharts = (from, to, resolution) => {
	return getNodeLib().getCharts(from, to, resolution);
};

const getUdfConfig = () => {
	return getNodeLib().getUdfConfig();
};

const getUdfHistory = (from, to, symbol, resolution) => {
	return getNodeLib().getUdfHistory(from, to, symbol, resolution);
};

const getUdfSymbols = (symbol) => {
	return getNodeLib().getUdfSymbols(symbol);
};

const getTicker = (symbol) => {
	return getNodeLib().getTicker(symbol);
};

const getTickers = () => {
	return getNodeLib().getTickers();
};

const getTradesHistory = (
	symbol,
	side,
	limit,
	page,
	orderBy,
	order,
	startDate,
	endDate
) => {
	return getNodeLib().getTradesHistory({
		symbol,
		side,
		limit,
		page,
		orderBy,
		order,
		startDate,
		endDate
	});
};

const sendEmail = (
	type,
	receiver,
	data,
	userSettings = {},
	domain
) => {
	return sendSmtpEmail(MAILTYPE[type], receiver, data, userSettings, domain);
};

const isEmail = (email) => {
	return isValidEmail(email);
};

const sleep = (ms) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

const sendCustomEmail = (to, subject, html, opts = { from: null, cc: null, text: null, bcc: null }) => {
	const { emails } = getKitSecrets();

	const params = {
		from: opts.from ? opts.from : `${getKitConfig().api_name} Support <${emails.sender}>`,
		to: to.split(','),
		subject,
		html
	};

	if (opts.bcc === 'default') {
		params.bcc = emails.send_email_to_support ? [emails.audit] : [];
	} else if (isString(opts.bcc)) {
		params.bcc = opts.bcc.split(',');
	}

	if (opts.cc) {
		params.cc = opts.cc.split(',');
	}

	if (opts.text) {
		params.text = opts.text;
	}

	return nodemailerEmail(params);
};

const emailHtmlBoilerplate = (html) => TemplateEmail({}, html);

const kitUserMetaFieldIsValid = (field, data) => {
	const missingUserMetaKeys = difference(USER_META_KEYS, Object.keys(data));
	if (missingUserMetaKeys.length > 0) {
		return {
			success: false,
			message: `Missing user_meta keys for field ${field}: ${missingUserMetaKeys}`
		};
	}

	if (typeof data.type !== 'string' || !VALID_USER_META_TYPES.includes(data.type)) {
		return {
			success: false,
			message: `Invalid type value given for field ${field}`
		};
	}

	if (typeof data.description !== 'string') {
		return {
			success: false,
			message: `Invalid description value given for field ${field}`
		};
	}

	if (typeof data.required !== 'boolean') {
		return {
			success: false,
			message: `Invalid required value given for field ${field}`
		};
	}

	return { success: true };
};

const addKitUserMeta = async (name, type, description, required = false) => {
	const existingUserMeta = getKitConfig().user_meta;

	if (existingUserMeta[name]) {
		throw new Error(`User meta field ${name} already exists`);
	}

	const data = {
		type,
		required,
		description
	};

	const validCheck = kitUserMetaFieldIsValid(name, data);

	if (!validCheck.success) {
		throw new Error(validCheck.message);
	}

	const status = await dbQuery.findOne('status', {
		attributes: ['id', 'kit']
	});

	const updatedUserMeta = {
		...existingUserMeta,
		[name]: data
	};

	const updatedStatus = await status.update({
		kit: {
			...status.kit,
			user_meta: updatedUserMeta
		}
	});

	publisher.publish(
		CONFIGURATION_CHANNEL,
		JSON.stringify({
			type: 'update', data: { kit: updatedStatus.kit }
		})
	);

	return updatedStatus.kit.user_meta;
};

const updateKitUserMeta = async (name, data = {
	type: null,
	description: null,
	required: null
}) => {
	const existingUserMeta = getKitConfig().user_meta;

	if (!existingUserMeta[name]) {
		throw new Error(`User meta field ${name} does not exist`);
	}

	if (isNil(data.type) && isNil(data.description) && isNil(data.required)) {
		throw new Error('Must give a value to update');
	}

	const updatedField = {
		type: isNil(data.type) ? existingUserMeta[name].type : data.type,
		description: isNil(data.description) ? existingUserMeta[name].description : data.description,
		required: isNil(data.required) ? existingUserMeta[name].required : data.required
	};

	const validCheck = kitUserMetaFieldIsValid(name, updatedField);

	if (!validCheck.success) {
		throw new Error(validCheck.message);
	}

	const status = await dbQuery.findOne('status', {
		attributes: ['id', 'kit']
	});

	const updatedUserMeta = {
		...existingUserMeta,
		[name]: updatedField
	};

	const updatedStatus = await status.update({
		kit: {
			...status.kit,
			user_meta: updatedUserMeta
		}
	});

	publisher.publish(
		CONFIGURATION_CHANNEL,
		JSON.stringify({
			type: 'update', data: { kit: updatedStatus.kit }
		})
	);

	return updatedStatus.kit.user_meta;
};

const deleteKitUserMeta = async (name) => {
	const existingUserMeta = getKitConfig().user_meta;

	if (!existingUserMeta[name]) {
		throw new Error(`User meta field ${name} does not exist`);
	}

	const status = await dbQuery.findOne('status', {
		attributes: ['id', 'kit']
	});

	const updatedUserMeta = omit(existingUserMeta, name);

	const updatedStatus = await status.update({
		kit: {
			...status.kit,
			user_meta: updatedUserMeta
		}
	});

	publisher.publish(
		CONFIGURATION_CHANNEL,
		JSON.stringify({
			type: 'update', data: { kit: updatedStatus.kit }
		})
	);

	return updatedStatus.kit.user_meta;
};

const stringIsDate = (date) => {
	return (typeof date === 'string' && new Date(date) !== 'Invalid Date') && !isNaN(new Date(date));
};

const isDatetime = (date, formats = [ moment.ISO_8601 ]) => {
	return moment(date, formats, true).isValid();
};

const errorMessageConverter = (err) => {
	return handleCatchError(err);
};

const getDomain = () => {
	return DOMAIN;
};

module.exports = {
	isUrl,
	getKitConfig,
	getKitSecrets,
	subscribedToCoin,
	getKitTier,
	getKitTiers,
	getKitCoin,
	getKitCoins,
	getKitCoinsConfig,
	subscribedToPair,
	getKitPair,
	getFrozenUsers,
	getKitPairs,
	getKitPairsConfig,
	maskSecrets,
	updateKitConfig,
	updateKitSecrets,
	updateKitConfigSecrets,
	sendEmailToSupport,
	getNetworkKeySecret,
	setExchangeInitialized,
	setExchangeSetupCompleted,
	updateNetworkKeySecret,
	isValidTierLevel,
	getTierLevels,
	getAssetsPrices,
	storeImageOnNetwork,
	getPublicTrades,
	getOrderbook,
	getOrderbooks,
	getChart,
	getCharts,
	getUdfConfig,
	getUdfHistory,
	getUdfSymbols,
	getTicker,
	getTickers,
	getTradesHistory,
	sendEmail,
	isEmail,
	sleep,
	sendCustomEmail,
	addKitUserMeta,
	updateKitUserMeta,
	deleteKitUserMeta,
	kitUserMetaFieldIsValid,
	stringIsDate,
	errorMessageConverter,
	getDomain,
	isDatetime,
	emailHtmlBoilerplate
};
