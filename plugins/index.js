'use strict';

const express = require('express');
const cors = require('cors');
const app = express();
const { PLUGIN_PORT, AVAILABLE_PLUGINS } = require('./constants');
const { DOMAIN, GET_CONFIGURATION, GET_SECRETS } = require('../constants');

const PLUGINS = () => GET_CONFIGURATION().constants.plugins.enabled || process.env.PLUGINS || '';
const ALLOWED_DOMAINS = () => GET_SECRETS().allowed_domains || [DOMAIN, 'http://localhost:8080', 'http://localhost:3000'];

const PORT = PLUGIN_PORT;

const enabledPlugins = () => PLUGINS().split(',');

app.get('/plugins', (req, res) => {
	res.json({
		enabled: enabledPlugins(),
		available: AVAILABLE_PLUGINS
	});
});

app.listen(PORT);

const corsOptions = {
	origin: function (origin, callback) {
		if (ALLOWED_DOMAINS().indexOf(origin) !== -1) {
			callback (null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	}
};

app.use(cors(corsOptions));

module.exports = app;

// Require every plugin for now
AVAILABLE_PLUGINS.forEach((plugin) => {
	if (plugin) {
		try {
			require('./' + plugin);
		} catch (err)  {
			console.log(`${plugin} directory does not exist`);
		}
	}
});