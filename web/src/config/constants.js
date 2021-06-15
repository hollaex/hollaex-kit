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
	},
	market_list: {
		name: 'Market list',
		is_active: false,
		order: 1,
	},
	quick_trade: {
		name: 'Quick trade calculator',
		is_active: false,
		order: 2,
	},
};

export const SOCIAL_ICONS = {
	FACEBOOK: '/assets/icons/facebook.png',
	LINKEDIN: '/assets/icons/linkedin.png',
	TWITTER: '/assets/icons/twitter.png',
	INSTAGRAM: '/assets/icons/instagram.svg',
	TELEGRAM: '/assets/icons/telegram.png',
	GOOGLE: '/assets/icons/google.png',
	YOUTUBE: '/assets/icons/youtube.png',
};

export const FEATURES_ICONS = {
	PRO_TRADING: '/assets/images/features-pro-trade-icons.svg',
	PAYMENT: '/assets/images/features-payment-card-icons.svg',
	SECURITY: '/assets/images/features-lock-icons.svg',
	REPORTING: '/assets/images/features-data-icons.svg',
	SUPPORT: '/assets/images/features-support-icons.svg',
	LEGAL: '/assets/images/features-legal-icons.svg',
};

export const SUMMMARY_ICON = {
	LEVEL_1: '/assets/summary/level-1.png',
	LEVEL_1_DARK: '/assets/summary/level-1-dark.png',
	LEVEL_2: '/assets/summary/level-2.png',
	LEVEL_2_DARK: '/assets/summary/level-2-dark.png',
	LEVEL_3: '/assets/summary/level-3.png',
	LEVEL_3_DARK: '/assets/summary/level-3-dark.png',
	LEVEL_4: '/assets/summary/level-4.png',
	LEVEL_4_DARK: '/assets/summary/level-4-dark.png',
};

export const HOLLAEX_LOGO =
	process.env.REACT_APP_LOGO_PATH ||
	'https://bitholla.s3.ap-northeast-2.amazonaws.com/kit/LOGO_IMAGE_LIGHT';
export const HOLLAEX_LOGO_BLACK =
	process.env.REACT_APP_LOGO_BLACK_PATH ||
	'https://bitholla.s3.ap-northeast-2.amazonaws.com/kit/LOGO_IMAGE_DARK';

export const AUDIOS = {
	ORDERBOOK_FIELD_UPDATE: '/assets/audio/orderbook_field_update.wav',
	ORDERBOOK_LIMIT_ORDER: '/assets/audio/orderbook-limit-order.wav',
	PUBLIC_TRADE_NOTIFICATION: '/assets/audio/public-trade-notification.wav',
	ORDER_COMPLETED: '/assets/audio/order-filled.wav',
	ORDER_PARTIALLY_COMPLETED: '/assets/audio/part-fill.wav',
	CANCEL_ORDER: '/assets/audio/cancel_order.wav',
	QUICK_TRADE_COMPLETE: '/assets/audio/quick-trade-complete.wav',
	REVIEW_QUICK_TRADE_ORDER: '/assets/audio/review-quick-trade-order.wav',
	TIME_OUT_QUICK_TRADE: '/assets/audio/time-out-quick-trade.wav',
};

export const CURRENCY_PRICE_FORMAT = '{0} {1}';
// this DEFAULT_COIN_PAIR to prevent from error while irrelevant BASE_CURRENCY
export const DEFAULT_COIN_DATA = {
	fullname: '',
	symbol: '',
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
			endpoint =
				NETWORK === 'testnet'
					? 'https://testnet.steexp.com/tx/'
					: 'https://steexp.com/tx/';
			break;
		case 'trx':
			endpoint =
				NETWORK === 'testnet'
					? 'https://shasta.tronscan.org/#/transaction/'
					: 'https://tronscan.org/#/transaction/';
			break;
		default:
			endpoint = '';
			break;
	}
	return endpoint;
};

export const BALANCE_ERROR = 'Insufficient balance to perform the order';

export const CAPTCHA_SITEKEY = process.env.REACT_APP_CAPTCHA_SITE_KEY;

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

/* these values are used for the chart limits on the summary page */
export const TRADING_VOLUME_CHART_LIMITS = [10000, 100000];
export const TRADE_ACCOUNT_UPGRADE_MONTH = [3, 6];
/*****************************************************************/

export const BAR_CHART_LIMIT_CAPACITY = [340000, 2050000];

export const DEFAULT_COUNTRY = process.env.REACT_APP_DEFAULT_COUNTRY
	? process.env.REACT_APP_DEFAULT_COUNTRY.toUpperCase()
	: 'KR';

const local_base_currnecy = localStorage.getItem('base_currnecy');

export const BASE_CURRENCY = local_base_currnecy
	? local_base_currnecy.toLowerCase()
	: 'usdt';

export const FEES_LIMIT_SITE_URL = 'https://www.hollaex.com';
export const API_DOCS_URL = 'https://docs.bitholla.com/';
export const EXCHANGE_URL = 'https://dash.bitholla.com/';
export const EXCHANGE_EXPIRY_DAYS = 15;
export const EXCHANGE_EXPIRY_SECONDS = EXCHANGE_EXPIRY_DAYS * 86400;
export const SUPPORT_HELP_URL =
	'https://info.hollaex.com/hc/en-us/requests/new';
export const REQUEST_VAULT_SUPPORTED_COINS =
	'https://api.vault.bitholla.com/v1/coins';
export const ADMIN_GUIDE_DOWNLOAD_LINK =
	'https://bitholla.s3.ap-northeast-2.amazonaws.com/kit/Admin+panel+manual.pdf';

export const MAX_NUMBER_BANKS = 3;

export const CHART_MONTHS = [
	{ key: 1, value: 'Jan' },
	{ key: 2, value: 'Feb' },
	{ key: 3, value: 'Mar' },
	{ key: 4, value: 'Apr' },
	{ key: 5, value: 'May' },
	{ key: 6, value: 'Jun' },
	{ key: 7, value: 'Jul' },
	{ key: 8, value: 'Aug' },
	{ key: 9, value: 'Sep' },
	{ key: 10, value: 'Oct' },
	{ key: 11, value: 'Nov' },
	{ key: 12, value: 'Dec' },
];

export const DARK_THEME_COLORS = {
	border_main: '#b7b5cd',
	sub_text: '#a3a1ca',
	sub_text_1: '#808184',
};

export const WHITE_THEME_COLORS = {
	border_main: '#000000',
	sub_text: '#000000',
	sub_text_1: '#000000',
};

export const DARK_THEME_CHART_COLORS = {
	SELL: '#f69321',
	BUY: '#29abe2',
	LINE: '#b7b7ce',
	FILL: 'orange',
	AXIS: '#b7b7ce',
	BUY_CANDLE: '#29abe2',
	SELL_CANDLE: '#f69321',
	BUY_VOLUME: '#29abe2',
	SELL_VOLUME: '#f69321',
};
export const WHITE_THEME_CHART_COLORS = {
	SELL: 'red',
	BUY: 'green',
	LINE: 'black',
	FILL: 'green',
	AXIS: '#4D4D4D',
	BUY_CANDLE: 'green',
	SELL_CANDLE: '#ed1c24',
	BUY_VOLUME: 'lightgreen',
	SELL_VOLUME: '#ed1c24',
};

export const SHOW_SUMMARY_ACCOUNT_DETAILS = false;
export const SHOW_TOTAL_ASSETS = false;
export const IS_XHT = false;
export const FIT_SCREEN_HEIGHT = ['trade'];
export const SIMPLE_FORMAT_MIN = '0.1';
