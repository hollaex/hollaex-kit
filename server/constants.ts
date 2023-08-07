'use strict';

import { cloneDeep } from 'lodash';
import {
	HOLLAEX_NETWORK_ENDPOINT,
	HOLLAEX_NETWORK_BASE_URL,
	HOLLAEX_NETWORK_PATH_ACTIVATE,
	DEFAULT_FEES,
	TOKEN_TYPES,
	ROLES,
	APM_ENABLED,
	DEFAULT_ORDER_RISK_PERCENTAGE
} from './migration-constants';
import redis from 'redis'
const config = require('./config/redis');
const subscriber = redis.createClient(config.pubsub);

// CONFIGURATION CONSTANTS START--------------------------------------------------
export const CONFIGURATION_CHANNEL = 'channel:configuration';

export interface Coin {
	id: number;
	fullname: string;
	symbol: string;
	active: boolean;
	verified: boolean;
	allow_deposit: boolean;
	allow_withdrawal: boolean;
	withdrawal_fee: number;
	min: number;
	max: number;
	increment_unit: number;
	logo: string;
	code: string;
	is_public: boolean;
	meta: any;
	estimated_price: number;
	description: string;
	type: string;
	network: string;
	standard: string;
	issuer: string;
	withdrawal_fees: {
		max: number;
		min: number;
		type: string;
		value: number;
		levels: any
		symbol: string
	};
	display_name: string;
	deposit_fees: {
		max: number;
		min: number;
		type: string;
		value: number;
		levels: any;
		symbol: string;
	};
	created_at: string;
	updated_at: string;
	created_by: number;
	owner_id: number;
}

export interface Pair {
	id: number;
	name: string;
	pair_base: string;
	pair_2: string;
	min_size: number;
	max_size: number;
	min_price: number;
	max_price: number;
	increment_size: number;
	increment_price: number;
	active: boolean;
	verified: boolean;
	code: string;
	is_public: boolean;
	estimated_price: number;
	circuit_breaker: boolean;
	created_at: string;
	updated_at: string;
	created_by: number;
}

export interface Tier {
	id: number;
	name: string;
	icon: string;
	description: string;
	deposit_limit: number;
	withdrawal_limit: number;
	fees: {
		maker: { [key: string]: number };
		taker: { [key: string]: number };
	};
	note: string;
	native_currency_limit: boolean;
	created_at: string;
	updated_at: string;
}

export interface QuickTrade {
	type: string;
	symbol: string;
	active: boolean;
}

export interface NetworkQuickTrade {
	symbol: string;
	min_size: number;
	max_size: number;
	increment_size: number;
	quote_expiry_time: number;
}

export interface Broker {
	id: number;
	symbol: string;
	buy_price: number;
	sell_price: number;
	paused: boolean;
	min_size: number;
	max_size: number;
}

export interface MetaSection {
	heading: any;
	market_list: any;
	quick_trade: any;
	card_section: any;
	carousel_section: any;
}

export interface Versions {
	color: string;
	icons: string;
	strings: string;
	sections: string;
	logo_image: string;
}

export interface Features {
	apps: boolean;
	chat: boolean;
	home_page: boolean;
	pro_trade: boolean;
	stake_page: boolean;
	quick_trade: boolean;
	ultimate_fiat: boolean;
}

export interface UserMeta {
	[key: string]: {
		type: string;
		required: boolean;
		description: string;
	};
}

export interface Info {
	name: string;
	active: boolean;
	exchange_id: number;
	user_id: number;
	url: string;
	is_trial: boolean;
	created_at: string;
	expiry: string;
	collateral_level: string;
	type: string;
	plan: string | 'basic';
	period: string;
	status: boolean;
	initialized: boolean;
}


