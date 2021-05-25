'use strict';

const rp = require('request-promise');

const {
	API_NAME,
	API_HOST,
	LOGO_IMAGE,
	EMAILS_TIMEZONE,
	VALID_LANGUAGES,
	NEW_USER_DEFAULT_LANGUAGE,
	DEFAULT_THEME,
	NEW_USER_IS_ACTIVATED,
	SMTP_SERVER,
	SMTP_PORT,
	SMTP_USER,
	SMTP_PASSWORD,
	SEND_EMAIL_TO_SUPPORT,
	ALLOWED_DOMAINS,
	CAPTCHA_SECRET_KEY,
	CAPTCHA_SITE_KEY,
	ADMIN_WHITELIST_IP,
	ACTIVATION_CODE,
	NATIVE_CURRENCY,
	API_KEY,
	API_SECRET,
	KIT_VERSION
} = process.env;

const {
	HOLLAEX_NETWORK_ENDPOINT,
	HOLLAEX_NETWORK_BASE_URL,
	HOLLAEX_NETWORK_PATH_ACTIVATE
} = require('../../constants');

const checkActivation = (activation_code) => {
	const body = {
		activation_code
	};

	const options = {
		method: 'POST',
		body,
		uri: `${HOLLAEX_NETWORK_ENDPOINT}${HOLLAEX_NETWORK_BASE_URL}${HOLLAEX_NETWORK_PATH_ACTIVATE}`,
		json: true
	};
	return rp(options);
};

const TABLE = 'Statuses';

module.exports = {
	up: (queryInterface) => {
		return checkActivation(ACTIVATION_CODE)
			.then((exchange) => {
				const status = [{
					kit: JSON.stringify({
						api_name: API_NAME || '',
						description: '',
						color: {},
						interface: {},
						icons: {},
						strings: {},
						title: '',
						links: {
							twitter: '',
							instagram: '',
							telegram: '',
							facebook: '',
							linkedin: '',
							github: '',
							contact: '',
							helpdesk: '',
							terms: '',
							privacy: '',
							api: API_HOST || '',
							whitepaper: '',
							website: '',
							information: '',
						},
						email_verification_required: false,
						setup_completed: false,
						native_currency: NATIVE_CURRENCY || 'usdt',
						logo_image: LOGO_IMAGE || 'https://dash.testnet.bitholla.com/assets/img/hex-pattern-icon-black-01.svg',
						valid_languages: VALID_LANGUAGES || 'en,fa,ko,ar,fr',
						new_user_is_activated: (NEW_USER_IS_ACTIVATED && NEW_USER_IS_ACTIVATED === 'true') || false,
						injected_values: [],
						injected_html: {},
						captcha: {
							site_key: CAPTCHA_SITE_KEY
						},
						defaults: {
							language: NEW_USER_DEFAULT_LANGUAGE || 'en',
							theme: DEFAULT_THEME || 'white'
						},
						features: {},
						meta: {},
						user_meta: {}
					}),
					secrets: JSON.stringify({
						allowed_domains: ALLOWED_DOMAINS ? ALLOWED_DOMAINS.split(',') : [],
						admin_whitelist: ADMIN_WHITELIST_IP ? ADMIN_WHITELIST_IP.split(',') : [],
						security: {
							token_time: '24h',
							withdrawal_token_expiry: 300000
						},
						emails: {
							timezone: EMAILS_TIMEZONE || '',
							send_email_to_support: (SEND_EMAIL_TO_SUPPORT && SEND_EMAIL_TO_SUPPORT === 'true') || false,
							sender: '',
							audit: ''
						},
						captcha: {
							secret_key: CAPTCHA_SECRET_KEY
						},
						smtp: {
							server: SMTP_SERVER || '',
							port: SMTP_PORT || 587,
							user: SMTP_USER,
							password: SMTP_PASSWORD
						}
					}),
					activation_code: ACTIVATION_CODE,
					initialized: false,
					api_key: API_KEY,
					api_secret: API_SECRET,
					kit_version: KIT_VERSION
				}];
				queryInterface.bulkInsert(TABLE, status, {});
			});
	},
	down: (queryInterface) => {
		return queryInterface.bulkDelete(TABLE);
	}
};