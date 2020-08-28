'use strict';

const {
	AVAILABLE_PLUGINS,
	REQUIRED_XHT,
	ROLES
} = require('../../constants');
const { getKit } = require('../../init');
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
	findUserImages,
	validMimeType,
	approveDocuments,
	revokeDocuments,
	createAnnouncement,
	findAnnouncement,
	destroyAnnouncement,
	getAllAnnouncements,
	sendSMS,
	storeSMSCode,
	checkSMSCode,
	deleteSMSCode,
	updatePluginConfiguration
} = require('../helpers/plugins');
const { getTimeframe, getPagination, getOrdering } = require('../helpers/general');
const {
	DEFAULT_REJECTION_NOTE,
	USER_NOT_FOUND,
	SMS_INVALID_PHONE,
	ID_EMAIL_REQUIRED,
	SMS_SUCCESS,
	PHONE_VERIFIED
} = require('../../messages');
const { sendEmail } = require('../../mail');
const { MAILTYPE, languageFile } = require('../../mail/strings');
const PhoneNumber = require('awesome-phonenumber');
const { omit, cloneDeep, has } = require('lodash');
const { all } = require('bluebird');
const { createAudit } = require('../helpers/audit');
const { generateOtp } = require('../helpers/otp');

const getPlugins = (req, res) => {
	try {
		const response = {
			...getKit().plugins,
			available: AVAILABLE_PLUGINS,
			enabled: getKit().plugins.enabled.split(',')
		};
		return res.json(response);
	} catch (err) {
		loggerPlugin.error(req.uuid, 'controllers/plugins/getPlugins err', err);
		return res.status(err.status || 400).json({ message: err.message });
	}
};

const putPlugins = (req, res) => {
	loggerPlugin.verbose(
		req.uuid,
		'controllers/plugins/putPlugins auth',
		req.auth.sub
	);

	const { plugin, data } = req.swagger.params.data.value;

	loggerPlugin.verbose(
		req.uuid,
		'controllers/plugins/putPlugins plugin',
		plugin
	);

	updatePluginConfiguration(plugin, data)
		.then((data) => {
			res.json(data);
		})
		.catch((err) => {
			loggerPlugin.error(req.uuid, 'controllers/plugins/putPlugins err', err);
			res.status(400).json({ message: err.message });
		});
};

const enablePlugin = (req, res) => {
	loggerPlugin.verbose(
		req.uuid,
		'controllers/plugins/enablePlugin auth',
		req.auth.sub
	);

	const plugin = req.swagger.params.plugin.value;

	loggerPlugin.verbose(
		req.uuid,
		'controllers/plugins/enablePlugin plugin',
		plugin
	);

	updatePluginConfiguration('enable', plugin)
		.then((data) => {
			res.json(data);
		})
		.catch((err) => {
			loggerPlugin.error(req.uuid, 'controllers/plugins/enablePlugin err', err);
			res.status(400).json({ message: err.message });
		});
};

const disablePlugin = (req, res) => {
	loggerPlugin.verbose(
		req.uuid,
		'controllers/plugins/disablePlugin auth',
		req.auth.sub
	);

	const plugin = req.swagger.params.plugin.value;

	loggerPlugin.verbose(
		req.uuid,
		'controllers/plugins/disablePlugin plugin',
		plugin
	);

	updatePluginConfiguration('disable', plugin)
		.then((data) => {
			res.json(data);
		})
		.catch((err) => {
			loggerPlugin.error(req.uuid, 'controllers/plugins/disablePlugin err', err);
			res.status(400).json({ message: err.message });
		});
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
			return res.status(400).json({ message: err.message });
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
			return res.status(err.status || 400).json({ message: err.message });
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
			return res.status(err.status || 400).json({ message: err.message });
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
			return res.json(data);
		})
		.catch((err) => {
			loggerPlugin.error(req.uuid, 'controllers/plugins/bankVerify err', err);
			return res.status(err.status || 400).json({ message: err.message });
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
			return res.json(data);
		})
		.catch((err) => {
			loggerPlugin.error(req.uuid, 'controllers/plugins/bankRevoke err', err);
			return res.status(err.status || 400).json({ message: err.message });
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
			return res.status(err.status || 400).json({ message: err.message });
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
			return res.json(user);
		})
		.catch((err) => {
			loggerPlugin.error(
				req.uuid,
				'controllers/plugins/putKycAdmin err',
				err.message
			);
			return res.status(err.status || 400).json({ message: err.message });
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
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerPlugin.error(req.uuid, 'controllers/plugins/kycUserUpload error', err);
			return res.status(400).json({ message: err.message });
		});
};

