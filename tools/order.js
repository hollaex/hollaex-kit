'use strict';

const { getUserByKitId, getUserByEmail, getUserByNetworkId } = require('./user');
const { SERVER_PATH } = require('../constants');
const { getNodeLib } = require(`${SERVER_PATH}/init`);
const { DEFAULT_FEES } = require(`${SERVER_PATH}/constants`);
const { INVALID_SYMBOL, NO_DATA_FOR_CSV, USER_NOT_FOUND, USER_NOT_REGISTERED_ON_NETWORK } = require(`${SERVER_PATH}/messages`);
const { parse } = require('json2csv');
const { subscribedToPair, getKitTier, getKitConfig } = require('./common');
const { reject } = require('bluebird');
const { loggerOrders } = require(`${SERVER_PATH}/config/logger`);
const math = require('mathjs');

const createUserOrderByKitId = (userKitId, symbol, side, size, type, price = 0, opts = { stop: null, meta: null }) => {
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

const createUserOrderByEmail = (email, symbol, side, size, type, price = 0, opts = { stop: null, meta: null }) => {
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

const createUserOrderByNetworkId = (networkId, symbol, side, size, type, price = 0, opts = { stop: null, meta: null }) => {
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

const createOrderNetwork = (networkId, symbol, side, size, type, price, feeData = {}, opts = {}) => {
	if (!networkId) {
		return reject(new Error(USER_NOT_REGISTERED_ON_NETWORK));
	}
	return getNodeLib().createOrder(networkId, symbol, side, size, type, price, feeData, opts);
};

const getUserOrderByKitId = (userKitId, orderId) => {
	return getUserByKitId(userKitId)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			} else if (!user.network_id) {
				throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
			}
			return getNodeLib().getOrder(user.network_id, orderId);
		});
};

const getUserOrderByEmail = (email, orderId) => {
	return getUserByEmail(email)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			} else if (!user.network_id) {
				throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
			}
			return getNodeLib().getOrder(user.network_id, orderId);
		});
};

const getUserOrderByNetworkId = (networkId, orderId) => {
	if (!networkId) {
		return reject(new Error(USER_NOT_REGISTERED_ON_NETWORK));
	}
	return getNodeLib().getOrder(networkId, orderId);
};

const cancelUserOrderByKitId = (userKitId, orderId) => {
	return getUserByKitId(userKitId)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			} else if (!user.network_id) {
				throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
			}
			return getNodeLib().cancelOrder(user.network_id, orderId);
		});
};

const cancelUserOrderByEmail = (email, orderId) => {
	return getUserByEmail(email)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			} else if (!user.network_id) {
				throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
			}
			return getNodeLib().cancelOrder(user.network_id, orderId);
		});
};

const cancelUserOrderByNetworkId = (networkId, orderId) => {
	if (!networkId) {
		return reject(new Error(USER_NOT_REGISTERED_ON_NETWORK));
	}
	return getNodeLib().cancelOrder(networkId, orderId);
};

const getAllExchangeOrders = (symbol, side, status, open, limit, page, orderBy, order, startDate, endDate) => {
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
		endDate
	});
};

const getAllUserOrdersByKitId = (userKitId, symbol, side, status, open, limit, page, orderBy, order, startDate, endDate) => {
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
				endDate
			});
		});
};

const getAllUserOrdersByEmail = (email, symbol, side, status, open, limit, page, orderBy, order, startDate, endDate) => {
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
				endDate
			});
		});
};

const getAllUserOrdersByNetworkId = (networkId, symbol, side, status, open, limit, page, orderBy, order, startDate, endDate) => {
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
		endDate
	});
};

const cancelAllUserOrdersByKitId = (userKitId, symbol) => {
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
			return getNodeLib().cancelAllOrders(user.network_id, { symbol });
		});
};

const cancelAllUserOrdersByEmail = (email, symbol) => {
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
			return getNodeLib().cancelAllOrders(user.network_id, { symbol });
		});
};

const cancelAllUserOrdersByNetworkId = (networkId, symbol) => {
	if (!networkId) {
		return reject(new Error(USER_NOT_REGISTERED_ON_NETWORK));
	}
	if (symbol && !subscribedToPair(symbol)) {
		return reject(new Error(INVALID_SYMBOL(symbol)));
	}
	return getNodeLib().cancelAllOrders(networkId, { symbol });
};

const getAllTradesNetwork = (symbol, limit, page, orderBy, order, startDate, endDate, format) => {
	if (symbol && !subscribedToPair(symbol)) {
		return reject(new Error(INVALID_SYMBOL(symbol)));
	}

	const opts = {
		symbol,
		limit,
		page,
		orderBy,
		order,
		startDate,
		endDate
	};

	if (format) {
		opts.format = 'all';
	}

	return getNodeLib().getTrades(opts)
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

const getAllUserTradesByKitId = (userKitId, symbol, limit, page, orderBy, order, startDate, endDate, format) => {
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

			const opts = {
				symbol,
				limit,
				page,
				orderBy,
				order,
				startDate,
				endDate
			};

			if (format) {
				opts.format = 'all';
			}

			return getNodeLib().getUserTrades(user.network_id, opts);
		})
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

const getAllUserTradesByNetworkId = (networkId, symbol, limit, page, orderBy, order, startDate, endDate, format) => {
	if (!networkId) {
		return reject(new Error(USER_NOT_REGISTERED_ON_NETWORK));
	}

	const opts = {
		symbol,
		limit,
		page,
		orderBy,
		order,
		startDate,
		endDate
	};

	if (format) {
		opts.format = 'all';
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

const getGeneratedFees = (startDate, endDate) => {
	return getNodeLib().getGeneratedFees({
		startDate,
		endDate
	});
};

const settleFees = () => {
	return getNodeLib().settleFees();
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

		const exchangeMinFee = DEFAULT_FEES[getKitConfig().info.collateral_level];

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
	generateOrderFeeData,
	// getUserTradesByKitIdStream,
	// getUserTradesByNetworkIdStream,
	// getAllTradesNetworkStream,
	// getAllTradesNetworkCsv,
	// getUserTradesByKitIdCsv,
	// getUserTradesByNetworkIdCsv
};
