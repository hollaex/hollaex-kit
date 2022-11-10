'use strict';

const { getUserByKitId, getUserByEmail, getUserByNetworkId, mapNetworkIdToKitId, mapKitIdToNetworkId } = require('./user');
const { SERVER_PATH } = require('../constants');
const { getModel } = require('./database/model');
const { getPublicData } = require('../../../ws/publicData');
const { fetchBrokerQuote } = require('./broker');
const { getNodeLib } = require(`${SERVER_PATH}/init`);
const { INVALID_SYMBOL, NO_DATA_FOR_CSV, USER_NOT_FOUND, USER_NOT_REGISTERED_ON_NETWORK } = require(`${SERVER_PATH}/messages`);
const { parse } = require('json2csv');
const { subscribedToPair, getKitTier, getDefaultFees } = require('./common');
const { reject } = require('bluebird');
const { loggerOrders } = require(`${SERVER_PATH}/config/logger`);
const math = require('mathjs');
const { has } = require('lodash');

const createUserOrderByKitId = (userKitId, symbol, side, size, type, price = 0, opts = { stop: null, meta: null, additionalHeaders: null }) => {
	if (symbol && !subscribedToPair(symbol)) {
		return reject(new Error(INVALID_SYMBOL(symbol)));
	}
	return getUserByKitId(userKitId)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			} else if (!user.network_id) {
				throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
			}

			const feeData = generateOrderFeeData(
				user.verification_level,
				symbol,
				{
					discount: user.discount
				}
			);

			return getNodeLib().createOrder(user.network_id, symbol, side, size, type, price, feeData, opts);
		});
};

