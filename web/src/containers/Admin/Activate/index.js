import React from 'react';
import { SubmissionError } from 'redux-form';
import { activateUser } from './actions';
import { AdminHocForm } from '../../../components';
import { Divider } from 'antd';

const Form = AdminHocForm('ACTIVATION_FORM');

const onSubmit = (refreshData) => (values) => {
	return activateUser(values)
		.then((res) => {
			refreshData(values);
		})
		.catch((err) => {
			throw new SubmissionError({ _error: err.data.message });
		});
};

const OTP = ({ user_id, activated, refreshData }) => (
	<div>
		<span>
			{activated
				? 'This account is active'
				: 'This account is deactivated (frozen)'}
		</span>
		<Divider />
		<Form
			onSubmit={() => onSubmit(refreshData)({ user_id, activated: !activated })}
			buttonText={activated ? 'Deactivate' : 'Activate'}
		/>
	</div>
);

export default OTP;
