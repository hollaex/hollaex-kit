import config from './index';
import STRINGS from './localizedStrings';
export { default as ICONS } from './icons';

export const ENV = process.env.NODE_ENV || 'production';
export const NETWORK = process.env.REACT_APP_NETWORK || 'mainnet';

export const APP_TITLE =
	process.env.REACT_APP_EXCHANGE_NAME || STRINGS['APP_TITLE'];

export const PUBLIC_URL =
	process.env.REACT_APP_PUBLIC_URL || 'http://localhost:8080';

export const TOKEN_TIME = 24 * 60 * 60 * 1000; // 1 day
export const SESSION_TIME = 6 * 60 * 60 * 1000; // 6 hour

export const API_URL = config[ENV].API_URL;
export const WS_URL = config[ENV].WS_URL;

export const PLUGIN_URL = config[ENV].PLUGIN_URL;
export const NETWORK_API_URL = config[ENV].NETWORK_API_URL;

export const DEFAULT_LANDING_SECTIONS = {
	heading: {
		name: 'Title/heading',
		is_active: true,
		order: 0,
		className: 'px-2',
	},
	carousel_section: {
		name: 'Moving ticker cards',
		is_active: true,
		order: 1,
	},
	card_section: {
		name: 'Key icon features',
		is_active: true,
		order: 3,
	},
	market_list: {
		name: 'Market list',
		is_active: true,
		order: 4,
		className: 'px-2',
	},
	quick_trade: {
		name: 'Quick trade calculator',
		is_active: true,
		order: 2,
		className: 'px-2',
	},
};

export const AUDIOS = {
	ORDERBOOK_FIELD_UPDATE: '/assets/audio/orderbook_field_update_1.wav',
	ORDERBOOK_LIMIT_ORDER: '/assets/audio/orderbook-limit-order_1.wav',
	PUBLIC_TRADE_NOTIFICATION: '/assets/audio/public-trade-notification.wav',
	ORDER_COMPLETED: '/assets/audio/order-filled_1.wav',
	ORDER_PARTIALLY_COMPLETED: '/assets/audio/part-fill_1.wav',
	CANCEL_ORDER: '/assets/audio/cancel_order_1.wav',
	QUICK_TRADE_COMPLETE: '/assets/audio/quick-trade-complete_1.wav',
	REVIEW_QUICK_TRADE_ORDER: '/assets/audio/review-quick-trade-order_1.wav',
	TIME_OUT_QUICK_TRADE: '/assets/audio/time-out-quick-trade.wav',
};

export const CURRENCY_PRICE_FORMAT = '{0} {1}';
export const APPROXIMATELY_EQAUL_CURRENCY_PRICE_FORMAT = '\u2248{0} {1}';
// this DEFAULT_COIN_PAIR to prevent from error while irrelevant BASE_CURRENCY
export const DEFAULT_COIN_DATA = {
	fullname: '',
	symbol: '',
	display_name: '',
	icon_id: 'DEFAULT_ICON',
	min: 0.001,
};

export const DEFAULT_PAIR = 'btc-usdt';

export const FLEX_CENTER_CLASSES = [
	'd-flex',
	'justify-content-center',
	'align-items-center',
];

export const TIMESTAMP_FORMAT = STRINGS['TIMESTAMP_FORMAT'];
export const HOUR_FORMAT = STRINGS['HOUR_FORMAT'];
export const TIMESTAMP_FORMAT_FA = STRINGS['TIMESTAMP_FORMAT']
	.split('/')
	.map((s) => `j${s}`)
	.join('/');

// Default trading pairs (it is set from the server so it is not important to set these properly)
export const DEFAULT_TRADING_PAIRS = ['xht-usdt'];

export const TOKEN_KEY = `${ENV}_${NETWORK}_TOKEN`;
export const LANGUAGE_KEY = `${ENV}_${NETWORK}_LANGUAGE`;
export const DEFAULT_LANGUAGE = process.env.REACT_APP_DEFAULT_LANGUAGE || 'en';

export const TEMP_KEY_LANGUAGE_RTL = 'temp_key_language_rtl';
export const TEMP_KEY_LANGUAGE_LTR = 'temp_key_language_ltr';
export const LAST_UPDATED_NOTIFICATION_KEY = 'LAST_UPDATED_NOTIFICATION_TIME';

export const BANK_WITHDRAWAL_BASE_FEE =
	process.env.REACT_APP_BANK_WITHDRAWAL_BASE_FEE || 1;
export const BANK_WITHDRAWAL_DYNAMIC_FEE_RATE =
	process.env.REACT_APP_BANK_WITHDRAWAL_DYNAMIC_FEE_RATE || 0.5;
export const BANK_WITHDRAWAL_MAX_DYNAMIC_FEE =
	process.env.REACT_APP_BANK_WITHDRAWAL_MAX_DYNAMIC_FEE || 50;
export const BANK_WITHDRAWAL_MAX_AMOUNT_FOR_BASE_FEE =
	process.env.REACT_APP_BANK_WITHDRAWAL_MAX_AMOUNT_FOR_BASE_FEE || 0;
export const takerFee = 0;

