'use strict';

const app = require('../index');
const { verifyToken, checkScopes } = require('../helpers/auth');
const bodyParser = require('body-parser');
const { logger, isUrl, updatePluginConstant, maskSecrets } = require('../helpers/common');
const { NOT_AUTHORIZED } = require('../helpers/messages');
const { updateVaultValues, crossCheckCoins, createOrUpdateWallets, cronTask } = require('./helpers');
const { API_HOST } = require('../../constants');
const { GET_SECRETS } = require('../../constants');

cronTask.start();

app.get('/plugins/vault/constant', verifyToken, (req, res) => {
	const endpointScopes = ['admin', 'tech'];
	const scopes = req.auth.scopes;

	logger.verbose(
		'GET /plugins/vault/constant auth',
		req.auth.sub
	);

	if (!checkScopes(endpointScopes, scopes)) {
		logger.error('GET /plugins/vault/constant error', NOT_AUTHORIZED);
		return res.status(400).json({ message: NOT_AUTHORIZED });
	}

	try {
		res.json(maskSecrets('vault', GET_SECRETS().vault) || {});
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

app.put('/plugins/vault/constant', [verifyToken, bodyParser.json()], (req, res) => {
	const endpointScopes = ['admin', 'tech'];
	const scopes = req.auth.scopes;

	logger.verbose(
		'PUT /plugins/vault/constant auth',
		req.auth.sub
	);

	if (!checkScopes(endpointScopes, scopes)) {
		logger.error('PUT /plugins/vault/constant error', NOT_AUTHORIZED);
		return res.status(400).json({ message: NOT_AUTHORIZED });
	}

	if (req.body.length === 0) {
		logger.error('PUT /plugins/vault/constant error', 'Must provide key to update');
		return res.status(400).json({ message: 'Must provide key to update' });
	} else if (req.body.connected_coins) {
		logger.error('PUT /plugins/vault/constant error', 'Cannot update connected_coins');
		return res.status(400).json({ message: 'Cannot update connected_coins' });
	}

	logger.info(
		'PUT /plugins/vault/constant body',
		req.body
	);

	updatePluginConstant('vault', req.body)
		.then((data) => {
			res.json(data);
		})
		.catch((err) => {
			res.status(400).json({ message: err.message });
		});
});

app.post('/plugins/vault/connect', [verifyToken, bodyParser.json()], (req, res) => {
	const endpointScopes = ['admin'];
	const scopes = req.auth.scopes;

	logger.verbose(
		'POST /plugins/vault/connect',
		req.auth.email
	);

	if (!checkScopes(endpointScopes, scopes)) {
		logger.error('POST /plugins/vault/connect error', NOT_AUTHORIZED);
		return res.status(400).json({ message: NOT_AUTHORIZED });
	}

	if (!isUrl(API_HOST)) {
		return res.status(400).json({ message: `Server URL ${API_HOST} is not a valid URL` });
	}

	const { name, key, secret, coins } = req.body;

	updateVaultValues(name, key, secret)
		.then(() => crossCheckCoins(coins))
		.then((validCoins) => createOrUpdateWallets(validCoins))
		.then((wallets) => {
			logger.debug(
				'POST /plugins/vault/connect new_connected_coins',
				Object.keys(wallets)
			);
			res.json(wallets);
		})
		.catch((err) => {
			logger.error(
				'POST /plugins/vault/connect catch',
				err.messsage
			);
			res.status(err.status || 400).json({ message: err.message });
		});
});

app.get('/plugins/vault/disconnect', verifyToken, (req, res) => {
	const endpointScopes = ['admin'];
	const scopes = req.auth.scopes;

	logger.verbose(
		'GET /plugins/vault/disconnect',
		req.auth.email
	);

	if (!checkScopes(endpointScopes, scopes)) {
		logger.error('GET /plugins/vault/disconnect error', NOT_AUTHORIZED);
		return res.status(400).json({ message: NOT_AUTHORIZED });
	}

	updateVaultValues('', '', '', false)
		.then(() => {
			logger.debug('GET /plugins/vault/disconnect successful');
			res.json({ message: 'Vault disconnected' });
		})
		.catch((err) => {
			logger.error(
				'GET /plugins/vault/disconnect catch',
				err.message
			);
			res.status(err.status || 400).json({ message: err.message });
		});
});