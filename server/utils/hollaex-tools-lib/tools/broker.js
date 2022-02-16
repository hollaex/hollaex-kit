'use strict';

const { getModel } = require('./database/model');
const { getKitPairs } = require('./common');
const math = require('mathjs');
const dbQuery = require('./database/query');
const { SERVER_PATH } = require('../constants');
const { getNodeLib } = require(`${SERVER_PATH}/init`);
const { mapKitIdToNetworkId } = require('./user');

function validateBrokerPair(brokerPair) {
	const pairs = getKitPairs();

	if (!pairs.includes(brokerPair.symbol)) {
		throw new Error("Kit doesn't support the given pair symbol");
	}

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
	}
}

async function createBrokerPair(brokerPair) {
	validateBrokerPair(brokerPair);

	return await getModel("broker").create(brokerPair);
}

async function fetchBrokerPair(id) {
	return await getModel("broker").findOne({ where: { id } });
}

async function fetchBrokerPairs(attributes) {
	return await getModel("broker").findAll({ attributes });
}

async function updateBrokerPair(id, data) {
	const brokerPair = await getModel("broker").findOne({ where: { id } });

	const updatedPair = {
		...brokerPair,
		...data
	};

	validateBrokerPair(updatedPair);

	return brokerPair.update(data, {
		fields: [
			"buy_price",
			"sell_price",
			"min_size",
			"max_size",
			"increment_size",
			"paused"
		]
	});
}

async function deleteBrokerPair(id) {
	const brokerPair = await getModel("broker").findOne({ where: { id } });

	if (!brokerPair) {
		throw new Error("Broker pair could not be found.");
	} else if (!brokerPair.paused) {
		throw new Error("Broker pair could not be deleted while unpaused.");
	}

	await brokerPair.destroy();
}

async function executeBrokerDeal(userId, symbol, side, size, price) {
	const brokerPair = await getModel("broker").findOne({ where: { symbol } });

	if (!brokerPair) {
		throw new Error("Broker pair could not be found.");
	} else if (!brokerPair.paused) {
		throw new Error("Broker pair is paused.");
	}

	const brokerPrice = {
		"buy": brokerPair.sell_price,
		"sell": brokerPair.buy_price
	}[side];

	if (brokerPrice !== price) {
		throw new Error("Given price doesn't match the stored broker pair price.");
	}

	const feeData = generateOrderFeeData(
		user.verification_level,
		symbol,
		{ discount: user.discount }
	);

	const brokerNetworkId = (await mapKitIdToNetworkId([brokerPair.user_id]))[0];
	const userNetworkId = (await mapKitIdToNetworkId([userId]))[0];

	return await getNodeLib().createBrokerTrade(
		side,
		price,
		size,
		brokerNetworkId,
		userNetworkId,
		feeData
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
