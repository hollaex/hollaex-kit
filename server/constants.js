'use strict';
const { toBool } = require('./utils/conversion');

exports.NETWORK = process.env.NETWORK === 'mainnet' ? 'prod' : 'testnet';
exports.APM_ENABLED = toBool(process.env.APM_ENABLED) || false; // apm is used for sending logs etc

exports.API_HOST = process.env.API_HOST || 'localhost';
exports.DOMAIN = process.env.DOMAIN || (process.env.NODE_ENV === 'production' ? 'https://hollaex.com' : 'http://localhost:3000');

exports.HOLLAEX_NETWORK_URL = process.env.HOLLAEX_NETWORK_URL || 'https://api.testnet.hollaex.network/v2';

// CHANNEL CONSTANTS -----------------------------

exports.WEBSOCKET_CHANNEL = (topic, symbolOrUserId) => {
	switch(topic) {
		case 'orderbook':
			return `orderbook:${symbolOrUserId}`;
		case 'trade':
			return `trade:${symbolOrUserId}`;
		case 'order':
			return `order:${symbolOrUserId}`;
		case 'wallet':
			return `wallet:${symbolOrUserId}`;
		case 'userTrade':
			return `userTrade:${symbolOrUserId}`;
		default:
			return;
	}
};

exports.WEBSOCKET_CHAT_CHANNEL = '/chat';
exports.WEBSOCKET_CHAT_PUBLIC_ROOM = 'public';
exports.CHAT_MAX_MESSAGES = 50;
exports.ACTION_PARTIAL = 'partial';
exports.ACTION_UPDATE = 'update';

exports.CHAT_MESSAGE_CHANNEL = 'channel:chat:message';

exports.INIT_CHANNEL = 'channel:init';

exports.WITHDRAWALS_REQUEST_KEY = 'withdrawals:request';

exports.WS_USER_TRADE_TYPE = 'trade';
exports.WS_USER_ORDER_QUEUED_TYPE = 'order_queued';
exports.WS_USER_ORDER_PROCESSED_TYPE = 'order_processed';
exports.WS_USER_ORDER_CANCELED_TYPE = 'order_canceled';
exports.WS_USER_ORDER_ADDED_TYPE = 'order_added';
exports.WS_USER_ORDER_UPDATED_TYPE = 'order_updated';
exports.WS_USER_ORDER_REMOVED_TYPE = 'order_removed';
exports.WS_USER_ORDER_PARTIALLY_FILLED_TYPE = 'order_partialy_filled';
exports.WS_USER_ORDER_FILLED_TYPE = 'order_filled';
// CHANNEL CONSTANTS -----------------------------

const CONFIGURATION_CHANNEL = 'channel:configuration';
exports.CONFIGURATION_CHANNEL = CONFIGURATION_CHANNEL;
const STATUS_FROZENUSERS_DATA = 'status:frozenUsers:data';
exports.STATUS_FROZENUSERS_DATA = STATUS_FROZENUSERS_DATA;

const { subscriber } = require('./db/pubsub');

// Needs to be refined, for flushRedis error
const { promisifyAll } = require('bluebird');
const redis = require('redis');
const redisConfig = require('./config/redis');
promisifyAll(redis.RedisClient.prototype);
const client = redis.createClient(redisConfig.client);

let configuration = {
	coins: {},
	pairs: {},
	kit: {
		info: {},
		color: {},
		interface: {},
		icons: {},
		strings: {},
		links: {},
		captcha: {},
		defaults: {},
		plugins: {
			configuration: {}
		},
		meta: {}
	}
};

let secrets = {
	broker: {},
	security: {},
	accounts: {},
	captcha: {},
	emails: {},
	smtp: {},
	plugins: {
		s3: {},
		sns: {},
		freshdesk: {}
	}
};

let frozenUsers = {};

client.getAsync(STATUS_FROZENUSERS_DATA)
	.then((data) => {
		data = JSON.parse(data);
		if (data) {
			configuration = data.configuration;
			secrets = data.secrets;
			frozenUsers = data.frozenUsers;
		}
	});

subscriber.subscribe(CONFIGURATION_CHANNEL);

subscriber.on('message', (channel, message) => {
	if (channel === CONFIGURATION_CHANNEL) {
		const { type, data } = JSON.parse(message);

		switch(type) {
			case 'initial':
				updateAllConfig(data.configuration, data.secrets, data.frozenUsers);
				break;
			case 'update':
				if (data.info) updateKitInfo(data.info);
				if (data.kit) updateKit(data.kit);
				if (data.secrets) updateSecrets(data.secrets);
				break;
			case 'freezeUser':
				updateFrozenUser(data, 'add');
				break;
			case 'unfreezeUser':
				updateFrozenUser(data, 'remove');
				break;
			case 'stop':
				resetAllConfig();
				break;
			default:
				break;
		}
	}
});

