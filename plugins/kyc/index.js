'use strict';

const app = require('../index');
const { verifyToken, checkScopes, findUser, getUserValuesByEmail } = require('../common');
const { validMimeType, uploadFile, getImagesData, findUserImages, storeFilesDataOnDb, updateUserData, getType } = require('./helpers');
const bodyParser = require('body-parser');

const ROLES = {
	USER: 'user'
};

const multer = require('multer');
const upload = multer();
const multerMiddleware = upload.fields([
	{ name: 'front', maxCount: 1 },
	{ name: 'back', maxCount: 1 },
	{ name: 'proof_of_residency', maxCount: 1 }
])

app.put('/plugins/kyc/user', [verifyToken, bodyParser.json()], (req, res) => {
	const endpointScopes = ['user'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

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
				'flagged',
				'affiliation_code'
			]
		}
	})
		.then(updateUserData(editUser, ROLES.USER))
		.then(() => getUserValuesByEmail(email))
		.then((user) => res.json(user))
		.catch((error) => {
			res.status(error.status || 400).json({ message: error.message });
		});
});

app.post('/plugins/kyc/user/verification', [verifyToken, multerMiddleware], (req, res) => {
	const endpointScopes = ['user'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

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
				throw new Error(
					'You are not allowed to upload a document while its pending or approved.'
				);
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

app.post('/plugins/kyc/admin/verification', [verifyToken, multerMiddleware], (req, res) => {
	const endpointScopes = ['admin'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

	let { front, back, proof_of_residency } = req.files;
	if (front) front = front[0];
	if (back) back = back[0];
	if (proof_of_residency) proof_of_residency = proof_of_residency[0];
	const { ...otherData } = req.body;
	const user_id = req.query.user_id;

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
			data.id_data[key] = field;
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
			res.json({ message: 'Success', data });
		})
		.catch((err) => {
			console.log(err);
			res.status(400).json({ message: err.message });
		});
});

app.get('/plugins/kyc/verification', verifyToken, (req, res) => {
	const endpointScopes = ['admin'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

	const { email, id } = req.query;
	const where = {};
	if (id) {
		where.id = id;
	} else if (email) {
		where.email = email;
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