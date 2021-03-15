import React, { Component } from 'react';
import { SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { HocForm, IconTitle, Notification } from '../../components';
import { email as isEmail, required } from '../../components/Form/validations';
import STRINGS from '../../config/localizedStrings';
import { sendSupportMail, NOTIFICATIONS } from '../../actions/appActions';
import withConfig from 'components/ConfigProvider/withConfig';

const FORM_NAME = 'RequestForm';

const Form = HocForm(FORM_NAME, { enableReinitialize: true });

class RequestForm extends Component {
	state = {
		submitted: false,
	};

	onSubmit = (values) => {
		const formProps = {
			...values,
			subject: 'XHT referral request',
			description: 'XHT referral request',
		};
		return sendSupportMail(formProps)
			.then((data) => {
				this.setState({ submitted: true });

				// if (this.props.onSubmitSuccess) {
				//   this.props.onSubmitSuccess(data);
				// }
			})
			.catch((err) => {
				const _error = err.response.data
					? err.response.data.message
					: err.message;
				throw new SubmissionError({ _error });
			});
	};

	generateFormFields = (email) => ({
		email: {
			type: 'email',
			label: STRINGS['FORM_FIELDS.EMAIL_LABEL'],
			placeholder: STRINGS['FORM_FIELDS.EMAIL_PLACEHOLDER'],
			validate: [required, isEmail],
			fullWidth: true,
			disabled: !!email,
		},
		category: {
			type: 'select',
			label: STRINGS['CONTACT_FORM.CATEGORY_LABEL'],
			placeholder: STRINGS['REQUEST_XHT_ACCESS.CATEGORY_PLACEHOLDER'],
			options: [
				{
					value: 'verify',
					label: STRINGS['CONTACT_FORM.CATEGORY_OPTIONS.OPTION_VERIFY'],
				},
				{
					value: 'level',
					label: STRINGS['CONTACT_FORM.CATEGORY_OPTIONS.OPTION_LEVEL'],
				},
				{
					value: 'deposit',
					label: STRINGS['CONTACT_FORM.CATEGORY_OPTIONS.OPTION_DEPOSIT'],
				},
				{
					value: 'bug',
					label: STRINGS['CONTACT_FORM.CATEGORY_OPTIONS.OPTION_BUG'],
				},
				{
					value: 'personal',
					label: STRINGS['CONTACT_FORM.CATEGORY_OPTIONS.OPTION_PERSONAL_INFO'],
				},
				{
					value: 'bank_transfer',
					label: STRINGS['CONTACT_FORM.CATEGORY_OPTIONS.OPTION_BANK_TRANSFER'],
				},
				{
					value: 'request_Xht_Invite',
					label: STRINGS['CONTACT_FORM.CATEGORY_OPTIONS.OPTION_REQUEST'],
				},
			],
			validate: [required],
			fullWidth: true,
		},
		Description: {
			type: 'textarea',
			label: STRINGS['REQUEST_XHT_ACCESS.INTRODUCTION_LABEL'],
			placeholder: STRINGS['REQUEST_XHT_ACCESS.INTRODUCTION_PLACEHOLDER'],
			validate: [required],
			fullWidth: true,
			rows: '2',
		},
	});

	render() {
		const { onClose, email, initialValues, icons: ICONS } = this.props;
		const { submitted } = this.state;
		if (submitted) {
			return (
				<Notification
					type={NOTIFICATIONS.XHT_SUCCESS_ACCESS}
					onClose={onClose}
				/>
			);
		}

		const formFields = this.generateFormFields(email);
		return (
			<div className="contact_form-wrapper">
				<IconTitle
					iconId="XHT_COIN_STACK"
					iconPath={ICONS['XHT_COIN_STACK']}
					stringId="REQUEST_XHT_ACCESS.REQUEST_TITLE"
					text={STRINGS['REQUEST_XHT_ACCESS.REQUEST_TITLE']}
					textType="title"
					underline={true}
					className="w-100"
				/>
				<Form
					onSubmit={this.onSubmit}
					formFields={formFields}
					initialValues={initialValues}
					buttonLabel={STRINGS['SUBMIT']}
					extraButtonLabel={STRINGS['BACK_TEXT']}
					extraButtonOnClick={onClose}
				/>
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	email: store.user.email,
	// contactFormData: store.app.contactFormData
});

export default connect(mapStateToProps)(withConfig(RequestForm));
