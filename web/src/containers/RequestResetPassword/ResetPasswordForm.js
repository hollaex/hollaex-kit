import React from 'react';
import { reduxForm } from 'redux-form';
import {
	requiredWithCustomMessage,
	email,
	normalizeEmail,
	required,
} from '../../components/Form/validations';
import { AuthForm } from '../../components';
import STRINGS from '../../config/localizedStrings';
import { getLanguage } from '../../utils/string';

export const generateFormFields = (theme) => ({
	email: {
		type: 'email',
		validate: [
			requiredWithCustomMessage(STRINGS['VALIDATIONS.TYPE_EMAIL']),
			email,
		],
		normalize: normalizeEmail,
		fullWidth: true,
		label: STRINGS['FORM_FIELDS.EMAIL_LABEL'],
		placeholder: STRINGS['FORM_FIELDS.EMAIL_PLACEHOLDER'],
	},
	captcha: {
		type: 'captcha',
		language: getLanguage(),
		theme: theme,
		validate: [required],
	},
});

const Form = (props) => (
	<AuthForm {...props} buttonLabel={STRINGS['REQUEST_RESET_PASSWORD.BUTTON']} />
);

export default reduxForm({
	form: 'ResetPasswordForm',
})(Form);
