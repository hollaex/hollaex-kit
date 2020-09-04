'use strict';

const { getUserByKitId, getUserByEmail } = require('./users');
const { SERVER_PATH } = require('../constants');
const { getKit, getSecrets, getCoins, getPairs, getKitLib } = require(`${SERVER_PATH}/init`);

const createUserOrderByKitId = (userKitId, symbol, side, size, type, price = 0) => {
	getUserByKitId(userKitId)
		.then((user) => {
			return getKitLib().createOrderNetwork(user.network_id, symbol, side, size, type, price);
		});
};

const createUserOrderByEmail = (email, symbol, side, size, type, price = 0) => {
	getUserByEmail(email)
		.then((user) => {
			return getKitLib().createOrderNetwork(user.network_id, symbol, side, size, type, price);
		});
};

const getUserOrderByKitId = (userKitId, orderId) => {
	getUserByKitId(userKitId)
		.then((user) => {
			return getKitLib().getOrderNetwork(user.network_id, orderId);
		});
};

module.exports = {
	createUserOrderByKitId,
	createUserOrderByEmail,
	getUserOrderByKitId
};
