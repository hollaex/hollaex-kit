'use strict';

const { loggerStake } = require('../../config/logger');
const { INIT_CHANNEL } = require('../../constants');
const { publisher } = require('../../db/pubsub');
const toolsLib = require('hollaex-tools-lib');
const { errorMessageConverter } = require('../../utils/conversion');

const getExchangeStakes = (req, res) => {
	loggerStake.verbose(req.uuid, 'controllers/stake/getExchangeStakes/auth', req.auth);

	const {  limit, page, order_by, order, start_date, end_date, format } = req.swagger.params;

	if (format.value && req.auth.scopes.indexOf(ROLES.ADMIN) === -1) {
		return res.status(403).json({ message: API_KEY_NOT_PERMITTED });
	}
	
	if (order_by.value && typeof order_by.value !== 'string') {
		loggerStake.error(
			req.uuid,
			'controllers/stake/getExchangeStakes invalid order_by',
			order_by.value
		);
		return res.status(400).json({ message: 'Invalid order by' });
	}

	toolsLib.stake.getExchangeStakePools({
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
			loggerStake.error(req.uuid, 'controllers/stake/getExchangeStakes', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
};

const createExchangeStakes = (req, res) => {
	loggerStake.verbose(req.uuid, 'controllers/stake/createExchangeStakes/auth', req.auth);

	const {  
		name,
		currency,
		reward_currency,
		account_id,
		apy,
		duration,
		slashing,
		slashing_principle_percentage,
		slashing_earning_percentage,
		early_unstake,
		min_amount,
		max_amount,
		onboarding,
		disclaimer,
		status
	 } = req.swagger.params.data.value;

	loggerStake.verbose(
		req.uuid,
		'controllers/stake/createExchangeStakes data',
		name,
		currency,
		reward_currency,
		account_id,
		apy,
		duration,
		slashing,
		slashing_principle_percentage,
		slashing_earning_percentage,
		early_unstake,
		min_amount,
		max_amount,
		onboarding,
		disclaimer,
		status
	);

	toolsLib.stake.createExchangeStakePool({
		name,
		currency,
		reward_currency,
		account_id,
		apy,
		duration,
		slashing,
		slashing_principle_percentage,
		slashing_earning_percentage,
		early_unstake,
		min_amount,
		max_amount,
		onboarding,
		disclaimer,
		status,
		user_id: req.auth.sub.id
	})
		.then((data) => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params?.data?.value);
			publisher.publish(INIT_CHANNEL, JSON.stringify({ type: 'refreshInit' }));
			return res.json(data);
		})
		.catch((err) => {
			loggerStake.error(
				req.uuid,
				'controllers/stake/createExchangeStakes err',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
}

const updateExchangeStakes = (req, res) => {
loggerStake.verbose(req.uuid, 'controllers/stake/updateExchangeStakes/auth', req.auth);

	const {
		id,
		name,
		currency,
		reward_currency,
		account_id,
		apy,
		duration,
		slashing,
		slashing_principle_percentage,
		slashing_earning_percentage,
		early_unstake,
		min_amount,
		max_amount,
		onboarding,
		disclaimer,
		status
	 } = req.swagger.params.data.value;

	loggerStake.verbose(
		req.uuid,
		'controllers/stake/updateExchangeStakes data',
		id,
		name,
		currency,
		reward_currency,
		account_id,
		apy,
		duration,
		slashing,
		slashing_principle_percentage,
		slashing_earning_percentage,
		early_unstake,
		min_amount,
		max_amount,
		onboarding,
		disclaimer,
		status
	);
	const auditInfo = { userEmail: req?.auth?.sub?.email, sessionId: req?.session_id, apiPath: req?.swagger?.apiPath, method: req?.swagger?.operationPath?.[2] };
	toolsLib.stake.updateExchangeStakePool(id, {
		name,
		currency,
		reward_currency,
		account_id,
		apy,
		duration,
		slashing,
		slashing_principle_percentage,
		slashing_earning_percentage,
		early_unstake,
		min_amount,
		max_amount,
		onboarding,
		disclaimer,
		status,
		user_id: req.auth.sub.id
	}, auditInfo)
		.then((data) => {
			publisher.publish(INIT_CHANNEL, JSON.stringify({ type: 'refreshInit' }));
			return res.json(data);
		})
		.catch((err) => {
			loggerStake.error(
				req.uuid,
				'controllers/stake/updateExchangeStakes err',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
}

const deleteExchangeStakes = (req, res) => {
	loggerStake.verbose(
		req.uuid,
		'controllers/stake/deleteExchangeStakes auth',
		req.auth
	);

	toolsLib.stake.updateExchangeStakePool(req.swagger.params.data.value.id, { status: 'terminated' })
		.then(() => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params?.data?.value);
			publisher.publish(INIT_CHANNEL, JSON.stringify({ type: 'refreshInit' }));
			return res.json({ message: 'Successfully deleted stake pool.' });
		})
		.catch((err) => {
			loggerStake.error(
				req.uuid,
				'controllers/broker/deleteExchangeStakes err',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
}

const getExchangeStakersForAdmin = (req, res) => {
	loggerStake.verbose(req.uuid, 'controllers/stake/getExchangeStakersAdmin/auth', req.auth);

	const { user_id, limit, page, order_by, order, start_date, end_date, format } = req.swagger.params;

	if (format.value && req.auth.scopes.indexOf(ROLES.ADMIN) === -1) {
		return res.status(403).json({ message: API_KEY_NOT_PERMITTED });
	}
	
	if (order_by.value && typeof order_by.value !== 'string') {
		loggerStake.error(
			req.uuid,
			'controllers/stake/getExchangeStakersAdmin invalid order_by',
			order_by.value
		);
		return res.status(400).json({ message: 'Invalid order by' });
	}

	toolsLib.stake.getExchangeStakers({
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
			loggerStake.error(req.uuid, 'controllers/stake/getExchangeStakersAdmin', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
}

const getExchangeStakersForUser = (req, res) => {
	loggerStake.verbose(req.uuid, 'controllers/stake/getExchangeStakersForUser/auth', req.auth);

	const { limit, page, order_by, order, start_date, end_date, format } = req.swagger.params;

	if (format.value && req.auth.scopes.indexOf(ROLES.ADMIN) === -1) {
		return res.status(403).json({ message: API_KEY_NOT_PERMITTED });
	}
	
	if (order_by.value && typeof order_by.value !== 'string') {
		loggerStake.error(
			req.uuid,
			'controllers/stake/getExchangeStakersForUser invalid order_by',
			order_by.value
		);
		return res.status(400).json({ message: 'Invalid order by' });
	}

	toolsLib.stake.getExchangeStakers({
		user_id: req.auth.sub.id,
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
				res.setHeader('Content-disposition', `attachment; filename=${toolsLib.getKitConfig().api_name}-logins.csv`);
				res.set('Content-Type', 'text/csv');
				return res.status(202).send(data);
			} else {
				return res.json(data);
			}
		})
		.catch((err) => {
			loggerStake.error(req.uuid, 'controllers/stake/getExchangeStakersForUser', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
}

const createStaker = (req, res) => {
	loggerStake.verbose(req.uuid, 'controllers/stake/createStaker/auth', req.auth);

	const {  
		stake_id,
		amount
	 } = req.swagger.params.data.value;

	loggerStake.verbose(
		req.uuid,
		'controllers/stake/createStaker data',
		stake_id,
		amount
	);

	toolsLib.stake.createExchangeStaker(
		stake_id,
		amount,
		req.auth.sub.id
		)
		.then((data) => {
			publisher.publish(INIT_CHANNEL, JSON.stringify({ type: 'refreshInit' }));
			return res.json(data);
		})
		.catch((err) => {
			loggerStake.error(
				req.uuid,
				'controllers/stake/createStaker err',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
}

const deleteExchangeStaker = (req, res) => {
	loggerStake.verbose(
		req.uuid,
		'controllers/stake/deleteExchangeStaker auth',
		req.auth
	);

	toolsLib.stake.deleteExchangeStaker(req.swagger.params.data.value.id, req.auth.sub.id)
		.then(() => {
			publisher.publish(INIT_CHANNEL, JSON.stringify({ type: 'refreshInit' }));
			return res.json({ message: 'Successfully deleted stake.' });
		})
		.catch((err) => {
			loggerStake.error(
				req.uuid,
				'controllers/broker/stake err',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
}

const unstakeEstimateSlash = (req, res) => {
	loggerStake.verbose(req.uuid, 'controllers/stake/unstakeEstimateSlash/auth', req.auth);

	const { id } = req.swagger.params;

	toolsLib.stake.unstakeEstimateSlash(id.value)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerStake.error(req.uuid, 'controllers/stake/unstakeEstimateSlash', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
}

const unstakeEstimateSlashAdmin = (req, res) => {
	loggerStake.verbose(req.uuid, 'controllers/stake/unstakeEstimateSlashAdmin/auth', req.auth);

	const { id } = req.swagger.params;

	toolsLib.stake.unstakeEstimateSlashAdmin(id.value)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerStake.error(req.uuid, 'controllers/stake/unstakeEstimateSlashAdmin', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
}

const fetchStakeAnalytics = (req, res) => {

	loggerStake.verbose(req.uuid, 'controllers/stake/fetchStakeAnalytics/auth', req.auth);

	toolsLib.stake.fetchStakeAnalytics()
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerStake.error(req.uuid, 'controllers/stake/fetchStakeAnalytics', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err, req?.auth?.sub?.lang) });
		});
}

module.exports = {
	getExchangeStakes,
	createExchangeStakes,
	updateExchangeStakes,
	deleteExchangeStakes,
	getExchangeStakersForAdmin,
	getExchangeStakersForUser,
	createStaker,
	deleteExchangeStaker,
	unstakeEstimateSlash,
	unstakeEstimateSlashAdmin,
	fetchStakeAnalytics
};