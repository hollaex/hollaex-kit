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
const lodash = require('lodash');
const pluginProcess = path.join(__dirname, './plugin-process.js');
const { Worker } = require('worker_threads');
const  { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware');
const validTimezones = require('tz-offset/generated/offsets.json');
const toolsLib = require('hollaex-tools-lib');

let app;
let pluginWorkerThread;

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

const restartPluginProcess = async () => {
	try {
		loggerPlugin.verbose(
			'plugins/index/kill_plugins',
			'killing plugins '
		);
		pluginWorkerThread.terminate();
		startPluginProcess();

	} catch (err) {
		loggerPlugin.error(
			'plugins/index/kill_plugins',
			'error while stopping plugins',
			err.message
		);
	}
};

const startPluginProcess = async () => {
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
		await installPlugin(plugin);

	}
	const pluginData = { PORT: 10012 };
	const childProcess = new Worker(pluginProcess, {
		workerData: JSON.stringify(pluginData)
	});

	pluginWorkerThread = childProcess;
};

const installPlugin = async (plugin) => {
	try {
		loggerPlugin.verbose(
			'plugins/index/initialization',
			`starting plugin ${plugin.name}`
		);

		if (plugin.prescript && lodash.isArray(plugin.prescript.install) && !lodash.isEmpty(plugin.prescript.install)) {
			loggerPlugin.verbose(
				'plugins/index/initialization',
				`Installing packages for plugin ${plugin.name}`
			);

			for (const library of plugin.prescript.install) {
				await installLibrary(library);
			}

			loggerPlugin.verbose(
				'plugins/index/initialization',
				`Plugin ${plugin.name} packages installed`
			);
		}

	} catch (err) {
		loggerPlugin.error(
			'plugins/index/initialization',
			`error while starting plugin ${plugin.name}`,
			err.message
		);
	}
};



const getTimezone = () => {
	const kitTimezone = toolsLib.getKitSecrets().emails.timezone;
	return isNumber(validTimezones[kitTimezone]) ? kitTimezone : 'Etc/UTC';
};

const unstakingCheckRunner = () => {
	cron.schedule('*/60 * * * * *', async () => {
		loggerPlugin.verbose(
			'/plugins unstaking status check start'
		);
		try {
			const stakerModel = getModel('staker');
			const stakePoolModel = getModel('stake');
			const stakerData = await stakerModel.findAll({ status: 'unstaking' });

			for (const staker of stakerData) {
				const user = await getUserByKitId(staker.user_id);
				const stakePool = await stakePoolModel.findOne({ id: staker.stake_id });

				const balance = await getUserBalanceByKitId(stakePool.account_id);
				let symbols = {};
				
				for (const key of Object.keys(balance)) {
					if (key.includes('available') && balance[key]) {
						let symbol = key?.split('_')?.[0];
						symbols[symbol] = balance[key];
					}
				}

				if (new BigNumber(symbols[stakePool.currency]).comparedTo(new BigNumber(staker.reward)) !== 1) {
					return sendEmail(
						MAILTYPE.ALERT,
						user.email,
						{
							type: 'Unstaking failed',
							data: `User id ${user.id} failed to unstake, not enough funds`
						},
						user.settings
					);
				}

				await toolsLib.wallet.transferAssetByKitIds(stakePool.account_id, staker.id, stakePool.currency, staker.reward, 'Admin transfer stake', user.email, {
					additionalHeaders: {
						'x-forwarded-for': req.headers['x-forwarded-for']
					}})
		
			}


		} catch (err) {
			loggerPlugin.error(
				'/plugins unstaking status check error:',
				err.message
			);
		}
	}, {
		scheduled: true,
		timezone: getTimezone()
	});
}

checkStatus()
	.then(async () => {
		loggerPlugin.info(
			'/plugins/index/initialization',
			'Initializing Plugin Server...'
		);

		unstakingCheckRunner();
		app = express();

		app.use(morgan(morganType, { stream }));
		app.listen(PORT);
		app.use(cors());
		app.use(logEntryRequest);
		app.use(domainMiddleware);
		helmetMiddleware(app);
		app.use(express.urlencoded({ extended: true }));
		app.use(express.json());
	
		const defaultURL = 'http://localhost:10012';
	
		const customRouter = function (req) {
			return defaultURL;
		};

		const options = {
			target: defaultURL,
			router: customRouter,
			changeOrigin: true,
			onProxyReq: fixRequestBody
		};


		app.use('/plugins', routes, createProxyMiddleware(options));

		startPluginProcess();

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
	restartPluginProcess
};