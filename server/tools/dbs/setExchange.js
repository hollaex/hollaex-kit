const { Status } = require('../../db/models');

const { ACTIVATION_CODE, EXCHANGE_NAME, EXCHANGE_URL } = process.env;

const exchange = {
	activated: true
};
if (EXCHANGE_NAME) {
	exchange.name = EXCHANGE_NAME;
}
if (EXCHANGE_URL) {
	exchange.url = EXCHANGE_URL;
}
if (ACTIVATION_CODE) {
	exchange.activation_code = ACTIVATION_CODE;
}

Status.findOne({}).then((status) => {
	status.update(exchange)
		.then(() => {
			console.log('Exchange is updated');
			process.exit(0);
		})
		.catch((err) => {
			console.error('Error', err);
			process.exit(1);
		});
});