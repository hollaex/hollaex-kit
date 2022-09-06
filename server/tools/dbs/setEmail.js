const { Status } = require('../../db/models');
const { CONFIGURATION_CHANNEL } = require('../../constants');
const {
	SMTP_SERVER,
	SMTP_PORT,
	SMTP_USER,
	SMTP_PASSWORD
} = process.env;
const { publisher } = require('../../db/pubsub');

Status.findOne({})
	.then((status) => {
		const secrets = {
			...status.secrets,
			smtp: {
				server: SMTP_SERVER,
				port: SMTP_PORT,
				user: SMTP_USER,
				password: SMTP_PASSWORD
			}
		};

		return status.update({ secrets }, { fields: ['secrets'], returning: true });
	})
	.then((data) => {
		publisher.publish(
			CONFIGURATION_CHANNEL,
			JSON.stringify({
				type: 'update',
				data: { secrets: data.secrets }
			})
		);
		console.log('Emails values are reset');
		process.exit(0);
	})
	.catch((err) => {
		console.error('Error', err);
		process.exit(1);
	});