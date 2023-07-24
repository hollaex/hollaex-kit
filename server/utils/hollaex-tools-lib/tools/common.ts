import dbQuery from './database/query';
import {
  SECRET_MASK,
  KIT_CONFIG_KEYS,
  KIT_SECRETS_KEYS,
  COMMUNICATOR_AUTHORIZED_KIT_CONFIG,
  ROLES,
  CONFIGURATION_CHANNEL,
  INIT_CHANNEL,
  SEND_CONTACT_US_EMAIL,
  GET_EMAIL,
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
  DOMAIN,
  DEFAULT_FEES,
} from '../../../constants';

import {
  COMMUNICATOR_CANNOT_UPDATE,
  MASK_VALUE_GIVEN,
  SUPPORT_DISABLED,
  NO_NEW_DATA,
} from '../../../messages';

import {
  each,
  difference,
  isPlainObject,
  isString,
  pick,
  isNil,
  omit,
} from 'lodash';

import { publisher } from './database/redis';
import { sendEmail as sendSmtpEmail } from '../../../mail';
import { sendSMTPEmail as nodemailerEmail } from '../../../mail/utils';
import {
  errorMessageConverter as handleCatchError,
} from '../../../utils/conversion';

import { TemplateEmail } from '../../../mail/templates/helpers/common';
import { MAILTYPE } from '../../../mail/strings';
import { reject, resolve } from 'bluebird';
import flatten from 'flat';
import {
  checkStatus as checkExchangeStatus,
  getNodeLib,
} from '../../../init';

import rp from 'request-promise';
import isValidEmail from 'validator/lib/isEmail';
import moment from 'moment';

import { GET_BROKER, GET_QUICKTRADE, GET_NETWORK_QUICKTRADE } from '../../../constants';

import BigNumber from 'bignumber.js';


export const getKitVersion = () => {
	return dbQuery.findOne('status', {
		raw: true,
		attributes: ['id', 'kit_version']
	})
		.then(({ kit_version }) => kit_version);
};

/**
 * Checks if url given is a valid url.
 * @param {string} url - Ids of frozen users.
 * @returns {boolean} True if url is valid. False if not.
 */
export const isUrl = (url) => {
	const pattern = /^(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)$/;
	return pattern.test(url);
};

export const subscribedToCoin = (coin) => {
	return getKitCoins().includes(coin);
};

export const subscribedToPair = (pair) => {
	return getKitPairs().includes(pair);
};

export const getKitTiers = () => {
	return GET_TIERS();
};

export const getKitTier = (tier) => {
	return GET_TIERS()[tier];
};

export const isValidTierLevel = (level) => {
	const levels = Object.keys(getKitTiers()).map((tier) => parseInt(tier));
	if (!levels.includes(level)) {
		return false;
	} else {
		return true;
	}
};

export const getTierLevels = () => {
	return Object.keys(getKitTiers());
};

export const getKitConfig = () => {
	return GET_KIT_CONFIG();
};

export const getKitSecrets = () => {
	return GET_KIT_SECRETS();
};

export const getKitCoin = (coin) => {
	return getKitCoinsConfig()[coin];
};

export const getKitCoinsConfig = () => {
	return GET_COINS();
};

export const getKitCoins = () => {
	return Object.keys(getKitCoinsConfig());
};

export const getEmail = () => {
	return GET_EMAIL();
};

export const updateEmail = async (data) => {
	const status = await dbQuery.findOne('status', {
		attributes: ['id', 'email']
	});
	const updatedStatus = await status.update({
		email: data.email
	});

	publisher.publish(
		CONFIGURATION_CHANNEL,
		JSON.stringify({
			type: 'update', data: { email: updatedStatus.email }
		})
	);
	return updatedStatus.email;
};


export const getKitPair = (pair) => {
	return getKitPairsConfig()[pair];
};

export const getKitPairsConfig = () => {
	return GET_PAIRS();
};

export const getKitPairs = () => {
	return Object.keys(getKitPairsConfig());
};

export const getFrozenUsers = () => {
	return GET_FROZEN_USERS();
};

export const maskSecrets = (secrets) => {
	each(secrets, (secret, secretKey) => {
		if (secretKey === 'captcha') {
			secret.secret_key = SECRET_MASK;
		} else if (secretKey === 'smtp') {
			secret.password = SECRET_MASK;
		}
	});
	return secrets;
};

