'use strict';

const { Plugin } = require('../db/models');
const { validationResult } = require('express-validator');
const lodash = require('lodash');
const sequelize = require('sequelize');
const { loggerPlugin } = require('../config/logger');
const { omit, pick, isUndefined, isPlainObject, cloneDeep, isString, isEmpty, isBoolean } = require('lodash');
const uglifyEs = require('uglify-es');

const getPlugins = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors);
		return res.status(400).json({ errors: errors.array() });
	}

	const { name, search } = req.query;

	loggerPlugin.verbose(
		req.uuid,
		'plugins/controllers/getPlugins',
		'name:',
		name,
		'search:',
		search
	);

	try {
		const options = {
			raw: true,
			attributes: {
				exclude: [
					'id',
					'script',
					'meta',
					'prescript',
					'postscript'
				]
			},
			order: [[ 'id', 'asc' ]]
		};

		if (name) {
			options.where = { name };
		} else if (search) {
			options.where = {
				name: { [sequelize.Op.like]: `%${search}%` }
			};
		}

		const data = await Plugin.findAndCountAll(options);

		if (name && data.count === 0) {
			throw new Error('Plugin not found');
		}

		const formattedData = {
			count: data.count,
			data: data.rows.map((plugin) => {
				plugin.enabled_admin_view = !!plugin.admin_view;
				return lodash.omit(plugin, [ 'admin_view' ]);
			})
		};

		return name ? res.json(formattedData.data[0]) : res.json(formattedData);
	} catch (err) {
		loggerPlugin.error(
			req.uuid,
			'plugins/controllers/getPlugins err',
			err.message
		);

		return res.status(err.status || 400).json({ message: err.message });
	}
};

const deletePlugin = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	loggerPlugin.verbose(
		req.uuid,
		'plugins/controllers/deletePlugin auth',
		req.auth.sub
	);

	const { name } = req.query;

	loggerPlugin.info(
		req.uuid,
		'plugins/controllers/deletePlugin name:',
		name
	);

	try {
		const plugin = await Plugin.findOne({
			where: { name }
		});

		if (!plugin) {
			throw new Error('Plugin not found');
		}

		const restartAfterDelete = plugin.enabled && plugin.script;

		await plugin.destroy();

		loggerPlugin.verbose(
			req.uuid,
			'plugins/controllers/deletePlugin',
			'plugin deleted',
			name
		);

		res.json({ message: 'Success' });

		if (restartAfterDelete) {
			loggerPlugin.verbose(
				req.uuid,
				'plugins/controllers/deletePlugin',
				'restarting plugin process'
			);

			process.exit();
		}
	} catch (err) {
		loggerPlugin.error(
			req.uuid,
			'plugins/controllers/deletePlugin err',
			err.message
		);

		return res.status(err.status || 400).json({ message: err.message });
	}
};

