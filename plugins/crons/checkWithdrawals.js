'use strict';

const { Deposit, User, sequelize } = require('../../db/models');
const rp = require('request-promise');
const { each } = require('lodash');
const { all, delay } = require('bluebird');
const { VAULT_ENDPOINT, GET_CONFIGURATION, GET_SECRETS } = require('../../constants');
const { loggerDeposits } = require('../../config/logger');
const VAULT_NAME = () => GET_SECRETS().vault.name;
const VAULT_KEY = () => GET_SECRETS().vault.key;
const VAULT_SECRET = () => GET_SECRETS().vault.secret;
const VAULT_WALLET = (coin) => {
	return `${VAULT_NAME()}-${coin}`;
};
const { sendEmail } = require('../../mail');
const { MAILTYPE } = require('../../mail/strings');

const vaultCoins = [];
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
		waiting: true,
		$or: vaultCoins
	},
	include: [
		{
			model: User,
			attributes: ['email']
		}
	]
})
	.then((withdrawals) => {
		if (withdrawals.length === 0) {
			loggerDeposits.info('No withdrawals need checking');
			process.exit(0);
		}
		let txids = {};
		each(withdrawals, (withdrawal) => {
			txids[withdrawal.transaction_id]
				? txids[withdrawal.transaction_id].push(withdrawal)
				: txids[withdrawal.transaction_id] = [withdrawal];
		});
		return all(Object.keys(txids).map((txid, i) => {
			const option = {
				method: 'GET',
				headers: {
					key: VAULT_KEY(),
					secret: VAULT_SECRET()
				},
				qs: {
					txid
				},
				uri: `${VAULT_ENDPOINT}/${VAULT_WALLET(txids[txid][0].currency)}/transactions`,
				json: true
			};
			return delay(500 * i)
				.then(() => {
					return rp(option);
				})
				.then((tx) => {
					if (tx.data[0]) {
						if (tx.data[0].is_confirmed) {
							loggerDeposits.info(`Transaction ${txid} was confirmed`);
							return sequelize.transaction((transaction) => {
								return all(txids[txid].map((withdrawal) => {
									return withdrawal.update(
										{
											waiting: false,
											status: true
										},
										{
											attributes: ['waiting', 'status'],
											transaction,
											returning: true
										}
									)
										.then((data) => {
											return {
												success: true,
												status: true,
												data
											};
										});
								}));
							});
						} else if (tx.data[0].is_rejected) {
							loggerDeposits.info(`Transaction ${txid} was rejected`);
							return sequelize.transaction((transaction) => {
								return all(txids[txid].map((withdrawal) => {
									return withdrawal.update(
										{
											waiting: false,
											rejected: true
										},
										{
											attributes: ['waiting', 'rejected'],
											transaction,
											returning: true
										}
									)
										.then((data) => {
											return {
												success: true,
												status: false,
												data
											};
										});
								}));
							});
						} else {
							loggerDeposits.info(`Transaction ${txid} is not processed yet`);
							return;
						}
					} else {
						loggerDeposits.warn(`Transaction ${txid} is not found`);
						return {
							success: false,
							info: {
								type: 'Vault Transaction Not Found',
								data: {
									txid,
									withdrawals: txids[txid].map((wd) => wd.dataValues)
								}
							}
						};
					}
				});
		}));
	})
	.then((results) => {
		return all(results.map((result) => {
			if (Array.isArray(result)) {
				return all(result.map((data) => {
					if (result.success === true && result.status === true) {
						return sendEmail(
							MAILTYPE.WITHDRAWAL,
							data.User.email,
							{
								amount: data.amount,
								transaction_id: data.transaction_id,
								status: true,
								currency: data.currency,
								address: data.address,
								phoneNumber: data.User.phone_number
							},
							data.User.settings
						);
					} else if (result.success === true && result.status === false) {
						sendEmail(
							MAILTYPE.DEPOSIT_CANCEL,
							data.User.email,
							{
								type: data.type,
								amount: data.amount,
								currency: data.currency,
								transaction_id: data.transaction_id,
								date: data.created_at
							},
							data.User.settings
						);
					}
				}));
			} else if (result.success === false) {
				return sendEmail(
					MAILTYPE.ALERT,
					GET_CONFIGURATION().constants.accounts.admin,
					result.info,
					{}
				);
			} else {
				return;
			}
		}));
	})
	.then(() => {
		loggerDeposits.info('Withdrawals checked');
		process.exit(0);
	})
	.catch((err) => {
		loggerDeposits.error(err.message);
		process.exit(1);
	});