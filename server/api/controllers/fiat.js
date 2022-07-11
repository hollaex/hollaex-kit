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
		currency
	} = req.swagger.params.data.value;

	loggerFiat.verbose(
		req.uuid,
		'controllers/fiat/createDepositRequest data',
		ip,
		amount,
		transaction_id,
		currency,
		userId
	);

	// TODO check TX amount range


	toolsLib.user.getUserByKitId(userId)
		.then(async (user) => {
			if (!user) {
				throw new Error('User not found');
			}

			// TODO CHECK TRANASCTION ID TO BE UNIQUE
			// await validateTxid(transaction_id);
			// CHECK DEPOSIT FEE
			let fee = 0;

			return toolsLib.wallet.mintAssetByKitId(
				userId,
				currency,
				amount,
				{
					description: `Pending deposit created with ${currency.toUpperCase()} for username: ${user.username}`,
					transactionId: transaction_id,
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
		transaction_id,
		currency
	} = req.swagger.params.data.value;

	loggerFiat.verbose(
		req.uuid,
		'controllers/fiat/createWithdrawalRequest data',
		ip,
		amount,
		transaction_id,
		currency,
		userId
	);

	// TODO

	return res.status(400).json({ message: 'Under construction' });

};

module.exports = {
	createDepositRequest,
	createWithdrawalRequest
};