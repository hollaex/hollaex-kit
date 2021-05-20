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
	const [selectedNetworkPlugin, setNetworkData] = useState({});
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
		}
		getPlugin({ name: selectedPlugin.name })
			.then((res) => {
				setLoading(false);
				if (res && selectedPlugin.enabled) {
					setNetworkData(res);
				} else if (res && !selectedPlugin.enabled) {
					setPlugin(res);
					setNetworkData(res);
				}
			})
			.catch((err) => {
				if (!selectedPlugin.enabled) {
					setPlugin({});
				}
				setNetworkData({});
				setLoading(false);
			});
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
			selectedNetworkPlugin={selectedNetworkPlugin}
			handlePluginList={handlePluginList}
			updatePluginList={updatePluginList}
			removePlugin={removePlugin}
			restart={restart}
		/>
	);
};

export default PluginConfigure;
