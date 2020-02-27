'use strict';

const app = require('../index');
const { verifyToken, checkScopes } = require('../helpers/auth');
const bodyParser = require('body-parser');
const { logger } = require('../helpers/common');
const { getVaultCoins, checkVaultNames, createVaultWallets, checkVaultConnection } = require('./helpers');

app.post('/plugins/vault/connect', [verifyToken, bodyParser.json()], (req, res) => {
	const endpointScopes = ['admin'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

	logger.verbose(
		'POST /plugins/vault/connect',
		req.body
	);

	const coins = req.body.coins.split(',');
	const seed = req.body.seed;

	getVaultCoins(coins)
		.then(() => checkVaultNames(coins))
		.then(() => createVaultWallets(coins, seed))
		.then(([ seed ]) => {
			res.json({ seed });
		})
		.catch((err) => {
			logger.error(
				'POST /plugins/vault/connect catch',
				err.messsage
			)
			res.status(err.status || 400).json({ messasge: err.message });
		});
});

app.get('/plugins/vault/connect/check', verifyToken, (req, res) => {
	const endpointScopes = ['admin'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

	logger.verbose(
		'POST /plugins/vault/connect/check',
		req.body
	);

	const coin = req.query.coin;

	checkVaultConnection(coin)
		.then((data) => {
			logger.debug(
				'POST /plugins/vault/connect/check connected_coins',
				data
			);
			res.json({ connected_coins: data });
		})
		.catch((err) => {
			logger.error(
				'POST /plugins/vault/connect/check catch',
				err.messsage
			)
			res.status(err.status || 400).json({ messasge: err.message });
		})
});