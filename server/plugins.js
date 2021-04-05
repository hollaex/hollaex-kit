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
const multer = require('multer');
const moment = require('moment');
const { checkStatus } = require('./init');
const UglifyJS = require('uglify-es');
const cors = require('cors');
const mathjs = require('mathjs');
const bluebird = require('bluebird');
const rp = require('request-promise');
const uuid = require('uuid/v4');
const fs = require('fs');
const path = require('path');
const latestVersion = require('latest-version');
const { resolve } = bluebird;
const npm = require('npm-programmatic');
const { Op } = require('sequelize');

const getInstalledLibrary = async (name, version) => {
	const jsonFilePath = path.resolve(__dirname, './node_modules', name, 'package.json');

	let fileData = fs.readFileSync(jsonFilePath);
	fileData = JSON.parse(fileData);

	loggerPlugin.verbose(`${name} library found`);
	if (version === 'latest') {
		const v = await latestVersion(name);
		if (fileData.version === v) {
			loggerPlugin.verbose(`${name} version ${version} found`);
			const lib = require(name);
			return resolve(lib);
		} else {
			throw new Error('Version does not match');
		}
	} else {
		if (fileData.version === version) {
			loggerPlugin.verbose(`${name} version ${version} found`);
			const lib = require(name);
			return resolve(lib);
		} else {
			throw new Error('Version does not match');
		}
	}
};

const installLibrary = (library) => {
	const [name, version = 'latest'] = library.split('@');
	return getInstalledLibrary(name, version)
		.then((data) => {
			return data;
		})
		.catch((err) => {
			loggerPlugin.verbose(`${name} version ${version} installing`);
			return npm.install([`${name}@${version}`], {
				cwd: path.resolve(__dirname, './'),
				save: true,
				output: true
			});
		})
		.then(() => {
			loggerPlugin.verbose(`${name} version ${version} installed`);
			const lib = require(name);
			return lib;
		});
};

app.use(morgan(morganType, { stream }));
app.listen(PORT);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logEntryRequest);
app.use(domainMiddleware);
helmetMiddleware(app);

