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
	DEFAULT_COUNTRY,
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
	KIT_VERSION,
	ADMIN_NETWORK_ID,
	ADMIN_EMAIL,
	ADMIN_PASSWORD
} = process.env;

const {
	HOLLAEX_NETWORK_ENDPOINT,
	HOLLAEX_NETWORK_BASE_URL,
	HOLLAEX_NETWORK_PATH_ACTIVATE
} = require('../../constants');

const { generateUserObject } = require('../seedsHelper');

const Sequelize = require('sequelize');
const checkActivation = (activation_code) => {
	const body = {
		activation_code
	};
	console.log(HOLLAEX_NETWORK_ENDPOINT, process.env.NETWORK_URL, process.env.NETWORK);

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
			.then(async (exchange) => {
				let user = null;

				if (ADMIN_EMAIL && ADMIN_PASSWORD && ADMIN_NETWORK_ID) {
					user = generateUserObject(
						ADMIN_EMAIL,
						ADMIN_PASSWORD,
						ADMIN_NETWORK_ID,
						true,
						false,
						false,
						false,
						false,
						{
							id: 1,
							role: 'admin'
						}
					);

					await queryInterface.bulkInsert('Users', [user], {},
						{
							id: { type: new Sequelize.INTEGER() },
							email: { type: new Sequelize.STRING() },
							password: { type: new Sequelize.STRING() },
							network_id: { type: new Sequelize.INTEGER() },
							full_name: { type: new Sequelize.STRING() },
							gender: { type: new Sequelize.BOOLEAN() },
							email_verified: { type: new Sequelize.BOOLEAN() },
							verification_level: { type: new Sequelize.INTEGER() },
							nationality: { type: new Sequelize.STRING() },
							phone_number: { type: new Sequelize.STRING() },
							activated: { type: new Sequelize.BOOLEAN() },
							is_admin: { type: new Sequelize.BOOLEAN() },
							is_supervisor: { type: new Sequelize.BOOLEAN() },
							is_support: { type: new Sequelize.BOOLEAN() },
							is_kyc: { type: new Sequelize.BOOLEAN() },
							is_communicator: { type: new Sequelize.BOOLEAN() },
							username: { type: new Sequelize.STRING() },
							affiliation_code: { type: new Sequelize.STRING() },
							created_at: { type: new Sequelize.DATE() },
							updated_at: { type: new Sequelize.DATE() },
							settings: { type: new Sequelize.JSON() },
							bank_account: { type: new Sequelize.JSON() },
							id_data: { type: new Sequelize.JSON() },
							address: { type: new Sequelize.JSON() },
						});
				}

				const status = {
					kit: {
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
							information: ''
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
							theme: DEFAULT_THEME || 'white',
							country: DEFAULT_COUNTRY || null
						},
						features: {},
						meta: {},
						user_meta: {}
					},
					secrets: {
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
					},
					activation_code: ACTIVATION_CODE,
					initialized: user ? true : false,
					api_key: API_KEY,
					api_secret: API_SECRET,
					kit_version: KIT_VERSION
				};

				return queryInterface.bulkUpdate(TABLE, status, {}, {}, {
					kit: { type: new Sequelize.JSON() },
					secrets: { type: new Sequelize.JSON() },
					activation_code: { type: new Sequelize.STRING() },
					initialized: { type: new Sequelize.BOOLEAN() },
					api_key: { type: new Sequelize.STRING() },
					api_secret: { type: new Sequelize.STRING() },
					kit_version: { type: new Sequelize.STRING() },
				});
				
			});
	},
	down: (queryInterface) => {
		return queryInterface.bulkDelete(TABLE);
	}
};