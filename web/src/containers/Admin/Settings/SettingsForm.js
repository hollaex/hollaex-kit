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
                onSubmit={handleSubmitSettings}
                buttonText="Save"
                fields={generateAdminSettings('general')}
            />
        </div>
    );
};

GeneralSettingsForm.defaultProps = {
    initialValues: {
        new_user_default_language: 'en',
        email_timezone: 'UTC',
        default_theme: 'white',
        valid_languages: 'en',
        default_country: 'global',
        new_user_is_activated: false
    }
}

export const EmailSettingsForm = ({ initialValues, handleSubmitSettings }) => {
    return (
        <div className="mb-4">
            <EmailForm
                initialValues={initialValues}
                onSubmit={handleSubmitSettings}
                buttonText="Save"
                fields={generateAdminSettings('email')}
            />
        </div>
    );
};

EmailSettingsForm.defaultProps = {
    initialValues: {
        smtp_port: 587
    }
}

export const SecuritySettingsForm = ({ handleSubmitSettings }) => {
    return (
        <div className="mb-4">
            <SecurityForm
                onSubmit={handleSubmitSettings}
                buttonText="Save"
                fields={generateAdminSettings('security')}
            />
        </div>
    );
};

