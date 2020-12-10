'use strict';

const { SERVER_PATH } = require('../constants');
const { INVALID_PLUGIN, PLUGIN_ALREADY_ENABELD, PLUGIN_ALREADY_DISABLED } = require(`${SERVER_PATH}/messages`);
const {
	AVAILABLE_PLUGINS,
	CONFIGURATION_CHANNEL,
	SECRET_MASK,
	MASK_VALUE_GIVEN
} = require(`${SERVER_PATH}/constants`);
const { getKitConfig, getKitSecrets, maskSecrets } = require('./common');
const dbQuery = require('./database/query');
const { publisher } = require('./database/redis');
const { paginationQuery } = require('./database/helpers');
const flatten = require('flat');
const { Op } = require('sequelize');

const getPluginsConfig = () => {
	return {
		available: AVAILABLE_PLUGINS,
		enabled: getKitConfig().plugins.enabled.length !== 0 ? getKitConfig().plugins.enabled.split(',') : []
	};
};

const getPluginsSecrets = () => {
	return getKitSecrets().plugins;
};

const pluginIsEnabled = (plugin) => {
	const enabledPlugins = getKitConfig().plugins.enabled;
	if (!enabledPlugins.includes(plugin)) {
		return false;
	} else {
		return true;
	}
};

const updatePluginConfig = (key, data) => {
	return dbQuery.findOne(
		'status',
		{ attributes: ['id', 'kit', 'secrets'] }
	)
		.then((status) => {
			const kit = status.kit;
			const secrets = status.secrets;
			if (data.configuration) {
				kit.plugins[key] = {...kit.plugins.configuration[key], ...data.kit};
			}
			if (data.secrets) {
				const flattenedNewKitSecrets = flatten(data.secrets);
				if (Object.values(flattenedNewKitSecrets).includes(SECRET_MASK)) {
					throw new Error(MASK_VALUE_GIVEN);
				}
				secrets.plugins[key] = {...secrets.plugins[key], ...data.secrets};
			}
			return status.update({ kit, secrets }, {
				fields: [
					'kit',
					'secrets'
				],
				returning: true
			});
		})
		.then((data) => {
			publisher.publish(
				CONFIGURATION_CHANNEL,
				JSON.stringify({
					type: 'update', data: { kit: data.kit, secrets: data.secrets }
				})
			);
			let maskedSecret = {
				plugins: {
					[key]: data.secrets.plugins[key]
				}
			};
			return {
				plugin: key,
				kit: data.kit.plugins.configuration[key],
				secrets: maskSecrets(maskedSecret).plugins[key]
			};
		});
};

const enableOrDisablePlugin = (type, plugin) => {
	return dbQuery.findOne(
		'status',
		{ attributes: ['id', 'kit'] }
	)
		.then((status) => {
			const kit = status.kit;
			if (!AVAILABLE_PLUGINS.includes(plugin)) {
				throw new Error(INVALID_PLUGIN(plugin));
			} else {
				let enabledPlugins = [];
				if (kit.plugins.enabled.length !== 0) {
					enabledPlugins = kit.plugins.enabled.split(',');
				}
				if (type === 'enable') {
					if (enabledPlugins.includes(plugin)) {
						throw new Error (PLUGIN_ALREADY_ENABELD(plugin));
					} else {
						enabledPlugins.push(plugin);
						kit.plugins.enabled = enabledPlugins.join(',');
					}
				} else if (type === 'disable') {
					if (!enabledPlugins.includes(plugin)) {
						throw new Error(PLUGIN_ALREADY_DISABLED(plugin));
					} else {
						enabledPlugins = enabledPlugins.filter((p) => p !== plugin);
						kit.plugins.enabled = enabledPlugins.join(',');
					}
				}
			}
			return status.update({ kit }, {
				fields: [
					'kit'
				],
				returning: true
			});
		})
		.then((data) => {
			publisher.publish(
				CONFIGURATION_CHANNEL,
				JSON.stringify({
					type: 'update', data: { kit: data.kit }
				})
			);
			return {
				enabled: data.kit.plugins.enabled.length !== 0 ? data.kit.plugins.enabled.split(',') : []
			};
		});
};

const enablePlugin = (plugin) => {
	return enableOrDisablePlugin('enable', plugin);
};

const disablePlugin = (plugin) => {
	return enableOrDisablePlugin('disable', plugin);
};

const getPaginatedPlugins = (limit, page, search) => {
	const options = {
		where: {},
		raw: true,
		attributes: ['name', 'version', 'enabled', 'author', 'description', 'bio', 'url', 'logo', 'icon', 'documentation', 'created_at', 'updated_at'],
		...paginationQuery(limit, page)
	};

	if (search) {
		options.where = {
			name: { [Op.like]: `%${search.toLowerCase()}%` }
		};
	}

	return dbQuery.findAndCountAll('plugin', options)
		.then((data) => {
			return {
				count: data.count,
				data: data.rows
			};
		});
};

const getPlugin = (name, opts = {}) => {
	return dbQuery.findOne('plugin', {
		where: { name: name.toLowerCase() },
		...opts
	});
};



module.exports = {
	getPluginsConfig,
	getPluginsSecrets,
	pluginIsEnabled,
	updatePluginConfig,
	enablePlugin,
	disablePlugin,
	getPaginatedPlugins,
	getPlugin
};
