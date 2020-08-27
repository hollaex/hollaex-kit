'use strict';

const crypto = require('crypto');
const { pick, each } = require('lodash');
const {
	VERIFY_STATUS,
	ROLES,
	USER_FIELD_ADMIN_LOG,
	ID_FIELDS,
	ADDRESS_FIELDS
} = require('../../constants');
const {
	USER_NOT_FOUND,
	MAX_BANKS_EXCEEDED,
	ERROR_CHANGE_USER_INFO
} = require('../../message');

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
		);
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

const updateUserData = (
	{ id_data = {}, ...rest },
	role = ROLES.USER
) => (user, options = {}) => {
	const updateData = {
		...rest
	};
	if (Object.keys(id_data).length > 0) {
		if (role === ROLES.USER) {
			if (user.dataValues.status === VERIFY_STATUS.COMPLETED) {
				throw new Error(ERROR_CHANGE_USER_INFO);
			} else {
				updateData.id_data = id_data;
				updateData.id_data.status = VERIFY_STATUS.PENDING;
			}
		} else {
			updateData.id_data = id_data;
		}
	}
	if (
		updateData.full_name ||
		updateData.gender ||
		updateData.dob ||
		updateData.address ||
		updateData.nationality
	) {
		if (user.dataValues.id_data === VERIFY_STATUS.COMPLETED) {
			throw new Error(ERROR_CHANGE_USER_INFO);
		}
	}
	// User is not allowed to update his phone number through this. User has to verify phone number through a whole different process
	if (updateData.phone_number && role === ROLES.USER) {
		throw new Error(ERROR_CHANGE_USER_INFO);
	}
	return user.update(updateData, {
		fields: [
			'full_name',
			'gender',
			'nationality',
			'dob',
			'address',
			'phone_number',
			'id_data'
		],
		...options
	});
};

const updateUserPhoneNumber = (user, phone_number, options = {}) => {
	return user.update(
		{ phone_number },
		{ fields: ['phone_number'], ...options }
	);
};

const userUpdateLog = (user_id, prevData = {}, newData = {}) => {
	let description = {
		user_id,
		note: `Change in user ${user_id} information`,
		old: {},
		new: {}
	};
	for (const key in newData) {
		if (USER_FIELD_ADMIN_LOG.includes(key)) {
			let prevRecord = prevData[key] || 'empty';
			let newRecord = newData[key] || 'empty';
			if (key === 'bank_account') {
				description = bankComparison(
					prevData.bank_account,
					newData.bank_account,
					description
				);
			} else if (key === 'id_data') {
				ID_FIELDS.forEach((field) => {
					if (newRecord[field] != prevRecord[field]) {
						description.old[field] = prevRecord[field];
						description.new[field] = newRecord[field];
					}
				});
			} else if (key === 'address') {
				ADDRESS_FIELDS.forEach((field) => {
					if (prevRecord[field] != newRecord[field]) {
						description.old[field] = prevRecord[field];
						description.new[field] = newRecord[field];
					}
				});
			} else {
				if (prevRecord.toString() != newRecord.toString()) {
					description.old[key] = prevRecord;
					description.new[key] = newRecord;
				}
			}
		}
	}
	return description;
};

module.exports = {
	addBankAccount,
	approveBankAccount,
	adminAddUserBanks,
	rejectBankAccount,
	updateUserData,
	updateUserPhoneNumber,
	userUpdateLog
};
