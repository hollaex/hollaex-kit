'use strict';

const { loggerP2P } = require('../../config/logger');
const toolsLib = require('hollaex-tools-lib');
const { errorMessageConverter } = require('../../utils/conversion');
const {  ROLES } = require('../../constants');
const { API_KEY_NOT_PERMITTED } = require('../../messages');
const createP2PDeal = (req, res) => {
	loggerP2P.verbose(req.uuid, 'controllers/p2p/createP2PDeal/auth', req.auth);

	const {  
        price_type,
		dynamic_pair,
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
        region,
		side
	} = req.swagger.params.data.value;

	loggerP2P.verbose(
		req.uuid,
		'controllers/p2p/createP2PDeal data',
        price_type,
		dynamic_pair,
        buying_asset,
        spending_asset,
        exchange_rate,
        spread,
        total_order_amount,
        min_order_value,
        max_order_value,
        terms,
        auto_response,
        region,
		side
	);

	toolsLib.p2p.createP2PDeal({
        merchant_id: req.auth.sub.id,
        side,
        price_type,
		dynamic_pair,
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
        region
    }
		)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerP2P.error(
				req.uuid,
				'controllers/p2p/createP2PDeal err',
				err.message
			);
			const messageObj = errorMessageConverter(err, req?.auth?.sub?.lang);
			return res.status(err.statusCode || 400).json({ message: messageObj?.message, lang: messageObj?.lang, code: messageObj?.code });
		});
};

const updateP2PDeal = (req, res) => {
	loggerP2P.verbose(req.uuid, 'controllers/p2p/updateP2PDeal/auth', req.auth);

	const {  
        price_type,
		dynamic_pair,
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
        region,
        edited_ids,
        status,
		side,
        id
	} = req.swagger.params.data.value;

	loggerP2P.verbose(
		req.uuid,
		'controllers/p2p/updateP2PDeal data',
        price_type,
		dynamic_pair,
        buying_asset,
        spending_asset,
        exchange_rate,
        spread,
        total_order_amount,
        min_order_value,
        max_order_value,
        terms,
        auto_response,
        region,
        id,
		side
	);

	toolsLib.p2p.updateP2PDeal({
        id,
        merchant_id: req.auth.sub.id,
        edited_ids,
        side,
        price_type,
		dynamic_pair,
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
        region,
        status
    }
		)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerP2P.error(
				req.uuid,
				'controllers/p2p/updateP2PDeal err',
				err.message
			);
			const messageObj = errorMessageConverter(err, req?.auth?.sub?.lang);
			return res.status(err.statusCode || 400).json({ message: messageObj?.message, lang: messageObj?.lang, code: messageObj?.code });
		});
};
const deleteP2PDeal = (req, res) => {
	loggerP2P.verbose(req.uuid, 'controllers/p2p/deleteP2PDeal/auth', req.auth);

	const {  
        removed_ids
	} = req.swagger.params.data.value;

	loggerP2P.verbose(
		req.uuid,
		'controllers/p2p/deleteP2PDeal data',
        removed_ids
	);

	toolsLib.p2p.deleteP2PDeal(removed_ids, req.auth.sub.id)
		.then(() => {
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerP2P.error(
				req.uuid,
				'controllers/p2p/deleteP2PDeal err',
				err.message
			);
			const messageObj = errorMessageConverter(err, req?.auth?.sub?.lang);
			return res.status(err.statusCode || 400).json({ message: messageObj?.message, lang: messageObj?.lang, code: messageObj?.code });
		});
};

const fetchP2PDeals = (req, res) => {
	loggerP2P.verbose(req.uuid, 'controllers/p2p/fetchP2PDeals/auth', req.auth);

	const { user_id, limit, page, order_by, order, start_date, end_date, status } = req.swagger.params;


	if (order_by.value && typeof order_by.value !== 'string') {
		loggerP2P.error(
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
        status: status.value
	}
	)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerP2P.error(req.uuid, 'controllers/p2p/fetchP2PDeals', err.message);
			const messageObj = errorMessageConverter(err, req?.auth?.sub?.lang);
			return res.status(err.statusCode || 400).json({ message: messageObj?.message, lang: messageObj?.lang, code: messageObj?.code });
		});
};

const fetchP2PDisputes = (req, res) => {
	loggerP2P.verbose(req.uuid, 'controllers/p2p/fetchP2PDisputes/auth', req.auth);

	const {user_id, limit, page, order_by, order, start_date, end_date, format } = req.swagger.params;

	
	if (order_by.value && typeof order_by.value !== 'string') {
		loggerP2P.error(
			req.uuid,
			'controllers/p2p/fetchP2PDisputes invalid order_by',
			order_by.value
		);
		return res.status(400).json({ message: 'Invalid order by' });
	}

	toolsLib.p2p.fetchP2PDisputes({
        user_id: user_id.value,
		limit: limit.value,
		page: page.value,
		order_by: order_by.value,
		order: order.value,
		start_date: start_date.value,
		end_date: end_date.value,
		format: format.value,
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
			loggerP2P.error(req.uuid, 'controllers/p2p/fetchP2PDisputes', err.message);
			const messageObj = errorMessageConverter(err, req?.auth?.sub?.lang);
			return res.status(err.statusCode || 400).json({ message: messageObj?.message, lang: messageObj?.lang, code: messageObj?.code });
		});
};


