import React, { Component } from 'react';
import { SubmissionError } from 'redux-form';
import { HocForm, IconTitle } from '../../components';
import { email, required } from '../../components/Form/validations';
import STRINGS from '../../config/localizedStrings';
import { ICONS } from '../../config/constants';
import { sendSupportMail } from '../../actions/appActions';

const FORM_NAME = 'ContactForm';

const Form = HocForm(FORM_NAME);

class ContactForm extends Component {
	state = {
		submiited: false
	};

	onSubmit = (values) => {
		return sendSupportMail(values)
			.then((data) => {
				this.setState({ submiited: true });

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

	generateFormFields = () => ({
		email: {
			type: 'email',
			label: STRINGS.FORM_FIELDS.EMAIL_LABEL,
			placeholder: STRINGS.FORM_FIELDS.EMAIL_PLACEHOLDER,
			validate: [required, email],
			fullWidth: true
		},
		category: {
			type: 'select',
			label: STRINGS.CONTACT_FORM.CATEGORY_LABEL,
			placeholder: STRINGS.CONTACT_FORM.CATEGORY_PLACEHOLDER,
			options: [
				{
					value: 'verify',
					label: STRINGS.CONTACT_FORM.CATEGORY_OPTIONS.OPTION_VERIFY
				},
				{
					value: 'bug',
					label: STRINGS.CONTACT_FORM.CATEGORY_OPTIONS.OPTION_BUG
				}
			],
			validate: [required],
			fullWidth: true
		},
		subject: {
			type: 'text',
			label: STRINGS.CONTACT_FORM.SUBJECT_LABEL,
			placeholder: STRINGS.CONTACT_FORM.SUBJECT_PLACEHOLDER,
			validate: [required],
			fullWidth: true
		},
		description: {
			type: 'text',
			label: STRINGS.CONTACT_FORM.DESCRIPTION_LABEL,
			placeholder: STRINGS.CONTACT_FORM.DESCRIPTION_PLACEHOLDER,
			validate: [required],
			fullWidth: true
		}
		// attachment: {
		//   type: 'file',
		//   label: STRINGS.CONTACT_FORM.ATTACHMENT_LABEL,
		//   placeholder: STRINGS.CONTACT_FORM.ATTACHMENT_PLACEHOLDER,
		//   fullWidth: true,
		// }
	});

	render() {
		const { submiited } = this.state;

		if (submiited) {
			return <div>{STRINGS.CONTACT_FORM.SUCCESS_MESSAGE}</div>;
		}

		const formFields = this.generateFormFields();

		return (
			<div className="contact_form-wrapper">
				<IconTitle
					iconPath={ICONS.LIFESAVER}
					text={STRINGS.CONTACT_US_TEXT}
					textType="title"
					underline={true}
					className="w-100"
				/>
				<Form
					onSubmit={this.onSubmit}
					formFields={formFields}
					buttonLabel={STRINGS.SUBMIT}
				/>
			</div>
		);
	}
}

export default ContactForm;
