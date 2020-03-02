import React from 'react';
import { AdminHocForm } from '../../../components';
import { getPluginsForm } from './Utils';

const Form = AdminHocForm('PLUGIN_S3_FORM', 'pluginform-form');
const PluginSNSForm = AdminHocForm('PLUGIN_SNS_FORM', 'pluginform-form');
const FreshdeskForm = AdminHocForm('PLUGIN_FRESH_DESK_FORM', 'pluginform-form');

export const S3Form = ({ handleSubmitVault }) => {
	return (
		<div className="mb-4">
			<Form
				onSubmit={(formProps) => handleSubmitVault(formProps, 's3')}
				buttonText="Save"
				fields={getPluginsForm('s3')}
			/>
		</div>
	);
};

export const SNSForm = ({ handleSubmitVault }) => {
	return (
		<div className="mb-4">
			<PluginSNSForm
				onSubmit={(formProps) => handleSubmitVault(formProps, 'sns')}
				buttonText="Save"
				fields={getPluginsForm('sns')}
			/>
		</div>
	);
};

export const Freshdesk = ({ handleSubmitVault }) => {
	return (
		<div className="mb-4">
			<FreshdeskForm
				onSubmit={(formProps) => handleSubmitVault(formProps, 'freshdesk')}
				buttonText="Save"
				fields={getPluginsForm('freshdesk')}
			/>
		</div>
	);
};


