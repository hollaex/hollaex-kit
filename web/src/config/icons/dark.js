import flatten from 'flat';

const options = { safe: true, delimiter: '_' };
const nestedIcons = {
	EXCHANGE: {
		LOGO: '',
		FAV_ICON: '/favicon.ico',
		LOADER: '/assets/loader-dark.gif',
		BOARDING_IMAGE: '/assets/dark-background.jpg',
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
		GENERATE: '/assets/images/api-key-generate-dark.svg',
		CREATED: '/assets/images/api-key-created-dark.svg',
	},

	VERIFICATION: {
		WARNING: '/assets/images/astrics.svg',
		SUCCESS: '/assets/images/success-check-box.svg',
		DOC_STATUS: '/assets/images/verification-doc-status.svg',
		PENDING: '/assets/images/verification-pending-orange.svg',
		REJECTED: '/assets/images/verification-rejected-yellow-cross.svg',
		INCOMPLETE: '/assets/images/verification-attention-red.svg',
		VERIFIED: '/assets/images/verification-green-tick.svg',
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
};

const icons = flatten(nestedIcons, options);

export default icons;
