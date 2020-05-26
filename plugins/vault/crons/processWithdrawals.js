'use strict';

const { Deposit, sequelize, User } = require('../../../db/models');
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

const processWithdrawals = () => {
	return new Promise((resolve, reject) => {
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
				processing: true,
				waiting: false,
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
					loggerDeposits.info('No withdrawals need processing');
					resolve();
				}
				const btcWithdrawals = [];
				const bchWithdrawals = [];
				const options = [];
				each(withdrawals, (withdrawal) => {
					if (withdrawal.currency === 'btc') {
						const addressCheck = btcWithdrawals.filter((wd) => wd.address === withdrawal.address);
						if (addressCheck.length > 0) {
							const option = {
								data: {
									method: 'POST',
									headers: {
										key: VAULT_KEY(),
										secret: VAULT_SECRET()
									},
									body: {
										data: {
											address: withdrawal.address,
											amount: withdrawal.amount,
										}
									},
									uri: `${VAULT_ENDPOINT}/${VAULT_WALLET('btc')}/withdraw/simple`,
									json: true
								},
								dbWithdrawals: [withdrawal]
							};
							options.push(option);
						} else {
							btcWithdrawals.push(withdrawal);
						}
					} else if (withdrawal.currency === 'bch') {
						const addressCheck = bchWithdrawals.filter((wd) => wd.address === withdrawal.address);
						if (addressCheck.length > 0) {
							const option = {
								data: {
									method: 'POST',
									headers: {
										key: VAULT_KEY(),
										secret: VAULT_SECRET()
									},
									body: {
										data: {
											address: withdrawal.address,
											amount: withdrawal.amount,
										}
									},
									uri: `${VAULT_ENDPOINT}/${VAULT_WALLET('bch')}/withdraw/simple`,
									json: true
								},
								dbWithdrawals: [withdrawal]
							};
							options.push(option);
						} else {
							bchWithdrawals.push(withdrawal);
						}
					} else {
						const option = {
							data: {
								method: 'POST',
								headers: {
									key: VAULT_KEY(),
									secret: VAULT_SECRET()
								},
								body: {
									data: {
										address: withdrawal.address,
										amount: withdrawal.amount,
									}
								},
								uri: `${VAULT_ENDPOINT}/${VAULT_WALLET(withdrawal.currency)}/withdraw/simple`,
								json: true
							},
							dbWithdrawals: [withdrawal]
						};
						if (withdrawal.currency === 'xrp') {
							const [xrpAddress, xrpTag] = withdrawal.address.split(':');
							option.data.body.data.address = xrpAddress;
							option.data.body.meta = { tag: xrpTag };
						}
						options.push(option);
					}
				});
				if (btcWithdrawals.length !== 0) {
					options.push({
						data: {
							method: 'POST',
							headers: {
								key: VAULT_KEY(),
								secret: VAULT_SECRET()
							},
							body: {
								data: btcWithdrawals.map((withdrawal) => {
									return {
										address: withdrawal.address,
										amount: withdrawal.amount
									};
								})
							},
							uri: `${VAULT_ENDPOINT}/${VAULT_WALLET('btc')}/withdraw/batch`,
							json: true,
						},
						dbWithdrawals: btcWithdrawals
					});
				}
				if (bchWithdrawals.length !== 0) {
					options.push({
						data: {
							method: 'POST',
							headers: {
								key: VAULT_KEY(),
								secret: VAULT_SECRET()
							},
							body: {
								data: bchWithdrawals.map((withdrawal) => {
									return {
										address: withdrawal.address,
										amount: withdrawal.amount
									};
								})
							},
							uri: `${VAULT_ENDPOINT}/${VAULT_WALLET('bch')}/withdraw/batch`,
							json: true
						},
						dbWithdrawals: bchWithdrawals
					});
				}
				return all(options.map((option, i) => {
					return delay(2000 * i)
						.then(() => {
							return sequelize.transaction((transaction) => {
								return all(option.dbWithdrawals.map((withdrawal) => {
									return withdrawal.update(
										{
											processing: false,
											waiting: true
										},
										{
											fields: ['processing', 'waiting'],
											transaction,
											returning: true
										}
									);
								}))
									.then((dbWithdrawals) => {
										return rp(option.data)
											.then((data) => {
												loggerDeposits.info(`${option.dbWithdrawals[0].currency} withdrawal successful`);
												return {
													success: true,
													data,
													dbWithdrawals
												};
											});
									});
							})
								.catch((err) => {
									loggerDeposits.error(`${option.dbWithdrawals[0].currency} withdrawal failed: ${err.message}`);
									return {
										success: false,
										info: {
											type: 'Vault Withdrawal Failed',
											data: {
												error: err.message,
												withdrawals: option.dbWithdrawals.map((wd) => wd.dataValues)
											}
										}
									};
								});
						});
				}));
			})
			.then((results) => {
				return all(results.map((result) => {
					if (result.success) {
						return sequelize.transaction((transaction) => {
							return all(result.dbWithdrawals.map((withdrawal) => {
								return withdrawal.update(
									{
										transaction_id: result.data.txid
									},
									{
										fields: ['transaction_id'],
										transaction
									}
								)
									.then(() => {
										return { success: true };
									});
							}));
						})
							.catch((err) => {
								loggerDeposits.error(`Failed to update successful ${result.dbWithdrawals[0].currency} withdrawal's TXID. ID:${result.dbWithdrawals.map((wd) => wd.id)}, TXID:${result.data.txid}, Error: ${err.message}`);
								return {
									success: false,
									info: {
										type: 'Successful Withdrawal Database TXID Update Failed',
										data: {
											error: err.message,
											transaction_id: result.data.txid,
											withdrawals: result.dbWithdrawals.map((wd) => wd.dataValues)
										}
									}
								};
							});
					} else {
						return result;
					}
				}));
			})
			.then((results) => {
				return all(results.map((result) => {
					if (result.success === false) {
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
				loggerDeposits.info('processWithdrawals finished');
				resolve();
			})
			.catch((err) => {
				loggerDeposits.error('plugins/vault/crons/processWithdrawals catch', err.message);
				reject(err);
			});
	});
};

module.exports = {
	processWithdrawals
};
