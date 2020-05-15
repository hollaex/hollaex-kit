import config from './index';

import STRINGS from './localizedStrings';

export const ENV = process.env.NODE_ENV || 'production';
export const NETWORK = process.env.REACT_APP_NETWORK || 'mainnet';

export const APP_TITLE =
	process.env.REACT_APP_EXCHANGE_NAME || STRINGS.APP_TITLE;

export const PUBLIC_URL =
	process.env.REACT_APP_PUBLIC_URL || 'http://localhost:8080';

export const TOKEN_TIME = 24 * 60 * 60 * 1000; // 1 day
export const SESSION_TIME = 6 * 60 * 60 * 1000; // 6 hour

export const API_URL = config[ENV].API_URL;
export const WS_URL = config[ENV].WS_URL;

export const ICONS = {
	TRADE_HISTORY_DARK: '/assets/icons/trade-history-dark.svg',
	TRADE_HISTORY_LIGHT: '/assets/icons/trade-history-light.svg',
	ACTIVE_TRADE_DARK: '/assets/icons/active-trade-dark.svg',
	ACTIVE_TRADE_LIGHT: '/assets/icons/active-trade-light.svg',
	DEMO_LOGIN_ICON_DARK: '/assets/icons/demo-login-icon-dark.svg',
	DEMO_LOGIN_ICON_LIGHT: '/assets/icons/demo-login-icon-light.svg',
	CANCEL_WITHDRAW_DARK: '/assets/icons/cancel-withdraw-dark-02-03.svg',
	CANCEL_WITHDRAW_LIGHT: '/assets/icons/cancel-withdraw-light-02.svg',
	BTC_ICON_DARK: '/assets/icons/btc-icon-dark-01.svg',
	BTC_ICON: '/assets/icons/btc-icon-01.svg',
	ETH_ICON: '/assets/icons/eth-icon-01.svg',
	ETH_ICON_DARK: '/assets/icons/eth-icon-dark-01.svg',
	EUR_ICON: '/assets/icons/eur-icon.svg',
	LIFESAVER: '/assets/acounts/account-icons-05.svg',
	CONTACT_US_ICON: '/assets/acounts/help-contact-us-01.svg',
	QUESTION_MARK: '/assets/icons/question-mark-black.svg',
	QUESTION_MARK_COLOR: '/assets/icons/question-mark-color.svg',
	LAPTOP: '/assets/icons/compute-play-black.svg',
	LAPTOP_COLOR: '/assets/icons/compute-play-color.svg',
	TELEGRAM: '/assets/icons/telegram-black.svg',
	TELEGRAM_COLOR: '/assets/icons/telegram-color.svg',
	BCH_ICON: '/assets/icons/bch-icon.svg',
	BCH_ICON_DARK: '/assets/icons/bch-icon.svg',
	BCH_NAV_ICON: '/assets/icons/bch-icon-nav.svg',
	XRP_ICON: '/assets/icons/xrp-icon-01.svg',
	XRP_ICON_DARK: '/assets/icons/xrp-icon-01.svg',
	XRP_NAV_ICON: '/assets/icons/xrp-icon-01.svg',
	KRW_ICON: '/assets/icons/krw-icon-01.svg',
	XHT_ICON: '/assets/icons/xht-icon.svg',
	XHT_ICON_DARK: '/assets/icons/xht-icon-dark.svg',
	XMR_ICON: '/assets/icons/xmr-icon.svg',
	XMR_ICON_DARK: '/assets/icons/xmr-icon-dark.svg',
	USDT_ICON: '/assets/icons/usdt-icon.svg',
	CHECK: '/assets/images/Orderbook scrolling-01.svg',
	DARK_CHECK: '/assets/images/dark-Orderbook-scrolling-01.svg',
	BLUE_QUESTION: '/assets/acounts/account-icons-08.svg',
	RED_WARNING: '/assets/acounts/account-icons-09.svg',
	GENDER_F: '/assets/acounts/account-icons-10.svg',
	GENDER_M: '/assets/acounts/account-icons-11.svg',
	GENDER_FEMALE: '/assets/acounts/account-icons-26.svg',
	GENDER_MALE: '/assets/acounts/account-icons-27.svg',
	BITCOIN_CLEAR: '/assets/acounts/account-icons-13.svg',
	RED_ARROW: '/assets/acounts/account-icons-16.svg',
	BLUE_CLIP: '/assets/acounts/account-icons-17.svg',
	BLACK_CHECK: '/assets/acounts/account-icons-19.svg',
	KEYS: '/assets/acounts/account-icons-22.svg',
	OTP_KEYS: '/assets/acounts/account-icons-29.svg',
	GREEN_CHECK: '/assets/acounts/account-icons-23.svg',
	LETTER: '/assets/acounts/account-icons-24.svg',
	SQUARE_DOTS: '/assets/acounts/account-icons-25.svg',
	OTP_CODE: '/assets/acounts/account-icons-28.svg',
	COPY_NEW: '/assets/images/copy.svg',
	COPY_NOTIFICATION: '/assets/images/copy-icon-snack-notification.svg',
	ACCOUNT_LINE: '/assets/images/account.svg',
	ACCOUNT_RECOVERY: '/assets/images/account-recovery.svg',
	BITCOIN_WALLET: '/assets/images/bitcoin-wallet.svg',
	CHECK_SENDING_BITCOIN: '/assets/images/check-sending-bitcoin.svg',
	DATA: '/assets/images/data.svg',
	DEPOSIT_BITCOIN: '/assets/images/deposit-bitcoin-dark-theme.svg',
	DEPOSIT_HISTORY: '/assets/images/deposit-history.svg',
	DEPOSIT_HISTORY_GREY: '/assets/images/deposit-history-grey.svg',
	DEPOSIT_RECEIVED_BITCOIN: '/assets/images/deposit-received-bitcoin.svg',
	DEPOSIT_SUCCESS: '/assets/images/D-W-Success.svg',
	WITHDRAWAL_SUCCESS: '/assets/images/D-W-Success.svg',
	EMAIL: '/assets/images/email.svg',
	EMAIL_SENT: '/assets/images/email-sent.svg',
	OTP_DOTS: '/assets/images/f2fa-pin.svg',
	DEPOSIT_BASE: '/assets/images/fiat-deposit.svg',
	DEPOSIT_BASE_COIN_COMPLETE: '/assets/images/fiat-deposit-completed.svg',
	BASE_WALLET: '/assets/images/fiat-wallet.svg',
	GEAR_BLACK: '/assets/images/gear.svg',
	GEAR_GREY: '/assets/images/gear-grey.svg',
	HELP_ICON: '/assets/images/help.svg',
	ID_BLACK: '/assets/images/id.svg',
	ID_GREY: '/assets/images/id-grey.svg',
	INCOMING_BITCOIN: '/assets/images/Incoming-bitcoin.svg',
	INCOMING_BTC: '/assets/images/incoming-btc.svg',
	INCOMING_TOMAN: '/assets/images/incoming-toman.svg',
	LICENSE: '/assets/images/licence.svg',
	LIQUID: '/assets/images/liquid.svg',
	MARGIN: '/assets/images/margin.svg',
	PASSWORD_RESET: '/assets/images/password-reset.svg',
	PAYMENT_OPTIONS: '/assets/images/payment-options.svg',
	QUICK_TRADE: '/assets/images/quick-trade.svg',
	QUICK_TRADE_TAB: '/assets/images/quick-trade-tab.svg',
	QUICK_TRADE_TAB_ACTIVE: '/assets/images/quick-trade-tab-active.svg',
	SECURE: '/assets/images/secure.svg',
	SECURITY_BLACK: '/assets/images/security.svg',
	SECURITY_GREY: '/assets/images/security-grey.svg',
	SET_NEW_PASSWORD: '/assets/images/set-new-password.svg',
	SUCCESS_BLACK: '/assets/images/success-black.svg',
	TRADE_HISTORY: '/assets/images/trade-history.svg',
	TRADE_HISTORY_GREY: '/assets/images/trade-history-grey.svg',
	TRADES_ICON: '/assets/images/trade-history.svg',
	TRADE_SUCCESS: '/assets/images/trade-success.svg',
	TRANSACTION_HISTORY: '/assets/images/transaction-history.svg',
	UPDATE_QUICK_TRADE: '/assets/images/update-quick-trade.svg',
	VERIFICATION_SENT: '/assets/images/resend-email-light.svg',
	VERIFICATION_SENT_DARK: '/assets/images/resend-email.svg',
	WITHDRAW: '/assets/images/withdraw.svg',
	WITHDRAW_HISTORY: '/assets/images/withdraw-history.svg',
	WITHDRAW_HISTORY_GREY: '/assets/images/withdraw-history-grey.svg',
	BLUE_ARROW_LEFT: '/assets/images/blue-arrow-left.svg',
	BLUE_ARROW_RIGHT: '/assets/images/blue-arrow-right.svg',
	SESSION_TIMED_OUT: '/assets/images/session-timed-out.svg',
	BLUE_EDIT: '/assets/images/blue-edit-exir-icon.svg',
	BLUE_PLUS: '/assets/images/max-plus-blue-icon.svg',
	BLUE_TIMER: '/assets/images/timer-icon.svg',
	DROPDOWN_ARROW: '/assets/images/down-arrow-home.svg',
	NOTIFICATION_ORDER_LIMIT_BUY_FILLED:
		'/assets/images/limit-buy-order-filled-01.svg',
	NOTIFICATION_ORDER_LIMIT_BUY_CREATED:
		'/assets/images/limit-buy-order-icon-01.svg',
	NOTIFICATION_ORDER_LIMIT_BUY_FILLED_PART:
		'/assets/images/limit-buy-order-part-filled-01.svg',
	NOTIFICATION_ORDER_LIMIT_SELL_FILLED:
		'/assets/images/limit-sell-order-filled-01.svg',
	NOTIFICATION_ORDER_LIMIT_SELL_CREATED:
		'/assets/images/limit-sell-order-icon-01.svg',
	NOTIFICATION_ORDER_LIMIT_SELL_FILLED_PART:
		'/assets/images/limit-sell-order-part-filled-01.svg',
	NOTIFICATION_ORDER_MARKET_BUY_FILLED: '/assets/images/market-buy-01.svg',
	NOTIFICATION_ORDER_MARKET_SELL_FILLED: '/assets/images/market-sell-01.svg',
	NOTIFICATION_VERIFICATION_WARNING: '/assets/images/verification.svg',
	LOGOUT_ARROW: '/assets/images/logout-arrow-active.svg',
	LOGOUT_ARROW_GREY: '/assets/images/logout-arrow.svg',
	VERIFICATION_WARNING: '/assets/images/astrics.svg',
	VERIFICATION_SUCCESS: '/assets/images/success-check-box.svg',
	VERIFICATION_DOC: '/assets/images/doc.svg',
	VERIFICATION_DOC_INACTIVE: '/assets/images/doc-inactive.svg',
	VERIFICATION_EMAIL: '/assets/images/email_2.svg',
	VERIFICATION_EMAIL_INACTIVE: '/assets/images/email-inactive.svg',
	VERIFICATION_MOBILE: '/assets/images/mobile.svg',
	VERIFICATION_MOBILE_INACTIVE: '/assets/images/mobile-inactive.svg',
	VERIFICATION_BANK: '/assets/images/bank.svg',
	VERIFICATION_BANK_INACTIVE: '/assets/images/bank-inactive.svg',
	VERIFICATION_ID: '/assets/images/id_2.svg',
	VERIFICATION_ID_INACTIVE: '/assets/images/id_2-inactive.svg',
	COIN_WITHDRAW_BTC: '/assets/images/coin-withdraw-btc.svg',
	COIN_WITHDRAW_TOMAN: '/assets/images/coin-withdraw-tom.svg',
	LOGOUT_DOOR_ACTIVE: '/assets/images/logout-door-active.svg',
	LOGOUT_DOOR_INACTIVE: '/assets/images/logout-door-inactive.svg',
	CANCEL_CROSS_ACTIVE: '/assets/images/cancel-cross-active.svg',
	CANCEL_CROSS_INACTIVE: '/assets/images/cancel-cross-inactive.svg',
	SIDEBAR_WALLET_ACTIVE_1: '/assets/images/wallet-active.svg',
	SIDEBAR_WALLET_INACTIVE_1: '/assets/images/wallet-inactive.svg',
	SIDEBAR_WALLET_ACTIVE: '/assets/images/wallet-selected.svg',
	SIDEBAR_WALLET_INACTIVE: '/assets/images/wallet.svg',
	SIDEBAR_ACCOUNT_ACTIVE: '/assets/images/account_2-active.svg',
	SIDEBAR_ACCOUNT_INACTIVE: '/assets/images/account_2-inactive.svg',
	SIDEBAR_HOME_ACTIVE: '/assets/images/home-active.svg', // new
	SIDEBAR_HOME_ACTIVE_INACTIVE: '/assets/images/home-tab-inactive.svg', // new
	SIDEBAR_POST_ACTIVE: '/assets/images/post-active.svg',
	SIDEBAR_POST_INACTIVE: '/assets/imagespost-inactive.svg',
	SIDEBAR_TRADING_ACTIVE: '/assets/images/trade-active.svg',
	SIDEBAR_TRADING_INACTIVE: '/assets/images/trade-inactive.svg',
	SIDEBAR_QUICK_TRADING_ACTIVE:
		'/assets/images/quick-trade-tab-selected-01.svg',
	SIDEBAR_QUICK_TRADING_INACTIVE: '/assets/images/quick-trade-tab-01-01.svg',
	SIDEBAR_ADMIN_DASH_ACTIVE: '/assets/images/admin-dash-icon.svg',
	ARROW_TRANSFER_HISTORY_ACTIVE:
		'/assets/images/arrow-trans-history-active.svg',
	ARROW_TRANSFER_HISTORY_INACTIVE: '/assets/images/arrow-trans-history.svg',
	ARROW_DOWN: '/assets/images/arrow-down.svg',
	TOKENS_INACTIVE: '/assets/images/dev-icon.svg',
	TOKENS_ACTIVE: '/assets/images/dev-icon.svg',
	TOKEN_REVOKED: '/assets/images/api-key-revoked.svg',
	TOKEN_ACTIVE: '/assets/images/api-key-active.svg',
	TOKEN_TRASHED: '/assets/images/api-key-trashed.svg',
	TOKEN_GENERATE: '/assets/images/api-key-generate.svg',
	TOKEN_GENERATE_DARK: '/assets/images/api-key-generate-dark.svg',
	TOKEN_CREATED: '/assets/images/api-key-created.svg',
	TOKEN_CREATED_DARK: '/assets/images/api-key-created-dark.svg',
	CHECK_ORDER: '/assets/images/check-order-popup-01.svg',
	ITEM_OPTIONS: '/assets/images/item-options.svg',
	DOTTED_GRIP: '/assets/images/dotted-grip-chat-repeat-pattern.svg',
	CHAT: '/assets/images/chat-icon.svg',
	WITHDRAW_MAIL_CONFIRMATION: '/assets/images/withdraw-mail-confirmation.svg',
	CLOSE_CROSS: '/assets/images/close-cross-tab.svg',
	TAB_PLUS: '/assets/images/tab-plus.svg',
	TAB_MINUS: '/assets/images/tab-minus.svg',
	TAB_SUMMARY: '/assets/images/tab-summary.svg',
	TAB_WALLET: '/assets/images/tab-wallet.svg',
	TAB_SECURITY: '/assets/images/tab-security.svg',
	TAB_VERIFY: '/assets/images/tab-verify.svg',
	TAB_SETTING: '/assets/images/tab-setting.svg',
	TAB_API: '/assets/images/tab-api.svg',
	TRADE_FILLED_SUCESSFUL: '/assets/images/Orderbook scrolling-01.svg',
	TRADE_PARTIALLY_FILLED: '/assets/images/part-fill.svg',
	TAB_SIGNOUT: '/assets/images/signout.svg',
	DOUBLE_ARROW: '/assets/images/double-arrow.svg',
	SEARCH: '/assets/images/search.svg',
	VERIFICATION_DOC_STATUS: '/assets/images/verification-doc-status.svg',
	VERIFICATION_PENDING: '/assets/images/verification-pending-orange.svg',
	VERIFICATION_REJECTED:
		'/assets/images/verification-rejected-yellow-cross.svg',
	VERIFICATION_INCOMPLETE: '/assets/images/verification-attention-red.svg',
	VERIFICATION_VERIFIED: '/assets/images/verification-green-tick.svg',
	VERIFICATION_EMAIL_NEW: '/assets/images/verification-email.svg',
	VERIFICATION_PHONE_NEW: '/assets/images/verification-phone.svg',
	VERIFICATION_ID_NEW: '/assets/images/verification-id.svg',
	VERIFICATION_BANK_NEW: '/assets/images/verification-bank.svg',
	VERIFICATION_DOCUMENT_NEW: '/assets/images/verification-document.svg',
	PENDING_TIMER: '/assets/images/pending-timer.svg',
	VOLUME_PENDING: '/assets/images/volume-pending-icon.svg',
	VOLUME_PENDING_DARK: '/assets/images/volume-pending-dark.svg',
	SELF_KYC_ID_EN: '/assets/self-kyc-id-note-english.png',
	CHAT_ICON_LVL_3: '/assets/images/kraken-chat-lvl-3.svg',
	CHAT_ICON_LVL_4: '/assets/images/whale-chat-lvl-4.svg',
	CHAT_ICON_SPECIAL: '/assets/images/fin-chat-special.svg',
	NOTE_KYC: '/assets/images/note-KYC.svg',
	SIDEBAR_CHAT: '/assets/images/bottom-chat-icon.svg',
	SIDEBAR_HELP: '/assets/images/help-question-mark-icon.svg',
	CONNECT_LOADING: '/assets/images/connect-loading.svg',
	KRAKEN: '/assets/images/cunning-blue-kraken-trader.svg',
	SNAPPER: '/assets/images/little-red-snapper-trader.svg',
	SHRIMP: '/assets/images/tiny-pink-shrimp-trader.svg',
	LEVIATHAN: '/assets/images/black-leviathan-trader.svg',
	SETTING_NOTIFICATION_ICON: '/assets/images/notification-settings-icon.svg',
	SETTING_INTERFACE_ICON: '/assets/images/interface-settings-icon.svg',
	SETTING_LANGUAGE_ICON: '/assets/images/language-settings-icon.svg',
	SETTING_CHAT_ICON: '/assets/images/chat-settings-icon.svg',
	SETTING_AUDIO_ICON: '/assets/images/audio-settings-icon.svg',
	SETTING_RISK_ICON: '/assets/images/risk-settings-icon.svg',
	SETTING_RISK_ADJUST_ICON: '/assets/images/risk-management-pop-adjust.svg',
	SETTING_RISK_MANAGE_WARNING_ICON:
		'/assets/images/risk-manage-pop-warning.svg',
	REFER_ICON: '/assets/images/refer-icon.svg',
	EDIT_ICON: '/assets/images/edit-icon.svg',
	STAKETOKEN_ICON: '/assets/images/stake.svg',
	DEFAULT_ICON: '/assets/icons/missing-coin-light.svg',
	DEFAULT_ICON_DARK: '/assets/icons/missing-coin-dark.svg',
	EXPIRED_ICON: '/assets/images/expired.svg',
	LEVEL_ACCOUNT_ICON_1: '/assets/images/level-1.svg',
	LEVEL_ACCOUNT_ICON_2: '/assets/images/level-2.svg',
	LEVEL_ACCOUNT_ICON_3: '/assets/images/level-3.svg',
	LEVEL_ACCOUNT_ICON_4: '/assets/images/level-4.svg',
	LEVEL_ACCOUNT_ICON_5: '/assets/images/level-5.svg',
	LEVEL_ACCOUNT_ICON_6: '/assets/images/level-6.svg',
	LEVEL_ACCOUNT_ICON_7: '/assets/images/level-7.svg',
	LEVEL_ACCOUNT_ICON_8: '/assets/images/level-8.svg',
	LEVEL_ACCOUNT_ICON_9: '/assets/images/level-9.svg',
	LEVEL_ACCOUNT_ICON_10: '/assets/images/level-10.svg',
	HAP_ACCOUNT_ICON: '/assets/icons/hap-account-icon.svg',
	ACCOUNT_SUMMARY: '/assets/icons/account-icon-summary.svg',
	XHT_COIN_STACK: '/assets/images/XHT-coin-stack.svg',
	XHT_DOCS: '/assets/images/XHT-docs.svg',
	XHT_WAVES: '/assets/images/wave-icon.svg',
	XHT_EMAIL: '/assets/images/XHT-email.svg',
	XHT_FAQ: '/assets/images/XHT-FAQ.svg',
	XHT_PDF: '/assets/images/XHT-pdf.svg',
	REFERRAL_SUCCESS: '/assets/icons/send-request.svg',
	INCOMING_WAVE: '/assets/images/incoming-wave.svg',
	TRADE_ANNOUNCEMENT: '/assets/images/announcement.svg',
	CHAT_EMOJI: '/assets/icons/emoji-face-icon.svg',
	TRADE_SETTINGS: '/assets/images/spanner.svg',
	TRADE_WAVES: '/assets/images/wave-icon.svg',
	XHT_LOGO_LIGHT: '/assets/icons/XHT-logo-light.svg',
	XHT_LOGO_DARK: '/assets/icons/XHT-logo-dark.svg',
	BONUS_OFFERING: '/assets/icons/bonus_offering.svg',
	UP_ARROW: '/assets/images/buy-trade.svg',
	DOWN_ARROW: '/assets/images/sell-trade.svg',
	MOON_THEME: '/assets/icons/moon-theme.svg',
	SUN_THEME: '/assets/icons/sun-theme.svg',
	PLUGINS_CHAT: '/assets/plugins/plugin-chat.png',
	PLUGINS_FRESHDESK: '/assets/plugins/plugin-freshdesk.png',
	PLUGINS_LIQUIDITY: '/assets/plugins/plugin-liquidity.png',
	PLUGINS_SHUFTI: '/assets/plugins/plugin-shufti.png',
	PLUGINS_SMS: '/assets/plugins/plugin-sms.png',
	PLUGINS_VERIFICATION: '/assets/plugins/plugin-verification.png',
	PLUGINS_ZENDESK: '/assets/plugins/plugin-zendesk.png',
	PLUGINS_BANK: '/assets/plugins/plugin-bank.png',
	PLUGINS_VAULT: '/assets/plugins/plugin-vault.png',
	DEFAULT_PLUGINS: '/assets/plugins/default-plugin.png'
};

