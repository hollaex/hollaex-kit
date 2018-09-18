import config from './index';
import {
	formatBtcAmount,
	formatBtcFullAmount,
	formatFiatAmount,
	formatEthAmount,
	formatEthFullAmount
} from '../utils/currency';

import STRINGS from './localizedStrings';

export const ENV = process.env.NODE_ENV || 'development';
export const NETWORK = process.env.REACT_APP_NETWORK || 'testnet';

export const APP_TITLE = STRINGS.APP_TITLE;

export const TOKEN_TIME = 24 * 60 * 60 * 1000; // 1 day
export const SESSION_TIME = 6 * 60 * 60 * 1000; // 6 hour
export const API_URL = config[ENV][NETWORK].API_URL;
export const WS_URL = config[ENV][NETWORK].WS_URL;

export const ICONS = {
	DEMO_LOGIN_ICON_DARK: `${process.env.PUBLIC_URL}/assets/icons/demo-login-icon-dark.svg`,
	DEMO_LOGIN_ICON_LIGHT: `${process.env.PUBLIC_URL}/assets/icons/demo-login-icon-light.svg`,
	CANCEL_WITHDRAW_DARK: `${process.env.PUBLIC_URL}/assets/icons/cancel-withdraw-dark-02-03.svg`,
	CANCEL_WITHDRAW_LIGHT: `${process.env.PUBLIC_URL}/assets/icons/cancel-withdraw-light-02.svg`,
	BTC_ICON_DARK: `${process.env.PUBLIC_URL}/assets/icons/btc-icon-dark-01.svg`,
	BTC_ICON: `${process.env.PUBLIC_URL}/assets/icons/btc-icon-01.svg`,
	ETH_ICON: `${process.env.PUBLIC_URL}/assets/icons/eth-icon-01.svg`,
	ETH_ICON_DARK: `${process.env.PUBLIC_URL}/assets/icons/eth-icon-dark-01.svg`,
	LIFESAVER: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-05.svg`,
	QUESTION_MARK: `${process.env.PUBLIC_URL}/assets/icons/question-mark-black.svg`,
	QUESTION_MARK_COLOR: `${process.env.PUBLIC_URL}/assets/icons/question-mark-color.svg`,
	LAPTOP: `${process.env.PUBLIC_URL}/assets/icons/compute-play-black.svg`,
	LAPTOP_COLOR: `${process.env.PUBLIC_URL}/assets/icons/compute-play-color.svg`,
	TELEGRAM: `${process.env.PUBLIC_URL}/assets/icons/telegram-black.svg`,
	TELEGRAM_COLOR: `${process.env.PUBLIC_URL}/assets/icons/telegram-color.svg`,
	CHECK: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-06.svg`,
	BLUE_QUESTION: `${
		process.env.PUBLIC_URL
	}/assets/acounts/account-icons-08.svg`,
	RED_WARNING: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-09.svg`,
	GENDER_F: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-10.svg`,
	GENDER_M: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-11.svg`,
	BITCOIN_CLEAR: `${
		process.env.PUBLIC_URL
	}/assets/acounts/account-icons-13.svg`,
	RED_ARROW: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-16.svg`,
	BLUE_CLIP: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-17.svg`,
	BLACK_CHECK: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-19.svg`,
	KEYS: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-22.svg`,
	GREEN_CHECK: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-23.svg`,
	LETTER: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-24.svg`,
	SQUARE_DOTS: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-25.svg`,
	COPY_NEW: `${process.env.PUBLIC_URL}/assets/images/copy.svg`,
	ACCOUNT_LINE: `${process.env.PUBLIC_URL}/assets/images/account.svg`,
	ACCOUNT_RECOVERY: `${
		process.env.PUBLIC_URL
	}/assets/images/account-recovery.svg`,
	BITCOIN_WALLET: `${process.env.PUBLIC_URL}/assets/images/bitcoin-wallet.svg`,
	CHECK_SENDING_BITCOIN: `${
		process.env.PUBLIC_URL
	}/assets/images/check-sending-bitcoin.svg`,
	DATA: `${process.env.PUBLIC_URL}/assets/images/data.svg`,
	DEPOSIT_BITCOIN: `${
		process.env.PUBLIC_URL
	}/assets/images/deposit-bitcoin.svg`,
	DEPOSIT_HISTORY: `${
		process.env.PUBLIC_URL
	}/assets/images/deposit-history.svg`,
	DEPOSIT_HISTORY_GREY: `${
		process.env.PUBLIC_URL
	}/assets/images/deposit-history-grey.svg`,
	DEPOSIT_RECEIVED_BITCOIN: `${
		process.env.PUBLIC_URL
	}/assets/images/deposit-received-bitcoin.svg`,
	DEPOSIT_SUCCESS: `${process.env.PUBLIC_URL}/assets/images/D-W-Success.svg`,
	WITHDRAWAL_SUCCESS: `${process.env.PUBLIC_URL}/assets/images/D-W-Success.svg`,
	EMAIL: `${process.env.PUBLIC_URL}/assets/images/email.svg`,
	EMAIL_SENT: `${process.env.PUBLIC_URL}/assets/images/email-sent.svg`,
	OTP_DOTS: `${process.env.PUBLIC_URL}/assets/images/f2fa-pin.svg`,
	DEPOSIT_FIAT: `${process.env.PUBLIC_URL}/assets/images/fiat-deposit.svg`,
	DEPOSIT_FIAT_COMPLETE: `${
		process.env.PUBLIC_URL
	}/assets/images/fiat-deposit-completed.svg`,
	FIAT_WALLET: `${process.env.PUBLIC_URL}/assets/images/fiat-wallet.svg`,
	GEAR_BLACK: `${process.env.PUBLIC_URL}/assets/images/gear.svg`,
	GEAR_GREY: `${process.env.PUBLIC_URL}/assets/images/gear-grey.svg`,
	HELP_ICON: `${process.env.PUBLIC_URL}/assets/images/help.svg`,
	ID_BLACK: `${process.env.PUBLIC_URL}/assets/images/id.svg`,
	ID_GREY: `${process.env.PUBLIC_URL}/assets/images/id-grey.svg`,
	INCOMING_BITCOIN: `${
		process.env.PUBLIC_URL
	}/assets/images/Incoming-bitcoin.svg`,
	INCOMING_BTC: `${process.env.PUBLIC_URL}/assets/images/incoming-btc.svg`,
	INCOMING_TOMAN: `${process.env.PUBLIC_URL}/assets/images/incoming-toman.svg`,
	LICENSE: `${process.env.PUBLIC_URL}/assets/images/licence.svg`,
	LIQUID: `${process.env.PUBLIC_URL}/assets/images/liquid.svg`,
	MARGIN: `${process.env.PUBLIC_URL}/assets/images/margin.svg`,
	PASSWORD_RESET: `${process.env.PUBLIC_URL}/assets/images/password-reset.svg`,
	PAYMENT_OPTIONS: `${
		process.env.PUBLIC_URL
	}/assets/images/payment-options.svg`,
	QUICK_TRADE: `${process.env.PUBLIC_URL}/assets/images/quick-trade.svg`,
	SECURE: `${process.env.PUBLIC_URL}/assets/images/secure.svg`,
	SECURITY_BLACK: `${process.env.PUBLIC_URL}/assets/images/security.svg`,
	SECURITY_GREY: `${process.env.PUBLIC_URL}/assets/images/security-grey.svg`,
	SET_NEW_PASSWORD: `${
		process.env.PUBLIC_URL
	}/assets/images/set-new-password.svg`,
	SUCCESS_BLACK: `${process.env.PUBLIC_URL}/assets/images/success-black.svg`,
	TRADE_HISTORY: `${process.env.PUBLIC_URL}/assets/images/trade-history.svg`,
	TRADE_HISTORY_GREY: `${
		process.env.PUBLIC_URL
	}/assets/images/trade-history-grey.svg`,
	TRADES_ICON: `${process.env.PUBLIC_URL}/assets/images/trade-history.svg`,
	TRADE_SUCCESS: `${process.env.PUBLIC_URL}/assets/images/trade-success.svg`,
	TRANSACTION_HISTORY: `${
		process.env.PUBLIC_URL
	}/assets/images/transaction-history.svg`,
	UPDATE_QUICK_TRADE: `${
		process.env.PUBLIC_URL
	}/assets/images/update-quick-trade.svg`,
	VERIFICATION_SENT: `${
		process.env.PUBLIC_URL
	}/assets/images/verification-resent.svg`,
	WITHDRAW: `${process.env.PUBLIC_URL}/assets/images/withdraw.svg`,
	WITHDRAW_HISTORY: `${
		process.env.PUBLIC_URL
	}/assets/images/withdraw-history.svg`,
	WITHDRAW_HISTORY_GREY: `${
		process.env.PUBLIC_URL
	}/assets/images/withdraw-history-grey.svg`,
	BLUE_ARROW_LEFT: `${
		process.env.PUBLIC_URL
	}/assets/images/blue-arrow-left.svg`,
	BLUE_ARROW_RIGHT: `${
		process.env.PUBLIC_URL
	}/assets/images/blue-arrow-right.svg`,
	SESSION_TIMED_OUT: `${
		process.env.PUBLIC_URL
	}/assets/images/session-timed-out.svg`,
	BLUE_EDIT: `${process.env.PUBLIC_URL}/assets/images/blue-edit-exir-icon.svg`,
	BLUE_PLUS: `${process.env.PUBLIC_URL}/assets/images/max-plus-blue-icon.svg`,
	BLUE_TIMER: `${process.env.PUBLIC_URL}/assets/images/timer-icon.svg`,
	DROPDOWN_ARROW: `${process.env.PUBLIC_URL}/assets/images/down-arrow-home.svg`,
	NOTIFICATION_ORDER_LIMIT_BUY_FILLED: `${
		process.env.PUBLIC_URL
	}/assets/images/limit-buy-order-filled-01.svg`,
	NOTIFICATION_ORDER_LIMIT_BUY_CREATED: `${
		process.env.PUBLIC_URL
	}/assets/images/limit-buy-order-icon-01.svg`,
	NOTIFICATION_ORDER_LIMIT_BUY_FILLED_PART: `${
		process.env.PUBLIC_URL
	}/assets/images/limit-buy-order-part-filled-01.svg`,
	NOTIFICATION_ORDER_LIMIT_SELL_FILLED: `${
		process.env.PUBLIC_URL
	}/assets/images/limit-sell-order-filled-01.svg`,
	NOTIFICATION_ORDER_LIMIT_SELL_CREATED: `${
		process.env.PUBLIC_URL
	}/assets/images/limit-sell-order-icon-01.svg`,
	NOTIFICATION_ORDER_LIMIT_SELL_FILLED_PART: `${
		process.env.PUBLIC_URL
	}/assets/images/limit-sell-order-part-filled-01.svg`,
	NOTIFICATION_ORDER_MARKET_BUY_FILLED: `${
		process.env.PUBLIC_URL
	}/assets/images/market-buy-01.svg`,
	NOTIFICATION_ORDER_MARKET_SELL_FILLED: `${
		process.env.PUBLIC_URL
	}/assets/images/market-sell-01.svg`,
	NOTIFICATION_VERIFICATION_WARNING: `${
		process.env.PUBLIC_URL
	}/assets/images/verification.svg`,
	LOGOUT_ARROW: `${
		process.env.PUBLIC_URL
	}/assets/images/logout-arrow-active.svg`,
	LOGOUT_ARROW_GREY: `${process.env.PUBLIC_URL}/assets/images/logout-arrow.svg`,
	VERIFICATION_WARNING: `${process.env.PUBLIC_URL}/assets/images/astrics.svg`,
	VERIFICATION_SUCCESS: `${
		process.env.PUBLIC_URL
	}/assets/images/success-check-box.svg`,
	VERIFICATION_DOC: `${process.env.PUBLIC_URL}/assets/images/doc.svg`,
	VERIFICATION_DOC_INACTIVE: `${
		process.env.PUBLIC_URL
	}/assets/images/doc-inactive.svg`,
	VERIFICATION_EMAIL: `${process.env.PUBLIC_URL}/assets/images/email_2.svg`,
	VERIFICATION_EMAIL_INACTIVE: `${
		process.env.PUBLIC_URL
	}/assets/images/email-inactive.svg`,
	VERIFICATION_MOBILE: `${process.env.PUBLIC_URL}/assets/images/mobile.svg`,
	VERIFICATION_MOBILE_INACTIVE: `${
		process.env.PUBLIC_URL
	}/assets/images/mobile-inactive.svg`,
	VERIFICATION_BANK: `${process.env.PUBLIC_URL}/assets/images/bank.svg`,
	VERIFICATION_BANK_INACTIVE: `${
		process.env.PUBLIC_URL
	}/assets/images/bank-inactive.svg`,
	VERIFICATION_ID: `${process.env.PUBLIC_URL}/assets/images/id_2.svg`,
	VERIFICATION_ID_INACTIVE: `${
		process.env.PUBLIC_URL
	}/assets/images/id_2-inactive.svg`,
	COIN_WITHDRAW_BTC: `${
		process.env.PUBLIC_URL
	}/assets/images/coin-withdraw-btc.svg`,
	COIN_WITHDRAW_TOMAN: `${
		process.env.PUBLIC_URL
	}/assets/images/coin-withdraw-tom.svg`,
	LOGOUT_DOOR_ACTIVE: `${
		process.env.PUBLIC_URL
	}/assets/images/logout-door-active.svg`,
	LOGOUT_DOOR_INACTIVE: `${
		process.env.PUBLIC_URL
	}/assets/images/logout-door-inactive.svg`,
	CANCEL_CROSS_ACTIVE: `${
		process.env.PUBLIC_URL
	}/assets/images/cancel-cross-active.svg`,
	CANCEL_CROSS_INACTIVE: `${
		process.env.PUBLIC_URL
	}/assets/images/cancel-cross-inactive.svg`,
	SIDEBAR_WALLET_ACTIVE_1: `${
		process.env.PUBLIC_URL
	}/assets/images/wallet-active.svg`,
	SIDEBAR_WALLET_INACTIVE_1: `${
		process.env.PUBLIC_URL
	}/assets/images/wallet-inactive.svg`,
	SIDEBAR_WALLET_ACTIVE: `${
		process.env.PUBLIC_URL
	}/assets/images/wallet-selected.svg`,
	SIDEBAR_WALLET_INACTIVE: `${process.env.PUBLIC_URL}/assets/images/wallet.svg`,
	SIDEBAR_ACCOUNT_ACTIVE: `${
		process.env.PUBLIC_URL
	}/assets/images/account_2-active.svg`,
	SIDEBAR_ACCOUNT_INACTIVE: `${
		process.env.PUBLIC_URL
	}/assets/images/account_2-inactive.svg`,
	SIDEBAR_TRADING_ACTIVE: `${
		process.env.PUBLIC_URL
	}/assets/images/trade-active.svg`,
	SIDEBAR_TRADING_INACTIVE: `${
		process.env.PUBLIC_URL
	}/assets/images/trade-inactive.svg`,
	ARROW_TRANSFER_HISTORY_ACTIVE: `${
		process.env.PUBLIC_URL
	}/assets/images/arrow-trans-history-active.svg`,
	ARROW_TRANSFER_HISTORY_INACTIVE: `${
		process.env.PUBLIC_URL
	}/assets/images/arrow-trans-history.svg`,
	ARROW_DOWN: `${process.env.PUBLIC_URL}/assets/images/arrow-down.svg`,
	TOKENS_INACTIVE: `${process.env.PUBLIC_URL}/assets/images/dev-icon.svg`,
	TOKENS_ACTIVE: `${process.env.PUBLIC_URL}/assets/images/dev-icon.svg`,
	TOKEN_REVOKED: `${process.env.PUBLIC_URL}/assets/images/api-key-revoked.svg`,
	TOKEN_ACTIVE: `${process.env.PUBLIC_URL}/assets/images/api-key-active.svg`,
	TOKEN_TRASHED: `${process.env.PUBLIC_URL}/assets/images/api-key-trashed.svg`,
	TOKEN_GENERATE: `${
		process.env.PUBLIC_URL
	}/assets/images/api-key-generate.svg`,
	TOKEN_GENERATE_DARK: `${
		process.env.PUBLIC_URL
	}/assets/images/api-key-generate-dark.svg`, 
	TOKEN_CREATED: `${process.env.PUBLIC_URL}/assets/images/api-key-created.svg`,
	TOKEN_CREATED_DARK: `${process.env.PUBLIC_URL}/assets/images/api-key-created-dark.svg`,
	CHECK_ORDER: `${process.env.PUBLIC_URL}/assets/images/check-order.svg`,
	ITEM_OPTIONS: `${process.env.PUBLIC_URL}/assets/images/item-options.svg`,
	DOTTED_GRIP: `${
		process.env.PUBLIC_URL
	}/assets/images/dotted-grip-chat-repeat-pattern.svg`,
	CHAT: `${process.env.PUBLIC_URL}/assets/images/chat-icon.svg`
};

