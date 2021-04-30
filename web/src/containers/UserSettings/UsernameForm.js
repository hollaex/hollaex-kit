import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { isMobile } from 'react-device-detect';

import renderFields from '../../components/Form/factoryFields';
import { FieldError } from '../../components/Form/FormFields/FieldWrapper';
import { Button, IconTitle } from '../../components';
import { required, username } from '../../components/Form/validations';
import { getErrorLocalized } from '../../utils/errors';
import STRINGS from '../../config/localizedStrings';
import { EditWrapper } from 'components';

export const generateUsernameFormValues = (disabled = false) => ({
	username: {
		type: 'text',
		stringId: 'USERNAME_LABEL,USERNAME_PLACEHOLDER',
		validate: [required, username],
		label: STRINGS['USERNAME_LABEL'],
		placeholder: STRINGS['USERNAME_PLACEHOLDER'],
		disabled,
		fullWidth: isMobile,
		ishorizontalfield: true,
	},
});

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
						stringId="USER_SETTINGS.TITLE_CHAT"
						text={STRINGS['USER_SETTINGS.TITLE_CHAT']}
						textType="title"
						iconPath={ICONS['SETTING_CHAT_ICON']}
					/>
					<div className="pr-4">
						{renderFields(formFields)}
						{error && (
							<div className="warning_text">{getErrorLocalized(error)}</div>
						)}
						{!formFields.username.disabled && (
							<FieldError
								className="warning_text mb-4"
								displayError={true}
								error={STRINGS['USERNAME_WARNING']}
								stringId="USERNAME_WARNING"
							/>
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
	form: 'UsernameForm',
})(Form);
