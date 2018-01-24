import React from 'react';
import classnames from 'classnames';
import { reduxForm } from 'redux-form';
import { Link } from 'react-router';
import {
	required,
	password,
	email,
	requiredWithCustomMessage
} from '../../components/Form/validations';
import { AuthForm } from '../../components';
import STRINGS from '../../config/localizedStrings';

const BlueLink = ({ text, ...rest }) => (
	<Link
		{...rest}
		target="_blank"
		className={classnames('blue-link', 'dialog-link', 'pointer')}
	>
		{text}
	</Link>
);

export const generateFormFields = (strings) => ({
	email: {
		type: 'email',
		validate: [
			requiredWithCustomMessage(strings.VALIDATIONS.TYPE_EMAIL),
			email
		],
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
			<BlueLink to="/general-terms" text={strings.SIGN_UP.TERMS.terms} />,
			<BlueLink to="/privacy-policy" text={strings.SIGN_UP.TERMS.policy} />
		)
	},
	captcha: {
		type: 'captcha',
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
	form: 'SignForm',
	validate
})(Form);
