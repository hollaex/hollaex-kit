'use strict';

const app = require('../index');
const { each } = require('lodash');
const { verifyToken, checkScopes } = require('../helpers/auth');
const bodyParser = require('body-parser');
const { logger } = require('../helpers/common');
const { getVaultCoins, checkVaultNames, createVaultWallets, checkVaultConnection } = require('./helpers');
const { isValidCurrency } = require('../../api/helpers/currency');

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

	each(coins, (coin) => {
		if (!isValidCurrency(coin)) {
			return res.status(400).json({ messasge: `${coin} does not exist in your exchange` });
		}

		if (require('../../init').getSecrets().vault.connected_coins.includes(coin)) {
			return res.status(400).json({ message: `${coin} is already connected to vault` });
		}
	});

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

	if (!isValidCurrency(coin)) {
		return res.status(400).json({ message: `${coin} does not exist in your exchange` });
	}

	if (require('../../init').getSecrets().vault.connected_coins.includes(coin)) {
		return res.status(400).json({ message: `${coin} is already connected to vault` });
	}

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