export const SOCIAL_ICONS = {
	FACEBOOK: `${process.env.PUBLIC_URL}/assets/icons/social-grey-icons.svg`,
	TWIITER: `${process.env.PUBLIC_URL}/assets/icons/social-grey-icons02.svg`,
	INSTAGRAM: `${process.env.PUBLIC_URL}/assets/icons/social-grey-icons03.svg`,
	TELEGRAM: `${process.env.PUBLIC_URL}/assets/icons/social-grey-icons04.svg`,
	GOOGLE: `${process.env.PUBLIC_URL}/assets/icons/google.png`
};

export const FEATURES_ICONS = {
	PRO_TRADING: `${
		process.env.PUBLIC_URL
	}/assets/images/features-pro-trade-icons.svg`,
	PAYMENT: `${
		process.env.PUBLIC_URL
	}/assets/images/features-payment-card-icons.svg`,
	SECURITY: `${process.env.PUBLIC_URL}/assets/images/features-lock-icons.svg`,
	REPORTING: `${process.env.PUBLIC_URL}/assets/images/features-data-icons.svg`,
	SUPPORT: `${process.env.PUBLIC_URL}/assets/images/features-support-icons.svg`,
	LEGAL: `${process.env.PUBLIC_URL}/assets/images/features-legal-icons.svg`
};
export const HOLLAEX_LOGO = `${
	process.env.PUBLIC_URL
}/assets/hollaEx_logo-grey.svg`;
export const HOLLAEX_LOGO_BLACK = `${
	process.env.PUBLIC_URL
}/assets/hollaEx_logo-blk.svg`;

