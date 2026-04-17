import React, { Component } from 'react';
import { reduxForm } from 'redux-form';

import renderFields from 'components/Form/factoryFields';
import { Button, IconTitle, EditWrapper } from 'components';
import { getErrorLocalized } from 'utils/errors';
import STRINGS from 'config/localizedStrings';
// import { DEFAULT_TOGGLE_OPTIONS } from 'config/options';

export const generateNotificationFormValues = (
	DEFAULT_TOGGLE_OPTIONS,
	{
		smsFeatureEnabled = false,
		smsPluginEnabled = false,
		hasPhoneNumber = false,
	} = {}
) => {
	const values = {
		popup_order_confirmation: {
			type: 'toggle',
			stringId: 'DEFAULT_TOGGLE_OPTIONS.ON',
			label:
				STRINGS['USER_SETTINGS.NOTIFICATION_FORM.POPUP_ORDER_CONFIRMATION'],
			className: 'toggle-wrapper',
			options: DEFAULT_TOGGLE_OPTIONS,
		},
		popup_order_completed: {
			type: 'toggle',
			stringId: 'USER_SETTINGS.NOTIFICATION_FORM.POPUP_ORDER_COMPLETED',
			label: STRINGS['USER_SETTINGS.NOTIFICATION_FORM.POPUP_ORDER_COMPLETED'],
			className: 'toggle-wrapper',
			options: DEFAULT_TOGGLE_OPTIONS,
		},
		popup_order_partially_filled: {
			type: 'toggle',
			stringId: 'USER_SETTINGS.NOTIFICATION_FORM.POPUP_ORDER_PARTIALLY_FILLED',
			label:
				STRINGS['USER_SETTINGS.NOTIFICATION_FORM.POPUP_ORDER_PARTIALLY_FILLED'],
			className: 'toggle-wrapper',
			options: DEFAULT_TOGGLE_OPTIONS,
		},
		popup_order_new: {
			type: 'toggle',
			stringId: 'USER_SETTINGS.NOTIFICATION_FORM.POPUP_NEW_ORDER_CREATED',
			label: STRINGS['USER_SETTINGS.NOTIFICATION_FORM.POPUP_NEW_ORDER_CREATED'],
			className: 'toggle-wrapper',
			options: DEFAULT_TOGGLE_OPTIONS,
		},
		popup_order_canceled: {
			type: 'toggle',
			stringId: 'USER_SETTINGS.NOTIFICATION_FORM.POPUP_ORDER_CANCELLED',
			label: STRINGS['USER_SETTINGS.NOTIFICATION_FORM.POPUP_ORDER_CANCELLED'],
			className: 'toggle-wrapper',
			options: DEFAULT_TOGGLE_OPTIONS,
		},
	};

	if (smsFeatureEnabled && smsPluginEnabled) {
		const smsOptionDisabled = !hasPhoneNumber;
		const options = [
			{ value: 'email', label: 'Email' },
			{
				value: 'sms',
				label: smsOptionDisabled
					? 'Phone (SMS) \u2014 add a phone number to enable'
					: 'Phone (SMS)',
				disabled: smsOptionDisabled,
			},
		];
		values.verification_method = {
			type: 'select',
			stringId: 'USER_SETTINGS.NOTIFICATION_FORM.VERIFICATION_METHOD',
			label:
				STRINGS['USER_SETTINGS.NOTIFICATION_FORM.VERIFICATION_METHOD'] ||
				'Verification method',
			className: 'toggle-wrapper',
			options,
		};
	}

	return values;
};

const Form = ({
	handleSubmit,
	submitting,
	pristine,
	error,
	valid,
	initialValues,
	formFields,
	ICONS,
}) => (
	<form onSubmit={handleSubmit} className="settings-form-wrapper">
		<div className="settings-form">
			<IconTitle
				stringId="USER_SETTINGS.TITLE_NOTIFICATION"
				text={STRINGS['USER_SETTINGS.TITLE_NOTIFICATION']}
				textType="title"
				iconPath={ICONS['SETTING_NOTIFICATION_ICON']}
				iconId="SETTING_NOTIFICATION_ICON"
			/>
			<div className="pr-3">
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

class NotificationForm extends Component {
	componentDidUpdate(prevProps) {
		if (
			JSON.stringify(this.props.initialValues) !==
			JSON.stringify(prevProps.initialValues)
		) {
			this.props.initialize(this.props.initialValues);
		}
	}

	render() {
		return <Form {...this.props} />;
	}
}

export default reduxForm({
	form: 'NotificationForm',
})(NotificationForm);
