import React, { useEffect, useState } from 'react';
import { Divider, Button, Tabs, Row, Spin, Modal, Input } from 'antd';
import { reduxForm, reset } from 'redux-form';
import { LoadingOutlined } from '@ant-design/icons';
import _get from 'lodash/get';
import _isEqual from 'lodash.isequal';

import { AdminHocForm } from '../../../components';
import {
	generateAdminSettings,
	initialCommonColors,
	initialLightColors,
	initialDarkColors,
} from './Utils';
import renderFields from '../../../components/AdminForm/utils';
import ThemeHocForm from './ThemeSettingsForm';
import CustomizeEmailForm from './CustomizeEmailForm';
import languages from 'config/languages';
import { STATIC_ICONS } from 'config/icons';
import { updateTestEmail } from './action';
const { isEmail } = require('validator');

const TabPane = Tabs.TabPane;

const Form = AdminHocForm('ADMIN_SETTINGS_FORM', 'transaction-form');
const EmailDistributionForm = AdminHocForm(
	'ADMIN_EMAIL_DISTRIBUTION_FORM',
	'transaction-form'
);
const EmailForm = AdminHocForm('ADMIN_EMAIL_SETTINGS_FORM', 'transaction-form');
const SecurityForm = AdminHocForm(
	'ADMIN_SECURITY_SETTINGS_FORM',
	'transaction-form'
);
const ThemeLightForm = ThemeHocForm('THEME_LIGHT_FORM');
const ThemeDarkForm = ThemeHocForm('THEME_DARK_FORM');
const ThemeCommonForm = ThemeHocForm('THEME_COMMON_FORM');

export const GeneralSettingsForm = ({
	initialValues,
	handleSubmitSettings,
}) => {
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
		new_user_is_activated: false,
	},
};

