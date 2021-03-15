import React, { useEffect, useState, useCallback } from 'react';
import { SubmissionError } from 'redux-form';
import { message, Spin } from 'antd';

import { STATIC_ICONS } from 'config/icons';
import { AdminHocForm } from '../../../components';
import { updatePluginMeta, getPluginMeta } from './action';
import { TOKEN_KEY } from '../../../config/constants';
import './index.css';

const Form = AdminHocForm('PLUGIN_CONFIGURE_FORM');

const renderContent = (selectedPlugin, requestPlugin, metaData) => {
	const onSaveMeta = (values, plugin) => {
		return updatePluginMeta({ name: plugin.name, meta: values })
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
			if (key.toLowerCase().includes('secret')) {
				fieldData[key] = {
					type: 'password',
					label: key,
					placeholder: key,
				};
			} else {
				fieldData[key] = {
					type: 'text',
					label: key,
					placeholder: key,
				};
			}
		});
		return (
			<div className="config-content mt-5 pb-5 w-50">
				<div className="mt-2">Configure</div>
				<div className="mt-5">
					<Form
						onSubmit={(formProps) => onSaveMeta(formProps, metaData)}
						buttonText="Save"
						buttonClass="plugin-config-btn"
						fields={fieldData}
						initialValues={metaData.meta}
					/>
				</div>
			</div>
		);
	} else if (selectedPlugin.admin_view) {
		window.plugin_key = TOKEN_KEY;
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
	const [isLoading, setLoading] = useState(true);
	const [metaData, setMetaData] = useState({});
	const getMetaData = useCallback(() => {
		getPluginMeta({ name: selectedPlugin.name })
			.then((res) => {
				if (res) {
					setMetaData(res);
				}
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
				setMetaData({});
			});
	}, [selectedPlugin]);
	useEffect(() => {
		getMetaData();
	}, [getMetaData]);
	if (isLoading) {
		return (
			<div className="d-flex align-items-center justify-content-center">
				<Spin />
			</div>
		);
	}
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
					<h2>{metaData.name}</h2>
					<div>
						<b>Version:</b> {metaData.version}
					</div>
				</div>
			</div>
			<div>{renderContent(selectedPlugin, requestPlugin, metaData)}</div>
		</div>
	);
};

export default PluginConfigureForm;