const getUserQuickTrade = async (spending_currency, spending_amount, receiving_amount, receiving_currency, bearerToken, ip) => {
	const toolsLib = require('hollaex-tools-lib');

	if (spending_amount) spending_amount = parseFloat(spending_amount);
	if (receiving_amount) receiving_amount = parseFloat(receiving_amount);

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
	const sumQuantities = (orders) =>
		orders.reduce((total, [, size]) => math.add(total, size), 0);

	const sumOrderTotal = (orders) =>
		orders.reduce(
			(total, [price, size]) =>
				math.add(total, math.multiply(math.fraction(size), math.fraction(price))),
			0
		);

	const estimatedQuickTradePriceSelector = ({ pairsOrders, pair, side, size, isFirstAsset }) => {
		const { [side === 'buy' ? 'asks' : 'bids']: orders = [] } =
			pairsOrders[pair]?.data || {};

		let totalOrders = sumQuantities(orders);
		if (!isFirstAsset) {
			totalOrders = sumOrderTotal(orders);
		}
		if (math.larger(size, totalOrders)) {
			return [0, size];
		} else if (!isFirstAsset) {
			const [priceValue, sizeValue] = calculateMarketPriceByTotal(size, orders);
			return [priceValue / sizeValue, sizeValue];
		} else {
			const [priceValue, sizeValue] = calculateMarketPrice(size, orders);
			return [priceValue / sizeValue, sizeValue];
		}
	}

	const setPriceEssentials = (priceEssentials) => {
		const pairsOrders = getPublicData().orderbook;

		const pair = priceEssentials.pair;
		const side = priceEssentials.side;
		const isSourceChanged = priceEssentials.isSourceChanged;
		const pairData = toolsLib.getKitPairsConfig()[pair] || {};
		let priceValues = {};

		const decimalPoint = getDecimals(pairData.increment_size);
		let [estimatedPrice] = estimatedQuickTradePriceSelector({
			pairsOrders,
			pair,
			side,
			size: priceEssentials.size,
			isFirstAsset: side === 'buy' ? !isSourceChanged : isSourceChanged,
		});
		let sourceAmount = priceEssentials.sourceAmount;
		let targetAmount = priceEssentials.targetAmount;
		if (side === 'buy') {
			if (estimatedPrice) {
				if (isSourceChanged) {
					targetAmount = math.round(
						sourceAmount / estimatedPrice,
						decimalPoint
					);
				} else {
					sourceAmount = math.round(
						targetAmount * estimatedPrice,
						decimalPoint
					);
				}
			}
			priceValues = {
				...priceValues,
				sourceAmount,
				targetAmount,
				estimatedPrice,
			};
		} else {
			if (estimatedPrice) {
				if (isSourceChanged) {
					targetAmount = math.round(
						sourceAmount * estimatedPrice,
						decimalPoint
					);
				} else {
					sourceAmount = math.round(
						targetAmount / estimatedPrice,
						decimalPoint
					);
				}
			}
			priceValues = {
				...priceValues,
				sourceAmount,
				targetAmount,
				estimatedPrice,
			};
		}

		const responsePayload = {
			...priceEssentials,
			side,
			isSourceChanged,
			...priceValues,
		}

		return responsePayload;
	};

	const calculateMarketPriceByTotal = (orderSize = 0, orders = []) =>
		orders.reduce(
			([accumulatedPrice, accumulatedSize], [price = 0, size = 0]) => {
				if (math.larger(orderSize, accumulatedPrice)) {
					let currentTotal = math.multiply(size, price);
					const remainingSize = math.subtract(orderSize, accumulatedPrice);
					if (math.largerEq(remainingSize, currentTotal)) {
						return [
							math.sum(accumulatedPrice, currentTotal),
							math.sum(accumulatedSize, size),
						];
					} else {
						let remainingBaseSize = math.divide(remainingSize, price);
						return [
							math.sum(accumulatedPrice, math.multiply(remainingBaseSize, price)),
							math.sum(accumulatedSize, remainingBaseSize),
						];
					}
				} else {
					return [accumulatedPrice, accumulatedSize];
				}
			},
			[0, 0]
		);

	const calculateMarketPrice = (orderSize = 0, orders = []) =>
		orders.reduce(
			([accumulatedPrice, accumulatedSize], [price = 0, size = 0]) => {
				if (math.larger(orderSize, accumulatedSize)) {
					const remainingSize = math.subtract(orderSize, accumulatedSize);
					if (math.largerEq(remainingSize, size)) {
						return [
							math.sum(accumulatedPrice, math.multiply(size, price)),
							math.sum(accumulatedSize, size),
						];
					} else {
						return [
							math.sum(accumulatedPrice, math.multiply(remainingSize, price)),
							math.sum(accumulatedSize, remainingSize),
						];
					}
				} else {
					return [accumulatedPrice, accumulatedSize];
				}
			},
			[0, 0]
		);

	const originalPair = `${spending_currency}-${receiving_currency}`;
	const flippedPair = `${receiving_currency}-${spending_currency}`;

	let symbol = originalPair;
	let side = 'sell';

	// find if broker exists
	let broker = await getModel('broker').findOne({ where: { symbol: originalPair } });

	if (!broker) {
		broker = await getModel('broker').findOne({ where: { symbol: flippedPair } });
		symbol = flippedPair;
		side = 'buy';
	}

	if (broker) {
		return fetchBrokerQuote({
			symbol: symbol,
			side: side,
			bearerToken,
			ip
		})
			.then((brokerQuote) => {
				const decimalPoint = getDecimals(broker.increment_size);
				const responseObj = {
					spending_currency,
					receiving_currency,
					...(spending_amount != null ? { spending_amount } : { receiving_amount }),
					quote: brokerQuote.token
				}
				if (spending_amount != null) {
					const sourceAmount = math.round(
						side === 'buy' ? spending_amount / brokerQuote.price : spending_amount * brokerQuote.price,
						decimalPoint
					);
					responseObj.receiving_amount = sourceAmount;

				} else if (receiving_amount != null) {
					const sourceAmount = math.round(
						side === 'buy' ? receiving_amount * brokerQuote.price : receiving_amount / brokerQuote.price,
						decimalPoint
					);
					responseObj.spending_amount = sourceAmount;
				}

				return responseObj;
			})
			.catch((err) => {
				return reject(new Error(err.message));
			});
	}
	else {
		try {
			symbol = originalPair;
			if (symbol && !subscribedToPair(symbol)) {
				symbol = flippedPair;
			}

			if (!subscribedToPair(symbol)) {
				return reject(new Error(INVALID_SYMBOL(symbol)));
			}

			const responseObj = {
				spending_currency,
				receiving_currency,
				...(spending_amount != null ? { spending_amount } : { receiving_amount }),
			}

			const priceValues = setPriceEssentials({
				pair: symbol,
				size: spending_amount != null ? spending_amount : receiving_amount,
				side,
				...(spending_amount != null ? { sourceAmount: spending_amount } : { targetAmount: receiving_amount }),
				isSourceChanged: spending_amount != null ? true : false,
			});

			if (spending_amount != null) responseObj.receiving_amount = priceValues.estimatedPrice;
			else if (receiving_amount != null) responseObj.spending_amount = priceValues.estimatedPrice;

			const expiryDate = new Date();
			expiryDate.setSeconds(expiryDate.getSeconds() + 60);
			responseObj.expiry = expiryDate;

			return responseObj;
		} catch (err) {
			return reject(new Error(err.message));
		}
	}
}

