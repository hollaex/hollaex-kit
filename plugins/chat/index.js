'use strict';

const app = require('../index');
const { verifyToken, checkScopes } = require('../helpers/auth');
const { GET_SECRETS } = require('../../constants');
const { logger, updatePluginConstant, maskSecrets } = require('../helpers/common');
const bodyParser = require('body-parser');

app.get('/plugins/chat/constant', verifyToken, (req, res) => {
	const endpointScopes = ['admin', 'tech'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

	logger.verbose(
		'GET /plugins/chat/constant auth',
		req.auth.sub
	);

	try {
		res.json(maskSecrets('chat', GET_SECRETS().plugins.chat) || {});
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

app.put('/plugins/chat/constant', [verifyToken, bodyParser.json()], (req, res) => {
	const endpointScopes = ['admin', 'tech'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

	logger.verbose(
		'PUT /plugins/chat/constant auth',
		req.auth.sub
	);

	if (req.body.length === 0) {
		logger.error('PUT /plugins/chat/constant error', 'Must provide key to update');
		return res.status(400).json({ message: 'Must provide key to update' });
	}

	logger.info(
		'PUT /plugins/chat/constant body',
		req.body
	);

	updatePluginConstant('chat', req.body)
		.then((data) => {
			res.json(data);
		})
		.catch((err) => {
			res.status(400).json({ message: err.message });
		});
});
