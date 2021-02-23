'use strict';

const { SERVER_PATH } = require('../constants');
const { sendEmail } = require(`${SERVER_PATH}/mail`);
const { MAILTYPE } = require(`${SERVER_PATH}/mail/strings`);
const { WITHDRAWALS_REQUEST_KEY } = require(`${SERVER_PATH}/constants`);
const { verifyOtpBeforeAction } = require('./security');
const { subscribedToCoin, getKitCoin, getKitSecrets, getKitConfig } = require('./common');
const {
	INVALID_OTP_CODE,
	INVALID_WITHDRAWAL_TOKEN,
	EXPIRED_WITHDRAWAL_TOKEN,
	INVALID_COIN,
	INVALID_AMOUNT,
	WITHDRAWAL_DISABLED_FOR_COIN,
	UPGRADE_VERIFICATION_LEVEL,
	NO_DATA_FOR_CSV,
	USER_NOT_FOUND,
	USER_NOT_REGISTERED_ON_NETWORK
} = require(`${SERVER_PATH}/messages`);
const { getUserByKitId } = require('./user');
const { findTier } = require('./tier');
const { client } = require('./database/redis');
const crypto = require('crypto');
const uuid = require('uuid/v4');
const { all, reject } = require('bluebird');
const { getNodeLib } = require(`${SERVER_PATH}/init`);
const moment = require('moment');
const math = require('mathjs');
const { each } = require('lodash');
const { parse } = require('json2csv');

const sendRequestWithdrawalEmail = (id, address, amount, currency, otpCode, ip, domain) => {
	if (!subscribedToCoin(currency)) {
		return reject(new Error(INVALID_COIN(currency)));
	}

	if (amount <= 0) {
		return reject(new Error(INVALID_AMOUNT(amount)));
	}

	if (!getKitCoin(currency).allow_withdrawal) {
		return reject(new Error(WITHDRAWAL_DISABLED_FOR_COIN(currency)));
	}

	return verifyOtpBeforeAction(id, otpCode)
		.then((validOtp) => {
			if (!validOtp) {
				throw new Error(INVALID_OTP_CODE);
			}
			return getUserByKitId(id);
		})
		.then(async (user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			} else if (!user.network_id) {
				throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
			}
			if (user.verification_level < 1) {
				throw new Error(UPGRADE_VERIFICATION_LEVEL(1));
			}

			const balance = await getNodeLib().getUserBalance(user.network_id);
			if (balance[`${currency}_available`] < amount) {
				throw new Error('Insufficent balance for withdrawal');
			}

			return all([
				user,
				findTier(user.verification_level)
			]);
		})
		.then(async ([ user, tier ]) => {
			const limit = tier.withdrawal_limit;
			if (limit === -1) {
				throw new Error('Withdrawals are disabled for this coin');
			} else if (limit > 0) {
				let belowLimit = await withdrawalBelowLimit(user.network_id, currency, limit, amount);

				if (!belowLimit) {
					throw new Error('Amount exceeds 24 hour withdrawal limit');
				}
			}
			return withdrawalRequestEmail(
				user,
				{
					user_id: id,
					email: user.email,
					amount,
					fee: getKitCoin(currency).withdrawal_fee,
					transaction_id: uuid(),
					address,
					currency
				},
				domain,
				ip
			);
		});
};

const withdrawalRequestEmail = (user, data, domain, ip) => {
	data.timestamp = Date.now();
	let stringData = JSON.stringify(data);
	const token = crypto.randomBytes(60).toString('hex');

	return client.hsetAsync(WITHDRAWALS_REQUEST_KEY, token, stringData)
		.then(() => {
			const { email, amount, fee, currency, address } = data;
			sendEmail(
				MAILTYPE.WITHDRAWAL_REQUEST,
				email,
				{
					amount: amount,
					fee: fee,
					currency: currency,
					transaction_id: token,
					address: address,
					ip: ip
				},
				user.settings,
				domain
			);
			return data;
		});
};

const validateWithdrawalToken = (token) => {
	return client.hgetAsync(WITHDRAWALS_REQUEST_KEY, token)
		.then((withdrawal) => {
			if (!withdrawal) {
				throw new Error(INVALID_WITHDRAWAL_TOKEN);
			} else {
				withdrawal = JSON.parse(withdrawal);

				client.hdelAsync(WITHDRAWALS_REQUEST_KEY, token);

				if (Date.now() - withdrawal.timestamp > getKitSecrets().security.withdrawal_token_expiry) {
					throw new Error(EXPIRED_WITHDRAWAL_TOKEN);
				} else {
					return withdrawal;
				}
			}
		});
};

