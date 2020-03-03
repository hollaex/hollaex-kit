import React from 'react';
import { Button } from 'antd';

import { AdminHocForm } from '../../../components';
import { getPluginsForm } from './Utils';

const Form = AdminHocForm('PLUGINS_FORM', 'plugins-form');

const PluginServiceForm = ({ initialValues, connectStatus, services, handleSubmitPlugins, handleDeactivate }) => {
	const Fields = getPluginsForm(services);
	return (
		<div className="mb-4">
			{Fields && Object.keys(Fields).length
				? <div>
					<Form
						initialValues={initialValues}
						onSubmit={(formProps) => handleSubmitPlugins(formProps, services)}
						buttonText={connectStatus ? 'Update' : 'Activate'}
						fields={Fields}
					/>
					{connectStatus && (
						<div className="my-3">
							<Button
								type="primary"
								className="w-100"
								size="large"
								onClick={() => handleDeactivate(services)}
							>
								Deactivate
							</Button>
						</div>
					)}
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
