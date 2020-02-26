'use strict';

const app = require('../index');
const { verifyToken, checkScopes } = require('../helpers/auth');
const bodyParser = require('body-parser');
const rp = require('request-promise');
const { all } = require('bluebird');
const { logger } = require('../helpers/common');
const { getVaultCoins, checkVaultNames } = require('./helpers');

app.post('/plugins/vault/connect', [bodyParser.json()], (req, res) => {
	// const endpointScopes = ['admin'];
	// const scopes = req.auth.scopes;
	// checkScopes(endpointScopes, scopes);

	const coins = req.body.coins.split(',');


	getVaultCoins(coins)
		.then(() => checkVaultNames(coins))
		.then(() => res.json({ message: 'resol'}))
		.catch((err) => {
			res.status(err.status || 400).json({ messasge: err.message });
		});
});

//get coins

//for each
// checkName
// createWallet