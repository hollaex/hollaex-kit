'use strict';

const express = require('express');
const cors = require('cors');
const app = express();
const { PLUGIN_PORT, AVAILABLE_PLUGINS } = require('./constants');
const { GET_CONFIGURATION } = require('../constants');

const PLUGINS = () => GET_CONFIGURATION().constants.plugins.enabled || process.env.PLUGINS || '';

const PORT = PLUGIN_PORT;

const enabledPlugins = () => PLUGINS().split(',');

app.get('/plugins', (req, res) => {
	res.json({
		enabled: enabledPlugins(),
		available: AVAILABLE_PLUGINS
	});
});

app.listen(PORT);

app.use(cors());

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