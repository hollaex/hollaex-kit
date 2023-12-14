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
	'transaction_limits',
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
		maker: 0,
		taker: 0
	},
	boost: {
		maker: 0,
		taker: 0
	},
	crypto: {
		maker: 0.05,
		taker: 0.1
	},
	basic: {
		maker: 0.2,
		taker: 0.2
	}
};

exports.ROLES = ROLES;
exports.BASE_SCOPES = [ROLES.USER];
exports.DEFAULT_ORDER_RISK_PERCENTAGE = 90; // used in settings in percentage to display popups on big relative big orders of user

// ACCOUNTS CONSTANTS END --------------------------------------------------

// SECURITY CONSTANTS START --------------------------------------------------

exports.TOKEN_TIME_NORMAL = '24h';
exports.TOKEN_TIME_LONG = '30d';

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
	fiat: ['hollaex', 'oracle', 'binance', 'bitfinex', 'coinbase', 'kraken', 'bybit', 'gateio', 'wowmax', 'oneinch'],
	boost: ['hollaex', 'oracle', 'binance', 'bitfinex', 'coinbase', 'kraken', 'bybit', 'gateio', 'wowmax', 'oneinch'],
	crypto: ['hollaex', 'oracle', 'binance'],
	ALL: [ 'hollaex', 'oracle', 'binance', 'bitfinex', 'coinbase', 'kraken', 'bybit', 'gateio', 'wowmax', 'oneinch']
};

exports.ONEINCH_URL = 'https://api.1inch.dev/swap/v5.2/';
exports.WOWMAX_QUOTE_URL = 'https://api-gateway.wowmax.exchange/chains/';

exports.ONEINCH_COINS = {
	eth: {
		wbtc: { token: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599", decimals: 8 },
		eth: { token: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", decimals: 18 },
		usdt: { token: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6 },
		dai: { token: "0x6b175474e89094c44da98b954eedeac495271d0f", decimals: 18 },
		usdc: { token: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", decimals: 6 },
		weth: { token: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", decimals: 18 },
		mkr: { token: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2", decimals: 18 },
		hex: { token: '0X2B591E99AFE9F32EAA6214F7B7629768C40EEB39', decimals: 8 },
		matic: { token: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0", decimals: 18 },
		mana: { token: "0x0f5d2fb29fb7d3cfee444a200298f468908cc942", decimals: 18 },
		sushi: { token: "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2", decimals: 18 },
		bat: { token: "0x0d8775f648430679a709e98d2b0cb6250d2887ef", decimals: 18 },
		knc: { token: "0xdd974d5c2e2928dea5f71b9825b8b646686bd200", decimals: 18 },
		aave: { token: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', decimals: 18 },
		link: { token: '0x514910771AF9Ca656af840dff83E8264EcF986CA', decimals: 18 },
		sETH2: { token: '0xFe2e637202056d30016725477c5da089Ab0A043A', decimals: 18 },
		stETH: { token: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84', decimals: 18 },
		gtc: { token: '0xDe30da39c46104798bB5aA3fe8B9e0e1F348163F', decimals: 18 },
		snt: { token: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F', decimals: 18 },
		allt: { token: '0x6B0b3a982b4634aC68dD83a4DBF02311cE324181', decimals: 18 }
	},
	bnb: {
		btcb: { token: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c", decimals: 18 },
		eth: { token: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8", decimals: 18 },
		usdt: { token: "0x55d398326f99059ff775485246999027b3197955", decimals: 18 },
	},
	matic: {
		btcb: { token: "0x2297aEbD383787A160DD0d9F71508148769342E3", decimals: 8 },
		weth: { token: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0", decimals: 18 },
		usdt: { token: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", decimals: 6 },
	}
}

exports.ONEINCH_CHAINS = {
	eth: 1,
	bnb: 56,
	matic: 137, 
}


// BROKER CONSTANTS END

//STAKE CONSTANTS START

exports.STAKE_SUPPORTED_PLANS = ['fiat', 'boost', 'enterprise'];

//STAKE CONSTANTS END

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
