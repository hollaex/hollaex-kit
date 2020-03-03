'use strict';

const app = require('../index');
const { verifyToken, checkScopes } = require('../helpers/auth');
const bodyParser = require('body-parser');
const { logger } = require('../helpers/common');
const { updateVaultValues, crossCheckCoins, createOrUpdateWallets, isUrl } = require('./helpers');
const { all } = require('bluebird');
const { each } = require('lodash');
const { API_HOST } = require('../../constants');

app.post('/plugins/vault/connect', [verifyToken, bodyParser.json()], (req, res) => {
	const endpointScopes = ['admin'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

	logger.verbose(
		'POST /plugins/vault/connect',
		req.auth.email
	);

	if (!isUrl(API_HOST)) {
		return res.status(400).json({ message: `Server URL ${API_HOST} is not a valid URL`});
	}

	const { key, secret, coins } = req.body;

	crossCheckCoins(coins)
		.then((validCoins) => all([validCoins, createOrUpdateWallets(validCoins, key, secret)]))
		.then((data) => all([ ...data, updateVaultValues(key, secret)]))
		.then(([validCoins, wallets]) => {
			const connectedWallets = {};
			each(wallets, (wallet) => {
				connectedWallets[wallet.currency] = wallet;
			});
			logger.debug(
				'POST /plugins/vault/connect new_connected_coins',
				validCoins
			);
			res.json(connectedWallets);
		})
		.catch((err) => {
			logger.error(
				'POST /plugins/vault/connect catch',
				err.messsage
			)
			res.status(err.status || 400).json({ message: err.message });
		});
});
