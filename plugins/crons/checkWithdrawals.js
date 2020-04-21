'use strict';

const { Deposit, sequelize } = require('../../db/models');
const rp = require('request-promise');
const { each } = require('lodash');
const { all } = require('bluebird');
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
	}
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
		return all(Object.keys(txids).map((txid) => {
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
			return sequelize.transaction((transaction) => {
				return rp(option)
					.then((tx) => {
						if (tx.data[0]) {
							if (tx.data[0].is_confirmed) {
								loggerDeposits.info(`Transaction ${txid} is confirmed`);
								return all(txids[txid].map((withdrawal) => {
									return withdrawal.update(
										{
											waiting: false,
											status: true
										},
										{
											attributes: ['waiting', 'status'],
											transaction
										}
									)
										.then((wd) => {
											// return sendEmail(
											// 	MAILTYPE.VAULT_WITHDRAWAL_FAIL,
											// 	getConfiguration().constants.accounts.admin,
											// 	{
											// 		userId: result.info.user_id,
											// 		withdrawalId: result.info.id,
											// 		currency: result.info.currency,
											// 		amount: result.info.amount,
											// 		address: result.info.address
											// 	}
											// );
										});
								}));
							} else if (tx.data[0].is_rejected) {
								loggerDeposits.info(`Transaction ${txid} is rejected`);
								return all(txids[txid].map((withdrawal) => {
									return withdrawal.update(
										{
											waiting: false,
											rejected: true
										},
										{
											attributes: ['waiting', 'rejected'],
											transaction
										}
									)
										.then((wd) => {
											// return sendEmail(
											// 	MAILTYPE.VAULT_WITHDRAWAL_FAIL,
											// 	getConfiguration().constants.accounts.admin,
											// 	{
											// 		userId: result.info.user_id,
											// 		withdrawalId: result.info.id,
											// 		currency: result.info.currency,
											// 		amount: result.info.amount,
											// 		address: result.info.address
											// 	}
											// );
										});
								}));
							} else {
								loggerDeposits.info(`Transaction ${txid} not yet processed by vault`);
							}
						} else {
							loggerDeposits.warn(`Transaction ${txid} was not found`);
							// return sendEmail(
							// 	MAILTYPE.VAULT_WITHDRAWAL_FAIL,
							// 	getConfiguration().constants.accounts.admin,
							// 	{
							// 		userId: result.info.user_id,
							// 		withdrawalId: result.info.id,
							// 		currency: result.info.currency,
							// 		amount: result.info.amount,
							// 		address: result.info.address
							// 	}
							// );
						}
					});
			});
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