export const updateKitConfigSecrets = (data: any = {}, scopes) => {
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
			const updatedKitConfig: any = {};
			if (data.kit && Object.keys(data.kit).length > 0) {
				updatedKitConfig.kit = joinKitConfig(status.dataValues.kit, data.kit);
			}
			if (data.secrets && Object.keys(data.secrets).length > 0) {
				updatedKitConfig.secrets = joinKitSecrets(status.dataValues.secrets, data.secrets);
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

export const updateKitConfig = (kit, scopes) => {
	return updateKitConfigSecrets({ kit }, scopes);
};

export const updateKitSecrets = (secrets, scopes) => {
	return updateKitConfigSecrets({ secrets }, scopes);
};

export const joinKitConfig = (existingKitConfig: any = {}, newKitConfig: any = {}) => {
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
				|| key === 'onramp'
				|| key === 'offramp'
				|| key === 'user_payments'
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

export const joinKitSecrets = (existingKitSecrets = {}, newKitSecrets = {}) => {
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

export const sendEmailToSupport = (email, category, subject, description) => {
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

export const getNetworkKeySecret = () => {
	return dbQuery.findOne('status', {
		raw: true,
		attributes: ['id', 'api_key', 'api_secret']
	})
		.then((status) => {
			return {
				apiKey: status.api_key,
				apiSecret: status.api_secret
			};
		});
};

export const setExchangeInitialized = () => {
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

export const setExchangeSetupCompleted = () => {
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

export const updateNetworkKeySecret = (apiKey, apiSecret) => {
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

export const getAssetsPrices = (assets = [], quote, amount, opts = {
	additionalHeaders: null
}) => {
	for (let asset of assets) {
		if (!subscribedToCoin(asset)) {
			return reject(new Error('Invalid asset'));
		}
	}

	if (amount <= 0) {
		return reject(new Error('Amount must be greater than 0'));
	}

	return getNodeLib().getOraclePrices(assets, { quote, amount, ...opts });
};

export const storeImageOnNetwork = async (image, name, opts = {
	additionalHeaders: null
}) => {

	return getNodeLib().uploadIcon(image, name, opts);
};

export const getPublicTrades = (symbol, opts = {
	additionalHeaders: null
}) => {
	return getNodeLib().getPublicTrades({ symbol, ...opts });
};

export const getOrderbook = (symbol, opts = {
	additionalHeaders: null
}) => {
	return getNodeLib().getOrderbook(symbol, opts);
};

export const getOrderbooks = (opts = {
	additionalHeaders: null
}) => {
	return getNodeLib().getOrderbooks(opts);
};

export const getChart = (from, to, symbol, resolution, opts = {
	additionalHeaders: null
}) => {
	return getNodeLib().getChart(from, to, symbol, resolution, opts);
};

export const getCharts = (from, to, resolution, opts = {
	additionalHeaders: null
}) => {
	return getNodeLib().getCharts(from, to, resolution, opts);
};

export const getUdfConfig = (opts = {
	additionalHeaders: null
}) => {
	return getNodeLib().getUdfConfig(opts);
};

export const getUdfHistory = (from, to, symbol, resolution, opts = {
	additionalHeaders: null
}) => {
	return getNodeLib().getUdfHistory(from, to, symbol, resolution, opts);
};

export const getUdfSymbols = (symbol, opts = {
	additionalHeaders: null
}) => {
	return getNodeLib().getUdfSymbols(symbol, opts);
};

export const getTicker = (symbol, opts = {
	additionalHeaders: null
}) => {
	return getNodeLib().getTicker(symbol, opts);
};

export const getTickers = (opts = {
	additionalHeaders: null
}) => {
	return getNodeLib().getTickers(opts);
};

export const getTradesHistory = (
	symbol,
	side,
	limit,
	page,
	orderBy,
	order,
	startDate,
	endDate,
	opts = {
		additionalHeaders: null
	}
) => {
	return getNodeLib().getTradesHistory({
		symbol,
		side,
		limit,
		page,
		orderBy,
		order,
		startDate,
		endDate,
		...opts
	});
};

export const sendEmail = (
	type,
	receiver,
	data,
	userSettings = {},
	domain
) => {
	return sendSmtpEmail(MAILTYPE[type], receiver, data, userSettings, domain);
};

export const isEmail = (email) => {
	return isValidEmail(email);
};

export const sleep = (ms) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

export const sendCustomEmail = (to, subject, html, opts = { from: null, cc: null, text: null, bcc: null }) => {
	const { emails }: any = getKitSecrets();

	const params: any = {
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

export const emailHtmlBoilerplate = (html) => TemplateEmail({}, html);

export const kitUserMetaFieldIsValid = (field, data) => {
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

export const addKitUserMeta = async (name, type, description, required = false) => {
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

export const updateKitUserMeta = async (name, data = {
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

export const deleteKitUserMeta = async (name) => {
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


export const isDatetime = (date, formats = [moment.ISO_8601]) => {
	return moment(date, formats, true).isValid();
};

export const errorMessageConverter = (err) => {
	return handleCatchError(err);
};

export const getDomain = () => {
	return DOMAIN;
};

// const getCsvParser = (opts = {
// 	model: null,
// 	exclude: null,
// 	objectMode: null
// }) => {
// 	return new Transform(
// 		{},
// 		{
// 			encoding: 'utf-8',
// 			objectMode: opts.objectMode ? true : false
// 		}
// 	);
// };

export const getNetworkConstants = (opts = {
	additionalHeaders: null
}) => {
	return getNodeLib().getConstants(opts);
};

export const getNetworkEndpoint = () => HOLLAEX_NETWORK_ENDPOINT;

export const getDefaultFees = () => {
	const { info: { type, plan } }: any = getKitConfig();
	if (type === 'Enterprise') {
		return {
			maker: 0,
			taker: 0
		};
	} else {
		return DEFAULT_FEES[plan];
	}
};

export const validateIp = (ip) => {
	const regex = /^([0-9]{1,3}\.){3}[0-9]{1,3}($|\/(16|24|32))$/;
	if (!regex.test(ip)) {
		return false;
	}
	return true;
};

export const validatePair = (pair) => {
	const regex = /([a-z]){2,8}-([a-z]{2,8})/;
	if (!regex.test(pair)) {
		return false;
	}
	const [base, quote] = pair.split('-');
	if (base === quote) {
		return false;
	}
	if (!getKitCoin(base) || !getKitCoin(quote)) {
		return false;
	}
	return true;
};

export const getBrokerDeals = () => {
	return GET_BROKER();
};

export const getQuickTrades = () => {
	return GET_QUICKTRADE();
};

export const getNetworkQuickTrades = () => {
	return GET_NETWORK_QUICKTRADE();
}

export const parseNumber = (number, precisionValue) => {
	return BigNumber(number).precision(precisionValue, BigNumber.ROUND_DOWN).toNumber();
}