const fetchP2PTransactions = (req, res) => {
	loggerP2P.verbose(req.uuid, 'controllers/p2p/fetchP2PTransactions/auth', req.auth);

	const { id, limit, page, order_by, order, start_date, end_date, format } = req.swagger.params;

	if (order_by.value && typeof order_by.value !== 'string') {
		loggerP2P.error(
			req.uuid,
			'controllers/p2p/fetchP2PTransactions invalid order_by',
			order_by.value
		);
		return res.status(400).json({ message: 'Invalid order by' });
	}

	toolsLib.p2p.fetchP2PTransactions(req?.auth?.sub?.id, {
        id: id.value,
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
			loggerP2P.error(req.uuid, 'controllers/p2p/fetchP2PTransactions', err.message);
			const messageObj = errorMessageConverter(err, req?.auth?.sub?.lang);
			return res.status(err.statusCode || 400).json({ message: messageObj?.message, lang: messageObj?.lang, code: messageObj?.code });
		});
};

const createP2PTransaction = (req, res) => {
	loggerP2P.verbose(req.uuid, 'controllers/p2p/createP2PTransaction/auth', req.auth);
	const ip = req.headers['x-real-ip'];
	const {  
        deal_id,
		amount_fiat,
		payment_method_used,
		side
	} = req.swagger.params.data.value;

	loggerP2P.verbose(
		req.uuid,
		'controllers/p2p/createP2PTransaction data',
        deal_id,
		amount_fiat,
		payment_method_used,
		side
	);

	toolsLib.p2p.createP2PTransaction({
        deal_id,
		user_id:  req.auth.sub.id,
		amount_fiat,
		side,
		payment_method_used,
		ip
    }
		)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerP2P.error(
				req.uuid,
				'controllers/p2p/createP2PTransaction err',
				err.message
			);
			const messageObj = errorMessageConverter(err, req?.auth?.sub?.lang);
			return res.status(err.statusCode || 400).json({ message: messageObj?.message, lang: messageObj?.lang, code: messageObj?.code });
		});
};

const updateP2PTransaction = (req, res) => {
	loggerP2P.verbose(req.uuid, 'controllers/p2p/updateP2PTransaction/auth', req.auth);
	const ip = req.headers['x-real-ip'];
	const {  
        id,
        user_status,
        merchant_status,
        cancellation_reason,

	} = req.swagger.params.data.value;

	loggerP2P.verbose(
		req.uuid,
		'controllers/p2p/updateP2PTransaction data',
        id,
        user_status,
        merchant_status,
        cancellation_reason,
	);

	toolsLib.p2p.updateP2pTransaction({
        user_id:  req.auth.sub.id,
        id,
        user_status,
        merchant_status,
        cancellation_reason,
		ip
    }
		)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerP2P.error(
				req.uuid,
				'controllers/p2p/updateP2PTransaction err',
				err.message
			);
			const messageObj = errorMessageConverter(err, req?.auth?.sub?.lang);
			return res.status(err.statusCode || 400).json({ message: messageObj?.message, lang: messageObj?.lang, code: messageObj?.code });
		});
}
const updateP2PDispute = (req, res) => {
	loggerP2P.verbose(req.uuid, 'controllers/p2p/updateP2PDispute/auth', req.auth);

	const {  
        id,
        resolution,
        status,
	} = req.swagger.params.data.value;

	loggerP2P.verbose(
		req.uuid,
		'controllers/p2p/updateP2PDispute data',
        id,
        resolution,
        status,
	);

	toolsLib.p2p.updateP2pDispute({
        id,
        resolution,
        status,
    }
		)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerP2P.error(
				req.uuid,
				'controllers/p2p/updateP2PDispute err',
				err.message
			);
			const messageObj = errorMessageConverter(err, req?.auth?.sub?.lang);
			return res.status(err.statusCode || 400).json({ message: messageObj?.message, lang: messageObj?.lang, code: messageObj?.code });
		});
};

const createP2pChatMessage = (req, res) => {
	loggerP2P.verbose(req.uuid, 'controllers/p2p/createP2pChatMessage/auth', req.auth);

	const {  
        receiver_id,
        message,
        transaction_id
	} = req.swagger.params.data.value;

	loggerP2P.verbose(
		req.uuid,
		'controllers/p2p/createP2pChatMessage data',
        receiver_id,
        message,
        transaction_id
      
	);

	toolsLib.p2p.createP2pChatMessage({
        sender_id: req.auth.sub.id,
        receiver_id,
        transaction_id,
        message,
    }
		)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerP2P.error(
				req.uuid,
				'controllers/p2p/createP2pChatMessage err',
				err.message
			);
			const messageObj = errorMessageConverter(err, req?.auth?.sub?.lang);
			return res.status(err.statusCode || 400).json({ message: messageObj?.message, lang: messageObj?.lang, code: messageObj?.code });
		});
};