const createUserOrderByEmail = (email, symbol, side, size, type, price = 0, opts = { stop: null, meta: null, additionalHeaders: null }) => {
	if (symbol && !subscribedToPair(symbol)) {
		return reject(new Error(INVALID_SYMBOL(symbol)));
	}
	return getUserByEmail(email)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			} else if (!user.network_id) {
				throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
			}

			const feeData = generateOrderFeeData(
				user.verification_level,
				symbol,
				{
					discount: user.discount
				}
			);

			return getNodeLib().createOrder(user.network_id, symbol, side, size, type, price, feeData, opts);
		});
};

const createUserOrderByNetworkId = (networkId, symbol, side, size, type, price = 0, opts = { stop: null, meta: null, additionalHeaders: null }) => {
	if (!networkId) {
		return reject(new Error(USER_NOT_REGISTERED_ON_NETWORK));
	}
	if (symbol && !subscribedToPair(symbol)) {
		return reject(new Error(INVALID_SYMBOL(symbol)));
	}
	return getUserByNetworkId(networkId)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			}

			const feeData = generateOrderFeeData(
				user.verification_level,
				symbol,
				{
					discount: user.discount
				}
			);

			return getNodeLib().createOrder(user.network_id, symbol, side, size, type, price, feeData, opts);
		});
};

const createOrderNetwork = (networkId, symbol, side, size, type, price, feeData = {}, opts = { stop: null, meta: null, additionalHeaders: null }) => {
	if (!networkId) {
		return reject(new Error(USER_NOT_REGISTERED_ON_NETWORK));
	}
	return getNodeLib().createOrder(networkId, symbol, side, size, type, price, feeData, opts);
};

const getUserOrderByKitId = async (userKitId, orderId, opts = {
	additionalHeaders: null
}) => {
	// check mapKitIdToNetworkId
	const idDictionary = await mapKitIdToNetworkId([userKitId]);

	if (!has(idDictionary, userKitId)) {
		throw new Error(USER_NOT_FOUND);
	} else if (!idDictionary[userKitId]) {
		throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
	}

	return getNodeLib().getOrder(idDictionary[userKitId], orderId, opts);
};

const getUserOrderByEmail = (email, orderId, opts = {
	additionalHeaders: null
}) => {
	return getUserByEmail(email)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			} else if (!user.network_id) {
				throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
			}
			return getNodeLib().getOrder(user.network_id, orderId, opts);
		});
};

const getUserOrderByNetworkId = (networkId, orderId, opts = {
	additionalHeaders: null
}) => {
	if (!networkId) {
		return reject(new Error(USER_NOT_REGISTERED_ON_NETWORK));
	}
	return getNodeLib().getOrder(networkId, orderId, opts);
};

const cancelUserOrderByKitId = async (userKitId, orderId, opts = {
	additionalHeaders: null
}) => {
	// check mapKitIdToNetworkId
	const idDictionary = await mapKitIdToNetworkId([userKitId]);

	if (!has(idDictionary, userKitId)) {
		throw new Error(USER_NOT_FOUND);
	} else if (!idDictionary[userKitId]) {
		throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
	}
	return getNodeLib().cancelOrder(idDictionary[userKitId], orderId, opts);
};