export const CURRENCIES = {
	btc: {
		symbol: 'btc',
		name: STRINGS.BTC_NAME,
		fullName: STRINGS.BTC_FULLNAME,
		shortName: STRINGS.BTC_SHORTNAME,
		currencySymbol: 'B',
		formatToCurrency: formatBtcAmount,
		formatToCurrencyFull: formatBtcFullAmount,
	},
	eth: {
		symbol: 'eth',
		name: STRINGS.ETH_NAME,
		fullName: STRINGS.ETH_FULLNAME,
		shortName: STRINGS.ETH_SHORTNAME,
		currencySymbol: 'E',
		formatToCurrency: formatEthAmount,
		formatToCurrencyFull: formatEthFullAmount,
	},
	fiat: {
		symbol: 'fiat',
		name: STRINGS.FIAT_NAME,
		fullName: STRINGS.FIAT_FULLNAME,
		shortName: STRINGS.FIAT_SHORTNAME,
		currencySymbol: STRINGS.FIAT_CURRENCY_SYMBOL,
		formatToCurrency: formatFiatAmount,
		formatToCurrencyFull: formatFiatAmount,
	}
};

export const PAIRS = {
	'btc-eur': {
		pair_base: 'btc',
		pair_2: 'fiat'
	},
	'eth-eur': {
		pair_base: 'eth',
		pair_2: 'fiat'
	},
	'eth-btc': {
		pair_base: 'eth',
		pair_2: 'btc'
	}
};

