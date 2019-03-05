import React from 'react';
import { reduxForm } from 'redux-form';
import { isMobile } from 'react-device-detect';

import renderFields from '../../components/Form/factoryFields';
import { FieldError } from '../../components/Form/FormFields/FieldWrapper';
import { Button } from '../../components';
import { required } from '../../components/Form/validations';
import { getErrorLocalized } from '../../utils/errors';
import STRINGS from '../../config/localizedStrings';

export const generateLanguageFormValues = () => ({
    language: {
        type: 'select',
        validate: [required],
        label: STRINGS.SETTINGS_LANGUAGE_LABEL,
        options: STRINGS.SETTINGS_LANGUAGE_OPTIONS,
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
    form: 'LanguageForm'
})(Form);
