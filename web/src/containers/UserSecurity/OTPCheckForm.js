import React from 'react';
import { reduxForm } from 'redux-form';
import { required } from '../../components/Form/validations';
import renderFields from '../../components/Form/factoryFields';
import { Button } from '../../components';
import STRINGS from '../../config/localizedStrings';

const Form = ({ handleSubmit, submitting, pristine, error, valid }) => {
	const formFields = {
		code: {
			type: 'number',
			placeholder: STRINGS.ACCOUNT_SECURITY.OTP.CHECK_FORM.PLACEHOLDER,
			validate: [required],
			fullWidth: true
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className="otp_form-fields-wrapper">
				{renderFields(formFields)}
				{error && <div className="warning_text">{error}</div>}
			</div>
			<Button
				label={STRINGS.ACCOUNT_SECURITY.OTP.CHECK_FORM.BUTTON}
				className="mb-5"
				disabled={pristine || submitting || !valid}
			/>
		</form>
	);
};

export default reduxForm({
	form: 'OTPActivationForm'
})(Form);
