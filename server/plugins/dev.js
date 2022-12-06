'use strict';

const { checkStatus } = require('../init');
const express = require('express');
const morgan = require('morgan');
const PORT = process.env.PLUGIN_PORT || 10012;
const { logEntryRequest, stream, loggerPlugin } = require('../config/logger');
const morganType = process.env.NODE_ENV === 'development' ? 'dev' : 'combined';
const { domainMiddleware, helmetMiddleware } = require('../config/middleware');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const toolsLib = require('hollaex-tools-lib');
const expressValidator = require('express-validator');
const lodash = require('lodash');
const npm = require('npm-programmatic');
const _eval = require('eval');
const rp = require('request-promise');

const getPluginConfig = () => {
	return rp('http://host.docker.internal:8080/config.json');
};

let config, script;

const installLibrary = async (library) => {
	const [name, version = 'latest'] = library.split('@');
	await npm.install([`${name}@${version}`], {
		cwd: path.resolve(__dirname, '../'),
		save: true,
		output: true
	});

	loggerPlugin.verbose(
		'plugins/index/installLibrary',
		`${name} version ${version} installed`
	);

	const lib = require(name);
	return lib;

};

getPluginConfig()
	.then((data) => {
		data = JSON.parse(data);
		config = data;
		script = data.script;
		return checkStatus();
	})
	.then(async () => {
		const app = express();

		app.use(morgan(morganType, { stream }));
		app.listen(PORT);
		app.use(cors());
		app.use(express.urlencoded({ extended: true }));
		app.use(express.json());
		app.use(logEntryRequest);
		app.use(domainMiddleware);
		helmetMiddleware(app);

		const context = {
			exports: exports,
			require: require,
			module: module,
			toolsLib,
			app,
			loggerPlugin,
			expressValidator,
			pluginLibraries: {
				app,
				toolsLib,
				loggerPlugin
			},
			publicMeta: config.public_meta,
			meta: config.meta,
			configValues: {
				publicMeta: config.public_meta,
				meta: config.meta
			},
			installedLibraries: {}
		};

		if (config.prescript && lodash.isArray(config.prescript.install) && !lodash.isEmpty(config.prescript.install)) {
			loggerPlugin.verbose(
				'plugins/index/initialization',
				`Installing packages for plugin ${config.name}`
			);

			for (const library of config.prescript.install) {
				context.installedLibraries[library] = await installLibrary(library);
			}

			loggerPlugin.verbose(
				'plugins/index/initialization',
				`Plugin ${config.name} packages installed`
			);
		}

		_eval(script, 'dev', context, true);
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