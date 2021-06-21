import React, { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';

import { getInstalledPlugin } from '../Plugins/action';
import { TOKEN_KEY, PLUGIN_URL } from '../../../config/constants';

const PluginConfig = ({ params }) => {
	const [myPlugins, setPlugins] = useState([]);

	const getMyPlugins = useCallback(() => {
		return getInstalledPlugin(params)
			.then((res) => {
				if (res) {
					setPlugins(res);
				}
			})
			.catch((err) => {
				let error = err && err.data ? err.data.message : err.message;
				message.error(error);
			});
	}, [setPlugins, params]);

	useEffect(() => {
		window.plugin_key = TOKEN_KEY;
		window.plugin_url = PLUGIN_URL;
		getMyPlugins();
	}, [getMyPlugins]);

	return (
		<div className="w-100 mt-5 pb-5">
			<div className="mt-5 h-100">
				<iframe
					title="test"
					srcDoc={myPlugins.admin_view}
					className="plugin-script-container w-100 h-100"
				/>
			</div>
		</div>
	);
};

export default PluginConfig;
