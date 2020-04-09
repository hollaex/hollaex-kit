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
		processing: true,
		waiting: false
	}
})
	.then((withdrawals) => {
		if (withdrawals.length === 0) {
			loggerDeposits.info('No withdrawals need processing');
			process.exit(0);
		}
		const btcWithdrawals = [];
		const bchWithdrawals = [];
		const options = [];
		each(withdrawals, (withdrawal) => {
			if (withdrawal.dataValues.currency === 'btc') {
				btcWithdrawals.push(withdrawal);
			} else if (withdrawal.dataValues.currency === 'bch') {
				bchWithdrawals.push(withdrawal);
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
								address: withdrawal.dataValues.address,
								amount: withdrawal.dataValues.amount,
							}
						},
						uri: `${VAULT_ENDPOINT}/${VAULT_WALLET(withdrawal.dataValues.currency)}/withdraw/simple`,
						json: true
					},
					info: [withdrawal],
					type: 'SINGLE',
					currency: withdrawal.dataValues.currency
				};
				if (withdrawal.dataValues.currency === 'xrp') {
					const [xrpAddress, xrpTag] = withdrawal.dataValues.address.split(':');
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
								address: withdrawal.dataValues.address,
								amount: withdrawal.dataValues.amount
							};
						})
					},
					uri: `${VAULT_ENDPOINT}/${VAULT_WALLET('btc')}/withdraw/batch`,
					json: true,
					currency: 'btc'
				},
				info: btcWithdrawals,
				type: 'BATCH'
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
								address: withdrawal.dataValues.address,
								amount: withdrawal.dataValues.amount
							};
						})
					},
					uri: `${VAULT_ENDPOINT}/${VAULT_WALLET('bch')}/withdraw/batch`,
					json: true
				},
				info: bchWithdrawals,
				type: 'BATCH',
				currency: 'bch'
			});
		}
		return all(options.map((option) => {
			return sequelize.transaction((transaction) => {
				return all(option.info.map((withdrawal) => {
					withdrawal.update(
						{
							processing: false,
							waiting: true
						},
						{
							fields: ['processing', 'waiting'],
							transaction,
							returning: true
						}
					)
				}))
					.then((dbWithdrawals) => {
						return rp(option.data)
							.then((data) => {
								loggerDeposits.info(`${option.type} ${option.currency} withdrawal successful`);
								return {
									success: true,
									data: data,
									dbWithdrawals
								}
							})
							.catch((err) => {
								loggerDeposits.error(`${option.type} ${option.currency} withdrawal failed: ${err.message}`);
								return {
									success: false,
									data: err,
									dbWithdrawals
								};
							});
					})
					.catch((err) => {
						return {
							success: false,
							data: err
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
								txid: result.data.dataValues.transaction_id
							},
							{
								fields: ['txid'],
								transaction
							}
						)
					}))
				})
					.catch((err) => {
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
					});
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
		}));
	})
	.then(() => {
		loggerDeposits.info('Withdrawals processed');
		process.exit(0);
	})
	.catch((err) => {
		loggerDeposits.error(err.message);
		process.exit(1);
	});