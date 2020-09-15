'use strict';

const { Deposit, sequelize, User, Sequelize } = require('../../../db/models');
const rp = require('request-promise');
const { each } = require('lodash');
const { all, delay } = require('bluebird');
const { GET_CONFIGURATION, GET_SECRETS } = require('../../../constants');
const { VAULT_ENDPOINT } = require('../../constants');
const { ERC_TOKENS } = require('../../constants');
const moment = require('moment');
const { loggerDeposits } = require('../../../config/logger');
const mathjs = require('mathjs');
const VAULT_NAME = () => GET_SECRETS().vault.name;
const VAULT_KEY = () => GET_SECRETS().vault.key;
const VAULT_SECRET = () => GET_SECRETS().vault.secret;
const VAULT_WALLET = (coin) => {
	return `${VAULT_NAME()}-${coin}`;
};
const { sendEmail } = require('../../../mail');
const { MAILTYPE } = require('../../../mail/strings');

const getAmount = (amount, fee) => {
	return mathjs.number(mathjs.subtract(mathjs.fraction(amount), mathjs.fraction(fee)));
};

const isErc = (token) => {
	return ERC_TOKENS.includes(token);
};

const processWithdrawals = () => {
	return new Promise((resolve, reject) => {
		const vaultCoins = [];
		loggerDeposits.info('/plugins/vault/crons/processWithdrawals starting');
		const currentMinute = parseInt(moment().format('mm'));
		each(GET_SECRETS().vault.connected_coins, (coin) => {
			if (coin === 'xrp' || coin === 'xlm' || isErc(coin)) {
				// XRP style/ERC20 tokens are processed every minute
				vaultCoins.push({
					currency: coin
				});
			} else {
				// Every other coin is processed every 5 minutes
				if (currentMinute % 5 === 0) {
					vaultCoins.push({
						currency: coin
					});
				}
			}
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
					attributes: ['email', 'settings', 'phone_number']
				}
			]
		})
			.then(async (withdrawals) => {
				if (withdrawals.length === 0) {
					loggerDeposits.info('/plugins/vault/crons/processWithdrawals', 'No withdrawals need processing');
					resolve();
				}
				const addresses = [];
				const filteredWithdrawals = [];

				// Filter out same address withdrawals for btc and bch
				for (let withdrawal of withdrawals) {
					if (withdrawal.currency === 'btc' || withdrawal.currency === 'bch') {
						if (!addresses.includes(withdrawal.address)) {
							addresses.push(withdrawal.address);
							filteredWithdrawals.push(withdrawal);
						} else {
							continue;
						}
					} else {
						filteredWithdrawals.push(withdrawal);
					}
				}

				let transaction = await sequelize.transaction({isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE});
				const waitingWithdrawals = [];

				// Set all withdrawals to waiting
				for (let withdrawal of filteredWithdrawals) {
					try {
						let wd = await withdrawal.update(
							{
								waiting: true
							},
							{
								fields: ['waiting'],
								transaction,
								returning: true
							}
						);
						waitingWithdrawals.push(wd);
					} catch (err) {
						await transaction.rollback();
						reject(err.message);
						throw new Error(err);
					}
				}
				await transaction.commit();
				return waitingWithdrawals;
			})
			.then((withdrawals) => {
				const btcWithdrawals = [];
				const bchWithdrawals = [];
				const options = [];
				each(withdrawals, (withdrawal) => {
					if (withdrawal.currency === 'btc') {
						btcWithdrawals.push(withdrawal);
					} else if (withdrawal.currency === 'bch') {
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
										address: withdrawal.address,
										amount: getAmount(withdrawal.amount, withdrawal.fee)
									}
								},
								uri: `${VAULT_ENDPOINT}/wallet/${VAULT_WALLET(withdrawal.currency)}/withdraw/simple`,
								json: true
							},
							dbWithdrawals: [withdrawal]
						};
						if (withdrawal.currency === 'xrp') {
							const [xrpAddress, xrpTag] = withdrawal.address.split(':');
							option.data.body.data.address = xrpAddress;
							option.data.body.data.meta = { tag: xrpTag };
						} else if (withdrawal.currency === 'xlm') {
							const [xlmAddress, xlmTag] = withdrawal.address.split(':');
							option.data.body.data.address = xlmAddress;
							option.data.body.data.meta = { memo: xlmTag };
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
										amount: getAmount(withdrawal.amount, withdrawal.fee)
									};
								})
							},
							uri: `${VAULT_ENDPOINT}/wallet/${VAULT_WALLET('btc')}/withdraw/batch`,
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
										amount: getAmount(withdrawal.amount, withdrawal.fee)
									};
								})
							},
							uri: `${VAULT_ENDPOINT}/wallet/${VAULT_WALLET('bch')}/withdraw/batch`,
							json: true
						},
						dbWithdrawals: bchWithdrawals
					});
				}
				return all(options.map((option, i) => {
					return delay(2000 * i)
						.then(async () => {
							let transaction = await sequelize.transaction({isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE});
							const dbWithdrawals = [];

							// Set status to true and processing and waiting to false first
							for(let withdrawal of option.dbWithdrawals) {
								try {
									let wd = await withdrawal.update(
										{
											processing: false,
											waiting: false,
											status: true
										},
										{
											fields: ['processing', 'waiting', 'status'],
											transaction,
											returning: true
										}
									);
									dbWithdrawals.push(wd);
								} catch (err) {
									// If error during update, rollback changes
									await transaction.rollback();
									return {
										success: false,
										send: false
									};
								}
							}
							let response;
							try {
								response = await rp(option.data);
							} catch (err) {
								// If request fails, move on to next catch block
								await transaction.rollback();
								throw new Error(err);
							}
							loggerDeposits.info(`/plugins/vault/crons/processWithdrawals ${dbWithdrawals[0].currency} withdrawal successful for withdrawals with id: ${dbWithdrawals.map((wd) => `${wd.id},`)}`);
							await transaction.commit();
							return {
								success: true,
								data: response,
								dbWithdrawals
							};
						})
						.catch(async (err) => {
							loggerDeposits.error('/plugins/vault/crons/processWithdrawals perfromWithdrawal', `${option.dbWithdrawals[0].currency} withdrawal failed: ${err.message}`);
							let transaction = await sequelize.transaction({isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE});
							const dbWithdrawals = [];
							for (let withdrawal of option.dbWithdrawals) {
								let queryWithdrawal;

								// Find withdrawal that failed
								try {
									queryWithdrawal = await Deposit.findOne({
										where: {
											id: withdrawal.dataValues.id
										}
									});
								} catch (err) {
									await transaction.rollback();
									return {
										success: false,
										send: true,
										info: {
											type: 'Failed Withdrawal Waiting State Update Failed',
											data: {
												error: err.message,
												withdrawals: option.dbWithdrawals.map((wd) => wd.dataValues)
											}
										}
									};
								}

								// Set processing to false
								try {
									let wd = await queryWithdrawal.update(
										{
											processing: false
										},
										{
											fields: ['processing'],
											transaction,
											returning: true
										}
									);
									dbWithdrawals.push(wd);
								} catch (err) {
									await transaction.rollback();
									return {
										success: false,
										send: true,
										info: {
											type: 'Failed Withdrawal Waiting State Update Failed',
											data: {
												error: err.message,
												withdrawals: option.dbWithdrawals.map((wd) => wd.dataValues)
											}
										}
									};
								}
							}
							await transaction.commit();
							return {
								success: false,
								send: true,
								info: {
									type: 'Vault Withdrawal Failed',
									data: {
										error: err.message,
										withdrawals: dbWithdrawals.map((wd) => wd.dataValues)
									}
								}
							};
						});
				}));
			})
			.then((results) => {
				return all(results.map((result) => {
					if (result.success) {
						return all(result.dbWithdrawals.map((withdrawal) => {
							return withdrawal.update(
								{
									transaction_id: result.data.txid
								},
								{
									fields: ['transaction_id']
								}
							)
								.then((data) => {
									return {
										success: true,
										send: true,
										data: {
											email: withdrawal.User.email,
											amount: getAmount(data.amount, data.fee),
											transaction_id: data.transaction_id,
											fee: data.fee,
											status: true,
											currency: data.currency,
											address: data.address,
											phoneNumber: withdrawal.User.phone_number,
											settings: withdrawal.User.settings
										}
									};
								});
						}))
							.catch((err) => {
								loggerDeposits.error('/plugins/vault/crons/processWithdrawals txid update', `Failed to update successful ${result.dbWithdrawals[0].currency} withdrawal's TXID. ID:${result.dbWithdrawals.map((wd) => wd.id)}, TXID:${result.data.txid}, Error: ${err.message}`);
								return {
									success: false,
									send: true,
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
					if (result.success === false && result.send === true) {
						sendEmail(
							MAILTYPE.ALERT,
							GET_CONFIGURATION().constants.accounts.admin,
							result.info,
							{}
						);
						return;
					} else if (Array.isArray(result)) {
						each(result, (wd) => {
							if (wd.success === true && wd.send === true) {
								sendEmail(
									MAILTYPE.WITHDRAWAL,
									wd.data.email,
									{
										amount: wd.data.amount,
										transaction_id: wd.data.transaction_id,
										fee: wd.data.fee,
										status: true,
										currency: wd.data.currency,
										address: wd.data.address,
										phoneNumber: wd.data.phone_number
									},
									wd.data.settings
								);
							}
						});
						return;
					}
				}));
			})
			.then(() => {
				loggerDeposits.info('/plugins/vault/crons/processWithdrawals finished');
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
