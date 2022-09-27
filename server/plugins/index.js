'use strict';

const { checkStatus } = require('../init');
const express = require('express');
const PORT = process.env.PLUGIN_PORT || 10011;
const morgan = require('morgan');
const morganType = process.env.NODE_ENV === 'development' ? 'dev' : 'combined';
const { logEntryRequest, stream, loggerPlugin } = require('../config/logger');
const cors = require('cors');
const { domainMiddleware, helmetMiddleware } = require('../config/middleware');
const routes = require('./routes');
const { Plugin } = require('../db/models');
const path = require('path');
const fs = require('fs');
const latestVersion = require('latest-version');
const npm = require('npm-programmatic');
const sequelize = require('sequelize');
const pluginProcess = path.join(__dirname, "./plugin-process.js");
const fork = require('child_process').fork
const { createProxyMiddleware } = require('http-proxy-middleware');

let app;
let activePlugins = {}


const stopPlugin = async (plugin) => {
	try {
		loggerPlugin.verbose(
			'plugins/index/kill_plugin',
			`killing plugin ${plugin.name}`
		);

		activePlugins[plugin.name].process.kill();
		delete activePlugins[plugin.name];

	} catch (err) {
		loggerPlugin.error(
			'plugins/index/kill_plugin',
			`error while stopping plugin ${plugin.name}`,
			err.message
		);
	}
}

const startPlugin = async (plugin) => {
	try {
		loggerPlugin.verbose(
			'plugins/index/initialization',
			`starting plugin ${plugin.name}`
		);
		const pluginData = { PORT: 10011 + plugin.id, plugin }
		const childProcess = fork(pluginProcess);
		childProcess.send(JSON.stringify(pluginData));
		const subStr = plugin.script.match(/\"\/plugins(.*?)\"/g);

		activePlugins[plugin.name] = {
			process: childProcess,
			port: pluginData.PORT,
			endpoints: subStr || [],
		};


		loggerPlugin.verbose(
			'plugins/index/initialization',
			`Plugin ${plugin.name} running`
		);
	} catch (err) {
		loggerPlugin.error(
			'plugins/index/initialization',
			`error while starting plugin ${plugin.name}`,
			err.message
		);
	}
}


checkStatus()
	.then(async () => {
		loggerPlugin.info(
			'/plugins/index/initialization',
			'Initializing Plugin Server...'
		);

		app = express();

		app.use(morgan(morganType, { stream }));
		app.listen(PORT);
		app.use(cors());
		app.use(express.urlencoded({ extended: true }));
		app.use(express.json());
		app.use(logEntryRequest);
		app.use(domainMiddleware);
		helmetMiddleware(app);


		const customRouter = function (req) {
			if (req.path.length > 1 && req.path.includes('/plugins/')) {
				for (let plugin of Object.values(activePlugins)) {
					if (plugin.endpoints.some(endpoint => endpoint.includes(req.path))) {
						return `http://localhost:${plugin.port}`;
					}
				}
			}
			return `http://localhost:10012`;

		};

		const options = {
			target: 'http://localhost:10012',
			router: customRouter,
		};

		app.use('/plugins', routes, createProxyMiddleware(options));

		const plugins = await Plugin.findAll({
			where: {
				enabled: true,
				script: {
					[sequelize.Op.not]: null
				}
			},
			raw: true
		});

		for (const plugin of plugins) {
			const pluginData = { PORT: 10011 + plugin.id, plugin }
			const childProcess = fork(pluginProcess);
			childProcess.send(JSON.stringify(pluginData));
			const subStr = plugin.script.match(/\"\/plugins(.*?)\"/g);

			activePlugins[plugin.name] = {
				process: childProcess,
				port: pluginData.PORT,
				endpoints: subStr || [],
			};
		}

		loggerPlugin.info(
			'/plugins/index/initialization',
			`Plugin server running on port: ${PORT}`
		);
	})
	.catch((err) => {
		let message = 'Plugin Initialization failed';

		if (err.message) {
			message = err.message;
		}

		if (err.statusCode && err.statusCode === 402) {
			message = err.error.message;
		}

		loggerPlugin.error(
			'/plugins/index/initialization err',
			message
		);

		setTimeout(() => { process.exit(1); }, 5000);
	});

module.exports = {
	startPlugin,
	stopPlugin
}