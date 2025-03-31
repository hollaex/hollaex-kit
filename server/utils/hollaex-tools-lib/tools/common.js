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
	GET_EMAIL,
	GET_COINS,
	GET_PAIRS,
	GET_TRANSACTION_LIMITS,
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
	MIN_FEES,
	BALANCE_HISTORY_SUPPORTED_PLANS,
	REFERRAL_HISTORY_SUPPORTED_PLANS,
	AUTO_TRADE_SUPPORTED_PLANS
} = require(`${SERVER_PATH}/constants`);
const {
	COMMUNICATOR_CANNOT_UPDATE,
	MASK_VALUE_GIVEN,
	SUPPORT_DISABLED,
	NO_NEW_DATA
} = require(`${SERVER_PATH}/messages`);
const { each, difference, isPlainObject, isString, pick, isNil, omit, isNumber, isInteger, isDate } = require('lodash');
const { publisher } = require('./database/redis');
const { sendEmail: sendSmtpEmail } = require(`${SERVER_PATH}/mail`);
const { sendSMTPEmail: nodemailerEmail } = require(`${SERVER_PATH}/mail/utils`);
const { errorMessageConverter: handleCatchError } = require(`${SERVER_PATH}/utils/conversion`);
const { TemplateEmail } = require(`${SERVER_PATH}/mail/templates/helpers/common`);
const { MAILTYPE } = require(`${SERVER_PATH}/mail/strings`);
const { reject, resolve } = require('bluebird');
const flatten = require('flat');
const { checkStatus: checkExchangeStatus, getNodeLib } = require(`${SERVER_PATH}/init`);
const rp = require('request-promise');
const { isEmail: isValidEmail } = require('validator');
const moment = require('moment');
const { GET_BROKER, GET_QUICKTRADE, GET_NETWORK_QUICKTRADE, GET_TRADEPATHS } = require('../../../constants');
const BigNumber = require('bignumber.js');
// const { Transform } = require('json2csv');

