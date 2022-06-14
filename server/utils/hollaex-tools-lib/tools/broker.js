'use strict';

const { getModel } = require('./database/model');
const math = require('mathjs');
const dbQuery = require('./database/query');
const { SERVER_PATH } = require('../constants');
const { getNodeLib } = require(`${SERVER_PATH}/init`);
const { getUserByKitId } = require('./user');
const { validatePair, getKitTier } = require('./common');

const validateBrokerPair = (brokerPair) => {
	if (math.compare(brokerPair.buy_price, 0) !== 1) {
		throw new Error("Broker buy price must be bigger than zero.")
	} else if (math.compare(brokerPair.sell_price, 0) !== 1) {
		throw new Error("Broker sell price must be bigger than zero.")
	} else if (math.compare(brokerPair.min_size, 0) !== 1) {
		throw new Error("Broker minimum order size must be bigger than zero.")
	} else if (math.compare(brokerPair.max_size, brokerPair.min_size) !== 1) {
		throw new Error("Broker maximum order size must be bigger than minimum order size.")
	} else if (math.compare(brokerPair.increment_size, 0) !== 1) {
		throw new Error("Broker order price increment must be bigger than zero.")
	} else if (brokerPair.symbol && !validatePair(brokerPair.symbol)) {
		throw new Error('invalid symbol');
	}
}

const createBrokerPair = (brokerPair) => {
	validateBrokerPair(brokerPair);
	return fetchBrokerPair(brokerPair.symbol)
		.then((deal) => {
			if (deal) {
				throw new Error('A deal for this symbol alreadys exists')
			}
			return getModel("broker").create(brokerPair, { raw: true });
		})
}

const fetchBrokerPair = (symbol) => {
	return getModel("broker").findOne({ where: { symbol } });
}

async function fetchBrokerPairs(attributes) {
	return await getModel("broker").findAll({ attributes });
}

const updateBrokerPair = async (id, data) => {
	const brokerPair = await getModel("broker").findOne({ where: { id } });
	if (!brokerPair) {
		throw new Error('Pair does not exist');
	}

	const updatedPair = {
		...brokerPair,
		...data
	};

	validateBrokerPair(updatedPair);
	return brokerPair.update(data, {
		fields: [
			'user_id',
			"buy_price",
			"sell_price",
			"min_size",
			"max_size",
			"increment_size",
			"paused"
		]
	});
}

const deleteBrokerPair = async (id) => {
	const brokerPair = await getModel("broker").findOne({ where: { id } });

	if (!brokerPair) {
		throw new Error("Broker pair could not be found.");
	} else if (!brokerPair.paused) {
		throw new Error("Broker pair could not be deleted while unpaused.");
	}

	return brokerPair.destroy();
}

const executeBrokerDeal = async (userId, symbol, side, size, price) => {
	const brokerPair = await getModel("broker").findOne({ where: { symbol } });

	if (!brokerPair) {
		throw new Error("Broker pair could not be found.");
	} else if (brokerPair.paused) {
		throw new Error("Broker pair is paused.");
	}

	const brokerPrice = {
		'buy': brokerPair.sell_price,
		'sell': brokerPair.buy_price
	}[side];

	if (brokerPrice !== price) {
		throw new Error(`Given price doesn't match the broker pair price. Price should be ${brokerPrice}`);
	}

	const broker = await getUserByKitId(brokerPair.user_id);
	const user = await getUserByKitId(userId);

	const tierBroker = getKitTier(broker.verification_level);
	const tierUser = getKitTier(user.verification_level);

	const makerFee = tierBroker.fees.maker[symbol];
	const takerFee = tierUser.fees.taker[symbol];

	return getNodeLib().createBrokerTrade(
		symbol,
		side,
		price,
		size,
		broker.network_id,
		user.network_id,
		{ maker: makerFee, taker: takerFee }
	);
}

module.exports = {
	createBrokerPair,
	fetchBrokerPair,
	fetchBrokerPairs,
	updateBrokerPair,
	deleteBrokerPair,
	executeBrokerDeal
};