const createP2PFeedback = (req, res) => {
	loggerP2P.verbose(req.uuid, 'controllers/p2p/createP2PFeedback/auth', req.auth);

	const {  
        transaction_id,
		comment,
		rating
	} = req.swagger.params.data.value;

	loggerP2P.verbose(
		req.uuid,
		'controllers/p2p/createP2PFeedback data',
		transaction_id,
		comment,
		rating
	);

	toolsLib.p2p.createMerchantFeedback({
		user_id:  req.auth.sub.id,
		transaction_id,
		comment,
		rating
    }
		)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerP2P.error(
				req.uuid,
				'controllers/p2p/createP2PFeedback err',
				err.message
			);
			const messageObj = errorMessageConverter(err, req?.auth?.sub?.lang);
			return res.status(err.statusCode || 400).json({ message: messageObj?.message, lang: messageObj?.lang, code: messageObj?.code });
		});
};

const fetchP2PFeedbacks = (req, res) => {
	loggerP2P.verbose(req.uuid, 'controllers/p2p/fetchP2PFeedbacks/auth', req.auth);

	const { transaction_id, merchant_id, user_id, limit, page, order_by, order, start_date, end_date, format } = req.swagger.params;


	if (order_by.value && typeof order_by.value !== 'string') {
		loggerP2P.error(
			req.uuid,
			'controllers/p2p/fetchP2PFeedbacks invalid order_by',
			order_by.value
		);
		return res.status(400).json({ message: 'Invalid order by' });
	}

	toolsLib.p2p.fetchP2PFeedbacks({
		transaction_id: transaction_id.value,
		merchant_id: merchant_id.value,
		user_id: user_id.value,
		limit: limit.value,
		page: page.value,
		order_by: order_by.value,
		order: order.value,
		start_date: start_date.value,
		end_date: end_date.value,
		format: format.value,
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
			loggerP2P.error(req.uuid, 'controllers/p2p/fetchP2PFeedbacks', err.message);
			const messageObj = errorMessageConverter(err, req?.auth?.sub?.lang);
			return res.status(err.statusCode || 400).json({ message: messageObj?.message, lang: messageObj?.lang, code: messageObj?.code });
		});
};

const fetchP2PProfile = (req, res) => {
	loggerP2P.verbose(req.uuid, 'controllers/p2p/fetchP2PProfile/auth', req.auth);

	const { user_id } = req.swagger.params;

	
	toolsLib.p2p.fetchP2PProfile(user_id.value)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerP2P.error(req.uuid, 'controllers/p2p/fetchP2PProfile', err.message);
			const messageObj = errorMessageConverter(err, req?.auth?.sub?.lang);
			return res.status(err.statusCode || 400).json({ message: messageObj?.message, lang: messageObj?.lang, code: messageObj?.code });
		});
};


const downloadP2pDisputeCsv = (req, res) => {
	loggerP2P.verbose(req.uuid, 'controllers/p2p/downloadP2pDisputeCsv/auth', req.auth);

	const { user_id, limit, page, order_by, order, start_date, end_date } = req.swagger.params;

	if (order_by.value && typeof order_by.value !== 'string') {
		loggerP2P.error(
			req.uuid,
			'controllers/p2p/downloadP2pDisputeCsv invalid order_by',
			order_by.value
		);
		return res.status(400).json({ message: 'Invalid order by' });
	}

	toolsLib.p2p.fetchP2PDisputes({
		user_id: user_id.value,
		limit: limit.value,
		page: page.value,
		order_by: order_by.value,
		order: order.value,
		start_date: start_date.value,
		end_date: end_date.value,
		format: 'csv',
	}
	)
		.then((data) => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params);
			res.setHeader('Content-disposition', `attachment; filename=${toolsLib.getKitConfig().api_name}-logins.csv`);
			res.set('Content-Type', 'text/csv');
			return res.status(202).send(data);
		})
		.catch((err) => {
			loggerP2P.error(req.uuid, 'controllers/p2p/downloadP2pDisputeCsv', err.message);
			const messageObj = errorMessageConverter(err, req?.auth?.sub?.lang);
			return res.status(err.statusCode || 400).json({ message: messageObj?.message, lang: messageObj?.lang, code: messageObj?.code });
		});
};


module.exports = {
	createP2PDeal,
    fetchP2PDeals,
    fetchP2PTransactions,
    createP2PTransaction,
    createP2pChatMessage,
    updateP2PTransaction,
    fetchP2PDisputes,
    updateP2PDeal,
	deleteP2PDeal,
    updateP2PDispute,
	createP2PFeedback,
	fetchP2PFeedbacks,
	fetchP2PProfile,
	downloadP2pDisputeCsv
};