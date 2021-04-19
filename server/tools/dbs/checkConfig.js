'use strict';

const { Status } = require('../../db/models');
const { publisher } = require('../../db/pubsub');
const { CONFIGURATION_CHANNEL } = require('../../constants');
const { isBoolean } = require('lodash');

Status.findOne()
	.then((status) => {
		const existingKitConfigurations = status.dataValues.kit;
		const existingSecrets = status.dataValues.secrets;
		const kit = {
			api_name: existingKitConfigurations.api_name || process.env.API_NAME || '',
			description: existingKitConfigurations.description || '',
			color: existingKitConfigurations.color || {},
			interface: existingKitConfigurations.interface || {},
			icons: existingKitConfigurations.icons || {},
			strings: existingKitConfigurations.strings || {},
			title: existingKitConfigurations.title || '',
			links: existingKitConfigurations.links || {
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
				api: process.env.API_HOST || '',
				whitepaper: '',
				website: '',
				information: '',
			},
			email_verification_required: isBoolean(existingKitConfigurations.email_verification_required) ? existingKitConfigurations.email_verification_required : false,
			setup_completed: isBoolean(existingKitConfigurations.setup_completed) ? existingKitConfigurations.setup_completed : false,
			native_currency: existingKitConfigurations.native_currency || process.env.NATIVE_CURRENCY || 'usdt',
			logo_image: existingKitConfigurations.logo_image || existingKitConfigurations.logo_path || process.env.LOGO_IMAGE || 'https://dash.testnet.bitholla.com/assets/img/hex-pattern-icon-black-01.svg',
			injected_values: existingKitConfigurations.injected_values || [],
			injected_html: existingKitConfigurations.injected_html || {},
			valid_languages: existingKitConfigurations.valid_languages || process.env.VALID_LANGUAGES || 'en,fa,ko,ar,fr',
			new_user_is_activated: existingKitConfigurations.new_user_is_activated || (process.env.NEW_USER_IS_ACTIVATED && process.env.NEW_USER_IS_ACTIVATED === 'true') || false,
			captcha: {
				site_key: existingKitConfigurations.captcha ? (existingKitConfigurations.captcha.site_key || process.env.CAPTCHA_SITE_KEY) : process.env.CAPTCHA_SITE_KEY
			},
			defaults: {
				language: existingKitConfigurations.defaults ? (existingKitConfigurations.defaults.language || process.env.NEW_USER_DEFAULT_LANGUAGE || 'en') : (process.env.NEW_USER_DEFAULT_LANGUAGE || 'en'),
				theme: existingKitConfigurations.defaults ? (existingKitConfigurations.defaults.theme || process.env.DEFAULT_THEME || 'white') : (process.env.DEFAULT_THEME || 'white')
			},
			features: existingKitConfigurations.features || {},
			meta: existingKitConfigurations.meta || {},
		};

		const secrets = {
			allowed_domains: existingSecrets.allowed_domains || (process.env.ALLOWED_DOMAINS ? process.env.ALLOWED_DOMAINS.split(',') : []),
			admin_whitelist: existingSecrets.admin_whitelist || (process.env.ADMIN_WHITELIST_IP ? process.env.ADMIN_WHITELIST_IP.split(',') : []),
			security: {
				token_time: existingSecrets.security ? (existingSecrets.security.token_time || '24h') : '24h',
				withdrawal_token_expiry: existingSecrets.security ? (existingSecrets.security.withdrawal_token_expiry || 300000) : 300000
			},
			emails: {
				timezone: existingSecrets.emails ? (existingSecrets.emails.timzeone || process.env.EMAILS_TIMEZONE || '') : (process.env.EMAILS_TIMEZONE || ''),
				send_email_to_support: existingSecrets.emails ? (existingSecrets.emails.send_email_to_support || (process.env.SEND_EMAIL_TO_SUPPORT && process.env.SEND_EMAIL_TO_SUPPORT === 'true') || false) : ((process.env.SEND_EMAIL_TO_SUPPORT && process.env.SEND_EMAIL_TO_SUPPORT === 'true') || false),
				sender: existingSecrets.emails ? (existingSecrets.emails.sender || '') : '',
				audit: existingSecrets.emails ? (existingSecrets.emails.audit || '') : ''
			},
			captcha: {
				secret_key: existingSecrets.captcha ? (existingSecrets.captcha.secret_key || process.env.CAPTCHA_SECRET_KEY) : process.env.CAPTCHA_SECRET_KEY
			},
			smtp: {
				server: existingSecrets.smtp ? (existingSecrets.smtp.server || process.env.SMTP_SERVER || '') : (process.env.SMTP_SERVER || ''),
				port: existingSecrets.smtp ? (existingSecrets.smtp.port || process.env.SMTP_PORT || 587) : (process.env.SMTP_PORT || 587),
				user: existingSecrets.smtp ? (existingSecrets.smtp.user || process.env.SMTP_USER) : process.env.SMTP_USER,
				password: existingSecrets.smtp ? (existingSecrets.smtp.password || process.env.SMTP_PASSWORD) : process.env.SMTP_PASSWORD
			}
		};

		return status.update(
			{ kit, secrets },
			{ fields: ['kit', 'secrets'] }
		);
	})
	.then((data) => {
		publisher.publish(
			CONFIGURATION_CHANNEL,
			JSON.stringify({
				type: 'update',
				data: { kit: data.kit, secrets: data.secrets }
			})
		);
		console.log('tools/dbs/checkConfig successfully checked/updated');
		process.exit(0);
	})
	.catch((err) => {
		console.error('tools/dbs/checkConfig err', err);
		process.exit(1);
	});
