const { Status } = require('../../db/models');
const { publisher } = require('../../db/pubsub');
const { INIT_CHANNEL } = require('../../constants');

Status.findOne({})
	.then((status) => {
		return status.update({
			kit_version: process.env.KIT_VERSION || status.kit_version
		}, { fields: ['kit_version'], returning: true });
	})
	.then(() => {
		publisher.publish(INIT_CHANNEL, JSON.stringify({ type: 'refreshInit' }));
		console.log('Kit version is updated');
		process.exit(0);
	})
	.catch((err) => {
		console.error('Error', err);
		process.exit(1);
	});