export interface MetaObject {
	meta: {
		sections: MetaSection;
		versions: Versions;
		default_sort: string;
		pinned_markets: any[];
	};
	color: { [key: string]: Record<string, string> };
	icons: { [key: string]: Record<string, string> };
	links: { [key: string]: string };
	title: string;
	captcha: { site_key: string };
	strings: { [key: string]: any };
	api_name: string;
	defaults: {
		theme: string;
		country: string;
		language: string;
	};
	features: Features;
	interface: any;
	user_meta: UserMeta;
	logo_image: string;
	description: string;
	injected_html: any;
	injected_values: any[];
	native_currency: string;
	setup_completed: boolean;
	valid_languages: string;
	black_list_countries: string[];
	onramp: any;
	offramp: any;
	status: any;
	user_payments: any;
	dust: any;
	new_user_is_activated: boolean;
	email_verification_required: boolean;
	info: Info;
}


interface Configuration {
	coins: { [key: string]: Coin };
	pairs: { [key: string]: Pair };
	tiers: { [key: string]: Tier };
	quicktrade: QuickTrade[];
	networkQuickTrades: NetworkQuickTrade[];
	broker: Broker[];
	kit: MetaObject
	email: { [key: string]: any }
}

let configuration: Configuration = {
	coins: {},
	pairs: {},
	tiers: {},
	kit: {
		info: {
			name: '',
			active: false,
			exchange_id: 0,
			user_id: 0,
			url: '',
			is_trial: false,
			created_at: '',
			expiry: '',
			collateral_level: '',
			type: '',
			plan: '',
			period: '',
			status: false,
			initialized: false
		},
		color: {},
		interface: {},
		icons: {},
		strings: {},
		links: {},
		captcha: {
			site_key: ''
		},
		defaults: {
			theme: '',
			country: '',
			language: ''
		},
		features: {
			apps: false,
			chat: false,
			home_page: false,
			pro_trade: false,
			stake_page: false,
			quick_trade: false,
			ultimate_fiat: false
		},
		meta: {
			sections: undefined,
			versions: undefined,
			default_sort: '',
			pinned_markets: []
		},
		user_meta: {},
		injected_values: [],
		injected_html: {},
		black_list_countries: [],
		onramp: {},
		offramp: {},
		user_payments: {},
		dust: {},
		api_name: null,
		logo_image: null,
		valid_languages: null,
		new_user_is_activated: null,
		email_verification_required: null,
		native_currency: null,
		status: null,
		title: '',
		description: '',
		setup_completed: false
	},
	broker: [],
	quicktrade: [],
	networkQuickTrades: [],
	email: {},
};

export interface SmtpConfig {
	port: number;
	user: string;
	server: string;
	password: string;
}

export interface EmailsConfig {
	audit: string;
	sender: string;
	timezone: string;
	send_email_to_support: boolean;
}

export interface CaptchaConfig {
	secret_key: string;
}

export interface SecurityConfig {
	token_time: string;
	withdrawal_token_expiry: number;
}

interface Secrets {
	smtp: SmtpConfig;
	emails: EmailsConfig;
	captcha: CaptchaConfig;
	security: SecurityConfig;
	admin_whitelist: Array<any>;
	allowed_domains: Array<any>;
	accounts: Record<string, any>
}