export const DEFAULT_PAIR = 'btc-eur';

export const FLEX_CENTER_CLASSES = [
	'd-flex',
	'justify-content-center',
	'align-items-center'
];

export const TIMESTAMP_FORMAT = STRINGS.TIMESTAMP_FORMAT;
export const HOUR_FORMAT = STRINGS.HOUR_FORMAT;

export const DEPOSIT_LIMITS = {
	fiat: {
		DAILY: 50000000,
		MIN: 100,
		MAX: 50000000
	}
};

export const WITHDRAW_LIMITS = {
	fiat: {
		MIN: process.env.REACT_APP_WITHDRAWAL_FIAT_MIN || 20000,
		STEP: process.env.REACT_APP_WITHDRAWAL_FIAT_STEP || 1
	},
	btc: {
		MIN: process.env.REACT_APP_WITHDRAWAL_BTC_MIN || 0.0001,
		MAX: process.env.REACT_APP_WITHDRAWAL_BTC_MAX || 10,
		STEP: process.env.REACT_APP_WITHDRAWAL_BTC_STEP || 0.0001
	},
	eth: {
		MIN: process.env.REACT_APP_WITHDRAWAL_ETH_MIN || 0.0001,
		MAX: process.env.REACT_APP_WITHDRAWAL_ETH_MAX || 10,
		STEP: process.env.REACT_APP_WITHDRAWAL_ETH_STEP || 0.0001,
		MIN_FEE: parseFloat(process.env.REACT_APP_ETH_MIN_FEE || 0.001)
	}
};