const postPlugin = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	loggerPlugin.verbose(
		req.uuid,
		'plugins/controllers/postPlugin auth',
		req.auth.sub
	);

	const { name, version, author } = req.body;
	let { enabled } = req.body;

	if (!isBoolean(enabled)) {
		enabled = true;
	}

	loggerPlugin.info(
		req.uuid,
		'plugins/controllers/postPlugin',
		name,
		'version:',
		version,
		'author:',
		author
	);

	const configValues = pick(req.body, [
		'script',
		'description',
		'icon',
		'bio',
		'documentation',
		'web_view',
		'admin_view',
		'url',
		'logo',
		'prescript',
		'postscript',
		'meta',
		'public_meta',
		'type'
	]);

	try {
		const sameNamePlugin = await Plugin.findOne({
			where: { name },
			raw: true,
			attributes: ['id', 'name']
		});

		if (sameNamePlugin) {
			throw new Error(`Plugin ${name} is already installed`);
		}

		if (configValues.type) {
			const sameTypePlugin = await Plugin.findOne({
				where: { type: configValues.type },
				raw: true,
				attributes: ['id', 'name', 'type']
			});

			if (sameTypePlugin) {
				throw new Error(`${name} cannot be ran in parallel with an installed plugin (${sameTypePlugin.name}). Uninstall the plugin ${sameTypePlugin.name} before installing this plugin.`);
			}
		}

		const pluginConfig = {
			name,
			version,
			author,
			enabled
		};

		for (const field in configValues) {
			const value = configValues[field];

			switch (field) {
				case 'script':
					if (value) {
						const minifiedScript = uglifyEs.minify(value);

						if (minifiedScript.error) {
							throw new Error(`Error while minifying script: ${minifiedScript.error.message}`);
						}

						pluginConfig[field] =  minifiedScript.code;
					}
					break;
				case 'description':
				case 'bio':
				case 'documentation':
				case 'icon':
				case 'url':
				case 'logo':
				case 'type':
					if (isString(value)) {
						pluginConfig[field] = value;
					}
					break;
				case 'web_view':
				case 'admin_view':
					if (!isUndefined(value)) {
						pluginConfig[field] = value;
					}
					break;
				case 'prescript':
				case 'postscript':
				case 'meta':
				case 'public_meta':
					if (isPlainObject(value)) {
						pluginConfig[field] = value;
					}
					break;
				default:
					break;
			}
		}

		const plugin = await Plugin.create(pluginConfig);
		const formattedPlugin = cloneDeep(plugin.dataValues);

		loggerPlugin.info(
			req.uuid,
			'plugins/controllers/postPlugin plugin installed',
			name
		);

		formattedPlugin.enabled_admin_view = !!formattedPlugin.admin_view;

		res.json(
			omit(formattedPlugin, [
				'id',
				'meta',
				'admin_view',
				'script',
				'prescript',
				'postscript'
			])
		);

		if (plugin.enabled && plugin.script) {
			process.exit();
		}
	} catch (err) {
		loggerPlugin.error(
			req.uuid,
			'plugins/controllers/postPlugin',
			err.message
		);

		return res.status(err.status || 400).json({ message: err.message });
	}
};

