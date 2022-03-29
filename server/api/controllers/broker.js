'use strict';

const { loggerBroker } = require('../../config/logger');
const { INIT_CHANNEL } = require('../../constants')
const { publisher } = require('../../db/pubsub');
const toolsLib = require('hollaex-tools-lib');
const { errorMessageConverter } = require('../../utils/conversion');

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
		increment_size
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
		increment_size
	);

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
}

function updateBrokerPair(req, res) {
	loggerBroker.verbose(
		req.uuid,
		'controllers/broker/updateBrokerPair auth',
		req.auth
	);
	
	const ip = req.headers['x-real-ip'];
	const { id, buy_price, sell_price, min_size, max_size, increment_size, paused, user_id } = req.swagger.params.data.value;
	
	loggerBroker.verbose(
		req.uuid,
		'controllers/broker/updateBrokerPair data',
		ip,
		id,
		buy_price,
		sell_price,
		min_size,
		max_size,
		increment_size,
		paused,
		user_id
	);

	toolsLib.broker.updateBrokerPair(id, {
		id, buy_price, sell_price, min_size, max_size, increment_size, paused, user_id
	})
		.then((data) => {
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
		.then((data) => {
			publisher.publish(INIT_CHANNEL, JSON.stringify({ type: 'refreshInit' }));
			return res.json({ message: "Successfully deleted broker pair." });
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
		'controllers/broker/deleteBrokerPair auth',
		req.auth
	);

	toolsLib.broker.fetchBrokerPairs([
		'id',
		'symbol',
		'buy_price',
		'sell_price',
		'paused',
		'min_size',
		'max_size',
		'increment_size'
	])
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

const executeBrokerDeal = (req, res) => {
	loggerBroker.verbose(
		req.uuid,
		'controllers/broker/executeBrokerDeal auth',
		req.auth
	);

	const {
		side,
		symbol,
		price,
		size,
	} = req.swagger.params.data.value;

	const userId = req.auth.sub.id;

	toolsLib.broker.executeBrokerDeal(userId, symbol, side, size, price)
		.then((data) => {
			loggerBroker.verbose(
				req.uuid,
				'controllers/broker/executeBrokerDeal done',
				data
			);
			res.json(data);
		})
		.catch((err) => {
			loggerBroker.error(
				req.uuid,
				'controllers/broker/executeBrokerDeal err',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
}

module.exports = {
	createBrokerPair,
	updateBrokerPair,
	deleteBrokerPair,
	getBrokerPairs,
	executeBrokerDeal
};