const cancelUserOrderByEmail = (email, orderId, opts = {
	additionalHeaders: null
}) => {
	return getUserByEmail(email)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			} else if (!user.network_id) {
				throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
			}
			return getNodeLib().cancelOrder(user.network_id, orderId, opts);
		});
};

const cancelUserOrderByNetworkId = (networkId, orderId, opts = {
	additionalHeaders: null
}) => {
	if (!networkId) {
		return reject(new Error(USER_NOT_REGISTERED_ON_NETWORK));
	}
	return getNodeLib().cancelOrder(networkId, orderId, opts);
};

const getAllExchangeOrders = (symbol, side, status, open, limit, page, orderBy, order, startDate, endDate, opts = {
	additionalHeaders: null
}) => {
	if (symbol && !subscribedToPair(symbol)) {
		return reject(new Error(INVALID_SYMBOL(symbol)));
	}
	return getNodeLib().getOrders({
		symbol,
		side,
		status,
		open,
		limit,
		page,
		orderBy,
		order,
		startDate,
		endDate,
		...opts
	});
};

const getAllUserOrdersByKitId = async (userKitId, symbol, side, status, open, limit, page, orderBy, order, startDate, endDate, opts = {
	additionalHeaders: null
}) => {
	if (symbol && !subscribedToPair(symbol)) {
		return reject(new Error(INVALID_SYMBOL(symbol)));
	}
	// check mapKitIdToNetworkId
	const idDictionary = await mapKitIdToNetworkId([userKitId]);

	if (!has(idDictionary, userKitId)) {
		throw new Error(USER_NOT_FOUND);
	} else if (!idDictionary[userKitId]) {
		throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
	}
	return getNodeLib().getUserOrders(idDictionary[userKitId], {
		symbol,
		side,
		status,
		open,
		limit,
		page,
		orderBy,
		order,
		startDate,
		endDate,
		...opts
	});
};

const getAllUserOrdersByEmail = (email, symbol, side, status, open, limit, page, orderBy, order, startDate, endDate, opts = {
	additionalHeaders: null
}) => {
	if (symbol && !subscribedToPair(symbol)) {
		return reject(new Error(INVALID_SYMBOL(symbol)));
	}
	return getUserByEmail(email)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			} else if (!user.network_id) {
				throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
			}
			return getNodeLib().getUserOrders(user.network_id, {
				symbol,
				side,
				status,
				open,
				limit,
				page,
				orderBy,
				order,
				startDate,
				endDate,
				...opts
			});
		});
};

const getAllUserOrdersByNetworkId = (networkId, symbol, side, status, open, limit, page, orderBy, order, startDate, endDate, opts = {
	additionalHeaders: null
}) => {
	if (!networkId) {
		return reject(new Error(USER_NOT_REGISTERED_ON_NETWORK));
	}
	if (symbol && !subscribedToPair(symbol)) {
		return reject(new Error(INVALID_SYMBOL(symbol)));
	}
	return getNodeLib().getUserOrders(networkId, {
		symbol,
		side,
		status,
		open,
		limit,
		page,
		orderBy,
		order,
		startDate,
		endDate,
		...opts
	});
};

const cancelAllUserOrdersByKitId = async (userKitId, symbol, opts = {
	additionalHeaders: null
}) => {
	if (!symbol || !subscribedToPair(symbol)) {
		return reject(new Error(INVALID_SYMBOL(symbol)));
	}
	// check mapKitIdToNetworkId
	const idDictionary = await mapKitIdToNetworkId([userKitId]);

	if (!has(idDictionary, userKitId)) {
		throw new Error(USER_NOT_FOUND);
	} else if (!idDictionary[userKitId]) {
		throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
	}
	return getNodeLib().cancelAllOrders(idDictionary[userKitId], { symbol, ...opts });
};

