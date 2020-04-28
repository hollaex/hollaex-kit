import React from 'react';
import { Divider, Button } from 'antd';
import { reduxForm } from 'redux-form';

import { AdminHocForm } from '../../../components';
import { generateAdminSettings } from './Utils';
import renderFields from '../../../components/AdminForm/utils';

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
                <p>Emails here are used for sending a copy of all emails sent to the user. Admin email receives all emails but support email only receives specific emails such a user verification notification.</p>
                <EmailDistributionForm
                    initialValues={initialValues.distribution}
                    onSubmit={(formProps) => handleSubmitSettings(formProps, 'email_distribution')}
                    buttonText="Save"
                    fields={fields.email_distribution_list}
                />
            </div>
            <h2>Email Configuration</h2>
            <Divider />
            <EmailForm
                initialValues={initialValues.configuration}
                onSubmit={(formProps) => handleSubmitSettings(formProps, 'email_configuration')}
                buttonText="Save"
                fields={fields.email_configuration}
            />
        </div>
    );
};

EmailSettingsForm.defaultProps = {
    initialValues: {
        distribution: {},
        configuration: {
            timezone: 'utc',
            port: 587,
            send_email_to_support: false
        }
    }
};

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

const LinksForm = ({
    initialValues,
    handleSubmit,
    handleSubmitSettings,
    error,
    pristine,
    submitting,
    valid,
    ...rest
}) => {
    const fields = generateAdminSettings('links');
    const onSubmit = (formProps) => handleSubmitSettings(formProps, 'links');
    return (
        <div className="mb-4">
            <form>
				{fields && (
                    Object.keys(fields).map((key, index) => {
                        let field = fields[key] ? fields[key].fields : {};
                        return (
                            <div key={index} className="d-flex">
                                {renderFields(field)}
                            </div>
                        )
                    })
                )}
				{error && (
					<div>
						<strong>{error}</strong>
					</div>
				)}
				<Button
					type={'primary'}
					onClick={handleSubmit(onSubmit)}
					disabled={
						(fields && pristine) ||
						submitting ||
						!valid ||
						error
                    }
                    size='large'
					className={'w-100'}
				>
					Save
				</Button>
			</form>
        </div>
    );
};

export const LinksSettingsForm = reduxForm({
    form: 'ADMIN_LINKS_SETTINGS_FORM',
    // onSubmitFail: (result, dispatch) => dispatch(reset(FORM_NAME)),
    // onSubmitSuccess: (result, dispatch) => dispatch(reset(name)),
    enableReinitialize: true
})(LinksForm);