'use strict';

const express = require('express');
const app = express();
const { PLUGINS, PLUGIN_PORT } = require('./constants');

const PORT = PLUGIN_PORT

const plugins = PLUGINS.split(',');

app.get('/plugins', (req, res) => {
	res.send(`Plugins enabled: ${plugins}`);
});

app.listen(PORT);

module.exports = app;

plugins.forEach((plugin) => {
	if (plugin) {
		require('./' + plugin);
	}
});