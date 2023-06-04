'use strict';

const { getModel } = require('./database/model');
const math = require('mathjs');
const ccxt = require('ccxt');
const randomString = require('random-string');
const { SERVER_PATH } = require('../constants');
const { EXCHANGE_PLAN_INTERVAL_TIME, EXCHANGE_PLAN_PRICE_SOURCE } = require(`${SERVER_PATH}/constants`)
const { getNodeLib } = require(`${SERVER_PATH}/init`);
const { client } = require('./database/redis');
const { getUserByKitId } = require('./user');
const { validatePair, getKitTier, getKitConfig, getAssetsPrices } = require('./common');
const { sendEmail } = require('../../../mail');
const { MAILTYPE } = require('../../../mail/strings');
const { verifyBearerTokenPromise } = require('./security');
const { Op } = require('sequelize');
const { loggerBroker } = require('../../../config/logger');
const { constructSimpleSDK, SwapSide } = require('@paraswap/sdk')
const axios = require('axios')

const connectedExchanges = {};


const {
	TOKEN_EXPIRED,
	AUTH_NOT_MATCHED,
	BROKER_NOT_FOUND,
	BROKER_SIZE_EXCEED,
	BROKER_PAUSED,
	BROKER_ERROR_DELETE_UNPAUSED,
	BROKER_EXISTS,
	BROKER_FORMULA_NOT_FOUND,
	SPREAD_MISSING,
	MANUAL_BROKER_CREATE_ERROR,
	DYNAMIC_BROKER_CREATE_ERROR,
	DYNAMIC_BROKER_EXCHANGE_PLAN_ERROR,
	DYNAMIC_BROKER_UNSUPPORTED,
	EXCHANGE_NOT_FOUND,
	SYMBOL_NOT_FOUND,
	UNISWAP_PRICE_NOT_FOUND,
	FORMULA_MARKET_PAIR_ERROR
} = require(`${SERVER_PATH}/messages`);

const validateBrokerPair = (brokerPair) => {
	if (brokerPair.type === 'manual' && math.compare(brokerPair.buy_price, 0) !== 1) {
		throw new Error('Broker buy price must be bigger than zero.');
	} else if (brokerPair.type === 'manual' && math.compare(brokerPair.sell_price, 0) !== 1) {
		throw new Error('Broker sell price must be bigger than zero.');
	} else if (math.compare(brokerPair.min_size, 0) !== 1) {
		throw new Error('Broker minimum order size must be bigger than zero.');
	} else if (math.compare(brokerPair.max_size, brokerPair.min_size) !== 1) {
		throw new Error('Broker maximum order size must be bigger than minimum order size.');
	} else if (math.compare(brokerPair.increment_size, 0) !== 1) {
		throw new Error('Broker order price increment must be bigger than zero.');
	} else if (brokerPair.symbol && !validatePair(brokerPair.symbol)) {
		throw new Error('invalid symbol');
	}
};

const getDecimals = (value = 0) => {
	if (Math.floor(value) === value) return 0;

	let str = value.toString();
	if (str.indexOf('.') !== -1 && str.indexOf('-') !== -1) {
		return str.split('-')[1] || 0;
	} else if (str.indexOf('.') !== -1) {
		return str.split('.')[1].length || 0;
	}
	return str.split('-')[1] || 0;
};

const determineRefreshInterval = (plan) => {
	if(plan === 'crypto') {
		return EXCHANGE_PLAN_INTERVAL_TIME.CRYTO;
	}
	else if (plan === 'fiat') {
		return EXCHANGE_PLAN_INTERVAL_TIME.FIAT;
	}
	else if (plan === 'boost') {
		return EXCHANGE_PLAN_INTERVAL_TIME.BOOST;
	}
}

const getPriceSourceExchanges = (plan) => {
	if(plan === 'crypto') {
		return EXCHANGE_PLAN_PRICE_SOURCE.CRYTO;
	}
	else if (plan === 'fiat') {
		return EXCHANGE_PLAN_PRICE_SOURCE.FIAT;
	}
	else if (plan === 'boost') {
		return EXCHANGE_PLAN_PRICE_SOURCE.BOOST;
	}
	else return [];
}
const setExchange = (data) => {
    if (connectedExchanges[data.id]) {
        return connectedExchanges[data.id].exchange
    }
	
    const exchangeClass = ccxt[data.exchange];

    const exchange = new exchangeClass({
        timeout: 5000,
        ...(data.api_key && { 'apiKey': data.api_key }),
        ...(data.api_secret && { 'secret': data.api_secret }),
    })

    if (data.id) {
        connectedExchanges[data.id] = { exchange, api_key: data.api_key, api_secret: data.api_secret };
    }

    return exchange;
}