const cancelUserWithdrawalByKitId = (userId, withdrawalId) => {
	return getUserByKitId(userId)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			} else if (!user.network_id) {
				throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
			}
			return getNodeLib().cancelWithdrawal(user.network_id, withdrawalId);
		});
};

const cancelUserWithdrawalByNetworkId = (networkId, withdrawalId) => {
	if (!networkId) {
		return reject(new Error(USER_NOT_REGISTERED_ON_NETWORK));
	}
	return getNodeLib().cancelWithdrawal(networkId, withdrawalId);
};

const checkTransaction = (currency, transactionId, address, isTestnet = false) => {
	if (!subscribedToCoin(currency)) {
		return reject(new Error(INVALID_COIN(currency)));
	}

	return getNodeLib().checkTransaction(currency, transactionId, address, { isTestnet });
};

const performWithdrawal = (userId, address, currency, amount, fee) => {
	if (!subscribedToCoin(currency)) {
		return reject(new Error(INVALID_COIN(currency)));
	}
	return getUserByKitId(userId)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			} else if (!user.network_id) {
				throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
			}
			return all([
				user,
				findTier(user.verification_level)
			]);
		})
		.then(async ([ user, tier ]) => {
			const limit = tier.withdrawal_limit;
			if (limit === -1) {
				throw new Error('Withdrawals are disabled for this coin');
			} else if (limit > 0) {
				let belowLimit = await withdrawalBelowLimit(user.network_id, currency, limit, amount);

				if (!belowLimit) {
					throw new Error('Amount exceeds 24 hour withdrawal limit');
				}
			}
			return getNodeLib().performWithdrawal(user.network_id, address, currency, amount, fee);
		});
};

const performWithdrawalNetwork = (networkId, address, currency, amount, fee) => {
	return getNodeLib().performWithdrawal(networkId, address, currency, amount, fee);
};

const withdrawalBelowLimit = async (userId, currency, limit, amount = 0) => {
	let accumulatedAmount = amount;
	const withdrawals = await getNodeLib().getUserWithdrawals(userId, {
		currency,
		dismissed: false,
		rejected: false,
		startDate: moment().subtract(24, 'hours').toISOString()
	});
	each(withdrawals.data, (withdrawal) => {
		accumulatedAmount = math.number(math.add(math.bignumber(accumulatedAmount), math.bignumber(withdrawal.amount)));
	});

	const convertedAmount = await getNodeLib().getOraclePrices([currency], {
		quote: getKitConfig().native_currency,
		amount: accumulatedAmount
	});

	return convertedAmount[currency] < limit;
};

const transferAssetByKitIds = (senderId, receiverId, currency, amount, description = 'Admin Transfer', email = true) => {
	if (!subscribedToCoin(currency)) {
		return reject(new Error(INVALID_COIN(currency)));
	}

	if (amount <= 0) {
		return reject(new Error(INVALID_AMOUNT(amount)));
	}

	return all([
		getUserByKitId(senderId),
		getUserByKitId(receiverId)
	])
		.then(([ sender, receiver ]) => {
			if (!sender || !receiver) {
				throw new Error(USER_NOT_FOUND);
			} else if (!sender.network_id || !receiver.network_id) {
				throw new Error('User not registered on network');
			}
			return getNodeLib().transferAsset(sender.network_id, receiver.network_id, currency, amount, description, email);
		});
};

const transferAssetByNetworkIds = (senderId, receiverId, currency, amount, description = 'Admin Transfer', email = true) => {
	return getNodeLib().transferAsset(senderId, receiverId, currency, amount, description, email);
};

const getUserBalanceByKitId = (userKitId) => {
	return getUserByKitId(userKitId)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			} else if (!user.network_id) {
				throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
			}
			return getNodeLib().getUserBalance(user.network_id);
		})
		.then((data) => {
			return {
				user_id: userKitId,
				...data
			};
		});
};

const getUserBalanceByNetworkId = (networkId) => {
	if (!networkId) {
		return reject(new Error(USER_NOT_REGISTERED_ON_NETWORK));
	}
	return getNodeLib().getUserBalance(networkId);
};

const getKitBalance = () => {
	return getNodeLib().getBalance();
};

