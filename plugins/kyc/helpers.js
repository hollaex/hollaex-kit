const { findUser } = require('../common');
const { VerificationImage, sequelize } = require('../../db/models');
const { S3_BUCKET_NAME, DEFAULT_LANGUAGE } = require('../../constants');
const s3Write = require('./s3').write(S3_BUCKET_NAME);
const s3Read = require('./s3').read(S3_BUCKET_NAME);
const AWS_SE = 'amazonaws.com/';
const EXPIRES = 300; // seconds

const EMPTY_STATUS = 0;
const PENDING_STATUS = 1;
const REJECTED_STATUS = 2;
const COMPLETED_STATUS = 3;
const ROLES = {
	USER: 'user'
};

const ERROR_CHANGE_USER_INFO = 'You are not allowed to change your information';

const validMimeType = (type = '') => {
	return type.indexOf('image/') === 0;
};

const getType = (type = '') => {
	return type.replace('image/', '');
};

const uploadFile = (name, file) => {
	return new Promise((resolve, reject) => {
		const params = {
			Bucket: S3_BUCKET_NAME,
			Key: name,
			Body: file.buffer,
			ContentType: file.mimetype,
			ACL: 'authenticated-read'
		};
		s3Write.upload(params, (err, data) => {
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
			throw new Error('User data not found');
		}
		return verificationImages.dataValues;
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
		Bucket: S3_BUCKET_NAME,
		Key: getKeyFromLink(privateLink),
		Expires: EXPIRES
	};

	return s3Read.getSignedUrl('getObject', params);
};

const SETTING_KEYS = [
	'language',
	'notification',
	'interface',
	'audio',
	'risk',
	'chat'
];

const DEFAULT_SETTINGS = {
	language: DEFAULT_LANGUAGE,
	orderConfirmationPopup: true
};

const joinSettings = (userSettings = {}, newSettings = {}) => {
	const joinedSettings = {};
	SETTING_KEYS.forEach((key) => {
		if (newSettings.hasOwnProperty(key)) {
			joinedSettings[key] = newSettings[key];
		} else if (userSettings.hasOwnProperty(key)) {
			joinedSettings[key] = userSettings[key];
		} else {
			joinedSettings[key] = DEFAULT_SETTINGS[key];
		}
	});
	return joinedSettings;
};

const updateUserPhoneNumber = (user, phone_number, options = {}) => {
	return user.update(
		{ phone_number },
		{ fields: ['phone_number'], ...options }
	);
};

const updateUserData = (
	{ id_data = {}, settings = {}, bank_account, ...rest },
	role = ROLES.USER
) => (user, options = {}) => {
	const updateData = {
		...rest
	};
	if (Object.keys(id_data).length > 0) {
		if (role === ROLES.USER) {
			if (user.dataValues.status === COMPLETED_STATUS) {
				throw new Error(ERROR_CHANGE_USER_INFO);
			} else {
				updateData['id_data'] = id_data;
				updateData.id_data.status = PENDING_STATUS;
			}
		} else {
			updateData['id_data'] = id_data;
		}
	}
	if (Object.keys(settings).length > 0) {
		updateData.settings = joinSettings(user.dataValues.settings, settings);
	}
	if (
		updateData.full_name ||
		updateData.gender ||
		updateData.dob ||
		updateData.address ||
		updateData.nationality
	) {
		if (user.dataValues.id_data === COMPLETED_STATUS) {
			throw new Error(ERROR_CHANGE_USER_INFO);
		}
	}
	if (updateData.username && user.dataValues.settings.usernameIsSet) {
		throw new Error(ERROR_CHANGE_USER_INFO);
	}
	// User is not allowed to update his phone number through this. User has to verify phone number through a whole different process
	if (updateData.phone_number && role === ROLES.USER) {
		throw new Error(ERROR_CHANGE_USER_INFO);
	}
	return user.update(updateData, {
		fields: [
			'full_name',
			'username',
			'gender',
			'nationality',
			'dob',
			'address',
			'phone_number',
			'id_data',
			'bank_account',
			'settings'
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
	updateUserPhoneNumber
};