import React from 'react';

import { STATIC_ICONS } from 'config/icons';
import './index.css';
import { Button, Input } from 'antd';

const PluginConfigure = ({ selectedPlugin }) => {
	return (
		<div className="config-wrapper">
			<div className="d-flex">
				<img
					src={
						selectedPlugin.icon
							? selectedPlugin.icon
							: STATIC_ICONS.DEFAULT_PLUGIN_THUMBNAIL
					}
					alt="plugin-icons"
					className="plugins-icon"
				/>
				<div className="my-5 mx-3">
					<h2>{selectedPlugin.name}</h2>
					<div>
						<b>Version:</b> {selectedPlugin.version}
					</div>
				</div>
			</div>
			<div className="config-content">
				<div className="mt-2">Configure</div>
				<div className="mt-4">
					Name
					<Input placeholder="Input telegram ID" />
				</div>
				<div className="mt-4">
					Rate
					<Input placeholder="Input Freshdesk Access key" />
				</div>
				<div className="mt-4">
					Market
					<Input placeholder="Input Freshdesk Auth key" />
				</div>
				<div className="btn-wrapper">
					<Button type="primary" className="restart-btn">
						Restart
					</Button>
				</div>
			</div>
		</div>
	);
};

export default PluginConfigure;
