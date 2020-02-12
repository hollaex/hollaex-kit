'use strict';

const crypto = require('crypto');
const { pick, each } = require('lodash');
const { VERIFY_STATUS } = require('../constants');
const { USER_NOT_FOUND, MAX_BANKS_EXCEEDED } = require('./messages');

const addBankAccount = (bank_account = {}) => (user, options = {}) => {
	if (!user) {
		throw new Error(USER_NOT_FOUND);
	} else if (user.dataValues.bank_account.length >= 3) {
		throw new Error(MAX_BANKS_EXCEEDED);
	}

	bank_account = pick(
		bank_account,
		'bank_name',
		'card_number',
		'account_number'
	);

	bank_account.id = crypto.randomBytes(10).toString('hex');
	bank_account.status = VERIFY_STATUS.PENDING;

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

const adminAddUserBanks = (bank_accounts = []) => (user, options = {}) => {
	if (!user) {
		throw new Error(USER_NOT_FOUND);
	} else if (bank_accounts.length > 3) {
		throw new Error (MAX_BANKS_EXCEEDED);
	}

	each(bank_accounts, (bank) => {
		bank.id = crypto.randomBytes(10).toString('hex');
		bank.status = VERIFY_STATUS.COMPLETED;
		bank = pick(
			bank,
			'id',
			'status',
			'bank_name',
			'card_number',
			'account_number'
		)
	});

	return user.update(
		{ bank_account: bank_accounts },
		{
			fields: ['bank_account'],
			...options
		}
	);
};

const approveBankAccount = (id = 0) => (user, options = {}) => {
	const banks = user.dataValues.bank_account.map((bank) => {
		if (bank.id === id) {
			bank.status = VERIFY_STATUS.COMPLETED;
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
	adminAddUserBanks,
	rejectBankAccount,
};