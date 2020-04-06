'use strict';

const { Deposit } = require('../../db/models');
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
	.then((processedWithdrawals) => {
		const btcWithdrawals = [];
		const bchWithdrawals = [];
		const simpleWithdrawals = [];
		const options = [];
		each(processedWithdrawals, (withdrawal) => {
			if (withdrawal.success) {
				if (withdrawal.data.currency === 'btc') {
					btcWithdrawals.push(withdrawal.data);
				} else if (withdrawal.data.currency === 'bch') {
					bchWithdrawals.push(withdrawal.data);
				} else {
					simpleWithdrawals.push(withdrawal.data);
				}
			} else {
				loggerDeposits.error(`Withdrawal database update failed: ${withdrawal.data}`);
			}
		});
		options.push(
			...processedWithdrawals.map((withdrawal) => {
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
					uri: `${VAULT_ENDPOINT}/${VAULT_WALLET(withdrawal.currency)}/withdraw/simple`,
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
			return rp(option.data)
				.then((result) => {
					return {
						success: true,
						data: result
					};
				})
				.catch((err) => {
					return {
						success: false,
						data: err.message,
						info: option.info
					};
				});
		}));
	})
	.then((results) => {
		return rp(results.map((result) => {
			if (result.success) {
				return result.info.update({
					processing: false,
					waiting: true,
					transaction_id: result.data.txid
				}, {
					fields: ['processing', 'waiting', 'transaction_id']
				});
			} else {
				loggerDeposits.error(`Withdrawal with id: ${result.info.id} failed: ${result.data}`);
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
	.then((result) => {
		loggerDeposits.info(`${result.length} withdrawals processed and now waiting`);
		process.exit(0);
	})
	.catch((err) => {
		loggerDeposits.error(err.message);
		process.exit(1);
	});