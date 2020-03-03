'use strict';

const app = require('../index');
const { verifyToken, checkScopes } = require('../helpers/auth');
const bodyParser = require('body-parser');
const { logger } = require('../helpers/common');
const { updateVaultValues, crossCheckCoins, createOrUpdateWallets } = require('./helpers');
const { all } = require('bluebird');

app.post('/plugins/vault/connect', [verifyToken, bodyParser.json()], (req, res) => {
	const endpointScopes = ['admin'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

	logger.verbose(
		'POST /plugins/vault/connect',
		req.auth.email
	);

	const { key, secret, coins } = req.body;

	updateVaultValues(key, secret)
		.then(() => crossCheckCoins(coins))
		.then((validCoins) => all([validCoins, createOrUpdateWallets(validCoins, key, secret)]))
		.then(([validCoins, wallets]) => {
			logger.debug(
				'POST /plugins/vault/connect new_connected_coins',
				validCoins
			);
			res.json({
				newly_connected_coins: validCoins,
				wallets
			});
		})
		.catch((err) => {
			logger.error(
				'POST /plugins/vault/connect catch',
				err.messsage
			)
			res.status(err.status || 400).json({ message: err.message });
		});
});