export const SOCIAL_ICONS = {
	FACEBOOK: '/assets/icons/facebook.png',
	LINKEDIN: '/assets/icons/linkedin.png',
	TWITTER: '/assets/icons/twitter.png',
	INSTAGRAM: '/assets/icons/instagram.svg',
	TELEGRAM: '/assets/icons/telegram.png',
	GOOGLE: '/assets/icons/google.png'
};

export const FEATURES_ICONS = {
	PRO_TRADING: '/assets/images/features-pro-trade-icons.svg',
	PAYMENT: '/assets/images/features-payment-card-icons.svg',
	SECURITY: '/assets/images/features-lock-icons.svg',
	REPORTING: '/assets/images/features-data-icons.svg',
	SUPPORT: '/assets/images/features-support-icons.svg',
	LEGAL: '/assets/images/features-legal-icons.svg'
};

export const SUMMMARY_ICON = {
	LEVEL_1: '/assets/summary/level-1.png',
	LEVEL_1_DARK: '/assets/summary/level-1-dark.png',
	LEVEL_2: '/assets/summary/level-2.png',
	LEVEL_2_DARK: '/assets/summary/level-2-dark.png',
	LEVEL_3: '/assets/summary/level-3.png',
	LEVEL_3_DARK: '/assets/summary/level-3-dark.png',
	LEVEL_4: '/assets/summary/level-4.png',
	LEVEL_4_DARK: '/assets/summary/level-4-dark.png'
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
	TIME_OUT_QUICK_TRADE: '/assets/audio/time-out-quick-trade.wav'
};

