import React from 'react';
import { reduxForm } from 'redux-form';
// import { isMobile } from 'react-device-detect';

import renderFields from '../../components/Form/factoryFields';
import { FieldError } from '../../components/Form/FormFields/FieldWrapper';
import { Button, Accordion } from '../../components';
// import { required } from '../../components/Form/validations';
import { getErrorLocalized } from '../../utils/errors';
import STRINGS from '../../config/localizedStrings';

export const generateAudioCueFormValues = () => ({
    order_submit_confirmation: {
        type: 'toggle',
        label: STRINGS.USER_SETTINGS.AUDIO_CUE_FORM.ORDERS_COMPLETED_AUDIO,
        className: 'toggle-wrapper'
    },
    order_completed_popup: {
        type: 'toggle',
        label: STRINGS.USER_SETTINGS.AUDIO_CUE_FORM.ORDERS_PARTIAL_AUDIO,
        className: 'toggle-wrapper'
    },
    order_partially_completed: {
        type: 'toggle',
        label: STRINGS.USER_SETTINGS.AUDIO_CUE_FORM.PUBLIC_TRADE_AUDIO,
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
            <Button
                className="mt-4"
                label={STRINGS.SETTING_BUTTON}
                disabled={pristine || submitting || !valid}
            />
        </form>
    );

const AudioCueForm = (props) => {
    const section = [{
        title: STRINGS.USER_SETTINGS.TITLE_AUDIO_CUE,
        content: <Form {...props} />
    }]
    return <Accordion sections={section} />
}

export default reduxForm({
    form: 'AudioCueForm'
})(AudioCueForm);
