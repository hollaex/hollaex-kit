import React from 'react';
import { Input, Form, Checkbox, Button, InputNumber } from 'antd';

const { Item } = Form;

const EmailConfiguration = ({ handleNext, updateConstants, setPreview, initialValues = {} }) => {
    const handleSubmit = (values) => {
        const { site_key, secret_key, server, port, user, password, ...rest } = values;
        const formProps = { kit: {}, secrets: { smtp: {} } };
        if (site_key) {
            formProps.kit.captcha = { site_key };
        }
        if (secret_key) formProps.secrets.captcha = { secret_key };
        if (server) formProps.secrets.smtp.server = server;
        if (port) formProps.secrets.smtp.port = port;
        if (user) formProps.secrets.smtp.user = user;
        if (password) formProps.secrets.smtp.password = password;
        formProps.secrets.emails = { ...rest };
        updateConstants(formProps, setPreview);
    };
    return (
        <div className="asset-content">
            <div className="title-text">Email configuration</div>
            <Form 
                name="email-config-form" 
                onFinish={handleSubmit}
                initialValues={initialValues}
            >
                <div className="setup-field-wrapper setup-field-content">
                    <div className="coin-wrapper">
                        <div className="setup-field-label">
                            Sender email{' '}
                            <span className="setup-field-label-desc">(appears in emails sent to the users as sender)</span>
                        </div>
                        <Item name="sender">
                            <Input />
                        </Item>
                        <Item name="send_email_to_support" valuePropName="checked">
                            <Checkbox>
                                <span className="setup-field-label">Send email to support</span>
                            </Checkbox>
                        </Item>
                        <div className="setup-field-label">Email timezone</div>
                        <Item name="timezone">
                            <Input />
                        </Item>
                        <div className="setup-field-label">SMTP server</div>
                        <Item name="server">
                            <Input />
                        </Item>
                        <div className="setup-field-label">SMTP port</div>
                        <Item name="port">
                            <InputNumber />
                        </Item>
                        <div className="setup-field-label">SMTP username</div>
                        <Item name="user">
                            <Input />
                        </Item>
                        <div className="setup-field-label">SMTP password</div>
                        <Item name="password">
                            <Input />
                        </Item>
                    </div>
                    <div className="coin-wrapper">
                        <div className="title-text">Email audit</div>
                        <div className="setup-field-label-desc"> This feature allows specific email to receive a copy of all important emails sent to the user for audit process. By filling the auditor email, the email will be in BCC of emails sent to the user.</div>
                        <div className="setup-field-label">Auditor email</div>
                        <Item name="audit">
                            <Input />
                        </Item>
                    </div>
                    <div className="coin-wrapper last">
                        <div className="title-text">reCAPTCHA</div>
                        <div className="setup-field-label">Site key (Google reCAPTCHA V3)</div>
                        <Item name="site_key">
                            <Input />
                        </Item>
                        <div className="setup-field-label">Secret key (Google reCAPTCHA V3)</div>
                        <Item name="secret_key">
                            <Input />
                        </Item>
                    </div>
                    <div className="btn-container">
                        <Button htmlType='submit'>Proceed</Button>
                    </div>
                    <div className="asset-btn-wrapper">
                        <span
                            className="step-link"
                            onClick={setPreview}
                        >
                            Skip this step
                        </span>
                    </div>
                </div>
            </Form>
        </div>
    );
}

export default EmailConfiguration;
