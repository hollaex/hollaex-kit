const { Status } = require('../../db/models');

Status.findOne({})
	.then((status) => {
		return status.update({
			kit_version: process.env.KIT_VERSION || status.kit_version
		}, { fields: ['kit_version'], returning: true });
	})
	.then(() => {
		console.log('Kit version is updated');
		process.exit(0);
	})
	.catch((err) => {
		console.error('Error', err);
		process.exit(1);
	});