const updateAllConfig = (newConfigurations, newSecrets, newFrozenUsers) => {
	configuration = newConfigurations;
	secrets = newSecrets;
	frozenUsers = newFrozenUsers;
	setRedisData();
};

const resetAllConfig = () => {
	frozenUsers = {};
	secrets = {
		broker: {},
		security: {},
		accounts: {},
		captcha: {},
		emails: {},
		smtp: {},
		vault: {},
		plugins: {
			s3: {},
			sns: {},
			freshdesk: {}
		}
	};
	configuration = {
		coins: {},
		pairs: {},
		kit: {
			info: {},
			color: {},
			interface: {},
			icons: {},
			strings: {},
			links: {},
			captcha: {},
			defaults: {},
			plugins: {
				configuration: {}
			},
			meta: {}
		}
	};
	setRedisData();
};

const updateKitInfo = (newInfo) => {
	Object.assign(configuration.kit.info, newInfo);
};

const updateKit = (newKitConfig) => {
	Object.assign(configuration.kit, newKitConfig);
	setRedisData();
};

const updateSecrets = (newSecretsConfig) => {
	Object.assign(secrets, newSecretsConfig);
	setRedisData();
};

const updateFrozenUser = (action, userId) => {
	if (action === 'add') {
		frozenUsers[userId] = true;
	} else if (action === 'remove') {
		delete frozenUsers[userId];
	}
	setRedisData();
};

const setRedisData = () => {
	client.set(STATUS_FROZENUSERS_DATA, JSON.stringify({ configuration, secrets, frozenUsers }));
};

exports.GET_COINS = () => configuration.coins;
exports.GET_PAIRS = () => configuration.pairs;
exports.GET_KIT_CONFIG = () => configuration.kit;
exports.GET_KIT_SECRETS = () => secrets;
exports.GET_FROZEN_USERS = () => frozenUsers;

exports.MAX_TRADES = process.env.MAX_TRADES
	? parseInt(process.env.MAX_TRADES)
	: 50;

// TODO: need to check and make this dynamic only for trade volume data
exports.MAIN_CURRENCY = 'eur';

exports.SECRET_MASK = '************************';

exports.NODE_ENV = process.env.NODE_ENV;

exports.CURRENCIES = [];

exports.SALT_ROUNDS = 10;
exports.AFFILIATION_CODE_LENGTH = 6;

// ACCOUNTS CONSTANTS -----------------------------

exports.ADMIN_ACCOUNT_ID = 1;
exports.DEFAULT_TIER = 1;

const ACCOUNTS = [
	{
		email: process.env.ADMIN_EMAIL,
		password: process.env.ADMIN_PASSWORD,
		is_admin: true,
		verification_level: exports.DEFAULT_TIER
	},
	{
		email: process.env.HOLLAEX_EMAIL,
		password: process.env.HOLLAEX_PASSWORD,
		is_admin: true,
		verification_level: exports.DEFAULT_TIER
	},
	{
		email: process.env.TECH_EMAIL,
		password: process.env.TECH_PASSWORD,
		is_admin: true,
		verification_level: exports.DEFAULT_TIER
	}
];

exports.ACCOUNTS = ACCOUNTS;

const ROLES = {
	SUPERVISOR: 'supervisor',
	SUPPORT: 'support',
	ADMIN: 'admin',
	KYC: 'kyc',
	TECH: 'tech',
	USER: 'user',
	HMAC: 'hmac'
};

exports.TOKEN_TYPES = {
	NORMAL: 'normal',
	DEV: 'dev',
	HMAC: 'hmac'
};

exports.SECRET = process.env.SECRET || 'shhhh';
exports.ISSUER = process.env.ISSUER || 'hollaex.com';

exports.HMAC_TOKEN_EXPIRY = 5 * 12 * 30 * 24 * 60 * 60 * 1000; // 5 years


exports.ROLES = ROLES;
exports.BASE_SCOPES = [ROLES.USER, ROLES.HMAC];
// ACCOUNTS CONSTANTS -----------------------------

// ORDER TYPES --------------------------------------
exports.ORDER_TYPE_QUOTE = 'quote';
exports.ORDER_TYPE_LIMIT = 'limit';
exports.ORDER_TYPE_MARKET = 'market';

exports.ORDER_SIDE_BUY = 'buy';
exports.ORDER_SIDE_SELL = 'sell';
// ORDER TYPES --------------------------------------

exports.DEFAULT_ORDER_RISK_PERCENTAGE = 90; // used in settings in percentage to display popups on big relative big orders of user

exports.CAPTCHA_ENDPOINT = 'https://www.google.com/recaptcha/api/siteverify';

exports.MIN_VERIFICATION_LEVEL = 1;

