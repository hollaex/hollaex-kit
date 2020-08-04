const { Status } = require('../../db/models');

const {	ACTIVATION_CODE } = process.env;

Status.findOne({}).then((status) => {
	status.update({
		activation_code: ACTIVATION_CODE,
		activated: true
	})
		.then(() => {
			console.log('Activation Code is set');
			process.exit(0);
		})
		.catch((err) => {
			console.error('Error', err);
			process.exit(1);
		});
});