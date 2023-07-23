'use strict';

const { checkStatus } = require('../init');
const express = require('express');
const morgan = require('morgan');
const PORT = 10013;
const { logEntryRequest, stream, loggerPlugin } = require('../config/logger');
const morganType = process.env.NODE_ENV === 'development' ? 'dev' : 'combined';
const { domainMiddleware, helmetMiddleware } = require('../config/middleware');
const cors = require('cors');
const sequelize = require('sequelize');
const bodyParser = require('body-parser');
const uglifyJs = require('uglify-js');
const fs = require('fs');
const path = require('path');
const toolsLib = require('hollaex-tools-lib');
const expressValidator = require('express-validator');
const lodash = require('lodash');
const npm = require('npm-programmatic');
const _eval = require('eval');
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

let pluginName = 'hello';
if (process.argv.slice(2).length && process.argv.slice(2)[0].split('=')[1]) {
	pluginName = process.argv.slice(2).length && process.argv.slice(2)[0].split('=')[1];
}

loggerPlugin.info(
	'plugins/index Running dev mode for plugin:',
	`${pluginName}`
);

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

config = require(`../dev-plugins/${pluginName}/server/config.json`);
script = fs.readFileSync(path.resolve(__dirname, `../dev-plugins/${pluginName}/server/script.js`), 'utf8');

checkStatus()
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
			uglifyJs,
			otp,
			geoipLite,
			nodemailer,
			wsHeartbeatServer,
			wsHeartbeatClient,
			cors,
			winston,
			bodyParser,
			morgan,
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