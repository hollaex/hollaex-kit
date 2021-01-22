const { Status } = require('../../db/models');
const { CONFIGURATION_CHANNEL } = require('../../constants');
const {
	ALLOWED_DOMAINS,
	CAPTCHA_SECRET_KEY,
	CAPTCHA_SITE_KEY,
	ADMIN_WHITELIST_IP
} = process.env;
const { publisher } = require('../../db/pubsub');

Status.findOne({})
	.then((status) => {
		const kit = {
			...status.kit,
			captcha: {
				site_key: CAPTCHA_SITE_KEY
			}
		};

		const secrets = {
			...status.secrets,
			allowed_domains: ALLOWED_DOMAINS ? ALLOWED_DOMAINS.split(',') : [],
			admin_whitelist: ADMIN_WHITELIST_IP ? ADMIN_WHITELIST_IP.split(',') : [],
			captcha: {
				secret_key: CAPTCHA_SECRET_KEY
			}
		};

		return status.update({ kit, secrets }, { fields: ['kit', 'secrets'], returning: true });
	})
	.then((data) => {
		publisher.publish(
			CONFIGURATION_CHANNEL,
			JSON.stringify({
				type: 'update',
				data: { kit: data.kit, secrets: data.secrets }
			})
		);
		console.log('Security values are reset');
		process.exit(0);
	})
	.catch((err) => {
		console.error('Error', err);
		process.exit(1);
	});