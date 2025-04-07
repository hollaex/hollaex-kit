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
exports.GET_ROLES = () => cloneDeep(configuration.roles);
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
	ALL: ['hollaex', 'oracle', 'binance', 'bitfinex', 'coinbase', 'kraken', 'bybit', 'gateio', 'okx', 'uniswap']
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


// ROLES START
exports.ROLE_PERMISSIONS = {
	admin: {
		exchange: {
			get: '/admin/exchange:get',
			post: '/admin/exchange:post',
			put: '/admin/exchange:put',
			delete: '/admin/exchange:delete'
		},
		tier: {
			get: '/admin/tier:get',
			post: '/admin/tier:post',
			put: '/admin/tier:put',
			delete: '/admin/tier:delete'
		},
		'check-transaction': {
			get: '/admin/check-transaction:get',
			post: '/admin/check-transaction:post',
			put: '/admin/check-transaction:put',
			delete: '/admin/check-transaction:delete'
		},
		'send-email-test': {
			get: '/admin/send-email-test:get',
			post: '/admin/send-email-test:post',
			put: '/admin/send-email-test:put',
			delete: '/admin/send-email-test:delete'
		},
		fees: {
			get: '/admin/fees:get',
			post: '/admin/fees:post',
			put: '/admin/fees:put',
			delete: '/admin/fees:delete',
			settle: {
				get: '/admin/fees/settle:get',
				post: '/admin/fees/settle:post',
				put: '/admin/fees/settle:put',
				delete: '/admin/fees/settle:delete'
			}
		},
		signup: {
			get: '/admin/signup:get',
			post: '/admin/signup:post',
			put: '/admin/signup:put',
			delete: '/admin/signup:delete'
		},
		'complete-setup': {
			get: '/admin/complete-setup:get',
			post: '/admin/complete-setup:post',
			put: '/admin/complete-setup:put',
			delete: '/admin/complete-setup:delete'
		},
		'network-credentials': {
			get: '/admin/network-credentials:get',
			post: '/admin/network-credentials:post',
			put: '/admin/network-credentials:put',
			delete: '/admin/network-credentials:delete'
		},
		kit: {
			get: '/admin/kit:get',
			post: '/admin/kit:post',
			put: '/admin/kit:put',
			delete: '/admin/kit:delete',
			'user-meta': {
				get: '/admin/kit/user-meta:get',
				post: '/admin/kit/user-meta:post',
				put: '/admin/kit/user-meta:put',
				delete: '/admin/kit/user-meta:delete'
			}
		},
		email: {
			get: '/admin/email:get',
			post: '/admin/email:post',
			put: '/admin/email:put',
			delete: '/admin/email:delete',
			types: {
				get: '/admin/email/types:get',
				post: '/admin/email/types:post',
				put: '/admin/email/types:put',
				delete: '/admin/email/types:delete'
			}
		},
		operators: {
			get: '/admin/operators:get',
			post: '/admin/operators:post',
			put: '/admin/operators:put',
			delete: '/admin/operators:delete'
		},
		operator: {
			invite: {
				get: '/admin/operator/invite:get',
				post: '/admin/operator/invite:post',
				put: '/admin/operator/invite:put',
				delete: '/admin/operator/invite:delete'
			}
		},
		upload: {
			get: '/admin/upload:get',
			post: '/admin/upload:post',
			put: '/admin/upload:put',
			delete: '/admin/upload:delete'
		},
		pair: {
			get: '/admin/pair:get',
			post: '/admin/pair:post',
			put: '/admin/pair:put',
			delete: '/admin/pair:delete',
			fees: {
				get: '/admin/pair/fees:get',
				post: '/admin/pair/fees:post',
				put: '/admin/pair/fees:put',
				delete: '/admin/pair/fees:delete'
			}
		},
		pairs: {
			get: '/admin/pairs:get',
			post: '/admin/pairs:post',
			put: '/admin/pairs:put',
			delete: '/admin/pairs:delete',
			network: {
				get: '/admin/pairs/network:get',
				post: '/admin/pairs/network:post',
				put: '/admin/pairs/network:put',
				delete: '/admin/pairs/network:delete'
			}
		},
		coin: {
			get: '/admin/coin:get',
			post: '/admin/coin:post',
			put: '/admin/coin:put',
			delete: '/admin/coin:delete'
		},
		coins: {
			get: '/admin/coins:get',
			post: '/admin/coins:post',
			put: '/admin/coins:put',
			delete: '/admin/coins:delete',
			network: {
				get: '/admin/coins/network:get',
				post: '/admin/coins/network:post',
				put: '/admin/coins/network:put',
				delete: '/admin/coins/network:delete'
			}
		},
		users: {
			get: '/admin/users:get',
			post: '/admin/users:post',
			put: '/admin/users:put',
			delete: '/admin/users:delete'
		},
		user: {
			get: '/admin/user:get',
			post: '/admin/user:post',
			put: '/admin/user:put',
			delete: '/admin/user:delete',
			role: {
				get: '/admin/user/role:get',
				post: '/admin/user/role:post',
				put: '/admin/user/role:put',
				delete: '/admin/user/role:delete'
			},
			meta: {
				get: '/admin/user/meta:get',
				post: '/admin/user/meta:post',
				put: '/admin/user/meta:put',
				delete: '/admin/user/meta:delete'
			},
			discount: {
				get: '/admin/user/discount:get',
				post: '/admin/user/discount:post',
				put: '/admin/user/discount:put',
				delete: '/admin/user/discount:delete'
			},
			note: {
				get: '/admin/user/note:get',
				post: '/admin/user/note:post',
				put: '/admin/user/note:put',
				delete: '/admin/user/note:delete'
			},
			balance: {
				get: '/admin/user/balance:get',
				post: '/admin/user/balance:post',
				put: '/admin/user/balance:put',
				delete: '/admin/user/balance:delete'
			},
			bank: {
				get: '/admin/user/bank:get',
				post: '/admin/user/bank:post',
				put: '/admin/user/bank:put',
				delete: '/admin/user/bank:delete'
			},
			restore: {
				get: '/admin/user/restore:get',
				post: '/admin/user/restore:post',
				put: '/admin/user/restore:put',
				delete: '/admin/user/restore:delete'
			},
			email: {
				get: '/admin/user/email:get',
				post: '/admin/user/email:post',
				put: '/admin/user/email:put',
				delete: '/admin/user/email:delete'
			},
			'balance-history': {
				get: '/admin/user/balance-history:get',
				post: '/admin/user/balance-history:post',
				put: '/admin/user/balance-history:put',
				delete: '/admin/user/balance-history:delete'
			},
			activate: {
				get: '/admin/user/activate:get',
				post: '/admin/user/activate:post',
				put: '/admin/user/activate:put',
				delete: '/admin/user/activate:delete'
			},
			affiliation: {
				get: '/admin/user/affiliation:get',
				post: '/admin/user/affiliation:post',
				put: '/admin/user/affiliation:put',
				delete: '/admin/user/affiliation:delete'
			},
			referer: {
				get: '/admin/user/referer:get',
				post: '/admin/user/referer:post',
				put: '/admin/user/referer:put',
				delete: '/admin/user/referer:delete'
			},
			wallet: {
				get: '/admin/user/wallet:get',
				post: '/admin/user/wallet:post',
				put: '/admin/user/wallet:put',
				delete: '/admin/user/wallet:delete'
			},
			'disable-withdrawal': {
				get: '/admin/user/disable-withdrawal:get',
				post: '/admin/user/disable-withdrawal:post',
				put: '/admin/user/disable-withdrawal:put',
				delete: '/admin/user/disable-withdrawal:delete'
			},
			sessions: {
				get: '/admin/user/sessions:get',
				post: '/admin/user/sessions:post',
				put: '/admin/user/sessions:put',
				delete: '/admin/user/sessions:delete'
			},
			'revoke-session': {
				get: '/admin/user/revoke-session:get',
				post: '/admin/user/revoke-session:post',
				put: '/admin/user/revoke-session:put',
				delete: '/admin/user/revoke-session:delete'
			},
			'trading-volume': {
				get: '/admin/user/trading-volume:get',
				post: '/admin/user/trading-volume:post',
				put: '/admin/user/trading-volume:put',
				delete: '/admin/user/trading-volume:delete'
			},
			referral: {
				code: {
					get: '/admin/user/referral/code:get',
					post: '/admin/user/referral/code:post',
					put: '/admin/user/referral/code:put',
					delete: '/admin/user/referral/code:delete'
				}
			},
			'payment-details': {
				get: '/admin/user/payment-details:get',
				post: '/admin/user/payment-details:post',
				put: '/admin/user/payment-details:put',
				delete: '/admin/user/payment-details:delete'
			}
		},
		bank: {
			verify: {
				get: '/admin/bank/verify:get',
				post: '/admin/bank/verify:post',
				put: '/admin/bank/verify:put',
				delete: '/admin/bank/verify:delete'
			},
			revoke: {
				get: '/admin/bank/revoke:get',
				post: '/admin/bank/revoke:post',
				put: '/admin/bank/revoke:put',
				delete: '/admin/bank/revoke:delete'
			}
		},
		logins: {
			get: '/admin/logins:get',
			post: '/admin/logins:post',
			put: '/admin/logins:put',
			delete: '/admin/logins:delete'
		},
		audits: {
			get: '/admin/audits:get',
			post: '/admin/audits:post',
			put: '/admin/audits:put',
			delete: '/admin/audits:delete'
		},
		orders: {
			get: '/admin/orders:get',
			post: '/admin/orders:post',
			put: '/admin/orders:put',
			delete: '/admin/orders:delete'
		},
		order: {
			get: '/admin/order:get',
			post: '/admin/order:post',
			put: '/admin/order:put',
			delete: '/admin/order:delete'
		},
		trades: {
			get: '/admin/trades:get',
			post: '/admin/trades:post',
			put: '/admin/trades:put',
			delete: '/admin/trades:delete'
		},
		balance: {
			get: '/admin/balance:get',
			post: '/admin/balance:post',
			put: '/admin/balance:put',
			delete: '/admin/balance:delete'
		},
		'upgrade-user': {
			get: '/admin/upgrade-user:get',
			post: '/admin/upgrade-user:post',
			put: '/admin/upgrade-user:put',
			delete: '/admin/upgrade-user:delete'
		},
		'verify-email': {
			get: '/admin/verify-email:get',
			post: '/admin/verify-email:post',
			put: '/admin/verify-email:put',
			delete: '/admin/verify-email:delete'
		},
		'deactivate-otp': {
			get: '/admin/deactivate-otp:get',
			post: '/admin/deactivate-otp:post',
			put: '/admin/deactivate-otp:put',
			delete: '/admin/deactivate-otp:delete'
		},
		'flag-user': {
			get: '/admin/flag-user:get',
			post: '/admin/flag-user:post',
			put: '/admin/flag-user:put',
			delete: '/admin/flag-user:delete'
		},
		deposits: {
			get: '/admin/deposits:get',
			post: '/admin/deposits:post',
			put: '/admin/deposits:put',
			delete: '/admin/deposits:delete'
		},
		withdrawals: {
			get: '/admin/withdrawals:get',
			post: '/admin/withdrawals:post',
			put: '/admin/withdrawals:put',
			delete: '/admin/withdrawals:delete'
		},
		transfer: {
			get: '/admin/transfer:get',
			post: '/admin/transfer:post',
			put: '/admin/transfer:put',
			delete: '/admin/transfer:delete'
		},
		mint: {
			get: '/admin/mint:get',
			post: '/admin/mint:post',
			put: '/admin/mint:put',
			delete: '/admin/mint:delete'
		},
		burn: {
			get: '/admin/burn:get',
			post: '/admin/burn:post',
			put: '/admin/burn:put',
			delete: '/admin/burn:delete'
		},
		'dash-token': {
			get: '/admin/dash-token:get',
			post: '/admin/dash-token:post',
			put: '/admin/dash-token:put',
			delete: '/admin/dash-token:delete'
		},
		'send-email': {
			get: '/admin/send-email:get',
			post: '/admin/send-email:post',
			put: '/admin/send-email:put',
			delete: '/admin/send-email:delete',
			raw: {
				get: '/admin/send-email/raw:get',
				post: '/admin/send-email/raw:post',
				put: '/admin/send-email/raw:put',
				delete: '/admin/send-email/raw:delete'
			}
		},
		quicktrade: {
			config: {
				get: '/admin/quicktrade/config:get',
				post: '/admin/quicktrade/config:post',
				put: '/admin/quicktrade/config:put',
				delete: '/admin/quicktrade/config:delete'
			}
		},
		transaction: {
			limit: {
				get: '/admin/transaction/limit:get',
				post: '/admin/transaction/limit:post',
				put: '/admin/transaction/limit:put',
				delete: '/admin/transaction/limit:delete'
			}
		},
		balances: {
			get: '/admin/balances:get',
			post: '/admin/balances:post',
			put: '/admin/balances:put',
			delete: '/admin/balances:delete'
		},
		stakes: {
			get: '/admin/stakes:get',
			post: '/admin/stakes:post',
			put: '/admin/stakes:put',
			delete: '/admin/stakes:delete'
		},
		stake: {
			get: '/admin/stake:get',
			post: '/admin/stake:post',
			put: '/admin/stake:put',
			delete: '/admin/stake:delete',
			'slash-estimate': {
				get: '/admin/stake/slash-estimate:get',
				post: '/admin/stake/slash-estimate:post',
				put: '/admin/stake/slash-estimate:put',
				delete: '/admin/stake/slash-estimate:delete'
			},
			analytics: {
				get: '/admin/stake/analytics:get',
				post: '/admin/stake/analytics:post',
				put: '/admin/stake/analytics:put',
				delete: '/admin/stake/analytics:delete'
			}
		},
		stakers: {
			get: '/admin/stakers:get',
			post: '/admin/stakers:post',
			put: '/admin/stakers:put',
			delete: '/admin/stakers:delete'
		},
		p2p: {
			dispute: {
				get: '/admin/p2p/dispute:get',
				post: '/admin/p2p/dispute:post',
				put: '/admin/p2p/dispute:put',
				delete: '/admin/p2p/dispute:delete'
			}
		},
		trade: {
			get: '/admin/trade:get',
			post: '/admin/trade:post',
			put: '/admin/trade:put',
			delete: '/admin/trade:delete'
		},
		withdrawal: {
			get: '/admin/withdrawal:get',
			post: '/admin/withdrawal:post',
			put: '/admin/withdrawal:put',
			delete: '/admin/withdrawal:delete'
		},
		announcements: {
			get: '/admin/announcements:get',
			post: '/admin/announcements:post',
			put: '/admin/announcements:put',
			delete: '/admin/announcements:delete'
		}
	}
}

// ROLES END
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