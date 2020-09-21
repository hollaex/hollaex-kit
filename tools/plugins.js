'use strict';

const { SERVER_PATH } = require('../constants');
const {
	AVAILABLE_PLUGINS,
	INIT_CHANNEL
} = require(`${SERVER_PATH}/constants`);
const { getKitConfig, getKitSecrets } = require('./common');
const dbQuery = require('./database').query;
const { publisher } = require('./database/redis');

const getPluginsConfig = () => {
	return {
		...getKitConfig().plugins,
		available: AVAILABLE_PLUGINS,
		enabled: getKitConfig().plugins.enabled.split(',')
	};
};

const getPluginsSecrets = () => {
	return getKitSecrets().plugins;
};

const pluginIsEnabled = (plugin) => {
	if (!plugin || typeof plugin !== 'string') {
		throw new Error('Parameter must be a string');
	}

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
		{ attributes: ['id', 'kit'] }
	)
		.then((status) => {
			const kit = status.kit;
			kit.plugins[key] = { ...kit.plugins.configuration[key], ...data };
			return status.update({ kit }, {
				fields: [
					'kit'
				],
				returning: true
			});
		})
		.then((data) => {
			publisher.publish(
				INIT_CHANNEL,
				JSON.stringify({
					type: 'kit', data: data.kit
				})
			);
			return data.kit.plugins.configuration[key];
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
				throw new Error(`Plugin ${plugin} does not exist`);
			} else {
				let enabledPlugins = kit.plugins.enabled.split(',');
				if (type === 'enable') {
					if (enabledPlugins.includes(plugin)) {
						throw new Error (`Plugin ${plugin} is already enabled`);
					} else {
						enabledPlugins.push(plugin);
						kit.plugins.enabled = enabledPlugins.join(',');
					}
				} else if (type === 'disable') {
					if (!enabledPlugins.includes(plugin)) {
						throw new Error(`Plugin ${plugin} is already disabled`);
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
				INIT_CHANNEL,
				JSON.stringify({
					type: 'kit', data: data.kit
				})
			);
			return data.kit.plugins.enabled.split(',');
		});
};

const enablePlugin = (plugin) => {
	return enableOrDisablePlugin('enable', plugin);
};

const disablePlugin = (plugin) => {
	return enableOrDisablePlugin('disable', plugin);
};

module.exports = {
	getPluginsConfig,
	getPluginsSecrets,
	pluginIsEnabled,
	updatePluginConfig,
	enablePlugin,
	disablePlugin
};