export const EmailSettingsForm = ({
	initialValues,
	handleSubmitSettings,
	buttonSubmitting,
	emailData,
	requestEmail,
	defaults,
	emailTypeData,
	constants,
	defaultEmailData,
}) => {
	const fields = generateAdminSettings('email');
	const [isOpen, setIsOpen] = useState(false);
	const [type, setType] = useState('edit-email');
	const [isErrorMsg, setErrorMsg] = useState(false);
	const [senderEmail, setSenderEmail] = useState('');
	const [formValues, setFormValues] = useState({});
	const [isValidEmail, setIsValidEmail] = useState(true);
	const [smtpError, setSmtpError] = useState('');
	const [isDisable, setIsDisable] = useState(false);

	useEffect(() => {
		if (
			JSON.stringify(formValues) === JSON.stringify(initialValues.configuration)
		) {
			setErrorMsg(false);
		}

		let formVal = { ...formValues, port: Number(formValues.port) };
		if (!_isEqual(formVal, initialValues.configuration)) {
			setIsDisable(true);
		} else {
			setIsDisable(false);
		}
	}, [formValues, initialValues.configuration]);

	const handleTestEmail = (emailType) => {
		if (
			JSON.stringify(formValues) !== JSON.stringify(initialValues.configuration)
		) {
			if (_get(formValues, 'password').includes('*')) {
				setErrorMsg(true);
			} else {
				setErrorMsg(false);
				setIsOpen(true);
				setType(emailType);
			}
		} else {
			setIsOpen(true);
			setType(emailType);
		}
	};

	const handleClose = (val = '') => {
		setIsOpen(false);
		setSenderEmail('');
		setIsValidEmail(true);
	};

	const handleSenderEmail = (e) => {
		setSenderEmail(e.target.value);
		if (isEmail(e.target.value)) {
			setIsValidEmail(true);
		} else {
			setIsValidEmail(false);
		}
	};

	const updateEmail = (params) => {
		let body = {};
		if (params === initialValues.configuration) {
			body = {
				receiver: senderEmail,
			};
		} else {
			body = {
				receiver: senderEmail,
				smtp: {
					password: params.password,
					port: parseInt(params.port),
					server: params.server,
					user: params.user,
				},
			};
		}
		updateTestEmail(body)
			.then((res) => {
				if (res) {
					setTimeout(() => {
						handleConfirm();
					}, 3000);
				}
			})
			.catch((err) => {
				let errMsg =
					err.data && err.data.message ? err.data.message : err.message;
				setSmtpError(errMsg);
				setType('smtp-error');
			});
	};

	const handleConfirm = async (value = '', formProps) => {
		setType(value);
		if (formProps) {
			await updateEmail(formProps);
		}
	};

	const renderContent = () => {
		if (type === 'edit-email') {
			return (
				<div>
					<div className="content-heading">Send Test Email</div>
					<div className="sub-heading">Send a test to</div>
					<Input onChange={handleSenderEmail} className="mb-2" />
					{!isValidEmail && senderEmail.length ? (
						<span className="errTxt">Please Enter the valid email</span>
					) : null}
					<div className="input-note">
						(Note: default email used is the admin email.)
					</div>
					<div className="btn-wrapper">
						<Button type="primary" className="green-btn" onClick={handleClose}>
							Back
						</Button>
						<div className="separator"></div>
						<Button
							type="primary"
							className="green-btn"
							onClick={() => handleConfirm('edit-confirm', formValues)}
							disabled={!senderEmail || !isValidEmail}
						>
							Confirm
						</Button>
					</div>
				</div>
			);
		} else if (type === 'edit-confirm') {
			return (
				<div>
					<div className="content-align">
						<div className="loading-icon">
							<LoadingOutlined style={{ fontSize: '50px' }} />
						</div>
						<div>
							<div className="content-heading"> Sending test email</div>
							<div>please wait...</div>
						</div>
					</div>
					<div className="btn-wrapper">
						<Button type="primary" className="green-btn" onClick={handleClose}>
							Cancel
						</Button>
					</div>
				</div>
			);
		} else {
			return (
				<div>
					{type === 'smtp-error' ? (
						<div>{smtpError}</div>
					) : (
						<div>
							<div className="content-heading">Complete</div>
							<div>Your test email is on the way!</div>
						</div>
					)}
					<div className="btn-wrapper btn-width">
						<Button
							type="primary"
							className="green-btn "
							onClick={() => handleClose('test-email')}
						>
							{type === 'smtp-error' ? 'Close' : 'Okay'}
						</Button>
					</div>
				</div>
			);
		}
	};

	const { kit = {} } = constants;
	let valid_languages =
		kit && kit.valid_languages && kit.valid_languages.split(',');
	let selectedLanguages = [];
	if (valid_languages) {
		selectedLanguages = languages.filter((data) =>
			valid_languages.includes(data.value)
		);
	} else {
		selectedLanguages = languages;
	}

	const renderFooter = (values) => {
		if (values) {
			setFormValues(values);
		}
		return (
			<div>
				{isErrorMsg && _get(formValues, 'password').includes('*') ? (
					<span className="errTxt">Provide the password again</span>
				) : null}
				<div className="mb-5">
					<div>
						<span
							className="underline-text content-flex"
							onClick={() => handleTestEmail('edit-email')}
						>
							<div>SEND ADMIN TEST EMAIL</div>
							<div className="arrow-symbol">
								<img src={STATIC_ICONS.SEND_ARROW_ICON} alt="send_arrow" />
							</div>
						</span>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="email-config-form mb-5">
			<h2>Email Configuration</h2>
			<EmailForm
				initialValues={initialValues.configuration}
				onSubmit={(formProps) =>
					handleSubmitSettings(formProps, 'email_configuration')
				}
				buttonText="Save"
				fields={fields.email_configuration}
				buttonSubmitting={!isDisable || buttonSubmitting}
				renderCustomFooter={renderFooter}
			/>
			<div className="divider"></div>
			<div className="mb-4 width-50">
				<h2>Customize emails</h2>
				<p>Select the type of email you'd like to edit below.</p>
				{Object.keys(emailData).length ? (
					<CustomizeEmailForm
						emailInfo={emailData}
						requestEmail={requestEmail}
						selectedLanguages={selectedLanguages}
						defaultLanguage={defaults && defaults.language}
						emailType={emailTypeData}
						defaultEmailData={defaultEmailData}
					/>
				) : (
					<Spin />
				)}
			</div>
			<div className="divider"></div>
			<div className="mb-4">
				<h2>Email Audit</h2>
				<p>
					This feature allows specific email to receive a copy of all important
					emails sent to the user for audit purposes. By filling the auditor
					email, the email will be in BCC of emails sent to the user.
				</p>
				<EmailDistributionForm
					initialValues={initialValues.distribution}
					onSubmit={(formProps) =>
						handleSubmitSettings(formProps, 'email_distribution')
					}
					buttonText="Save"
					fields={fields.email_distribution_list}
					buttonSubmitting={buttonSubmitting}
				/>
			</div>
			<Modal
				visible={isOpen}
				footer={null}
				onCancel={handleClose}
				width={type === 'edit-email' ? '500px' : '400px'}
				closable={false}
			>
				<div className="test-Email-Wrapper">{renderContent()}</div>
			</Modal>
		</div>
	);
};

EmailSettingsForm.defaultProps = {
	initialValues: {
		distribution: {},
		configuration: {
			timezone: 'utc',
			port: 587,
			send_email_to_support: false,
		},
	},
};

export const SecuritySettingsForm = ({
	initialValues,
	handleSubmitSettings,
}) => {
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
			<h5>
				Fill out all the links to your exchange. These links will be added
				automatically into the exchange website once updated. If you leave them
				blank they won't appear.
			</h5>
			<Divider />
			<form>
				{fields &&
					Object.keys(fields).map((key, index) => {
						let field = fields[key] ? fields[key].fields : {};
						return (
							<div key={index} className="d-flex">
								{renderFields(field)}
							</div>
						);
					})}
				{error && (
					<div>
						<strong>{error}</strong>
					</div>
				)}
				<Button
					type={'primary'}
					onClick={handleSubmit(onSubmit)}
					disabled={(fields && pristine) || submitting || !valid || error}
					size="large"
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
	onSubmitSuccess: (result, dispatch) =>
		dispatch(reset('ADMIN_LINKS_SETTINGS_FORM')),
	enableReinitialize: true,
})(LinksForm);

