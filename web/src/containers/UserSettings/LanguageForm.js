import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { isMobile } from 'react-device-detect';

import renderFields from '../../components/Form/factoryFields';
import { Button, IconTitle } from '../../components';
import { required } from '../../components/Form/validations';
import { getErrorLocalized } from '../../utils/errors';
import STRINGS from '../../config/localizedStrings';
import { EditWrapper } from 'components';

export const generateLanguageFormValues = (values = '') => {
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
			ishorizontalfield: true,
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
			ICONS,
		} = this.props;
		return (
			<form onSubmit={handleSubmit} className="settings-form-wrapper">
				<div className="settings-form">
					<IconTitle
						stringId="USER_SETTINGS.TITLE_LANGUAGE"
						text={STRINGS['USER_SETTINGS.TITLE_LANGUAGE']}
						textType="title"
						iconPath={ICONS['SETTING_LANGUAGE_ICON']}
					/>
					<div className="pr-4">
						{renderFields(formFields)}
						{error && (
							<div className="warning_text">{getErrorLocalized(error)}</div>
						)}
					</div>
				</div>
				<div className="d-flex align-items-center justify-content-center">
					<EditWrapper stringId="SETTING_BUTTON" />
					<Button
						label={STRINGS['SETTING_BUTTON']}
						disabled={pristine || submitting || !valid}
					/>
				</div>
			</form>
		);
	}
}

export default reduxForm({
	form: 'LanguageForm',
})(Form);
