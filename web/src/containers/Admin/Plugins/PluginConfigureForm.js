import React, { useEffect, useState, useCallback } from 'react';
import { SubmissionError } from 'redux-form';
import { message, Spin } from 'antd';

import { STATIC_ICONS } from 'config/icons';
import { AdminHocForm } from '../../../components';
import { validateRequired } from '../../../components/AdminForm/validations';
import { updatePluginMeta, getPluginMeta, updatePluginPublicMeta } from './action';
import { TOKEN_KEY, PLUGIN_URL } from '../../../config/constants';
import './index.css';

const MetaForm = AdminHocForm('PLUGIN_CONFIGURE_FORM');
const PublicMetaForm = AdminHocForm('PLUGIN_PUBLIC_CONFIGURE_FORM');

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
	const onSavePublicMeta = (values, plugin) => {
		return updatePluginPublicMeta({ name: plugin.name, public_meta: values })
			.then((res) => {
				message.success('Data saved successfully');
				requestPlugin();
			})
			.catch((error) => {
				const message = error.data ? error.data.message : error.message;
				throw new SubmissionError({ _error: message });
			});
	};

	if (selectedPlugin.meta && selectedPlugin.public_meta) {
		const { meta, public_meta } = selectedPlugin;
		const metaFields = meta ? Object.keys(meta) : [];
		const fieldData = {};
		let publicMetaFields = public_meta ? Object.keys(public_meta) : [];
		let publicFieldData = {};
		const renderFields = (fieldData, key, metaDesc, isRequired = false) => {
			const fields = metaDesc[key];
			if (fields && typeof fields === 'object') {
				fieldData[key] = {
					type: fields.type,
					label: key,
					placeholder: key,
					value: fields.value,
					description: fields.description
				};
				if (fields.required) {
					fieldData[key].validate = [validateRequired];
				}
			} else {
				if (key.toLowerCase().includes('secret')) {
					fieldData[key] = {
						type: 'password',
						label: key,
						placeholder: key
					};
					if (isRequired) {
						fieldData[key].validate = [validateRequired];
					}
				} else {
					fieldData[key] = {
						type: 'text',
						label: key,
						placeholder: key
					};
					if (isRequired) {
						fieldData[key].validate = [validateRequired];
					}
				}
			}
		}
		metaFields.forEach((key) => {
			renderFields(fieldData, key, meta, true)
		});
		publicMetaFields.forEach((key) => {
			renderFields(publicFieldData, key, public_meta)
		});
		return (
			<div className="config-content mt-5 pb-5 w-50">
				<div className="mt-2">Configure</div>
				{publicMetaFields.length
					? <div className="mt-5">
						<div className="mb-2">Public</div>
						<PublicMetaForm
							onSubmit={(formProps) => onSavePublicMeta(formProps, public_meta)}
							buttonText="Save"
							buttonClass="plugin-config-btn"
							fields={publicFieldData}
							initialValues={public_meta}
						/>
					</div>
					: null
				}
				<div className="mt-5 config-content">
					<div className="mb-2">Private</div>
					<MetaForm
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
		window.plugin_url = PLUGIN_URL;
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