checkStatus()
	.then((nodeLib) => {
		if (nodeLib) {
			app.get('/plugins', [
				checkSchema({
					name: {
						in: ['query'],
						errorMessage: 'must be a string',
						isString: true,
						isLength: {
							errorMessage: 'must be minimum length of 1',
							options: { min: 1 }
						},
						optional: true
					},
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
					},
					search: {
						in: ['query'],
						errorMessage: 'must be a string',
						isString: true,
						isLength: {
							errorMessage: 'must be minimum length of 1',
							options: { min: 1 }
						},
						optional: true
					}
				})
			], (req, res) => {
				const errors = expressValidator.validationResult(req);
				if (!errors.isEmpty()) {
					return res.status(400).json({ errors: errors.array() });
				}

				const { limit, page, name, search } = req.query;

				let promiseQuery = toolsLib.plugin.getPaginatedPlugins(limit, page, search);

				if (name) {
					promiseQuery = toolsLib.plugin.getPlugin(
						name,
						{
							raw: true,
							attributes: [
								'name',
								'version',
								'enabled',
								'author',
								'description',
								'bio',
								'url',
								'logo',
								'icon',
								'documentation',
								'web_view',
								'admin_view',
								'created_at',
								'updated_at'
							]
						}
					);
				}

				promiseQuery
					.then((plugins) => {
						if (name) {
							if (!plugins) {
								throw new Error('Plugin not found');
							} else {
								plugins.enabled_admin_view = !!plugins.admin_view;
								delete plugins.admin_view;
							}
						}
						return res.json(plugins);
					})
					.catch((err) => {
						loggerPlugin.error(req.uuid, 'GET /plugins err', err.message);
						return res.status(err.status || 400).json({ message: err.message });
					});
			});

			app.delete('/plugins', [
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

				toolsLib.plugin.getPlugin(name)
					.then((plugin) => {
						if (!plugin) {
							throw new Error('Plugin not found');
						}

						return bluebird.all([
							plugin,
							plugin.destroy()
						]);
					})
					.then(([ { enabled, script } ]) => {
						loggerPlugin.info(req.uuid, 'DELETE /plugins deleted plugin', name);

						res.json({ message: 'Success' });

						if (enabled && script) {
							process.exit();
						}
					})
					.catch((err) => {
						loggerPlugin.error(req.uuid, 'DELETE /plugins err', err.message);
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
						optional: true
					},
					version: {
						in: ['body'],
						errorMessage: 'must be a number',
						isNumeric: true,
						optional: false
					},
					description: {
						in: ['body'],
						errorMessage: 'must be a string or null',
						isString: true,
						optional: { options: { nullable: true } }
					},
					author: {
						in: ['body'],
						errorMessage: 'must be a string or null',
						isString: true,
						optional: { options: { nullable: true } }
					},
					url: {
						in: ['body'],
						errorMessage: 'must be a string or null',
						isString: true,
						optional: { options: { nullable: true } }
					},
					bio: {
						in: ['body'],
						errorMessage: 'must be a string or null',
						isString: true,
						optional: { options: { nullable: true } }
					},
					documentation: {
						in: ['body'],
						errorMessage: 'must be a string or null',
						isString: true,
						optional: { options: { nullable: true } }
					},
					icon: {
						in: ['body'],
						errorMessage: 'must be a string or null',
						isString: true,
						optional: { options: { nullable: true } }
					},
					logo: {
						in: ['body'],
						errorMessage: 'must be a string or null',
						isString: true,
						optional: { options: { nullable: true } }
					},
					admin_view: {
						in: ['body'],
						errorMessage: 'must be a string or null',
						isString: true,
						optional: { options: { nullable: true } }
					},
					web_view: {
						in: ['body'],
						errorMessage: 'must be an array or null',
						isArray: true,
						optional: { options: { nullable: true } }
					},
					prescript: {
						in: ['body'],
						custom: {
							options: (value) => {
								if (!lodash.isPlainObject(value)) {
									return false;
								}
								if (value.install && lodash.isArray(value.install)) {
									for (let lib of value.install) {
										if (!lodash.isString(lib)) {
											return false;
										}
									}
								}
								if (value.run && !lodash.isString(value.run)) {
									return false;
								}
								return true;
							},
							errorMessage: 'must be an object. install value must be an array of strings. run value must be a string'
						},
						optional: { options: { nullable: true } }
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
						optional: { options: { nullable: true } }
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
					postscript,
					meta
				} = req.body;

				loggerPlugin.info(req.uuid, 'PUT /plugins name', name, 'version', version);

				toolsLib.plugin.getPlugin(name)
					.then((plugin) => {
						if (!plugin) {
							throw new Error('Plugin not installed');
						}
						if (plugin.version === version) {
							throw new Error('Version is already installed');
						}

						const updatedPlugin = {
							version
						};

						if (script) {
							const minifiedScript = UglifyJS.minify(script);

							if (minifiedScript.error) {
								throw new Error('Error while minifying script');
							}

							updatedPlugin.script = minifiedScript.code;
						}

						if (description) {
							updatedPlugin.description = description;
						}

						if (bio) {
							updatedPlugin.bio = bio;
						}

						if (author) {
							updatedPlugin.author = author;
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

						if (!lodash.isUndefined(web_view)) {
							updatedPlugin.web_view = web_view;
						}

						if (!lodash.isUndefined(admin_view)) {
							updatedPlugin.admin_view = admin_view;
						}

						if (lodash.isPlainObject(prescript)) {
							updatedPlugin.prescript = prescript;
						}

						if (lodash.isPlainObject(postscript)) {
							updatedPlugin.postscript = postscript;
						}

						if (lodash.isPlainObject(meta)) {
							const existingMeta = lodash.pick(plugin.meta, Object.keys(meta));

							updatedPlugin.meta = {
								...meta,
								...existingMeta
							};
						}

						return bluebird.all([
							plugin,
							plugin.update(updatedPlugin)
						]);
					})
					.then(([ { enabled, script }, plugin ]) => {
						loggerPlugin.info(req.uuid, 'PUT /plugins updated', name);

						plugin = plugin.dataValues;

						let restartProcess = false;
						if (enabled && script) {
							restartProcess = true;
						}

						plugin.enabled_admin_view = !!plugin.admin_view;

						res.json(lodash.omit(plugin, [
							'id',
							'meta',
							'admin_view',
							'script',
							'prescript',
							'postscript'
						]));

						if (restartProcess) {
							process.exit();
						}
					})
					.catch((err) => {
						loggerPlugin.error(req.uuid, 'POST /plugins err', err.message);
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
						optional: true
					},
					version: {
						in: ['body'],
						errorMessage: 'must be a number',
						isNumeric: true,
						optional: false
					},
					author: {
						in: ['body'],
						errorMessage: 'must be a string',
						isString: true,
						optional: false
					},
					enabled: {
						in: ['body'],
						errorMessage: 'must be a boolean',
						isBoolean: true,
						optional: false
					},
					description: {
						in: ['body'],
						errorMessage: 'must be a string or null',
						isString: true,
						optional: { options: { nullable: true } }
					},
					bio: {
						in: ['body'],
						errorMessage: 'must be a string or null',
						isString: true,
						optional: { options: { nullable: true } }
					},
					documentation: {
						in: ['body'],
						errorMessage: 'must be a string or null',
						isString: true,
						optional: { options: { nullable: true } }
					},
					icon: {
						in: ['body'],
						errorMessage: 'must be a string or null',
						isString: true,
						optional: { options: { nullable: true } }
					},
					url: {
						in: ['body'],
						errorMessage: 'must be a string or null',
						isString: true,
						optional: { options: { nullable: true } }
					},
					logo: {
						in: ['body'],
						errorMessage: 'must be a string or null',
						isString: true,
						optional: { options: { nullable: true } }
					},
					admin_view: {
						in: ['body'],
						errorMessage: 'must be a string or null',
						isString: true,
						optional: { options: { nullable: true } }
					},
					web_view: {
						in: ['body'],
						errorMessage: 'must be an array or null',
						isArray: true,
						optional: { options: { nullable: true } }
					},
					prescript: {
						in: ['body'],
						custom: {
							options: (value) => {
								if (!lodash.isPlainObject(value)) {
									return false;
								}
								if (value.install && lodash.isArray(value.install)) {
									for (let lib of value.install) {
										if (!lodash.isString(lib)) {
											return false;
										}
									}
								}
								if (value.run && !lodash.isString(value.run)) {
									return false;
								}
								return true;
							},
							errorMessage: 'must be an object. install value must be an array of strings. run value must be a string'
						},
						optional: { options: { nullable: true } }
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
						optional: { options: { nullable: true } }
					},
					meta: {
						in: ['body'],
						custom: {
							options: (value) => {
								return lodash.isPlainObject(value);
							},
							errorMessage: 'must be an object'
						},
						optional: { options: { nullable: true } }
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

				toolsLib.plugin.getPlugin(name)
					.then((plugin) => {
						if (plugin) {
							throw new Error('Plugin is already installed');
						}

						const newPlugin = {
							name,
							version,
							author,
							enabled
						};

						if (script) {
							const minifiedScript = UglifyJS.minify(script);

							if (minifiedScript.error) {
								throw new Error('Error while minifying script');
							}

							newPlugin.script =  minifiedScript.code;
						}

						if (description) {
							newPlugin.description = description;
						}

						if (bio) {
							newPlugin.bio = bio;
						}

						if (documentation) {
							newPlugin.documentation = documentation;
						}

						if (icon) {
							newPlugin.icon = icon;
						}

						if (url) {
							newPlugin.url = url;
						}

						if (logo) {
							newPlugin.logo = logo;
						}

						if (!lodash.isUndefined(web_view)) {
							newPlugin.web_view = web_view;
						}

						if (!lodash.isUndefined(admin_view)) {
							newPlugin.admin_view = admin_view;
						}

						if (lodash.isPlainObject(prescript)) {
							newPlugin.prescript = prescript;
						}

						if (lodash.isPlainObject(postscript)) {
							newPlugin.postscript = postscript;
						}

						if (lodash.isPlainObject(meta)) {
							newPlugin.meta = meta;
						}

						return toolsLib.database.create('plugin', newPlugin);
					})
					.then((plugin) => {
						loggerPlugin.info(req.uuid, 'POST /plugins installed', name);

						plugin = plugin.dataValues;

						let restartProcess = false;
						if (plugin.enabled && plugin.script) {
							restartProcess = true;
						}

						plugin.enabled_admin_view = !!plugin.admin_view;

						res.json(lodash.omit(plugin, [
							'id',
							'meta',
							'admin_view',
							'script',
							'prescript',
							'postscript'
						]));

						if (restartProcess) {
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

						const updatedMeta = lodash.pick(meta, Object.keys(plugin.meta));

						const newMeta = {
							...plugin.meta,
							...updatedMeta
						};

						return plugin.update({ meta: newMeta }, { fields: ['meta'] });
					})
					.then((plugin) => {
						loggerPlugin.info(req.uuid, 'PUT /plugins/meta updated', name);

						res.json({ message: 'Success' });

						if (plugin.enabled && plugin.script) {
							process.exit();
						}
					})
					.catch((err) => {
						loggerPlugin.error(req.uuid, 'PUT /plugins/meta err', err.message);
						return res.status(err.status || 400).json({ message: err.message });
					});
			});

			app.get('/plugins/meta', [
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
					'GET /plugins/meta auth',
					req.auth.sub
				);

				const { name } = req.query;

				loggerPlugin.info(req.uuid, 'GET /plugins/meta name', name);

				toolsLib.plugin.getPlugin(name, { raw: true, attributes: ['name', 'version', 'meta'] })
					.then((plugin) => {
						if (!plugin) {
							throw new Error('Plugin not found');
						}

						return res.json(plugin);
					})
					.catch((err) => {
						loggerPlugin.error(req.uuid, 'GET /plugins/meta err', err.message);
						return res.status(err.status || 400).json({ message: err.message });
					});
			});

			app.get('/plugins/script', [
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
					'GET /plugins/script auth',
					req.auth.sub
				);

				const { name } = req.query;

				loggerPlugin.info(req.uuid, 'GET /plugins/script name', name);

				toolsLib.plugin.getPlugin(name, { raw: true, attributes: ['name', 'version', 'script', 'prescript', 'postscript', 'admin_view'] })
					.then((plugin) => {
						if (!plugin) {
							throw new Error('Plugin not found');
						}

						return res.json(plugin);
					})
					.catch((err) => {
						loggerPlugin.error(req.uuid, 'GET /plugins/script err', err.message);
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
					.then((plugin) => {
						loggerPlugin.info(req.uuid, 'GET /plugins/disable disabled plugin', name);

						res.json({ message: 'Success' });

						if (plugin.script) {
							process.exit();
						}
					})
					.catch((err) => {
						loggerPlugin.error(req.uuid, 'GET /plugins/disable err', err.message);
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
					.then((plugin) => {
						loggerPlugin.info(req.uuid, 'GET /plugins/enable enabled plugin', name);

						res.json({ message: 'Success' });

						if (plugin.script) {
							process.exit();
						}
					})
					.catch((err) => {
						loggerPlugin.error(req.uuid, 'GET /plugins/enable err', err.message);
						return res.status(err.status || 400).json({ message: err.message });
					});
			});

			toolsLib.database.findAll('plugin', {
				where: {
					enabled: true,
					script: {
						[Op.not]: null
					}
				},
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
								mathjs,
								bluebird,
								rp,
								uuid,
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
		}
	});