const getQuoteDynamicBroker = async (side, broker, user_id = null,
	orderData = {
		spending_currency: null,
		receiving_currency: null,
		spending_amount: null,
		receiving_amount: null
	}) => {

	const { symbol, spread, quote_expiry_time, refresh_interval, formula, multiplier, id } = broker;

	const baseCurrencyPrice = await calculatePrice(side, spread, multiplier, formula, refresh_interval, id);

	const decimalPoint = getDecimals(broker.increment_size);
	const roundedPrice = math.round(
		baseCurrencyPrice,
		decimalPoint
	);

	const responseObject = {
		price: roundedPrice
	};

	//check if there is user_id, if so, assing token
	if (user_id) {

		const size = calculateSize(orderData, side, responseObject, decimalPoint, symbol);

		// Generate randomToken to be used during deal execution
		const randomToken = generateRandomToken(user_id, symbol, side, quote_expiry_time, roundedPrice, size, 'broker');
		responseObject.token = randomToken;
		// set expiry
		const expiryDate = new Date();
		expiryDate.setSeconds(expiryDate.getSeconds() + quote_expiry_time || 30);
		responseObject.expiry = expiryDate;
	}

	return responseObject;

};

const getQuoteManualBroker = async (broker, side, user_id = null, orderData = {
	spending_currency: null,
	receiving_currency: null,
	spending_amount: null,
	receiving_amount: null
}) => {
	const { symbol, quote_expiry_time, sell_price, buy_price, increment_size  } = broker;

	const baseCurrencyPrice = side === 'buy' ? sell_price : buy_price;

	const decimalPoint = getDecimals(increment_size);
	const roundedPrice = math.round(
		baseCurrencyPrice,
		decimalPoint
	);
	const responseObject = {
		price: roundedPrice
	};

	const size = calculateSize(orderData, side, responseObject, decimalPoint, symbol);

	if (user_id) {
		const randomToken = generateRandomToken(user_id, symbol, side, quote_expiry_time, roundedPrice, size, 'broker');
		responseObject.token = randomToken;
		// set expiry
		const expiryDate = new Date();
		expiryDate.setSeconds(expiryDate.getSeconds() + quote_expiry_time || 30);
		responseObject.expiry = expiryDate;
	}
	return responseObject;
}

const calculateSize = (orderData, side, responseObject, decimalPoint, symbol) => {
	let size = null;

	if (orderData) {
		let { spending_currency, receiving_currency, spending_amount, receiving_amount } = orderData

		if (spending_amount != null) {
			const sourceAmount = math.round(
				side === 'buy' ? spending_amount / responseObject.price : spending_amount * responseObject.price,
				decimalPoint
			);

			receiving_amount = sourceAmount;

		} else if (receiving_amount != null) {
			const sourceAmount = math.round(
				side === 'buy' ? receiving_amount * responseObject.price : receiving_amount / responseObject.price,
				decimalPoint
			);
			spending_amount = sourceAmount;
		}

		if (`${spending_currency}-${receiving_currency}` === symbol) {
			size = spending_amount;
		} else {
			size = receiving_amount
		}
	}
	return size;
}


const calculateFormula = (fn) => {
    return new Function(`return ${fn}`)();
}

const isFairPriceForBroker = async (broker) => {
	// with ccxt
	const priceFromMarkets = await calculatePrice(null, null, 1, broker.formula, null, broker.id, false);
	// with oracle
	const priceFromOracle = await calculatePrice(null, null, 1, broker.formula, null, broker.id, true);

	//relative difference
	const percDiff =  100 * Math.abs((priceFromMarkets - priceFromOracle) / ( (priceFromOracle + priceFromOracle) / 2));

	// If difference more than 20 percent, price is not fair.
	const priceDifferenceTreshold = 0.2;
	if( priceFromOracle !== -1 && percDiff > priceDifferenceTreshold) return false;
	else return true;
}

