import React from 'react';
import { AdminHocForm } from '../../../components';
const Form = AdminHocForm('PLUGINS_FORM', 'plugins-form');

const PluginServiceForm = ({
	initialValues,
	services,
	fields,
	handleSubmitPlugins,
}) => {
	return (
		<div className="mb-4">
			<Form
				initialValues={initialValues}
				onSubmit={(formProps) => {
					handleSubmitPlugins(formProps, services);
				}}
				buttonText={services === 'vault' ? 'Connect' : 'Save'}
				fields={fields}
			/>
		</div>
	);
};

export default PluginServiceForm;
