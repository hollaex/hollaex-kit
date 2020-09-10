'use strict';

const app = require('../index');
const { verifyToken, checkScopes } = require('../helpers/auth');
const { findUser } = require('../helpers/user');
const { logger, updatePluginConstant, maskSecrets } = require('../helpers/common');
const bodyParser = require('body-parser');
const { Balance } = require('../../db/models');

const REQUIRED_XHT = 100;

const { GET_KIT_SECRETS } = require('../../constants');

app.get('/plugins/xht_fee/constant', verifyToken, (req, res) => {
	const endpointScopes = ['admin', 'tech'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

	logger.verbose(
		'GET /plugins/xht_fee/constant auth',
		req.auth.sub
	);

	try {
		res.json(maskSecrets('xht_fee', GET_KIT_SECRETS().plugins.xht_fee) || {});
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

app.put('/plugins/xht_fee/constant', [verifyToken, bodyParser.json()], (req, res) => {
	const endpointScopes = ['admin', 'tech'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

	logger.verbose(
		'PUT /plugins/xht_fee/constant auth',
		req.auth.sub
	);

	if (req.body.length === 0) {
		logger.error('PUT /plugins/xht_fee/constant error', 'Must provide key to update');
		return res.status(400).json({ message: 'Must provide key to update' });
	}

	logger.info(
		'PUT /plugins/xht_fee/constant body',
		req.body
	);

	updatePluginConstant('xht_fee', req.body)
		.then((data) => {
			res.json(data);
		})
		.catch((err) => {
			res.status(400).json({ message: err.message });
		});
});

app.get('/plugins/activate-xht-fee', [verifyToken, bodyParser.json()], (req, res) => {
	const endpointScopes = ['user'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

	const email = req.auth.sub.email;
	const id = req.auth.sub.id;

	logger.verbose(
		'GET /plugins/activate-xht-fee',
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
			return user.update({ custom_fee: true }, { fields: ['custom_fee'], returning: true });

		})
		.then((user) => {
			return res.json({ message: 'Success'});
		})
		.catch((err) => {
			logger.error('GET /plugins/activate-xht-fee error', err);
			res.status(400).json({ message: err.message });
		});
});