exports.SEND_CONTACT_US_EMAIL = true;

exports.ZENDESK_HOST = process.env.ZENDESK_HOST || '';
exports.ZENDESK_KEY = process.env.ZENDESK_KEY || '';

exports.TOKEN_USER_LEVEL = parseInt(process.env.TOKEN_USER_LEVEL || 2, 10);
exports.MASK_CHARS = parseInt(process.env.MASK_CHARS || 5, 10);

exports.MAX_ORDER_QUEUE = parseInt(process.env.MAX_ORDER_QUEUE) || 10;

// WALLI CONSTANTS -----------------------------
exports.VAULT_ENDPOINT = 'https://api.bitholla.com/v1/vault';

exports.CONFIRMATION = {
	btc: 1,
	eth: 15,
	bch: 2,
	xrp: 0
};

// PLUGIN VALUES
exports.AVAILABLE_PLUGINS = [
	'xht_fee',
	'kyc',
	'sms',
	'vault',
	'freshdesk',
	'chat',
	'bank',
	'announcement',
	'zendesk'
]

exports.REQUIRED_XHT = 100;

exports.SMS_CODE_KEY = 'user:sms';
exports.SMS_CODE_EXPIRATION_TIME = 6 * 60; // seconds -> 6 min

exports.S3_LINK_EXPIRATION_TIME = 300; // seconds

exports.ID_FIELDS = [
	'type',
	'number',
	'issued_date',
	'expiration_date',
	'status'
];
exports.USER_FIELD_ADMIN_LOG = [
	'full_name',
	'email',
	'dob',
	'gender',
	'nationality',
	'phone_number',
	'address',
	'id_data',
	'bank_account',
	'settings',
	'username'
];
exports.ADDRESS_FIELDS = ['city', 'address', 'country', 'postal_code'];
exports.VERIFY_STATUS = {
	EMPTY: 0,
	PENDING: 1,
	REJECTED: 2,
	COMPLETED: 3
};

exports.ERC_TOKENS = [
	'eth',
	'xht',
	'usdt',
	'dai',
	'mkr',
	'tusd',
	'usdc',
	'leo',
	'xaut',
	'busd'
];

exports.KIT_CONFIG_KEYS = [
	'captcha',
	'plugins',
	'api_name',
	'description',
	'color',
	'title',
	'links',
	'defaults',
	'logo_path',
	'logo_black_path',
	'valid_languages',
	'user_level_number',
	'new_user_is_activated',
	'broker_enabled',
	'interface',
	'icons',
	'strings',
	'meta'
];

exports.KIT_SECRETS_KEYS = [
	'setup_completed',
	'allowed_domains',
	'admin_whitelist',
	'emails',
	'broker',
	'security',
	'captcha',
	'smtp',
	'vault',
	'plugins'
];

//CSV Report keys
exports.AUDIT_KEYS = [
	'id',
	'admin_id',
	'event',
	'description.new',
	'description.old',
	'description.note',
	'description.user_id',
	'ip',
	'domain',
	'timestamp'
];

exports.TECH_AUTHORIZED_KIT_CONFIG = [
	'captcha',
	'plugins',
	'secrets'
];

exports.TECH_AUTHORIZED_KIT_SECRETS = [
	'allowed_domains',
	'emails',
	'admin_whitelist',
	'captcha',
	'smtp',
	'plugins'
];