const getKitVersion = () => {
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
const isUrl = (url) => {
	const pattern = /^(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)$/;
	return pattern.test(url);
};

const subscribedToCoin = (coin) => {
	return getKitCoins().includes(coin);
};

const subscribedToPair = (pair) => {
	return (getKitPairs().includes(pair) || getQuickTradePairs().includes(pair));
};

const getKitTiers = () => {
	return GET_TIERS();
};

const getKitTier = (tier) => {
	return GET_TIERS()[tier];
};

const getQuickTradePairs = () => {
	return (getQuickTrades() || []).map(config => config.symbol);
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

const getEmail = () => {
	return GET_EMAIL();
};

const updateEmail = async (data) => {
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

const updateKitConfigSecrets = (data = {}, scopes, auditInfo) => {
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
			const { createAuditLog } = require('./user');
			if (updatedKitConfig?.kit && Object.keys(updatedKitConfig?.kit).length > 0) {
				createAuditLog({ email: auditInfo.userEmail, session_id: auditInfo.sessionId }, auditInfo.apiPath, auditInfo.method, updatedKitConfig.kit, status.dataValues.kit);
			}
			if (updatedKitConfig?.secrets && Object.keys(updatedKitConfig?.secrets).length > 0) {
				createAuditLog({ email: auditInfo.userEmail, session_id: auditInfo.sessionId }, auditInfo.apiPath, auditInfo.method, updatedKitConfig.secrets, status.dataValues.secrets);
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

	if (newKitConfig.coin_customizations) {
		for(let coin of Object.values(newKitConfig.coin_customizations)) {
			if(!coin.hasOwnProperty('fee_markup')) {
				throw new Error('Fee markup key does not exist');
			}

			if (coin.fee_markup < 0) {
				throw new Error('Fee markup cannot be negative');
			}

			if (coin.fee_markup && !isNumber(coin.fee_markup)) {
				throw new Error('Fee markup is not a number');
			}
		}
	}

	if (newKitConfig.fiat_fees) {
		for(let coin of Object.values(newKitConfig.fiat_fees)) {
		
			if (coin.withdrawal_fee && coin.withdrawal_fee < 0) {
				throw new Error('withdrawal fee cannot be negative');
			}

			if (coin.withdrawal_fee && !isNumber(coin.withdrawal_fee)) {
				throw new Error('withdrawal fee is not a number');
			}

			if (coin.deposit_fee && coin.deposit_fee < 0) {
				throw new Error('deposit fee cannot be negative');
			}

			if (coin.deposit_fee && !isNumber(coin.deposit_fee)) {
				throw new Error('deposit fee is not a number');
			}
			
			if (coin.min && coin.min < 0) {
				throw new Error('min amount cannot be negative');
			}

			if (coin.min && !isNumber(coin.min)) {
				throw new Error('min amount is not a number');
			}

			if (coin.max && coin.max < 0) {
				throw new Error('max amount cannot be negative');
			}

			if (coin.max && !isNumber(coin.max)) {
				throw new Error('max amount is not a number');
			}

			if (coin.increment_unit && coin.increment_unit < 0) {
				throw new Error('increment unit cannot be negative');
			}

			if (coin.increment_unit && !isNumber(coin.increment_unit)) {
				throw new Error('increment unit is not a number');
			}
		}
	}

	if (newKitConfig.balance_history_config) {

		const exchangeInfo = getKitConfig().info;

		if (!BALANCE_HISTORY_SUPPORTED_PLANS.includes(exchangeInfo.plan))
			throw new Error('Exchange plan does not support this feature');

		if (!newKitConfig.balance_history_config.hasOwnProperty('currency')) {
			throw new Error('currency does not exist');
		}

		if (existingKitConfig?.balance_history_config?.currency && existingKitConfig?.balance_history_config?.currency !== newKitConfig.balance_history_config.currency) {
			throw new Error('currency cannot be changed');
		}

		if (existingKitConfig?.balance_history_config?.date_enabled && existingKitConfig?.balance_history_config?.date_enabled !== newKitConfig.balance_history_config.date_enabled) {
			throw new Error('date cannot be changed');
		}

		if(!newKitConfig.balance_history_config.hasOwnProperty('active')) {
			throw new Error('active does not exist');
		}

		if(!newKitConfig.balance_history_config.hasOwnProperty('date_enabled')) {
			throw new Error('date enabled does not exist');
		}
	}

	if (newKitConfig.p2p_config) {

		const exchangeInfo = getKitConfig().info;

		if (!BALANCE_HISTORY_SUPPORTED_PLANS.includes(exchangeInfo.plan))
			throw new Error('Exchange plan does not support this feature');

		if (newKitConfig.p2p_config.enable == null) {
			throw new Error('enable cannot be null');
		} 
		if (newKitConfig.p2p_config.bank_payment_methods == null) {
			throw new Error('bank_payment_methods cannot be null');
		} 
		if (newKitConfig.p2p_config.starting_merchant_tier == null) {
			throw new Error('starting_merchant_tier cannot be null');
		} 
		if (newKitConfig.p2p_config.starting_user_tier == null) {
			throw new Error('starting_user_tier cannot be null');
		} 
		if (newKitConfig.p2p_config.digital_currencies == null) {
			throw new Error('digital_currencies cannot be null');
		} 
		if (newKitConfig.p2p_config.fiat_currencies == null) {
			throw new Error('fiat_currencies cannot be null');
		} 
		if (newKitConfig.p2p_config.side == null) {
			throw new Error('side cannot be null');
		} 
		if (newKitConfig.p2p_config.source_account == null) {
			throw new Error('source_account cannot be null');
		} 
		if (newKitConfig.p2p_config.merchant_fee == null) {
			throw new Error('merchant_fee cannot be null');
		} 
		if (newKitConfig.p2p_config.user_fee == null) {
			throw new Error('buyer_fee cannot be null');
		} 

		const percentagePattern = /^(100(\.00?)?|(\d{1,2})(\.\d{1,2})?)$/;

		if (!percentagePattern.test(newKitConfig.p2p_config.merchant_fee)) {
			throw new Error('merchant_fee must be in percentage format');
		}
		if (!percentagePattern.test(newKitConfig.p2p_config.user_fee)) {
			throw new Error('buyer_fee must be in percentage format');
		}
	}

	if (newKitConfig.referral_history_config) {
		const exchangeInfo = getKitConfig().info;

		if (!REFERRAL_HISTORY_SUPPORTED_PLANS.includes(exchangeInfo.plan)) {
			throw new Error('Exchange plan does not support this feature');
		}

		if (!newKitConfig.referral_history_config.hasOwnProperty('active')) {
			throw new Error('active key does not exist');
		}

		if (!newKitConfig.referral_history_config.hasOwnProperty('currency')) {
			throw new Error('currency key does not exist');
		}

		if (existingKitConfig?.referral_history_config?.currency && existingKitConfig?.referral_history_config?.currency !== newKitConfig?.referral_history_config?.currency) {
			throw new Error('currency cannot be changed');
		}

		if (!newKitConfig.referral_history_config.hasOwnProperty('earning_rate')) {
			throw new Error('earning_rate key does not exist');
		}

		if (!newKitConfig.referral_history_config.hasOwnProperty('minimum_amount')) {
			throw new Error('minimum amount key does not exist');
		}
		
		if (!newKitConfig.referral_history_config.hasOwnProperty('earning_period')) {
			throw new Error('earning_period key does not exist');
		}

		if (!newKitConfig.referral_history_config.hasOwnProperty('distributor_id')) {
			throw new Error('distributor_id key does not exist');
		}
	
		if (!existingKitConfig?.referral_history_config?.date_enabled && !newKitConfig.referral_history_config.hasOwnProperty('date_enabled')) {
			newKitConfig.referral_history_config.date_enabled = new Date();
		}

		if (!isNumber( newKitConfig?.referral_history_config?.earning_rate)) {
			throw new Error('Earning rate with data type number required for plugin');
		} else if ( newKitConfig?.referral_history_config?.earning_rate < 1 ||  newKitConfig?.referral_history_config?.earning_rate > 100) {
			throw new Error('Earning rate must be within the range of 1 ~ 100');
		} else if (!isNumber( newKitConfig?.referral_history_config?.minimum_amount)) {
			throw new Error('Minimum amount must be integer');
		} else if ( newKitConfig?.referral_history_config?.minimum_amount < 0 ) {
			throw new Error('Minimum amount must be bigger than 0');
		} else if ( newKitConfig?.referral_history_config?.earning_rate % 10 !== 0) {
			throw new Error('Earning rate must be in increments of 10');
		} else if (!isNumber(newKitConfig?.referral_history_config?.earning_period)) {
			throw new Error('Earning period with data type number required for plugin');
		} else if ((!isInteger(newKitConfig?.referral_history_config?.earning_period) || newKitConfig?.referral_history_config?.earning_period < 0)) {
			throw new Error('Earning period must be an integer greater than 0');
		} else if (!isNumber(newKitConfig?.referral_history_config?.distributor_id)) {
			throw new Error('Distributor ID required for plugin');
		}
	}
	if (newKitConfig.chain_trade_config) {
		const exchangeInfo = getKitConfig().info;

		if (!REFERRAL_HISTORY_SUPPORTED_PLANS.includes(exchangeInfo.plan)) {
			throw new Error('Exchange plan does not support this feature');
		}

		if (!newKitConfig.chain_trade_config.hasOwnProperty('active')) {
			throw new Error('active key does not exist');
		}

		if (!newKitConfig.chain_trade_config.hasOwnProperty('source_account')) {
			throw new Error('source account does not exist');
		}

		if (!newKitConfig.chain_trade_config.hasOwnProperty('currency')) {
			throw new Error('currency does not exist');
		}

		if (!newKitConfig.chain_trade_config.hasOwnProperty('spread')) {
			throw new Error('spread does not exist');
		}
		
	}

	if (newKitConfig.selectable_native_currencies) {

		for (let coin of newKitConfig.selectable_native_currencies) {
			if (!subscribedToCoin(coin)) {
				throw new Error('Invalid coin ' + coin);
			}
		}
	}
	
	if (newKitConfig.auto_trade_config) {
		const exchangeInfo = getKitConfig().info;

		if (!AUTO_TRADE_SUPPORTED_PLANS.includes(exchangeInfo.plan)) {
			throw new Error('Exchange plan does not support this feature');
		}

		if (!newKitConfig.auto_trade_config.hasOwnProperty('active')) {
			throw new Error('active key does not exist');
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

const getAssetsPrices = (assets = [], quote, amount, opts = {
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

const storeImageOnNetwork = async (image, name, opts = {
	additionalHeaders: null
}) => {

	return getNodeLib().uploadIcon(image, name, opts);
};

const getPublicTrades = (symbol, opts = {
	additionalHeaders: null
}) => {
	return getNodeLib().getPublicTrades({ symbol, ...opts });
};

const getOrderbook = (symbol, opts = {
	additionalHeaders: null
}) => {
	return getNodeLib().getOrderbook(symbol, opts);
};

const getOrderbooks = (opts = {
	additionalHeaders: null
}) => {
	return getNodeLib().getOrderbooks(opts);
};

const getChart = (from, to, symbol, resolution, opts = {
	additionalHeaders: null
}) => {
	return getNodeLib().getChart(from, to, symbol, resolution, opts);
};

const getCharts = (from, to, resolution, opts = {
	additionalHeaders: null
}) => {
	return getNodeLib().getCharts(from, to, resolution, opts);
};

const getMiniCharts = (assets, opts = {
	from: null, 
	to: null, 
	quote: null,
	period: null,
	additionalHeaders: null
}) => {
	return getNodeLib().getMiniCharts(assets, opts);
};

const getUdfConfig = (opts = {
	additionalHeaders: null
}) => {
	return getNodeLib().getUdfConfig(opts);
};

const getUdfHistory = (from, to, symbol, resolution, opts = {
	additionalHeaders: null
}) => {
	return getNodeLib().getUdfHistory(from, to, symbol, resolution, opts);
};

const getUdfSymbols = (symbol, opts = {
	additionalHeaders: null
}) => {
	return getNodeLib().getUdfSymbols(symbol, opts);
};

const getTicker = (symbol, opts = {
	additionalHeaders: null
}) => {
	return getNodeLib().getTicker(symbol, opts);
};

const getTickers = (opts = {
	additionalHeaders: null
}) => {
	return getNodeLib().getTickers(opts);
};

const getTradesHistory = (
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
}, auditInfo) => {
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
	const { createAuditLog } = require('./user');
	createAuditLog({ email: auditInfo.userEmail, session_id: auditInfo.sessionId }, auditInfo.apiPath, auditInfo.method, updatedUserMeta, existingUserMeta);
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

const isDatetime = (date, formats = [moment.ISO_8601]) => {
	return moment(date, formats, true).isValid();
};

const errorMessageConverter = (err) => {
	return handleCatchError(err);
};

const getDomain = () => {
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

const getNetworkConstants = (opts = {
	additionalHeaders: null
}) => {
	return getNodeLib().getConstants(opts);
};

const getNetworkEndpoint = () => HOLLAEX_NETWORK_ENDPOINT;

const getMinFees = () => {
	const { info: { plan } } = getKitConfig();
	return MIN_FEES[plan];
};

const validateIp = (ip) => {
	const regex = /^([0-9]{1,3}\.){3}[0-9]{1,3}($|\/(16|24|32))$/;
	if (!regex.test(ip)) {
		return false;
	}
	return true;
};

const validatePair = (pair) => {
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

const getBrokerDeals = () => {
	return GET_BROKER();
};

const getQuickTrades = () => {
	return GET_QUICKTRADE();
};

const getTradePaths = () => {
	return GET_TRADEPATHS();
};

const getTransactionLimits = () => {
	return GET_TRANSACTION_LIMITS();
};


const getNetworkQuickTrades = () => {
	return GET_NETWORK_QUICKTRADE();
};

const parseNumber = (number, precisionValue) => {
	return BigNumber(number).precision(precisionValue, BigNumber.ROUND_DOWN).toNumber();
};
const removeRepeatingDecimals = (num) => {
	let numStr = num.toString();
	if (numStr.includes('.') && numStr?.length > 8) {
		let [integerPart, decimalPart] = numStr.split('.');
		decimalPart = decimalPart.replace(/(\d)\1{2,}$/, '$1');
		return parseFloat(`${integerPart}.${decimalPart}`);
	}
	
	return parseFloat(num); 
};

module.exports = {
	getKitVersion,
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
	getMiniCharts,
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
	// getCsvParser,
	emailHtmlBoilerplate,
	getNetworkConstants,
	getNetworkEndpoint,
	getMinFees,
	getEmail,
	updateEmail,
	checkExchangeStatus,
	validateIp,
	validatePair,
	getBrokerDeals,
	getQuickTrades,
	getNetworkQuickTrades,
	parseNumber,
	getQuickTradePairs,
	getTransactionLimits,
	getTradePaths,
	removeRepeatingDecimals
};