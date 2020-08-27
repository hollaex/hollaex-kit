'use strict';

const {
	AVAILABLE_PLUGINS,
	GET_CONFIGURATION,
	REQUIRED_XHT,
	ROLES
} = require('../../constants');
const { Balance, sequelize } = require('../../db/models');
const { findUser, getUserValuesByEmail, getUserValuesById } = require('../helpers/user');
const { loggerPlugin } = require('../../config/logger');
const {
	addBankAccount,
	rejectBankAccount,
	approveBankAccount,
	adminAddUserBanks,
	updateUserData,
	updateUserPhoneNumber,
	userUpdateLog,
	getType,
	storeFilesDataOnDb,
	uploadFile,
	getImagesData,
	findUserImages
} = require('../helpers/plugins');
const {
	DEFAULT_REJECTION_NOTE,
	USER_NOT_FOUND,
	SMS_INVALID_PHONE
} = require('../../messages');
const { sendEmail } = require('../../mail');
const { MAILTYPE } = require('../../mail/strings');
const PhoneNumber = require('awesome-phonenumber');
const { omit, cloneDeep, has } = require('lodash');
const { all } = require('bluebird');
const { createAudit } = require('../helpers/audit');
const { validMimeType } = require('../../plugins/kyc/helpers');

const getPlugins = (req, res) => {
	try {
		const response = {
			available: AVAILABLE_PLUGINS,
			...GET_CONFIGURATION().constants.plugins
		};
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
			return user.update({ custom_fee: true }, { fields: ['custom_fee'] });
		})
		.then(() => {
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
			res.status(err.status || 400).json({ message: err.message });
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
		.catch((err) => {
			loggerPlugin.error(req.uuid, 'controllers/plugins/postBankAdmin err', err);
			res.status(err.status || 400).json({ message: err.message });
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

const putKycUser = (req, res) => {
	loggerPlugin.verbose(
		req.uuid,
		'controllers/plugins/putKycUser auth',
		req.auth.sub
	);

	const newData = req.swagger.params.data.value;
	const { email } = req.auth.sub;

	findUser({
		where: { email },
		attributes: {
			exclude: [
				'password',
				'created_at',
				'updated_at',
				'email',
				'balance',
				'crypto_wallet',
				'verification_level',
				'otp_enabled',
				'is_admin',
				'is_supervisor',
				'is_support',
				'is_kyc',
				'is_tech',
				'flagged',
				'affiliation_code'
			]
		}
	})
		.then(updateUserData(newData, ROLES.USER))
		.then(() => getUserValuesByEmail(email))
		.then((user) => res.json(user))
		.catch((err) => {
			loggerPlugin.error(req.uuid, 'controllers/plugins/putKycUser err', err);
			res.status(err.status || 400).json({ message: err.message });
		});
};

const putKycAdmin = (req, res) => {
	loggerPlugin.verbose(
		req.uuid,
		'controllers/plugins/putKycAdmin auth',
		req.auth.sub
	);

	const ip = req.headers['x-real-ip'];
	const domain = req.headers['x-real-origin'];
	const admin_id = req.auth.sub.id;
	const id = req.swagger.params.user_id.value;
	const data = req.swagger.params.data.value;

	const REMOVE_PROPS = [
		'id_data',
		'bank_account',
		'crypto_wallet',
		'verification_level',
		'otp_enabled',
		'activated',
		'username',
		'settings'
	];

	REMOVE_PROPS.forEach((key) => {
		if (has(data, key)) {
			delete data[key];
		}
	});

	let phoneNumber;
	if (data.phone_number) {
		phoneNumber = new PhoneNumber(data.phone_number);
		if (data.phone_number && !phoneNumber.isValid()) {
			loggerPlugin.error(
				req.uuid,
				'controllers/plugins/putKycAdmin err',
				SMS_INVALID_PHONE
			);
			return res.status(400).json({ message: SMS_INVALID_PHONE });
		}
	}

	sequelize
		.transaction((transaction) => {
			const options = { transaction, returning: true };
			let prevUserData = {}; // for audit
			return findUser({ where: { id } })
				.then((user) => {
					prevUserData = cloneDeep(user.dataValues);
					loggerPlugin.debug(
						req.uuid,
						'controllers/plugins/putKycAdmin user',
						prevUserData
					);
					return updateUserData(data, ROLES.SUPPORT)(user, options);
				})
				.then((user) => {
					loggerPlugin.debug(
						req.uuid,
						'controllers/plugins/putKycAdmin user then',
						user.dataValues,
						user.previous('bank_account')
					);
					if (data.phone_number) {
						return updateUserPhoneNumber(
							user,
							phoneNumber.getNumber(),
							options
						);
					}
					return user;
				})
				.then((user) => {
					loggerPlugin.debug(
						req.uuid,
						'controllers/plugins/putKycAdmin user then then',
						prevUserData.dataValues,
						user
					);
					const description = userUpdateLog(
						user.id,
						prevUserData,
						user.dataValues
					);
					return all([
						user,
						createAudit(admin_id, 'userUpdate', description, ip, domain)
					]);
				});
		})
		.then(([user, audit]) => {
			loggerPlugin.info(
				req.uuid,
				'controllers/plugins/putKycAdmin user_end audit',
				user.dataValues,
				audit
			);
			user = omit(user.dataValues, [
				'password',
				'is_admin',
				'is_support',
				'is_kyc',
				'is_supervisor'
			]);
			res.json(user);
		})
		.catch((err) => {
			loggerPlugin.error(
				req.uuid,
				'controllers/plugins/putKycAdmin err',
				err.messsage
			);
			res.status(err.status || 400).json({ message: err.message });
		});
};

const kycUserUpload = (req, res) => {
	loggerPlugin.verbose(
		req.uuid,
		'controllers/plugins/kycUserUpload auth',
		req.auth.sub
	);

	const { id, email } = req.auth.sub;
	let { front, back, proof_of_residency, ...otherData } = req.swagger.params;

	let invalidType = '';
	if (!validMimeType(front.value.mimetype)) {
		invalidType = 'front';
	} else if (back && !validMimeType(back.value.mimetype)) {
		invalidType = 'back';
	} else if (
		proof_of_residency &&
		!validMimeType(proof_of_residency.value.mimetype)
	) {
		invalidType = 'proof_of_residency';
	}
	if (invalidType) {
		loggerPlugin.error(req.uuid, 'controllers/plugins/kycUserUpload invalid', invalidType);
		return res.status(400).json({ message: `Invalid type: ${invalidType} field.` });
	}

	const data = { id_data: {} };

	Object.entries(otherData).forEach(([key, field]) => {
		if (field) {
			if (
				key === 'type' ||
				key === 'number' ||
				key === 'issued_date' ||
				key === 'expiration_date'
			) {
				data.id_data[key] = field;
			}
		}
	});

	const ts = Date.now();

	findUser({
		where: {
			id
		},
		attributes: [
			'id',
			'id_data'
		]
	})
		.then((user) => {
			let { status } = user.dataValues.id_data || 0;
			if (status === 3) {
				throw new Error(
					'You are not allowed to upload a document while its pending or approved.'
				);
			}
			return all([
				uploadFile(
					`${id}/${ts}-front.${getType(front.value.mimetype)}`,
					front.value
				),
				back.value
					? uploadFile(
						`${id}/${ts}-back.${getType(back.value.mimetype)}`,
						back.value
					)
					: undefined,
				proof_of_residency.value
					? uploadFile(
						`${id}/${ts}-proof_of_residency.${getType(
							proof_of_residency.value.mimetype
						)}`,
						proof_of_residency.value
					)
					: undefined
			]);
		})
		.then((results) => {
			loggerPlugin.verbose(req.uuid, 'controllers/plugins/kycUserUpload results', results);
			return storeFilesDataOnDb(
				id,
				data,
				results[0].Location,
				results[1] ? results[1].Location : '',
				results[2] ? results[2].Location : ''
			);
		})
		.then(() => {
			loggerPlugin.verbose(req.uuid, 'controllers/plugins/kycUserUpload then');
			sendEmail(MAILTYPE.USER_VERIFICATION, email, {}, {});
			res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerPlugin.error(req.uuid, 'controllers/plugins/kycUserUpload error', err);
			res.status(400).json({ message: err.message });
		});
};

const kycAdminUpload = (req, res) => {
	loggerPlugin.verbose(
		req.uuid,
		'controllers/plugins/kycAdminUpload auth',
		req.auth.sub
	);

	const { user_id } = req.swagger.params.user_id.value;
	let { front, back, proof_of_residency, ...otherData } = req.swagger.params;

	loggerPlugin.verbose(
		req.uuid,
		'controllers/plugins/kycAdminUpload user_id',
		user_id
	);

	if (
		!front.value &&
		!back.value &&
		!proof_of_residency.value &&
		Object.keys(otherData).length === 0
	) {
		loggerPlugin.error(req.uuid, 'controllers/plugins/kycAdminUpload Missing Fields');
		return res.status(400).json({ message: 'Missing fields' });
	}

	let invalidType = '';
	if (!validMimeType(front.value.mimetype)) {
		invalidType = 'front';
	} else if (back && !validMimeType(back.value.mimetype)) {
		invalidType = 'back';
	} else if (
		proof_of_residency &&
		!validMimeType(proof_of_residency.value.mimetype)
	) {
		invalidType = 'proof_of_residency';
	}
	if (invalidType) {
		loggerPlugin.error(req.uuid, 'controllers/plugins/kycAdminUpload invalid', invalidType);
		return res.status(400).json({ message: `Invalid type: ${invalidType} field.` });
	}

	const data = { id_data: { provided: true } };

	Object.entries(otherData).forEach(([key, field]) => {
		if (field) {
			if (
				key === 'type' ||
				key === 'number' ||
				key === 'issued_date' ||
				key === 'expiration_date'
			) {
				data.id_data[key] = field;
			}
		}
	});

	const ts = Date.now();

	findUser({
		where: {
			id: user_id
		},
		attributes: [
			'id'
		]
	})
		.then((user) => getImagesData(user.id, 'admin'))
		.then((data) => {
			return all([
				front.value
					? uploadFile(
						`${id}/${ts}-front.${getType(front.value.mimetype)}`,
						front.value
					)
					: { Location: data.front },
				back.value
					? uploadFile(
						`${id}/${ts}-back.${getType(back.value.mimetype)}`,
						back.value
					)
					: { Location: data.back },
				proof_of_residency.value
					? uploadFile(
						`${id}/${ts}-proof_of_residency.${getType(
							proof_of_residency.value.mimetype
						)}`,
						proof_of_residency.value
					)
					: { Location: data.proof_of_residency }
			]);
		})
		.then((results) => {
			return storeFilesDataOnDb(
				user_id,
				data,
				results[0] ? results[0].Location : '',
				results[1] ? results[1].Location : '',
				results[2] ? results[2].Location : ''
			);
		})
		.then(() => {
			return findUserImages({ id: user_id });
		})
		.then((data) => {
			loggerPlugin.debug(req.uuid, 'controllers/plugins/kycAdminUpload then', data);
			res.json({ message: 'Success', data });
		})
		.catch((err) => {
			console.log(err);
			loggerPlugin.error(req.uuid, 'controllers/plugins/kycAdminUpload err', err.message);
			res.status(400).json({ message: err.message });
		});
};

module.exports = {
	getPlugins,
	activateXhtFee,
	postBankUser,
	postBankAdmin,
	bankVerify,
	bankRevoke,
	putKycUser,
	putKycAdmin,
	kycUserUpload,
	kycAdminUpload
};
