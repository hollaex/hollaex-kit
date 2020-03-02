import React from 'react';
import { AdminHocForm } from '../../../components';
import { getPluginsForm } from './Utils';

const Form = AdminHocForm('PLUGINS_FORM', 'plugins-form');

export const PluginServiceForm = ({ services, handleSubmitPlugins }) => {
	return (
		<div className="mb-4">
			<Form
				onSubmit={(formProps) => handleSubmitPlugins(formProps, services)}
				buttonText="Save"
				fields={getPluginsForm(services)}
			/>
		</div>
	);
};