export const TOKEN_KEY = `${ENV}_${NETWORK}_TOKEN`;
export const LANGUAGE_KEY = `${ENV}_${NETWORK}_LANGUAGE`;
export const DEFAULT_LANGUAGE = process.env.REACT_APP_DEFAULT_LANGUAGE || 'en';

export const BANK_WITHDRAWAL_BASE_FEE =
	process.env.REACT_APP_BANK_WITHDRAWAL_BASE_FEE || 1;
export const BANK_WITHDRAWAL_DYNAMIC_FEE_RATE =
	process.env.REACT_APP_BANK_WITHDRAWAL_DYNAMIC_FEE_RATE || 0.5;
export const BANK_WITHDRAWAL_MAX_DYNAMIC_FEE =
	process.env.REACT_APP_BANK_WITHDRAWAL_MAX_DYNAMIC_FEE || 50;
export const BANK_WITHDRAWAL_MAX_AMOUNT_FOR_BASE_FEE =
	process.env.REACT_APP_BANK_WITHDRAWAL_MAX_AMOUNT_FOR_BASE_FEE || 0;

export const BANK_PAYMENT_LINK = '';
export const MIN_VERIFICATION_LEVEL_TO_WITHDRAW = 2;
export const MAX_VERIFICATION_LEVEL_TO_WITHDRAW = 5;

