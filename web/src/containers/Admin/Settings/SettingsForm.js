import React from 'react';

import { AdminHocForm } from '../../../components';
import { generateAdminSettings } from './Utils';

const Form = AdminHocForm('ADMIN_SETTINGS_FORM', 'transaction-form');
const EmailForm = AdminHocForm('ADMIN_EMAIL_SETTINGS_FORM', 'transaction-form');
const SecurityForm = AdminHocForm('ADMIN_SECURITY_SETTINGS_FORM', 'transaction-form');

export const GeneralSettingsForm = ({ handleSubmitSettings }) => {
    return (
        <div className="mb-4">
            <Form
                onSubmit={handleSubmitSettings}
                buttonText="Submit"
                fields={generateAdminSettings('general')}
            />
        </div>
    );
};

export const EmailSettingsForm = ({ handleSubmitSettings }) => {
    return (
        <div className="mb-4">
            <EmailForm
                onSubmit={handleSubmitSettings}
                buttonText="Submit"
                fields={generateAdminSettings('email')}
            />
        </div>
    );
};

export const SecuritySettingsForm = ({ handleSubmitSettings }) => {
    return (
        <div className="mb-4">
            <SecurityForm
                onSubmit={handleSubmitSettings}
                buttonText="Submit"
                fields={generateAdminSettings('security')}
            />
        </div>
    );
};

