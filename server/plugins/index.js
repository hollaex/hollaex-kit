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
const _eval = require('eval');
const toolsLib = require('hollaex-tools-lib');
const lodash = require('lodash');
const expressValidator = require('express-validator');
const multer = require('multer');
const moment = require('moment');
const mathjs = require('mathjs');
const bluebird = require('bluebird');
const umzug = require('umzug');
const rp = require('request-promise');
const uuid = require('uuid/v4');
const jwt = require('jsonwebtoken');
const momentTz = require('moment-timezone');
const json2csv = require('json2csv');
const flat = require('flat');
const ws = require('ws');
const cron = require('node-cron');
const randomString = require('random-string');
const bcryptjs = require('bcryptjs');
const expectCt = require('expect-ct');
const validator = require('validator');
const otp = require('otp');
const geoipLite = require('geoip-lite');
const nodemailer = require('nodemailer');
const wsHeartbeatServer = require('ws-heartbeat/server');
const wsHeartbeatClient = require('ws-heartbeat/client');
const winston = require('winston');
const elasticApmNode = require('elastic-apm-node');
const winstonElasticsearchApm = require('winston-elasticsearch-apm');
const tripleBeam = require('triple-beam');
const uglifyEs = require('uglify-es');
const bodyParser = require('body-parser');

const getInstalledLibrary = async (name, version) => {
	const jsonFilePath = path.resolve(__dirname, '../node_modules', name, 'package.json');

	const fileData = fs.readFileSync(jsonFilePath);
	const parsedFileData = JSON.parse(fileData);

	loggerPlugin.verbose(
		'plugins/index/getInstalledLibrary',
		`${name} library found`
	);

	const checkVersion = version === 'latest' ? await latestVersion(name) : version;

	if (parsedFileData.version !== checkVersion) {
		throw new Error('Version does not match');
	}

	loggerPlugin.verbose(
		'plugins/index/getInstalledLibrary',
		`${name} version ${version} found`
	);

	const lib = require(name);
	return lib;
};

const installLibrary = async (library) => {
	const [name, version = 'latest'] = library.split('@');

	try {
		const data = await getInstalledLibrary(name, version);
		return data;
	} catch (err) {
		loggerPlugin.verbose(
			'plugins/index/installLibrary',
			`${name} version ${version} installing`
		);

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
	}
};

checkStatus()
	.then(async () => {
		loggerPlugin.info(
			'/plugins/index/initialization',
			'Initializing Plugin Server...'
		);

		const app = express();

		app.use(morgan(morganType, { stream }));
		app.listen(PORT);
		app.use(cors());
		app.use(express.urlencoded({ extended: true }));
		app.use(express.json());
		app.use(logEntryRequest);
		app.use(domainMiddleware);
		helmetMiddleware(app);

		app.use('/plugins', routes);

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
			try {
				loggerPlugin.verbose(
					'plugins/index/initialization',
					`starting plugin ${plugin.name}`
				);

				const context = {
					configValues: {
						publicMeta: plugin.public_meta,
						meta: plugin.meta
					},
					pluginLibraries: {
						app,
						loggerPlugin,
						toolsLib
					},
					app,
					toolsLib,
					lodash,
					expressValidator,
					loggerPlugin,
					multer,
					moment,
					mathjs,
					bluebird,
					umzug,
					rp,
					sequelize,
					uuid,
					jwt,
					momentTz,
					json2csv,
					flat,
					ws,
					cron,
					randomString,
					bcryptjs,
					expectCt,
					validator,
					uglifyEs,
					otp,
					latestVersion,
					geoipLite,
					nodemailer,
					wsHeartbeatServer,
					wsHeartbeatClient,
					cors,
					winston,
					elasticApmNode,
					winstonElasticsearchApm,
					tripleBeam,
					bodyParser,
					morgan,
					meta: plugin.meta,
					publicMeta: plugin.public_meta,
					installedLibraries: {}
				};

				if (plugin.prescript && lodash.isArray(plugin.prescript.install) && !lodash.isEmpty(plugin.prescript.install)) {
					loggerPlugin.verbose(
						'plugins/index/initialization',
						`Installing packages for plugin ${plugin.name}`
					);

					for (const library of plugin.prescript.install) {
						context.installedLibraries[library] = await installLibrary(library);
					}

					loggerPlugin.verbose(
						'plugins/index/initialization',
						`Plugin ${plugin.name} packages installed`
					);
				}

				_eval(plugin.script, plugin.name, context, true);

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