import flatten from 'flat';

const options = { safe: true, delimiter: '_' };
const nestedIcons = {
	EXCHANGE: {
		LOGO: '',
		FAV_ICON: '/favicon.ico',
		LOADER: '/assets/loader-dark.gif',
		BOARDING_IMAGE: '/assets/dark-background.jpg',
		LANDING_PAGE: '/assets/images/hollaex-background.png',
	},

	TRADE: {
		HISTORY: '/assets/images/trade-history.svg',
	},

	QUICK_TRADE: {
		ICON: '/assets/images/quick-trade.svg',
		TAB_ACTIVE: '/assets/images/quick-trade-tab-active.svg',
		INSUFFICIENT_FUND: '/assets/icons/quick-trade-insufficient-funds.svg',
		SUCCESSFUL: '/assets/icons/quick-trade-success-coin-pile.svg',
	},

	GENDER: {
		FEMALE: '/assets/acounts/account-icons-10.svg',
		MALE: '/assets/acounts/account-icons-11.svg',
	},

	THEME: {
		MOON: '/assets/icons/moon-theme.svg',
		SUN: '/assets/icons/sun-theme.svg',
	},

	TAB: {
		PLUS: '/assets/images/tab-plus.svg',
		SUMMARY: '/assets/images/tab-summary.svg',
		HISTORY: '/assets/images/tab-history.svg',
		WALLET: '/assets/images/tab-wallet.svg',
		SECURITY: '/assets/images/tab-security.svg',
		VERIFY: '/assets/images/tab-verify.svg',
		SETTING: '/assets/images/tab-setting.svg',
		API: '/assets/images/tab-api.svg',
	},

	TOKEN: {
		TOKENS_INACTIVE: '/assets/images/dev-icon.svg',
		TOKENS_ACTIVE: '/assets/images/dev-icon.svg',
		REVOKED: '/assets/images/api-key-revoked.svg',
		ACTIVE: '/assets/images/api-key-active.svg',
		TRASHED: '/assets/images/api-key-trashed.svg',
		GENERATE: '/assets/images/api-key-generate.svg',
		CREATED: '/assets/images/api-key-created.svg',
	},

	VERIFICATION: {
		WARNING: '/assets/images/astrics.svg',
		SUCCESS: '/assets/images/success-check-box.svg',
		DOC_STATUS: '/assets/images/verification-doc-status.svg',
		EMAIL_NEW: '/assets/images/verification-email.svg',
		PHONE_NEW: '/assets/images/verification-phone.svg',
		ID_NEW: '/assets/images/verification-id.svg',
		BANK_NEW: '/assets/images/verification-bank.svg',
		DOCUMENT_NEW: '/assets/images/verification-document.svg',
	},

	SETTING: {
		NOTIFICATION_ICON: '/assets/images/notification-settings-icon.svg',
		INTERFACE_ICON: '/assets/images/interface-settings-icon.svg',
		LANGUAGE_ICON: '/assets/images/language-settings-icon.svg',
		CHAT_ICON: '/assets/images/chat-settings-icon.svg',
		AUDIO_ICON: '/assets/images/audio-settings-icon.svg',
		RISK_ICON: '/assets/images/risk-settings-icon.svg',
		RISK_ADJUST_ICON: '/assets/images/risk-management-pop-adjust.svg',
		RISK_MANAGE_WARNING_ICON: '/assets/images/risk-manage-pop-warning.svg',
	},

	SECURITY: {
		OTP_ICON: '/assets/images/2fa-security-icon.svg',
		CHANGE_PASSWORD_ICON: '/assets/images/password-security-icon.svg',
		API_ICON: '/assets/images/api-security-icon.svg',
	},

	LEVEL_ACCOUNT: {
		ICON_1: '/assets/images/level-1.svg',
		ICON_2: '/assets/images/level-2.svg',
		ICON_3: '/assets/images/level-3.svg',
		ICON_4: '/assets/images/level-4.svg',
		ICON_5: '/assets/images/level-5.svg',
		ICON_6: '/assets/images/level-6.svg',
		ICON_7: '/assets/images/level-7.svg',
		ICON_8: '/assets/images/level-8.svg',
		ICON_9: '/assets/images/level-9.svg',
		ICON_10: '/assets/images/level-10.svg',
	},

	FEATURES: {
		PRO_TRADING: '/assets/images/features-pro-trade-icons.svg',
		PAYMENT: '/assets/images/features-payment-card-icons.svg',
		SECURITY: '/assets/images/features-lock-icons.svg',
		REPORTING: '/assets/images/features-data-icons.svg',
		SUPPORT: '/assets/images/features-support-icons.svg',
		LEGAL: '/assets/images/features-legal-icons.svg',
	},

	SOCIAL: {
		FACEBOOK: '/assets/icons/facebook.png',
		LINKEDIN: '/assets/icons/linkedin.png',
		TWITTER: '/assets/icons/twitter.png',
		INSTAGRAM: '/assets/icons/instagram.svg',
		TELEGRAM: '/assets/icons/telegram.png',
		GOOGLE: '/assets/icons/google.png',
		YOUTUBE: '/assets/icons/youtube.png',
	},

	SUMMARY: {
		LEVEL_1: '/assets/summary/level-1-dark.png',
		LEVEL_2: '/assets/summary/level-2-dark.png',
		LEVEL_3: '/assets/summary/level-3-dark.png',
		LEVEL_4: '/assets/summary/level-4-dark.png',
	},

	ARROW: {
		UP: '/assets/images/buy-trade.svg',
		DOWN: '/assets/images/sell-trade.svg',
		ARROW: '/assets/images/arrow-down.svg',
	},

	DEMO_LOGIN_ICON: '/assets/icons/demo-login-icon-dark.svg',
	CANCEL_WITHDRAW: '/assets/icons/cancel-withdraw-dark-02-03.svg',
	CONTACT_US_ICON: '/assets/acounts/help-contact-us-01.svg',
	QUESTION_MARK: '/assets/icons/question-mark-black.svg',
	LAPTOP: '/assets/icons/compute-play-black.svg',
	TELEGRAM: '/assets/icons/telegram-black.svg',

	OTP_ACTIVE: '/assets/icons/2fa-active.svg',
	OTP_DEACTIVATED: '/assets/icons/2fa-deactivated.svg',
	CHECK: '/assets/images/dark-Orderbook-scrolling-01.svg',
	BLUE_QUESTION: '/assets/acounts/account-icons-08.svg',
	RED_WARNING: '/assets/acounts/account-icons-09.svg',
	RED_ARROW: '/assets/acounts/account-icons-16.svg',
	BLUE_CLIP: '/assets/acounts/account-icons-17.svg',
	BLACK_CHECK: '/assets/acounts/account-icons-19.svg',
	UNDEFINED_ERROR: '/assets/acounts/unknown-error-icon-01.svg',

	OTP_KEYS: '/assets/acounts/account-icons-29.svg',
	GREEN_CHECK: '/assets/acounts/account-icons-23.svg',
	LETTER: '/assets/acounts/account-icons-24.svg',

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
	DEPOSIT_RECEIVED_BITCOIN: '/assets/images/deposit-received-bitcoin.svg',

	EMAIL_SENT: '/assets/images/email-sent.svg',

	DEPOSIT_BASE_COIN_COMPLETE: '/assets/images/fiat-deposit-completed.svg',

	GEAR_GREY: '/assets/images/gear-grey.svg',

	ID_GREY: '/assets/images/id-grey.svg',

	INCOMING_BTC: '/assets/images/incoming-btc.svg',
	INCOMING_TOMAN: '/assets/images/incoming-toman.svg',

	PASSWORD_RESET: '/assets/images/password-reset.svg',

	SECURE: '/assets/images/secure.svg',

	SECURITY_GREY: '/assets/images/security-grey.svg',
	SET_NEW_PASSWORD: '/assets/images/set-new-password.svg',
	SUCCESS_BLACK: '/assets/images/success-black.svg',

	TRANSACTION_HISTORY: '/assets/images/transaction-history.svg',

	VERIFICATION_SENT: '/assets/images/resend-email.svg',
	WITHDRAW: '/assets/images/withdraw.svg',
	WITHDRAW_HISTORY: '/assets/images/withdraw-history.svg',
	BLUE_ARROW_LEFT: '/assets/images/blue-arrow-left.svg',
	BLUE_ARROW_RIGHT: '/assets/images/blue-arrow-right.svg',
	SESSION_TIMED_OUT: '/assets/images/session-timed-out.svg',
	BLUE_EDIT: '/assets/images/blue-edit-exir-icon.svg',
	BLUE_PLUS: '/assets/images/max-plus-blue-icon.svg',
	BLUE_TIMER: '/assets/images/timer-icon.svg',

	NOTIFICATION_VERIFICATION_WARNING: '/assets/images/verification.svg',

	COIN_WITHDRAW_BTC: '/assets/images/coin-withdraw-btc.svg',
	LOGOUT_DOOR_INACTIVE: '/assets/images/logout-door-inactive.svg',
	CANCEL_CROSS_ACTIVE: '/assets/images/cancel-cross-active.svg',
	SIDEBAR_WALLET_ACTIVE: '/assets/images/wallet-selected.svg',
	SIDEBAR_ACCOUNT_ACTIVE: '/assets/images/account_2-active.svg',
	SIDEBAR_ACCOUNT_INACTIVE: '/assets/images/account_2-inactive.svg',
	SIDEBAR_POST_ACTIVE: '/assets/images/post-active.svg',
	SIDEBAR_TRADING_ACTIVE: '/assets/images/trade-active.svg',
	SIDEBAR_QUICK_TRADING_ACTIVE:
		'/assets/images/quick-trade-tab-selected-01.svg',
	SIDEBAR_QUICK_TRADING_INACTIVE: '/assets/images/quick-trade-tab-01-01.svg',
	SIDEBAR_ADMIN_DASH_ACTIVE: '/assets/images/admin-dash-icon.svg',
	ARROW_TRANSFER_HISTORY_ACTIVE:
		'/assets/images/arrow-trans-history-active.svg',

	CHECK_ORDER: '/assets/images/check-order-popup-01.svg',
	ITEM_OPTIONS: '/assets/images/item-options.svg',

	CHAT: '/assets/images/chat-icon.svg',
	WITHDRAW_MAIL_CONFIRMATION: '/assets/images/withdraw-mail-confirmation.svg',
	CLOSE_CROSS: '/assets/images/close-cross-tab.svg',

	TRADE_FILLED_SUCESSFUL: '/assets/images/Orderbook scrolling-01.svg',
	TRADE_PARTIALLY_FILLED: '/assets/images/part-fill.svg',
	TAB_SIGNOUT: '/assets/images/signout.svg',

	PENDING_TIMER: '/assets/images/pending-timer.svg',
	VOLUME_PENDING: '/assets/images/volume-pending-icon.svg',
	SELF_KYC_ID_EN: '/assets/self-kyc-id-note-english.png',

	NOTE_KYC: '/assets/images/note-KYC.svg',
	SIDEBAR_CHAT: '/assets/images/bottom-chat-icon.svg',
	SIDEBAR_HELP: '/assets/images/help-question-mark-icon.svg',
	CONNECT_LOADING: '/assets/images/connect-loading.svg',

	REFER_ICON: '/assets/images/refer-icon.svg',
	STAKETOKEN_ICON: '/assets/images/stake.svg',
	DEFAULT_ICON: '/assets/icons/missing-coin-light.svg',
	EXPIRED_ICON: '/assets/images/expired.svg',

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
	BONUS_OFFERING: '/assets/icons/bonus_offering.svg',

	CANCEL_ORDERS: '/assets/images/cancel-all-orders.svg',
	FIAT_UNDER_CONSTRUCTION: '/assets/icons/fiat-page-under-construction-01.svg',

	//should move this to the plugin itself once the functionality is added
	GENERATE_REFERENCE_NUMBER: '/assets/icons/generate-reference-number-01.svg',
	OSKO_LOGO: '/assets/icons/osko-logo.svg',
};

const icons = flatten(nestedIcons, options);

export default icons;
