import React from 'react';

import { AdminHocForm } from '../../../components';
import { generateAdminSettings } from './Utils';

const Form = AdminHocForm('ADMIN_SETTINGS_FORM', 'transaction-form');
const EmailForm = AdminHocForm('ADMIN_EMAIL_SETTINGS_FORM', 'transaction-form');
const SecurityForm = AdminHocForm('ADMIN_SECURITY_SETTINGS_FORM', 'transaction-form');

export const GeneralSettingsForm = ({ initialValues, handleSubmitSettings }) => {
    return (
        <div className="mb-4">
            <Form
                initialValues={initialValues}
                onSubmit={(formProps) => handleSubmitSettings(formProps, 'general')}
                buttonText="Save"
                fields={generateAdminSettings('general')}
            />
        </div>
    );
};

GeneralSettingsForm.defaultProps = {
    initialValues: {
        theme: 'white',
        valid_languages: 'en',
        country: 'global',
        new_user_is_activated: false
    }
}

export const EmailSettingsForm = ({ initialValues, handleSubmitSettings }) => {
    return (
        <div className="mb-4">
            <EmailForm
                initialValues={initialValues}
                onSubmit={(formProps) => handleSubmitSettings(formProps, 'email')}
                buttonText="Save"
                fields={generateAdminSettings('email')}
            />
        </div>
    );
};

EmailSettingsForm.defaultProps = {
    initialValues: {
        timezone: 'utc',
        port: 587
    }
}

export const SecuritySettingsForm = ({ initialValues, handleSubmitSettings }) => {
    return (
        <div className="mb-4">
            <SecurityForm
                initialValues={initialValues}
                onSubmit={(formProps) => handleSubmitSettings(formProps, 'security')}
                buttonText="Save"
                fields={generateAdminSettings('security')}
            />
        </div>
    );
};

