'use strict';

const { getModel } = require('./database/model');
const math = require('mathjs');
const ccxt = require('ccxt');
const randomString = require('random-string');
const dbQuery = require('./database/query');
const { SERVER_PATH } = require('../constants');
const { getNodeLib } = require(`${SERVER_PATH}/init`);
const { client } = require('./database/redis');
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

const fetchBrokerQuote = async (brokerQuote) => {

	const calculateDeal = (price) => {
		// TO DO: Calculate the deal and apply exchange admin's formula(Dynamic Script) to the price
		//--
		return price;
	}

	const generateRandomToken = (size, side, user_id, price) => {
		// Generate random token
		const randomToken = randomString({ length: 20 });

		// set the generated token along with trade data in Redis with 30 second(Default) expiry time, The value will be editable by exchange admin
		const tradeData = {
			user_id,
			price,
			size,
			side
		}

		client.setexAsync(randomToken, 30, JSON.stringify(tradeData));
		return randomToken;
	}

	try {
		const { symbol, size, side, user_id } = brokerQuote;

		// Get the price from redis
		const quotePrice = await client.getAsync(symbol);

		// If it doesn't exist, fetch it from Binance 
		if (!quotePrice) {
			const formattedSymbol = symbol.split('-').join("").toUpperCase();
			return rp(`https://api.binance.com/api/v3/ticker/price?symbol=${formattedSymbol}`)
				.then(res => {

					//Store latest price in Redis with 1 minute expiry time
					client.setexAsync(symbol, 60, res.price);

					//Calculate the deal
					const calculatedPrice = calculateDeal(res.price);

					// Generate randomToken to be used during deal exacution
					const randomToken = generateRandomToken(size, side, user_id, calculatedPrice);

					const responseObject = {
						token: randomToken,
						price: calculatedPrice,
					}

					return responseObject;
				})
				.catch(err => {
					throw new Error(err);
				})
		} else {
			//Calculate the deal
			const calculatedPrice = calculateDeal(quotePrice);

			// Generate randomToken to be used during deal exacution
			const randomToken = generateRandomToken(size, side, user_id, calculatedPrice);

			const responseObject = {
				token: randomToken,
				price: calculatedPrice,
			}

			return responseObject;
		}

	} catch (err) {
		throw new Error(err);
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
			"paused",
			"type",
			"exchangeId",
			"exchange_api_key",
			"exchange_api_secret"
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
	executeBrokerDeal,
	fetchBrokerQuote
};
