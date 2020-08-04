'use strict';

const { loggerWithdrawals } = require('../../config/logger');
const { all } = require('bluebird');
const { isValidCurrency, isValidAmount } = require('../helpers/currency');
const { checkCaptcha } = require('../helpers/security');
const { verifyOtpBeforeAction } = require('../helpers/otp');
const { validateWithdraw, getFees, withdrawRequestEmail } = require('../helpers/transaction');
const { findUser } = require('../helpers/user');
const {
	INVALID_OTP_CODE
} = require('../../messages');

const requestWithdrawal = (req, res) => {
	loggerWithdrawals.verbose(
		req.uuid,
		'controller/withdrawals/requestWithdrawal',
		req.auth.sub
	);

	loggerWithdrawals.verbose(
		req.uuid,
		'controller/withdrawals/requestWithdrawal body',
		req.swagger.params.data.value
	);

	const { email, id } = req.auth.sub;
	const {
		address,
		otp_code,
		captcha,
		amount,
		currency
	} = req.swagger.params.data.value;
	const domain = req.headers['x-real-origin'];
	const ip = req.headers['x-real-ip'];

	loggerWithdrawals.verbose(
		req.uuid,
		'controller/withdrawals/requestWithdrawal parsed_params',
		email,
		address,
		amount,
		captcha,
		currency,
		otp_code
	);

	if (!isValidCurrency(currency)) {
		return res
			.status(400)
			.json({ message: `Invalid currency: "${currency}"` });
	}

	if (!isValidAmount(amount)) {
		loggerWithdrawals.error(
			req.uuid,
			'controller/withdrawals/requestWithdrawal isValidAmount',
			'ALERT',
			id,
			amount
		);
		return res
			.status(400)
			.json({ message: 'Invalid amount' });
	}

	return all([checkCaptcha(captcha, ip), validateWithdraw(currency, address, amount)])
		.then(() => verifyOtpBeforeAction(id, otp_code))
		.then((validOtp) => {
			if (!validOtp) {
				throw new Error(INVALID_OTP_CODE);
			}
			return findUser({
				where: { id },
				attributes: ['crypto_wallet', 'verification_level', 'settings']
			});
		})
		.then((user) => {
			user = user.dataValues;
			if (user.verification_level < 1) {
				throw new Error('Upgrade verification level');
			}
			return all([user, getFees(currency)]);
		})
		.then(([user, fee]) => {
			return withdrawRequestEmail(
				user,
				{
					user_id: id,
					email,
					amount,
					fee,
					transaction_id: req.uuid,
					address,
					currency
				},
				domain,
				ip
			);
		})
		.then(() => {
			res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerWithdrawals.error(
				req.uuid,
				'controller/withdrawals/requestWithdrawal error_data',
				err.code,
				err.message
			);
			res.status(400).json({ message: err.message });
		});
};

module.exports = {
	requestWithdrawal
};
