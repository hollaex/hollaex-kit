'use strict';

const app = require('../index');
const { verifyToken, checkScopes } = require('../helpers/auth');
const bodyParser = require('body-parser');
const { logger } = require('../helpers/common');
const { getVaultCoins, checkVaultNames, createVaultWallets } = require('./helpers');

app.post('/plugins/vault/connect', [verifyToken, bodyParser.json()], (req, res) => {
	const endpointScopes = ['admin'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

	logger.verbose(
		'POST /plugins/vault/connect',
		req.body
	);

	const coins = req.body.coins.split(',');

	getVaultCoins(coins)
		.then(() => checkVaultNames(coins))
		.then(() => createVaultWallets(coins))
		.then((data) => {
			res.json(data);
		})
		.catch((err) => {
			logger.error(
				'POST /plugins/vault/connect catch',
				err.messsage
			)
			res.status(err.status || 400).json({ messasge: err.message });
		});
});