'use strict';

const {
	API_NAME,
	LOGO_PATH,
	LOGO_BLACK_PATH,
	EMAILS_TIMEZONE,
	VALID_LANGUAGES,
	NEW_USER_DEFAULT_LANGUAGE,
	SENDER_EMAIL,
	SUPPORT_EMAIL,
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
	VAULT_NAME,
	CAPTCHA_SECRET_KEY,
	S3_WRITE_ACCESSKEYID,
	S3_WRITE_SECRETACCESSKEY,
	S3_READ_ACCESSKEYID,
	S3_READ_SECRETACCESSKEY,
	SES_ACCESSKEYID,
	SES_REGION,
	SES_SECRETACCESSKEY,
	SNS_ACCESSKEYID,
	SNS_REGION,
	SNS_SECRETACCESSKEY,
	VAULT_KEY,
	VAULT_SECRET,
	FRESHDESK_HOST,
	FRESHDESK_KEY,
	FRESHDESK_AUTH,
	ADMIN_EMAIL,
	KYC_EMAIL,
	SUPERVISOR_EMAIL,
	USER_LEVEL_NUMBER,
	CAPTCHA_SITE_KEY,
	ADMIN_WHITELIST_IP
} = process.env;

const TABLE = 'Statuses';
const status = [{
	name: API_NAME || 'HollaEx',
	initialized: true,
	constants: JSON.stringify({
		api_name: API_NAME || 'HollaEx',
		logo_path: LOGO_PATH,
		logo_black_path: LOGO_BLACK_PATH,
		valid_languages: VALID_LANGUAGES || (NEW_USER_DEFAULT_LANGUAGE ? NEW_USER_DEFAULT_LANGUAGE.split(',') : 'en'),
		user_level_number: USER_LEVEL_NUMBER || 4,
		new_user_is_activated: (NEW_USER_IS_ACTIVATED && NEW_USER_IS_ACTIVATED === 'true') || false,
		broker_enabled: true,
		captcha: {
			site_key: CAPTCHA_SITE_KEY
		},
		accounts: {
			admin: ADMIN_EMAIL || 'admin@bitholla.com',
			supervisor: SUPERVISOR_EMAIL,
			support: SUPPORT_EMAIL || 'support@bitholla.com',
			kyc: KYC_EMAIL
		},
		defaults: {
			language: NEW_USER_DEFAULT_LANGUAGE || 'en',
			theme: DEFAULT_THEME || 'white'
		},
		emails: {
			timezone: EMAILS_TIMEZONE || '',
			send_email_to_support: (SEND_EMAIL_TO_SUPPORT && SEND_EMAIL_TO_SUPPORT === 'true') || process.env.NODE_ENV === 'production',
			sender: SENDER_EMAIL || 'support@bitholla.com'
		},
		plugins: {
			enabled: PLUGINS || 'bank,kyc,sms',
			configuration: {
				s3: {
					id_docs_bucket: ID_DOCS_BUCKET || ''
				},
				ses: {
					region: SES_REGION || ''
				},
				sns: {
					region: SNS_REGION || ''
				},
				freshdesk: {
					host: FRESHDESK_HOST || ''
				}
			}
		},
		secrets: {
			allowed_domains: ALLOWED_DOMAINS ? ALLOWED_DOMAINS.split(',') : [],
			admin_whitelist: ADMIN_WHITELIST_IP ? ADMIN_WHITELIST_IP.split(',') : [],
			broker: {
				quick_trade_rate: 0.03,
				quick_trade_expiration_time: 20,
				trade_master_account_id: 2
			},
			security: {
				token_time: '24h',
				withdrawal_token_expiry: 300000
			},
			captcha: {
				secret_key: CAPTCHA_SECRET_KEY
			},
			smtp: {
				server: SMTP_SERVER || 'smtp.gmail.com',
				port: SMTP_PORT || 587,
				user: SMTP_USER,
				password: SMTP_PASSWORD
			},
			vault: {
				name: VAULT_NAME || 'vault',
				key: VAULT_KEY,
				secret: VAULT_SECRET,
				connected_coins: []
			},
			plugins: {
				s3: {
					key: {
						write: S3_WRITE_ACCESSKEYID || '',
						read: S3_READ_ACCESSKEYID || ''
					},
					secret: {
						write: S3_WRITE_SECRETACCESSKEY,
						read: S3_READ_SECRETACCESSKEY
					}
				},
				ses: {
					key: SES_ACCESSKEYID || '',
					secret: SES_SECRETACCESSKEY || ''
				},
				sns: {
					key: SNS_ACCESSKEYID || '',
					secret: SNS_SECRETACCESSKEY || ''
				},
				freshdesk: {
					key: FRESHDESK_KEY || '',
					auth: FRESHDESK_AUTH || ''
				}
			}
		}
	})
}];

module.exports = {
	up: (queryInterface) => queryInterface.bulkInsert(TABLE, status, {}),
	down: (queryInterface) => {
		return queryInterface.bulkDelete(TABLE);
	}
};