const putPlugin = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	loggerPlugin.verbose(
		req.uuid,
		'plugins/controllers/putPlugin auth',
		req.auth.sub
	);

	const { name, version } = req.body;

	loggerPlugin.info(
		req.uuid,
		'plugins/controllers/putPlugin',
		name,
		'version:',
		version
	);

	const configValues = pick(req.body, [
		'script',
		'description',
		'icon',
		'bio',
		'documentation',
		'web_view',
		'admin_view',
		'url',
		'logo',
		'prescript',
		'postscript',
		'meta',
		'public_meta',
		'type'
	]);

	try {
		const plugin = await Plugin.findOne({ where: { name } });

		if (!plugin) {
			throw new Error('Plugin not installed');
		}

		if (plugin.version === version) {
			throw new Error('Version is already installed');
		}

		if (configValues.type) {
			const sameTypePlugin = await Plugin.findOne({
				where: {
					type: configValues.type,
					name: {
						[sequelize.Op.not]: name
					}
				},
				raw: true,
				attributes: ['id', 'name', 'type']
			});

			if (sameTypePlugin) {
				throw new Error(`${name} version ${version} cannot be ran in parallel with an installed plugin (${sameTypePlugin.name}). Uninstall the plugin ${sameTypePlugin.name} before updating this plugin.`);
			}
		}

		const pluginConfig = {
			version
		};

		for (const field in configValues) {
			const value = configValues[field];

			switch (field) {
				case 'script':
					if (value) {
						const minifiedScript = uglifyEs.minify(value);

						if (minifiedScript.error) {
							throw new Error(`Error while minifying script: ${minifiedScript.error.message}`);
						}

						pluginConfig[field] = minifiedScript.code;
					}
					break;
				case 'description':
				case 'bio':
				case 'author':
				case 'type':
				case 'documentation':
				case 'icon':
				case 'url':
				case 'logo':
					if (value) {
						pluginConfig[field] = value;
					}
					break;
				case 'web_view':
				case 'admin_view':
					if (!isUndefined(value)) {
						pluginConfig[field] = value;
					}
					break;
				case 'prescript':
				case 'postscript':
					if (isPlainObject(value)) {
						pluginConfig[field] = value;
					}
					break;
				case 'meta':
				case 'public_meta':
					if (isPlainObject(value)) {
						for (const key in plugin[field]) {
							if (
								lodash.isPlainObject(plugin[field])
								&& plugin[field][key].overwrite === false
									&& (!value[key] || value[key].overwrite === false)
							) {
								value[key] = plugin[field][key];
							}
						}

						const existingConfig = pick(plugin[field], Object.keys(value));

						for (const key in value) {
							if (existingConfig[key] !== undefined) {
								if (isPlainObject(value[key]) && !isPlainObject(existingConfig[key])) {
									value[key].value = existingConfig[key];
								} else if (!isPlainObject(value[key]) && !isPlainObject(existingConfig[key])) {
									value[key] = existingConfig[key];
								} else if (!isPlainObject(value[key]) && isPlainObject(existingConfig[key])) {
									value[key] = existingConfig[key].value;
								} else if (isPlainObject(value[key]) && isPlainObject(existingConfig[key])) {
									value[key].value = existingConfig[key].value;
								}
							}
						}

						pluginConfig[field] = value;
					}
					break;
				default:
					break;
			}
		}

		const updatedPlugin = await plugin.update(pluginConfig);
		const formattedPlugin = cloneDeep(updatedPlugin.dataValues);

		loggerPlugin.info(
			req.uuid,
			'plugins/controllers/putPlugin plugin updated',
			name
		);

		formattedPlugin.enabled_admin_view = !!formattedPlugin.admin_view;

		res.json(
			omit(formattedPlugin, [
				'id',
				'meta',
				'admin_view',
				'script',
				'prescript',
				'postscript'
			])
		);

		if (updatedPlugin.enabled && updatedPlugin.script) {
			process.exit();
		}
	} catch (err) {
		loggerPlugin.error(
			req.uuid,
			'plugins/controllers/putPlugin err',
			err.message
		);

		return res.status(err.status || 400).json({ message: err.message });
	}
};

const getPluginConfig = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	loggerPlugin.verbose(
		req.uuid,
		'plugins/controllers/getPluginConfig auth',
		req.auth.sub
	);

	const { name } = req.query;

	loggerPlugin.info(
		req.uuid,
		'plugins/controllers/getPluginConfig name',
		name
	);

	try {
		const plugin = await Plugin.findOne({
			where: { name },
			raw: true,
			attributes: [
				'name',
				'version',
				'meta',
				'public_meta'
			]
		});

		if (!plugin) {
			throw new Error('Plugin not found');
		}

		return res.json(plugin);
	} catch (err) {
		loggerPlugin.error(
			req.uuid,
			'plugins/controllers/getPluginConfig err',
			err.message
		);

		return res.status(err.status || 400).json({ message: err.message });
	}
};

const putPluginConfig = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	loggerPlugin.verbose(
		req.uuid,
		'plugins/controllers/putPluginConfig auth',
		req.auth.sub
	);

	const { name } = req.body;
	const configValues = pick(req.body, ['meta', 'public_meta']);

	loggerPlugin.info(
		req.uuid,
		'plugins/controllers/putPluginConfig name:',
		name
	);

	try {
		if (isEmpty(configValues)) {
			throw new Error('Must provide meta or public_meta to update');
		}

		const plugin = await Plugin.findOne({ where: { name } });

		if (!plugin) {
			throw new Error('Plugin not found');
		}

		const updatedConfig = {};

		for (const field in configValues) {
			const value = configValues[field];

			switch (field) {
				case 'meta':
				case 'public_meta':
					if (value) {
						const newConfig = plugin[field];

						for (const key in newConfig) {
							if (value[key] !== undefined) {
								if (isPlainObject(newConfig[key])) {
									newConfig[key].value = value[key];
								} else {
									newConfig[key] = value[key];
								}
							}
						}

						updatedConfig[field] = newConfig;
					}
					break;
				default:
					break;
			}
		}

		const updatedPlugin = await plugin.update(updatedConfig, { fields: Object.keys(updatedConfig) });

		loggerPlugin.verbose(
			req.uuid,
			'plugins/controllers/putPluginConfig plugin updated',
			name
		);

		res.json(
			pick(updatedPlugin.dataValues, [
				'name',
				'version',
				'public_meta',
				'meta'
			])
		);

		if (plugin.enabled && plugin.script) {
			process.exit();
		}
	} catch (err) {
		loggerPlugin.error(
			req.uuid,
			'plugins/controllers/putPluginConfig err',
			err.message
		);

		return res.status(err.status || 400).json({ message: err.message });
	}
};

