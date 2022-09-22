'use strict';

const { publicMeta, meta } = this.configValues;
const {
	app,
	loggerPlugin,
	toolsLib
} = this.pluginLibraries;
const helloWorld = require('hello-world-npm');
const moment = require('moment');

const init = async () => {
	loggerPlugin.info(
		'HELLO-EXCHANGE PLUGIN initializing...'
	);

	if (!meta.private_message.value) {
		throw new Error('Configuration value private required');
	}
};

init()
	.then(() => {
		app.get('/plugins/hello-exchange/info', (req, res) => {
			loggerPlugin.verbose(
				req.uuid,
				'GET /plugins/hello-exchange/info'
			);

			return res.json({
				public_message: publicMeta.public_message.value,
				private_message: meta.private_message.value,
				library_message: helloWorld(),
				moment_timestamp: moment().toISOString(),
				exchange_info: toolsLib.getKitConfig().info
			});
		});
	})
	.catch((err) => {
		loggerPlugin.error(
			'HELLO-EXCHANGE PLUGIN error during initialization',
			err.message
		);
	});
