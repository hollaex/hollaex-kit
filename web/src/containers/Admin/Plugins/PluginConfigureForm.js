import React from 'react';

import { STATIC_ICONS } from 'config/icons';
import { AdminHocForm } from '../../../components';
import './index.css';

const Form = AdminHocForm('PLUGIN_CONFIGURE_FORM');

const onSubmit = (values) => {
	console.log('values', values);
};

const PluginConfigureForm = ({ selectedPlugin }) => {
	const { meta } = selectedPlugin;
	const metaFields = meta ? Object.keys(meta) : [];
	const fieldData = {};
	metaFields.forEach((key) => {
		fieldData[key] = {
			type: 'text',
			label: key,
			placeholder: key,
		};
	});
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
				<div className="mt-5">
					<Form
						onSubmit={onSubmit}
						buttonText="Save"
						buttonClass="plugin-config-btn"
						fields={fieldData}
					/>
				</div>
			</div>
		</div>
	);
};

export default PluginConfigureForm;
