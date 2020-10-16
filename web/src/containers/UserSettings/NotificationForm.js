import React, { Component } from 'react';
import { reduxForm } from 'redux-form';

import renderFields from '../../components/Form/factoryFields';
import { Button, Accordion } from '../../components';
import { getErrorLocalized } from '../../utils/errors';
import STRINGS from '../../config/localizedStrings';
import { EditWrapper } from 'components';

export const generateNotificationFormValues = () => ({
    popup_order_confirmation: {
        type: 'toggle',
        stringId: 'USER_SETTINGS.NOTIFICATION_FORM.POPUP_ORDER_CONFIRMATION',
        label: STRINGS["USER_SETTINGS.NOTIFICATION_FORM.POPUP_ORDER_CONFIRMATION"],
        className: 'toggle-wrapper'
    },
    popup_order_completed: {
        type: 'toggle',
        stringId: 'USER_SETTINGS.NOTIFICATION_FORM.POPUP_ORDER_COMPLETED',
        label: STRINGS["USER_SETTINGS.NOTIFICATION_FORM.POPUP_ORDER_COMPLETED"],
        className: 'toggle-wrapper'
    },
    popup_order_partially_filled: {
        type: 'toggle',
        stringId: 'USER_SETTINGS.NOTIFICATION_FORM.POPUP_ORDER_PARTIALLY_FILLED',
        label: STRINGS["USER_SETTINGS.NOTIFICATION_FORM.POPUP_ORDER_PARTIALLY_FILLED"],
        className: 'toggle-wrapper'
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
            <EditWrapper stringId="SETTING_BUTTON" />
            <Button
                className="mt-4"
                label={STRINGS["SETTING_BUTTON"]}
                disabled={pristine || submitting || !valid}
            />
        </form>
    );

class NotificationForm extends Component {
    componentDidUpdate(prevProps) {
        if (JSON.stringify(this.props.initialValues) !== JSON.stringify(prevProps.initialValues)) {
            this.props.initialize(this.props.initialValues)
        }
    }

    render() {
        const section = [{
            stringId: "USER_SETTINGS.NOTIFICATION_FORM.TRADE_POPUPS",
            title: STRINGS["USER_SETTINGS.NOTIFICATION_FORM.TRADE_POPUPS"],
            content: <Form {...this.props} />,
            isOpen: true
        }]
        return <Accordion sections={section} />
    }
}

export default reduxForm({
    form: 'NotificationForm'
})(NotificationForm);
