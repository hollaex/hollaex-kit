'use strict';

const { getUserByKitId, getUserByEmail } = require('./user');
const { SERVER_PATH } = require('../constants');
const { getNodeLib } = require(`${SERVER_PATH}/init`);
const { parse } = require('json2csv');
const { subscribedToPair, subscribedToCoin, getKitTier } = require('./common');
const { reject } = require('bluebird');
const { INVALID_SYMBOL, INVALID_COIN, NO_DATA_FOR_CSV } = require('../messages');
const dbQuery = require('./database/query');

const createUserOrderByKitId = (userKitId, symbol, side, size, type, price = 0, feeCoin) => {
	if (symbol && !subscribedToPair(symbol)) {
		return reject(new Error(INVALID_SYMBOL(symbol)));
	}
	if (feeCoin && !subscribedToCoin(feeCoin)) {
		return reject(new Error(INVALID_COIN(feeCoin)));
	}
	return getUserByKitId(userKitId)
		.then((user) => {
			// const tier = getKitTier(user.verification_level);
			// if (!tier) {
			// 	throw new Error('User tier not found');
			// }
			// const feeData = {};
			// feeData.fee_structure = {
			// 	maker: tier.fees.maker[symbol] || tier.fees.maker.default,
			// 	taker: tier.fees.taker[symbol] || tier.fees.taker.default
			// };
			// if (feeCoin) {
			// 	feeData.fee_coin = feeCoin;
			// }
			return getNodeLib().createOrderNetwork(user.network_id, symbol, side, size, type, price);
		});
};

const createUserOrderByEmail = (email, symbol, side, size, type, price = 0, feeCoin) => {
	if (symbol && !subscribedToPair(symbol)) {
		return reject(new Error(INVALID_SYMBOL(symbol)));
	}
	if (feeCoin && !subscribedToCoin(feeCoin)) {
		return reject(new Error(INVALID_COIN(feeCoin)));
	}
	return getUserByEmail(email)
		.then((user) => {
			// const tier = getKitTier(user.verification_level);
			// if (!tier) {
			// 	throw new Error('User tier not found');
			// }
			// const feeData = {};
			// feeData.fee_structure = {
			// 	maker: tier.fees.maker[symbol] || tier.fees.maker.default,
			// 	taker: tier.fees.taker[symbol] || tier.fees.taker.default
			// };
			// if (feeCoin) {
			// 	feeData.fee_coin = feeCoin;
			// }
			return getNodeLib().createOrderNetwork(user.network_id, symbol, side, size, type, price);
		});
};

const getUserOrderByKitId = (userKitId, orderId) => {
	return getUserByKitId(userKitId)
		.then((user) => {
			return getNodeLib().getOrderNetwork(user.network_id, orderId);
		});
};

const getUserOrderByEmail = (email, orderId) => {
	return getUserByEmail(email)
		.then((user) => {
			return getNodeLib().getOrderNetwork(user.network_id, orderId);
		});
};

const cancelUserOrderByKitId = (userKitId, orderId) => {
	return getUserByKitId(userKitId)
		.then((user) => {
			return getNodeLib().cancelOrderNetwork(user.network_id, orderId);
		});
};

const cancelUserOrderByEmail = (email, orderId) => {
	return getUserByEmail(email)
		.then((user) => {
			return getNodeLib().cancelOrderNetwork(user.network_id, orderId);
		});
};

const getAllExchangeOrders = (symbol, side, type, limit, page, orderBy, order, startDate, endDate) => {
	if (symbol && !subscribedToPair(symbol)) {
		return reject(new Error(INVALID_SYMBOL(symbol)));
	}
	return getNodeLib().getAllOrderNetwork(undefined, symbol, side, type, limit, page, orderBy, order, startDate, endDate);
};

const getAllUserOrdersByKitId = (userKitId, symbol, side, type, limit, page, orderBy, order, startDate, endDate) => {
	if (symbol && !subscribedToPair(symbol)) {
		return reject(new Error(INVALID_SYMBOL(symbol)));
	}
	return getUserByKitId(userKitId)
		.then((user) => {
			return getNodeLib().getAllOrderNetwork(user.network_id, symbol, side, type, limit, page, orderBy, order, startDate, endDate);
		});
};

const getAllUserOrdersByEmail = (email, symbol, side, type, limit, page, orderBy, order, startDate, endDate) => {
	if (symbol && !subscribedToPair(symbol)) {
		return reject(new Error(INVALID_SYMBOL(symbol)));
	}
	return getUserByEmail(email)
		.then((user) => {
			return getNodeLib().getAllOrderNetwork(user.network_id, symbol, side, type, limit, page, orderBy, order, startDate, endDate);
		});
};

const cancelAllUserOrdersByKitId = (userKitId, symbol) => {
	if (symbol && !subscribedToPair(symbol)) {
		return reject(new Error(INVALID_SYMBOL(symbol)));
	}
	return getUserByKitId(userKitId)
		.then((user) => {
			return getNodeLib().cancelAllOrderNetwork(user.network_id, symbol);
		});
};

const cancelAllUserOrdersByEmail = (email, symbol) => {
	if (symbol && !subscribedToPair(symbol)) {
		return reject(new Error(INVALID_SYMBOL(symbol)));
	}
	return getUserByEmail(email)
		.then((user) => {
			return getNodeLib().cancelAllOrderNetwork(user.network_id, symbol);
		});
};

const getAllTradesNetwork = (symbol, limit, page, order_by, order, start_date, end_date) => {
	if (symbol && !subscribedToPair(symbol)) {
		return reject(new Error(INVALID_SYMBOL(symbol)));
	}
	return getNodeLib().getAllTradeNetwork(undefined, symbol, limit, page, order_by, order, start_date, end_date);
};

const getAllUserTradesNetworkByKidId = (userKitId, symbol, limit, page, order_by, order, start_date, end_date, format) => {
	if (symbol && !subscribedToPair(symbol)) {
		return reject(new Error(INVALID_SYMBOL(symbol)));
	}
	return getUserByKitId(userKitId)
		.then((user) => {
			return getNodeLib().getAllTradeNetwork(user.network_id, symbol, limit, page, order_by, order, start_date, end_date);
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
	getAllUserTradesNetworkByKidId
};
