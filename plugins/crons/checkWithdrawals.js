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
		each((withdrawals, (withdrawal) => {
			txids[withdrawal.dataValues.transaction_id]
				? txids[withdrawal.dataValues.transaction_id].push(withdrawal)
				: txids[withdrawal.dataValues.transaction_id] = [withdrawal.dataValues.transaction_id];
		}));
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
				uri: `${VAULT_ENDPOINT}/${VAULT_WALLET(txids[txid][0].dataValues.currency)}/transactions`,
				json: true
			};
			return sequelize.transaction((transaction) => {
				return rp(option)
					.then((tx) => {
						if (tx.data[0]) {
							if (tx.data[0].is_confirmed) {
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
											return sendEmail(
												MAILTYPE.VAULT_WITHDRAWAL_FAIL,
												getConfiguration().constants.accounts.admin,
												{
													userId: result.info.user_id,
													withdrawalId: result.info.id,
													currency: result.info.currency,
													amount: result.info.amount,
													address: result.info.address
												}
											);
										})
								}))
							} else if (tx.data[0].is_rejected) {
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
											return sendEmail(
												MAILTYPE.VAULT_WITHDRAWAL_FAIL,
												getConfiguration().constants.accounts.admin,
												{
													userId: result.info.user_id,
													withdrawalId: result.info.id,
													currency: result.info.currency,
													amount: result.info.amount,
													address: result.info.address
												}
											);
										})
								}))
							}
						} else {
							return sendEmail(
								MAILTYPE.VAULT_WITHDRAWAL_FAIL,
								getConfiguration().constants.accounts.admin,
								{
									userId: result.info.user_id,
									withdrawalId: result.info.id,
									currency: result.info.currency,
									amount: result.info.amount,
									address: result.info.address
								}
							);
						}
					})
			})
				.catch((err) => err);
		}));
	})
	.then(() => {
		loggerDeposits.info('Withdrawals checked');
		process.exit(0);
	})
	.catch((err) => {
		loggerDeposits.error(err.message);
		process.exit(1);
	})