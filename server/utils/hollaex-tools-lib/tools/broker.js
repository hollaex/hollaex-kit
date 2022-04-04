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
const _eval = require('eval');
const { loggerBroker } = require('../../../config/logger');

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

const binanceScript = async () => {
	// Get the price from redis
	const formattedSymbol = symbol.split('-').join('').toUpperCase();
	const quotePrice = await client.getAsync(symbol);

	// If it doesn't exist, fetch all market from Binance 
	if (!quotePrice) {
		return rp('https://api3.binance.com/api/v3/ticker/price')
			.then((res) => {
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
}

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

const generateRandomToken = (user_id, side, size, expiryTime = 30, multiplier, price) => {
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

const fetchBrokerQuote = async (brokerQuote) => {
	try {
		const { symbol, side, size, user_id } = brokerQuote;

		// Get the broker record
		const broker = await getModel('broker').findOne({ where: { symbol } });

		if (!broker) {
			throw new Error("Broker pair could not be found.");
		} else if (broker.paused) {
			throw new Error("Broker pair is paused.");
		}

		if (broker.formula) {
			//Run formula
			const resObject = _eval(broker.formula, "formula", {
				symbol, side, size, user_id, client, broker, calculateDeal, generateRandomToken, rp
			}, true);

			return resObject;

		} else {
			throw new Error("Broker formula not found.");
		}

	} catch (err) {
		throw new Error(err);
	}
}

const reverseTransaction = async (orderData) => {
	const { symbol, side, size, price } = orderData;

	try {
		const broker = await getModel('broker').findOne({ where: { symbol } });

		if (broker.account && broker.account.hasOwnProperty('binance')) {
			const binanceInfo = broker.account.binance;
			const exchangeId = 'binance'
				, exchangeClass = ccxt[exchangeId]
				, exchange = new exchangeClass({
					'apiKey': binanceInfo.apiKey,
					'secret': binanceInfo.apiSecret,
				})

			const formattedSymbol = symbol.split('-').join('').toUpperCase();
			const formattedRebalancingSymbol = broker.rebalancing_symbol && broker.rebalancing_symbol.split('-').join('').toUpperCase();

			if (side === 'buy') {
				exchange.createLimitBuyOrder(formattedRebalancingSymbol || formattedSymbol, size, price - price * 0.05)
					.then(res => loggerBroker.verbose(res))
					.catch(err => loggerBroker.error(err));
			} else if (side == 'sell') {
				exchange.createLimitSellOrder(formattedRebalancingSymbol || formattedSymbol, size, price + price * 0.05)
					.then(res => loggerBroker.verbose(res))
					.catch(err => loggerBroker.error(err));
			}
		}
	} catch (err) {
		loggerBroker.error(err);
	}

}

const createBrokerPair = async (brokerPair) => {
	validateBrokerPair(brokerPair);
	return fetchBrokerPair(brokerPair.symbol)
		.then((deal) => {
			if (deal) {
				throw new Error('A deal for this symbol alreadys exists')
			}
			const {
				formula,
				exchange_name,
				spread,
				multiplier
			} = brokerPair;

			let adminFormula;

			// If it is a custom script(users send their own formula)
			if (formula) {
				adminFormula = formula;
			}
			// If user selects a exchange
			else if (exchange_name === 'binance') {
				const binanceFormula = `
					const spread = ${spread}; 
					const multiplier = ${multiplier}; 
					module.exports = (${binanceScript.toString()})()
				`;

				adminFormula = binanceFormula;
			}
			const newBrokerObject = {
				...brokerPair,
				formula: adminFormula
			};


			return getModel("broker").create(newBrokerObject, { raw: true });
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

	const { exchange_name, spread, multiplier, account, ...rest } = data;

	//Validate account JSONB object
	for (const [key, value] of Object.entries(account)) {
		if (!value.hasOwnProperty('apiKey')) {
			value.apiKey = brokerPair.account[key].apiKey;
		}

		if (!value.hasOwnProperty('apiSecret')) {
			value.apiSecret = brokerPair.account[key].apiSecret;
		}
	}

	const updatedPair = {
		...brokerPair,
		...rest,
		account
	};

	validateBrokerPair(updatedPair);
	if (exchange_name === 'binance') {

		const binanceFormula = `
			const spread = ${spread}; 
			const multiplier = ${multiplier}; 
			module.exports = (${binanceScript.toString()})()
		`;

		updatedPair.formula = binanceFormula;
	}

	return brokerPair.update(updatedPair, {
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

const executeBrokerDeal = async (userId, symbol, side, size, price, token) => {
	const storedToken = await client.getAsync(token);
	if (!storedToken) {
		throw new Error("Token expired");
	}
	if (storedToken.user_id !== userId) {
		throw new Error("Auth doesn't match");
	}

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
	reverseTransaction
};
