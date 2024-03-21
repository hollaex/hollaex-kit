'use strict';

const { loggerStake } = require('../../config/logger');
const { INIT_CHANNEL } = require('../../constants');
const { publisher } = require('../../db/pubsub');
const toolsLib = require('hollaex-tools-lib');
const { errorMessageConverter } = require('../../utils/conversion');

const createP2PDeal = (req, res) => {
	loggerStake.verbose(req.uuid, 'controllers/p2p/createP2PDeal/auth', req.auth);

	const {  
        price_type,
        buying_asset,
        spending_asset,
        exchange_rate,
        spread,
        total_order_amount,
        min_order_value,
        max_order_value,
        terms,
        auto_response,
        payment_methods,
	 } = req.swagger.params.data.value;

	loggerStake.verbose(
		req.uuid,
		'controllers/p2p/createP2PDeal data',
        price_type,
        buying_asset,
        spending_asset,
        exchange_rate,
        spread,
        total_order_amount,
        min_order_value,
        max_order_value,
        terms,
        auto_response,
	);

	toolsLib.p2p.createP2PDeal({
        merchant_id: req.auth.sub.id,
        side: 'sell',
        price_type,
        buying_asset,
        spending_asset,
        exchange_rate,
        spread,
        total_order_amount,
        min_order_value,
        max_order_value,
        terms,
        auto_response,
        payment_methods,
    }
		)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerStake.error(
				req.uuid,
				'controllers/p2p/createP2PDeal err',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
}

const fetchP2PDeals = (req, res) => {
	loggerStake.verbose(req.uuid, 'controllers/p2p/fetchP2PDeals/auth', req.auth);

	const {user_id, limit, page, order_by, order, start_date, end_date, format } = req.swagger.params;

	if (format.value && req.auth.scopes.indexOf(ROLES.ADMIN) === -1) {
		return res.status(403).json({ message: API_KEY_NOT_PERMITTED });
	}
	
	if (order_by.value && typeof order_by.value !== 'string') {
		loggerStake.error(
			req.uuid,
			'controllers/p2p/fetchP2PDeals invalid order_by',
			order_by.value
		);
		return res.status(400).json({ message: 'Invalid order by' });
	}

	toolsLib.p2p.fetchP2PDeals({
        user_id: user_id.value,
		limit: limit.value,
		page: page.value,
		order_by: order_by.value,
		order: order.value,
		start_date: start_date.value,
		end_date: end_date.value,
		format: format.value
	}
	)
		.then((data) => {
			if (format.value === 'csv') {
				toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params);
				res.setHeader('Content-disposition', `attachment; filename=${toolsLib.getKitConfig().api_name}-logins.csv`);
				res.set('Content-Type', 'text/csv');
				return res.status(202).send(data);
			} else {
				return res.json(data);
			}
		})
		.catch((err) => {
			loggerStake.error(req.uuid, 'controllers/p2p/fetchP2PDeals', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};


const fetchP2PTransactions = (req, res) => {
	loggerStake.verbose(req.uuid, 'controllers/p2p/fetchP2PTransactions/auth', req.auth);

	const { limit, page, order_by, order, start_date, end_date, format } = req.swagger.params;

	if (format.value && req.auth.scopes.indexOf(ROLES.ADMIN) === -1) {
		return res.status(403).json({ message: API_KEY_NOT_PERMITTED });
	}
	
	if (order_by.value && typeof order_by.value !== 'string') {
		loggerStake.error(
			req.uuid,
			'controllers/p2p/fetchP2PTransactions invalid order_by',
			order_by.value
		);
		return res.status(400).json({ message: 'Invalid order by' });
	}

	toolsLib.p2p.fetchP2PTransactions(req?.auth?.sub?.id, {
		limit: limit.value,
		page: page.value,
		order_by: order_by.value,
		order: order.value,
		start_date: start_date.value,
		end_date: end_date.value,
		format: format.value
	}
	)
		.then((data) => {
			if (format.value === 'csv') {
				toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params);
				res.setHeader('Content-disposition', `attachment; filename=${toolsLib.getKitConfig().api_name}-logins.csv`);
				res.set('Content-Type', 'text/csv');
				return res.status(202).send(data);
			} else {
				return res.json(data);
			}
		})
		.catch((err) => {
			loggerStake.error(req.uuid, 'controllers/p2p/fetchP2PTransactions', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const createP2PTransaction = (req, res) => {
	loggerStake.verbose(req.uuid, 'controllers/p2p/createP2PTransaction/auth', req.auth);

	const {  
        deal_id,
		amount_fiat,
		payment_method_used
	 } = req.swagger.params.data.value;

	loggerStake.verbose(
		req.uuid,
		'controllers/p2p/createP2PTransaction data',
        deal_id,
		amount_fiat,
		payment_method_used
	);

	toolsLib.p2p.createP2PTransaction({
        deal_id,
		user_id:  req.auth.sub.id,
		amount_fiat,
		payment_method_used
    }
		)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerStake.error(
				req.uuid,
				'controllers/p2p/createP2PTransaction err',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
}

module.exports = {
	createP2PDeal,
    fetchP2PDeals,
    fetchP2PTransactions,
    createP2PTransaction
};