export const CURRENCY_PRICE_FORMAT = '{0} {1}';
// this DEFAULT_COIN_PAIR to prevent from error while irrelevant BASE_CURRENCY
export const DEFAULT_COIN_DATA = {
	fullname: '',
	symbol: '',
	min: 0.001
};

export const DEFAULT_PAIR = 'btc-usdt';

export const FLEX_CENTER_CLASSES = [
	'd-flex',
	'justify-content-center',
	'align-items-center'
];

export const TIMESTAMP_FORMAT = STRINGS.TIMESTAMP_FORMAT;
export const HOUR_FORMAT = STRINGS.HOUR_FORMAT;

// Default trading pairs (it is set from the server so it is not important to set these properly)
export const DEFAULT_TRADING_PAIRS = ['xht-usdt'];

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
export const takerFee = 0;

export const BANK_PAYMENT_LINK = '';
export const MIN_VERIFICATION_LEVEL_TO_WITHDRAW = 2;
export const MAX_VERIFICATION_LEVEL_TO_WITHDRAW = 5;

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
		default:
			endpoint =
				NETWORK === 'testnet'
					? 'https://ropsten.etherscan.io/tx/'
					: 'https://etherscan.io/tx/';
			break;
	}
	return endpoint;
};

export const BALANCE_ERROR = 'Insufficient balance to perform the order';