export const ThemeSettings = ({ initialValues, handleSubmitSettings }) => {
	const [activeTab, tabChange] = useState('light');
	const lightValues = initialValues['light'] || {};
	const darkValues = initialValues['dark'] || {};
	const commonValues = initialValues['miscellaneous'] || {};
	return (
		<Tabs defaultActiveKey={activeTab} onChange={tabChange}>
			<TabPane tab={'Light Theme'} key={'light'}>
				<Row>
					{activeTab === 'light' ? (
						<ThemeLightForm
							themeKey="light"
							initialValues={{
								...initialLightColors,
								...lightValues,
							}}
							handleSubmitSettings={handleSubmitSettings}
						/>
					) : null}
				</Row>
			</TabPane>
			<TabPane tab={'Dark Theme'} key={'dark'}>
				<Row>
					{activeTab === 'dark' ? (
						<ThemeDarkForm
							themeKey="dark"
							initialValues={{
								...initialDarkColors,
								...darkValues,
							}}
							handleSubmitSettings={handleSubmitSettings}
						/>
					) : null}
				</Row>
			</TabPane>
			<TabPane tab={'Common'} key={'miscellaneous'}>
				<Row>
					{activeTab === 'miscellaneous' ? (
						<ThemeCommonForm
							themeKey="miscellaneous"
							initialValues={{
								...initialCommonColors,
								...commonValues,
							}}
							handleSubmitSettings={handleSubmitSettings}
						/>
					) : null}
				</Row>
			</TabPane>
		</Tabs>
	);
};
