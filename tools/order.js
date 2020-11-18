'use strict';

const { getUserByKitId, getUserByEmail } = require('./user');
const { SERVER_PATH } = require('../constants');
const { getNodeLib } = require(`${SERVER_PATH}/init`);
const { INVALID_SYMBOL, INVALID_COIN, NO_DATA_FOR_CSV } = require(`${SERVER_PATH}/messages`);
const { parse } = require('json2csv');
const { subscribedToPair, subscribedToCoin, getKitTier } = require('./common');
const { reject } = require('bluebird');

const createUserOrderByKitId = (userKitId, symbol, side, size, type, price = 0, stop, meta = {}, feeCoin) => {
	if (symbol && !subscribedToPair(symbol)) {
		return reject(new Error(INVALID_SYMBOL(symbol)));
	}
	// if (feeCoin && !subscribedToCoin(feeCoin)) {
	// 	return reject(new Error(INVALID_COIN(feeCoin)));
	// }
	return getUserByKitId(userKitId)
		.then((user) => {
			const tier = getKitTier(user.verification_level);
			if (!tier) {
				throw new Error('User tier not found');
			}
			const feeData = {};
			feeData.fee_structure = {
				maker: tier.fees.maker[symbol] || tier.fees.maker.default,
				taker: tier.fees.taker[symbol] || tier.fees.taker.default
			};
			// if (feeCoin) {
			// 	feeData.fee_coin = feeCoin;
			// }
			return getNodeLib().createOrder(user.network_id, symbol, side, size, type, price, feeData, stop, meta);
		});
};

const createUserOrderByEmail = (email, symbol, side, size, type, price = 0, stop, meta = {}, feeCoin) => {
	if (symbol && !subscribedToPair(symbol)) {
		return reject(new Error(INVALID_SYMBOL(symbol)));
	}
	// if (feeCoin && !subscribedToCoin(feeCoin)) {
	// 	return reject(new Error(INVALID_COIN(feeCoin)));
	// }
	return getUserByEmail(email)
		.then((user) => {
			const tier = getKitTier(user.verification_level);
			if (!tier) {
				throw new Error('User tier not found');
			}
			const feeData = {};
			feeData.fee_structure = {
				maker: tier.fees.maker[symbol] || tier.fees.maker.default,
				taker: tier.fees.taker[symbol] || tier.fees.taker.default
			};
			// if (feeCoin) {
			// 	feeData.fee_coin = feeCoin;
			// }
			return getNodeLib().createOrder(user.network_id, symbol, side, size, type, price, feeData, stop, meta);
		});
};

const getUserOrderByKitId = (userKitId, orderId) => {
	return getUserByKitId(userKitId)
		.then((user) => {
			return getNodeLib().getOrder(user.network_id, orderId);
		});
};

const getUserOrderByEmail = (email, orderId) => {
	return getUserByEmail(email)
		.then((user) => {
			return getNodeLib().getOrder(user.network_id, orderId);
		});
};

const cancelUserOrderByKitId = (userKitId, orderId) => {
	return getUserByKitId(userKitId)
		.then((user) => {
			return getNodeLib().cancelOrder(user.network_id, orderId);
		});
};

const cancelUserOrderByEmail = (email, orderId) => {
	return getUserByEmail(email)
		.then((user) => {
			return getNodeLib().cancelOrder(user.network_id, orderId);
		});
};

const getAllExchangeOrders = (symbol, side, status, open, limit, page, orderBy, order, startDate, endDate) => {
	if (symbol && !subscribedToPair(symbol)) {
		return reject(new Error(INVALID_SYMBOL(symbol)));
	}
	return getNodeLib().getOrders(undefined, symbol, side, status, open, limit, page, orderBy, order, startDate, endDate);
};

const getAllUserOrdersByKitId = (userKitId, symbol, side, status, open, limit, page, orderBy, order, startDate, endDate) => {
	if (symbol && !subscribedToPair(symbol)) {
		return reject(new Error(INVALID_SYMBOL(symbol)));
	}
	return getUserByKitId(userKitId)
		.then((user) => {
			return getNodeLib().getOrders(user.network_id, symbol, side, status, open, limit, page, orderBy, order, startDate, endDate);
		});
};

const getAllUserOrdersByEmail = (email, symbol, side, status, open, limit, page, orderBy, order, startDate, endDate) => {
	if (symbol && !subscribedToPair(symbol)) {
		return reject(new Error(INVALID_SYMBOL(symbol)));
	}
	return getUserByEmail(email)
		.then((user) => {
			return getNodeLib().getOrders(user.network_id, symbol, side, status, open, limit, page, orderBy, order, startDate, endDate);
		});
};

const cancelAllUserOrdersByKitId = (userKitId, symbol) => {
	if (symbol && !subscribedToPair(symbol)) {
		return reject(new Error(INVALID_SYMBOL(symbol)));
	}
	return getUserByKitId(userKitId)
		.then((user) => {
			return getNodeLib().cancelOrders(user.network_id, symbol);
		});
};

const cancelAllUserOrdersByEmail = (email, symbol) => {
	if (symbol && !subscribedToPair(symbol)) {
		return reject(new Error(INVALID_SYMBOL(symbol)));
	}
	return getUserByEmail(email)
		.then((user) => {
			return getNodeLib().cancelOrders(user.network_id, symbol);
		});
};

const getAllTradesNetwork = (symbol, limit, page, order_by, order, start_date, end_date) => {
	if (symbol && !subscribedToPair(symbol)) {
		return reject(new Error(INVALID_SYMBOL(symbol)));
	}
	return getNodeLib().getTrades(undefined, symbol, limit, page, order_by, order, start_date, end_date);
};

const getAllUserTradesByKitId = (userKitId, symbol, limit, page, order_by, order, start_date, end_date, format) => {
	if (symbol && !subscribedToPair(symbol)) {
		return reject(new Error(INVALID_SYMBOL(symbol)));
	}
	return getUserByKitId(userKitId)
		.then((user) => {
			return getNodeLib().getTrades(user.network_id, symbol, limit, page, order_by, order, start_date, end_date);
		})
		.then((trades) => {
			if (format) {
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
	getAllUserTradesByKitId
};