const MAINNET_EXPLORERS = {
	btc: [
		{
			name: 'Blockchain.info',
			baseUrl: 'https://www.blockchain.com',
			txPath: '/btc/tx'
		},
		{
			name: 'BlockCypher',
			baseUrl: 'https://live.blockcypher.com',
			txPath: '/btc/tx'
		},
		{
			name: 'Blockstream',
			baseUrl: 'https://blockstream.info',
			txPath: '/tx'
		},
		{
			name: 'Bitcoin.com',
			baseUrl: 'https://explorer.bitcoin.com',
			txPath: '/btc/tx'
		}
	],
	eth: [
		{
			name: 'EtherScan',
			baseUrl: 'https://etherscan.io',
			txPath: '/tx'
		},
		{
			name: 'Blockchain.info',
			baseUrl: 'https://www.blockchain.com',
			txPath: '/eth/tx'
		}
	],
	xht: [
		{
			name: 'EtherScan',
			baseUrl: 'https://etherscan.io',
			txPath: '/tx'
		}
	],
	usdt: [
		{
			name: 'EtherScan',
			baseUrl: 'https://etherscan.io',
			txPath: '/tx'
		}
	],
	dai: [
		{
			name: 'EtherScan',
			baseUrl: 'https://etherscan.io',
			txPath: '/tx'
		}
	],
	sai: [
		{
			name: 'EtherScan',
			baseUrl: 'https://etherscan.io',
			txPath: '/tx'
		}
	],
	mkr: [
		{
			name: 'EtherScan',
			baseUrl: 'https://etherscan.io',
			txPath: '/tx'
		}
	],
	bnb: [
		{
			name: 'EtherScan',
			baseUrl: 'https://etherscan.io',
			txPath: '/tx'
		}
	],
	bat: [
		{
			name: 'EtherScan',
			baseUrl: 'https://etherscan.io',
			txPath: '/tx'
		}
	],
	leo: [
		{
			name: 'EtherScan',
			baseUrl: 'https://etherscan.io',
			txPath: '/tx'
		}
	],
	zrx: [
		{
			name: 'EtherScan',
			baseUrl: 'https://etherscan.io',
			txPath: '/tx'
		}
	],
	bch: [
		{
			name: 'Blockchain.info',
			baseUrl: 'https://www.blockchain.com',
			txPath: '/bch/tx'
		},
		{
			name: 'Bitcoin.com',
			baseUrl: 'https://explorer.bitcoin.com',
			txPath: '/bch/tx'
		}
	],
	xrp: [
		{
			name: 'xrpscan',
			baseUrl: 'https://xrpscan.com',
			txPath: '/tx'
		},
		{
			name: 'Bithomp',
			baseUrl: 'https://bithomp.com',
			txPath: '/explorer'
		}
	],
	xmr: [
		{
			name: 'MoneroBlocks',
			baseUrl: 'https://moneroblocks.info',
			txPath: '/tx'
		}
	],
	xaut: [
		{
			name: 'EtherScan',
			baseUrl: 'https://etherscan.io',
			txPath: '/tx'
		}
	],
	xlm: [
		{
			name: 'stellarhain.io',
			baseUrl: 'https://stellarchain.io',
			txPath: '/tx'
		}
	],
};

const TESTNET_EXPLORERS = {
	btc: [
		{
			name: 'Blockchain.info',
			baseUrl: 'https://testnet.blockchain.info',
			txPath: '/tx'
		},
		{
			name: 'BlockCypher',
			baseUrl: 'https://live.blockcypher.com',
			txPath: '/bcy/tx'
		},
		{
			name: 'Blockstream',
			baseUrl: 'https://blockstream.info/testnet',
			txPath: '/tx'
		}
	],
	eth: [
		{
			name: 'EtherScan',
			baseUrl: 'https://ropsten.etherscan.io',
			txPath: '/tx'
		}
	],
	xht: [
		{
			name: 'EtherScan',
			baseUrl: 'https://ropsten.etherscan.io',
			txPath: '/tx'
		}
	],
	usdt: [
		{
			name: 'EtherScan',
			baseUrl: 'https://ropsten.etherscan.io',
			txPath: '/tx'
		}
	],
	dai: [
		{
			name: 'EtherScan',
			baseUrl: 'https://ropsten.etherscan.io',
			txPath: '/tx'
		}
	],
	sai: [
		{
			name: 'EtherScan',
			baseUrl: 'https://ropsten.etherscan.io',
			txPath: '/tx'
		}
	],
	mkr: [
		{
			name: 'EtherScan',
			baseUrl: 'https://ropsten.etherscan.io',
			txPath: '/tx'
		}
	],
	bnb: [
		{
			name: 'EtherScan',
			baseUrl: 'https://ropsten.etherscan.io',
			txPath: '/tx'
		}
	],
	bat: [
		{
			name: 'EtherScan',
			baseUrl: 'https://ropsten.etherscan.io',
			txPath: '/tx'
		}
	],
	leo: [
		{
			name: 'EtherScan',
			baseUrl: 'https://ropsten.etherscan.io',
			txPath: '/tx'
		}
	],
	zrx: [
		{
			name: 'EtherScan',
			baseUrl: 'https://ropsten.etherscan.io',
			txPath: '/tx'
		}
	],
	bch: [
		{
			name: 'Blockchain.info',
			baseUrl: 'https://www.blockchain.com',
			txPath: '/bchtest/tx'
		}
	],
	xrp: [
		{
			name: 'Bithomp',
			baseUrl: 'https://test.bithomp.com',
			txPath: '/explorer'
		}
	],
	xmr: [
		{
			name: 'xmrchain',
			baseUrl: 'https://testnet.xmrchain.com',
			txPath: '/tx'
		}
	],
	xaut: [
		{
			name: 'EtherScan',
			baseUrl: 'https://ropsten.etherscan.io',
			txPath: '/tx'
		}
	],
	xlm: [
		{
			name: 'steexp',
			baseUrl: 'https://testnet.steexp.com',
			txPath: '/tx'
		}
	],
};

exports.EXPLORERS =
	process.env.NETWORK === 'mainnet' ? MAINNET_EXPLORERS : TESTNET_EXPLORERS;
