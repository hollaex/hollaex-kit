import React, { useState, useCallback, useEffect } from 'react';

import PluginDetails from './PluginDetails';
import PluginConfigureForm from './PluginConfigureForm';
import { getPlugin, getInstalledPlugin } from './action';

const PluginConfigure = ({
	type,
	handleBreadcrumb,
	selectedPlugin,
	handlePluginList,
	updatePluginList,
	removePlugin,
	restart,
}) => {
	const [pluginData, setPlugin] = useState({});
	const [isLoading, setLoading] = useState(true);

	const requestPlugin = useCallback(() => {
		if (selectedPlugin.enabled) {
			getInstalledPlugin({ name: selectedPlugin.name })
				.then((res) => {
					setLoading(false);
					if (res) {
						setPlugin(res);
					}
				})
				.catch((err) => {
					setPlugin(selectedPlugin);
					setLoading(false);
				});
		} else {
			getPlugin({ name: selectedPlugin.name })
				.then((res) => {
					setLoading(false);
					if (res) {
						setPlugin(res);
					}
				})
				.catch((err) => {
					setPlugin({});
					setLoading(false);
				});
		}
	}, [selectedPlugin]);

	useEffect(() => {
		requestPlugin();
	}, [requestPlugin]);

	return type === 'configure' ? (
		<PluginConfigureForm
			selectedPlugin={pluginData}
			requestPlugin={requestPlugin}
			restart={restart}
		/>
	) : (
		<PluginDetails
			isLoading={isLoading}
			pluginData={pluginData}
			handleBreadcrumb={handleBreadcrumb}
			selectedPlugin={selectedPlugin}
			handlePluginList={handlePluginList}
			updatePluginList={updatePluginList}
			removePlugin={removePlugin}
			restart={restart}
		/>
	);
};

export default PluginConfigure;
