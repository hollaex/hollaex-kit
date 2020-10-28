'use strict';

const { loggerOrders } = require('../../config/logger');
const toolsLib = require('hollaex-tools-lib');

const createOrder = (req, res) => {
	loggerOrders.verbose(
		req.uuid,
		'controllers/order/createOrder auth',
		req.auth
	);
	loggerOrders.verbose(
		req.uuid,
		'controllers/order/createOrder order',
		req.swagger.params.order.value
	);

	const user_id = req.auth.sub.id;
	const order = req.swagger.params.order.value;

	toolsLib.order.createUserOrderByKitId(user_id, order.symbol, order.side, order.size, order.type, order.price, order.stop, order.meta)
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

const getUserOrder = (req, res) => {
	loggerOrders.verbose(req.uuid, 'controllers/order/getUserOrder auth', req.auth);
	loggerOrders.verbose(
		req.uuid,
		'controllers/order/getUserOrder order_id',
		req.swagger.params.order_id.value
	);
	const user_id = req.auth.sub.id;
	const order_id = req.swagger.params.order_id.value;

	toolsLib.order.getUserOrderByKitId(user_id, order_id)
		.then((order) => {
			return res.json(order);
		})
		.catch((err) => {
			loggerOrders.error(req.uuid, 'controllers/order/getUserOrder error', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const cancelUserOrder = (req, res) => {
	loggerOrders.verbose(req.uuid, 'controllers/order/cancelUserOrder auth', req.auth);
	loggerOrders.verbose(
		req.uuid,
		'controllers/order/cancelUserOrder order_id',
		req.swagger.params.order_id.value
	);
	const user_id = req.auth.sub.id;
	const order_id = req.swagger.params.order_id.value;

	toolsLib.order.cancelUserOrderByKitId(user_id, order_id)
		.then((order) => {
			return res.json(order);
		})
		.catch((err) => {
			loggerOrders.error(req.uuid, 'controllers/order/cancelUserOrder error', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const getAllUserOrders = (req, res) => {
	loggerOrders.verbose(req.uuid, 'controllers/order/getAllUserOrders auth', req.auth);
	const user_id = req.auth.sub.id;
	const { symbol, side, status, open, limit, page, order_by, order, start_date, end_date } = req.swagger.params;

	toolsLib.order.getAllUserOrdersByKitId(
		user_id,
		symbol.value,
		side.value,
		status.value,
		open.value,
		limit.value,
		page.value,
		order_by.value,
		order.value,
		start_date.value,
		end_date.value
	)
		.then((order) => {
			return res.json(order);
		})
		.catch((err) => {
			loggerOrders.error(req.uuid, 'controllers/order/getAllUserOrders error', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const cancelAllUserOrders = (req, res) => {
	loggerOrders.verbose(req.uuid, 'controllers/order/cancelAllUserOrders auth', req.auth);
	const user_id = req.auth.sub.id;
	const symbol = req.swagger.params.symbol.value;

	toolsLib.order.cancelAllUserOrdersByKitId(user_id, symbol)
		.then((order) => {
			return res.json(order);
		})
		.catch((err) => {
			loggerOrders.error(req.uuid, 'controllers/order/cancelAllUserOrders error', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const getAdminUserOrders = (req, res) => {
	loggerOrders.verbose(req.uuid, 'controllers/order/getAdminUserOrders/auth', req.auth);
	const { user_id, symbol, side, status, open, limit, page, order_by, order, start_date, end_date } = req.swagger.params;

	let promiseQuery;

	if (user_id.value) {
		promiseQuery = toolsLib.order.getAllUserOrdersByKitId(
			user_id.value,
			symbol.value,
			side.value,
			status.value,
			open.value,
			limit.value,
			page.value,
			order_by.value,
			order.value,
			start_date.value,
			end_date.value
		);
	} else {
		promiseQuery = toolsLib.order.getAllExchangeOrders(
			symbol.value,
			side.value,
			status.value,
			open.value,
			limit.value,
			page.value,
			order_by.value,
			order.value,
			start_date.value,
			end_date.value
		);
	}

	promiseQuery
		.then((orders) => {
			return res.json(orders);
		})
		.catch((err) => {
			loggerOrders.debug(req.uuid, 'controllers/order/getAdminUserOrder', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const adminCancelOrder = (req, res) => {
	loggerOrders.verbose(req.uuid, 'controllers/order/adminCancelOrder auth', req.auth);

	const userId = req.swagger.params.user_id.value;
	const orderId = req.swagger.params.order_id.value;

	toolsLib.order.cancelUserOrderByKitId(userId, orderId)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerOrders.error(
				req.uuid,
				'controllers/order/adminCancelOrder',
				err.message
			);
			return res.status(400).json({ message: err.message });
		});
};

module.exports = {
	createOrder,
	getUserOrder,
	cancelUserOrder,
	getAllUserOrders,
	cancelAllUserOrders,
	getAdminUserOrders,
	adminCancelOrder
};
