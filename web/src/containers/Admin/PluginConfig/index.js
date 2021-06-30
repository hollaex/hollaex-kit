import React, { useCallback, useEffect, useState } from 'react';
import { message, Spin } from 'antd';

import { getPluginScript } from '../Plugins/action';
import { TOKEN_KEY, PLUGIN_URL } from '../../../config/constants';

const PluginConfig = ({ params }) => {
	const [loading, setLoading] = useState(false);
	const [adminView, setAdminView] = useState({});

	const getMyPluginScript = useCallback(() => {
		setLoading(true);
		return getPluginScript(params)
			.then((res) => {
				if (res) {
					setAdminView(res);
				}
				setLoading(false);
			})
			.catch((err) => {
				let error = err && err.data ? err.data.message : err.message;
				message.error(error);
				setLoading(false);
			});
	}, [params]);

	useEffect(() => {
		window.plugin_key = TOKEN_KEY;
		window.plugin_url = PLUGIN_URL;
		getMyPluginScript();
	}, [getMyPluginScript]);

	if (loading) {
		return (
			<div className="w-100 h-100 d-flex align-items-center justify-content-center">
				<Spin />
			</div>
		);
	}

	return (
		<div className="w-100 mt-5 pb-5">
			<div className="mt-5 h-100">
				<iframe
					title="test"
					srcDoc={adminView.admin_view}
					className="plugin-script-container w-100 h-100"
				/>
			</div>
		</div>
	);
};

export default PluginConfig;
