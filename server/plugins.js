'use strict';

var app = require('express')();
const _eval = require('eval');
const lodash = require('lodash');
const PORT = process.env.PLUGIN_PORT || 10011;
const toolsLib = require('hollaex-tools-lib');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const { checkSchema } = expressValidator;
const morgan = require('morgan');
const { logEntryRequest, stream, loggerPlugin } = require('./config/logger');
const { domainMiddleware, helmetMiddleware } = require('./config/middleware');
const morganType = process.env.NODE_ENV === 'development' ? 'dev' : 'combined';
const npmi = require('npmi');
const multer = require('multer');
const moment = require('moment');

const installLibrary = (library) => {
	return new Promise((resolve, reject) => {
		npmi({
			name: library,
			npmLoad: {
				save: false,
				forceInstall: false,
				loglevel: 'silent'
			}
		}, (err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve(require(library));
			}
		});
	});
};

app.use(morgan(morganType, { stream }));
app.listen(PORT);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logEntryRequest);
app.use(domainMiddleware);
helmetMiddleware(app);

app.get('/plugins', [
	checkSchema({
		limit: {
			in: ['query'],
			errorMessage: 'must be an integer',
			isInt: true,
			optional: true
		},
		page: {
			in: ['query'],
			errorMessage: 'must be an integer',
			isInt: true,
			optional: true
		}
	})
], (req, res) => {
	const errors = expressValidator.validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { limit, page } = req.query;

	toolsLib.plugin.getPaginatedPlugins(limit, page)
		.then((plugins) => {
			return res.json(plugins);
		})
		.catch((err) => {
			loggerPlugin.error(req.uuid, 'GET /plugins err', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
});

app.get('/plugin', [
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

	const name = req.query.name;

	toolsLib.plugin.getPlugin(name, {
		raw: true
	})
		.then((plugin) => {
			if (!plugin) {
				throw new Error('Plugin not found');
			}
			return res.json(plugin);
		})
		.catch((err) => {
			loggerPlugin.error(req.uuid, 'GET /plugin err', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
});

app.delete('/plugin', [
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
		'DELETE /plugins auth',
		req.auth.sub
	);

	const { name } = req.query;

	loggerPlugin.info(req.uuid, 'DELETE /plugins name', name);

	toolsLib.database.findOne('plugin', {
		where: { name }
	})
		.then((plugin) => {
			if (!plugin) {
				throw new Error('Plugin not found');
			}

			return plugin.destroy();
		})
		.then(() => {
			loggerPlugin.info(req.uuid, 'DELETE /plugins deleted plugin', name);

			res.json({ message: 'Success' });

			process.exit();
		})
		.catch((err) => {
			loggerPlugin.error(req.uuid, 'DELETE /plugins err', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
});

app.put('/plugin', [
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
		bio: {
			in: ['body'],
			errorMessage: 'must be a string',
			isString: true,
			optional: true
		},
		documentation: {
			in: ['body'],
			errorMessage: 'must be a string',
			isString: true,
			optional: true
		},
		icon: {
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
		admin_view: {
			in: ['body'],
			errorMessage: 'must be a string',
			isString: true,
			isLength: {
				errorMessage: 'must be minimum length of 5',
				options: { min: 5 }
			},
			optional: true
		},
		web_view: {
			in: ['body'],
			errorMessage: 'must be a string',
			isString: true,
			isLength: {
				errorMessage: 'must be minimum length of 5',
				options: { min: 5 }
			},
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
					if (value.run && !lodash.isString(value.run)) {
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

	const {
		name,
		script,
		version,
		description,
		author,
		url,
		icon,
		documentation,
		bio,
		web_view,
		admin_view,
		logo,
		prescript,
		postscript
	} = req.body;

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

			if (bio) {
				updatedPlugin.bio = bio;
			}

			if (documentation) {
				updatedPlugin.documentation = documentation;
			}

			if (icon) {
				updatedPlugin.icon = icon;
			}

			if (url) {
				updatedPlugin.url = url;
			}

			if (logo) {
				updatedPlugin.logo = logo;
			}

			if (web_view) {
				updatedPlugin.web_view = web_view;
			}

			if (admin_view) {
				updatedPlugin.admin_view = admin_view;
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

			res.json(plugin);

			if (plugin.enabled) {
				process.exit();
			}
		})
		.catch((err) => {
			loggerPlugin.error(req.uuid, 'POST /plugins err', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
});

app.post('/plugin', [
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
		bio: {
			in: ['body'],
			errorMessage: 'must be a string',
			isString: true,
			optional: true
		},
		documentation: {
			in: ['body'],
			errorMessage: 'must be a string',
			isString: true,
			optional: true
		},
		icon: {
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
		admin_view: {
			in: ['body'],
			errorMessage: 'must be a string',
			isString: true,
			isLength: {
				errorMessage: 'must be minimum length of 5',
				options: { min: 5 }
			},
			optional: true
		},
		web_view: {
			in: ['body'],
			errorMessage: 'must be a string',
			isString: true,
			isLength: {
				errorMessage: 'must be minimum length of 5',
				options: { min: 5 }
			},
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
					if (value.run && !lodash.isString(value.run)) {
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
					if (value.run && !lodash.isString(value.run)) {
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

	const {
		name,
		script,
		version,
		description,
		author,
		icon,
		bio,
		documentation,
		web_view,
		admin_view,
		url,
		logo,
		enabled,
		prescript,
		postscript,
		meta
	} = req.body;

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
				icon,
				bio,
				documentation,
				web_view,
				admin_view,
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

			res.json(plugin);

			if (plugin.enabled) {
				process.exit();
			}
		})
		.catch((err) => {
			loggerPlugin.error(req.uuid, 'POST /plugins err', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
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

	const { name, meta } = req.body;

	loggerPlugin.info(req.uuid, 'PUT /plugins/meta name', name);

	toolsLib.plugin.getPlugin(name)
		.then((plugin) => {
			if (!plugin) {
				throw new Error('Plugin not found');
			}

			return plugin.update({ meta }, { fields: ['meta']});
		})
		.then(() => {
			loggerPlugin.info(req.uuid, 'PUT /plugins/meta updated', name);

			res.json({ message: 'Success' });

			process.exit();
		})
		.catch((err) => {
			loggerPlugin.error(req.uuid, 'PUT /plugins/meta err', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
});

app.get('/plugin/disable', [
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

	toolsLib.plugin.getPlugin(name)
		.then((plugin) => {
			if (!plugin) {
				throw new Error('Plugin not found');
			}

			if (!plugin.enabled) {
				throw new Error('Plugin is already disabled');
			}

			return plugin.update({ enabled: false }, { fields: ['enabled']});
		})
		.then(() => {
			loggerPlugin.info(req.uuid, 'GET /plugins/disable disabled plugin', name);

			res.json({ message: 'Success' });

			process.exit();
		})
		.catch((err) => {
			loggerPlugin.error(req.uuid, 'GET /plugins/disable err', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
});

app.get('/plugin/enable', [
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

	toolsLib.plugin.getPlugin(name)
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
			loggerPlugin.info(req.uuid, 'GET /plugins/enable enabled plugin', name);

			res.json({ message: 'Success' });

			process.exit();
		})
		.catch((err) => {
			loggerPlugin.error(req.uuid, 'GET /plugins/enable err', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
});

toolsLib.database.findAll('plugin', {
	where: { enabled: true },
	raw: true
})
	.then(async (plugins) => {
		for (let plugin of plugins) {
			try {
				loggerPlugin.verbose('plugin', plugin.name, 'enabling');
				const context = {
					app,
					toolsLib,
					lodash,
					expressValidator,
					loggerPlugin,
					multer,
					moment,
					meta: plugin.meta,
					installedLibraries: {}
				};
				if (plugin.prescript.install) {
					loggerPlugin.verbose('plugin', plugin.name, 'installing packages');
					for (let library of plugin.prescript.install) {
						context.installedLibraries[library] = await installLibrary(library);
					}
					loggerPlugin.verbose('plugin', plugin.name, 'packages installed');
				}

				_eval(plugin.script, plugin.name, context, true);
				loggerPlugin.verbose('plugin', plugin.name, 'enabled');
			} catch (err) {
				loggerPlugin.error('plugin', plugin.name, 'error while installing prepackages', err.message);
			}
		}
	});