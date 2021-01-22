import React from 'react';
import { SubmissionError } from 'redux-form';
import { message } from 'antd';

import { STATIC_ICONS } from 'config/icons';
import { AdminHocForm } from '../../../components';
import { updatePlugin } from './action';
import './index.css';

const Form = AdminHocForm('PLUGIN_CONFIGURE_FORM');

const renderContent = (selectedPlugin, requestPlugin) => {
	const onSaveMeta = (values, plugin) => {
		return updatePlugin({ name: plugin.name, meta: values })
			.then((res) => {
				message.success('Data saved successfully');
				requestPlugin();
			})
			.catch((error) => {
				const message = error.data ? error.data.message : error.message;
				throw new SubmissionError({ _error: message });
			});
	};

	if (selectedPlugin.meta) {
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
			<div className="config-content mt-5 pb-5 w-50">
				<div className="mt-2">Configure</div>
				<div className="mt-5">
					<Form
						onSubmit={(formProps) => onSaveMeta(formProps, selectedPlugin)}
						buttonText="Save"
						buttonClass="plugin-config-btn"
						fields={fieldData}
						initialValues={selectedPlugin.meta}
					/>
				</div>
			</div>
		);
	} else if (selectedPlugin.admin_view) {
		return (
			<div className="config-content mt-5 pb-5">
				<div className="mt-2">Configure</div>
				<div className="mt-5">
					<iframe
						title="test"
						srcDoc={selectedPlugin.admin_view}
						className="plugin-script-container"
					/>
				</div>
			</div>
		);
	} else {
		return <div></div>;
	}
};

const PluginConfigureForm = ({ selectedPlugin, requestPlugin }) => {
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
			<div>{renderContent(selectedPlugin, requestPlugin)}</div>
		</div>
	);
};

export default PluginConfigureForm;
