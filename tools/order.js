'use strict';

const { getUserByKitId, getUserByEmail } = require('./users');
const { SERVER_PATH } = require('../constants');
const { getKit, getSecrets, getCoins, getPairs, getKitLib } = require(`${SERVER_PATH}/init`);

const createUserOrderByKitId = (userKitId, symbol, side, size, type, price = 0) => {
	return getUserByKitId(userKitId)
		.then((user) => {
			return getKitLib().createOrderNetwork(user.network_id, symbol, side, size, type, price);
		});
};

const createUserOrderByEmail = (email, symbol, side, size, type, price = 0) => {
	return getUserByEmail(email)
		.then((user) => {
			return getKitLib().createOrderNetwork(user.network_id, symbol, side, size, type, price);
		});
};

const getUserOrderByKitId = (userKitId, orderId) => {
	return getUserByKitId(userKitId)
		.then((user) => {
			return getKitLib().getOrderNetwork(user.network_id, orderId);
		});
};

const getUserOrderByEmail = (email, orderId) => {
	return getUserByEmail(email)
		.then((user) => {
			return getKitLib().getOrderNetwork(user.network_id, orderId);
		});
};

const cancelUserOrderByKitId = (userKitId, orderId) => {
	return getUserByKitId(userKitId)
		.then((user) => {
			return getKitLib().cancelOrderNetwork(user.network_id, orderId);
		});
};

const cancelUserOrderByEmail = (email, orderId) => {
	return getUserByEmail(email)
		.then((user) => {
			return getKitLib().cancelOrderNetwork(user.network_id, orderId);
		});
};

module.exports = {
	createUserOrderByKitId,
	createUserOrderByEmail,
	getUserOrderByKitId,
	getUserOrderByEmail,
	cancelUserOrderByKitId,
	cancelUserOrderByEmail
};
