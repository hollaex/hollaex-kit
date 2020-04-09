import React from 'react';
import { Divider } from 'antd';

import { AdminHocForm } from '../../../components';
import { generateAdminSettings } from './Utils';

const Form = AdminHocForm('ADMIN_SETTINGS_FORM', 'transaction-form');
const EmailDistributionForm = AdminHocForm('ADMIN_EMAIL_DISTRIBUTION_FORM', 'transaction-form');
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
    const fields = generateAdminSettings('email');
    return (
        <div className="mb-4">
            <div className="mb-4">
                <h2>Email Distribution List</h2>
                <Divider />
                <p>Admin email here is used for sending a copy of certain emails sent to users as notifications and support email is used for notifications related to specific actions that needs to be done for users. This is used to notify back-end office about certain user actions and operations.</p>
                <EmailDistributionForm
                    initialValues={initialValues}
                    onSubmit={(formProps) => handleSubmitSettings(formProps, 'email')}
                    buttonText="Save"
                    fields={fields.email_distribution_list}
                />
            </div>
            <h2>Email Configuration</h2>
            <Divider />
            <EmailForm
                initialValues={initialValues}
                onSubmit={(formProps) => handleSubmitSettings(formProps, 'email')}
                buttonText="Save"
                fields={fields.email_configuration}
            />
        </div>
    );
};

EmailSettingsForm.defaultProps = {
    initialValues: {
        timezone: 'utc',
        port: 587,
        send_email_to_support: false
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

