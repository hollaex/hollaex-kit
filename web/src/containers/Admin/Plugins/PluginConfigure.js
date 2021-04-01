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
}) => {
	const [pluginData, setPlugin] = useState({});
	const [isLoading, setLoading] = useState(true);

	const requestPlugin = useCallback(() => {
		getPlugin({ name: selectedPlugin.name })
			.then((res) => {
				setLoading(false);
				if (res) {
					setPlugin(res);
				}
			})
			.catch((err) => {
				if (selectedPlugin.enabled) {
					setPlugin(selectedPlugin);
				} else {
					setPlugin({});
				}
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
