'use strict';

const { Status } = require('../../db/models');
const { publisher } = require('../../db/pubsub');
const { CONFIGURATION_CHANNEL } = require('../../constants');

const {
	API_NAME,
	API_HOST,
	LOGO_PATH,
	LOGO_BLACK_PATH,
	EMAILS_TIMEZONE,
	VALID_LANGUAGES,
	NEW_USER_DEFAULT_LANGUAGE,
	SENDER_EMAIL,
	DEFAULT_THEME,
	NEW_USER_IS_ACTIVATED,
	SMTP_SERVER,
	SMTP_PORT,
	SMTP_USER,
	SMTP_PASSWORD,
	PLUGINS,
	SEND_EMAIL_TO_SUPPORT,
	ALLOWED_DOMAINS,
	ID_DOCS_BUCKET,
	CAPTCHA_SECRET_KEY,
	S3_ACCESSKEYID,
	S3_SECRETACCESSKEY,
	SNS_ACCESSKEYID,
	SNS_REGION,
	SNS_SECRETACCESSKEY,
	ZENDESK_HOST,
	ZENDESK_KEY,
	FRESHDESK_HOST,
	FRESHDESK_KEY,
	FRESHDESK_AUTH,
	ADMIN_EMAIL,
	USER_LEVEL_NUMBER,
	CAPTCHA_SITE_KEY,
	ADMIN_WHITELIST_IP,
	API_KEY,
	API_SECRET
} = process.env;

const kit = {
	api_name: API_NAME || '',
	initialized: false,
	description: '',
	color: {},
	interface: {},
	icons: {},
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
	logo_path: LOGO_PATH,
	logo_black_path: LOGO_BLACK_PATH,
	valid_languages: VALID_LANGUAGES || (NEW_USER_DEFAULT_LANGUAGE ? NEW_USER_DEFAULT_LANGUAGE.split(',') : 'en'),
	user_level_number: USER_LEVEL_NUMBER || 4,
	new_user_is_activated: (NEW_USER_IS_ACTIVATED && NEW_USER_IS_ACTIVATED === 'true') || false,
	broker_enabled: true,
	captcha: {
		site_key: CAPTCHA_SITE_KEY
	},
	defaults: {
		language: NEW_USER_DEFAULT_LANGUAGE || 'en',
		theme: DEFAULT_THEME || 'white'
	},
	plugins: {
		enabled: PLUGINS || '',
		configuration: {}
	},
	meta: {}
};

const secrets = {
	allowed_domains: ALLOWED_DOMAINS ? ALLOWED_DOMAINS.split(',') : [],
	admin_whitelist: ADMIN_WHITELIST_IP ? ADMIN_WHITELIST_IP.split(',') : [],
	exchange_credentials_set: API_KEY && API_SECRET ? true : false,
	setup_completed: false,
	broker: {
		quick_trade_rate: 0.03,
		quick_trade_expiration_time: 20,
		trade_master_account_id: 2
	},
	security: {
		token_time: '24h',
		withdrawal_token_expiry: 300000
	},
	emails: {
		timezone: EMAILS_TIMEZONE || '',
		send_email_to_support: (SEND_EMAIL_TO_SUPPORT && SEND_EMAIL_TO_SUPPORT === 'true') || false,
		sender: SENDER_EMAIL || '',
		audit: ADMIN_EMAIL || ''
	},
	captcha: {
		secret_key: CAPTCHA_SECRET_KEY
	},
	smtp: {
		server: SMTP_SERVER || '',
		port: SMTP_PORT || 587,
		user: SMTP_USER,
		password: SMTP_PASSWORD
	},
	plugins: {
		s3: {
			id_docs_bucket: ID_DOCS_BUCKET || '',
			key: S3_ACCESSKEYID,
			secret: S3_SECRETACCESSKEY
		},
		sns: {
			region: SNS_REGION || '',
			key: SNS_ACCESSKEYID || '',
			secret: SNS_SECRETACCESSKEY || ''
		},
		freshdesk: {
			host: FRESHDESK_HOST || '',
			key: FRESHDESK_KEY || '',
			auth: FRESHDESK_AUTH || ''
		},
		zendesk: {
			host: ZENDESK_HOST || '',
			key: ZENDESK_KEY || ''
		}
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