export const CAPTCHA_SITEKEY =
	process.env.REACT_APP_CAPTCHA_SITE_KEY ||
	'6LeuOKoUAAAAAGVoZcSWXJH60GHt4crvIaNXn1YA'; // default recaptcha v3; // default recaptcha v3

export const CAPTCHA_TIMEOUT = process.env.REACT_APP_CAPTCHA_TIMEOUT
	? parseInt(process.env.REACT_APP_CAPTCHA_TIMEOUT, 10)
	: 2000;

export const TIME_ZONE = process.env.REACT_APP_TIMEZONE || 'GMT';
export const TOKEN_EMAIL = 'token::email';
export const TOKEN_MAX_AGE = 23 * 60 * 60;

export const DISPLAY_LANDING = false;
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

export const BASE_CURRENCY = process.env.REACT_APP_BASE_CURRENCY
	? process.env.REACT_APP_BASE_CURRENCY.toLowerCase()
	: 'usdt';

export const FEES_LIMIT_SITE_URL = 'https://www.hollaex.com';
export const API_DOCS_URL = 'https://docs.bitholla.com/';
export const EXCHANGE_URL = 'https://dash.bitholla.com/';
export const EXCHANGE_EXPIRY_DAYS = 15;
export const EXCHANGE_EXPIRY_SECONDS = EXCHANGE_EXPIRY_DAYS * 86400;
export const SUPPORT_HELP_URL =
	'https://info.hollaex.com/hc/en-us/requests/new';
export const REQUEST_VAULT_SUPPORTED_COINS = 'https://api.bitholla.com/v1/vault/coins';
export const ADMIN_GUIDE_DOWNLOAD_LINK = 'https://bitholla.s3.ap-northeast-2.amazonaws.com/kit/Admin+panel+manual.pdf';
	
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
	{ key: 12, value: 'Dec' }
];

export const DARK_THEME_COLORS = {
	border_main: '#b7b5cd',
	sub_text: '#a3a1ca',
	sub_text_1: '#808184'
};

export const WHITE_THEME_COLORS = {
	border_main: '#000000',
	sub_text: '#000000',
	sub_text_1: '#000000'
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
	SELL_VOLUME: '#f69321'
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
	SELL_VOLUME: '#ed1c24'
};

export const SHOW_SUMMARY_ACCOUNT_DETAILS = false;
export const SHOW_TOTAL_ASSETS = false;
export const IS_XHT = false;
export const FIT_SCREEN_HEIGHT = ['trade'];
export const SIMPLE_FORMAT_MIN = '0.1';
