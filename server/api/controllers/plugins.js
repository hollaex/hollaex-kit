'use strict';

const {
	AVAILABLE_PLUGINS,
	GET_CONFIGURATION,
	REQUIRED_XHT
} = require('../../constants');
const { Balance } = require('../../db/models');
const { findUser, getUserValuesByEmail } = require('../helpers/user');
const { loggerPlugin } = require('../../config/logger');
const { addBankAccount, rejectBankAccount } = require('../../plugins/bank/helpers');
const { DEFAULT_REJECTION_NOTE } = require('../../messages');

const getPlugins = (req, res) => {
	try {
		const response = {
			available: AVAILABLE_PLUGINS,
			...GET_CONFIGURATION().constants.plugins
		}
		res.json(response);
	} catch (err) {
		loggerPlugin.error(req.uuid, 'controllers/plugins/getPlugins err', err);
		res.status(err.status || 400).json({ message: err.message });
	}
};

// XHT_FEE
const activateXhtFee = (req, res) => {
	const { email, id } = req.auth.sub;

	loggerPlugin.verbose(
		req.uuid,
		'controllers/plugins/activateXhtFee auth',
		id,
		email
	);

	findUser({
		where: { id },
		include: [
			{
				model: Balance,
				as: 'balance',
				attributes: {
					exclude: ['id', 'user_id', 'created_at']
				}
			}
		]
	})
		.then((user) => {
			if (user.custom_fee) {
				throw new Error('XHT fee is already activated');
			}
			if (user.balance_xht < REQUIRED_XHT) {
				throw new Error('Require minimum 100 XHT in your wallet for activating this service');
			}
			return user.update({ custom_fee: true }, { fields: ['custom_fee'], returning: true });
		})
		.then((user) => {
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerPlugin.error(req.uuid, 'controllers/plugins/activateXhtFee err', err);
			res.status(400).json({ message: err.message });
		});
};

// BANK
const postBankUser = (req, res) => {
	const { email } = req.auth.sub;
	const bank_account = req.swagger.params.data.value;

	loggerPlugin.verbose(
		req.uuid,
		'controllers/plugins/postBankUser auth',
		email
	);

	findUser({
		where: { email }
	})
		.then(addBankAccount(bank_account))
		.then(() => getUserValuesByEmail(email))
		.then((user) => res.json(user.bank_account))
		.catch((err) => {
			loggerPlugin.error(req.uuid, 'controllers/plugins/postBankUser err', err);
			res.status(err.status || 400).json({ message: err.message })
		});
};

const postBankAdmin = (req, res) => {
	loggerPlugin.verbose(
		req.uuid,
		'controllers/plugins/postBankAdmin auth',
		req.auth.sub
	);

	const id = req.swagger.params.id.value;
	const { bank_account } = req.swagger.params.data.value;

	loggerPlugin.info(
		req.uuid,
		'controllers/plugins/postBankAdmin params',
		id,
		bank_account
	);

	findUser({
		where: {
			id
		}
	})
		.then(adminAddUserBanks(bank_account))
		.then(() => getUserValuesById(id))
		.then((user) => res.json(user.bank_account))
		.catch((error) => {
			loggerPlugin.error(req.uuid, 'controllers/plugins/postBankAdmin err', err);
			res.status(error.status || 400).json({ message: error.message })
		});
};

const bankVerify = (req, res) => {
	loggerPlugin.verbose(
		req.uuid,
		'controllers/plugins/bankVerify auth',
		req.auth.sub
	);

	const { user_id, bank_id } = req.swagger.params.data.value;

	loggerPlugin.info(
		req.uuid,
		'controllers/plugins/bankVerify params',
		'user_id',
		user_id,
		'bank_id',
		bank_id
	);

	findUser({
		where: {
			id: user_id
		},
		attributes: ['id', 'bank_account']
	})
		.then((user) => {
			if (!user) throw new Error(USER_NOT_FOUND);
			return approveBankAccount(bank_id)(user);
		})
		.then((user) => {
			const data = {};
			data.bank_account = user.bank_account;
			loggerPlugin.debug(
				req.uuid,
				'controllers/plugins/bankVerify data',
				data
			);
			res.json(data);
		})
		.catch((err) => {
			loggerPlugin.error(req.uuid, 'controllers/plugins/bankVerify err', err);
			res.status(err.status || 400).json({ message: err.message });
		});
};

const bankRevoke = (req, res) => {
	loggerPlugin.verbose(
		req.uuid,
		'controllers/plugins/bankRevoke auth',
		req.auth.sub
	);

	const { user_id, bank_id } = req.swagger.params.data.value;
	let { message } = req.swagger.params.data.value || DEFAULT_REJECTION_NOTE;

	loggerPlugin.info(
		req.uuid,
		'controllers/plugins/bankRevoke params',
		'user_id',
		user_id,
		'bank_id',
		bank_id,
		'message',
		message
	);

	findUser({
		where: {
			id: user_id
		},
		attributes: ['id', 'bank_account', 'bank_account', 'settings']
	})
		.then((user) => {
			if (!user) throw new Error(USER_NOT_FOUND);
			return rejectBankAccount(bank_id)(user);
		})
		.then((user) => {
			const { email, bank_account } = user.dataValues;
			const emailData = { type: 'bank', message };
			const data = {};
			data.bank_account = bank_account;
			sendEmail(
				MAILTYPE.USER_VERIFICATION_REJECT,
				email,
				emailData,
				user.settings
			);
			loggerPlugin.debug(
				req.uuid,
				'controllers/plugins/bankRevoke data',
				data
			);
			res.json(data);
		})
		.catch((err) => {
			loggerPlugin.error(req.uuid, 'controllers/plugins/bankRevoke err', err);
			res.status(err.status || 400).json({ message: err.message });
		});
};

module.exports = {
	getPlugins,
	activateXhtFee,
	postBankUser,
	postBankAdmin,
	bankVerify,
	bankRevoke
};