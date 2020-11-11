'use strict';

const { SERVER_PATH } = require('../constants');
const { getUserByKitId } = require('./user');
const { all, reject } = require('bluebird');
const { INVALID_COIN, INVALID_AMOUNT } = require('../messages');
const { subscribedToCoin } = require('./common');
const { getNodeLib } = require(`${SERVER_PATH}/init`);
const { sendEmail } = require(`${SERVER_PATH}/mail`);
const { MAILTYPE } = require(`${SERVER_PATH}/mail/strings`);

const transferUserFunds = (senderId, receiverId, currency, amount, description = 'Admin Transfer') => {
	if (!subscribedToCoin(currency)) {
		return reject(new Error(INVALID_COIN(currency)));
	}

	if (amount <= 0) {
		return reject(new Error(INVALID_AMOUNT(amount)));
	}

	return all([
		getUserByKitId(senderId),
		getUserByKitId(receiverId)
	])
		.then(([ sender, receiver ]) => {
			return all([
				getNodeLib().transferAsset(sender.network_id, receiver.network_id, currency, amount, description),
				sender,
				receiver
			]);
		})
		.then(([ transaction, sender, receiver ]) => {
			sendEmail(
				MAILTYPE.WITHDRAWAL,
				sender.email,
				{
					amount: amount,
					fee: 0,
					currency: currency,
					status: true,
					transaction_id: transaction.transaction_id,
					// address: deposit.address,
					phoneNumber: sender.phone_number
				},
				sender.settings
			);
			sendEmail(
				MAILTYPE.DEPOSIT,
				receiver.email,
				{
					amount: amount,
					currency: currency,
					status: true,
					transaction_id: transaction.transaction_id,
					// address: address,
					phoneNumber: receiver.phone_number
				},
				receiver.settings,
			);
			return;
		});
};

const getUserBalance = (userKitId) => {
	return getUserByKitId(userKitId)
		.then((user) => {
			return getNodeLib().getBalance(user.network_id);
		})
		.then((data) => {
			return {
				user_id: userKitId,
				...data
			};
		});
};

module.exports = {
	transferUserFunds,
	getUserBalance
};
