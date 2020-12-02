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
			setup_completed: isBoolean(existingKitConfigurations.setup_completed) ? existingKitConfigurations.setup_completed : false,
			native_currency: existingKitConfigurations.native_currency || process.env.NATIVE_CURRENCY,
			logo_image: existingKitConfigurations.logo_image || existingKitConfigurations.logo_path || process.env.LOGO_IMAGE,
			valid_languages: existingKitConfigurations.valid_languages || process.env.VALID_LANGUAGES || 'en,fa,ko,ar,fr',
			new_user_is_activated: existingKitConfigurations.new_user_is_activated || (process.env.NEW_USER_IS_ACTIVATED && process.env.NEW_USER_IS_ACTIVATED === 'true') || false,
			captcha: {
				site_key: existingKitConfigurations.captcha.site_key || process.env.CAPTCHA_SITE_KEY
			},
			defaults: {
				language: existingKitConfigurations.defaults.language || process.env.NEW_USER_DEFAULT_LANGUAGE || 'en',
				theme: existingKitConfigurations.defaults.theme || process.env.DEFAULT_THEME || 'white'
			},
			plugins: {
				enabled: existingKitConfigurations.plugins.enabled || process.env.PLUGINS || '',
				configuration: {
					...existingKitConfigurations.plugins.configuration
				}
			},
			meta: existingKitConfigurations.meta || {},
		};

		const secrets = {
			allowed_domains: existingSecrets.allowed_domains || (process.env.ALLOWED_DOMAINS ? process.env.ALLOWED_DOMAINS.split(',') : []),
			admin_whitelist: existingSecrets.admin_whitelist || (process.env.ADMIN_WHITELIST_IP ? process.env.ADMIN_WHITELIST_IP.split(',') : []),
			security: {
				token_time: existingSecrets.security.token_time || '24h',
				withdrawal_token_expiry: existingSecrets.security.withdrawal_token_expiry || 300000
			},
			emails: {
				timezone: existingSecrets.emails.timzeone || process.env.EMAILS_TIMEZONE || '',
				send_email_to_support: existingSecrets.emails.send_email_to_support || (process.env.SEND_EMAIL_TO_SUPPORT && process.env.SEND_EMAIL_TO_SUPPORT === 'true') || false,
				sender: existingSecrets.emails.sender || process.env.SENDER_EMAIL || '',
				audit: existingSecrets.emails.audit || process.env.ADMIN_EMAIL || ''
			},
			captcha: {
				secret_key: existingSecrets.captcha.secret_key || process.env.CAPTCHA_SECRET_KEY
			},
			smtp: {
				server: existingSecrets.smtp.server || process.env.SMTP_SERVER || '',
				port: existingSecrets.smtp.port || process.env.SMTP_PORT || 587,
				user: existingSecrets.smtp.user || process.env.SMTP_USER,
				password: existingSecrets.smtp.password || process.env.SMTP_PASSWORD
			},
			plugins: {
				s3: {
					id_docs_bucket: process.env.ID_DOCS_BUCKET || '',
					key: process.env.S3_WRITE_ACCESSKEYID || '',
					secret: process.env.S3_WRITE_SECRETACCESSKEY
				},
				sns: {
					region: process.env.SNS_REGION || '',
					key: process.env.SNS_ACCESSKEYID || '',
					secret: process.env.SNS_SECRETACCESSKEY || ''
				},
				freshdesk: {
					host: process.env.FRESHDESK_HOST || '',
					key: process.env.FRESHDESK_KEY || '',
					auth: process.env.FRESHDESK_AUTH || ''
				},
				zendesk: {
					host: process.env.ZENDESK_HOST || '',
					key: process.env.ZENDESK_KEY || ''
				},
				...existingSecrets.plugins
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
