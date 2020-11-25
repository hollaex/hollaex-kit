'use strict';

const crypto = require('crypto');
const { pick, each, differenceWith, isEqual } = require('lodash');
const { publisher } = require('../../db/pubsub');
const {
	VERIFY_STATUS,
	ROLES,
	USER_FIELD_ADMIN_LOG,
	ID_FIELDS,
	ADDRESS_FIELDS,
	S3_LINK_EXPIRATION_TIME,
	SMS_CODE_EXPIRATION_TIME,
	SMS_CODE_KEY,
	CONFIGURATION_CHANNEL,
	AVAILABLE_PLUGINS
} = require('../../constants');
const {
	USER_NOT_FOUND,
	MAX_BANKS_EXCEEDED,
	ERROR_CHANGE_USER_INFO,
	IMAGE_NOT_FOUND,
	INVALID_PHONE_NUMBER,
	SMS_ERROR,
	SMS_CODE_EXPIRED,
	SMS_PHONE_DONT_MATCH,
	SMS_CODE_INVALID,
	BANK_NOT_FOUND,
	BANK_ALREADY_VERIFIED
} = require('../../messages');
const aws = require('aws-sdk');
const { all, reject } = require('bluebird');
const PhoneNumber = require('awesome-phonenumber');
const redis = require('../../db/redis').duplicate();
const toolsLib = require('hollaex-tools-lib');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');

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
	const bank = user.bank_account.filter((bank) => bank.id === id);

	if (bank.length === 0) {
		return reject(new Error(BANK_NOT_FOUND));
	} else if (bank[0].status === VERIFY_STATUS.COMPLETED) {
		return reject(new Error(BANK_ALREADY_VERIFIED));
	}

	const banks = user.bank_account.map((bank) => {
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
	const bank = user.bank_account.filter((bank) => bank.id === id);

	if (bank.length === 0) {
		return reject(new Error(BANK_NOT_FOUND));
	}

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

const bankComparison = (bank1, bank2, description) => {
	let difference = [];
	let note = '';
	if (bank1.length === bank2.length) {
		note = 'bank info updated';
		difference = differenceWith(bank1, bank2, isEqual);
	} else if (bank1.length > bank2.length) {
		note = 'bank removed';
		difference = differenceWith(bank1, bank2, isEqual);
	} else if (bank1.length < bank2.length) {
		note = 'bank added';
		difference = differenceWith(bank2, bank1, isEqual);
	}

	// bank data is changed
	if (difference.length > 0) {
		description.note = note;
		description.new.bank_account = bank2;
		description.old.bank_account = bank1;
	}
	return description;
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

const getType = (type = '') => {
	return type.replace('image/', '');
};

const storeFilesDataOnDb = (
	user_id,
	data,
	front = '',
	back = '',
	proof_of_residency = ''
) => {
	return toolsLib.database.getModel('sequelize').transaction((transaction) => {
		const options = { transaction };
		return toolsLib.database.getModel('verification image').findOrCreate(
			{
				where: { user_id },
				defaults: {
					user_id,
					front,
					back,
					proof_of_residency
				},
				options
			}
		)
			.then(([image, created]) => {
				if(!created) {
					return image.update({
						front,
						back,
						proof_of_residency
					}, { options } );
				} else {
					return image;
				}
			})
			.then(() => {
				return toolsLib.database.findOne('user', {
					where: { id: user_id },
					attributes: ['id', 'id_data'],
					transaction
				});
			})
			.then((user) => {
				return updateUserData(data, 'user')(user, {
					...options,
					returning: true
				});
			});
	});
};

const S3_BUCKET_NAME = () => {
	return (toolsLib.getKitSecrets().plugins.s3.id_docs_bucket).split(':')[0];
};

const generateBuckets = (bucketsString = '') => {
	const bucketsSplit = bucketsString
		.split(',')
		.map((bucketString) => bucketString.split(':'));
	const buckets = {};

	bucketsSplit.forEach(([bucketName, bucketRegion]) => {
		buckets[bucketName] = {
			region: bucketRegion,
			signatureVersion: 'v4'
		};
	});

	return buckets;
};

const s3Credentials = () => {
	return {
		auth: {
			accessKeyId: toolsLib.getKitSecrets().plugins.s3.key,
			secretAccessKey: toolsLib.getKitSecrets().plugins.s3.secret
		},
		buckets: generateBuckets(toolsLib.getKitSecrets().plugins.s3.id_docs_bucket)
	};
};

const s3 = (bucketName = S3_BUCKET_NAME()) => {
	aws.config.update(s3Credentials().auth);
	return new aws.S3(s3Credentials().buckets[bucketName]);
};

const uploadFile = (name, file) => {
	return new Promise((resolve, reject) => {
		const params = {
			Bucket: S3_BUCKET_NAME(),
			Key: name,
			Body: file.buffer,
			ContentType: file.mimetype,
			ACL: 'authenticated-read'
		};
		s3().upload(params, (err, data) => {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
};

const getImagesData = (user_id, type = undefined) => {
	return toolsLib.database.findOne('verification image', {
		where: { user_id },
		order: [['created_at', 'DESC']],
		attributes: ['front', 'back', 'proof_of_residency']
	}).then((verificationImages) => {
		if (!verificationImages) {
			if (type === 'admin') {
				return { front: undefined, back: undefined, proof_of_residency: undefined };
			}
			throw new Error(IMAGE_NOT_FOUND);
		}
		return verificationImages.dataValues;
	});
};

const getKeyFromLink = (link) => {
	const AWS_SE = 'amazonaws.com/';
	const indexOfService = link.indexOf(AWS_SE);
	if (indexOfService > 0) {
		return link.substring(indexOfService + AWS_SE.length);
	}
	// if not amazon.com link, return same link
	return link;
};

const getPublicLink = (privateLink) => {
	const params = {
		Bucket: S3_BUCKET_NAME(),
		Key: getKeyFromLink(privateLink),
		Expires: S3_LINK_EXPIRATION_TIME
	};

	return s3().getSignedUrl('getObject', params);
};

const getLinks = ({ front, back, proof_of_residency }) => {
	const data = {
		front: front ? getPublicLink(front) : '',
		back: back ? getPublicLink(back) : '',
		proof_of_residency: proof_of_residency
			? getPublicLink(proof_of_residency)
			: ''
	};
	return data;
};

const findUserImages = (where) => {
	return toolsLib.database.findOne('user', { where, attributes: ['id', 'id_data'] })
		.then((user) => {
			if (!user) {
				throw new Error('User not found');
			}
			return all([
				user.dataValues,
				getImagesData(user.id).then(getLinks)
			]);
		})
		.then(([user, links]) => {
			return { user, data: links };
		});
};

const validMimeType = (type = '') => {
	return type.indexOf('image/') === 0;
};

const approveDocuments = (user) => {
	return updateUserData(
		{
			id_data: { ...user.id_data, status: VERIFY_STATUS.COMPLETED, note: '' }
		},
		ROLES.SUPPORT
	)(user, { returning: true }).then((user) => {
		return user;
	});
};

const revokeDocuments = (user, message = '') => {
	return toolsLib.database.getModel('sequelize')
		.transaction((transaction) => {
			return all([
				updateUserData(
					{
						id_data: {
							...user.id_data,
							status: VERIFY_STATUS.REJECTED,
							note: message
						}
					},
					ROLES.SUPPORT
				)(user, { transaction, returning: true }),
				toolsLib.database.getModel('verification image').destroy({
					where: { user_id: user.id },
					transaction
				})
			]);
		})
		.then(([ user ]) => {
			return user;
		});
};

const createAnnouncement = (created_by, title, message, type) => {
	return toolsLib.database.getModel('announcement').create({
		created_by,
		title,
		message,
		type
	});
};

const findAnnouncement = (id) => {
	return toolsLib.database.findOne('announcement', { where: { id }});
};

const destroyAnnouncement = (id) => {
	return toolsLib.database.getModel('announcement').destroy({ where: { id } });
};

const getAllAnnouncements = (pagination, timeframe, ordering) => {
	let query = {
		where: {
			created_at: timeframe
		},
		order: [ordering],
		attributes: {
			exclude: ['created_by']
		},
		...pagination
	};
	if (timeframe) query.where.created_at = timeframe;
	return toolsLib.database.findAndCountAllWithRows('announcement', query);
};

const snsCredentials = () => {
	return {
		accessKeyId: toolsLib.getKitSecrets().plugins.sns.key,
		secretAccessKey: toolsLib.getKitSecrets().plugins.sns.secret,
		region: toolsLib.getKitSecrets().plugins.sns.region
	};
};

const sns = () => {
	aws.config.update(snsCredentials());
	return new aws.SNS();
};

const sendAwsSMS = (phoneNumber, message) => {
	const params = {
		Message: message,
		MessageStructure: 'string',
		PhoneNumber: phoneNumber
	};

	return new Promise((resolve, reject) => {
		sns().publish(params, (err, data) => {
			if (err) {
				const error = new Error(SMS_ERROR);
				error.statusCode = 400;
				return reject(error);
			}
			return resolve(data);
		});
	});
};

const sendSMS = (number = '', data = {}) => {
	const phoneNumber = new PhoneNumber(number);

	if (!phoneNumber.isValid()) {
		return Promise.resolve(INVALID_PHONE_NUMBER);
	} else {
		const message = data.message;
		return sendAwsSMS(phoneNumber.getNumber(), message);
	}
};

const sendSMSDeposit = (
	type,
	currency,
	phoneNumber,
	amount,
	timestamp,
	language = toolsLib.getKitConfig().defaults.language
) => {
	const { SMS } = require(`../../mail/strings/${language}`);
	let message;
	if (type === 'deposit' || type === 'withdrawal') {
		message = SMS[type](currency, amount);
	} else {
		throw new Error(`Invalid type ${type}`);
	}

	const data = {
		message
	};
	return sendSMS(phoneNumber, data).catch((err) => {
		return;
	});
};

const generateUserKey = (user_id) => `${SMS_CODE_KEY}:${user_id}`;

const storeSMSCode = (user_id, phone, code) => {
	const userKey = generateUserKey(user_id);
	const data = {
		phone,
		code
	};

	return redis.setAsync(
		userKey,
		JSON.stringify(data),
		'EX',
		SMS_CODE_EXPIRATION_TIME
	);
};

const checkSMSCode = (user_id, phone, code) => {
	const userKey = generateUserKey(user_id);
	return redis
		.getAsync(userKey)
		.then((data) => {
			if (!data) {
				throw new Error(SMS_CODE_EXPIRED);
			}
			return JSON.parse(data);
		})
		.then((data) => {
			if (data.phone !== phone) {
				throw new Error(SMS_PHONE_DONT_MATCH);
			} else if (data.code !== code) {
				throw new Error(SMS_CODE_INVALID);
			}
			return data;
		});
};

const deleteSMSCode = (user_id) => {
	const userKey = generateUserKey(user_id);
	return redis.delAsync(userKey);
};

const updatePluginConfiguration = (key, data) => {
	return toolsLib.database.findOne('status', {
		attributes: ['id', 'kit']
	})
		.then((status) => {
			const kit = status.kit;
			if (key === 'enable' || key === 'disable') {
				if (!AVAILABLE_PLUGINS.includes(data)) {
					throw new Error(`Plugin ${data} does not exist`);
				} else {
					let enabledPlugins = kit.plugins.enabled.split(',');
					if (key === 'enable') {
						if (enabledPlugins.includes(data)) {
							throw new Error (`Plugin ${data} is already enabled`);
						} else {
							enabledPlugins.push(data);
							kit.plugins.enabled = enabledPlugins.join(',');
						}
					} else if (key === 'disable') {
						if (!enabledPlugins.includes(data)) {
							throw new Error(`Plugin ${data} is already disabled`);
						} else {
							enabledPlugins = enabledPlugins.filter((plugin) => plugin !== data);
							kit.plugins.enabled = enabledPlugins.join(',');
						}
					}
				}
			} else {
				kit.plugins[key] = { ...kit.plugins.configuration[key], ...data };
			}
			return status.update({ kit }, {
				fields: [
					'kit'
				],
				returning: true
			});
		})
		.then((data) => {
			publisher.publish(
				CONFIGURATION_CHANNEL,
				JSON.stringify({
					type: 'update', data: { kit: data.kit }
				})
			);
			if (key === 'enable' || key === 'disable') {
				return data.kit.plugins.enabled.split(',');
			} else {
				return data.kit.plugins.configuration[key];
			}
		});
};

const signFreshdesk = (user) => {
	const name = user.full_name || 'user';
	const email = user.email;
	const timestamp = Math.floor(new Date().getTime() / 1000);
	const signature = crypto
		.createHmac('MD5', toolsLib.getKitSecrets().plugins.freshdesk.auth)
		.update(name + toolsLib.getKitSecrets().plugins.freshdesk.auth + email + timestamp)
		.digest('hex');
	const url = `${toolsLib.getKitSecrets().plugins.freshdesk.host}/login/sso?name=${name}&email=${email}&timestamp=${timestamp}&hash=${signature}`;
	return url;
};

const signZendesk = (user) => {
	const name = user.username || 'user';
	const email = user.email;
	const timestamp = moment().unix();

	const token = jwt.sign(
		{
			email,
			name,
			iat: timestamp,
			jti: uuid(),
			external_id: user.id
		},
		toolsLib.getKitSecrets().plugins.zendesk.key
	);

	const url = `${toolsLib.getKitSecrets().plugins.zendesk.host}/access/jwt?jwt=${token}`;
	return url;
};

// const generateTicketData = ({
// 	email = '',
// 	subject = '',
// 	description = '',
// 	category = ''
// }) => ({
// 	name: `${subject} ${category}`,
// 	email,
// 	subject,
// 	description,
// 	status: 2,
// 	priority: 1
// });

// const createTicket = (data = {}) => {
// 	loggerFreshdesk.info('helpers/freshdesk/createTicket data', data);
// 	const FRESHDESK_ENDPOINT = `https://${getSecrets().plugins.freshdesk.host}`;
// 	const PATH_TICKET = '/api/v2/tickets';

// 	const auth = 'Basic ' + new Buffer.from(getSecrets().plugins.freshdesk.key + ':' + 'X').toString('base64');

// 	const freshdeskData = generateTicketData(data);
// 	// ticket with attachment
// 	if (data.attachment) {
// 		loggerFreshdesk.verbose(
// 			'helpers/freshdesk/createTicket/attachment',
// 			data.attachment
// 		);
// 		data.attachment.fieldname = 'attachments[]';
// 		loggerFreshdesk.verbose(
// 			'helpers/freshdesk/createTicket withAttachment',
// 			data
// 		);
// 		const options = {
// 			method: 'POST',
// 			headers: {
// 				Authorization: auth,
// 				'Content-Type': 'multipart/form-data'
// 			},
// 			formData: {
// 				email: JSON.stringify(freshdeskData.email),
// 				subject: JSON.stringify(freshdeskData.subject),
// 				description: JSON.stringify(freshdeskData.description),
// 				status: JSON.stringify(freshdeskData.status),
// 				priority: JSON.stringify(freshdeskData.priority),
// 				'attachments[]': JSON.stringify(data.attachment)
// 			},
// 			uri: `${FRESHDESK_ENDPOINT}${PATH_TICKET}`
// 		};
// 		return rp(options);
// 	} else {
// 		loggerFreshdesk.verbose(
// 			'helpers/freshdesk/createTicket freshdeskData',
// 			freshdeskData
// 		);
// 		const options = {
// 			method: 'POST',
// 			headers: {
// 				Authorization: auth,
// 				'Content-Type': 'application/json'
// 			},
// 			body: JSON.stringify(freshdeskData),
// 			uri: `${FRESHDESK_ENDPOINT}${PATH_TICKET}`
// 		};
// 		return rp(options);
// 	}
// };

module.exports = {
	addBankAccount,
	approveBankAccount,
	adminAddUserBanks,
	rejectBankAccount,
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
	updatePluginConfiguration,
	signFreshdesk,
	signZendesk,
	sendSMSDeposit
};
