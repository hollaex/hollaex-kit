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
		loggerDeposits.info('No withdrawals need locking');
		const btcWithdrawals = [];
		const bchWithdrawals = [];
		const simpleWithdrawals = [];
		const options = [];
		each(withdrawals, (withdrawal) => {
			if (withdrawal.currency === 'btc') {
				btcWithdrawals.push(withdrawal);
			} else if (withdrawal.currency === 'bch') {
				bchWithdrawals.push(withdrawal);
			} else {
				simpleWithdrawals.push(withdrawal);
			}
		});
		options.push(
			...withdrawals.map((withdrawal) => {
				const option = {
					method: 'POST',
					headers: {
						'key': VAULT_KEY(),
						'secret': VAULT_SECRET()
					},
					body: {
						data: {
							address: withdrawal.address,
							amount: withdrawal.amount,
						}
					},
					uri: `${VAULT_ENDPOINT}/${VAULT_WALLET(withdrawal.dataValues.currency)}/withdraw/simple`,
					json: true
				};
				if (withdrawal.currency === 'xrp') {
					const [xrpAddress, xrpTag] = withdrawal.address.split(':');
					option.body.data.address = xrpAddress;
					option.body.meta = { tag: xrpTag };
				}
				return { data: option, info: [withdrawal] };
			})
		);
		if (btcWithdrawals.length !== 0) {
			options.push({
				data: {
					method: 'POST',
					headers: {
						'key': VAULT_KEY(),
						'secret': VAULT_SECRET()
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
					json: true
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
						'key': VAULT_KEY(),
						'secret': VAULT_SECRET()
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
				info: bchWithdrawals,
				type: 'BATCH'
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
								return {
									success: true,
									data: data,
									dbWithdrawals
								}
							})
							.catch((err) => {
								sendEmail(
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
								throw {
									success: false,
									data: err,
									dbWithdrawals
								};
							});
					});
			})
				.catch((err) => err);
		}))
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
						return err;
					})
			} else {
				return console.log('sendEmail')
			}
		}))
	})
	.then(() => {
		loggerDeposits.info('No withdrawals need locking');
		process.exit(0);
	})
	.catch((err) => {
		loggerDeposits.error(err.message);
		process.exit(1);
	});