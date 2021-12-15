import 'whatwg-fetch';
import merge from 'lodash.merge';

const getPluginNameByType = (type) => {
	switch (type) {
		case 'phone':
			return 'sms';
		default:
			return type;
	}
};

export const mapPluginsTypeToName = (enabledPluginsTypes = []) =>
	enabledPluginsTypes
		.filter((type) => !!type)
		.map((type) => getPluginNameByType(type));

const PLUGIN_PORT = 8080;

const getPluginJsonUrl = (pluginName, port = PLUGIN_PORT) =>
	`http://localhost:${port}/${pluginName}.json`;

const getLocalBundle = async (pluginName) => {
	const url = getPluginJsonUrl(pluginName, PLUGIN_PORT);

	try {
		const response = await fetch(url);
		return await response.json();
	} catch (err) {
		throw new Error(
			`Failed to fetch/parse ${pluginName} configs. Please check ${pluginName}.json on port ${PLUGIN_PORT}.`
		);
	}
};

export const consolePluginDevModeInfo = () => {
	if (process.env.REACT_APP_PLUGIN_DEV_MODE === 'true') {
		console.info(
			'%cPLUGIN DEVELOPMENT MODE',
			'color: #00509d; font-family:sans-serif; font-size: 14px; font-weight: 600'
		);

		if (process.env.REACT_APP_PLUGIN) {
			console.info(
				`%cPlugin: ${process.env.REACT_APP_PLUGIN}`,
				'color: #00509d; font-family:sans-serif; font-size: 14px; font-weight: 600'
			);
		} else {
			console.info(
				'%cYou must pass plugin parameter',
				'color: #d90429; font-family:sans-serif'
			);
			console.info(
				'%cnpm run dev:plugin --plugin=TEST_PLUGIN',
				'color: #55a630; background-color: #212529; font-family:sans-serif; line-height: 40px; padding: 10px'
			);
			throw new Error('plugin is required');
		}
	}
};

export const IS_PLUGIN_DEV_MODE =
	process.env.REACT_APP_PLUGIN_DEV_MODE === 'true' &&
	process.env.REACT_APP_PLUGIN;

export const mergePlugins = async (plugins = []) => {
	let allPlugins = [];
	const pluginName = process.env.REACT_APP_PLUGIN;
	const pluginObject = await getLocalBundle(pluginName);

	if (pluginObject) {
		plugins.forEach((plugin) => {
			if (plugin.name === pluginName) {
				delete plugin.web_view;
				const mergedPlugin = merge({}, plugin, pluginObject);
				allPlugins.push(mergedPlugin);
			} else {
				allPlugins.push(plugin);
			}
		});

		if (!plugins.find(({ name }) => name === pluginName)) {
			allPlugins.push({ ...pluginObject, name: pluginName });
		}
	}

	return allPlugins;
};