const cancelAllUserOrdersByEmail = (email, symbol, opts = {
	additionalHeaders: null
}) => {
	if (symbol && !subscribedToPair(symbol)) {
		return reject(new Error(INVALID_SYMBOL(symbol)));
	}
	return getUserByEmail(email)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			} else if (!user.network_id) {
				throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
			}
			return getNodeLib().cancelAllOrders(user.network_id, { symbol, ...opts });
		});
};

const cancelAllUserOrdersByNetworkId = (networkId, symbol, opts = {
	additionalHeaders: null
}) => {
	if (!networkId) {
		return reject(new Error(USER_NOT_REGISTERED_ON_NETWORK));
	}
	if (symbol && !subscribedToPair(symbol)) {
		return reject(new Error(INVALID_SYMBOL(symbol)));
	}
	return getNodeLib().cancelAllOrders(networkId, { symbol, ...opts });
};

const getAllTradesNetwork = (symbol, limit, page, orderBy, order, startDate, endDate, format, opts = { additionalHeaders: null }) => {
	if (symbol && !subscribedToPair(symbol)) {
		return reject(new Error(INVALID_SYMBOL(symbol)));
	}

	const params = {
		symbol,
		limit,
		page,
		orderBy,
		order,
		startDate,
		endDate,
		...opts
	};

	if (format) {
		params.format = 'all';
	}

	return getNodeLib().getTrades(params)
		.then(async (trades) => {
			if (trades.data.length > 0) {
				const networkIds = [];
				for (const trade of trades.data) {
					if (trade.maker_id) {
						networkIds.push(trade.maker_id);
					}
					if (trade.taker_id) {
						networkIds.push(trade.taker_id);
					}
				}

				const idDictionary = await mapNetworkIdToKitId(networkIds);

				for (let trade of trades.data) {
					if (trade.maker_id) {
						const maker_kit_id = idDictionary[trade.maker_id] || 0;
						trade.maker_network_id = trade.maker_id;
						trade.maker_id = maker_kit_id;
					}
					if (trade.taker_id) {
						const taker_kit_id = idDictionary[trade.taker_id] || 0;
						trade.taker_network_id = trade.taker_id;
						trade.taker_id = taker_kit_id;
					}
				}
			}

			if (format === 'csv') {
				if (trades.data.length === 0) {
					throw new Error(NO_DATA_FOR_CSV);
				}
				const csv = parse(trades.data, Object.keys(trades.data[0]));
				return csv;
			} else {
				return trades;
			}
		});
};

const getAllUserTradesByKitId = async (userKitId, symbol, limit, page, orderBy, order, startDate, endDate, format, opts = {
	additionalHeaders: null
}) => {
	if (symbol && !subscribedToPair(symbol)) {
		return reject(new Error(INVALID_SYMBOL(symbol)));
	}
	// check mapKitIdToNetworkId
	const idDictionary = await mapKitIdToNetworkId([userKitId]);

	if (!has(idDictionary, userKitId)) {
		throw new Error(USER_NOT_FOUND);
	} else if (!idDictionary[userKitId]) {
		throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
	}

	const params = {
		symbol,
		limit,
		page,
		orderBy,
		order,
		startDate,
		endDate,
		...opts
	};

	if (format) {
		params.format = 'all';
	}

	return getNodeLib().getUserTrades(idDictionary[userKitId], params)
		.then((trades) => {
			if (format === 'csv') {
				if (trades.data.length === 0) {
					throw new Error(NO_DATA_FOR_CSV);
				}
				const csv = parse(trades.data, Object.keys(trades.data[0]));
				return csv;
			} else {
				return trades;
			}
		});
};

// const getAllTradesNetworkStream = (opts = {
// 	symbol: null,
// 	limit: null,
// 	page: null,
// 	orderBy: null,
// 	order: null,
// 	startDate: null,
// 	endDate: null
// }) => {
// 	if (opts.symbol && !subscribedToPair(opts.symbol)) {
// 		return reject(new Error(INVALID_SYMBOL(opts.symbol)));
// 	}
// 	return getNodeLib().getTrades({ ...opts, format: 'all' });
// };

