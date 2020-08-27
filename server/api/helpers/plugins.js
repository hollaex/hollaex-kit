'use strict';

const crypto = require('crypto');
const { VerificationImage, Announcement, sequelize } = require('../../db/models');
const { findUser } = require('../helpers/user');
const { pick, each, differenceWith, isEqual } = require('lodash');
const {
	VERIFY_STATUS,
	ROLES,
	USER_FIELD_ADMIN_LOG,
	ID_FIELDS,
	ADDRESS_FIELDS,
	GET_SECRETS,
	S3_LINK_EXPIRATION_TIME
} = require('../../constants');
const {
	USER_NOT_FOUND,
	MAX_BANKS_EXCEEDED,
	ERROR_CHANGE_USER_INFO,
	IMAGE_NOT_FOUND
} = require('../../message');
const aws = require('aws-sdk');
const { all } = require('bluebird');
const { convertSequelizeCountAndRows } = require('./general');

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
	return sequelize.transaction((transaction) => {
		const options = { transaction };
		return VerificationImage.findOrCreate(
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
				return findUser({
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
	return (GET_SECRETS().plugins.s3.id_docs_bucket).split(':')[0];
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

const credentials = () => {
	return {
		write: {
			accessKeyId: GET_SECRETS().plugins.s3.key.write,
			secretAccessKey: GET_SECRETS().plugins.s3.secret.write
		},
		read: {
			accessKeyId: GET_SECRETS().plugins.s3.key.read,
			secretAccessKey: GET_SECRETS().plugins.s3.secret.read
		},
		buckets: generateBuckets(GET_SECRETS().plugins.s3.id_docs_bucket)
	};
};

const s3Write = (bucketName = S3_BUCKET_NAME()) => {
	aws.config.update(credentials().write);
	return new aws.S3(credentials().buckets[bucketName]);
}

const s3Read = (bucketName = S3_BUCKET_NAME()) => {
	aws.config.update(credentials().read);
	return new aws.S3(credentials().buckets[bucketName]);
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
		s3Write().upload(params, (err, data) => {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});
};

const getImagesData = (user_id, type = undefined) => {
	return VerificationImage.findOne({
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

	return s3Read().getSignedUrl('getObject', params);
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
	return findUser({ where, attributes: ['id', 'id_data'] })
		.then((user) => {
			return Promise.all([
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
	return sequelize
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
				VerificationImage.destroy({
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
	return Announcement.create({
		created_by,
		title,
		message,
		type
	});
};

const findAnnouncement = (id) => {
	return Announcement.findOne({ where: { id }});
};

const destroyAnnouncement = (id) => {
	return Announcement.destroy({ where: { id } });
};

const getAllAnnouncements = (pagination = {}, timeframe, ordering) => {
	const order = [];
	if (!ordering) {
		order.push(['created_at', 'desc']);
	} else {
		order.push(ordering);
	}
	let query = {
		order,
		attributes: {
			exclude: ['created_by']
		},
		...pagination
	};
	if (timeframe) query.where.created_at = timeframe;
	return Announcement.findAndCountAll(query)
		.then(convertSequelizeCountAndRows);
};

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
	getAllAnnouncements
};
