import DarkIcons from './dark';
export { default as STATIC_ICONS } from './static';

const icons = {
	EXCHANGE_LOGO_LIGHT: '', //TODO: get logo, admin and calculated icons
	EXCHANGE_LOGO_DARK: '', //TODO: get logo, admin and calculated icons
	FAV_ICON: '/favicon.ico', //TODO: set
	LOADER_LIGHT: '/assets/loader-light.gif', //TODO: admin
	LOADER_DARK: '/assets/loader-dark.gif', //TODO: admin
	BOARDING_IMAGE_LIGHT: '/assets/background.png', //TODO: admin
	BOARDING_IMAGE_DARK: '/assets/dark-background.jpg', //TODO: admin

	// DEMO_LOGIN_ICON_DARK: '/assets/icons/demo-login-icon-dark.svg',
	// DEMO_LOGIN_ICON_LIGHT: '/assets/icons/demo-login-icon-light.svg',

	// CANCEL_WITHDRAW_DARK: '/assets/icons/cancel-withdraw-dark-02-03.svg',
	// CANCEL_WITHDRAW_LIGHT: '/assets/icons/cancel-withdraw-light-02.svg',

	// CONTACT_US_ICON: '/assets/acounts/help-contact-us-01.svg',
	// QUESTION_MARK: '/assets/icons/question-mark-black.svg',
	// LAPTOP: '/assets/icons/compute-play-black.svg',
	// TELEGRAM: '/assets/icons/telegram-black.svg',

	// CHECK: '/assets/images/Orderbook scrolling-01.svg',
	// DARK_CHECK: '/assets/images/dark-Orderbook-scrolling-01.svg',
	// BLUE_QUESTION: '/assets/acounts/account-icons-08.svg',
	// RED_WARNING: '/assets/acounts/account-icons-09.svg',
	// // GENDER_F: '/assets/acounts/account-icons-10.svg',
	// // GENDER_M: '/assets/acounts/account-icons-11.svg',
	// RED_ARROW: '/assets/acounts/account-icons-16.svg',
	// BLUE_CLIP: '/assets/acounts/account-icons-17.svg',
	// BLACK_CHECK: '/assets/acounts/account-icons-19.svg',

	// OTP_KEYS: '/assets/acounts/account-icons-29.svg',
	// GREEN_CHECK: '/assets/acounts/account-icons-23.svg',
	// LETTER: '/assets/acounts/account-icons-24.svg',
	//
	// OTP_CODE: '/assets/acounts/account-icons-28.svg',
	// COPY_NEW: '/assets/images/copy.svg',
	// COPY_NOTIFICATION: '/assets/images/copy-icon-snack-notification.svg',
	// ACCOUNT_LINE: '/assets/images/account.svg',
	// ACCOUNT_RECOVERY: '/assets/images/account-recovery.svg',
	// BITCOIN_WALLET: '/assets/images/bitcoin-wallet.svg',
	// CHECK_SENDING_BITCOIN: '/assets/images/check-sending-bitcoin.svg',
	// DATA: '/assets/images/data.svg',
	//
	// DEPOSIT_BITCOIN: '/assets/images/deposit-bitcoin-dark-theme.svg',
	// DEPOSIT_HISTORY: '/assets/images/deposit-history.svg',
	// DEPOSIT_RECEIVED_BITCOIN: '/assets/images/deposit-received-bitcoin.svg',
	//
	// EMAIL_SENT: '/assets/images/email-sent.svg',
	//
	// DEPOSIT_BASE_COIN_COMPLETE: '/assets/images/fiat-deposit-completed.svg',
	//
	// GEAR_GREY: '/assets/images/gear-grey.svg',
	//
	// ID_GREY: '/assets/images/id-grey.svg',
	//
	// INCOMING_BTC: '/assets/images/incoming-btc.svg',
	// INCOMING_TOMAN: '/assets/images/incoming-toman.svg',
	//
	// PASSWORD_RESET: '/assets/images/password-reset.svg',

	// all below icons are checked

	// QUICK_TRADE_ICON: '/assets/images/quick-trade.svg',
	// QUICK_TRADE_TAB_ACTIVE: '/assets/images/quick-trade-tab-active.svg',
	// QUICK_TRADE_INSUFFICIENT_FUND:
	// 	'/assets/icons/quick-trade-insufficient-funds.svg',
	// QUICK_TRADE_SUCCESSFUL: '/assets/icons/quick-trade-success-coin-pile.svg',

	// SECURE: '/assets/images/secure.svg',
	//
	// SECURITY_GREY: '/assets/images/security-grey.svg',
	// SET_NEW_PASSWORD: '/assets/images/set-new-password.svg',
	// SUCCESS_BLACK: '/assets/images/success-black.svg',
	// TRADE_HISTORY: '/assets/images/trade-history.svg',

	// TRANSACTION_HISTORY: '/assets/images/transaction-history.svg',
	//
	// VERIFICATION_SENT: '/assets/images/resend-email-light.svg',
	// VERIFICATION_SENT_DARK: '/assets/images/resend-email.svg',
	// WITHDRAW: '/assets/images/withdraw.svg',
	// WITHDRAW_HISTORY: '/assets/images/withdraw-history.svg',
	// BLUE_ARROW_LEFT: '/assets/images/blue-arrow-left.svg',
	// BLUE_ARROW_RIGHT: '/assets/images/blue-arrow-right.svg',
	// SESSION_TIMED_OUT: '/assets/images/session-timed-out.svg',
	// BLUE_EDIT: '/assets/images/blue-edit-exir-icon.svg',
	// BLUE_PLUS: '/assets/images/max-plus-blue-icon.svg',
	// BLUE_TIMER: '/assets/images/timer-icon.svg',
	//
	// NOTIFICATION_VERIFICATION_WARNING: '/assets/images/verification.svg',

	// VERIFICATION_WARNING: '/assets/images/astrics.svg',
	// VERIFICATION_SUCCESS: '/assets/images/success-check-box.svg',

	// COIN_WITHDRAW_BTC: '/assets/images/coin-withdraw-btc.svg',
	// LOGOUT_DOOR_INACTIVE: '/assets/images/logout-door-inactive.svg',
	// CANCEL_CROSS_ACTIVE: '/assets/images/cancel-cross-active.svg',
	// SIDEBAR_WALLET_ACTIVE: '/assets/images/wallet-selected.svg',
	// SIDEBAR_ACCOUNT_ACTIVE: '/assets/images/account_2-active.svg',
	// SIDEBAR_ACCOUNT_INACTIVE: '/assets/images/account_2-inactive.svg',
	// SIDEBAR_POST_ACTIVE: '/assets/images/post-active.svg',
	// SIDEBAR_TRADING_ACTIVE: '/assets/images/trade-active.svg',
	// SIDEBAR_QUICK_TRADING_ACTIVE:
	// 	'/assets/images/quick-trade-tab-selected-01.svg',
	// SIDEBAR_QUICK_TRADING_INACTIVE: '/assets/images/quick-trade-tab-01-01.svg',
	// SIDEBAR_ADMIN_DASH_ACTIVE: '/assets/images/admin-dash-icon.svg',
	// ARROW_TRANSFER_HISTORY_ACTIVE:
	// 	'/assets/images/arrow-trans-history-active.svg',
	// ARROW_ARROW: '/assets/images/arrow-down.svg',

	// TOKENS_INACTIVE: '/assets/images/dev-icon.svg',
	// TOKENS_ACTIVE: '/assets/images/dev-icon.svg',
	// TOKEN_REVOKED: '/assets/images/api-key-revoked.svg',
	// TOKEN_ACTIVE: '/assets/images/api-key-active.svg',
	// TOKEN_TRASHED: '/assets/images/api-key-trashed.svg',
	// TOKEN_GENERATE: '/assets/images/api-key-generate.svg',
	// TOKEN_GENERATE_DARK: '/assets/images/api-key-generate-dark.svg',
	// TOKEN_CREATED: '/assets/images/api-key-created.svg',
	// TOKEN_CREATED_DARK: '/assets/images/api-key-created-dark.svg',

	// CHECK_ORDER: '/assets/images/check-order-popup-01.svg',
	// ITEM_OPTIONS: '/assets/images/item-options.svg',
	//
	// CHAT: '/assets/images/chat-icon.svg',
	// WITHDRAW_MAIL_CONFIRMATION: '/assets/images/withdraw-mail-confirmation.svg',
	// CLOSE_CROSS: '/assets/images/close-cross-tab.svg',

	// TAB_PLUS: '/assets/images/tab-plus.svg',
	// TAB_SUMMARY: '/assets/images/tab-summary.svg',
	// TAB_HISTORY: '/assets/images/tab-history.svg',
	// TAB_WALLET: '/assets/images/tab-wallet.svg',
	// TAB_SECURITY: '/assets/images/tab-security.svg',
	// TAB_VERIFY: '/assets/images/tab-verify.svg',
	// TAB_SETTING: '/assets/images/tab-setting.svg',
	// TAB_API: '/assets/images/tab-api.svg',

	// TRADE_FILLED_SUCESSFUL: '/assets/images/Orderbook scrolling-01.svg',
	// TRADE_PARTIALLY_FILLED: '/assets/images/part-fill.svg',
	// TAB_SIGNOUT: '/assets/images/signout.svg',
	//
	// SEARCH: '/assets/images/search.svg',
	// VERIFICATION_DOC_STATUS: '/assets/images/verification-doc-status.svg',
	// VERIFICATION_PENDING: '/assets/images/verification-pending-orange.svg',
	// VERIFICATION_REJECTED:
	// 	'/assets/images/verification-rejected-yellow-cross.svg',
	// VERIFICATION_INCOMPLETE: '/assets/images/verification-attention-red.svg',
	// VERIFICATION_VERIFIED: '/assets/images/verification-green-tick.svg',
	// VERIFICATION_EMAIL_NEW: '/assets/images/verification-email.svg',
	// VERIFICATION_PHONE_NEW: '/assets/images/verification-phone.svg',
	// VERIFICATION_ID_NEW: '/assets/images/verification-id.svg',
	// VERIFICATION_BANK_NEW: '/assets/images/verification-bank.svg',
	// VERIFICATION_DOCUMENT_NEW: '/assets/images/verification-document.svg',
	// PENDING_TIMER: '/assets/images/pending-timer.svg',
	// VOLUME_PENDING: '/assets/images/volume-pending-icon.svg',
	// VOLUME_PENDING_DARK: '/assets/images/volume-pending-dark.svg',
	// SELF_KYC_ID_EN: '/assets/self-kyc-id-note-english.png',
	//
	// NOTE_KYC: '/assets/images/note-KYC.svg',
	// SIDEBAR_CHAT: '/assets/images/bottom-chat-icon.svg',
	// SIDEBAR_HELP: '/assets/images/help-question-mark-icon.svg',
	// CONNECT_LOADING: '/assets/images/connect-loading.svg',
	// SETTING_NOTIFICATION_ICON: '/assets/images/notification-settings-icon.svg',
	// SETTING_INTERFACE_ICON: '/assets/images/interface-settings-icon.svg',
	// SETTING_LANGUAGE_ICON: '/assets/images/language-settings-icon.svg',
	// SETTING_CHAT_ICON: '/assets/images/chat-settings-icon.svg',
	// SETTING_AUDIO_ICON: '/assets/images/audio-settings-icon.svg',
	// SETTING_RISK_ICON: '/assets/images/risk-settings-icon.svg',
	// SETTING_RISK_ADJUST_ICON: '/assets/images/risk-management-pop-adjust.svg',
	// SETTING_RISK_MANAGE_WARNING_ICON:
	// 	'/assets/images/risk-manage-pop-warning.svg',
	// REFER_ICON: '/assets/images/refer-icon.svg',
	// STAKETOKEN_ICON: '/assets/images/stake.svg',
	// DEFAULT_ICON: '/assets/icons/missing-coin-light.svg',
	// EXPIRED_ICON: '/assets/images/expired.svg',
	// LEVEL_ACCOUNT_ICON_1: '/assets/images/level-1.svg',
	// LEVEL_ACCOUNT_ICON_2: '/assets/images/level-2.svg',
	// LEVEL_ACCOUNT_ICON_3: '/assets/images/level-3.svg',
	// LEVEL_ACCOUNT_ICON_4: '/assets/images/level-4.svg',
	// LEVEL_ACCOUNT_ICON_5: '/assets/images/level-5.svg',
	// LEVEL_ACCOUNT_ICON_6: '/assets/images/level-6.svg',
	// LEVEL_ACCOUNT_ICON_7: '/assets/images/level-7.svg',
	// LEVEL_ACCOUNT_ICON_8: '/assets/images/level-8.svg',
	// LEVEL_ACCOUNT_ICON_9: '/assets/images/level-9.svg',
	// LEVEL_ACCOUNT_ICON_10: '/assets/images/level-10.svg',

	// All below icons are checked
	// HAP_ACCOUNT_ICON: '/assets/icons/hap-account-icon.svg',
	// ACCOUNT_SUMMARY: '/assets/icons/account-icon-summary.svg',
	// XHT_COIN_STACK: '/assets/images/XHT-coin-stack.svg',
	// XHT_DOCS: '/assets/images/XHT-docs.svg',
	// XHT_WAVES: '/assets/images/wave-icon.svg',
	// XHT_EMAIL: '/assets/images/XHT-email.svg',
	// XHT_FAQ: '/assets/images/XHT-FAQ.svg',
	// XHT_PDF: '/assets/images/XHT-pdf.svg',
	// REFERRAL_SUCCESS: '/assets/icons/send-request.svg',
	// INCOMING_WAVE: '/assets/images/incoming-wave.svg',
	// TRADE_ANNOUNCEMENT: '/assets/images/announcement.svg',
	// CHAT_EMOJI: '/assets/icons/emoji-face-icon.svg',
	// BONUS_OFFERING: '/assets/icons/bonus_offering.svg',

	// UP_ARROW: '/assets/images/buy-trade.svg',
	// DOWN_ARROW: '/assets/images/sell-trade.svg',
	// MOON_THEME: '/assets/icons/moon-theme.svg',
	// SUN_THEME: '/assets/icons/sun-theme.svg',

	// SOCIAL_ICONS: {
	// 	FACEBOOK: '/assets/icons/facebook.png',
	// 	LINKEDIN: '/assets/icons/linkedin.png',
	// 	TWITTER: '/assets/icons/twitter.png',
	// 	INSTAGRAM: '/assets/icons/instagram.svg',
	// 	TELEGRAM: '/assets/icons/telegram.png',
	// 	GOOGLE: '/assets/icons/google.png',
	// 	YOUTUBE: '/assets/icons/youtube.png',
	// },

	// FEATURES_ICONS: {
	// 	PRO_TRADING: '/assets/images/features-pro-trade-icons.svg',
	// 	PAYMENT: '/assets/images/features-payment-card-icons.svg',
	// 	SECURITY: '/assets/images/features-lock-icons.svg',
	// 	REPORTING: '/assets/images/features-data-icons.svg',
	// 	SUPPORT: '/assets/images/features-support-icons.svg',
	// 	LEGAL: '/assets/images/features-legal-icons.svg',
	// },

	// SUMMMARY_ICON: {
	// 	LEVEL_1: '/assets/summary/level-1.png',
	// 	LEVEL_1_DARK: '/assets/summary/level-1-dark.png',
	// 	LEVEL_2: '/assets/summary/level-2.png',
	// 	LEVEL_2_DARK: '/assets/summary/level-2-dark.png',
	// 	LEVEL_3: '/assets/summary/level-3.png',
	// 	LEVEL_3_DARK: '/assets/summary/level-3-dark.png',
	// 	LEVEL_4: '/assets/summary/level-4.png',
	// 	LEVEL_4_DARK: '/assets/summary/level-4-dark.png',
	// },
	...DarkIcons,
};

export default icons;
