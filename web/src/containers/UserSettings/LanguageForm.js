import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { isMobile } from 'react-device-detect';

import renderFields from '../../components/Form/factoryFields';
import { Button } from '../../components';
import { required } from '../../components/Form/validations';
import { getErrorLocalized } from '../../utils/errors';
import STRINGS from '../../config/localizedStrings';
import { EditWrapper } from 'components';

export const generateLanguageFormValues = (values) => {
	const langValues = STRINGS.SETTINGS_LANGUAGE_OPTIONS.filter((filterValue) => {
		return values.includes(filterValue.value);
	});
	return {
		language: {
			type: 'select',
			validate: [required],
			stringId: 'SETTINGS_LANGUAGE_LABEL',
			label: STRINGS['SETTINGS_LANGUAGE_LABEL'],
			options: langValues,
			fullWidth: isMobile,
		},
	};
};

class Form extends Component {
	componentDidUpdate(prevProps) {
		if (
			JSON.stringify(this.props.initialValues) !==
			JSON.stringify(prevProps.initialValues)
		) {
			this.props.initialize(this.props.initialValues);
		}
	}

	render() {
		const {
			handleSubmit,
			submitting,
			pristine,
			error,
			valid,
			formFields,
		} = this.props;
		return (
			<form onSubmit={handleSubmit}>
				{renderFields(formFields)}
				{error && (
					<div className="warning_text">{getErrorLocalized(error)}</div>
				)}
				<EditWrapper stringId="SETTING_BUTTON" />
				<Button
					label={STRINGS['SETTING_BUTTON']}
					disabled={pristine || submitting || !valid}
				/>
			</form>
		);
	}
}

export default reduxForm({
	form: 'LanguageForm',
})(Form);
