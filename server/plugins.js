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
const npmi = require('npmi');

const installLibrary = (library) => {
	return new Promise((resolve, reject) => {
		npmi({ name: library }, (err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve(require(library));
			}
		});
	});
};
// url returns json file
// if url is set, plugins is upgrades automatically

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

app.put('/plugins/meta', [
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
		meta: {
			in: ['body'],
			custom: {
				options: (value) => {
					return lodash.isPlainObject(value);
				},
				errorMessage: 'must be an object'
			},
			optional: false
		}
	})
], (req, res) => {
	const errors = expressValidator.validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	loggerPlugin.verbose(
		req.uuid,
		'PUT /plugins/meta auth',
		req.auth.sub
	);

	const { name, meta } = req.query;

	loggerPlugin.info(req.uuid, 'PUT /plugins/meta name', name);

	toolsLib.database.findOne('plugin', {
		where: { name }
	})
		.then((plugin) => {
			if (!plugin) {
				throw new Error('Plugin not found');
			}

			return plugin.update({ meta }, { fields: ['meta']});
		})
		.then(() => {
			loggerPlugin.info(req.uuid, 'PUT /plugins/meta updated', name);

			// restart plugin

			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerPlugin.error(req.uuid, 'PUT /plugins/meta err', err.name);
			return res.status(err.status || 400).json({ message: err.message });
		});
});

app.get('/plugins/disable', [
	toolsLib.security.verifyBearerTokenExpressMiddleware(['admin']),
	checkSchema({
		name: {
			in: ['query'],
			errorMessage: 'must be a string',
			isString: true,
			isLength: {
				errorMessage: 'must be minimum length of 1',
				options: { min: 1 }
			},
			optional: false
		}
	})
], (req, res) => {
	const errors = expressValidator.validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	loggerPlugin.verbose(
		req.uuid,
		'GET /plugins/disable auth',
		req.auth.sub
	);

	const { name } = req.query;

	loggerPlugin.info(req.uuid, 'GET /plugins/disable name', name);

	toolsLib.database.findOne('plugin', {
		where: { name }
	})
		.then((plugin) => {
			if (!plugin) {
				throw new Error('Plugin not found');
			}

			if (!plugin.enabled) {
				throw new Error('Plugin is already disabled');
			}

			// stop plugin

			return plugin.update({ enabled: false }, { fields: ['enabled']});
		})
		.then(() => {
			loggerPlugin.info(req.uuid, 'GET /plugins/disable disabled plugin', name);

			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerPlugin.error(req.uuid, 'GET /plugins/disable err', err.name);
			return res.status(err.status || 400).json({ message: err.message });
		});
});

app.get('/plugins/enable', [
	toolsLib.security.verifyBearerTokenExpressMiddleware(['admin']),
	checkSchema({
		name: {
			in: ['query'],
			errorMessage: 'must be a string',
			isString: true,
			isLength: {
				errorMessage: 'must be minimum length of 1',
				options: { min: 1 }
			},
			optional: false
		}
	})
], (req, res) => {
	const errors = expressValidator.validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	loggerPlugin.verbose(
		req.uuid,
		'GET /plugins/enable auth',
		req.auth.sub
	);

	const { name } = req.query;

	loggerPlugin.info(req.uuid, 'GET /plugins/enable name', name);

	toolsLib.database.findOne('plugin', {
		where: { name }
	})
		.then((plugin) => {
			if (!plugin) {
				throw new Error('Plugin not found');
			}

			if (plugin.enabled) {
				throw new Error('Plugin is already enabled');
			}

			return plugin.update({ enabled: true }, { fields: ['enabled']});
		})
		.then(() => {
			// start plugin
			loggerPlugin.info(req.uuid, 'GET /plugins/enable enabled plugin', name);

			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerPlugin.error(req.uuid, 'GET /plugins/enable err', err.name);
			return res.status(err.status || 400).json({ message: err.message });
		});
});

app.delete('/plugins', [
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
		}
	})
], (req, res) => {
	const errors = expressValidator.validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	loggerPlugin.verbose(
		req.uuid,
		'DELETE /plugins auth',
		req.auth.sub
	);

	const { name } = req.body;

	loggerPlugin.info(req.uuid, 'DELETE /plugins name', name);

	toolsLib.database.findOne('plugin', {
		where: { name }
	})
		.then((plugin) => {
			if (!plugin) {
				throw new Error('Plugin not found');
			}

			//Stop plugin from running

			return plugin.destroy();
		})
		.then(() => {
			loggerPlugin.info(req.uuid, 'DELETE /plugins deleted plugin', name);
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerPlugin.error(req.uuid, 'DELETE /plugins err', err.name);
			return res.status(err.status || 400).json({ message: err.message });
		});
});

