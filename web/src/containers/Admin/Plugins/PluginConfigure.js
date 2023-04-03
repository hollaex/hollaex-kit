import React, { useState, useCallback, useEffect } from 'react';

import PluginDetails from './PluginDetails';
import PluginConfigureForm from './PluginConfigureForm';
import { getPlugin } from './action';

const PluginConfigure = ({
	type,
	handleBreadcrumb,
	selectedPlugin,
	handlePluginList,
	updatePluginList,
	removePlugin,
	restart,
	handleRedirect,
	handleStep,
	activatedPluginDetails,
	getActivationsPlugin,
	onChangeNextType,
	router,
	setProcessing,
	myPlugins,
}) => {
	const [pluginData, setPlugin] = useState({});
	const [selectedNetworkPlugin, setNetworkData] = useState({});
	const [isLoading, setLoading] = useState(true);

	const requestPlugin = useCallback(() => {
		const isAvailInMyPlugin =
			myPlugins &&
			myPlugins
				.filter((plugin) => plugin.name === selectedPlugin.name)
				?.reduce((data, plugin) => plugin);
		if (isAvailInMyPlugin) {
			setPlugin(isAvailInMyPlugin);
			setLoading(false);
		}
		getPlugin({ name: selectedPlugin.name })
			.then((res) => {
				setLoading(false);
				if (res && selectedPlugin.enabled && !isAvailInMyPlugin) {
					setNetworkData(res);
					setPlugin(res);
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedPlugin]);

	useEffect(() => {
		requestPlugin();
	}, [requestPlugin]);

	return type === 'configure' ? (
		<PluginConfigureForm
			selectedPlugin={pluginData}
			requestPlugin={requestPlugin}
			restart={restart}
			handleStep={handleStep}
		/>
	) : (
		<PluginDetails
			isLoading={isLoading}
			pluginData={pluginData}
			handleBreadcrumb={handleBreadcrumb}
			selectedPlugin={selectedPlugin}
			activatedPluginDetails={activatedPluginDetails}
			getActivationsPlugin={getActivationsPlugin}
			selectedNetworkPlugin={selectedNetworkPlugin}
			handlePluginList={handlePluginList}
			updatePluginList={updatePluginList}
			removePlugin={removePlugin}
			restart={restart}
			handleRedirect={handleRedirect}
			router={router}
			onChangeNextType={onChangeNextType}
			setProcessing={setProcessing}
		/>
	);
};

export default PluginConfigure;
