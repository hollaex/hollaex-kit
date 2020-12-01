'use strict';

var app = require('express')();
const _eval = require('eval');
const lodash = require('lodash');
const PORT = process.env.PLUGIN_PORT || 10090;
const toolsLib = require('hollaex-tools-lib');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const { checkSchema } = expressValidator;
const morgan = require('morgan');
const { logEntryRequest, stream, loggerPlugin } = require('./config/logger');
const { domainMiddleware, helmetMiddleware } = require('./config/middleware');
const morganType = process.env.NODE_ENV === 'development' ? 'dev' : 'combined';

app.use(morgan(morganType, { stream }));
app.listen(PORT);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logEntryRequest);
app.use(domainMiddleware);
helmetMiddleware(app);

app.get('/plugins', (req, res) => {
	res.json({ message: 'Welcome to HollaEx Plugins' });
});

app.post('/plugins', [
	toolsLib.security.verifyBearerTokenExpressMiddleware(['admin']),
	checkSchema({
		name: {
			in: ['body'],
			errorMessage: 'must be a string',
			isString: true,
			isLength: {
				errorMessage: 'must be minimum length of 1',
				options: { min: 1 }
			},
			optional: false
		},
		script: {
			in: ['body'],
			errorMessage: 'must be a string',
			isString: true,
			isLength: {
				errorMessage: 'must be minimum length of 5',
				options: { min: 5 }
			},
			optional: false
		},
		version: {
			in: ['body'],
			errorMessage: 'must be a number',
			isNumeric: true,
			optional: false
		},
		description: {
			in: ['body'],
			errorMessage: 'must be a string',
			isString: true,
			optional: true
		},
		author: {
			in: ['body'],
			errorMessage: 'must be a string',
			isString: true,
			optional: true
		},
		url: {
			in: ['body'],
			errorMessage: 'must be a string',
			isString: true,
			optional: true
		},
		logo: {
			in: ['body'],
			errorMessage: 'must be a string',
			isString: true,
			optional: true
		},
		enabled: {
			in: ['body'],
			errorMessage: 'must be a boolean',
			isBoolean: true,
			optional: true
		}
	})
], (req, res) => {
	const errors = expressValidator.validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	loggerPlugin.verbose(
		req.uuid,
		'GET /plugins auth',
		req.auth.sub
	);

	const { name, script, version, description, author, url, logo, enabled } = req.body;

	loggerPlugin.info(req.uuid, 'POST /plugins name', name, 'version', version);

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
			loggerPlugin.info(req.uuid, 'POST /plugins installed', name);
			if (plugin.enabled) {
				loggerPlugin.info(req.uuid, 'POST /plugins enabled', name);
				_eval(plugin.script, plugin.name, { app, toolsLib, lodash, expressValidator }, true);
			}
			return res.json(plugin);
		})
		.catch((err) => {
			loggerPlugin.error(req.uuid, 'POST /plugins err', err.name);
			return res.status(err.status || 400).json({ message: err.message });
		});
});

toolsLib.database.findAll('plugin', {
	where: { enabled: true },
	raw: true
})
	.then((plugins) => {
		lodash.each(plugins, (plugin) => {
			loggerPlugin.verbose('plugin', plugin.name, 'enabled');
			_eval(plugin.script, plugin.name, { app, toolsLib, lodash, expressValidator, loggerPlugin }, true);
		});
	});