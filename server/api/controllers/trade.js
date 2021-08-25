'use strict';

const { loggerTrades } = require('../../config/logger');
const toolsLib = require('hollaex-tools-lib');
const { errorMessageConverter } = require('../../utils/conversion');

const getUserTrades = (req, res) => {
	loggerTrades.verbose(
		req.uuid,
		'controllers/trade/getUserTrades auth',
		req.auth.sub
	);

	const user_id = req.auth.sub.id;
	const {
		limit,
		page,
		order_by,
		order,
		start_date,
		end_date,
		format
	} = req.swagger.params;
	const symbol = req.swagger.params.symbol.value;

	loggerTrades.info(
		req.uuid,
		'controllers/trade/getUserTrades params',
		'user_id',
		user_id,
		'symbol',
		symbol,
		'limit',
		limit.value,
		'page',
		page.value,
		'order_by',
		order_by.value,
		'order',
		order.value,
		'start_date',
		start_date.value,
		'end_date',
		end_date.value,
		'format',
		format.value
	);

	if (symbol && !toolsLib.subscribedToPair(symbol)) {
		loggerTrades.error(req.uuid, 'controllers/trade/getUserTrades', 'Invalid symbol');
		return res.status(400).json({ message: 'Invalid symbol' });
	}

	toolsLib.order.getAllUserTradesByKitId(
		user_id,
		symbol,
		limit.value,
		page.value,
		order_by.value,
		order.value,
		start_date.value,
		end_date.value,
		format.value,
		{
			additionalHeaders: {
				'x-forwarded-for': req.headers['x-forwarded-for']
			}
		}
	)
		.then((data) => {
			if (format.value == 'csv') {
				res.setHeader('Content-disposition', `attachment; filename=${toolsLib.getKitConfig().api_name}-trades.csv`);
				res.set('Content-Type', 'text/csv');
				res.status(202);
				return res.send(data);
			} else {
				return res.json(data);
			}
		})
		.catch((err) => {
			loggerTrades.error(req.uuid, 'controllers/trade/getUserTrades', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const getAdminTrades = (req, res) => {
	loggerTrades.verbose(req.uuid, 'controllers/trade/getAdminTrades auth', req.auth);

	const { user_id, symbol, limit, page, order_by, order, start_date, end_date, format } = req.swagger.params;

	loggerTrades.info(
		req.uuid,
		'controllers/trade/getAdminTrades params',
		'user_id',
		user_id.value,
		'symbol',
		symbol.value,
		'limit',
		limit.value,
		'page',
		page.value,
		'order_by',
		order_by.value,
		'order',
		order.value,
		'start_date',
		start_date.value,
		'end_date',
		end_date.value,
		'format',
		format.value
	);

	if (symbol.value && !toolsLib.subscribedToPair(symbol.value)) {
		loggerTrades.error(req.uuid, 'controllers/trade/getUserTrades', 'Invalid symbol');
		return res.status(400).json({ message: 'Invalid symbol' });
	}

	let promiseQuery;

	if (user_id.value) {
		promiseQuery = toolsLib.order.getAllUserTradesByKitId(
			user_id.value,
			symbol.value,
			limit.value,
			page.value,
			order_by.value,
			order.value,
			start_date.value,
			end_date.value,
			format.value,
			{
				additionalHeaders: {
					'x-forwarded-for': req.headers['x-forwarded-for']
				}
			}
		);
	} else {
		promiseQuery = 	toolsLib.order.getAllTradesNetwork(
			symbol.value,
			limit.value,
			page.value,
			order_by.value,
			order.value,
			start_date.value,
			end_date.value,
			format.value,
			{
				additionalHeaders: {
					'x-forwarded-for': req.headers['x-forwarded-for']
				}
			}
		);
	}

	promiseQuery
		.then((data) => {
			if (format.value === 'csv') {
				res.setHeader('Content-disposition', `attachment; filename=${user_id.value ? `user-${user_id.value}-` : ''}trades.csv`);
				res.set('Content-Type', 'text/csv');
				res.status(202);
				return res.send(data);
			} else {
				return res.json(data);
			}
		})
		.catch((err) => {
			loggerTrades.error(req.uuid, 'controllers/trade/getAdminTrades', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

module.exports = {
	getUserTrades,
	getAdminTrades
};
