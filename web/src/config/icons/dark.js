import flatten from 'flat';
import FIATS from './fiats';

const options = { safe: true, delimiter: '_' };
const nestedIcons = {
	FIATS,

	EXCHANGE: {
		LOGO: '',
		FAV_ICON: '/favicon.ico',
		LOADER: '/assets/dark-spinner.gif',
		BOARDING_IMAGE: '/assets/dark-background.jpg',
		LANDING_PAGE: '/assets/images/hollaex-background.png',
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
		APPS: '/assets/images/apps.svg',
		API: '/assets/images/tab-api.svg',
		STAKE: '/assets/images/stake-page-icon.svg',
		P2P: '/assets/images/p2p-feature.svg',
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
		USER_PAYMENT: '/assets/images/verification-bank.svg',
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

	APPS: {
		ALL: '/assets/images/all-apps.svg',
		USER: '/assets/images/my-apps.svg',
		CONFIGURE: '/assets/images/interface-settings-icon.svg',
		REMOVE: '/assets/images/cancel-cross-active.svg',
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

	DUST: {
		TITLE: '/assets/images/duster-wallet-sweeper.svg',
		CONFIRMATION: 'assets/images/sparkle-dust.svg',
		SUCCESSFUL: '/assets/images/dust-settlement-complete-sparkle.svg',
	},

	FEES_AND_LIMITS: {
		TRADING_FEES: '/assets/images/withdraw-tier-section.svg',
		WITHDRAWAL_FEES: '/assets/images/withdraw-tier-section.svg',
		WITHDRAWAL_LIMITS: '/assets/images/withdraw-tier-section.svg',
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
	EMAIL_CODE: '/assets/icons/send-email-code.svg',
	COPY_NEW: '/assets/images/copy.svg',
	COPY_NOTIFICATION: '/assets/images/copy-icon-snack-notification.svg',
	ACCOUNT_LINE: '/assets/images/account.svg',
	FOOTER_ACCOUNT_LINE: '/assets/images/account-summary-tab-01.svg',
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
	INCOMING_COIN: '/assets/images/incoming-coin.svg',

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
	BLUE_TRADE_ICON: '/assets/images/trade.svg',
	BLUE_EARN_ICON: '/assets/images/earn.svg',
	BLUE_PLUS: '/assets/images/max-plus-blue-icon.svg',
	BLUE_DEPOSIT_ICON: '/assets/images/blue-deposit-icon.svg',
	BLUE_WITHROW_ICON: '/assets/images/blue_withrow_icon.svg',
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
	FOOTER_TRADING_ACTIVE:
		'/assets/images/pro-trade-markets-mobile-tab-01 copy-01.svg',
	SIDEBAR_QUICK_TRADING_ACTIVE:
		'/assets/images/quick-trade-tab-selected-01.svg',
	FOOTER_QUICK_ACTIVE: '/assets/images/quick-trade-convert-mobile-tab-01.svg',
	SIDEBAR_QUICK_TRADING_INACTIVE: '/assets/images/quick-trade-tab-01-01.svg',
	SIDEBAR_ADMIN_DASH_ACTIVE: '/assets/images/admin-dash-icon.svg',
	ARROW_TRANSFER_HISTORY_ACTIVE: '/assets/images/arrow-trans-history.svg',

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
	SIDEBAR_HELP: '/assets/images/help-question-mark-icon.svg',
	FOOTER_PLUGIN: '/assets/images/card-active-plugin-mobile-tab-01.svg',
	CONNECT_LOADING: '/assets/images/connect-loading.svg',
	FIAT_KYC: '/assets/images/fiat-kyc.svg',

	REFER_ICON: '/assets/images/refer-icon.svg',
	REFER_DOLLAR_ICON: '/assets/images/referral-link-dollar-graphic.svg',
	NEW_REFER_ICON: '/assets/images/Group 5483.svg',
	STAKETOKEN_ICON: '/assets/images/stake.svg',
	STAKING_1: '/assets/images/staking_1.png',
	STAKING_2: '/assets/images/staking_2.svg',
	STAKING_3: '/assets/images/staking_3.svg',
	DEFAULT_ICON: '/assets/icons/coin-graphic-not-detected.svg',
	EXPIRED_ICON: '/assets/images/expired.svg',
	CHART_VIEW: '/assets/images/chart-view-mobile.svg',

	HAP_ACCOUNT_ICON: '/assets/icons/hap-account-icon.svg',
	ACCOUNT_SUMMARY: '/assets/icons/account-icon-summary.svg',
	XHT_COIN_STACK: '/assets/images/XHT-coin-stack.svg',
	XHT_DOCS: '/assets/images/XHT-docs.svg',
	XHT_WAVES: '/assets/images/wave-icon.svg',
	XHT_EMAIL: '/assets/images/XHT-email.svg',
	XHT_FAQ: '/assets/images/XHT-FAQ.svg',
	XHT_PDF: '/assets/images/XHT-pdf.svg',
	REFERRAL_SUCCESS: '/assets/icons/send-request.svg',
	TRADE_ANNOUNCEMENT: '/assets/images/announcement.svg',

	CANCEL_ORDERS: '/assets/images/cancel-all-orders.svg',
	FIAT_UNDER_CONSTRUCTION: '/assets/icons/fiat-page-under-construction-01.svg',

	STAKING_AMOUNT_MODAL: '/assets/stake/staking-modal-background.jpg',
	STAKING_PERIOD_ITEM: '/assets/stake/staking-period-option-background.jpg',
	STAKING_MODAL_BACKGROUND: '/assets/stake/modal_background.png',
	STAKING_SUCCESSFUL_MESSAGE: '/assets/stake/success_stake-unstake.png',
	STAKING_PANEL_BACKGROUND: '/assets/stake/success_stake-unstake.png',
	STAKING_ERROR: '/assets/stake/error.svg',
	STAKING_VARIABLE: '/assets/stake/variable_icon.svg',
	STAKING_UNLOCK: '/assets/stake/unlock-unstake-icon.svg',
	STAKING_BACKGROUND: '/assets/stake/stake-background.jpg',
	STAKING_CEFI_LOGO: '/assets/stake/Group 5977.svg',
	STAKING__LOCK: '/assets/stake/Group 5950.svg',
	META_MASK_NOT_FOUND: '/assets/icons/metamask-fox-stake-not-detected.svg',
	STAKING_ACCOUNT: '',
	METAMASK: '',
	MOVE_XHT: '/assets/stake/xht-move.svg',
	CONNECT_DESKTOP: '/assets/stake/connect-via-desktop.svg',
	SEARCH_BLOCKCHAIN: '/assets/images/search-blockchain.svg',
	ASSET_INFO_COIN: '/assets/images/digital-assets-coins.svg',
	GAINER_CARD_ICON: '/assets/images/gainer-arrow-up.svg',
	LOSER_CARD_ICON: '/assets/images/arrow-down-loser.svg',
	NEW_ASSET_CARD_ICON: '/assets/images/new-coin-bolt.svg',
	CLOCK: '/assets/images/clock.svg',
	REVOKE_SESSION: '/assets/images/signout.svg',

	//should move this to the plugin itself once the functionality is added
	GENERATE_REFERENCE_NUMBER: '/assets/icons/generate-reference-number-01.svg',
	OSKO_LOGO: '/assets/icons/osko-logo.svg',

	REFRESH_ICON: '/assets/icons/refresh-icon.svg',
	WALLET_GRAPHIC: '/assets/images/wallet-background-graphic-dark-theme.svg',
	WALLET_ARROW_DOWN: '/assets/images/deposit-arrow-down.svg',
	WALLET_ARROW_UP: '/assets/images/withdraw-arrow-up.svg',

	FOOTERBAR_ASSETS_TRADE: '/assets/images/asset-prices-mobile-tab-01.svg',
	WALLET_FOOTER: '/assets/images/wallet-mobile-tab-02-01 (1).svg',

	WITHDRAW_TITLE: '/assets/images/withdraw-out-box.svg',
	DEPOSIT_TITLE: '/assets/images/deposit-box.svg',

	ADDRESS_BOOK: '/assets/images/global-address-book.svg',
	CHAT_P2P_ICON: '/assets/images/chat-icon-p2p-02.svg',

	WITHDRAW_OPTION_ICON: '/assets/images/withdraw-option-icon.svg',
	BUY_CRYPTO_OPTION: '/assets/images/buy-crypto-option.svg',
	API_OPTION_ICON: '/assets/images/api-option-icon.svg',
	DEFI_STAKE_OPTION_ICON: '/assets/images/defi-stake.svg',
	CEFI_STAKE_OPTION_ICON: '/assets/images/cefi-stake.svg',
	PROFIT_LOSS_OPTION_ICON: '/assets/images/profit-loss-option-icon.svg',
	FEES_OPTION_ICON: '/assets/images/fees-option-icon.svg',
	LIMITS_OPTION_ICON: '/assets/images/limits-option-icon.svg',
	WALLET_OPTION_ICON: '/assets/images/wallet-option-icon.svg',
	LANGUAGE_OPTION_ICON: '/assets/images/language-option-icon.svg',
	P2P_OPTION_ICON: '/assets/images/p2p-option-icon.svg',
	HISTORY_OPTION_ICON: '/assets/images/history-option-icon.svg',
	VOLUME_OPTION_ICON: '/assets/images/volume-option-icon.svg',
	ASSET_OPTION_ICON: '/assets/images/asset-option-icon.svg',
	OPTION_2FA_ICON: '/assets/images/2fa-option-icon.svg',
	PASSWORD_OPTION_ICON: '/assets/images/password-option-icon.svg',
	LOGIN_OPTION_ICON: '/assets/images/login-option-icon.svg',
	SESSION_OPTION_ICON: '/assets/images/session-option-icon.svg',
	BANK_OPTION_ICON: '/assets/images/bank-option-icon.svg',
	AUDIO_OPTION_ICON: '/assets/images/audio-option-icon.svg',
	ADDRESS_OPTION_ICON: '/assets/images/address-option-icon.svg',
	NOTIFICATION_OPTION_ICON: '/assets/images/notification-option-icon.svg',
	HELP_OPTION_ICON: '/assets/images/help-bubble.svg',
	INTERFACE_OPTION_ICON: '/assets/images/interface-option-icon.svg',
	IDENTITY_OPTION_ICON: '/assets/images/identity-option-icon.svg',
	PHONE_OPTION_ICON: '/assets/images/phone-option-icon.svg',
	EMAIL_OPTION_ICON: '/assets/images/email-option-icon.svg',
	DEPOSIT_OPTION_ICON: '/assets/images/deposit-hot.svg',
	TRADE_OPTION_ICON: '/assets/images/trade-hot.svg',
	CONVERT_OPTION_ICON: '/assets/images/convert.svg',
	REFERRAL_OPTION_ICON: '/assets/images/referral-gift.svg',

	PING_CONNECTION: '/assets/images/ping-connection-check.svg',
};

const icons = flatten(nestedIcons, options);

export default icons;
