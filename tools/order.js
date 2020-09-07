'use strict';

const { getUserByKitId, getUserByEmail } = require('./users');
const { SERVER_PATH } = require('../constants');
const { getKit, getSecrets, getCoins, getPairs, getNodeLib } = require(`${SERVER_PATH}/init`);

const createUserOrderByKitId = (userKitId, symbol, side, size, type, price = 0) => {
	return getUserByKitId(userKitId)
		.then((user) => {
			return getNodeLib().createOrderNetwork(user.network_id, symbol, side, size, type, price);
		});
};

const createUserOrderByEmail = (email, symbol, side, size, type, price = 0) => {
	return getUserByEmail(email)
		.then((user) => {
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

const getAllUserOrdersByKitId = (userKitId, symbol) => {
	return getUserByKitId(userKitId)
		.then((user) => {
			return getNodeLib().getAllOrderNetwork(user.network_id, symbol);
		});
};

const getAllUserOrdersByEmail = (email, symbol) => {
	return getUserByEmail(email)
		.then((user) => {
			return getNodeLib().getAllOrderNetwork(user.network_id, symbol);
		});
};

const cancelAllUserOrdersByKitId = (userKitId, symbol) => {
	return getUserByKitId(userKitId)
		.then((user) => {
			return getNodeLib().cancelAllOrderNetwork(user.network_id, symbol);
		});
};

const cancelAllUserOrdersByEmail = (email, symbol) => {
	return getUserByEmail(email)
		.then((user) => {
			return getNodeLib().cancelAllOrderNetwork(user.network_id, symbol);
		});
};

module.exports = {
	createUserOrderByKitId,
	createUserOrderByEmail,
	getUserOrderByKitId,
	getUserOrderByEmail,
	cancelUserOrderByKitId,
	cancelUserOrderByEmail,
	getAllUserOrdersByKitId,
	getAllUserOrdersByEmail,
	cancelAllUserOrdersByKitId,
	cancelAllUserOrdersByEmail
};
