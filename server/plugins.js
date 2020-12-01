'use strict';

// run server (express)
// populate plugin DB scripts using library


// possible challenge (new libaries not included in package.json)

var app = require('express')();
const _eval = require('eval');
const lodash = require('lodash');
const PORT = process.env.PLUGIN_PORT || 10090;
const toolsLib = require('hollaex-tools-lib');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const { loggerPlugin } = require('./config/logger');

app.listen(PORT);
app.use(bodyParser.json());

app.get('/plugins', (req, res) => {
	res.json({ message: 'Welcome to HollaEx Plugins' });
});

app.post('/plugins', [
	toolsLib.security.verifyBearerTokenExpressMiddleware(['admin']),
	expressValidator.body('name').isString().isLength({ min: 1 }).withMessage('must be a string with at least 1 character'),
	expressValidator.body('script').isString().isLength({ min: 5 }).withMessage('must be a string with at least 5 characters'),
	expressValidator.body('version').isNumeric()
], (req, res) => {
	const errors = expressValidator.validationResult(req);
	if (!errors.isEmpty()) {
		loggerPlugin.error('POST /plugins validation error');
		return res.status(400).json({ errors: errors.array() });
	}

	const { name, script, version, description, author, url, logo, enabled } = req.body;

	loggerPlugin.verbose('POST /plugins name', name, 'version', version);

	toolsLib.database.findOne('plugin', {
		where: { name, version }
	})
		.then((plugin) => {
			if (plugin) {
				throw new Error('Plugin with same version already installed');
			}
			return toolsLib.database.create('plugin', {
				name,
				script,
				version,
				description,
				author,
				url,
				logo,
				enabled
			});
		})
		.then((plugin) => {
			loggerPlugin.info('POST /plugins installed', name);
			if (plugin.enabled) {
				loggerPlugin.info('POST /plugins enabled', name);
				_eval(plugin.script, plugin.name, { app, toolsLib, lodash, expressValidator }, true);
			}
			return res.json(plugin);
		})
		.catch((err) => {
			loggerPlugin.error('POST /plugins err', err.name);
			return res.status(err.status || 400).json({ message: err.message });
		});
});

toolsLib.database.findAll('plugin', {
	where: { enabled: true },
	raw: true
})
	.then((plugins) => {
		lodash.each(plugins, (plugin) => {
			_eval(plugin.script, plugin.name, { app, toolsLib, lodash, expressValidator, loggerPlugin }, true);
		});
	});