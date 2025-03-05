'use strict';

const { toBool } = require('./utils/conversion');
const { cloneDeep } = require('lodash');
const redis = require('redis');
const config = require('./config/redis');
const subscriber = redis.createClient(config.pubsub);

// CONFIGURATION CONSTANTS START--------------------------------------------------
const CONFIGURATION_CHANNEL = 'channel:configuration';

let configuration = {
	coins: {},
	pairs: {},
	tiers: {},
	kit: {
		info: {},
		color: {},
		interface: {},
		icons: {},
		strings: {},
		links: {},
		captcha: {},
		defaults: {},
		features: {},
		meta: {},
		user_meta: {},
		injected_values: [],
		injected_html: {},
		black_list_countries: [],
		onramp: {},
		offramp: {},
		user_payments: {},
		dust: {}
	},
	email: {}
};

let secrets = {
	security: {},
	accounts: {},
	captcha: {},
	emails: {},
	smtp: {}
};

let frozenUsers = {};

subscriber.subscribe(CONFIGURATION_CHANNEL);

subscriber.on('message', (channel, message) => {
	if (channel === CONFIGURATION_CHANNEL) {
		const { type, data } = JSON.parse(message);

		switch (type) {
			case 'initial':
				updateAllConfig(data.configuration, data.secrets, data.frozenUsers);
				break;
			case 'update':
				if (data.info) updateKitInfo(data.info);
				if (data.tiers) updateTiers(data.tiers);
				if (data.kit) updateKit(data.kit);
				if (data.secrets) updateSecrets(data.secrets);
				if (data.email) updateEmail(data.email);
				break;
			case 'freezeUser':
				updateFrozenUser('add', data);
				break;
			case 'unfreezeUser':
				updateFrozenUser('remove', data);
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
	if (!configuration?.kit?.info?.plan) configuration.kit.info.plan = 'basic';
	secrets = newSecrets;
	frozenUsers = newFrozenUsers;
};

const resetAllConfig = () => {
	frozenUsers = {};
	secrets = {
		security: {},
		accounts: {},
		captcha: {},
		emails: {},
		smtp: {}
	};
	configuration = {
		coins: {},
		pairs: {},
		tiers: {},
		kit: {
			info: {},
			color: {},
			interface: {},
			icons: {},
			strings: {},
			links: {},
			captcha: {},
			defaults: {},
			features: {},
			meta: {},
			user_meta: {},
			injected_values: [],
			injected_html: {},
			black_list_countries: [],
			onramp: {},
			offramp: {},
			user_payments: {},
			dust: {}
		},
		email: {}
	};
};

const updateTiers = (newTiers) => {
	Object.assign(configuration.tiers, newTiers);
};

const updateKitInfo = (newInfo) => {
	Object.assign(configuration.kit.info, newInfo);
};

const updateKit = (newKitConfig) => {
	Object.assign(configuration.kit, newKitConfig);
	overrideNetworkFields();
};

const updateSecrets = (newSecretsConfig) => {
	Object.assign(secrets, newSecretsConfig);
};

const updateEmail = (newEmailConfig) => {
	Object.assign(configuration.email, newEmailConfig);
};

const updateFrozenUser = (action, userId) => {
	if (action === 'add') {
		frozenUsers[userId] = true;
	} else if (action === 'remove') {
		delete frozenUsers[userId];
	}
};

const overrideNetworkFields = () => {
	for (let coin of Object.values(configuration.coins)) {
		if (coin.type === 'fiat') {
			configuration.coins[coin.symbol] = {
				...coin,
				...configuration?.kit?.fiat_fees?.[coin.symbol]
			};
		}
	}
};

exports.GET_COINS = () => cloneDeep(configuration.coins);
exports.GET_PAIRS = () => cloneDeep(configuration.pairs);
exports.GET_TIERS = () => cloneDeep(configuration.tiers);
exports.GET_KIT_CONFIG = () => cloneDeep(configuration.kit);
exports.GET_TRANSACTION_LIMITS = () => cloneDeep(configuration.transaction_limits);
exports.GET_KIT_SECRETS = () => cloneDeep(secrets);
exports.GET_FROZEN_USERS = () => cloneDeep(frozenUsers);
exports.GET_EMAIL = () => cloneDeep(configuration.email);
exports.GET_BROKER = () => cloneDeep(configuration.broker);
exports.GET_QUICKTRADE = () => cloneDeep(configuration.quicktrade);
exports.GET_TRADEPATHS = () => cloneDeep(configuration.tradePaths);
exports.GET_NETWORK_QUICKTRADE = () => cloneDeep(configuration.networkQuickTrades);

exports.USER_META_KEYS = [
	'description',
	'type',
	'required'
];

exports.VALID_USER_META_TYPES = [
	'string',
	'number',
	'boolean',
	'date-time'
];

exports.KIT_CONFIG_KEYS = [
	'captcha',
	'api_name',
	'description',
	'color',
	'title',
	'links',
	'defaults',
	'native_currency',
	'logo_image',
	'valid_languages',
	'new_user_is_activated',
	'interface',
	'icons',
	'strings',
	'meta',
	'features',
	'setup_completed',
	'email_verification_required',
	'injected_values',
	'injected_html',
	'user_meta',
	'black_list_countries',
	'onramp',
	'offramp',
	'user_payments',
	'dust',
	'coin_customizations',
	'fiat_fees',
	'balance_history_config',
	'transaction_limits',
	'p2p_config',
	'referral_history_config',
	'chain_trade_config',
	'selectable_native_currencies',
	'auto_trade_config',
	'apps',
	'timezone'
];

exports.KIT_SECRETS_KEYS = [
	'allowed_domains',
	'admin_whitelist',
	'emails',
	'security',
	'captcha',
	'smtp'
];

exports.COMMUNICATOR_AUTHORIZED_KIT_CONFIG = [
	'icons',
	'strings',
	'color',
	'valid_languages',
	'defaults',
	'logo_image',
	'meta',
	'description',
	'title',
	'interface',
	'links',
	'injected_html',
	'features'
];
// CONFIGURATION CONSTANTS END --------------------------------------------------

// MAIN CONSTANTS START--------------------------------------------------

exports.APM_ENABLED = toBool(process.env.APM_ENABLED) || false; // apm is used for sending logs etc
exports.API_HOST = process.env.API_HOST || 'localhost';
exports.DOMAIN = process.env.DOMAIN || (process.env.NODE_ENV === 'production' ? 'https://hollaex.com' : 'http://localhost:3000');
exports.NODE_ENV = process.env.NODE_ENV;
exports.HOLLAEX_NETWORK_ENDPOINT = process.env.NETWORK_URL || (process.env.NETWORK === 'testnet' ? 'https://api.testnet.hollaex.network' : 'https://api.hollaex.network');
exports.HOLLAEX_NETWORK_BASE_URL = '/v2';
exports.HOLLAEX_NETWORK_PATH_ACTIVATE = '/exchange/activate';

// MAIN CONSTANTS END --------------------------------------------------

// CHANNEL CONSTANTS START --------------------------------------------------

// API
exports.INIT_CHANNEL = 'channel:init';
exports.WITHDRAWALS_REQUEST_KEY = 'withdrawals:request';
exports.HMAC_TOKEN_KEY = 'hmac:token';
exports.EVENTS_CHANNEL = 'channel:events';
exports.CONFIGURATION_CHANNEL = CONFIGURATION_CHANNEL;

// Websocket
exports.WEBSOCKET_CHANNEL = (topic, symbolOrUserId) => {
	switch (topic) {
		case 'orderbook':
			return `orderbook:${symbolOrUserId}`;
		case 'trade':
			return `trade:${symbolOrUserId}`;
		case 'order':
			return `order:${symbolOrUserId}`;
		case 'usertrade':
			return `usertrade:${symbolOrUserId}`;
		case 'wallet':
			return `wallet:${symbolOrUserId}`;
		case 'deposit':
			return `deposit:${symbolOrUserId}`;
		case 'withdrawal':
			return `withdrawal:${symbolOrUserId}`;
		case 'admin':
			return 'admin';
		case 'chat':
			return 'chat';
		case 'p2pChat':
			return `p2pChat:${symbolOrUserId}`;
		default:
			return;
	}
};
exports.WS_PUBSUB_DEPOSIT_CHANNEL = 'channel:ws:deposit';
exports.WS_PUBSUB_WITHDRAWAL_CHANNEL = 'channel:ws:withdrawal';
exports.WS_HUB_CHANNEL = 'channel:websocket:hub';

// Chat
exports.CHAT_MAX_MESSAGES = 50;
exports.CHAT_MESSAGE_CHANNEL = 'channel:chat:message';
exports.P2P_CHAT_MESSAGE_CHANNEL = 'channel:p2p';

// CHANNEL CONSTANTS END --------------------------------------------------

// UTIL CONSTANTS START --------------------------------------------------

exports.AFFILIATION_CODE_LENGTH = 6;
exports.SEND_CONTACT_US_EMAIL = true;
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

// UTIL CONSTANTS END --------------------------------------------------

// ACCOUNTS CONSTANTS START --------------------------------------------------

exports.SETTING_KEYS = [
	'language',
	'notification',
	'interface',
	'audio',
	'risk',
	'chat',
	'app'
];

exports.OMITTED_USER_FIELDS = [
	'password',
	'note',
	'is_admin',
	'is_support',
	'is_supervisor',
	'is_kyc',
	'is_communicator',
	'flagged'
];

const ROLES = {
	SUPERVISOR: 'supervisor',
	SUPPORT: 'support',
	ADMIN: 'admin',
	KYC: 'kyc',
	COMMUNICATOR: 'communicator',
	USER: 'user',
	HMAC: 'hmac'
};

exports.DEFAULT_FEES = {
	fiat: {
		maker: 0.5,
		taker: 0.5
	},
	boost: {
		maker: 0.5,
		taker: 0.5
	},
	crypto: {
		maker: 0.5,
		taker: 0.5
	},
	basic: {
		maker: 0.5,
		taker: 0.5
	}
};

exports.MIN_FEES = {
	fiat: {
		maker: 0,
		taker: 0
	},
	boost: {
		maker: 0,
		taker: 0
	},
	crypto: {
		maker: 0.05,
		taker: 0.05
	},
	basic: {
		maker: 0.05,
		taker: 0.05
	}
};

exports.ROLES = ROLES;
exports.BASE_SCOPES = [ROLES.USER];
exports.DEFAULT_ORDER_RISK_PERCENTAGE = 90; // used in settings in percentage to display popups on big relative big orders of user

// ACCOUNTS CONSTANTS END --------------------------------------------------

// SECURITY CONSTANTS START --------------------------------------------------

exports.TOKEN_TIME_NORMAL = '7d';
exports.TOKEN_TIME_LONG = '90d';

exports.TOKEN_TYPES = {
	HMAC: 'hmac'
};
exports.HMAC_TOKEN_EXPIRY = 5 * 12 * 30 * 24 * 60 * 60 * 1000; // 5 years
exports.SECRET = process.env.SECRET || 'shhhh';
exports.ISSUER = process.env.ISSUER || 'hollaex.com';
exports.CAPTCHA_ENDPOINT = 'https://www.google.com/recaptcha/api/siteverify';
exports.SECRET_MASK = '************************';
exports.SALT_ROUNDS = 10;

// SECURITY CONSTANTS END --------------------------------------------------

// EMAIL CONSTANTS START --------------------------------------------------

exports.CONFIRMATION = {
	btc: 1,
	eth: 15,
	bch: 2,
	trx: 10
};

exports.EXPLORERS = {
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
			name: 'BlockChair',
			baseUrl: 'https://blockchair.com',
			txPath: '/bitcoin/transaction'
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
	xlm: [
		{
			name: 'stellarchain.io',
			baseUrl: 'https://stellarchain.io',
			txPath: '/tx'
		},
		{
			name: 'Steexp',
			baseUrl: 'https://steexp.com',
			txPath: '/tx'
		}
	],
	xmr: [
		{
			name: 'MoneroBlocks',
			baseUrl: 'https://moneroblocks.info',
			txPath: '/tx'
		}
	],
	eth: [
		{
			name: 'EtherScan',
			baseUrl: 'https://etherscan.io',
			txPath: '/tx'
		},
		{
			name: 'Ethplorer',
			baseUrl: 'https://ethplorer.io',
			txPath: '/tx'
		}
	],
	trx: [
		{
			name: 'Tronscan',
			baseUrl: 'https://tronscan.org',
			txPath: '/#/transaction'
		}
	],
	bnb: [
		{
			name: 'BSCScan',
			baseUrl: 'https://bscscan.com',
			txPath: '/tx'
		}
	],
	doge: [
		{
			name: 'DogeChain',
			baseUrl: 'https://dogechain.info',
			txPath: '/tx'
		},
		{
			name: 'BlockChair',
			baseUrl: 'https://blockchair.com',
			txPath: '/dogecoin/transaction'
		}
	],
	ltc: [
		{
			name: 'BlockChair',
			baseUrl: 'https://blockchair.com',
			txPath: '/litecoin/transaction'
		}
	],
	etn: [
		{
			name: 'Electroneum Explorer',
			baseUrl: 'https://blockexplorer.electroneum.com',
			txPath: '/tx'
		}
	],
	ada: [
		{
			name: 'BlockChair',
			baseUrl: 'https://blockchair.com',
			txPath: '/cardano/transaction'
		},
		{
			name: 'CardanoScan',
			baseUrl: 'https://cardanoscan.io',
			txPath: '/transaction'
		}
	],
	eos: [
		{
			name: 'Bloks',
			baseUrl: 'https://bloks.io',
			txPath: '/transaction'
		},
		{
			name: 'BlockChair',
			baseUrl: 'https://blockchair.com',
			txPath: '/eos/transaction'
		}
	],
	sol: [
		{
			name: 'Solana Explorer',
			baseUrl: 'https://explorer.solana.com',
			txPath: '/tx'
		},
		{
			name: 'SolScan',
			baseUrl: 'https://solscan.io',
			txPath: '/tx'
		},
		{
			name: 'BlockChair',
			baseUrl: 'https://blockchair.com',
			txPath: '/solana/transaction'
		}
	],
	klay: [
		{
			name: 'Klaytn Explorer',
			baseUrl: 'https://scope.klaytn.com',
			txPath: '/tx'
		}
	],
	matic: [
		{
			name: 'PolygonScan',
			baseUrl: 'https://polygonscan.com',
			txPath: '/tx'
		}
	],
	pol: [
		{
			name: 'PolygonScan',
			baseUrl: 'https://polygonscan.com',
			txPath: '/tx'
		}
	],
	etc: [
		{
			name: 'Ethereum Classic Explorer',
			baseUrl: 'https://etcblockexplorer.com',
			txPath: '/tx'
		}
	],
	arb: [
		{
			name: 'Arbiscan Explorer',
			baseUrl: 'https://arbiscan.io',
			txPath: '/tx'
		}
	]
};

// EMAIL CONSTANTS END --------------------------------------------------

// PLUGIN CONSTANTS START------------------------------ to be moved

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
exports.CRYPTO_ADDRESS_FIELDS = ['address', 'network', 'label', 'currency'];

exports.VERIFY_STATUS = {
	EMPTY: 0,
	PENDING: 1,
	REJECTED: 2,
	COMPLETED: 3
};
// PLUGIN CONSTANTS END ------------------------------ to be moved

// Login timeout  START------------------------------
exports.LOGIN_TIME_OUT = 1000 * 5 * 60;
exports.NUMBER_OF_ALLOWED_ATTEMPTS = 5;
// Login timeout  END------------------------------

// BROKER CONSTANTS START

exports.EXCHANGE_PLAN_INTERVAL_TIME = {
	crypto: 5,
	fiat: 5,
	boost: 60
};
exports.EXCHANGE_PLAN_PRICE_SOURCE = {
	fiat: ['hollaex', 'oracle', 'binance', 'bitfinex', 'coinbase', 'kraken', 'bybit', 'gateio', 'okx', 'uniswap'],
	boost: ['hollaex', 'oracle', 'binance', 'bitfinex', 'coinbase', 'kraken', 'bybit', 'gateio', 'okx', 'uniswap'],
	crypto: ['hollaex', 'oracle', 'binance'],
	ALL: [ 'hollaex', 'oracle', 'binance', 'bitfinex', 'coinbase', 'kraken', 'bybit', 'gateio', 'okx', 'uniswap']
};


// BROKER CONSTANTS END

//STAKE CONSTANTS START

exports.STAKE_SUPPORTED_PLANS = ['fiat', 'boost', 'enterprise'];

//STAKE CONSTANTS END

//P2P CONSTANTS START

exports.P2P_SUPPORTED_PLANS = ['fiat', 'boost', 'enterprise'];

//P2P CONSTANTS END

//BALANCE HISTORY CONSTANTS START
exports.BALANCE_HISTORY_SUPPORTED_PLANS = ['fiat', 'boost', 'enterprise'];
//BALANCE HISTORY CONSTANTS END 

//REFERRAL HISTORY CONSTANTS START

exports.REFERRAL_HISTORY_SUPPORTED_PLANS = ['fiat', 'boost', 'enterprise'];
//REFERRAL HISTORY CONSTANTS END

//AUTO_TRADE CONSTANTS START

exports.AUTO_TRADE_SUPPORTED_PLANS = ['enterprise', 'fiat'];
//AUTO_TRADE CONSTANTS END


exports.CUSTOM_CSS = `
	.topbar-wrapper img {
		content:url('${exports.GET_KIT_CONFIG().logo_image}}');
		height: 2rem;
	}
	.swagger-ui .opblock.opblock-get .opblock-summary-method {
		background: blue;
	}
	.swagger-ui .btn.execute {
		background-color: blue;
		color: #fff;
		border-color: blue;
	}
	.swagger-ui .btn.authorize {
		color: blue;
		border-color: blue;
	}
	.swagger-ui .btn.authorize svg {
		fill: blue;
	}
	.models {
		display: none !important;
	}
`;