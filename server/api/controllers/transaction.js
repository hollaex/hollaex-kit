'use strict';

const { loggerDeposits } = require('../../config/logger');
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

const getAdminDeposits = (req, res) => {
	loggerDeposits.verbose(
		req.uuid,
		'controllers/admin/getDeposits/auth',
		req.auth
	);

	const { user_id, currency, limit, page, order_by, order, start_date, end_date, status, dismissed, rejected, processing, waiting, format } = req.swagger.params;

	toolsLib.users.getUserDepositsByKitId(user_id.value, currency.value, status.value, dismissed.value, rejected.value, processing.value, waiting.value, limit.value, page.value, order_by.value, order.value, start_date.value, end_date.value, format.value)
		.then((data) => {
			if (format.value) {
				if (data.data.length === 0) {
					throw new Error('No data found');
				}
				res.setHeader('Content-disposition', `attachment; filename=${toolsLib.getKitConfig().api_name}-users-deposits.csv`);
				res.set('Content-Type', 'text/csv');
				return res.status(202).send(data);
			} else {
				return res.json(data);
			}
		})
		.catch((err) => {
			loggerDeposits.error(
				req.uuid,
				'controllers/admin/getDeposits',
				err.message
			);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const getAdminWithdrawals = (req, res) => {
	loggerDeposits.verbose(
		req.uuid,
		'controllers/admin/getWithdrawals/auth',
		req.auth
	);

	const { user_id, currency, limit, page, order_by, order, start_date, end_date, status, dismissed, rejected, processing, waiting, format } = req.swagger.params;

	toolsLib.users.getUserWithdrawalsByKitId(user_id.value, currency.value, status.value, dismissed.value, rejected.value, processing.value, waiting.value, limit.value, page.value, order_by.value, order.value, start_date.value, end_date.value, format.value)
		.then((data) => {
			if (format.value) {
				if (data.data.length === 0) {
					throw new Error('No data found');
				}
				res.setHeader('Content-disposition', `attachment; filename=${toolsLib.getKitConfig().api_name}-users-deposits.csv`);
				res.set('Content-Type', 'text/csv');
				return res.status(202).send(data);
			} else {
				return res.json(data);
			}
		})
		.catch((err) => {
			loggerDeposits.error(
				req.uuid,
				'controllers/admin/getWithdrawals',
				err.message
			);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const getUserDeposits = (req, res) => {
	loggerDeposits.verbose(
		req.uuid,
		'controllers/user/getUserDeposits auth',
		req.auth.sub
	);
	const user_id = req.auth.sub.id;
	const currency = req.swagger.params.currency.value || '';
	const { limit, page, order_by, order, start_date, end_date, format } = req.swagger.params;

	toolsLib.users.getUserDepositsByKitId(user_id, currency, limit.value, page.value, order_by.value, order.value, start_date.value, end_date.value, format.value)
		.then((data) => {
			if (format.value) {
				if (data.data.length === 0) {
					throw new Error('No data found');
				}
				res.setHeader('Content-disposition', `attachment; filename=${toolsLib.getKitConfig().api_name}-deposits.csv`);
				res.set('Content-Type', 'text/csv');
				return res.status(202).send(data);
			} else {
				return res.json(data);
			}
		})
		.catch((err) => {
			loggerDeposits.error('controllers/user/getUserDeposits', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const getUserWithdrawals = (req, res) => {
	loggerDeposits.verbose(
		req.uuid,
		'controllers/user/getUserWithdrawals auth',
		req.auth.sub
	);
	const user_id = req.auth.sub.id;
	const currency = req.swagger.params.currency.value || '';
	const { limit, page, order_by, order, start_date, end_date, format } = req.swagger.params;

	toolsLib.users.getUserWithdrawalsByKitId(user_id, currency, limit.value, page.value, order_by.value, order.value, start_date.value, end_date.value, format.value)
		.then((data) => {
			if (format.value) {
				if (data.data.length === 0) {
					throw new Error('No data found');
				}
				res.setHeader('Content-disposition', `attachment; filename=${toolsLib.getKitConfig().api_name}-withdrawals.csv`);
				res.set('Content-Type', 'text/csv');
				return res.status(202).send(data);
			} else {
				return res.json(data);
			}
		})
		.catch((err) => {
			loggerDeposits.error('controllers/user/getUserWithdrawals', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

module.exports = {
	requestWithdrawal,
	getWithdrawalFee,
	adminCheckTransaction,
	performWithdrawal,
	getAdminDeposits,
	getAdminWithdrawals,
	getUserDeposits,
	getUserWithdrawals
};
