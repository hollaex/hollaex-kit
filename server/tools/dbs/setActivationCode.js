const { Status } = require('../../db/models');

const {	ACTIVATION_CODE, API_KEY, API_SECRET } = process.env;

Status.findOne({}).then((status) => {
	status.update({
		activation_code: ACTIVATION_CODE,
		activated: true,
		api_key:  API_KEY,
		api_secret:  API_SECRET
	})
		.then(() => {
			console.log('Activation Code and keys are set');
			process.exit(0);
		})
		.catch((err) => {
			console.error('Error', err);
			process.exit(1);
		});
});