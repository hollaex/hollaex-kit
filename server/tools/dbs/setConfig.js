'use strict';

const { Status } = require('../../db/models');
const { publisher } = require('../../db/pubsub');
const { CONFIGURATION_CHANNEL } = require('../../constants');

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
	NATIVE_CURRENCY
} = process.env;

const kit = {
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
	injected_values: [],
	injected_html: {},
	valid_languages: VALID_LANGUAGES || 'en,fa,ko,ar,fr',
	new_user_is_activated: (NEW_USER_IS_ACTIVATED && NEW_USER_IS_ACTIVATED === 'true') || false,
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
};

const secrets = {
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
};

Status.findOne({}).then((status) => {
	status.update({ kit, secrets }, { fields: ['kit', 'secrets'], returning: true })
		.then((data) => {
			publisher.publish(
				CONFIGURATION_CHANNEL,
				JSON.stringify({
					type: 'update',
					data: { kit: data.dataValues.kit, secrets: data.dataValues.secrets }
				})
			);
			console.log('Kit and Secrets are updated');
			process.exit(0);
		})
		.catch((err) => {
			console.error('Error', err);
			process.exit(1);
		});
});