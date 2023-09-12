'use strict';

const { loggerBroker, loggerAdmin } = require('../../config/logger');
const { INIT_CHANNEL } = require('../../constants');
const { publisher } = require('../../db/pubsub');
const toolsLib = require('hollaex-tools-lib');
const { errorMessageConverter } = require('../../utils/conversion');

const getExchangeStakes = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/stake/getExchangeStakes/auth', req.auth);

	const {  limit, page, order_by, order, start_date, end_date, format } = req.swagger.params;

	if (format.value && req.auth.scopes.indexOf(ROLES.ADMIN) === -1) {
		return res.status(403).json({ message: API_KEY_NOT_PERMITTED });
	}
	
	if (order_by.value && typeof order_by.value !== 'string') {
		loggerAdmin.error(
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
				res.setHeader('Content-disposition', `attachment; filename=${toolsLib.getKitConfig().api_name}-logins.csv`);
				res.set('Content-Type', 'text/csv');
				return res.status(202).send(data);
			} else {
				return res.json(data);
			}
		})
		.catch((err) => {
			loggerAdmin.error(req.uuid, 'controllers/stake/getExchangeStakes', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const createExchangeStakes = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/stake/createExchangeStakes/auth', req.auth);

	const {  
		name,
		currency,
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

	loggerAdmin.verbose(
		req.uuid,
		'controllers/stake/createExchangeStakes data',
		name,
		currency,
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
			publisher.publish(INIT_CHANNEL, JSON.stringify({ type: 'refreshInit' }));
			return res.json(data);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/stake/createExchangeStakes err',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
}

const updateExchangeStakes = (req, res) => {
loggerAdmin.verbose(req.uuid, 'controllers/stake/updateExchangeStakes/auth', req.auth);

	const {
		id,
		name,
		currency,
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

	loggerAdmin.verbose(
		req.uuid,
		'controllers/stake/updateExchangeStakes data',
		id,
		name,
		currency,
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

	toolsLib.stake.updateExchangeStakePool(id, {
		name,
		currency,
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
			publisher.publish(INIT_CHANNEL, JSON.stringify({ type: 'refreshInit' }));
			return res.json(data);
		})
		.catch((err) => {
			loggerAdmin.error(
				req.uuid,
				'controllers/stake/updateExchangeStakes err',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
}

const deleteExchangeStakes = (req, res) => {

}

const getExchangeStakers = (req, res) => {

}

const createStaker = (req, res) => {
	loggerAdmin.verbose(req.uuid, 'controllers/stake/createStaker/auth', req.auth);

	const {  
		stake_id,
		amount
	 } = req.swagger.params.data.value;

	loggerAdmin.verbose(
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
			loggerAdmin.error(
				req.uuid,
				'controllers/stake/createStaker err',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
}

module.exports = {
	getExchangeStakes,
	createExchangeStakes,
	updateExchangeStakes,
	deleteExchangeStakes,
	getExchangeStakers,
	createStaker
};