const calculatePrice = async (side, spread, multiplier = 1, formula, refresh_interval, brokerId, isOracle = false) => {
	const regex = /([a-zA-Z]+(?:_[a-zA-Z]+)+(?:-[a-zA-Z]+))/g;
	const variables = formula.match(regex);

	for (let variable of variables) {
		const exchangePair = variable.split('_');
		const exchangeInfo = getKitConfig().info;
		
		if(exchangePair.length === 2 && getPriceSourceExchanges(exchangeInfo.plan).includes(exchangePair[0])) {
			const selectedExchange = setExchange({ id: `${exchangePair[0]}-broker:fetch-markets`, exchange: exchangePair[0] });
				
			let marketPrice;

			// isOracle is only used for fair price check.
			if (!isOracle) {
				const formattedSymbol = exchangePair[1].split('-').join('').toUpperCase();
				const userCachekey = `${brokerId}-${exchangePair[1]}`;
				marketPrice = await client.getAsync(userCachekey);
			
				if (!marketPrice) { 
					const ticker = await selectedExchange.fetchTicker(formattedSymbol);
					marketPrice = ticker.last
					if (refresh_interval)
						client.setexAsync(userCachekey, refresh_interval, ticker.last);
				}
			}
			else {
				const coins = exchangePair[1].split('-');
				const conversions = await getAssetsPrices([coins[0]], { quote: coins[1], amount: 1 });
				marketPrice =  conversions[coins[0]];
				if(marketPrice === -1) return -1;
			}
			formula = formula.replace(variable, marketPrice);
		} else {
			throw new Error(FORMULA_MARKET_PAIR_ERROR + ' ' + exchangePair)
		}
	}
	const convertedPrice = calculateFormula(formula);
	let multipliedPrice = math.multiply(convertedPrice, multiplier);

	if (side === 'buy') {
		multipliedPrice = math.multiply(multipliedPrice, (1 + (spread / 100)));
	} else if (side === 'sell') {
		multipliedPrice = math.multiply(multipliedPrice, (1 - (spread / 100)));
	}
	
	return multipliedPrice;
};

const generateRandomToken = (user_id, symbol, side, expiryTime = 30, price, size, type) => {
	// Generate random token
	const randomToken = randomString({
		length: 32,
		numeric: true,
		letters: true
	});

	// set the generated token along with trade data in Redis expiry time(quote_expiry_time)
	const tradeData = {
		user_id,
		symbol,
		price,
		side,
		size,
		type
	};

	client.setexAsync(randomToken, expiryTime, JSON.stringify(tradeData));
	return randomToken;
};

const fetchBrokerQuote = async (brokerQuote) => {
	const { symbol, side, bearerToken, ip } = brokerQuote;

	const orderData = brokerQuote?.orderData;

	try {
		let user_id = null;
		if (bearerToken) {
			const auth = await verifyBearerTokenPromise(bearerToken, ip);
			if (auth) {
				user_id = auth.sub.id;
			}
		}

		// Get the broker record
		const broker = await getModel('broker').findOne({ where: { symbol } });

		if (!broker) {
			throw new Error(BROKER_NOT_FOUND);
		} else if (broker.paused) {
			throw new Error(BROKER_PAUSED);
		}
		if (broker.type === 'dynamic') {
			return getQuoteDynamicBroker(side, broker, user_id, orderData);
		} else {
			return await getQuoteManualBroker(broker, side, user_id, orderData);
		}

	} catch (err) {
		throw new Error(err);
	}
};

const testBroker = async (data) => {
	const { formula, spread, increment_size } = data;
	try {
		if (spread == null) {
			throw new Error(BROKER_FORMULA_NOT_FOUND);
		}

		if (spread == null) {
			throw new Error(SPREAD_MISSING);
		}
	
		const price = await calculatePrice(
			null,
			spread,
			1,
			formula,
			5,
			'test:broker'
		);

		const decimalPoint = getDecimals(increment_size);
		return {
			buy_price: math.round(price * (1 - (spread / 100)), decimalPoint),
			sell_price: math.round(price * (1 + (spread / 100)), decimalPoint)
		}
	} catch (err) {
		throw new Error(err);
	}

};
const getBrokerUniswapTokens = async () => {
	return [];
}

const testBrokerUniswap = async (data) => {
	const { base_coin, spread, quote_coin  } = data;
	const UNISWAP_COINS = {}
	try {
		if (!base_coin || !quote_coin || !UNISWAP_COINS[base_coin] || !UNISWAP_COINS[quote_coin]) {
			throw new Error(SYMBOL_NOT_FOUND);
		}
		if (!spread) {
			throw new Error(SPREAD_MISSING);
		}

		const paraSwapMin = constructSimpleSDK({ chainId: 1, axios });
		const includeDEXS = '[Uniswap V3]';

		const priceRoute = await paraSwapMin.swap.getRate({
			srcToken: UNISWAP_COINS[base_coin].token,
			srcDecimals: UNISWAP_COINS[base_coin].decimals,
			destToken: UNISWAP_COINS[quote_coin].token,
			destDecimals: UNISWAP_COINS[quote_coin].decimals,
			amount: Math.pow(10, UNISWAP_COINS[base_coin].decimals),
			side: SwapSide.SELL,
			includeDEXS
		  })

		if (!priceRoute.destAmount) {
			throw new Error(UNISWAP_PRICE_NOT_FOUND)
		}

		const price = math.divide(priceRoute.destAmount,Math.pow(10, UNISWAP_COINS[quote_coin].decimals))

		return {
			buy_price: price * (1 - (spread / 100)),
			sell_price: price * (1 + (spread / 100))
		}
	} catch (err) {
		throw new Error(err);
	}

};