export const BLOCKTRAIL_ENDPOINT = `https://www.blocktrail.com/${
	NETWORK === 'testnet' ? 't' : ''
}BTC/tx/`;

export const ETHEREUM_ENDPOINT = `https://${
	NETWORK === 'testnet' ? 'ropsten.etherscan.io' : 'etherscan.io'
}/tx/`;

export const BALANCE_ERROR = 'Insufficient balance to perform the order';

export const CAPTCHA_SITEKEY = process.env.REACT_APP_CAPTCHA_SITE_KEY;
export const CAPTCHA_TIMEOUT = process.env.REACT_APP_CAPTCHA_TIMEOUT
	? parseInt(process.env.REACT_APP_CAPTCHA_TIMEOUT, 10)
	: 2000;

export const IS_PRO_VERSION =
	process.env.REACT_APP_IS_PRO_VERSION &&
	process.env.REACT_APP_IS_PRO_VERSION === 'true';
export const PRO_VERSION_REDIRECT =
	process.env.REACT_APP_PRO_VERSION_REDIRECT || '/account';
export const DEFAULT_VERSION_REDIRECT =
	process.env.REACT_APP_DEFAULT_VERSION_REDIRECT || '/';
export const PRO_URL = process.env.REACT_APP_PRO_URL || 'https://hollaex.com';

export const MIN_LEVEL_FOR_TOKENS = parseInt(
	process.env.REACT_APP_MIN_LEVEL_FOR_TOKENS || 2,
	10
);

export const THEMES = ['dark', 'white'];
export const THEME_DEFAULT = THEMES[1];
export const CHAT_STATUS_KEY = 'chat:minimized';

export const DEFAULT_COUNTRY = process.env.REACT_APP_DEFAULT_COUNTRY
	? process.env.REACT_APP_DEFAULT_COUNTRY.toUpperCase()
	: 'FR';

export const ORDER_LIMITS = {
	'btc-eur': {
		PRICE: {
			MIN: 500,
			MAX: 50000,
			STEP: 1
		},
		SIZE: {
			MIN: 0.0001,
			MAX: 21000000,
			STEP: 0.0001
		}
	},
	'eth-eur': {
		PRICE: {
			MIN: 10,
			MAX: 10000,
			STEP: 1
		},
		SIZE: {
			MIN: 0.001,
			MAX: 20000000,
			STEP: 0.001
		}
	},
	'eth-btc': {
		PRICE: {
			MIN: 0.0001,
			MAX: 10,
			STEP: 0.00001
		},
		SIZE: {
			MIN: 0.001,
			MAX: 20000000,
			STEP: 0.001
		}
	}
};

export const BASE_CURRENCY = process.env.REACT_APP_BASE_CURRENCY;
