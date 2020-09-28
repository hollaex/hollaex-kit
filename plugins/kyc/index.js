'use strict';

const app = require('../index');
const { verifyToken, checkScopes } = require('../helpers/auth');
const { findUser, getUserValuesByEmail } = require('../helpers/user');
const { createAudit } = require('../helpers/audit');
const { sendEmail } = require('../../mail');
const { MAILTYPE } = require('../../mail/strings');
const {
	multerMiddleware,
	validMimeType,
	uploadFile,
	getImagesData,
	findUserImages,
	storeFilesDataOnDb,
	updateUserData,
	getType,
	updateUserPhoneNumber,
	userUpdateLog,
	approveDocuments,
	revokeDocuments
} = require('./helpers');
const { SMS_INVALID_PHONE, DEFAULT_REJECTION_NOTE, ID_EMAIL_REQUIRED, PENDING_APPROVAL_DENY } = require('./messages');
const bodyParser = require('body-parser');
const PhoneNumber = require('awesome-phonenumber');
const { sequelize } = require('../../db/models');
const { cloneDeep, omit } = require('lodash');
const { ROLES } = require('../../constants');
const { all } = require('bluebird');
const { logger, updatePluginConstant, maskSecrets } = require('../helpers/common');
const { NOT_AUTHORIZED } = require('../helpers/messages');
const { GET_SECRETS } = require('../../constants');