app.put('/plugins', [
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
		},
		prescript: {
			in: ['body'],
			custom: {
				options: (value) => {
					if (!lodash.isPlainObject(value)) {
						return false;
					}
					if (value.install && lodash.isArray(value.install)) {
						lodash.each(value.install, (lib) => {
							if (!lodash.isString(lib)) {
								return false;
							}
						});
					}
					if (value.run && lodash.isString(value.run)) {
						return false;
					}
					return true;
				},
				errorMessage: 'must be an object. install value must be an array of strings. run value must be a string'
			},
			optional: true
		},
		postscript: {
			in: ['body'],
			custom: {
				options: (value) => {
					if (!lodash.isPlainObject(value)) {
						return false;
					}
					if (value.run && lodash.isString(value.run)) {
						return false;
					}
					return true;
				},
				errorMessage: 'must be an object. run value must be a string'
			},
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
		'PUT /plugins auth',
		req.auth.sub
	);

	const { name, script, version, description, author, url, logo, enabled, prescript, postscript } = req.body;

	loggerPlugin.info(req.uuid, 'PUT /plugins name', name, 'version', version);

	toolsLib.database.findOne('plugin', {
		where: { name }
	})
		.then((plugin) => {
			if (!plugin) {
				throw new Error('Plugin not installed');
			}
			if (plugin.version === version) {
				throw new Error('Version is already installed');
			}

			const updatedPlugin = {
				script,
				version
			};

			if (description) {
				updatedPlugin.description = description;
			}

			if (author) {
				updatedPlugin.author = author;
			}

			if (url) {
				updatedPlugin.url = url;
			}

			if (logo) {
				updatedPlugin.logo = logo;
			}

			if (lodash.isBoolean(enabled)) {
				updatedPlugin.enabled = enabled;
			}

			if (lodash.isPlainObject(prescript)) {
				updatedPlugin.prescript = prescript;
			}

			if (lodash.isPlainObject(postscript)) {
				updatedPlugin.postscript = postscript;
			}

			return plugin.update(updatedPlugin);
		})
		.then(async (plugin) => {
			loggerPlugin.info(req.uuid, 'PUT /plugins updated', name);
			// if (plugin.enabled) {
			// 	try {
			// 		const context = {
			// 			app,
			// 			toolsLib,
			// 			lodash,
			// 			expressValidator,
			// 			loggerPlugin,
			// 			meta: plugin.meta,
			// 			installedLibraries: {}
			// 		};

			// 		if (plugin.prescript.install) {
			// 			for (let library of plugin.prescript.install) {
			// 				context.installedLibraries[library] = await installLibrary(library);
			// 			}
			// 		}

			// 		loggerPlugin.info(req.uuid, 'POST /plugins enabled', name);
			// 		_eval(plugin.script, plugin.name, { app, toolsLib, lodash, expressValidator }, true);
			// 	} catch (err) {
			// 		loggerPlugin.error(req.uuid, 'POST /plugins error while running script', err.message);
			// 		throw err;
			// 	}
			// }

			// stop plugin and restart
			return res.json(plugin);
		})
		.catch((err) => {
			loggerPlugin.error(req.uuid, 'POST /plugins err', err.name);
			return res.status(err.status || 400).json({ message: err.message });
		});
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
		},
		prescript: {
			in: ['body'],
			custom: {
				options: (value) => {
					if (!lodash.isPlainObject(value)) {
						return false;
					}
					if (value.install && lodash.isArray(value.install)) {
						lodash.each(value.install, (lib) => {
							if (!lodash.isString(lib)) {
								return false;
							}
						});
					}
					if (value.run && lodash.isString(value.run)) {
						return false;
					}
					return true;
				},
				errorMessage: 'must be an object. install value must be an array of strings. run value must be a string'
			},
			optional: true
		},
		postscript: {
			in: ['body'],
			custom: {
				options: (value) => {
					if (!lodash.isPlainObject(value)) {
						return false;
					}
					if (value.run && lodash.isString(value.run)) {
						return false;
					}
					return true;
				},
				errorMessage: 'must be an object. run value must be a string'
			},
			optional: true
		},
		meta: {
			in: ['body'],
			custom: {
				options: (value) => {
					return lodash.isPlainObject(value);
				},
				errorMessage: 'must be an object'
			},
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
		'POST /plugins auth',
		req.auth.sub
	);

	const { name, script, version, description, author, url, logo, enabled, prescript, postscript, meta } = req.body;

	loggerPlugin.info(req.uuid, 'POST /plugins name', name, 'version', version);

	toolsLib.database.findOne('plugin', {
		where: { name }
	})
		.then((plugin) => {
			if (plugin) {
				throw new Error('Plugin is already installed');
			}
			return toolsLib.database.create('plugin', {
				name,
				script,
				version,
				description,
				author,
				url,
				logo,
				enabled,
				prescript,
				postscript,
				meta
			});
		})
		.then(async (plugin) => {
			loggerPlugin.info(req.uuid, 'POST /plugins installed', name);
			if (plugin.enabled) {
				try {
					const context = {
						app,
						toolsLib,
						lodash,
						expressValidator,
						loggerPlugin,
						meta: plugin.meta,
						installedLibraries: {}
					};

					if (plugin.prescript.install) {
						for (let library of plugin.prescript.install) {
							context.installedLibraries[library] = await installLibrary(library);
						}
					}

					loggerPlugin.info(req.uuid, 'POST /plugins enabled', name);
					_eval(plugin.script, plugin.name, { app, toolsLib, lodash, expressValidator }, true);
				} catch (err) {
					loggerPlugin.error(req.uuid, 'POST /plugins error while running script', err.message);
					throw err;
				}
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
	.then(async (plugins) => {
		for (let plugin of plugins) {
			console.log(plugin.name)
			loggerPlugin.verbose('plugin', plugin.name, 'enabled');
			try {
				const context = {
					app,
					toolsLib,
					lodash,
					expressValidator,
					loggerPlugin,
					meta: plugin.meta,
					installedLibraries: {}
				};

				if (plugin.prescript.install) {
					for (let library of plugin.prescript.install) {
						context.installedLibraries[library] = await installLibrary(library);
					}
				}

				_eval(plugin.script, plugin.name, context, true);
			} catch (err) {
				loggerPlugin.error('plugin', plugin.name, 'error while installing prepackages', err.message);
			}
		}
	});