const testRebalance = async (data) => {
	const { exchange_id, api_key, api_secret } = data;

	try {
		const exchange = setExchange({ exchange: exchange_id, api_key, api_secret })
		const userBalance = await exchange.fetchBalance();
		return userBalance;
	} catch (err) {
		throw new Error(err);
	}

};

const reverseTransaction = async (orderData) => {
	const { userId, symbol, side, size } = orderData;
	const notifyUser = async (data) => {
		const user = await getUserByKitId(userId);
		sendEmail(
			MAILTYPE.ALERT,
			user.email,
			{
				type: 'binance order info',
				data
			},
			user.settings
		);
	};

	try {
		const broker = await getModel('broker').findOne({ where: { symbol } });
		const decimalPoint = getDecimals(broker.increment_size);

		if (broker.account) {
			const objectKeys = Object.keys(broker.account);
			const exchangeKey = objectKeys[0];

			if (exchangeKey) {
				const exchange = setExchange({ 
					exchange: exchangeKey, 
					api_key: broker.account[exchangeKey].apiKey,
					api_secret: broker.account[exchangeKey].apiSecret
				})

				const formattedRebalancingSymbol = broker.rebalancing_symbol && broker.rebalancing_symbol.split('-').join('').toUpperCase();
	
				const marketTicker = await exchange.fetchTicker(symbol);
	
				const roundedPrice = math.round(
					side === 'buy' ? marketTicker.last * 1.01 : marketTicker.last * 0.99,
					decimalPoint
				);
				exchange.createOrder(formattedRebalancingSymbol, 'limit', size, roundedPrice)
					.then((res) => { notifyUser(res); })
					.catch((err) => { notifyUser(err); });
			}
		}
	} catch (err) {
		loggerBroker.error(err);
	}

};

const createBrokerPair = async (brokerPair) => {
	validateBrokerPair(brokerPair);

	return getModel('broker')
		.findOne({
			where: {
				[Op.or]: [
					{ symbol: brokerPair.symbol },
					{ symbol: brokerPair.symbol.split('-').reverse().join('-') }
				]
			}
		})
		.then(async (deal) => {
			if (deal) {
				throw new Error(BROKER_EXISTS);
			}
			const exchangeInfo = getKitConfig().info;

			const {
				exchange_name,
				spread,
				quote_expiry_time,
				tracked_symbol,
				type,
				account,
				formula
			} = brokerPair;

			if (type !== 'manual' && (!exchange_name || !spread || !quote_expiry_time || !tracked_symbol || !formula)) {
				throw new Error(DYNAMIC_BROKER_CREATE_ERROR);
			}

			if (type !== 'manual' && exchangeInfo.plan === 'basic') {
				throw new Error(DYNAMIC_BROKER_EXCHANGE_PLAN_ERROR);
			}

			if (type === 'dynamic' && !getPriceSourceExchanges(exchangeInfo.plan).includes(exchange_name)) {
				throw new Error(DYNAMIC_BROKER_UNSUPPORTED);
			}

			if(type === 'dynamic') {
				brokerPair.refresh_interval = determineRefreshInterval(exchangeInfo.plan);
			}
			
			if (account) {
				for (const [key, value] of Object.entries(account)) {
					if (!value.hasOwnProperty('apiKey')) {
						value.apiKey = brokerPair.account[key].apiKey;
					}
		
					if (!value.hasOwnProperty('apiSecret')) {
						value.apiSecret = brokerPair.account[key].apiSecret;
					}
				}
			}

			if (formula) {
				const brokerPrice = await testBroker({ formula, spread:0 });
				if (!Number(brokerPrice.sell_price) || !Number(brokerPrice.buy_price)) {
					throw new Error(FORMULA_MARKET_PAIR_ERROR);
				}
			}

			const newBrokerObject = {
				...brokerPair
			};


			return getModel('broker').create(newBrokerObject, { raw: true });
		});
};

