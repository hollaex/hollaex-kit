import React from 'react';
import { reduxForm } from 'redux-form';
import { isMobile } from 'react-device-detect';

import renderFields from '../../components/Form/factoryFields';
import { Button } from '../../components';
import { required, password } from '../../components/Form/validations';

import STRINGS from '../../config/localizedStrings';
import { EditWrapper } from 'components';

const validate = (values) => {
	const errors = {};
	if (values.new_password !== values.new_password_confirm) {
		errors.new_password_confirm = STRINGS['VALIDATIONS.PASSWORDS_DONT_MATCH'];
	}

	return errors;
};

export const generateFormValues = () => ({
	old_password: {
		type: 'password',
		stringId:
			'ACCOUNT_SECURITY.CHANGE_PASSWORD.FORM.CURRENT_PASSWORD.label,ACCOUNT_SECURITY.CHANGE_PASSWORD.FORM.CURRENT_PASSWORD.placeholder',
		validate: [required, password],
		label:
			STRINGS['ACCOUNT_SECURITY.CHANGE_PASSWORD.FORM.CURRENT_PASSWORD.label'],
		placeholder:
			STRINGS[
				'ACCOUNT_SECURITY.CHANGE_PASSWORD.FORM.CURRENT_PASSWORD.placeholder'
			],
		fullWidth: isMobile,
		ishorizontalfield: true,
	},
	new_password: {
		type: 'password',
		stringId:
			'ACCOUNT_SECURITY.CHANGE_PASSWORD.FORM.NEW_PASSWORD.label,ACCOUNT_SECURITY.CHANGE_PASSWORD.FORM.NEW_PASSWORD.placeholder',
		validate: [required, password],
		label: STRINGS['ACCOUNT_SECURITY.CHANGE_PASSWORD.FORM.NEW_PASSWORD.label'],
		placeholder:
			STRINGS['ACCOUNT_SECURITY.CHANGE_PASSWORD.FORM.NEW_PASSWORD.placeholder'],
		fullWidth: isMobile,
		ishorizontalfield: true,
	},
	new_password_confirm: {
		type: 'password',
		stringId:
			'ACCOUNT_SECURITY.CHANGE_PASSWORD.FORM.NEW_PASSWORD_REPEAT.label,ACCOUNT_SECURITY.CHANGE_PASSWORD.FORM.NEW_PASSWORD_REPEAT.placeholder',
		validate: [required],
		label:
			STRINGS[
				'ACCOUNT_SECURITY.CHANGE_PASSWORD.FORM.NEW_PASSWORD_REPEAT.label'
			],
		placeholder:
			STRINGS[
				'ACCOUNT_SECURITY.CHANGE_PASSWORD.FORM.NEW_PASSWORD_REPEAT.placeholder'
			],
		fullWidth: isMobile,
		ishorizontalfield: true,
	},
});

const Form = ({
	handleSubmit,
	submitting,
	pristine,
	error,
	valid,
	initialValues,
	formFields,
}) => (
	<form onSubmit={handleSubmit} className="change-password-form-wrapper">
		<div className="change-password-form">
			{renderFields(formFields)}
			{error && <div className="warning_text">{error}</div>}
		</div>
		<div className="d-flex justify-content-center mb-4">
			<EditWrapper stringId="ACCOUNT_SECURITY.CHANGE_PASSWORD.FORM.BUTTON" />
			<Button
				label={STRINGS['ACCOUNT_SECURITY.CHANGE_PASSWORD.FORM.BUTTON']}
				disabled={pristine || submitting || !valid}
				className="password-btn"
			/>
		</div>
	</form>
);

export default reduxForm({
	form: 'ChangePasswordForm',
	validate,
})(Form);
