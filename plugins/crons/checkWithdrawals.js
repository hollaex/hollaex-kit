'use strict';

const { Deposit, User, sequelize } = require('../../db/models');
const rp = require('request-promise');
const { each } = require('lodash');
const { all, delay } = require('bluebird');
const { VAULT_ENDPOINT } = require('../../constants');
const { getSecrets, getConfiguration } = require('../../init');
const { loggerDeposits } = require('../../config/logger');
const VAULT_NAME = () => getSecrets().vault.name;
const VAULT_KEY = () => getSecrets().vault.key;
const VAULT_SECRET = () => getSecrets().vault.secret;
const VAULT_WALLET = (coin) => {
	return `${VAULT_NAME()}-${coin}`;
};
const { sendEmail } = require('../../mail');
const { MAILTYPE } = require('../../mail/strings');

Deposit.findAll({
	where: {
		type: 'withdrawal',
		status: false,
		dismissed: false,
		rejected: false,
		processing: false,
		waiting: true
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
												type: 'confirmed',
												user: data.User,
												txid: data.transaction_id,
												currency: data.currency,
												amount: data.amount,
												address: data.address
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
												type: 'rejected',
												user: data.User,
												txid: data.transaction_id,
												currency: data.currency,
												amount: data.amount,
												address: data.address
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
							type: 'Vault Transaction Not Found',
							txid,
							data: txids[txid].map((wd) => wd.dataValues)
						};
					}
				});
		}));
	})
	.then((results) => {
		return all(results.map((result) => {
			if (Array.isArray(result)) {
				return all(result.map((data) => {
					return sendEmail(
						MAILTYPE.WITHDRAWAL,
						data.user.email,
						{
							type: data.type,
							txid: data.txid,
							currency: data.currency,
							amount: data.amount,
							address: data.address
						},
						data.user
					);
				}));
			} else if (result.success === false) {
				return sendEmail(
					MAILTYPE.ALERT,
					getConfiguration().constants.accounts.admin,
					result,
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