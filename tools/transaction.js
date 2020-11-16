'use strict';

const { SERVER_PATH } = require('../constants');
const { sendEmail } = require(`${SERVER_PATH}/mail`);
const { MAILTYPE } = require(`${SERVER_PATH}/mail/strings`);
const { WITHDRAWALS_REQUEST_KEY } = require(`${SERVER_PATH}/constants`);
const { verifyOtpBeforeAction } = require('./otp');
const { subscribedToCoin, getKitCoin, getKitSecrets, getKitConfig } = require('./common');
const {
	INVALID_OTP_CODE,
	INVALID_WITHDRAWAL_TOKEN,
	EXPIRED_WITHDRAWAL_TOKEN,
	INVALID_COIN,
	INVALID_AMOUNT,
	WITHDRAWAL_DISABLED_FOR_COIN,
	UPGRADE_VERIFICATION_LEVEL
} = require('../messages');
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
			if (user.verification_level < 1) {
				throw new Error(UPGRADE_VERIFICATION_LEVEL(1));
			}

			const balance = await getNodeLib().getBalanceNetwork(user.network_id);
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
			return withdrawRequestEmail(
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

const withdrawRequestEmail = (user, data, domain, ip) => {
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

const cancelUserWithdrawal = (userId, transactionId) => {
	return getUserByKitId(userId)
		.then((user) => {
			return getNodeLib().cancelWithdrawalNetwork(user.network_id, transactionId);
		});
};

const checkTransaction = (currency, transactionId, address, isTestnet = false) => {
	if (!subscribedToCoin(currency)) {
		return reject(new Error(INVALID_COIN(currency)));
	}

	return getNodeLib().checkTransactionNetwork(currency, transactionId, address, isTestnet);
};

const performWithdrawal = (userId, address, currency, amount, fee) => {
	if (!subscribedToCoin(currency)) {
		return reject(new Error(INVALID_COIN(currency)));
	}
	return getUserByKitId(userId)
		.then((user) => {
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
			return getNodeLib().createWithdrawalNetwork(user.network_id, address, currency, amount, fee);
		});
};

const withdrawalBelowLimit = async (userId, currency, limit, amount = 0) => {
	let accumulatedAmount = amount;
	const withdrawals = await getNodeLib().getAllWithdrawalNetwork(
		userId,
		currency,
		undefined,
		false,
		false,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		moment().subtract(24, 'hours').toISOString()
	);
	each(withdrawals.data, (withdrawal) => {
		accumulatedAmount = math.number(math.add(math.bignumber(accumulatedAmount), math.bignumber(withdrawal.amount)));
	});

	const convertedAmount = await getNodeLib().getOraclePrice(currency, getKitConfig().native_currency, accumulatedAmount);

	return convertedAmount[currency] < limit;
};

module.exports = {
	sendRequestWithdrawalEmail,
	validateWithdrawalToken,
	cancelUserWithdrawal,
	checkTransaction,
	performWithdrawal
};
