import React from 'react';
import { Input, Form, Button, InputNumber } from 'antd';

const { Item } = Form;

const EmailConfiguration = ({
	handleNext,
	updateConstants,
	setPreview,
	initialValues = {},
}) => {
	const handleSubmit = (values) => {
		const {
			site_key,
			secret_key,
			server,
			port,
			user,
			password,
			...rest
		} = values;
		const formProps = {};
		if (site_key) {
			formProps.kit = {};
			formProps.kit.captcha = { site_key };
		}
		if (site_key || secret_key || server || port || user || password) {
			formProps.secrets = { smtp: {} };
			if (secret_key) formProps.secrets.captcha = { secret_key };
			if (server) formProps.secrets.smtp.server = server;
			if (port) formProps.secrets.smtp.port = parseInt(port, 10);
			if (user) formProps.secrets.smtp.user = user;
			if (password && !password.includes('*')) {
				formProps.secrets.smtp.password = password;
			}
		}
		if (Object.keys(rest).filter((key) => rest[key]).length) {
			if (!formProps.secrets) formProps.secrets = { emails: {} };
			if (!formProps.secrets.emails) formProps.secrets.emails = {};
			if (rest.sender) formProps.secrets.emails.sender = rest.sender;
			// if (rest.timezone) formProps.secrets.emails.timezone = rest.timezone;
			if (rest.audit) formProps.secrets.emails.audit = rest.audit;
			// if (rest.send_email_to_support)
			// 	formProps.secrets.emails.send_email_to_support =
			// 		rest.send_email_to_support;
		}
		if (Object.keys(formProps).length) {
			updateConstants(formProps, () => setPreview(true));
		}
	};
	return (
		<div className="asset-content show-scroll">
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
							<span className="setup-field-label-desc">
								(appears in emails sent to the users as sender)
							</span>
						</div>
						<Item name="sender">
							<Input />
						</Item>
						{/* <Item name="send_email_to_support" valuePropName="checked">
							<Checkbox>
								<span className="setup-field-label">Send email to support</span>
							</Checkbox>
						</Item> */}
						{/* <div className="setup-field-label">Email timezone</div>
						<Item name="timezone">
							<Input />
						</Item> */}
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
							<Input type="password" />
						</Item>
					</div>
					<div className="coin-wrapper">
						<div className="title-text">Email audit</div>
						<div className="setup-field-label-desc">
							{' '}
							This feature allows specific email to receive a copy of all
							important emails sent to the user for audit process. By filling
							the auditor email, the email will be in BCC of emails sent to the
							user.
						</div>
						<div className="setup-field-label">Auditor email</div>
						<Item name="audit">
							<Input />
						</Item>
					</div>
					{/* <div className="coin-wrapper last">
						<div className="title-text">reCAPTCHA</div>
						<div className="setup-field-label">
							Site key (Google reCAPTCHA V3)
						</div>
						<Item name="site_key">
							<Input />
						</Item>
						<div className="setup-field-label">
							Secret key (Google reCAPTCHA V3)
						</div>
						<Item name="secret_key">
							<Input />
						</Item>
					</div> */}
					<div className="btn-container">
						<Button htmlType="submit">Proceed</Button>
					</div>
					<div className="asset-btn-wrapper">
						<span className="step-link" onClick={() => setPreview(true)}>
							Skip this step
						</span>
					</div>
				</div>
			</Form>
		</div>
	);
};

export default EmailConfiguration;
