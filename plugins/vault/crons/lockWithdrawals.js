'use strict';

const { Deposit, User } = require('../../../db/models');
const { all } = require('bluebird');
const WAValidator = require('multicoin-address-validator');
const { loggerDeposits } = require('../../../config/logger');
const { each } = require('lodash');
const { GET_CONFIGURATION, GET_SECRETS } = require('../../../constants');
const { sendEmail } = require('../../../mail');
const { MAILTYPE } = require('../../../mail/strings');

const checkAddress = (address, symbol, network = 'prod') => {
	if (symbol === 'btc' || symbol === 'bch' || symbol === 'xmr') {
		return WAValidator.validate(address, symbol, network);
	} else if (symbol === 'xrp') {
		return WAValidator.validate(address.split(':')[0], 'xrp', network);
	} else {
		return WAValidator.validate(address, 'eth', network);
	}
};

const lockWithdrawals = () => {
	return new Promise((resolve, reject) => {
		const vaultCoins = [];
		loggerDeposits.info('/plugins/vault/crons/lockWithdrawals starting');
		each(GET_SECRETS().vault.connected_coins, (coin) => {
			if (GET_CONFIGURATION().coins[coin] && GET_CONFIGURATION().coins[coin].allow_withdrawal) {
				vaultCoins.push({
					currency: coin
				});
			}
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
					loggerDeposits.info('/plugins/vault/crons/lockWithdrawals', 'No withdrawals need locking');
					resolve();
				}
				loggerDeposits.debug('/plugins/vault/crons/lockWithdrawals', `Locking ${withdrawals.length} withdrawals`);
				return all(withdrawals.map((withdrawal) => {
					if (checkAddress(withdrawal.address, withdrawal.currency)) {
						return withdrawal.update({ processing: true }, { fields: ['processing'], returning: true })
							.then((result) => {
								loggerDeposits.info('/plugins/vault/crons/lockWithdrawals', `Withdrawal with ID ${withdrawal.id} locked`);
								return;
							})
							.catch((err) => {
								loggerDeposits.error('/plugins/vault/crons/lockWithdrawals', `Error occured while locking ${withdrawal.id}: ${err.message}`);
								return;
							});
					} else {
						return withdrawal.update({ rejected: true }, { fields: ['rejected'], returning: true })
							.then((result) => {
								loggerDeposits.warn('/plugins/vault/crons/lockWithdrawals', `Withdrawal with ID ${withdrawal.id} rejected because of an invalid address`);
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
								loggerDeposits.error('/plugins/vault/crons/lockWithdrawals', `Error occured while locking ${withdrawal.id}: ${err.message}`);
								return;
							});
					}
				}));
			})
			.then(() => {
				loggerDeposits.info('/plugins/vault/crons/lockWithdrawals finished');
				resolve();
			})
			.catch((err) => {
				loggerDeposits.error('plugins/vault/crons/lockWithdrawal catch', err.message);
				reject(err);
			});
	});
};

module.exports = {
	lockWithdrawals
};
