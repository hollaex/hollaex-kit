'use strict';

const { getUserByKitId, getUserByEmail, getUserByNetworkId } = require('./user');
const { SERVER_PATH } = require('../constants');
const { getNodeLib } = require(`${SERVER_PATH}/init`);
const { INVALID_SYMBOL, INVALID_COIN, NO_DATA_FOR_CSV, USER_NOT_FOUND } = require(`${SERVER_PATH}/messages`);
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
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			}
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
			return getNodeLib().createOrder(user.network_id, symbol, side, size, type, price, feeData);
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
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			}
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
			return getNodeLib().createOrder(user.network_id, symbol, side, size, type, price, feeData);
		});
};

const createUserOrderByNetworkId = (networkId, symbol, side, size, type, price = 0, stop, meta = {}, feeCoin) => {
	if (symbol && !subscribedToPair(symbol)) {
		return reject(new Error(INVALID_SYMBOL(symbol)));
	}
	// if (feeCoin && !subscribedToCoin(feeCoin)) {
	// 	return reject(new Error(INVALID_COIN(feeCoin)));
	// }
	return getUserByNetworkId(networkId)
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
			return getNodeLib().createOrder(user.network_id, symbol, side, size, type, price, feeData);
		});
};

const createOrderNetwork = (networkId, symbol, side, size, type, price, feeData = {}, opts = {}) => {
	return getNodeLib().createOrder(networkId, symbol, side, size, type, price, feeData, opts);
};

const getUserOrderByKitId = (userKitId, orderId) => {
	return getUserByKitId(userKitId)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			}
			return getNodeLib().getOrder(user.network_id, orderId);
		});
};

const getUserOrderByEmail = (email, orderId) => {
	return getUserByEmail(email)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			}
			return getNodeLib().getOrder(user.network_id, orderId);
		});
};

const getUserOrderByNetworkId = (networkId, orderId) => {
	return getNodeLib().getOrder(networkId, orderId);
};

const cancelUserOrderByKitId = (userKitId, orderId) => {
	return getUserByKitId(userKitId)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			}
			return getNodeLib().cancelOrder(user.network_id, orderId);
		});
};

const cancelUserOrderByEmail = (email, orderId) => {
	return getUserByEmail(email)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			}
			return getNodeLib().cancelOrder(user.network_id, orderId);
		});
};

const cancelUserOrderByNetworkId = (networkId, orderId) => {
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
			}
			return getNodeLib().getOrders({
				userId: user.network_id,
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
			}
			return getNodeLib().getOrders({
				userId: user.network_id,
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
	if (symbol && !subscribedToPair(symbol)) {
		return reject(new Error(INVALID_SYMBOL(symbol)));
	}
	return getNodeLib().getOrders({
		userId: networkId,
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
			}
			return getNodeLib().cancelAllOrders(user.network_id, { symbol });
		});
};

const cancelAllUserOrdersByNetworkId = (networkId, symbol) => {
	if (symbol && !subscribedToPair(symbol)) {
		return reject(new Error(INVALID_SYMBOL(symbol)));
	}
	return getNodeLib().cancelAllOrders(networkId, { symbol });
};

const getAllTradesNetwork = (symbol, limit, page, orderBy, order, startDate, endDate) => {
	if (symbol && !subscribedToPair(symbol)) {
		return reject(new Error(INVALID_SYMBOL(symbol)));
	}
	return getNodeLib().getUserTrades({
		symbol,
		limit,
		page,
		orderBy,
		order,
		startDate,
		endDate
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
			}
			return getNodeLib().getUserTrades({
				userId: user.network_id,
				symbol,
				limit,
				page,
				orderBy,
				order,
				startDate,
				endDate
			});
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

const getAllUserTradesByNetworkId = (networkId, symbol, limit, page, orderBy, order, startDate, endDate) => {
	return getNodeLib().getUserTrades({
		userId: networkId,
		symbol,
		limit,
		page,
		orderBy,
		order,
		startDate,
		endDate
	});
};

const getGeneratedFees = (limit, page, startDate, endDate) => {
	return getNodeLib().getGeneratedFees({
		limit,
		page,
		startDate,
		endDate
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
	getAllUserTradesByKitId,
	getAllUserTradesByNetworkId,
	getUserOrderByNetworkId,
	createUserOrderByNetworkId,
	createOrderNetwork,
	cancelUserOrderByNetworkId,
	getAllUserOrdersByNetworkId,
	cancelAllUserOrdersByNetworkId,
	getGeneratedFees
};
