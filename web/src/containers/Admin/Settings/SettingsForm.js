import React, { useState } from 'react';
import { Divider, Button, Tabs, Row } from 'antd';
import { reduxForm, reset } from 'redux-form';

import { AdminHocForm } from '../../../components';
import {
	generateAdminSettings,
	initialCommonColors,
	initialLightColors,
	initialDarkColors,
} from './Utils';
import renderFields from '../../../components/AdminForm/utils';
import ThemeHocForm from './ThemeSettingsForm';

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

export const EmailSettingsForm = ({ initialValues, handleSubmitSettings }) => {
	const fields = generateAdminSettings('email');
	return (
		<div className="email-config-form mb-4">
			<h2>Email Configuration</h2>
			<EmailForm
				initialValues={initialValues.configuration}
				onSubmit={(formProps) =>
					handleSubmitSettings(formProps, 'email_configuration')
				}
				buttonText="Save"
				fields={fields.email_configuration}
			/>
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
				/>
			</div>
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
