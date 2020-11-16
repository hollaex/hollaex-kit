'use strict';

const {
	REQUIRED_XHT,
	ROLES
} = require('../../constants');
const { loggerPlugin } = require('../../config/logger');
const {
	addBankAccount,
	rejectBankAccount,
	approveBankAccount,
	adminAddUserBanks,
	updateUserData,
	updateUserPhoneNumber,
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
	deleteSMSCode
} = require('../helpers/plugins');
const {
	DEFAULT_REJECTION_NOTE,
	USER_NOT_FOUND,
	SMS_INVALID_PHONE,
	ID_EMAIL_REQUIRED,
	SMS_SUCCESS,
	PHONE_VERIFIED,
	PLUGIN_NOT_ENABLED
} = require('../../messages');
const { sendEmail } = require('../../mail');
const { MAILTYPE, languageFile } = require('../../mail/strings');
const PhoneNumber = require('awesome-phonenumber');
const { omit, cloneDeep, has } = require('lodash');
const { all } = require('bluebird');
const toolsLib = require('hollaex-tools-lib');

const getPlugins = (req, res) => {
	try {
		const response = toolsLib.plugin.getPluginsConfig();
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

	const plugin = req.swagger.params.plugin.value;
	const data = req.swagger.params.data.value;

	loggerPlugin.verbose(
		req.uuid,
		'controllers/plugins/putPlugins plugin',
		plugin
	);

	toolsLib.plugin.updatePluginConfig(plugin, data)
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

	toolsLib.plugin.enablePlugin(plugin)
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

	toolsLib.plugin.disablePlugin(plugin)
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
	loggerPlugin.verbose(
		req.uuid,
		'controllers/plugins/activateXhtFee auth',
		id,
		email
	);

	if (!toolsLib.plugin.pluginIsEnabled('xht_fee')) {
		loggerPlugin.error(req.uuid, 'controllers/plugins/activateXhtFee', PLUGIN_NOT_ENABLED('xht_fee'));
		return res.status(400).json({ message: PLUGIN_NOT_ENABLED('xht_fee') });
	}

	const { email, id } = req.auth.sub;

	toolsLib.user.getUserByKitId(id, false, true)
		.then((user) => {
			if (user.dataValues.custom_fee) {
				throw new Error('XHT fee is already activated');
			}
			if (user.dataValues.balance.xht_available < REQUIRED_XHT) {
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
	loggerPlugin.verbose(
		req.uuid,
		'controllers/plugins/postBankUser auth',
		req.auth.sub
	);

	if (!toolsLib.plugin.pluginIsEnabled('bank')) {
		loggerPlugin.error(req.uuid, 'controllers/plugins/postBankUser', PLUGIN_NOT_ENABLED('bank'));
		return res.status(400).json({ message: PLUGIN_NOT_ENABLED('bank') });
	}

	const { email } = req.auth.sub;
	const bank_account = req.swagger.params.data.value;

	toolsLib.user.getUserByEmail(email, false)
		.then(addBankAccount(bank_account))
		.then(() => toolsLib.user.getUserByEmail(email))
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

	if (!toolsLib.plugin.pluginIsEnabled('bank')) {
		loggerPlugin.error(req.uuid, 'controllers/plugins/postBankAdmin', PLUGIN_NOT_ENABLED('bank'));
		return res.status(400).json({ message: PLUGIN_NOT_ENABLED('bank') });
	}

	const id = req.swagger.params.id.value;
	const { bank_account } = req.swagger.params.data.value;

	loggerPlugin.info(
		req.uuid,
		'controllers/plugins/postBankAdmin params',
		id,
		bank_account
	);

	toolsLib.user.getUserByKitId(id, false)
		.then(adminAddUserBanks(bank_account))
		.then(() => toolsLib.user.getUserByKitId(id))
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

	if (!toolsLib.plugin.pluginIsEnabled('bank')) {
		loggerPlugin.error(req.uuid, 'controllers/plugins/bankVerify', PLUGIN_NOT_ENABLED('bank'));
		return res.status(400).json({ message: PLUGIN_NOT_ENABLED('bank') });
	}

	const { user_id, bank_id } = req.swagger.params.data.value;

	loggerPlugin.info(
		req.uuid,
		'controllers/plugins/bankVerify params',
		'user_id',
		user_id,
		'bank_id',
		bank_id
	);

	toolsLib.user.getUserByKitId(user_id, false)
		.then((user) => {
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

	if (!toolsLib.plugin.pluginIsEnabled('bank')) {
		loggerPlugin.error(req.uuid, 'controllers/plugins/bankRevoke', PLUGIN_NOT_ENABLED('bank'));
		return res.status(400).json({ message: PLUGIN_NOT_ENABLED('bank') });
	}

	const { user_id, bank_id } = req.swagger.params.data.value;
	let { message } = req.swagger.params.data.value || DEFAULT_REJECTION_NOTE;

	toolsLib.user.getUserByKitId(user_id, false)
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

	if (!toolsLib.plugin.pluginIsEnabled('kyc')) {
		loggerPlugin.error(req.uuid, 'controllers/plugins/putKycUser', PLUGIN_NOT_ENABLED('kyc'));
		return res.status(400).json({ message: PLUGIN_NOT_ENABLED('kyc') });
	}

	const newData = req.swagger.params.data.value;
	const { email } = req.auth.sub;

	toolsLib.user.getUserByEmail(email, false)
		.then(updateUserData(newData, ROLES.USER))
		.then(() => toolsLib.user.getUserByEmail(email))
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

	if (!toolsLib.plugin.pluginIsEnabled('kyc')) {
		loggerPlugin.error(req.uuid, 'controllers/plugins/putKycAdmin', PLUGIN_NOT_ENABLED('kyc'));
		return res.status(400).json({ message: PLUGIN_NOT_ENABLED('kyc') });
	}

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

	toolsLib.database.getModel('sequelize')
		.transaction((transaction) => {
			const options = { transaction, returning: true };
			let prevUserData = {}; // for audit
			return toolsLib.user.getUserByKitId(id, false)
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
					return all([
						user,
						toolsLib.user.createAudit(admin_id, user.id, 'userUpdate', prevUserData, user.dataValues, ip, domain)
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

	if (!toolsLib.plugin.pluginIsEnabled('kyc')) {
		loggerPlugin.error(req.uuid, 'controllers/plugins/kycUserUpload', PLUGIN_NOT_ENABLED('kyc'));
		return res.status(400).json({ message: PLUGIN_NOT_ENABLED('kyc') });
	}

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
				data.id_data[key] = field.value;
			}
		}
	});

	const ts = Date.now();

	toolsLib.user.getUserByKitId(id, false)
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

	if (!toolsLib.plugin.pluginIsEnabled('kyc')) {
		loggerPlugin.error(req.uuid, 'controllers/plugins/kycAdminUpload', PLUGIN_NOT_ENABLED('kyc'));
		return res.status(400).json({ message: PLUGIN_NOT_ENABLED('kyc') });
	}

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
				data.id_data[key] = field.value;
			}
		}
	});

	const ts = Date.now();

	toolsLib.user.getUserByKitId(user_id, false)
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

	if (!toolsLib.plugin.pluginIsEnabled('kyc')) {
		loggerPlugin.error(req.uuid, 'controllers/plugins/getKycId', PLUGIN_NOT_ENABLED('kyc'));
		return res.status(400).json({ message: PLUGIN_NOT_ENABLED('kyc') });
	}

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

	if (!toolsLib.plugin.pluginIsEnabled('kyc')) {
		loggerPlugin.error(req.uuid, 'controllers/plugins/kycIdVerify', PLUGIN_NOT_ENABLED('kyc'));
		return res.status(400).json({ message: PLUGIN_NOT_ENABLED('kyc') });
	}

	const { user_id } = req.swagger.params.data.value;

	loggerPlugin.info(
		req.uuid,
		'controllers/plugins/kycIdVerify user_id',
		user_id
	);

	toolsLib.user.getUserByKitId(user_id, false)
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

	if (!toolsLib.plugin.pluginIsEnabled('kyc')) {
		loggerPlugin.error(req.uuid, 'controllers/plugins/kycIdRevoke', PLUGIN_NOT_ENABLED('kyc'));
		return res.status(400).json({ message: PLUGIN_NOT_ENABLED('kyc') });
	}

	const { user_id } = req.swagger.params.data.value;
	let { message } = req.swagger.params.data.value || DEFAULT_REJECTION_NOTE;

	loggerPlugin.info(
		req.uuid,
		'controllers/plugins/kycIdRevoke user_id',
		user_id,
		'message',
		message
	);

	toolsLib.user.getUserByKitId(user_id, false)
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

	if (!toolsLib.plugin.pluginIsEnabled('announcement')) {
		loggerPlugin.error(req.uuid, 'controllers/plugins/postAnnouncement', PLUGIN_NOT_ENABLED('announcement'));
		return res.status(400).json({ message: PLUGIN_NOT_ENABLED('announcement') });
	}

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

	if (!toolsLib.plugin.pluginIsEnabled('announcement')) {
		loggerPlugin.error(req.uuid, 'controllers/plugins/deleteAnnouncement', PLUGIN_NOT_ENABLED('announcement'));
		return res.status(400).json({ message: PLUGIN_NOT_ENABLED('announcement') });
	}

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
	if (!toolsLib.plugin.pluginIsEnabled('announcement')) {
		loggerPlugin.error(req.uuid, 'controllers/plugins/getAnnouncements', PLUGIN_NOT_ENABLED('announcement'));
		return res.status(400).json({ message: PLUGIN_NOT_ENABLED('announcement') });
	}

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

	getAllAnnouncements(toolsLib.database.paginationQuery(limit.value, page.value), toolsLib.database.timeframeQuery(start_date.value, end_date.value), toolsLib.database.orderingQuery(order_by.value, order.value))
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
		'controllers/plugins/sendSmsVerify auth',
		req.auth.sub
	);

	if (!toolsLib.plugin.pluginIsEnabled('sms')) {
		loggerPlugin.error(req.uuid, 'controllers/plugins/sendSmsVerify', PLUGIN_NOT_ENABLED('sms'));
		return res.status(400).json({ message: PLUGIN_NOT_ENABLED('sms') });
	}

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
			'controllers/plugins/sendSmsVerify',
			SMS_INVALID_PHONE
		);
		return res.status(400).json({ message: SMS_INVALID_PHONE });
	}

	const phone = phoneNumber.getNumber();
	const code = toolsLib.otp.generateOtp();
	const SMS = languageFile(toolsLib.getKitConfig().defaults.language).SMS;

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

	if (!toolsLib.plugin.pluginIsEnabled('sms')) {
		loggerPlugin.error(req.uuid, 'controllers/plugins/checkSmsVerify', PLUGIN_NOT_ENABLED('sms'));
		return res.status(400).json({ message: PLUGIN_NOT_ENABLED('sms') });
	}

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
			return 	toolsLib.user.getUserValuesById(id, false);
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
