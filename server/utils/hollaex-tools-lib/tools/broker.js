'use strict';

const { getModel } = require('./database/model');
const math = require('mathjs');
const ccxt = require('ccxt');
const rp = require('request-promise');
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

	const calculateDeal = (price, side, size, spread, multiplier = 1) => {
		// Calculate the price
		const parsedPrice = parseFloat(price) * multiplier;
		let totalPrice;
		let calculatedPrice;

		if (side === 'buy') {
			totalPrice = size / parsedPrice;
			calculatedPrice = totalPrice - (totalPrice * spread / 100)
		} else if (side === 'sell') {
			totalPrice = size * parsedPrice;
			calculatedPrice = totalPrice - (totalPrice * spread / 100)
		}

		return calculatedPrice;
	}

	const generateRandomToken = (user_id, side, size, expiryTime, multiplier, price) => {
		// Generate random token
		//TO DO: Use Crypto lib to generate random string
		const randomToken = randomString({
			length: 20, 
			numeric: true,
			letters: true
		});

		// set the generated token along with trade data in Redis expiry time(quote_expiry_time)
		const tradeData = {
			user_id,
			price,
			side,
			size,
			multiplier,
		}

		client.setexAsync(randomToken, expiryTime, JSON.stringify(tradeData));
		return randomToken;
	}

	try {
		const { symbol, side, size, exchange_name, spread, multiplier, user_id } = brokerQuote;

		// Get the broker record
		const broker = await getModel('broker').findOne({ where: { symbol } });

		if (!broker) {
			throw new Error("Broker pair could not be found.");
		} else if (broker.paused) {
			throw new Error("Broker pair is paused.");
		}

		// If it doesn't have a formula, generate one with the received parameters
		if (!broker.formula) {
			// TO DO: save the script in formula field.
			// await broker.update({ formula: <formulaScript> }, { fields: ['formula'] });

			if (exchange_name === 'binance') {
				// Get the price from redis
				const formattedSymbol = symbol.split('-').join('').toUpperCase();
				const quotePrice = await client.getAsync(formattedSymbol);

				// If it doesn't exist, fetch all market from Binance 
				if (!quotePrice) {
					return rp('https://api3.binance.com/api/v3/ticker/price')
						.then(res => {
							//Store all market prices in Redis with 1 minute expiry time
							//response is a stringfied object.
							client.setexAsync(symbol, 60, res);

							//Calculate the deal
							const foundSymbol = JSON.parse(res).find((data) => data.symbol === formattedSymbol);
							if (!foundSymbol) {
								throw new Error('Pair not found');
							}
							const calculatedPrice = calculateDeal(foundSymbol.price, side, size, spread, multiplier);

							// Generate randomToken to be used during deal execution
							const randomToken = generateRandomToken(user_id, side, size, broker.quote_expiry_time, multiplier, calculatedPrice);

							const responseObject = {
								token: randomToken,
								price: calculatedPrice
							}

							return responseObject;
						})
						.catch(err => {
							throw new Error(err);
						})

				} else {
					return new Promise((resolve, reject) => {
						//Calculate the deal
						const foundSymbol = JSON.parse(quotePrice).find((data) => data.symbol === formattedSymbol);
						if (!foundSymbol) {
							reject('Pair not found');
						}
						const calculatedPrice = calculateDeal(foundSymbol.price, side, size, spread, multiplier);

						// Generate randomToken to be used during deal execution
						const randomToken = generateRandomToken(user_id, side, size, broker.quote_expiry_time, multiplier, calculatedPrice);

						const responseObject = {
							token: randomToken,
							price: calculatedPrice
						}
						resolve(responseObject);
					})
				}

			} else if (exchange_name === 'otherExchange') {
				// TO DO: --
			}

		} else {
			//TO DO: Run formula
		}

	} catch (err) {
		throw new Error(err);
	}
}

const reverseOrder = async (orderData) => {
	//TODO: Call Binance API and create limit order
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
			'buy_price',
			'sell_price',
			'min_size',
			'max_size',
			'increment_size',
			'paused',
			'type',
			'quote_expiry_time',
			'rebalancing_symbol',
			'account',
			'formula'
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
	fetchBrokerQuote,
	reverseOrder
};
