const { loggerBroker } = require('../../config/logger');
const toolsLib = require('hollaex-tools-lib');

function createBrokerPair(req, res) {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/createBrokerPair auth',
		req.auth
	);

	const {
		symbol,
		buy_price,
		sell_price,
		paused,
		user_id,
		min_size,
		max_size,
		increment_size
	} = req.swagger.params.data.value;

	toolsLib.broker.createBrokerPair({
		symbol,
		buy_price,
		sell_price,
		paused,
		user_id,
		min_size,
		max_size,
		increment_size,
	})
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/createBrokerPair err',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
}

function updateBrokerPair(req, res) {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/updateBrokerPair auth',
		req.auth
	);

	toolsLib.broker.updateBrokerPair(req.swagger.params.data.value)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/updateBrokerPair err',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
}

function deleteBrokerPair(req, res) {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/deleteBrokerPair auth',
		req.auth
	);

	toolsLib.broker.deleteBrokerPair(req.swagger.params.data.value.id)
		.then((data) => {
			return res.json({ message: "Successfully deleted broker pair." });
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/admin/updateBrokerPair err',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
}

function getBrokerPairs(req, res) {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/deleteBrokerPair auth',
		req.auth
	);

	return res.json([]);
}

function executeBrokerDeal(req, res) {
	loggerAdmin.verbose(
		req.uuid,
		'controllers/admin/executeBrokerDeal auth',
		req.auth
	);

	return res.json([]);
}

module.exports = {
	createBrokerPair,
	updateBrokerPair,
	deleteBrokerPair,
	getBrokerPairs,
	executeBrokerDeal
};
