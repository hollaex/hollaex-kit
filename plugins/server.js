'use strict';

const express = require('express');
const app = express();

const PORT = process.env.PLUGIN_PORT || 10011;

const PLUGINS = process.env.PLUGINS || '';
const plugins = PLUGINS.split(',');

plugins.forEach((plugin) => {
	if (plugin) {
		require('./' + plugin);
	}
});

app.get('/', (req, res) => {
	res.send('Welcome to HollaEx plugin');
});

app.listen(PORT);

module.exports = app;