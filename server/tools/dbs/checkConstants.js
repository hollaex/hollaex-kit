'use strict';

const { Status } = require('../../db/models');

Status.findOne({})
	.then((status) => {
		const existingConstants = status.dataValues.constants;
		const existingSecrets = status.dataValues.constants.secrets;
		const constants = {
			api_name: existingConstants.api_name || process.env.API_NAME || '',
			description: existingConstants.description || '',
			color: existingConstants.color || {},
			title: existingConstants.title || '',
			links: existingConstants.links || {
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
			logo_path: existingConstants.logo_path || process.env.LOGO_PATH,
			logo_black_path: existingConstants.logo_black_path || process.env.LOGO_BLACK_PATH,
			valid_languages: existingConstants.valid_languages || process.env.VALID_LANGUAGES || (process.env.NEW_USER_DEFAULT_LANGUAGE ? process.env.NEW_USER_DEFAULT_LANGUAGE.split(',') : 'en'),
			user_level_number: existingConstants.user_level_number || process.env.USER_LEVEL_NUMBER || 4,
			new_user_is_activated: existingConstants.new_user_is_activated || (process.env.NEW_USER_IS_ACTIVATED && process.env.NEW_USER_IS_ACTIVATED === 'true') || false,
			broker_enabled: existingConstants.broker_enabled || true,
			captcha: {
				site_key: existingConstants.captcha.site_key || process.env.CAPTCHA_SITE_KEY
			},
			accounts: {
				admin: existingConstants.accounts.admin || process.env.ADMIN_EMAIL || ''
			},
			defaults: {
				language: existingConstants.defaults.language || process.env.NEW_USER_DEFAULT_LANGUAGE || 'en',
				theme: existingConstants.defaults.theme || process.env.DEFAULT_THEME || 'white'
			},
			emails: {
				timezone: existingConstants.emails.timezone || process.env.EMAILS_TIMEZONE || '',
				send_email_to_support: existingConstants.emails.send_email_to_support || (process.env.SEND_EMAIL_TO_SUPPORT && process.env.SEND_EMAIL_TO_SUPPORT === 'true') || false,
				sender: existingConstants.emails.sender || process.env.SENDER_EMAIL || ''
			},
			plugins: {
				enabled: existingConstants.plugins.enabled || process.env.PLUGINS || '',
				configuration: {
					...existingConstants.plugins.configuration
				}
			},
			secrets: {
				allowed_domains: existingSecrets.allowed_domains || (process.env.ALLOWED_DOMAINS ? process.env.ALLOWED_DOMAINS.split(',') : []),
				admin_whitelist: existingSecrets.admin_whitelist || (process.env.ADMIN_WHITELIST_IP ? process.env.ADMIN_WHITELIST_IP.split(',') : []),
				broker: {
					quick_trade_rate: existingSecrets.broker.quick_trade_rate || 0.03,
					quick_trade_expiration_time: existingSecrets.broker.quick_trade_expiration_time || 20,
					trade_master_account_id: existingSecrets.broker.trade_master_account_id || 2
				},
				security: {
					token_time: existingSecrets.security.token_time || '24h',
					withdrawal_token_expiry: existingSecrets.security.withdrawal_token_expiry || 300000
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
				vault: {
					name: existingSecrets.vault.name || process.env.VAULT_NAME || '',
					key: existingSecrets.vault.key || process.env.VAULT_KEY,
					secret: existingSecrets.vault.secret || process.env.VAULT_SECRET,
					connected_coins: existingSecrets.vault.connected_coins || []
				},
				plugins: {
					s3: {
						id_docs_bucket: process.env.ID_DOCS_BUCKET || '',
						key: {
							write: process.env.S3_WRITE_ACCESSKEYID || '',
							read: process.env.S3_READ_ACCESSKEYID || ''
						},
						secret: {
							write: process.env.S3_WRITE_SECRETACCESSKEY,
							read: process.env.S3_READ_SECRETACCESSKEY
						}
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
			}
		};
		return status.update(
			{ constants },
			{ fields: ['constants'] }
		);
	})
	.then(() => {
		console.log('tools/dbs/checkConstants successfully checked/updated');
		process.exit(0);
	})
	.catch((err) => {
		console.error('tools/dbs/checkConstants err', err);
		process.exit(1);
	});
