import React, { Component } from 'react';
import { SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { HocForm, IconTitle, Notification } from '../../components';
import { email as isEmail, required } from '../../components/Form/validations';
import STRINGS from '../../config/localizedStrings';
import { ICONS } from '../../config/constants';
import { sendSupportMail, NOTIFICATIONS } from '../../actions/appActions';

const FORM_NAME = 'ContactForm';

const Form = HocForm(FORM_NAME, { enableReinitialize: true });

class ContactForm extends Component {
	state = {
		submited: false,
		initialValues: {}
	};

	componentDidMount() {
		if (this.props.email) {
			const initialValues = { email: this.props.email, ...this.props.contactFormData, ...this.props.initialValues };
			this.setInitialValues(initialValues);
		}
	}

	setInitialValues = (initialValues = {}) => {
		this.setState({ initialValues })
	}

	onSubmit = (values) => {
		return sendSupportMail(values)
			.then((data) => {
				this.setState({ submited: true });

				// if (this.props.onSubmitSuccess) {
				//   this.props.onSubmitSuccess(data);
				// }
			})
			.catch((err) => {
				const _error = err.response && err.response.data
					? err.response.data.message
					: err.message;
				throw new SubmissionError({ _error });
			});
	};

	generateFormFields = (email) => ({
		email: {
			type: 'email',
			label: STRINGS["FORM_FIELDS.EMAIL_LABEL"],
			placeholder: STRINGS["FORM_FIELDS.EMAIL_PLACEHOLDER"],
			validate: [required, isEmail],
			fullWidth: true,
			disabled: !!email
		},
		category: {
			type: 'select',
			label: STRINGS["CONTACT_FORM.CATEGORY_LABEL"],
			placeholder: STRINGS["CONTACT_FORM.CATEGORY_PLACEHOLDER"],
			options: [
				{
					value: 'verify',
					label: STRINGS["CONTACT_FORM.CATEGORY_OPTIONS.OPTION_VERIFY"]
				},
				{
					value: 'level',
					label: STRINGS["CONTACT_FORM.CATEGORY_OPTIONS.OPTION_LEVEL"]
				},
				{
					value: 'deposit',
					label: STRINGS["CONTACT_FORM.CATEGORY_OPTIONS.OPTION_DEPOSIT"]
				},
				{
					value: 'bug',
					label: STRINGS["CONTACT_FORM.CATEGORY_OPTIONS.OPTION_BUG"]
				},
				{
					value: 'personal',
					label: STRINGS["CONTACT_FORM.CATEGORY_OPTIONS.OPTION_PERSONAL_INFO"]
				},
				{
					value: 'bank_transfer',
					label: STRINGS["CONTACT_FORM.CATEGORY_OPTIONS.OPTION_BANK_TRANSFER"]
				}
			],
			validate: [required],
			fullWidth: true
		},
		subject: {
			type: 'text',
			label: STRINGS["CONTACT_FORM.SUBJECT_LABEL"],
			placeholder: STRINGS["CONTACT_FORM.SUBJECT_PLACEHOLDER"],
			validate: [required],
			fullWidth: true
		},
		description: {
			type: 'textarea',
			label: STRINGS["CONTACT_FORM.DESCRIPTION_LABEL"],
			placeholder: STRINGS["CONTACT_FORM.DESCRIPTION_PLACEHOLDER"],
			validate: [required],
			fullWidth: true,
			rows: '2'
		},
		attachment: {
		  type: 'file',
		  label: STRINGS["CONTACT_FORM.ATTACHMENT_LABEL"],
		  placeholder: STRINGS["CONTACT_FORM.ATTACHMENT_PLACEHOLDER"],
		  fullWidth: true,
		  multiple: true,
		  length: 3
		}
	});

	render() {
		const { onClose, email } = this.props;
		const { submited, initialValues } = this.state;

		if (submited) {
			return (
				<Notification type={NOTIFICATIONS.CONTACT_FORM} onClose={onClose} />
			);
		}

		const formFields = this.generateFormFields(email);
		return (
			<div className="contact_form-wrapper">
				<IconTitle
					iconPath={ICONS.CONTACT_US_ICON}
					text={STRINGS["CONTACT_US_TEXT"]}
					textType="title"
					underline={true}
					className="w-100"
					useSvg={true}
				/>
				<Form
					onSubmit={this.onSubmit}
					formFields={formFields}
					initialValues={initialValues}
					buttonLabel={STRINGS["SUBMIT"]}
					extraButtonLabel={STRINGS["BACK_TEXT"]}
					extraButtonOnClick={onClose}
				/>
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	email: store.user.email,
	contactFormData: store.app.contactFormData
});

export default connect(mapStateToProps)(ContactForm);
