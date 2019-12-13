'use strict';

const app = require('../index');
const { verifyToken, checkScopes, findUser, getUserValuesByEmail } = require('../common');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { pick } = require('lodash');
const { VerificationImage } = require('../../db/models');

const EMPTY_STATUS = 0;
const PENDING_STATUS = 1;
const REJECTED_STATUS = 2;
const COMPLETED_STATUS = 3;
const ROLES = {
	USER: 'user'
}

const validMimeType = (type = '') => {
	return type.indexOf('image/') === 0;
};

const uploadFile = (name, file) => {
	// return new Promise((resolve, reject) => {
	// 	const params = {
	// 		Bucket: S3_BUCKET_NAME,
	// 		Key: name,
	// 		Body: file.buffer,
	// 		ContentType: file.mimetype,
	// 		ACL: 'authenticated-read'
	// 	};
	// 	s3Write.upload(params, (err, data) => {
	// 		if (err) {
	// 			reject(err);
	// 		}
	// 		resolve(data);
	// 	});
	// });
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
	if (bank_account && bank_account.length >= 0) {
		if (role === ROLES.USER) {
			throw new Error(ERROR_CHANGE_USER_INFO);
		}
		updateData.bank_account = bank_account;
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

app.post('/plugins/kyc', [verifyToken, bodyParser.json()], (req, res) => {

	const endpointScopes = ['user'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

	const { id, email } = req.auth.sub;
	const { front, back, proof_of_residency, ...otherData } = req.body;

	let invalidType = '';
	if (!validMimeType(front.value.mimetype)) {
		invalidType = 'front';
	} else if (back.value && !validMimeType(back.value.mimetype)) {
		invalidType = 'back';
	} else if (
		proof_of_residency.value &&
		!validMimeType(proof_of_residency.value.mimetype)
	) {
		invalidType = 'proof_of_residency';
	}
	if (invalidType) {
		return res.status(400).json({ message: `Invalid type ${invalidType} field.` });
	}

	const data = { id_data: {} };

	Object.entries(otherData).forEach(([key, field]) => {
		if (field.value) {
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
			if (status === 3) {
				throw new Error(
					'You are not allowed to upload a document while its pending or approved.'
				);
			}
			return Promise.all([
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
			return storeFilesDataOnDb(
				id,
				data,
				results[0].Location,
				results[1] ? results[1].Location : '',
				results[2] ? results[2].Location: ''
			);
		})
		.then(() => {
			res.json({ message: 'Success' });
		})
		.catch((err) => {
			res.status(400).json({ message: err.message });
		});
});

app.post('/plugins/admin/kyc', [verifyToken, bodyParser.json()], (req, res) => {

	const endpointScopes = ['admin'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

	const { id, front, back, proof_of_residency, ...otherData } = req.body;
	if (
		!front.value &&
		!back.value &&
		!proof_of_residency.value &&
		Object.keys(otherData).length === 0
	) {
		return res.status(400).json({ message: 'Missing fields' });
	}

	let invalidType = '';
	if (front.value && !validMimeType(front.value.mimetype)) {
		invalidType = 'front';
	} else if (back.value && !validMimeType(back.value.mimetype)) {
		invalidType = 'back';
	} else if (
		proof_of_residency.value &&
		!validMimeType(proof_of_residency.value.mimetype)
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
		if (field.value) {
			data.id_data[key] = field.value;
		}
	});

	const ts = Date.now();

	findUser({ where: { id }, attributes: ['id']})
		.then((user) => getImagesData(user.id, 'admin'))
		.then((data) => {
			return Promise.all([
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
				id,
				data,
				results[0] ? results[0].Location : '',
				results[1] ? results[1].Location : '',
				results[2] ? results[2].Location : ''
			);
		})
		.then((user) => {
			return findUserImages({ id });
		})
		.then((data) => {
			res.json({ message: 'Success', data });
		})
		.catch((err) => {
			res.status(400).json({ message: err.message });
		});
})

app.get('/plugins/admin/kyc', [verifyToken, bodyParser.json()], (req, res) => {

	const endpointScopes = ['admin'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

	const { email, id } = req.body;
	const where = {};
	if (id.value) {
		where.id = id.value;
	} else if (email.value) {
		where.email = email.value;
	} else {
		return res
			.status(400)
			.json({ message: 'Missing parameters id or email' });
	}

	findUserImages(where)
		.then(({ data }) => {
			res.json(data);
		})
		.catch((err) => {
			res.status(400).json({ message: err.message });
		});
});