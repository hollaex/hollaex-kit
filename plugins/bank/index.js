'use strict';

const app = require('../index');
const { verifyToken, checkScopes } = require('../helpers/auth');
const { findUser, getUserValuesById, getUserValuesByEmail } = require('../helpers/user');
const { addBankAccount, adminAddUserBanks, approveBankAccount, rejectBankAccount, VERIFY_ATTR } = require('./helpers');
const bodyParser = require('body-parser');

app.post('/plugins/bank/user', [verifyToken, bodyParser.json()], (req, res) => {
	const endpointScopes = ['user'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

	const email = req.auth.sub.email;
	const { bank_account } = req.body;

	findUser({
		where: { email }
	})
		.then(addBankAccount(bank_account))
		.then(() => getUserValuesByEmail(email))
		.then((user) => res.json(user['bank_account']))
		.catch((error) => {
			res.status(error.status || 400).json({ message: error.message })
		})
});

app.post('/plugins/bank/admin', [verifyToken, bodyParser.json()], (req, res) => {
	const endpointScopes = ['admin', 'supervisor', 'support', 'kyc'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

	const { user_id, bank_accounts } = req.body;

	findUser({
		where: {
			id: user_id
		}
	})
		.then(adminAddUserBanks(bank_accounts))
		.then(() => getUserValuesById(user_id))
		.then((user) => res.json(user['bank_account']))
		.catch((error) => {
			res.status(error.status || 400).json({ message: error.message })
		});
});

app.post('/plugins/bank/verify', [verifyToken, bodyParser.json()], (req, res) => {
	const endpointScopes = ['admin', 'supervisor', 'support', 'kyc'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

	const { user_id, bank_id } = req.body;

	findUser({
		where: {
			id: user_id
		},
		attributes: VERIFY_ATTR
	})
		.then((user) => {
			if (!user) throw new Error('User not found.');
			return approveBankAccount(bank_id)(user);
		})
		.then((user) => {
			const data = {};
			data.bank_account = user.bank_account;
			res.json(data);
		})
		.catch((err) => {
			res.status(err.status || 400).json({ message: err.message });
		});
});

app.post('/plugins/bank/revoke', [verifyToken, bodyParser.json()], (req, res) => {
	const endpointScopes = ['admin', 'supervisor', 'support', 'kyc'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

	const { user_id, bank_id } = req.body;
	let { message } = req.body || DEFAULT_REJECTION_NOTE;

	findUser({
		where: {
			id: user_id
		},
		attributes: VERIFY_ATTR
	})
		.then((user) => {
			if (!user) throw new Error('User not found.');
			return rejectBankAccount(bank_id)(user);
		})
		.then((user) => {
			const { email, bank_account } = user.dataValues;
			const emailData = { type: 'bank', message };
			const data = {};
			data.bank_account = bank_account;
			res.json(data);
		})
		.catch((err) => {
			res.status(err.status || 400).json({ message: err.message });
		});
});