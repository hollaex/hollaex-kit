'use strict';

const { SERVER_PATH } = require('../constants');
const { INVALID_PLUGIN, PLUGIN_ALREADY_ENABELD, PLUGIN_ALREADY_DISABLED } = require('../messages');
const {
	AVAILABLE_PLUGINS,
	CONFIGURATION_CHANNEL
} = require(`${SERVER_PATH}/constants`);
const { getKitConfig, getKitSecrets } = require('./common');
const dbQuery = require('./database').query;
const { publisher } = require('./database/redis');

const getPluginsConfig = () => {
	return {
		...getKitConfig().plugins,
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
				CONFIGURATION_CHANNEL,
				JSON.stringify({
					type: 'update', data: { kit: data.kit }
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
			return data.kit.plugins.enabled.length !== 0 ? data.kit.plugins.enabled.split(',') : [];
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
