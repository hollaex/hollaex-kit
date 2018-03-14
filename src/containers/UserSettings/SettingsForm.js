import React from 'react';
import { reduxForm } from 'redux-form';

import renderFields from '../../components/Form/factoryFields';
import { Button } from '../../components';
import { required, requiredBoolean } from '../../components/Form/validations';

import STRINGS from '../../config/localizedStrings';

export const generateFormValues = () => ({
	language: {
		type: 'select',
		validate: [required],
		label: STRINGS.SETTINGS_LANGUAGE_LABEL,
		options: STRINGS.SETTINGS_LANGUAGE_OPTIONS
	},
	orderConfirmationPopup: {
		type: 'select',
		validate: [requiredBoolean],
		label: STRINGS.SETTINGS_ORDERPOPUP_LABEL,
		options: STRINGS.SETTINGS_ORDERPOPUP_OPTIONS
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
		{error && <div className="warning_text">{error}</div>}
		<Button
			label={STRINGS.SETTING_BUTTON}
			disabled={pristine || submitting || !valid}
		/>
	</form>
);

export default reduxForm({
	form: 'SettingsForm'
})(Form);