let secrets: Secrets = {
	security: {
		token_time: '',
		withdrawal_token_expiry: 0
	},
	accounts: {},
	captcha: {
		secret_key: ''
	},
	emails: {
		audit: '',
		sender: '',
		timezone: '',
		send_email_to_support: false
	},
	smtp: {
		port: 0,
		user: '',
		server: '',
		password: ''
	},
	admin_whitelist: [],
	allowed_domains: []
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
		security: {
			token_time: '',
			withdrawal_token_expiry: 0
		},
		accounts: {},
		captcha: {
			secret_key: ''
		},
		emails: {
			audit: '',
			sender: '',
			timezone: '',
			send_email_to_support: false
		},
		smtp: {
			port: 0,
			user: '',
			server: '',
			password: ''
		},
		admin_whitelist: [],
		allowed_domains: []
	};
	configuration = {
		coins: {},
		pairs: {},
		tiers: {},
		kit: {
			info: {
				name: '',
				active: false,
				exchange_id: 0,
				user_id: 0,
				url: '',
				is_trial: false,
				created_at: '',
				expiry: '',
				collateral_level: '',
				type: '',
				plan: '',
				period: '',
				status: false,
				initialized: false
			},
			color: {},
			interface: {},
			icons: {},
			strings: {},
			links: {},
			captcha: {
				site_key: ''
			},
			defaults: {
				theme: '',
				country: '',
				language: ''
			},
			features: {
				apps: false,
				chat: false,
				home_page: false,
				pro_trade: false,
				stake_page: false,
				quick_trade: false,
				ultimate_fiat: false
			},
			meta: {
				sections: undefined,
				versions: undefined,
				default_sort: '',
				pinned_markets: []
			},
			user_meta: {},
			injected_values: [],
			injected_html: {},
			black_list_countries: [],
			onramp: {},
			offramp: {},
			user_payments: {},
			dust: {},
			api_name: null,
			logo_image: null,
			valid_languages: null,
			new_user_is_activated: null,
			email_verification_required: null,
			native_currency: null,
			status: null,
			title: '',
			description: '',
			setup_completed: false
		},
		broker: [],
		quicktrade: [],
		networkQuickTrades: [],
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

export const GET_COINS = () => cloneDeep(configuration.coins);
export const GET_PAIRS = () => cloneDeep(configuration.pairs);
export const GET_TIERS = () => cloneDeep(configuration.tiers);
export const GET_KIT_CONFIG = () => cloneDeep(configuration.kit);
export const GET_KIT_SECRETS = () => cloneDeep(secrets);
export const GET_FROZEN_USERS = () => cloneDeep(frozenUsers);
export const GET_EMAIL = () => cloneDeep(configuration.email);
export const GET_BROKER = () => cloneDeep(configuration.broker);
export const GET_QUICKTRADE = () => cloneDeep(configuration.quicktrade);
export const GET_NETWORK_QUICKTRADE = () => cloneDeep(configuration.networkQuickTrades);

export const USER_META_KEYS = [
	'description',
	'type',
	'required'
];

export const VALID_USER_META_TYPES = [
	'string',
	'number',
	'boolean',
	'date-time'
];

export const KIT_CONFIG_KEYS = [
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
	'dust'
];

export const KIT_SECRETS_KEYS = [
	'allowed_domains',
	'admin_whitelist',
	'emails',
	'security',
	'captcha',
	'smtp'
];

export const COMMUNICATOR_AUTHORIZED_KIT_CONFIG = [
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

export {
	HOLLAEX_NETWORK_ENDPOINT,
	HOLLAEX_NETWORK_BASE_URL,
	HOLLAEX_NETWORK_PATH_ACTIVATE,
	DEFAULT_FEES,
	TOKEN_TYPES,
	ROLES,
	APM_ENABLED,
	DEFAULT_ORDER_RISK_PERCENTAGE
}
// CONFIGURATION CONSTANTS END --------------------------------------------------

// MAIN CONSTANTS START--------------------------------------------------

export const API_HOST = process.env.API_HOST || 'localhost';
export const DOMAIN = process.env.DOMAIN || (process.env.NODE_ENV === 'production' ? 'https://hollaex.com' : 'http://localhost:3000');
export const NODE_ENV = process.env.NODE_ENV;

// MAIN CONSTANTS END --------------------------------------------------

// CHANNEL CONSTANTS START --------------------------------------------------

// API
export const INIT_CHANNEL = 'channel:init';
export const WITHDRAWALS_REQUEST_KEY = 'withdrawals:request';
export const HMAC_TOKEN_KEY = 'hmac:token';
export const EVENTS_CHANNEL = 'channel:events';

// Websocket
export const WEBSOCKET_CHANNEL = (topic, symbolOrUserId?: any) => {
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
export const WS_PUBSUB_DEPOSIT_CHANNEL = 'channel:ws:deposit';
export const WS_PUBSUB_WITHDRAWAL_CHANNEL = 'channel:ws:withdrawal';
export const WS_HUB_CHANNEL = 'channel:websocket:hub';

// Chat
export const CHAT_MAX_MESSAGES = 50;
export const CHAT_MESSAGE_CHANNEL = 'channel:chat:message';

// CHANNEL CONSTANTS END --------------------------------------------------

// UTIL CONSTANTS START --------------------------------------------------

export const AFFILIATION_CODE_LENGTH = 6;
export const SEND_CONTACT_US_EMAIL = true;
//CSV Report keys
export const AUDIT_KEYS: any = [
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

export const SETTING_KEYS = [
	'language',
	'notification',
	'interface',
	'audio',
	'risk',
	'chat',
	'app'
];

export const OMITTED_USER_FIELDS = [
	'password',
	'note',
	'is_admin',
	'is_support',
	'is_supervisor',
	'is_kyc',
	'is_communicator',
	'flagged'
];


export const BASE_SCOPES = [ROLES.USER];

// ACCOUNTS CONSTANTS END --------------------------------------------------

// SECURITY CONSTANTS START --------------------------------------------------

export const TOKEN_TIME_NORMAL = '24h';
export const TOKEN_TIME_LONG = '30d';


export const HMAC_TOKEN_EXPIRY = 5 * 12 * 30 * 24 * 60 * 60 * 1000; // 5 years
export const SECRET = process.env.SECRET || 'shhhh';
export const ISSUER = process.env.ISSUER || 'hollaex.com';
export const CAPTCHA_ENDPOINT = 'https://www.google.com/recaptcha/api/siteverify';
export const SECRET_MASK = '************************';
export const SALT_ROUNDS = 10;

// SECURITY CONSTANTS END --------------------------------------------------

// EMAIL CONSTANTS START --------------------------------------------------

export const CONFIRMATION = {
	btc: 1,
	eth: 15,
	bch: 2,
	trx: 10
};

export const EXPLORERS = {
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

export const SMS_CODE_KEY = 'user:sms';
export const SMS_CODE_EXPIRATION_TIME = 6 * 60; // seconds -> 6 min

export const S3_LINK_EXPIRATION_TIME = 300; // seconds

export const ID_FIELDS = [
	'type',
	'number',
	'issued_date',
	'expiration_date',
	'status'
];

export const USER_FIELD_ADMIN_LOG = [
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

export const ADDRESS_FIELDS = ['city', 'address', 'country', 'postal_code'];

export const VERIFY_STATUS = {
	EMPTY: 0,
	PENDING: 1,
	REJECTED: 2,
	COMPLETED: 3
};
// PLUGIN CONSTANTS END ------------------------------ to be moved

// Login timeout  START------------------------------
export const LOGIN_TIME_OUT = 1000 * 5 * 60;
export const NUMBER_OF_ALLOWED_ATTEMPTS = 5;
// Login timeout  END------------------------------

// BROKER CONSTANTS START

export const EXCHANGE_PLAN_INTERVAL_TIME = {
	crypto: 5,
	fiat: 5,
	boost: 60
};
export const EXCHANGE_PLAN_PRICE_SOURCE = {
	fiat: ['hollaex', 'oracle', 'binance', 'bitfinex', 'coinbase', 'kraken', 'uniswap'],
	boost: ['hollaex', 'oracle', 'binance', 'bitfinex', 'coinbase', 'kraken', 'uniswap'],
	crypto: ['hollaex', 'oracle', 'binance'],
	ALL: ['hollaex', 'oracle', 'binance', 'bitfinex', 'coinbase', 'kraken', 'uniswap']
};


// BROKER CONSTANTS END

export const CUSTOM_CSS = `
	.topbar-wrapper img {
		content:url('${GET_KIT_CONFIG().logo_image}}');
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
