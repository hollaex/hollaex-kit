'use strict';

const { loggerWithdrawals } = require('../../config/logger');
const toolsLib = require('hollaex-tools-lib');
const { all } = require('bluebird');
const { USER_NOT_FOUND } = require('../../messages');
const { errorMessageConverter } = require('../../utils/conversion');
const { isEmail } = require('validator');

const getWithdrawalFee = (req, res) => {
	const currency = req.swagger.params.currency.value;

	if (!toolsLib.subscribedToCoin(currency)) {
		loggerWithdrawals.error(
			req.uuid,
			'controller/withdrawal/getWithdrawalFee err',
			`Invalid currency: "${currency}"`
		);
		return res.status(400).json({ message: `Invalid currency: "${currency}"` });
	}

	try {
		return res.json({ fee: toolsLib.getKitCoin(currency).withdrawal_fee });
	} catch (err) {
		loggerWithdrawals.error(
			req.uuid,
			'controller/withdrawal/getWithdrawalFee err',
			err.message
		);
		return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
	}
};

const requestWithdrawal = (req, res) => {
	loggerWithdrawals.verbose(
		req.uuid,
		'controller/withdrawal/requestWithdrawal auth',
		req.auth.sub
	);

	const { id } = req.auth.sub;
	const {
		address,
		otp_code,
		amount,
		currency,
		network
	} = req.swagger.params.data.value;
	const domain = req.headers['x-real-origin'];
	const ip = req.headers['x-real-ip'];

	loggerWithdrawals.verbose(
		req.uuid,
		'controller/withdrawal/requestWithdrawal auth',
		'address',
		address,
		'amount',
		amount,
		'currency',
		currency,
		'network',
		network
	);

	toolsLib.wallet.sendRequestWithdrawalEmail(id, address, amount, currency, {
		network,
		otpCode: otp_code,
		ip,
		domain
	})
		.then(() => {
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerWithdrawals.error(
				req.uuid,
				'controller/withdrawal/requestWithdrawal',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const performWithdrawal = (req, res) => {
	loggerWithdrawals.verbose(
		req.uuid,
		'controller/withdrawal/performWithdraw body',
		req.swagger.params.data.value
	);

	const { token } = req.swagger.params.data.value;

	loggerWithdrawals.verbose(
		req.uuid,
		'controller/withdrawal/performWithdraw parsed_params',
		token
	);

	toolsLib.wallet.validateWithdrawalToken(token)
		.then((withdrawal) => {
			return all([ withdrawal, toolsLib.user.getUserByKitId(withdrawal.user_id) ]);
		})
		.then(async ([ withdrawal, user ]) => {
			if (!user) {
				throw new Error(USER_NOT_FOUND);
			}
			if (user.verification_level < 1) {
				throw new Error('User must upgrade verification level to perform a withdrawal');
			}
			if (isEmail(withdrawal.address)) {
				const receiver = await toolsLib.user.getUserByEmail(withdrawal.address);
				if (!receiver) {
					throw new Error(USER_NOT_FOUND);
				}

				return all([
					toolsLib.wallet.transferAssetByKitIds(withdrawal.user_id, receiver.id, withdrawal.currency, withdrawal.amount, 'Email Transfer', true, {
						additionalHeaders: {
							'x-forwarded-for': req.headers['x-forwarded-for']
						}
					}),
					withdrawal
				]);
			} else {
				return all([
					toolsLib.wallet.performWithdrawal(
						withdrawal.user_id,
						withdrawal.address,
						withdrawal.currency,
						withdrawal.amount,
						{
							network: withdrawal.network,
							additionalHeaders: {
								'x-forwarded-for': req.headers['x-forwarded-for']
							}
						}
					),
					withdrawal
				]);
			}
		})
		.then(([ { transaction_id }, { fee } ]) => {
			return res.json({
				message: 'Withdrawal successful',
				fee,
				transaction_id
			});
		})
		.catch((err) => {
			loggerWithdrawals.error(
				req.uuid,
				'controller/withdrawals/performWithdrawal',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const performDirectWithdrawal = (req, res) => {
	const { id: userId } = req.auth.sub;
	const {
		address,
		currency,
		amount,
		network
	} = req.swagger.params.data.value;

	const domain = req.headers['x-real-origin'];
	const ip = req.headers['x-real-ip'];

	loggerWithdrawals.verbose(
		req.uuid,
		'controller/withdrawal/performDirectWithdrawal auth',
		'address',
		address,
		'amount',
		amount,
		'currency',
		currency,
		'network',
		network
	);

	toolsLib.wallet.performDirectWithdrawal(
		userId,
		address,
		currency,
		amount,
		{
			network,
			additionalHeaders: {
				'x-forwarded-for': req.headers['x-forwarded-for']
			}
		})
		.then((data) => {

			loggerWithdrawals.verbose(
				req.uuid,
				'controller/withdrawal/performDirectWithdrawal done',
				'transaction_id',
				data.transaction_id,
				'fee',
				data.fee,
				data
			);
			return res.json({
				message: 'Withdrawal request is in the queue and will be processed.',
				id: data.id,
				transaction_id: data.transaction_id,
				amount: data.amount,
				currency: data.currency,
				fee: data.fee,
				fee_coin: data.fee_coin
			});
		})
		.catch((err) => {
			loggerWithdrawals.error(
				req.uuid,
				'controller/withdrawals/performWithdrawal',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const getAdminWithdrawals = (req, res) => {
	loggerWithdrawals.verbose(
		req.uuid,
		'controllers/withdrawal/getWithdrawals/auth',
		req.auth
	);

	const {
		user_id,
		currency,
		limit,
		page,
		order_by,
		order,
		start_date,
		end_date,
		status,
		dismissed,
		rejected,
		processing,
		waiting,
		format,
		transaction_id,
		address
	} = req.swagger.params;

	toolsLib.wallet.getUserWithdrawalsByKitId(
		user_id.value,
		currency.value,
		status.value,
		dismissed.value,
		rejected.value,
		processing.value,
		waiting.value,
		limit.value,
		page.value,
		order_by.value,
		order.value,
		start_date.value,
		end_date.value,
		transaction_id.value,
		address.value,
		format.value,
		{
			additionalHeaders: {
				'x-forwarded-for': req.headers['x-forwarded-for']
			}
		}
	)
		.then((data) => {
			if (format.value) {
				res.setHeader('Content-disposition', `attachment; filename=${toolsLib.getKitConfig().api_name}-users-deposits.csv`);
				res.set('Content-Type', 'text/csv');
				return res.status(202).send(data);
			} else {
				return res.json(data);
			}
		})
		.catch((err) => {
			loggerWithdrawals.error(
				req.uuid,
				'controllers/withdrawal/getWithdrawals',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const getUserWithdrawals = (req, res) => {
	loggerWithdrawals.verbose(
		req.uuid,
		'controllers/withdrawal/getUserWithdrawals auth',
		req.auth.sub
	);
	const user_id = req.auth.sub.id;
	const {
		limit,
		currency,
		page,
		order_by,
		order,
		start_date,
		end_date,
		format,
		transaction_id,
		address,
		status,
		dismissed,
		rejected,
		processing,
		waiting
	} = req.swagger.params;

	toolsLib.wallet.getUserWithdrawalsByKitId(
		user_id,
		currency.value,
		status.value,
		dismissed.value,
		rejected.value,
		processing.value,
		waiting.value,
		limit.value,
		page.value,
		order_by.value,
		order.value,
		start_date.value,
		end_date.value,
		transaction_id.value,
		address.value,
		format.value,
		{
			additionalHeaders: {
				'x-forwarded-for': req.headers['x-forwarded-for']
			}
		}
	)
		.then((data) => {
			if (format.value) {
				res.setHeader('Content-disposition', `attachment; filename=${toolsLib.getKitConfig().api_name}-withdrawals.csv`);
				res.set('Content-Type', 'text/csv');
				return res.status(202).send(data);
			} else {
				return res.json(data);
			}
		})
		.catch((err) => {
			loggerWithdrawals.error('controllers/withdrawal/getUserWithdrawals', err.message);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

const cancelWithdrawal = (req, res) => {
	loggerWithdrawals.verbose(
		req.uuid,
		'controllers/withdrawal/cancelWithdrawal auth',
		req.auth
	);

	const userId = req.auth.sub.id;
	const id = req.swagger.params.id.value;

	toolsLib.wallet.cancelUserWithdrawalByKitId(userId, id, {
		additionalHeaders: {
			'x-forwarded-for': req.headers['x-forwarded-for']
		}
	})
		.then((withdrawal) => {
			return res.json(withdrawal);
		})
		.catch((err) => {
			loggerWithdrawals.error(
				req.uuid,
				'controllers/withdrawal/cancelWithdrawal',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: errorMessageConverter(err) });
		});
};

module.exports = {
	requestWithdrawal,
	getWithdrawalFee,
	performWithdrawal,
	getAdminWithdrawals,
	getUserWithdrawals,
	cancelWithdrawal,
	performDirectWithdrawal
};
