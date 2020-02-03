'use strict';

const app = require('../index');
const { verifyToken, checkScopes, findUser, getUserValuesByEmail } = require('../common');
const { validMimeType, uploadFile, getImagesData, findUserImages, storeFilesDataOnDb, updateUserData } = require('./helpers');
const bodyParser = require('body-parser');

const ROLES = {
	USER: 'user'
};

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

app.post('/plugins/kyc/user/verification', [verifyToken, bodyParser.json()], (req, res) => {
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
		return res.status(400).json({ message: `Invalid type: ${invalidType} field.` });
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

app.post('/plugins/kyc/admin', [verifyToken, bodyParser.json()], (req, res) => {
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
});

app.get('/plugins/kyc/verification', [verifyToken, bodyParser.json()], (req, res) => {
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