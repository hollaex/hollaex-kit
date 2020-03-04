import React from 'react';
import { Button } from 'antd';

import { AdminHocForm } from '../../../components';
import { getPluginsForm } from './Utils';

const Form = AdminHocForm('PLUGINS_FORM', 'plugins-form', true);

const PluginServiceForm = ({ initialValues, connectStatus, services, handleSubmitPlugins, handleDeactivate }) => {
	const Fields = getPluginsForm(services);
	return (
		<div className="mb-4">
			{Fields && Object.keys(Fields).length
				? <div>
					<Form
						initialValues={initialValues}
						onSubmit={(formProps) => {
							if (!connectStatus)
								handleSubmitPlugins(formProps, services);
							else
								handleDeactivate(services);
						}}
						buttonText={connectStatus ? 'Deactivate' : 'Activate'}
						fields={Fields}
					/>
				</div>
				: <Button
					type="primary"
					onClick={() => {
						if (!connectStatus)
							handleSubmitPlugins({}, services);
						else
							handleDeactivate(services);
					}}>
					{connectStatus ? 'Deactivate' : 'Activate'}
				</Button>
			}
		</div>
	);
};

export default PluginServiceForm;
