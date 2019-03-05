import React from 'react';
import { reduxForm } from 'redux-form';
import { isMobile } from 'react-device-detect';
import renderFields from '../../components/Form/factoryFields';
import { Button } from '../../components';
import { requiredBoolean } from '../../components/Form/validations';
import { getErrorLocalized } from '../../utils/errors';
import STRINGS from '../../config/localizedStrings';

export const generateFormValues = () => ({
	theme: {
		type: 'select',
		label: STRINGS.SETTINGS_THEME_LABEL,
		options: STRINGS.SETTINGS_THEME_OPTIONS
	},
	orderConfirmationPopup: {
		type: 'select',
		validate: [requiredBoolean],
		label: STRINGS.SETTINGS_ORDERPOPUP_LABEL,
		options: STRINGS.SETTINGS_ORDERPOPUP_OPTIONS,
		fullWidth: isMobile

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
		<Button
			label={STRINGS.SETTING_BUTTON}
			disabled={pristine || submitting || !valid}
		/>
	</form>
);

export default reduxForm({
	form: 'SettingsForm'
})(Form);