const getPluginScript = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	loggerPlugin.verbose(
		req.uuid,
		'plugins/controllers/getPluginScript auth',
		req.auth.sub
	);

	const { name } = req.query;

	loggerPlugin.info(
		req.uuid,
		'plugins/controllers/getPluginScript name:',
		name
	);

	try {
		const plugin = await Plugin.findOne({
			where: { name },
			raw: true,
			attributes: [
				'name',
				'version',
				'script',
				'prescript',
				'postscript',
				'admin_view'
			]
		});

		if (!plugin) {
			throw new Error('Plugin not found');
		}

		return res.json(plugin);
	} catch (err) {
		loggerPlugin.error(
			req.uuid,
			'plugins/controllers/getPluginScript err',
			err.message
		);

		return res.status(err.status || 400).json({ message: err.message });
	}
};

const disablePlugin = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	loggerPlugin.verbose(
		req.uuid,
		'plugins/controllers/disablePlugin auth',
		req.auth.sub
	);

	const { name } = req.query;

	loggerPlugin.info(
		req.uuid,
		'plugins/controllers/disablePlugin name:',
		name
	);

	try {
		const plugin = await Plugin.findOne({ where: { name } });

		if (!plugin) {
			throw new Error('Plugin not found');
		}

		if (!plugin.enabled) {
			throw new Error('Plugin is already disabled');
		}

		await plugin.update({ enabled: false }, { fields: ['enabled'] });

		loggerPlugin.verbose(
			req.uuid,
			'plugins/controllers/disablePlugin plugin disabled',
			name
		);

		res.json({ message: 'Success' });

		if (plugin.script) {
			process.exit();
		}
	} catch (err) {
		loggerPlugin.error(
			req.uuid,
			'plugins/controllers/disablePlugin err',
			err.message
		);

		return res.status(err.status || 400).json({ message: err.message });
	}
};

const enablePlugin = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	loggerPlugin.verbose(
		req.uuid,
		'plugins/controllers/enablePlugin auth',
		req.auth.sub
	);

	const { name } = req.query;

	loggerPlugin.info(
		req.uuid,
		'plugins/controllers/enablePlugin name:',
		name
	);

	try {
		const plugin = await Plugin.findOne({ where: { name } });

		if (!plugin) {
			throw new Error('Plugin not found');
		}

		if (plugin.enabled) {
			throw new Error('Plugin is already enabled');
		}

		await plugin.update({ enabled: true }, { fields: ['enabled'] });

		loggerPlugin.verbose(
			req.uuid,
			'plugins/controllers/enablePlugin plugin enabled',
			name
		);

		res.json({ message: 'Success' });

		if (plugin.script) {
			process.exit();
		}
	} catch (err) {
		loggerPlugin.error(
			req.uuid,
			'plugins/controllers/enablePlugin err',
			err.message
		);

		return res.status(err.status || 400).json({ message: err.message });
	}
};

module.exports = {
	getPlugins,
	deletePlugin,
	postPlugin,
	putPlugin,
	getPluginConfig,
	putPluginConfig,
	getPluginScript,
	disablePlugin,
	enablePlugin
};
