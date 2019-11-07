import React from 'react';
import { reduxForm } from 'redux-form';
import {
	required,
	password,
	email,
	requiredWithCustomMessage,
	normalizeEmail
} from '../../components/Form/validations';
import { AuthForm, BlueLink } from '../../components';
import STRINGS from '../../config/localizedStrings';

export const FORM_NAME = 'SignForm';

export const generateFormFields = (strings, theme) => ({
	email: {
		type: 'email',
		validate: [
			requiredWithCustomMessage(strings.VALIDATIONS.TYPE_EMAIL),
			email
		],
		normalize: normalizeEmail,
		fullWidth: true,
		label: strings.FORM_FIELDS.EMAIL_LABEL,
		placeholder: strings.FORM_FIELDS.EMAIL_PLACEHOLDER
	},
	password: {
		type: 'password',
		validate: [required, password],
		fullWidth: true,
		label: strings.FORM_FIELDS.PASSWORD_LABEL,
		placeholder: strings.FORM_FIELDS.PASSWORD_PLACEHOLDER
	},
	password_repeat: {
		type: 'password',
		validate: [required],
		fullWidth: true,
		label: strings.FORM_FIELDS.PASSWORD_REPEAT_LABEL,
		placeholder: strings.FORM_FIELDS.PASSWORD_REPEAT_PLACEHOLDER
	},
	terms: {
		type: 'checkbox',
		fullWidth: true,
		validate: [requiredWithCustomMessage(strings.VALIDATIONS.ACCEPT_TERMS)],
		label: strings.formatString(
			strings.SIGN_UP.TERMS.text,
			<BlueLink
				href="https://bitholla.com/terms-of-use/"
				text={strings.SIGN_UP.TERMS.terms}
			/>,
			<BlueLink
				href="https://bitholla.com/privacy-policy/"
				text={strings.SIGN_UP.TERMS.policy}
			/>
		)
	},
	captcha: {
		type: 'captcha',
		theme,
		validate: [required]
	}
});

const validate = (values) => {
	const { password, password_repeat } = values;
	const errors = {};

	if (password && password_repeat && password !== password_repeat) {
		errors.password_repeat = STRINGS.VALIDATIONS.PASSWORDS_DONT_MATCH;
	}

	return errors;
};

const Form = (props) => (
	<AuthForm {...props} buttonLabel={STRINGS.SIGNUP_TEXT} />
);

export default reduxForm({
	form: FORM_NAME,
	validate
})(Form);