// const getAllTradesNetworkCsv = (opts = {
// 	symbol: null,
// 	limit: null,
// 	page: null,
// 	orderBy: null,
// 	order: null,
// 	startDate: null,
// 	endDate: null
// }) => {
// 	return getAllTradesNetworkStream(opts)
// 		.then((data) => {
// 			const parser = getCsvParser();

// 			parser.on('error', (error) => {
// 				throw error;
// 			});

// 			parser.on('error', (error) => {
// 				parser.destroy();
// 				throw error;
// 			});

// 			parser.on('end', () => {
// 				parser.destroy();
// 			});

// 			return data.pipe(parser);
// 		});
// };

// const getUserTradesByKitIdStream = (userKitId, opts = {
// 	symbol: null,
// 	limit: null,
// 	page: null,
// 	orderBy: null,
// 	order: null,
// 	startDate: null,
// 	endDate: null
// }) => {
// 	if (opts.symbol && !subscribedToPair(opts.symbol)) {
// 		return reject(new Error(INVALID_SYMBOL(opts.symbol)));
// 	}
// 	return getUserByKitId(userKitId)
// 		.then((user) => {
// 			if (!user) {
// 				throw new Error(USER_NOT_FOUND);
// 			} else if (!user.network_id) {
// 				throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
// 			}
// 			return getNodeLib().getUserTrades(user.network_id, { ...opts, format: 'all' });
// 		});
// };

// const getUserTradesByKitIdCsv = (userKitId, opts = {
// 	symbol: null,
// 	limit: null,
// 	page: null,
// 	orderBy: null,
// 	order: null,
// 	startDate: null,
// 	endDate: null
// }) => {
// 	return getUserTradesByKitIdStream(userKitId, opts)
// 		.then((data) => {
// 			const parser = getCsvParser();

// 			parser.on('error', (error) => {
// 				parser.destroy();
// 				throw error;
// 			});

// 			parser.on('end', () => {
// 				parser.destroy();
// 			});

// 			return data.pipe(parser);
// 		});
// };

// const getUserTradesByNetworkIdStream = (userNetworkId, opts = {
// 	symbol: null,
// 	limit: null,
// 	page: null,
// 	orderBy: null,
// 	order: null,
// 	startDate: null,
// 	endDate: null
// }) => {
// 	if (opts.symbol && !subscribedToPair(opts.symbol)) {
// 		return reject(new Error(INVALID_SYMBOL(opts.symbol)));
// 	}
// 	return getNodeLib().getUserTrades(userNetworkId, { ...opts, format: 'all' });
// };

// const getUserTradesByNetworkIdCsv = (userNetworkId, opts = {
// 	symbol: null,
// 	limit: null,
// 	page: null,
// 	orderBy: null,
// 	order: null,
// 	startDate: null,
// 	endDate: null
// }) => {
// 	return getUserTradesByNetworkIdStream(userNetworkId, opts)
// 		.then((data) => {
// 			const parser = getCsvParser();

// 			parser.on('error', (error) => {
// 				parser.destroy();
// 				throw error;
// 			});

// 			parser.on('end', () => {
// 				parser.destroy();
// 			});

// 			return data.pipe(parser);
// 		});
// };

const getAllUserTradesByNetworkId = (networkId, symbol, limit, page, orderBy, order, startDate, endDate, format, opts = {
	additionalHeaders: null
}) => {
	if (!networkId) {
		return reject(new Error(USER_NOT_REGISTERED_ON_NETWORK));
	}

	const params = {
		symbol,
		limit,
		page,
		orderBy,
		order,
		startDate,
		endDate,
		...opts
	};

	if (format) {
		params.format = 'all';
	}

	return getNodeLib().getUserTrades(networkId, opts)
		.then((trades) => {
			if (format === 'csv') {
				if (trades.data.length === 0) {
					throw new Error(NO_DATA_FOR_CSV);
				}
				const csv = parse(trades.data, Object.keys(trades.data[0]));
				return csv;
			} else {
				return trades;
			}
		});
};

