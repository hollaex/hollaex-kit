'use strict';

const { loggerFiat } = require('../../config/logger');
const toolsLib = require('hollaex-tools-lib');

const createDepositRequest = (req, res) => {
	loggerFiat.verbose(
		req.uuid,
		'controllers/fiat/createDepositRequest auth',
		req.auth
	);

	const ip = req.headers['x-real-ip'];
	const userId = req.auth.sub.id;

	const {
		amount,
		transaction_id,
		currency,
		address
	} = req.swagger.params.data.value;

	loggerFiat.verbose(
		req.uuid,
		'controllers/fiat/createDepositRequest data',
		ip,
		amount,
		transaction_id,
		currency,
		address,
		userId
	);

	toolsLib.user.getUserByKitId(userId)
		.then(async (user) => {
			if (!user) {
				throw new Error('User not found');
			}
			
			const { fee } = toolsLib.wallet.validateDeposit(user, amount, currency, 'fiat');

			const { count: depositCount } = await toolsLib.wallet.getUserDepositsByKitId(
				userId,
				currency,
				false,
				false,
				false,
				false,
				false
			);

			if (depositCount > 3) {
				throw new Error('You already have 3 pending deposits. Please wait for them to be processed before creating new deposit.');
			}

			// if (toolsLib.getKitConfig().onramp[currency] && toolsLib.getKitConfig().onramp[currency][address]) {
			// 	console.log(toolsLib.getKitConfig().onramp[currency][address].data);
			// }

			return toolsLib.wallet.mintAssetByKitId(
				userId,
				currency,
				amount,
				{
					description: `Pending ${currency.toUpperCase()} deposit for username: ${user.username}`,
					transactionId: transaction_id,
					address,
					status: false,
					fee
				}
			);
		})
		.then((deposit) => {
			loggerFiat.verbose(
				req.uuid,
				'controllers/fiat/createDepositRequest then',
				'Pending mint created',
				'transaction_id:',
				deposit.transaction_id,
				'amount:',
				deposit.amount,
				'fee:',
				deposit.fee
			);

			return res.json(deposit);
		})
		.catch((err) => {
			loggerFiat.error(
				req.uuid,
				'controllers/fiat/createDepositRequest catch',
				err.message
			);
			return res.status(400).json({ message: err.message });
		});

};

const createWithdrawalRequest = (req, res) => {
	loggerFiat.verbose(
		req.uuid,
		'controllers/fiat/createWithdrawalRequest auth',
		req.auth
	);

	const ip = req.headers['x-real-ip'];
	const userId = req.auth.sub.id;

	const {
		amount,
		bank_id,
		currency
	} = req.swagger.params.data.value;

	loggerFiat.verbose(
		req.uuid,
		'controllers/fiat/createWithdrawalRequest data',
		ip,
		amount,
		bank_id,
		currency,
		userId
	);

	toolsLib.user.getUserByKitId(userId)
		.then(async (user) => {
			if (!user) {
				throw new Error('User not found');
			}

			const bank = user.bank_account.find((bank) => {
				return bank.id === bank_id;
			});

			if (!bank) {
				throw new Error('The selected payment option is not registered');
			}

			const { count: withdrawalCount } = await toolsLib.wallet.getUserWithdrawalsByKitId(
				userId,
				currency,
				false,
				false,
				false,
				false,
				false
			);

			if (withdrawalCount > 3) {
				throw new Error('You already have 3 pending withdrawals. Please wait for them to be processed before creating new withdrawals.');
			}

			// fee_coin is always the same as currency in fiat
			const { fee } = await toolsLib.wallet.validateWithdrawal(user, bank_id, amount, currency, 'fiat');
			
			let bankFormat = '';

			Object.keys(bank).forEach((key, i) => {
				if (key !== 'id' && key !== 'status' && bank[key] && bank[key] != undefined) {
					bankFormat += `${key}: ${bank[key]}`;
					if (i !== Object.keys(bank).length - 1) {
						bankFormat += ' - ';
					}
				}
			});

			return toolsLib.wallet.burnAssetByKitId(
				userId,
				currency,
				amount,
				{
					description: `withdrawal to ${bankFormat}`,
					transactionId: req.uuid,
					address: bank_id,
					status: false,
					fee
				}
			);
		})
		.then((deposit) => {
			loggerFiat.verbose(
				req.uuid,
				'controllers/fiat/createDepositRequest then',
				'Pending mint created',
				'transaction_id:',
				deposit.transaction_id,
				'amount:',
				deposit.amount,
				'fee:',
				deposit.fee
			);

			return res.json(deposit);
		})
		.catch((err) => {
			loggerFiat.error(
				req.uuid,
				'controllers/fiat/createDepositRequest catch',
				err.message
			);
			return res.status(400).json({ message: err.message });
		});
};

module.exports = {
	createDepositRequest,
	createWithdrawalRequest
};