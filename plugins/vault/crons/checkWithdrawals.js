'use strict';

const { Deposit, User, sequelize } = require('../../../db/models');
const rp = require('request-promise');
const { each } = require('lodash');
const { all, delay } = require('bluebird');
const { VAULT_ENDPOINT, GET_CONFIGURATION, GET_SECRETS } = require('../../../constants');
const { loggerDeposits } = require('../../../config/logger');
const VAULT_NAME = () => GET_SECRETS().vault.name;
const VAULT_KEY = () => GET_SECRETS().vault.key;
const VAULT_SECRET = () => GET_SECRETS().vault.secret;
const VAULT_WALLET = (coin) => {
	return `${VAULT_NAME()}-${coin}`;
};
const { sendEmail } = require('../../../mail');
const { MAILTYPE } = require('../../../mail/strings');

const vaultCoins = [];

const checkWithdrawals = () => {
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
				attributes: ['email', 'settings']
			}
		]
	})
		.then((withdrawals) => {
			if (withdrawals.length === 0) {
				loggerDeposits.info('No withdrawals need checking');
				return;
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
								return {
									success: true,
									status: false,
									info: {
										type: 'Vault Withdrawal Rejected',
										data: {
											description: 'This Vault withdrawal was rejected on the blockchain. You can double-check this transaction and proceed to confirm or dismiss the withdrawal through your admin panel.',
											transaction_id: txid,
											withdrawals: txids[txid].map((wd) => wd.dataValues)
										}
									}
								};
							} else {
								loggerDeposits.info(`Transaction ${txid} is not processed yet`);
								return {};
							}
						} else {
							loggerDeposits.warn(`Transaction ${txid} is not found`);
							return {
								success: false,
								info: {
									type: 'Vault Transaction Not Found',
									data: {
										description: 'This withdrawal was not found in Vault.',
										transaction_id: txid,
										withdrawals: txids[txid].map((wd) => wd.dataValues)
									}
								}
							};
						}
					});
			}));
		})
		.then((results) => {
			if (Array.isArray(results)) {
				return all(results.map((result) => {
					if (Array.isArray(result)) {
						return all(result.map((data) => {
							if (data.success === true && data.status === true) {
								return sendEmail(
									MAILTYPE.WITHDRAWAL,
									data.data.User.email,
									{
										amount: data.data.amount,
										transaction_id: data.data.transaction_id,
										fee: data.data.fee,
										status: true,
										currency: data.data.currency,
										address: data.data.address,
										phoneNumber: data.data.User.phone_number
									},
									data.data.User.settings
								);
							} else if (data.success === true && data.status === false) {
								return sendEmail(
									MAILTYPE.ALERT,
									GET_CONFIGURATION().constants.accounts.admin,
									data.info,
									{}
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
			} else {
				return;
			}
		})
		.then(() => {
			loggerDeposits.info('checkWithdrawals finished');
		})
		.catch((err) => {
			loggerDeposits.error(err.message);
		});
};

module.exports = {
	checkWithdrawals
};
