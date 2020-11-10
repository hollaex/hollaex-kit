import React from 'react';
import { AdminHocForm } from '../../../components';
const Form = AdminHocForm('BROKER_FORM', 'broker-form');

const BrokerForm = ({ initialValues, fields, handleSubmitBroker }) => {
	return (
		<div className="mb-4">
			<Form
				initialValues={initialValues}
				onSubmit={(formProps) => {
					handleSubmitBroker(formProps);
				}}
				buttonText={'Save'}
				fields={fields}
			/>
		</div>
	);
};

export default BrokerForm;