const fetchBrokerPair = (symbol) => {
	return getModel('broker').findOne({ where: { symbol } });
};

const fetchBrokerPairs = async (attributes, bearerToken, ip) => {
	let userId = null;
	if (bearerToken) {
		const auth = await verifyBearerTokenPromise(bearerToken, ip);
		if (auth) {
			userId = auth.sub.id;
			const user = await getUserByKitId(userId);
			if (user && user.is_admin) {
				attributes.push('account', 'formula');
			}
		}
	}


	const brokers = await getModel('broker').findAll({ attributes });
	brokers.forEach(broker => {
		for (const [key, value] of Object.entries(broker.account || [])) {
			value.apiKey =  '*****',
			value.apiSecret = '*********'
		}
	})

	return brokers;
}

const updateBrokerPair = async (id, data) => {
	const brokerPair = await getModel('broker').findOne({ where: { id } });
	if (!brokerPair) {
		throw new Error(BROKER_NOT_FOUND);
	}

	const {
		exchange_name,
		spread,
		quote_expiry_time,
		tracked_symbol,
		type,
		account,
		formula
	} = data;

	const exchangeInfo = getKitConfig().info;

	if (type !== 'manual' && (!exchange_name || !spread || !quote_expiry_time || !tracked_symbol || !formula)) {
		throw new Error(DYNAMIC_BROKER_CREATE_ERROR);
	}

	if (type !== 'manual' && exchangeInfo.plan === 'basic') {
		throw new Error(DYNAMIC_BROKER_EXCHANGE_PLAN_ERROR);
	}

	if (type === 'dynamic' && !getPriceSourceExchanges(exchangeInfo.plan).includes(exchange_name)) {
		throw new Error(DYNAMIC_BROKER_UNSUPPORTED);
	}

	if(type === 'dynamic') {
		data.refresh_interval = determineRefreshInterval(exchangeInfo.plan);
	}

	if (account) {
		for (const [key, value] of Object.entries(account)) {
			if (!value.hasOwnProperty('apiKey')) {
				value.apiKey = brokerPair.account[key].apiKey;
			}

			if (!value.hasOwnProperty('apiSecret')) {
				value.apiSecret = brokerPair.account[key].apiSecret;
			}
		}
	}

	if (formula) {
		const brokerPrice = await testBroker({ formula, spread });
		if (!Number(brokerPrice.sell_price) || !Number(brokerPrice.buy_price)) {
			throw new Error(FORMULA_MARKET_PAIR_ERROR);
		}
	}

	const updatedPair = {
		...brokerPair.get({ plain: true }),
		...data,
	};

	validateBrokerPair(updatedPair);

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
			'formula',
			'spread',
			'exchange_name',
			'tracked_symbol'

		]
	});
};

const fetchTrackedExchangeMarkets = async (exchange) => {
	const selectedExchage = setExchange({ id: `${exchange}-broker:fetch-markets`, exchange });
	return selectedExchage.fetchMarkets();
}

const deleteBrokerPair = async (id) => {
	const brokerPair = await getModel('broker').findOne({ where: { id } });

	if (!brokerPair) {
		throw new Error(BROKER_NOT_FOUND);
	} else if (!brokerPair.paused) {
		throw new Error(BROKER_ERROR_DELETE_UNPAUSED);
	}

	return brokerPair.destroy();
};

const executeBrokerDeal = async (userId, token, size) => {
	const storedToken = await client.getAsync(token);
	if (!storedToken) {
		throw new Error(TOKEN_EXPIRED);
	}
	const { user_id, symbol, price, side } = JSON.parse(storedToken);

	if (user_id !== userId) {
		throw new Error(AUTH_NOT_MATCHED);
	}

	const brokerPair = await getModel('broker').findOne({ where: { symbol } });

	if (!brokerPair) {
		throw new Error(BROKER_NOT_FOUND);
	} else if (brokerPair.paused) {
		throw new Error(BROKER_PAUSED);
	}

	if(size < brokerPair.min_size || size > brokerPair.max_size) {
		throw new Error(BROKER_SIZE_EXCEED)
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
};

module.exports = {
	createBrokerPair,
	fetchBrokerPair,
	fetchBrokerPairs,
	updateBrokerPair,
	deleteBrokerPair,
	executeBrokerDeal,
	fetchBrokerQuote,
	reverseTransaction,
	testBroker,
	testRebalance,
	generateRandomToken,
	fetchTrackedExchangeMarkets,
	testBrokerUniswap,
	getBrokerUniswapTokens,
	isFairPriceForBroker,
	calculatePrice
};