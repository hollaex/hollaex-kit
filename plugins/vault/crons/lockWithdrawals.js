'use strict';

const { Deposit, User } = require('../../../db/models');
const { all } = require('bluebird');
const { checkAddress } = require('../helpers');
const { loggerDeposits } = require('../../../config/logger');
const { each } = require('lodash');
const { GET_SECRETS } = require('../../../constants');
const { sendEmail } = require('../../../mail');
const { MAILTYPE } = require('../../../mail/strings');

const vaultCoins = [];

const lockWithdrawals = () => {
	each(GET_SECRETS().vault.connected_coins, (coin) => {
		vaultCoins.push({
			currency: coin
		});
	});
	Deposit.findAll({
		where: {
			type: 'withdrawal',
			status: false,
			dismissed: false,
			rejected: false,
			processing: false,
			waiting: false,
			$or: vaultCoins
		},
		include: [
			{
				model: User,
				attributes: ['email', 'settings']
			}
		]
	})
		.then((withdrawals) => {
			if (withdrawals.length === 0) {
				loggerDeposits.info('No withdrawals need locking');
				return;
			}
			loggerDeposits.debug(`Locking ${withdrawals.length} withdrawals`);
			return all(withdrawals.map((withdrawal) => {
				if (checkAddress(withdrawal.address, withdrawal.currency)) {
					return withdrawal.update({ processing: true }, { fields: ['processing'], returning: true })
						.then((result) => {
							loggerDeposits.info(`Withdrawal with ID ${withdrawal.id} locked`);
							return;
						})
						.catch((err) => {
							loggerDeposits.error(`Error occured while locking ${withdrawal.id}: ${err.message}`);
							return;
						});
				} else {
					return withdrawal.update({ rejected: true }, { fields: ['rejected'], returning: true })
						.then((result) => {
							loggerDeposits.warn(`Withdrawal with ID ${withdrawal.id} rejected because of an invalid address`);
							return sendEmail(
								MAILTYPE.INVALID_ADDRESS,
								withdrawal.User.email,
								{
									currency: withdrawal.currency,
									amount: withdrawal.amount,
									address: withdrawal.address
								},
								withdrawal.User.settings
							);
						})
						.catch((err) => {
							loggerDeposits.error(`Error occured while locking ${withdrawal.id}: ${err.message}`);
							return;
						});
				}
			}));
		})
		.then(() => {
			loggerDeposits.info('lockWithdrawals finished');
		})
		.catch((err) => {
			loggerDeposits.error(err.message);
		});
};

module.exports = {
	lockWithdrawals
};
