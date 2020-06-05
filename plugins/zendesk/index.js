'use strict';

const app = require('../index');
const { verifyToken, checkScopes } = require('../helpers/auth');
const { GET_SECRETS } = require('../../constants');
const { logger, updatePluginConstant, maskSecrets } = require('../helpers/common');
const bodyParser = require('body-parser');

app.get('/plugins/zendesk/constant', verifyToken, (req, res) => {
	const endpointScopes = ['admin', 'tech'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

	logger.verbose(
		'GET /plugins/zendesk/constant auth',
		req.auth.sub
	);

	res.json(maskSecrets('zendesk', GET_SECRETS().plugins.zendesk) || {});
});

app.put('/plugins/zendesk/constant', [verifyToken, bodyParser.json()], (req, res) => {
	const endpointScopes = ['admin', 'tech'];
	const scopes = req.auth.scopes;
	checkScopes(endpointScopes, scopes);

	logger.verbose(
		'PUT /plugins/zendesk/constant auth',
		req.auth.sub
	);

	if (req.body.length === 0) {
		logger.error('PUT /plugins/zendesk/constant error', 'Must provide key to update');
		return res.status(400).json({ message: 'Must provide key to update' });
	}

	logger.info(
		'PUT /plugins/zendesk/constant body',
		req.body
	);

	updatePluginConstant('zendesk', req.body)
		.then((data) => {
			res.json(data);
		});
});
