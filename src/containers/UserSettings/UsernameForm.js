import React from 'react';
import { reduxForm } from 'redux-form';

import renderFields from '../../components/Form/factoryFields';
import { FieldError } from '../../components/Form/FormFields/FieldWrapper';
import { Button } from '../../components';
import { required, username } from '../../components/Form/validations';
import { getErrorLocalized } from '../../utils/errors';
import STRINGS from '../../config/localizedStrings';

export const generateUsernameFormValues = (disabled = false) => ({
	username: {
		type: 'text',
		validate: [required, username],
		label: STRINGS.USERNAME_LABEL,
		placeholder: STRINGS.USERNAME_PLACEHOLDER,
    disabled
	}
});

const Form = ({
	handleSubmit,
	submitting,
	pristine,
	error,
	valid,
	initialValues,
	formFields
}) => (
	<form onSubmit={handleSubmit}>
		{renderFields(formFields)}
		{error && <div className="warning_text">{getErrorLocalized(error)}</div>}
		{!formFields.username.disabled && <FieldError className="warning_text mb-4" displayError={true} error={STRINGS.USERNAME_WARNING} />}
		<Button
			label={STRINGS.SETTING_BUTTON}
			disabled={pristine || submitting || !valid}
		/>
	</form>
);

export default reduxForm({
	form: 'SettingsForm'
})(Form);