app.get('/plugins/kyc/constant', verifyToken, (req, res) => {
	const endpointScopes = ['admin', 'tech'];
	const scopes = req.auth.scopes;

	logger.verbose(
		'GET /plugins/kyc/constant auth',
		req.auth.sub
	);

	if (!checkScopes(endpointScopes, scopes)) {
		logger.error('GET /plugins/kyc/constant error', NOT_AUTHORIZED);
		return res.status(400).json({ message: NOT_AUTHORIZED });
	}

	try {
		res.json(maskSecrets('s3', GET_SECRETS().plugins.s3) || {});
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

app.put('/plugins/kyc/constant', [verifyToken, bodyParser.json()], (req, res) => {
	const endpointScopes = ['admin', 'tech'];
	const scopes = req.auth.scopes;

	logger.verbose(
		'PUT /plugins/kyc/constant auth',
		req.auth.sub
	);

	if (!checkScopes(endpointScopes, scopes)) {
		logger.error('PUT /plugins/kyc/constant error', NOT_AUTHORIZED);
		return res.status(400).json({ message: NOT_AUTHORIZED });
	}

	if (req.body.length === 0) {
		logger.error('PUT /plugins/kyc/constant error', 'Must provide key to update');
		return res.status(400).json({ message: 'Must provide key to update' });
	}

	logger.info(
		'PUT /plugins/kyc/constant body',
		req.body
	);

	updatePluginConstant('s3', req.body)
		.then((data) => {
			res.json(data);
		})
		.catch((err) => {
			res.status(400).json({ message: err.message });
		});
});

app.put('/plugins/kyc/user', [verifyToken, bodyParser.json()], (req, res) => {
	const endpointScopes = ['user'];
	const scopes = req.auth.scopes;

	logger.verbose(
		'PUT /plugins/kyc/user',
		req.body
	);

	if (!checkScopes(endpointScopes, scopes)) {
		logger.error('PUT /plugins/kyc/user error', NOT_AUTHORIZED);
		return res.status(400).json({ message: NOT_AUTHORIZED });
	}

	const email = req.auth.sub.email;
	const editUser = req.body;

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
		.then(updateUserData(editUser, ROLES.USER))
		.then(() => getUserValuesByEmail(email))
		.then((user) => res.json(user))
		.catch((error) => {
			logger.error('PUT /plugins/kyc/user', error);
			res.status(error.status || 400).json({ message: error.message });
		});
});

app.put('/plugins/kyc/admin', [verifyToken, bodyParser.json()], (req, res) => {
	const endpointScopes = ['admin', 'supervisor', 'support'];
	const scopes = req.auth.scopes;

	logger.verbose(
		'PUT /plugins/kyc/admin',
		req.auth
	);

	if (!checkScopes(endpointScopes, scopes)) {
		logger.error('PUT /plugins/kyc/admin error', NOT_AUTHORIZED);
		return res.status(400).json({ message: NOT_AUTHORIZED });
	}

	const ip = req.headers['x-real-ip'];
	const domain = req.headers['x-real-origin'];
	const admin_id = req.auth.sub.id;
	const id = req.query.user_id;
	const data = req.body;

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
		if (data.hasOwnProperty(key)) {
			delete data[key];
		}
	})

	let phoneNumber;
	if (data.phone_number) {
		phoneNumber = new PhoneNumber(data.phone_number);
		if (data.phone_number && !phoneNumber.isValid()) {
			logger.error(
				'PUT /plugins/kyc/admin not a valid phone number',
				data.phone_number
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
					logger.verbose(
						'PUT /plugins/kyc/admin user',
						prevUserData
					);
					return updateUserData(data, ROLES.SUPPORT)(user, options);
				})
				.then((user) => {
					logger.debug(
						'PUT /plugins/kyc/admin user then',
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
					logger.verbose(
						'PUT /plugins/kyc/admin user then then',
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
			logger.info(
				'PUT /plugins/kyc/admin user_end audit',
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
			logger.error(
				'PUT /plugins/kyc/admin catch',
				err.messsage
			)
			res.status(err.status || 400).json({ message: err.message });
		});
});

app.post('/plugins/kyc/user/upload', [verifyToken, multerMiddleware], (req, res) => {
	const endpointScopes = ['user'];
	const scopes = req.auth.scopes;

	logger.verbose('POST /plugins/kyc/user/upload auth', req.auth.sub);

	if (!checkScopes(endpointScopes, scopes)) {
		logger.error('POST /plugins/kyc/user/upload error', NOT_AUTHORIZED);
		return res.status(400).json({ message: NOT_AUTHORIZED });
	}

	const { id, email } = req.auth.sub;
	let { front, back, proof_of_residency } = req.files;
	if (front) front = front[0];
	if (back) back = back[0];
	if (proof_of_residency) proof_of_residency = proof_of_residency[0];
	const { ...otherData } = req.body;

	let invalidType = '';
	if (!validMimeType(front.mimetype)) {
		invalidType = 'front';
	} else if (back && !validMimeType(back.mimetype)) {
		invalidType = 'back';
	} else if (
		proof_of_residency &&
		!validMimeType(proof_of_residency.mimetype)
	) {
		invalidType = 'proof_of_residency';
	}
	if (invalidType) {
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
				throw new Error(PENDING_APPROVAL_DENY);
			}
			return Promise.all([
				uploadFile(
					`${id}/${ts}-front.${getType(front.mimetype)}`,
					front
				),
				back
					? uploadFile(
						`${id}/${ts}-back.${getType(back.mimetype)}`,
						back
					)
					: undefined,
				proof_of_residency
					? uploadFile(
						`${id}/${ts}-proof_of_residency.${getType(
							proof_of_residency.mimetype
						)}`,
						proof_of_residency
					)
					: undefined
			]);
		})
		.then((results) => {
			logger.verbose('POST /plugins/kyc/user/upload results', results);
			return storeFilesDataOnDb(
				id,
				data,
				results[0].Location,
				results[1] ? results[1].Location : '',
				results[2] ? results[2].Location: ''
			);
		})
		.then(() => {
			sendEmail(MAILTYPE.USER_VERIFICATION, email, {}, {});
			res.json({ message: 'Success' });
		})
		.catch((err) => {
			logger.error('POST /plugins/kyc/user/upload error', err);
			res.status(400).json({ message: err.message });
		});
});

app.post('/plugins/kyc/admin/upload', [verifyToken, multerMiddleware], (req, res) => {
	const endpointScopes = ['admin', 'supervisor'];
	const scopes = req.auth.scopes;

	logger.verbose('POST /plugins/kyc/admin/upload auth', req.auth.sub);

	if (!checkScopes(endpointScopes, scopes)) {
		logger.error('POST /plugins/kyc/admin/upload error', NOT_AUTHORIZED);
		return res.status(400).json({ message: NOT_AUTHORIZED });
	}

	let { front, back, proof_of_residency } = req.files;
	if (front) front = front[0];
	if (back) back = back[0];
	if (proof_of_residency) proof_of_residency = proof_of_residency[0];
	const { ...otherData } = req.body;
	const user_id = req.query.user_id;

	logger.verbose(
		'POST /plugins/kyc/admin/upload user_id',
		user_id
	)

	if (
		!front &&
		!back &&
		!proof_of_residency &&
		Object.keys(otherData).length === 0
	) {
		return res.status(400).json({ message: 'Missing fields' });
	}

	let invalidType = '';
	if (front && !validMimeType(front.mimetype)) {
		invalidType = 'front';
	} else if (back && !validMimeType(back.mimetype)) {
		invalidType = 'back';
	} else if (
		proof_of_residency &&
		!validMimeType(proof_of_residency.mimetype)
	) {
		invalidType = 'proof_of_residency';
	}
	if (invalidType) {
		return res
			.status(400)
			.json({ message: `Invalid type ${invalidType} field.` });
	}

	const data = { id_data: { provided: true }};

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

	findUser({ where: { id: user_id }, attributes: ['id']})
		.then((user) => getImagesData(user.id, 'admin'))
		.then((data) => {
			return Promise.all([
				front
					? uploadFile(
						`${user_id}/${ts}-front.${getType(front.mimetype)}`,
						front
					)
					: { Location: data.front },
				back
					? uploadFile(
						`${user_id}/${ts}-back.${getType(back.mimetype)}`,
						back
					)
					: { Location: data.back },
				proof_of_residency
					? uploadFile(
						`${user_id}/${ts}-proof_of_residency.${getType(
							proof_of_residency.mimetype
						)}`,
						proof_of_residency
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
		.then((user) => {
			return findUserImages({ id: user_id });
		})
		.then((data) => {
			logger.debug('POST /plugins/kyc/admin/upload data', data);
			res.json({ message: 'Success', data });
		})
		.catch((err) => {
			console.log(err);
			logger.error('POST /plugins/kyc/admin/upload err', err.message);
			res.status(400).json({ message: err.message });
		});
});

app.get('/plugins/kyc/id', verifyToken, (req, res) => {
	const endpointScopes = ['admin', 'supervisor', 'support', 'kyc'];
	const scopes = req.auth.scopes;

	logger.verbose('GET /plugins/kyc/id auth', req.auth.sub);

	if (!checkScopes(endpointScopes, scopes)) {
		logger.error('GET /plugins/kyc/id error', NOT_AUTHORIZED);
		return res.status(400).json({ message: NOT_AUTHORIZED });
	}

	const { email, id } = req.query;
	const where = {};
	if (id) {
		where.id = id;
	} else if (email) {
		where.email = email;
	} else {
		return res
			.status(400)
			.json({ message: ID_EMAIL_REQUIRED });
	}

	findUserImages(where)
		.then(({ data }) => {
			logger.debug('GET /plugins/kyc/id data', data);
			res.json(data);
		})
		.catch((err) => {
			logger.error('GET /plugins/kyc/id auth', err.message);
			res.status(400).json({ message: err.message });
		});
});

app.post('/plugins/kyc/id/verify', [verifyToken, bodyParser.json()], (req, res) => {
	const endpointScopes = ['admin', 'supervisor', 'support', 'kyc'];
	const scopes = req.auth.scopes;

	logger.verbose(
		'POST /plugins/kyc/id/verify auth',
		req.auth.sub
	);

	if (!checkScopes(endpointScopes, scopes)) {
		logger.error('POST /plugins/kyc/id/verify error', NOT_AUTHORIZED);
		return res.status(400).json({ message: NOT_AUTHORIZED });
	}

	const { user_id } = req.body;

	logger.verbose(
		'POST /plugins/kyc/id/verify user_id',
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
			logger.debug(
				'POST /plugins/kyc/id/verify data',
				data
			);
			res.json(data);
		})
		.catch((err) => {
			logger.error(
				'POST /plugins/kyc/id/verify error',
				err.message
			);
			res.status(err.status || 400).json({ message: err.message });
		});
});

app.post('/plugins/kyc/id/revoke', [verifyToken, bodyParser.json()], (req, res) => {
	const endpointScopes = ['admin', 'supervisor', 'support', 'kyc'];
	const scopes = req.auth.scopes;

	logger.verbose(
		'POST /plugins/kyc/id/revoke auth',
		req.auth.sub
	);

	if (!checkScopes(endpointScopes, scopes)) {
		logger.error('POST /plugins/kyc/id/revoke error', NOT_AUTHORIZED);
		return res.status(400).json({ message: NOT_AUTHORIZED });
	}

	const { user_id } = req.body;
	const { message } = req.body || DEFAULT_REJECTION_NOTE;

	logger.verbose(
		'POST /plugins/kyc/id/revoke body',
		user_id,
		message
	);

	findUser({
		where: {
			id: user_id
		},
		attributes: ['id', 'email', 'id_data', 'settings']
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
			logger.debug(
				'POST /plugins/kyc/id/revoke data',
				data
			);
			res.json(data);
		})
		.catch((err) => {
			logger.error(
				'POST /plugins/kyc/id/revple error',
				err.message
			);
			res.status(err.status || 400).json({ message: err.message });
		});
});