'use strict';

const crypto = require('crypto');
const { pick } = require('lodash');

const EMPTY_STATUS = 0;
const PENDING_STATUS = 1;
const REJECTED_STATUS = 2;
const COMPLETED_STATUS = 3;

const VERIFY_ATTR = [
	'id',
	'email',
	'verification_level',
	'id_data',
	'bank_account',
	'settings'
];

const addBankAccount = (bank_account = {}) => (user, options = {}) => {
	if (user.dataValues.bank_account.length >= 3) {
		throw new Error('Too many banks');
	}

	bank_account = pick(
		bank_account,
		'bank_name',
		'card_number',
		'account_number'
	);

	bank_account.id = crypto.randomBytes(10).toString('hex');
	bank_account.status = false;

	let newBank = user.dataValues.bank_account;
	newBank.push(bank_account);

	return user.update(
		{ bank_account: newBank },
		{
			fields: ['bank_account'],
			...options
		}
	);
};

const approveBankAccount = (id = 0) => (user, options = {}) => {
	const banks = user.dataValues.bank_account.map((bank) => {
		if (bank.id === id) {
			bank.status = COMPLETED_STATUS;
		}
		return bank;
	});

	return user.update(
		{ bank_account: banks },
		{
			fields: ['bank_account'],
			...options
		}
	);
};

const rejectBankAccount = (id = 0) => (user, options = {}) => {
	const newBanks = user.bank_account.filter((bank) => bank.id !== id);

	return user.update(
		{ bank_account: newBanks },
		{
			fields: ['bank_account'],
			...options
		}
	);
};

module.exports = {
	addBankAccount,
	approveBankAccount,
	rejectBankAccount
};