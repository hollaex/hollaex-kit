'use strict';

const { loggerBroker } = require('../../config/logger');
const { INIT_CHANNEL } = require('../../constants');
const { publisher } = require('../../db/pubsub');
const toolsLib = require('hollaex-tools-lib');
const { errorMessageConverter } = require('../../utils/conversion');

const getTrackedExchangeMarkets = (req, res) => {

	loggerBroker.verbose(
		req.uuid,
		'controllers/broker/getTrackedExchangeMarkets get',
		req.auth
	);
	const {
		exchange_name
	} = req.swagger.params;

	toolsLib.broker.fetchTrackedExchangeMarkets(exchange_name.value)
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerBroker.error(
				req.uuid,
				'controllers/broker/getTrackedExchangeMarkets err',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const createBrokerPair = (req, res) => {
	loggerBroker.verbose(
		req.uuid,
		'controllers/broker/createBrokerPair auth',
		req.auth
	);
	const ip = req.headers['x-real-ip'];

	const {
		symbol,
		buy_price,
		sell_price,
		paused,
		user_id,
		min_size,
		max_size,
		type,
		quote_expiry_time,
		rebalancing_symbol,
		account,
		formula,
		spread,
	} = req.swagger.params.data.value;

	loggerBroker.verbose(
		req.uuid,
		'controllers/broker/createBrokerPair data',
		ip,
		symbol,
		buy_price,
		sell_price,
		paused,
		user_id,
		min_size,
		max_size,
		type,
		quote_expiry_time,
		rebalancing_symbol,
		account,
		formula,
		spread,
	);

	toolsLib.broker.createBrokerPair({
		symbol,
		buy_price,
		sell_price,
		paused,
		user_id,
		min_size,
		max_size,
		type,
		quote_expiry_time,
		rebalancing_symbol,
		account,
		formula,
		spread,
	})
		.then((data) => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params?.data?.value);
			publisher.publish(INIT_CHANNEL, JSON.stringify({ type: 'refreshInit' }));
			return res.json(data);
		})
		.catch((err) => {
			loggerBroker.error(
				req.uuid,
				'controllers/broker/createBrokerPair err',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};
const testBroker = (req, res) => {
	loggerBroker.verbose(
		req.uuid,
		'controllers/broker/testBroker get',
		req.auth
	);

	const {
		formula,
		spread,
	} = req.swagger.params.data.value;

	toolsLib.broker.testBroker({
		formula,
		spread,
	})
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerBroker.error(
				req.uuid,
				'controllers/broker/testBroker err',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};


const testRebalance = (req, res) => {
	loggerBroker.verbose(
		req.uuid,
		'controllers/broker/testRebalance get',
		req.auth
	);

	const {
		exchange_id,
		api_key,
		api_secret
	} = req.swagger.params;

	toolsLib.broker.testRebalance({
		exchange_id: exchange_id.value,
		api_key: api_key.value,
		api_secret: api_secret.value
	})
		.then((data) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerBroker.error(
				req.uuid,
				'controllers/broker/testRebalance err',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

function updateBrokerPair(req, res) {
	loggerBroker.verbose(
		req.uuid,
		'controllers/broker/updateBrokerPair auth',
		req.auth
	);

	const ip = req.headers['x-real-ip'];
	const { id,
		buy_price,
		sell_price,
		min_size,
		max_size,
		paused,
		user_id,
		type,
		quote_expiry_time,
		rebalancing_symbol,
		account,
		formula,
		spread } = req.swagger.params.data.value;

	loggerBroker.verbose(
		req.uuid,
		'controllers/broker/updateBrokerPair data',
		ip,
		id,
		buy_price,
		sell_price,
		min_size,
		max_size,
		paused,
		user_id,
		type,
		quote_expiry_time,
		rebalancing_symbol,
		account,
		formula,
		spread
	);

	toolsLib.broker.updateBrokerPair(id, req.swagger.params.data.value)
		.then((data) => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params?.data?.value);
			publisher.publish(INIT_CHANNEL, JSON.stringify({ type: 'refreshInit' }));
			return res.json(data);
		})
		.catch((err) => {
			loggerBroker.error(
				req.uuid,
				'controllers/broker/updateBrokerPair err',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
}

function deleteBrokerPair(req, res) {
	loggerBroker.verbose(
		req.uuid,
		'controllers/broker/deleteBrokerPair auth',
		req.auth
	);

	toolsLib.broker.deleteBrokerPair(req.swagger.params.data.value.id)
		.then(() => {
			toolsLib.user.createAuditLog({ email: req?.auth?.sub?.email, session_id: req?.session_id }, req?.swagger?.apiPath, req?.swagger?.operationPath?.[2], req?.swagger?.params?.data?.value);
			publisher.publish(INIT_CHANNEL, JSON.stringify({ type: 'refreshInit' }));
			return res.json({ message: 'Successfully deleted broker pair.' });
		})
		.catch((err) => {
			loggerBroker.error(
				req.uuid,
				'controllers/broker/updateBrokerPair err',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
}

function getBrokerPairs(req, res) {
	loggerBroker.verbose(
		req.uuid,
		'controllers/broker/getBrokerPairs auth',
		req.auth
	);

	const attributes = [
		'id',
		'user_id',
		'symbol',
		'buy_price',
		'sell_price',
		'paused',
		'min_size',
		'max_size',
		'type',
		'quote_expiry_time',
		'rebalancing_symbol',
		'account',
		'spread',
		'formula'
	];


	toolsLib.broker.fetchBrokerPairs(attributes)
		.then((brokerPairs) => {
			return res.json(brokerPairs);
		})
		.catch((err) => {
			loggerBroker.error(
				req.uuid,
				'controllers/broker/getBrokerDeals err',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});

}

module.exports = {
	testBroker,
	testRebalance,
	createBrokerPair,
	updateBrokerPair,
	deleteBrokerPair,
	getBrokerPairs,
	getTrackedExchangeMarkets
};