'use strict';

const express = require('express');
const cors = require('cors');
const app = express();
const { PLUGIN_PORT } = require('./constants');
const { DOMAIN, GET_CONFIGURATION } = require('../constants');
const { readdirSync } = require('fs');

const PLUGINS = () => GET_CONFIGURATION().constants.plugins.enabled || process.env.PLUGINS || '';
const CORS_WHITELIST = [DOMAIN, 'http://localhost:8080', 'http://localhost:3000'];

const PORT = PLUGIN_PORT;

const enabledPlugins = () => PLUGINS().split(',');

const availablePlugins = readdirSync(__dirname, { withFileTypes: true })
	.filter(dirent => dirent.isDirectory() && dirent.name !== 'helpers' && dirent.name !== 'node_modules' & dirent.name !== 'crons' && dirent.name !== 'jobs')
	.map(dirent => dirent.name);

app.get('/plugins', (req, res) => {
	res.json({
		enabled: enabledPlugins(),
		available: availablePlugins
	});
});

app.listen(PORT);

const corsOptions = {
	origin: function (origin, callback) {
		if (CORS_WHITELIST.indexOf(origin) !== -1) {
			callback (null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	}
};

app.use(cors());

module.exports = app;

// Require every plugin for now
availablePlugins.forEach((plugin) => {
	if (plugin) {
		require('./' + plugin);
	}
});