export const EXPLORERS_ENDPOINT = (currency) => {
	let endpoint = '';
	switch (currency) {
		case 'eth':
			endpoint =
				NETWORK === 'testnet'
					? 'https://ropsten.etherscan.io/tx/'
					: 'https://etherscan.io/tx/';
			break;
		case 'btc':
			endpoint =
				NETWORK === 'testnet'
					? 'https://live.blockcypher.com/btc-test/tx/'
					: 'https://live.blockcypher.com/btc/tx/';
			break;
		case 'xrp':
			endpoint =
				NETWORK === 'testnet'
					? 'https://test.bithomp.com/explorer/'
					: 'https://bithomp.com/explorer/';
			break;
		case 'bch':
			endpoint =
				NETWORK === 'testnet'
					? 'https://explorer.bitcoin.com/tbch/tx/'
					: 'https://explorer.bitcoin.com/bch/tx/';
			break;
		case 'xht':
		case 'usdt':
		case 'busd':
		case 'tusd':
		case 'dai':
		case 'mkr':
			endpoint =
				NETWORK === 'testnet'
					? 'https://ropsten.etherscan.io/tx/'
					: 'https://etherscan.io/tx/';
			break;
		case 'xmr':
			endpoint =
				NETWORK === 'testnet'
					? 'https://moneroblocks.info/tx/'
					: 'https://moneroblocks.info/tx/';
			break;
		case 'xlm':
			endpoint =
				NETWORK === 'testnet'
					? 'https://testnet.steexp.com/tx/'
					: 'https://steexp.com/tx/';
			break;
		case 'eos':
			endpoint = 'https://bloks.io/transaction/';
			break;
		case 'trx':
			endpoint =
				NETWORK === 'testnet'
					? 'https://shasta.tronscan.org/#/transaction/'
					: 'https://tronscan.org/#/transaction/';
			break;
		case 'doge':
			endpoint = 'https://blockchair.com/dogecoin/transaction/';
			break;
		case 'ltc':
			endpoint = 'https://blockchair.com/litecoin/transaction/';
			break;
		case 'ada':
			endpoint = 'https://blockchair.com/cardano/transaction/';
			break;
		default:
			endpoint = '';
			break;
	}
	return endpoint;
};

export const BALANCE_ERROR = 'Insufficient balance to perform the order';

export const DEFAULT_CAPTCHA_SITEKEY =
	'6LeuOKoUAAAAAGVoZcSWXJH60GHt4crvIaNXn1YA'; // default recaptcha v3; // default recaptcha v3

export const CAPTCHA_TIMEOUT = process.env.REACT_APP_CAPTCHA_TIMEOUT
	? parseInt(process.env.REACT_APP_CAPTCHA_TIMEOUT, 10)
	: 2000;

export const TIME_ZONE = process.env.REACT_APP_TIMEZONE || 'GMT';
export const TOKEN_EMAIL = 'token::email';
export const TOKEN_MAX_AGE = 23 * 60 * 60;

export const DEFAULT_URL = '/';

// minimum level for a user to be able to create api tokens
export const MIN_LEVEL_FOR_TOKENS = 1;

const THEME_COLOR = localStorage.getItem('theme');
export const THEMES = ['dark', 'white'];
export const THEME_DEFAULT = THEME_COLOR ? THEME_COLOR : THEMES[1];
export const CHAT_STATUS_KEY = 'chat:minimized';

export const DEFAULT_COUNTRY = process.env.REACT_APP_DEFAULT_COUNTRY
	? process.env.REACT_APP_DEFAULT_COUNTRY.toUpperCase()
	: 'KR';

const local_base_currnecy = localStorage.getItem('base_currnecy');

export const BASE_CURRENCY = local_base_currnecy
	? local_base_currnecy.toLowerCase()
	: 'usdt';

export const API_DOCS_URL = 'https://docs.bitholla.com/';
export const EXCHANGE_URL = 'https://dash.bitholla.com/';
export const EXCHANGE_EXPIRY_DAYS = 15;
export const EXCHANGE_EXPIRY_SECONDS = EXCHANGE_EXPIRY_DAYS * 86400;
export const REQUEST_VAULT_SUPPORTED_COINS =
	'https://api.vault.bitholla.com/v1/coins';

export const MAX_NUMBER_BANKS = 3;

export const SHOW_SUMMARY_ACCOUNT_DETAILS = false;
export const SHOW_TOTAL_ASSETS = false;
export const FIT_SCREEN_HEIGHT = ['trade'];

export const DEFAULT_BANK_PAYMENT_ACCOUNTS = [
	{ key: 'bank_name', label: 'Bank name', required: true },
	{ key: 'account_number', label: 'Bank Account number', required: true },
	{ key: 'bank_account_owner', label: 'Bank Account Owner', required: true },
	{ key: 'swift_code', label: 'SWIFT code', required: false },
	{ key: 'iban', label: 'Iban', required: false },
	{ key: 'bank_location', label: 'Bank location (country)', required: false },
];
export const DEFAULT_PAYPAL_PAYMENT_PAYPAL = [
	{ key: 'email', label: 'Email', required: true },
];
export const DEFAULT_CUSTOM_PAYMENT_CUSTOM = [
	{ key: 'payment_info', label: 'Payment Info', required: true },
];
