import React from 'react';
import { reduxForm } from 'redux-form';
import { required } from '../../components/Form/validations';
import renderFields from '../../components/Form/factoryFields';
import { Button } from '../../components';
import STRINGS from '../../config/localizedStrings';
import { EditWrapper } from 'components';

const Form = ({ handleSubmit, submitting, pristine, error, valid }) => {
	const formFields = {
		code: {
			stringId: 'ACCOUNT_SECURITY.OTP.FORM.PLACEHOLDER',
			type: 'number',
			placeholder: STRINGS['ACCOUNT_SECURITY.OTP.FORM.PLACEHOLDER'],
			validate: [required],
			fullWidth: true,
		},
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className="otp_form-fields-wrapper">
				{renderFields(formFields)}
				{error && <div className="warning_text">{error}</div>}
			</div>
			<EditWrapper stringId="ACCOUNT_SECURITY.OTP.FORM.BUTTON" />
			<Button
				label={STRINGS['ACCOUNT_SECURITY.OTP.FORM.BUTTON']}
				className="mb-5"
				disabled={pristine || submitting || !valid}
			/>
		</form>
	);
};

export default reduxForm({
	form: 'OTPActivationForm',
})(Form);
