'use strict';

const { loggerDeposits } = require('../../config/logger');
const { sendEmail } = require('../../mail');
const { MAILTYPE } = require('../../mail/strings');
const toolsLib = require('hollaex-tools-lib');
const { all } = require('bluebird');

const getWithdrawalFee = (req, res) => {
	const currency = req.swagger.params.currency.value;

	if (!toolsLib.subscribeToCoin(currency)) {
		loggerDeposits.error(
			req.uuid,
			'controller/transaction/getWithdrawalFee err',
			`Invalid currency: "${currency}"`
		);
		return res.status(400).json({ message: `Invalid currency: "${currency}"` });
	}

	try {
		return res.json({ fee: toolsLib.getKitCoin(currency).withdrawal_fee });
	} catch (err) {
		loggerDeposits.error(
			req.uuid,
			'controller/transaction/getWithdrawalFee err',
			err.message
		);
		return res.status(400).json({ message: err.message });
	}
};

const handleCurrencyDeposit = (req, res) => {
	const ip = req.headers ? req.headers['x-real-ip'] : undefined;
	const domain = req.headers['x-real-origin'];
	loggerDeposits.verbose('controller/transaction/handleCurrencyDeposit ip domain', ip, domain);

	const currency = req.swagger.params.currency.value;
	const { user_id, amount, txid, address, is_confirmed } = req.swagger.params.data.value;

	toolsLib.auth.verifyHmacToken(req)
		.then(() => {
			if (!toolsLib.subscribeToCoin(currency)) {
				throw new Error('Invalid currency');
			}
			return toolsLib.users.getUserByNetworkId(user_id);
		})
		.then((user) => {
			sendEmail(
				MAILTYPE.DEPOSIT,
				user.email,
				{
					amount,
					currency,
					status: is_confirmed ? 'COMPLETED' : 'PENDING',
					address,
					transaction_id: txid,
					phoneNumber: user.phone_number
				},
				user.settings,
				domain
			);
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerDeposits.error(
				req.uuid,
				'controller/transaction/handleCurrencyDeposit',
				err.message
			);
			return res.status(400).json({ message: `Fail - ${err.message}` });
		});
};

const handleCurrencyWithdrawal = (req, res) => {
	const ip = req.headers ? req.headers['x-real-ip'] : undefined;
	const domain = req.headers['x-real-origin'];
	loggerDeposits.verbose('controller/transaction/handleCurrencyWithdrawal ip domain', ip, domain);

	const currency = req.swagger.params.currency.value;
	const { user_id, amount, txid, address, is_confirmed, fee } = req.swagger.params.data.value;

	toolsLib.auth.verifyHmacToken(req)
		.then(() => {
			if (!toolsLib.subscribeToCoin(currency)) {
				throw new Error('Invalid currency');
			}
			return toolsLib.users.getUserByNetworkId(user_id);
		})
		.then((user) => {
			sendEmail(
				MAILTYPE.WITHDRAWAL,
				user.email,
				{
					amount,
					currency,
					status: is_confirmed ? 'COMPLETED' : 'PENDING',
					address,
					fee,
					transaction_id: txid,
					phoneNumber: user.phone_number
				},
				user.settings,
				domain
			);
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerDeposits.error(
				req.uuid,
				'controller/transaction/handleCurrencyWithdrawal',
				err.message
			);
			return res.status(400).json({ message: `Fail - ${err.message}` });
		});
};

const requestWithdrawal = (req, res) => {
	loggerDeposits.verbose(
		req.uuid,
		'controller/withdrawals/requestWithdrawal auth',
		req.auth.sub
	);

	const { id } = req.auth.sub;
	const {
		address,
		otp_code,
		captcha,
		amount,
		currency
	} = req.swagger.params.data.value;
	const domain = req.headers['x-real-origin'];
	const ip = req.headers['x-real-ip'];

	toolsLib.transaction.sendRequestWithdrawalEmail(id, address, amount, currency, otp_code, captcha, ip, domain)
		.then(() => {
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerDeposits.error(
				req.uuid,
				'controller/withdrawals/requestWithdrawal',
				err.message
			);
			return res.status(400).json({ message: err.message });
		});
};

const performWithdrawal = (req, res) => {
	loggerDeposits.verbose(
		req.uuid,
		'controller/withdrawals/performWithdraw body',
		req.swagger.params.data.value
	);

	const { token, otp_code } = req.swagger.params.data.value;

	loggerDeposits.verbose(
		req.uuid,
		'controller/withdrawals/performWithdraw parsed_params',
		token
	);

	toolsLib.transaction.validateWithdrawalToken(token)
		.then((withdrawal) => {
			return all([ withdrawal, toolsLib.getUserByKitId(withdrawal.user_id) ]);
		})
		.then(([ withdrawal, user ]) => {
			if (user.verification_level < 1) {
				throw new Error('User must upgrade verification level to perform a withdrawal');
			}
			return all([ toolsLib.transaction.performWithdrawal(withdrawal.user_id, withdrawal.address, withdrawal.currency, withdrawal.amount, withdrawal.fee, otp_code), withdrawal ]);
		})
		.then(([ { transaction_id }, { fee } ]) => {
			return res.json({
				message: 'Withdrawal successful',
				fee,
				transaction_id
			});
		})
		.catch((err) => {
			loggerDeposits.error(
				req.uuid,
				'controller/withdrawals/performWithdrawal',
				err.message
			);
			return res.status(400).json({ message: err.message });
		});
};


const adminCheckTransaction = (req, res) => {
	loggerDeposits.verbose(
		req.uuid,
		'controllers/transaction/adminCheckTransaction auth',
		req.auth
	);
	const transactionId = req.swagger.params.transaction_id.value;
	const address = req.swagger.params.address.value;
	const currency = req.swagger.params.currency.value;
	const isTestnet = req.swagger.params.is_testnet.value;

	toolsLib.transaction.checkTransaction(currency, transactionId, address, isTestnet)
		.then((transaction) => {
			return res.json({ message: 'Success', transaction });
		})
		.catch((err) => {
			loggerDeposits.error(
				req.uuid,
				'controllers/transaction/adminCheckTransaction catch',
				err.message
			);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

module.exports = {
	handleCurrencyDeposit,
	requestWithdrawal,
	getWithdrawalFee,
	adminCheckTransaction,
	performWithdrawal,
	handleCurrencyWithdrawal
};
