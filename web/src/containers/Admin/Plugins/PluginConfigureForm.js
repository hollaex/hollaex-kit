import React, { useEffect, useState, useCallback } from 'react';
import { SubmissionError } from 'redux-form';
import { message, Spin } from 'antd';

import { STATIC_ICONS } from 'config/icons';
import {
	validateRequired,
	validateBoolean,
	validateNumber,
} from '../../../components/AdminForm/validations';
import { updatePluginMeta, getPluginMeta } from './action';
import { TOKEN_KEY, PLUGIN_URL } from '../../../config/constants';
import './index.css';
import PluginMetaForm from './PluginMetaForm';

const renderContent = (selectedPlugin, setMetaData, metaData, restart) => {
	const onSaveMeta = (values, metaData) => {
		const payload = { name: metaData.name, ...values };
		return updatePluginMeta(payload)
			.then((res) => {
				message.success('Data saved successfully');
				if (res) {
					setMetaData({ ...metaData, ...res });
				}
				restart();
			})
			.catch((error) => {
				const message = error.data ? error.data.message : error.message;
				throw new SubmissionError({ _error: message });
			});
	};

	if (metaData.meta || metaData.public_meta) {
		const { meta, public_meta } = metaData;
		const metaFields = meta ? Object.keys(meta) : [];
		const fieldData = {};
		let publicMetaFields = public_meta ? Object.keys(public_meta) : [];
		let publicFieldData = {};
		const meta_initialvalues = {};
		const public_meta_initialvalues = {};
		const renderFields = (
			fieldData,
			key,
			metaDesc,
			initialValues,
			isRequired = false
		) => {
			const fields = metaDesc[key];
			if (fields && typeof fields === 'object') {
				fieldData[key] = {
					type: fields.type,
					label: key,
					placeholder: key,
					value: fields.value,
					description: fields.description,
				};
				if (fields.required) {
					fieldData[key].validate = [validateRequired];
				}
				if (fields.type === 'boolean') {
					fieldData[key].validate = [validateBoolean];
				}
				if (fields.type === 'number') {
					fieldData[key].validate = [validateNumber];
				}
				initialValues[key] = fields.value;
			} else {
				if (key.toLowerCase().includes('secret')) {
					fieldData[key] = {
						type: 'password',
						label: key,
						placeholder: key,
					};
					if (isRequired) {
						fieldData[key].validate = [validateRequired];
					}
				} else {
					fieldData[key] = {
						type: 'text',
						label: key,
						placeholder: key,
					};
					if (isRequired) {
						fieldData[key].validate = [validateRequired];
					}
				}
				initialValues[key] = metaDesc[key];
			}
		};
		metaFields.forEach((key) => {
			renderFields(fieldData, key, meta, meta_initialvalues, true);
		});
		publicMetaFields.forEach((key) => {
			renderFields(
				publicFieldData,
				key,
				public_meta,
				public_meta_initialvalues
			);
		});
		const initialValues = {
			meta: meta_initialvalues,
			public_meta: public_meta_initialvalues,
		};
		return (
			<div className="config-content mt-5 pb-5 w-50">
				<div className="mt-2">Configure</div>
				<PluginMetaForm
					onSaveMeta={(formValues) => onSaveMeta(formValues, metaData)}
					metaFields={fieldData}
					publicMetaFields={publicFieldData}
					initialValues={initialValues}
				/>
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

const PluginConfigureForm = ({ selectedPlugin, requestPlugin, restart }) => {
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
			<div>{renderContent(selectedPlugin, setMetaData, metaData, restart)}</div>
		</div>
	);
};

export default PluginConfigureForm;
