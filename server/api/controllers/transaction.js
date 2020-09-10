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
			err
		);
		return res.status(400).json({ message: err.message });
	}
};

// const handleCurrencyDeposit = (req, res) => {
// 	const ip = req.headers ? req.headers['x-real-ip'] : undefined;
// 	const apiKey = req.headers ? req.headers['key'] : undefined;
// 	const apiSecret = req.headers ? req.headers['secret'] : undefined;

// 	loggerDeposits.verbose('contorller/notification/handleCurrencyDeposit ip', ip);

// 	if (!apiKey || !apiSecret) {
// 		throw new Error('Missing Headers');
// 	} else if (apiKey !== VAULT_KEY()) {
// 		loggerDeposits.error('contorller/notification/handleCurrencyDeposit null key', apiKey);
// 		throw new Error('Invalid API key');
// 	} else if (apiSecret !== VAULT_SECRET()) {
// 		loggerDeposits.error(
// 			'contorller/notification/handleCurrencyDeposit null secret',
// 			apiKey
// 		);
// 		throw new Error('Invalid API secret');
// 	}

// 	loggerDeposits.verbose(
// 		req.uuid,
// 		'controller/notification/handleCurrencyDeposit',
// 		'data_recevied',
// 		req.swagger.params.data.value
// 	);
// 	const domain = req.headers['x-real-origin'];
// 	const currency = req.swagger.params.currency.value;
// 	loggerDeposits.verbose(
// 		req.uuid,
// 		'controller/notification/handleCurrencyDeposit',
// 		'currency',
// 		currency,
// 		domain
// 	);

// 	if (getCurrencies().indexOf(currency) === -1) {
// 		loggerDeposits.error(
// 			req.uuid,
// 			'controller/notification/performDeposit',
// 			'Invalid currency',
// 			currency
// 		);
// 		return res.status(400).json({ message: 'Invalid currency.' });
// 	}

// 	const data = req.swagger.params.data.value;

// 	handler(currency)
// 		.deposit(data)
// 		.then(([deposit, user, userSendEmail]) => {
// 			loggerDeposits.info(
// 				req.uuid,
// 				'controller/notification/handleCurrencyDeposit after_creation',
// 				user.email,
// 				deposit.amount,
// 				currency,
// 				deposit.status,
// 				deposit.transaction_id,
// 				userSendEmail
// 			);
// 			if (userSendEmail) {
// 				sendEmail(
// 					MAILTYPE.DEPOSIT,
// 					user.email,
// 					{
// 						amount: deposit.amount,
// 						currency: currency,
// 						status: deposit.status,
// 						address: deposit.address,
// 						transaction_id: deposit.transaction_id,
// 						phoneNumber: user.phone_number
// 					},
// 					user.settings,
// 					domain
// 				);
// 			}
// 			res.json({ message: 'Success' });
// 		})
// 		.catch((err) => {
// 			loggerDeposits.error(
// 				req.uuid,
// 				'controller/transaction/handleCurrencyDeposit',
// 				err
// 			);
// 			res.status(400).json({ message: `Fail - ${err.message}` });
// 		});
// };

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

const performWithdraw = (req, res) => {
	loggerDeposits.verbose(
		req.uuid,
		'controller/withdrawals/performWithdraw body',
		req.swagger.params.data.value
	);

	const { token } = req.swagger.params.data.value;
	const domain = req.headers['x-real-origin'];

	loggerDeposits.verbose(
		req.uuid,
		'controller/withdrawals/performWithdraw parsed_params',
		token
	);

	toolsLib.transaction.validateWithdrawalToken(token)
		.then((withdrawal) => {
			// todo
		// 	let { currency, address } = withdrawal;
		// 	return all([
		// 		findUserByCryptoAddress(currency, address),
		// 		findUser({
		// 			where: { id: withdrawal.user_id },
		// 			attributes: ['crypto_wallet', 'verification_level']
		// 		}),
		// 		withdrawal
		// 	]);
		// })
		// .then(([ receiver, sender, deposit ]) => {
		// 	if (sender.verification_level < 1) {
		// 		throw new Error('Upgrade verification level');
		// 	}
		// 	let transactionPromise;
		// 	if (!receiver) {
		// 		loggerWithdraws.debug(
		// 			req.uuid,
		// 			'controller/withdrawals/performWithdraw',
		// 			deposit.currency,
		// 			'external_transfer',
		// 			deposit.address
		// 		);
		// 		// External transaction
		// 		transactionPromise = performExternalTransaction(
		// 			deposit.currency,
		// 			req.uuid,
		// 			deposit.email,
		// 			deposit.address,
		// 			deposit.amount,
		// 			deposit.fee
		// 		);
		// 	} else {
		// 		// internal transaction
		// 		loggerWithdraws.debug(
		// 			req.uuid,
		// 			'controller/withdrawals/performWithdraw',
		// 			deposit.currency,
		// 			'internal_transfer',
		// 			deposit.address
		// 		);
		// 		transactionPromise = performIntenalTransaction(
		// 			deposit.currency,
		// 			req.uuid,
		// 			deposit.email,
		// 			receiver,
		// 			deposit.amount,
		// 			domain
		// 		);
		// 	}
		// 	return transactionPromise;
		// })
		// .then((userDeposit) => {
		// 	loggerWithdraws.debug(
		// 		req.uuid,
		// 		'controller/withdrawals/performWithdraw',
		// 		'user_deposit',
		// 		userDeposit
		// 	);
		// 	const responseObject = {
		// 		message: 'Withdrawal successfull'
		// 	};
		// 	if (userDeposit.fee === 0) {
		// 		responseObject.fee = 'Fee was not applied';
		// 	}
		// 	responseObject.transaction_id = userDeposit.transaction_id;

		// 	loggerWithdraws.debug(
		// 		req.uuid,
		// 		'controller/withdrawals/performWithdraw',
		// 		'response_object',
		// 		responseObject
		// 	);
		// 	res.json(responseObject);
		// })
		// .catch((err) => {
		// 	loggerWithdraws.error(
		// 		req.uuid,
		// 		'controller/withdrawals/performWithdraw error_data',
		// 		err.code,
		// 		err.message
		// 	);
		// 	res.status(400).json({ message: err.message });
		});
};

module.exports = {
	// handleCurrencyDeposit,
	requestWithdrawal,
	getWithdrawalFee
};
