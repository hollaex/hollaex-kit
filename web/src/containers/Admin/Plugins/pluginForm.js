import React from 'react';

import { AdminHocForm } from '../../../components';
import { getPluginsForm } from './Utils';

const Form = AdminHocForm('PLUGINS_FORM', 'plugins-form');

const PluginServiceForm = ({ initialValues, services, handleSubmitPlugins }) => {
	const Fields = getPluginsForm(services);
	return (
		<div className="mb-4">
			<Form
				initialValues={initialValues}
				onSubmit={(formProps) => {
					handleSubmitPlugins(formProps, services);
				}}
				buttonText={services === 'vault' ? 'Connect' : 'Save'}
				fields={Fields}
			/>
		</div>
	);
};

export default PluginServiceForm;
