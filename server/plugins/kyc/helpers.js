'use strict';

const { findUser } = require('../helpers/user');
const { VerificationImage, sequelize } = require('../../db/models');
const { ROLES, GET_SECRETS } = require('../../constants');
const {
	USER_FIELD_ADMIN_LOG,
	ID_FIELDS,
	ADDRESS_FIELDS,
	VERIFY_STATUS
} = require('../constants');
const AWS_SE = 'amazonaws.com/';
const EXPIRES = 300; // seconds
const { differenceWith, isEqual } = require('lodash');
const { all } = require('bluebird');
const { ERROR_CHANGE_USER_INFO, IMAGE_NOT_FOUND } = require('./messages');

const S3_BUCKET_NAME = () => {
	return (GET_SECRETS().plugins.s3.id_docs_bucket).split(':')[0];
};
const s3Write = () => require('./s3').write(S3_BUCKET_NAME());
const s3Read = () => require('./s3').read(S3_BUCKET_NAME());

const multer = require('multer');
const upload = multer();
const multerMiddleware = upload.fields([
	{ name: 'front', maxCount: 1 },
	{ name: 'back', maxCount: 1 },
	{ name: 'proof_of_residency', maxCount: 1 }
])

const validMimeType = (type = '') => {
	return type.indexOf('image/') === 0;
};

const getType = (type = '') => {
	return type.replace('image/', '');
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
				VerificationImage.destroy({
					where: { user_id: user.id },
					transaction
				}),
				updateUserData(
					{
						id_data: {
							...user.id_data,
							status: VERIFY_STATUS.REJECTED,
							note: message
						}
					},
					ROLES.SUPPORT
				)(user, { transaction, returning: true })
			]);
		})
		.then(([destroyed, user]) => {
			return user;
		});
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

const getKeyFromLink = (link) => {
	const indexOfService = link.indexOf(AWS_SE);
	if (indexOfService > 0) {
		return link.substring(indexOfService + AWS_SE.length);
	}
	// if not amazon.com link, return same link
	return link;
};

const getPublicLink = (privateLink) => {
	const Key = getKeyFromLink(privateLink);
	const params = {
		Bucket: S3_BUCKET_NAME(),
		Key: getKeyFromLink(privateLink),
		Expires: EXPIRES
	};

	return s3Read().getSignedUrl('getObject', params);
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

const updateUserData = (
	{ id_data = {}, bank_account, ...rest },
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
				updateData['id_data'] = id_data;
				updateData.id_data.status = VERIFY_STATUS.PENDING;
			}
		} else {
			updateData['id_data'] = id_data;
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
			.then((image) => {
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

module.exports = {
	validMimeType,
	uploadFile,
	updateUserData,
	getImagesData,
	findUserImages,
	storeFilesDataOnDb,
	getType,
	updateUserPhoneNumber,
	multerMiddleware,
	userUpdateLog,
	approveDocuments,
	revokeDocuments
};