const getUserTransactionsByKitId = (
	type,
	kitId,
	currency,
	status,
	dismissed,
	rejected,
	processing,
	waiting,
	limit,
	page,
	orderBy,
	order,
	startDate,
	endDate,
	format
) => {
	let promiseQuery;
	if (kitId) {
		if (type === 'deposit') {
			promiseQuery = getUserByKitId(kitId, false)
				.then((user) => {
					if (!user) {
						throw new Error(USER_NOT_FOUND);
					} else if (!user.network_id) {
						throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
					}
					return getNodeLib().getUserDeposits(user.network_id, {
						currency,
						status,
						dismissed,
						rejected,
						processing,
						waiting,
						limit,
						page,
						orderBy,
						order,
						startDate,
						endDate
					});
				});
		} else if (type === 'withdrawal') {
			promiseQuery = getUserByKitId(kitId, false)
				.then((user) => {
					if (!user) {
						throw new Error(USER_NOT_FOUND);
					} else if (!user.network_id) {
						throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
					}
					return getNodeLib().getUserWithdrawals(user.network_id, {
						currency,
						status,
						dismissed,
						rejected,
						processing,
						waiting,
						limit,
						page,
						orderBy,
						order,
						startDate,
						endDate
					});
				});
		}
	} else {
		if (type === 'deposit') {
			promiseQuery = getNodeLib().getDeposits({
				currency,
				status,
				dismissed,
				rejected,
				processing,
				waiting,
				limit,
				page,
				orderBy,
				order,
				startDate,
				endDate
			});
		} else if (type === 'withdrawal') {
			promiseQuery = getNodeLib().getWithdrawals({
				currency,
				status,
				dismissed,
				rejected,
				processing,
				waiting,
				limit,
				page,
				orderBy,
				order,
				startDate,
				endDate
			});
		}
	}
	return promiseQuery
		.then((transactions) => {
			if (format) {
				if (transactions.data.length === 0) {
					throw new Error(NO_DATA_FOR_CSV);
				}
				const csv = parse(transactions.data, Object.keys(transactions.data[0]));
				return csv;
			} else {
				return transactions;
			}
		});
};

const getUserDepositsByKitId = (
	kitId,
	currency,
	status,
	dismissed,
	rejected,
	processing,
	waiting,
	limit,
	page,
	orderBy,
	order,
	startDate,
	endDate,
	format
) => {
	return getUserTransactionsByKitId('deposit', kitId, currency, status, dismissed, rejected, processing, waiting, limit, page, orderBy, order, startDate, endDate, format);
};

const getUserWithdrawalsByKitId = (
	kitId,
	currency,
	status,
	dismissed,
	rejected,
	processing,
	waiting,
	limit,
	page,
	orderBy,
	order,
	startDate,
	endDate,
	format
) => {
	return getUserTransactionsByKitId('withdrawal', kitId, currency, status, dismissed, rejected, processing, waiting, limit, page, orderBy, order, startDate, endDate, format);
};

const getExchangeDeposits = (
	currency,
	status,
	dismissed,
	rejected,
	processing,
	waiting,
	limit,
	page,
	orderBy,
	order,
	startDate,
	endDate,
) => {
	return getNodeLib().getDeposits({
		currency,
		status,
		dismissed,
		rejected,
		processing,
		waiting,
		limit,
		page,
		orderBy,
		order,
		startDate,
		endDate
	});
};

const getExchangeWithdrawals = (
	currency,
	status,
	dismissed,
	rejected,
	processing,
	waiting,
	limit,
	page,
	orderBy,
	order,
	startDate,
	endDate,
) => {
	return getNodeLib().getWithdrawals({
		currency,
		status,
		dismissed,
		rejected,
		processing,
		waiting,
		limit,
		page,
		orderBy,
		order,
		startDate,
		endDate
	});
};

const mintAssetByKitId = (kitId, currency, amount, description) => {
	return getUserByKitId(kitId)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			} else if (!user.network_id) {
				throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
			}
			return getNodeLib().mintAsset(user.network_id, currency, amount, { description });
		});
};

const mintAssetByNetworkId = (networkId, currency, amount, description) => {
	return getNodeLib().mintAsset(networkId, currency, amount, { description });
};

const burnAssetByKitId = (kitId, currency, amount, description) => {
	return getUserByKitId(kitId)
		.then((user) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			} else if (!user.network_id) {
				throw new Error(USER_NOT_REGISTERED_ON_NETWORK);
			}
			return getNodeLib().burnAsset(user.network_id, currency, amount, { description });
		});
};

const burnAssetByNetworkId = (networkId, currency, amount, description) => {
	return getNodeLib().burnAsset(networkId, currency, amount, { description });
};

module.exports = {
	sendRequestWithdrawalEmail,
	validateWithdrawalToken,
	cancelUserWithdrawalByKitId,
	checkTransaction,
	performWithdrawal,
	transferAssetByKitIds,
	getUserBalanceByKitId,
	getUserDepositsByKitId,
	getUserWithdrawalsByKitId,
	performWithdrawalNetwork,
	cancelUserWithdrawalByNetworkId,
	getExchangeDeposits,
	getExchangeWithdrawals,
	getUserBalanceByNetworkId,
	transferAssetByNetworkIds,
	mintAssetByKitId,
	mintAssetByNetworkId,
	burnAssetByKitId,
	burnAssetByNetworkId,
	getKitBalance
};
