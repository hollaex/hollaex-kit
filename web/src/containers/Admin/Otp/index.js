import React from 'react';
import { SubmissionError } from 'redux-form';
import { deactivateOtp } from './actions';
import { AdminHocForm } from '../../../components';

const Form = AdminHocForm('OTP_FORM');

const onSubmit = (refreshData) => (values) => {
	// redux form set numbers as string, se we have to parse them
	const postValues = {
		user_id: parseInt(values.user_id, 10),
	};

	return deactivateOtp(postValues)
		.then((res) => {
			refreshData({ otp_enabled: false });
		})
		.catch((err) => {
			throw new SubmissionError({ _error: err.data.message });
		});
};

const OTP = ({ user_id, otp_enabled, refreshData }) =>
	!otp_enabled ? (
		<div>OTP is disabled</div>
	) : (
		<Form
			onSubmit={() => onSubmit(refreshData)({ user_id })}
			buttonText="Deactivate"
		/>
	);

export default OTP;
