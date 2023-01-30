import React from 'react';
import { reduxForm } from 'redux-form';
import { required, password } from 'components/Form/validations';
import { AuthForm } from 'components';
import STRINGS from 'config/localizedStrings';

export const generateFormFields = (onBlur) => ({
	password: {
		type: 'password',
		validate: [required, password],
		fullWidth: true,
		label: STRINGS['FORM_FIELDS.PASSWORD_LABEL'],
		placeholder: STRINGS['FORM_FIELDS.PASSWORD_PLACEHOLDER'],
		onBlur: onBlur,
	},
	password_repeat: {
		type: 'password',
		validate: [required],
		fullWidth: true,
		label: STRINGS['FORM_FIELDS.PASSWORD_REPEAT_LABEL'],
		placeholder: STRINGS['FORM_FIELDS.PASSWORD_REPEAT_PLACEHOLDER'],
		onBlur: onBlur,
	},
});

const validate = (values) => {
	const { password, password_repeat } = values;
	const errors = {};

	if (password && password_repeat && password !== password_repeat) {
		errors.password_repeat = STRINGS['VALIDATIONS.PASSWORDS_DONT_MATCH'];
	}

	return errors;
};

const Form = (props) => {
	const onChange = (values) => {
		console.log('onChange');
	};
	return (
		<AuthForm
			{...props}
			formFields={generateFormFields(onChange)}
			buttonLabel={STRINGS['RESET_PASSWORD.BUTTON']}
		/>
	);
};
export default reduxForm({
	form: 'RequestPasswordForm',
	touchOnBlur: true,
	touchOnChange: true,
	validate,
})(Form);
