const { Status } = require('../../db/models');
const { CONSTANTS_KEYS, SECRETS_KEYS } = require('../../constants');
const {
	ALLOWED_DOMAINS,
	CAPTCHA_SECRET_KEY,
	CAPTCHA_SITE_KEY,
	ADMIN_WHITELIST_IP
} = process.env;

const joinConstants = (currentConstants = {}, newConstants = {}) => {
	const joinedConstants = {
		secrets: {}
	};
	CONSTANTS_KEYS.forEach((key) => {
		if (key === 'secrets' && newConstants[key]) {
			SECRETS_KEYS.forEach((secretKey) => {
				joinedConstants[key][secretKey] = newConstants[key][secretKey] || currentConstants[key][secretKey];
			});
		}
		else {
			joinedConstants[key] = newConstants[key] === undefined ? currentConstants[key] : newConstants[key];
		}
	});
	return joinedConstants;
};

Status.findOne({})
	.then((status) => {
		const securityConstants = {
			captcha: {
				site_key: CAPTCHA_SITE_KEY
			},
			secrets: {
				allowed_domains: ALLOWED_DOMAINS ? ALLOWED_DOMAINS.split(',') : [],
				admin_whitelist: ADMIN_WHITELIST_IP ? ADMIN_WHITELIST_IP.split(',') : [],
				captcha: {
					secret_key: CAPTCHA_SECRET_KEY
				}
			}
		};
		const constants = joinConstants(status.dataValues.constants, securityConstants);
		return status.update({ constants }, { fields: ['constants'], returning: true });
	})
	.then(() => {
		console.log('Security constants are reset');
		process.exit(0);
	})
	.catch((err) => {
		console.error('Error', err);
		process.exit(1);
	});