'use strict';

const crypto = require('crypto');
const redis = require('../../db/redis').duplicate();
const { getCoin } = require('../../init');
const { loggerWithdrawals } = require('../../config/logger');
const { sendEmail } = require('../../mail');
const { MAILTYPE } = require('../../mail/strings');
const { WITHDRAWALS_REQUEST_KEY } = require('../../constants');
const { handler } = require('../handlers');

const getFees = (currency) => {
	return new Promise((resolve) => {
		const fee = getCoin(currency).withdrawal_fee;
		resolve(fee);
	});
};

const withdrawRequestEmail = (user, data, domain, ip) => {
	data.timestamp = Date.now();
	let stringData = JSON.stringify(data);
	const token = crypto.randomBytes(60).toString('hex');

	return redis
		.hsetAsync(WITHDRAWALS_REQUEST_KEY, token, stringData)
		.then((result) => {
			loggerWithdrawals.debug(
				'helpers/withdrawals/withdrawRequestEmail/store_result',
				result
			);
			return data;
		})
		.then((deposit) => {
			const { email, amount, fee, currency, address } = deposit;
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
			return deposit;
		});
};

const validateWithdraw = (currency, address, amount) => {
	return handler(currency).validateWithdraw(address, amount);
};

module.exports = {
	getFees,
	withdrawRequestEmail,
	validateWithdraw
};
