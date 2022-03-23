
/**
	* Add your mock publicMeta and meta values in the object below
	* In production, these values are stored in the configuration JSON file

	* Example mock configurations are included below
**/

this.configValues = {
	// // ------------ CONFIG VALUES EXAMPLE START ------------

	// publicMeta: {
	// 	public_value: {
	// 		type: 'string',
	// 		description: 'Public meta value',
	// 		required: false,
	// 		value: 'i am public'
	// 	}
	// },
	// meta: {
	// 	private_value: {
	// 		type: 'string',
	// 		description: 'Private meta value',
	// 		required: true,
	// 		value: 'i am private'
	// 	}
	// }

	// // ------------ CONFIG VALUES EXAMPLE END ------------
};

const pluginScript = () => {
	/**
		* Add the plugin script here
		* The script within this function should be in the script.js file for a plugin

		* An example of a plugin script is included below
	 **/

	// // ------------ PLUGIN EXAMPLE START ------------

	// const { app, loggerPlugin, toolsLib } = this.pluginLibraries; // this.pluginLibraries holds app, loggerPlugin, and toolsLib in the plugin script
	// const { publicMeta, meta } = this.configValues; // this.configValues holds publicMeta and meta in the plugin script

	// const lodash = require('lodash');
	// const moment = require('moment');
	// const { public_value: { value: PUBLIC_VALUE } } = publicMeta;
	// const { private_value: { value: PRIVATE_VALUE } } = meta;

	// // All endpoints for a plugin should follow the format: '/plugins/<PLUGIN_NAME>/...'. For this example, the plugin name is 'test'
	// const HEALTH_ENDPOINT = '/plugins/test/health';
	// const CONFIG_VALUES_ENDPOINT = '/plugins/test/config-values';

	// // We recommend creating an init function that checks for all required configuration values and all other requirements for this plugin to run
	// const init = async () => {
	// 	loggerPlugin.verbose(
	// 		'DEV PLUGIN initializing...'
	// 	);

	// 	if (!lodash.isString(PRIVATE_VALUE)) {
	// 		throw new Error('Private Value must be configured for this plugin to run');
	// 	}

	// 	loggerPlugin.verbose(
	// 		'DEV PLUGIN initialized'
	// 	);
	// };

	// init()
	// 	.then(() => {
	// 		app.get(HEALTH_ENDPOINT, async (req, res) => {
	// 			loggerPlugin.info(
	// 				req.uuid,
	// 				HEALTH_ENDPOINT
	// 			);

	// 			return res.json({
	// 				status: 'running',
	// 				current_time: moment().toISOString(),
	// 				exchange_name: toolsLib.getKitConfig().info.name
	// 			});
	// 		});

	// 		app.get(CONFIG_VALUES_ENDPOINT, async (req, res) => {
	// 			loggerPlugin.info(
	// 				req.uuid,
	// 				CONFIG_VALUES_ENDPOINT
	// 			);

	// 			return res.json({
	// 				public_value: PUBLIC_VALUE,
	// 				private_value: PRIVATE_VALUE
	// 			});
	// 		});
	// 	})
	// 	.catch((err) => {
	// 		// It's important to catch all errors in a script. If a thrown error is not caught, the plugin process will exit and continuously try to restart
	// 		loggerPlugin.error(
	// 			'DEV PLUGIN initialization error',
	// 			err.message
	// 		);
	// 	});

	// // ------------ PLUGIN EXAMPLE END ------------
};








// BELOW IS THE SCRIPT FOR RUNNING THE PLUGIN DEV ENVIRONMENT THAT IS NOT NECESSARY IN THE PLUGIN ITSELF

const { checkStatus } = require('../init');

const initializeDevPlugin = async () => {
	await checkStatus();

	const morgan = require('morgan');
	const { logEntryRequest, stream, loggerPlugin } = require('../config/logger');
	const { domainMiddleware, helmetMiddleware } = require('../config/middleware');
	const morganType = process.env.NODE_ENV === 'development' ? 'dev' : 'combined';
	const PORT = 10012;
	const cors = require('cors');
	const toolsLib = require('hollaex-tools-lib');
	const express = require('express');

	const app = express();
	app.use(morgan(morganType, { stream }));
	app.listen(PORT);
	app.use(cors());
	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());
	app.use(logEntryRequest);
	app.use(domainMiddleware);
	helmetMiddleware(app);

	const pluginLibraries = {
		app,
		loggerPlugin,
		toolsLib
	};

	this.pluginLibraries = pluginLibraries;
};

(async () => {
	await initializeDevPlugin();
	pluginScript();
})();