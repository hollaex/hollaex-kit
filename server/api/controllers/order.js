'use strict';

const { loggerOrders } = require('../../config/logger');
const { getToolsLib } = require('../../init');

const createOrder = (req, res) => {
	loggerOrders.verbose(
		req.uuid,
		'controllers/order/createOrder/auth',
		req.auth
	);
	loggerOrders.verbose(
		req.uuid,
		'controllers/order/createOrder/body',
		req.body
	);
	loggerOrders.verbose(
		req.uuid,
		'controllers/order/createOrder/swagger',
		req.swagger.params.order.value
	);

	const user_id = req.auth.sub.id;
	const order = req.swagger.params.order.value;

	getToolsLib().order.createUserOrderByKitId(user_id, order.symbol, order.side, order.size, order.type, order.price)
		.then((order) => {
			return res.json(order);
		})
		.catch((err) => {
			loggerOrders.error(
				req.uuid,
				'controllers/order/createOrder error',
				err.message
			);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

module.exports = {
	createOrder
};
