import React, { useState, useCallback, useEffect } from 'react';

import PluginDetails from './PluginDetails';
import PluginConfigureForm from './PluginConfigureForm';

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
	networkPlugin,
	isNetwork = false,
}) => {
	const [pluginData, setPlugin] = useState({});
	const [selectedNetworkPlugin, setNetworkData] = useState({});
	const [isLoading, setLoading] = useState(true);

	const requestPlugin = useCallback(() => {
		const isAvailInMyPlugin =
			myPlugins &&
			myPlugins
				.filter((plugin) => plugin.name === selectedPlugin.name)
				?.reduce((data, plugin) => plugin, {});
		const isAvailInNetPlugin =
			networkPlugin &&
			networkPlugin
				.filter((plugin) => plugin.name === selectedPlugin.name)
				?.reduce((data, plugin) => plugin, {});
		if (isAvailInMyPlugin && Object.keys(isAvailInMyPlugin)?.length) {
			setPlugin(isAvailInMyPlugin);
			setLoading(false);
		}
		if (
			isNetwork &&
			((isAvailInNetPlugin &&
				Object.keys(isAvailInNetPlugin)?.length &&
				selectedPlugin.enabled) ||
				(isAvailInNetPlugin && !selectedPlugin.enabled))
		) {
			setPlugin(isAvailInNetPlugin);
			setLoading(false);
		}
		if (
			isAvailInNetPlugin &&
			Object.keys(isAvailInNetPlugin)?.length &&
			selectedPlugin.enabled
		) {
			setNetworkData(isAvailInNetPlugin);
		}
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
