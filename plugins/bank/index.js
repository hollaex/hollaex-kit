'use strict';

const app = require('../index');
const { verifyToken, checkScopes, findUser, getUserValuesByEmail } = require('../common');
const { addBankAccount, approveBankAccount, rejectBankAccount} = require('./helpers');
const bodyParser = require('body-parser');

app.post('/plugins/bank', [verifyToken, bodyParser.json()], (req, res) => {
	const endpointScopes = ['user'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

	const email = req.auth.sub.email;
	const bank = req.body;

	findUser({
		where: { email }
	})
		.then(addBankAccount(bank))
		.then(() => getUserValuesByEmail(email))
		.then((user) => res.json(user['bank_account']))
		.catch((error) => {
			res.status(error.status || 400).json({ message: error.message })
		})
});

app.post('/plugins/admin/bank', [verifyToken, bodyParser.json()], (req, res) => {
	const admin_id = req.auth.sub.id;
	const ip = req.headers['x-real-ip'];
	const domain = req.headers['x-real-or']
})

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

	const { user_id, bank_id } = req.swagger.params.data.value;
	let { message } = req.swagger.params.data.value || DEFAULT_REJECTION_NOTE;

	findUser({
		where: {
			id: user_id
		},
		attributes: VERIFY_ATTR
	})
		.then((user) => {
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