const getGeneratedFees = (startDate, endDate, opts = {
	additionalHeaders: null
}) => {
	return getNodeLib().getGeneratedFees({
		startDate,
		endDate,
		...opts
	});
};

const settleFees = async (opts = {
	additionalHeaders: null
}) => {
	let network_id = null;
	if (opts.user_id) {
		// check mapKitIdToNetworkId
		const idDictionary = await mapKitIdToNetworkId([opts.user_id]);
		if (!has(idDictionary, opts.user_id)) {
			throw new Error(USER_NOT_FOUND);
		} else if (!idDictionary[opts.user_id]) {
			throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
		} else {
			network_id = idDictionary[opts.user_id];
		}
	}

	return getNodeLib().settleFees({
		additionalHeaders: opts.additionalHeaders,
		user_id: network_id
	});
};

const generateOrderFeeData = (userTier, symbol, opts = { discount: 0 }) => {
	loggerOrders.debug(
		'generateOrderFeeData',
		'symbol',
		symbol,
		'userTier',
		userTier
	);

	const tier = getKitTier(userTier);

	if (!tier) {
		throw new Error(`User tier ${userTier} not found`);
	}

	let makerFee = tier.fees.maker[symbol];
	let takerFee = tier.fees.taker[symbol];

	loggerOrders.debug(
		'generateOrderFeeData',
		'current makerFee',
		makerFee,
		'current takerFee',
		takerFee
	);

	if (opts.discount) {
		loggerOrders.debug(
			'generateOrderFeeData',
			'discount percentage',
			opts.discount
		);

		const discountToBigNum = math.divide(
			math.bignumber(opts.discount),
			math.bignumber(100)
		);

		const discountedMakerFee = math.number(
			math.subtract(
				math.bignumber(makerFee),
				math.multiply(
					math.bignumber(makerFee),
					discountToBigNum
				)
			)
		);

		const discountedTakerFee = math.number(
			math.subtract(
				math.bignumber(takerFee),
				math.multiply(
					math.bignumber(takerFee),
					discountToBigNum
				)
			)
		);

		const exchangeMinFee = getDefaultFees();

		loggerOrders.verbose(
			'generateOrderFeeData',
			'discounted makerFee',
			discountedMakerFee,
			'discounted takerFee',
			discountedTakerFee,
			'exchange minimum fees',
			exchangeMinFee
		);

		if (discountedMakerFee > exchangeMinFee.maker) {
			makerFee = discountedMakerFee;
		} else {
			makerFee = exchangeMinFee.maker;
		}

		if (discountedTakerFee > exchangeMinFee.taker) {
			takerFee = discountedTakerFee;
		} else {
			takerFee = exchangeMinFee.taker;
		}
	}

	const feeData = {
		fee_structure: {
			maker: makerFee,
			taker: takerFee
		}
	};

	loggerOrders.verbose(
		'generateOrderFeeData',
		'generated fee data',
		feeData
	);

	return feeData;
};

module.exports = {
	getAllExchangeOrders,
	createUserOrderByKitId,
	getUserQuickTrade,
	createUserOrderByEmail,
	getUserOrderByKitId,
	getUserOrderByEmail,
	cancelUserOrderByKitId,
	cancelUserOrderByEmail,
	getAllUserOrdersByKitId,
	getAllUserOrdersByEmail,
	cancelAllUserOrdersByKitId,
	cancelAllUserOrdersByEmail,
	getAllTradesNetwork,
	getAllUserTradesByKitId,
	getAllUserTradesByNetworkId,
	getUserOrderByNetworkId,
	createUserOrderByNetworkId,
	createOrderNetwork,
	cancelUserOrderByNetworkId,
	getAllUserOrdersByNetworkId,
	cancelAllUserOrdersByNetworkId,
	getGeneratedFees,
	settleFees,
	generateOrderFeeData
	// getUserTradesByKitIdStream,
	// getUserTradesByNetworkIdStream,
	// getAllTradesNetworkStream,
	// getAllTradesNetworkCsv,
	// getUserTradesByKitIdCsv,
	// getUserTradesByNetworkIdCsv
};