const kycAdminUpload = (req, res) => {
	loggerPlugin.verbose(
		req.uuid,
		'controllers/plugins/kycAdminUpload auth',
		req.auth.sub
	);

	const user_id = req.swagger.params.user_id.value;
	let { front, back, proof_of_residency, ...otherData } = req.swagger.params;

	loggerPlugin.info(
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
						`${user_id}/${ts}-front.${getType(front.value.mimetype)}`,
						front.value
					)
					: { Location: data.front },
				back.value
					? uploadFile(
						`${user_id}/${ts}-back.${getType(back.value.mimetype)}`,
						back.value
					)
					: { Location: data.back },
				proof_of_residency.value
					? uploadFile(
						`${user_id}/${ts}-proof_of_residency.${getType(
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
			return res.json({ message: 'Success', data });
		})
		.catch((err) => {
			console.log(err);
			loggerPlugin.error(req.uuid, 'controllers/plugins/kycAdminUpload err', err.message);
			return res.status(400).json({ message: err.message });
		});
};

const getKycId = (req, res) => {
	loggerPlugin.verbose(
		req.uuid,
		'controllers/plugins/getKycId auth',
		req.auth.sub
	);

	const email = req.swagger.params.email.value;
	const id = req.swagger.params.id.value;
	const where = {};
	if (id) {
		where.id = id;
	} else if (email) {
		where.email = email;
	} else {
		loggerPlugin.error(req.uuid, 'controllers/plugins/getKycId', ID_EMAIL_REQUIRED);
		return res.status(400).json({ message: ID_EMAIL_REQUIRED });
	}

	loggerPlugin.info(req.uuid, 'controllers/plugins/getKycId', 'user id', id, 'email', email);

	findUserImages(where)
		.then(({ data }) => {
			return res.json(data);
		})
		.catch((err) => {
			loggerPlugin.error(req.uuid, 'controllers/plugins/getKycId err', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const kycIdVerify = (req, res) => {
	loggerPlugin.verbose(
		req.uuid,
		'controllers/plugins/kycIdVerify auth',
		req.auth.sub
	);

	const { user_id } = req.swagger.params.data.value;

	loggerPlugin.info(
		req.uuid,
		'controllers/plugins/kycIdVerify user_id',
		user_id
	);

	findUser({
		where: {
			id: user_id
		},
		attributes: ['id', 'id_data']
	})
		.then((user) => {
			return approveDocuments(user);
		})
		.then((user) => {
			const data = {};
			data.id_data = user.id_data;
			return res.json(data);
		})
		.catch((err) => {
			loggerPlugin.error(req.uuid, 'controllers/plugins/kycIdVerify err', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const kycIdRevoke = (req, res) => {
	loggerPlugin.verbose(
		req.uuid,
		'controllers/plugins/kycIdRevoke auth',
		req.auth.sub
	);

	const { user_id } = req.swagger.params.data.value;
	let { message } = req.swagger.params.data.value || DEFAULT_REJECTION_NOTE;

	loggerPlugin.info(
		req.uuid,
		'controllers/plugins/kycIdRevoke user_id',
		user_id,
		'message',
		message
	);

	findUser({
		where: {
			id: user_id
		},
		attributes: ['id', 'id_data', 'email', 'settings']
	})
		.then((user) => {
			return revokeDocuments(user, message);
		})
		.then((user) => {
			const { email } = user.dataValues;
			const emailData = { type: 'id', message };
			const data = {};
			data.id_data = user.id_data;
			sendEmail(
				MAILTYPE.USER_VERIFICATION_REJECT,
				email,
				emailData,
				user.settings
			);
			return res.json(data);
		})
		.catch((err) => {
			loggerPlugin.error(req.uuid, 'controllers/plugins/kycIdRevoke err', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const postAnnouncement = (req, res) => {
	loggerPlugin.verbose(
		req.uuid,
		'controllers/plugins/postAnnouncement auth',
		req.auth.sub
	);

	let { title, message, type } = req.swagger.params.data.value;
	if (!type) type = 'info';

	loggerPlugin.info(
		req.uuid,
		'controllers/plugins/postAnnouncement announcement',
		title,
		type
	);

	createAnnouncement(req.auth.sub.id, title, message, type)
		.then((announcement) => {
			return res.json(announcement);
		})
		.catch((err) => {
			loggerPlugin.error(
				req.uuid,
				'controllers/plugins/postAnnouncement err',
				err.message
			);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const deleteAnnouncement = (req, res) => {
	loggerPlugin.verbose(
		req.uuid,
		'controllers/plugins/deleteAnnouncement auth',
		req.auth.sub
	);

	const id = req.swagger.params.id.value;

	loggerPlugin.info(
		req.uuid,
		'controllers/plugins/deleteAnnouncement id',
		id
	);

	findAnnouncement(id)
		.then((announcement) => {
			if (!announcement) {
				throw new Error(`Announcement with id ${id} not found`);
			} else {
				return destroyAnnouncement(id);
			}
		})
		.then(() => {
			return res.json({ message: `Announcement ${id} successfully deleted` });
		})
		.catch((err) => {
			loggerPlugin.error(
				req.uuid,
				'controllers/plugins/deleteAnnouncement err',
				err.message
			);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const getAnnouncements = (req, res) => {
	const {
		limit,
		page,
		order_by,
		order,
		start_date,
		end_date
	} = req.swagger.params;

	loggerPlugin.info(
		req.uuid,
		'controllers/plugins/getAnnouncements query',
		limit,
		page,
		order_by,
		order,
		start_date,
		end_date
	);

	getAllAnnouncements(getPagination(limit, page), getTimeframe(start_date, end_date), getOrdering(order_by, order))
		.then((announcements) => {
			return res.json(announcements);
		})
		.catch((err) => {
			loggerPlugin.error(
				req.uuid,
				'controllers/plugins/getAnnouncements err',
				err.message
			);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const sendSmsVerify = (req, res) => {
	loggerPlugin.verbose(
		req.uuid,
		'controllers/plugins/smsVerify auth',
		req.auth.sub
	);

	const number = req.swagger.params.phone.value;
	const { id } = req.auth.sub;

	loggerPlugin.info(
		req.uuid,
		'controllers/plugins/smsVerify phoneNumber',
		number
	);

	const phoneNumber = new PhoneNumber(number);

	if (!phoneNumber.isValid()) {
		loggerPlugin.error(
			req.uuid,
			'controllers/plugins/smsVerify',
			SMS_INVALID_PHONE
		);
		return res.status(400).json({ message: SMS_INVALID_PHONE });
	}

	const phone = phoneNumber.getNumber();
	const code = generateOtp();
	const SMS = languageFile(getKit().defaults.language).SMS;

	sendSMS(phone, {
		message: SMS.verificationCode(code)
	})
		.then(() => {
			return storeSMSCode(id, phone, code);
		})
		.then(() => {
			return res.json({ message: SMS_SUCCESS });
		})
		.catch((err) => {
			loggerPlugin.error(
				req.uuid,
				'controllers/plugins/smsVerify err',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: err.message });
		});
};

const checkSmsVerify = (req, res) => {
	loggerPlugin.verbose(
		req.uuid,
		'controllers/plugins/checkSmsVerify auth',
		req.auth.sub
	);

	const { id } = req.auth.sub;
	const { code, phone } = req.swagger.params.data.value;

	loggerPlugin.info(
		req.uuid,
		'controllers/plugins/checkSmsVerify code',
		code,
		'phone',
		phone
	);

	const phoneNumber = new PhoneNumber(phone);

	if (!phoneNumber.isValid()) {
		loggerPlugin.error(
			req.uuid,
			'controllers/plugins/checkSmsVerify',
			SMS_INVALID_PHONE
		);
		return res.status(400).json({ message: SMS_INVALID_PHONE });
	}

	const formattedNumber =phoneNumber.getNumber();

	checkSMSCode(id, formattedNumber, code)
		.then(() => {
			return findUser({
				where: { id }, attributes: ['id', 'phone_number']
			});
		})
		.then((user) => {
			return updateUserPhoneNumber(user, phone);
		})
		.then(() => {
			return deleteSMSCode(id);
		})
		.then(() => {
			return res.json({ message: PHONE_VERIFIED });
		})
		.catch((err) => {
			loggerPlugin.error(
				req.uuid,
				'controllers/plugins/checkSmsVerify err',
				err.message
			);
			return res.status(err.statusCode || 400).json({ message: err.message });
		});
};

module.exports = {
	getPlugins,
	putPlugins,
	enablePlugin,
	disablePlugin,
	activateXhtFee,
	postBankUser,
	postBankAdmin,
	bankVerify,
	bankRevoke,
	putKycUser,
	putKycAdmin,
	kycUserUpload,
	kycAdminUpload,
	getKycId,
	kycIdVerify,
	kycIdRevoke,
	postAnnouncement,
	deleteAnnouncement,
	getAnnouncements,
	sendSmsVerify,
	checkSmsVerify
};
