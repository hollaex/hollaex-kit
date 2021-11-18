'use strict';

const { Plugin } = require('../db/models');
const { validationResult } = require('express-validator');
const lodash = require('lodash');
const sequelize = require('sequelize');
const { loggerPlugin } = require('../config/logger');
const { omit, pick, isUndefined, isPlainObject, cloneDeep, isString } = require('lodash');
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

		await plugin.destory();

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
		'plugins/controllers/postPlugin',
		req.auth.sub
	);

	const { name, version, author, enabled } = req.body;

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

		const sameNamePlugin = await Plugin.findOne({
			where: { name },
			raw: true,
			attributes: ['id', 'name']
		});

		if (sameNamePlugin) {
			throw new Error(`Plugin ${name} is already installed`);
		}

		const newPlugin = {
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

						newPlugin[field] =  minifiedScript.code;
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
						newPlugin[field] = value;
					}
					break;
				case 'web_view':
				case 'admin_view':
					if (!isUndefined(value)) {
						newPlugin[field] = value;
					}
					break;
				case 'prescript':
				case 'postscript':
				case 'meta':
				case 'public_meta':
					if (isPlainObject(value)) {
						newPlugin[field] = value;
					}
					break;
				default:
					break;
			}
		}

		const plugin = await Plugin.create(newPlugin);
		const formattedPlugin = cloneDeep(plugin.dataValues);

		loggerPlugin.info(
			req.uuid,
			'plugins/controllers/postPlugin plugin installed',
			name
		);

		formattedPlugin.enabled_admin_view = !!formattedPlugin.admin_view;

		res.json(omit(formattedPlugin, [
			'id',
			'meta',
			'admin_view',
			'script',
			'prescript',
			'postscript'
		]));

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

module.exports = {
	getPlugins,
	deletePlugin,
	postPlugin
};
