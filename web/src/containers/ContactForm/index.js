import React, { Component } from 'react';
import { SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { HocForm, IconTitle, Notification } from '../../components';
import { email as isEmail, required } from '../../components/Form/validations';
import STRINGS from '../../config/localizedStrings';
import { sendSupportMail, NOTIFICATIONS } from '../../actions/appActions';
import withConfig from 'components/ConfigProvider/withConfig';

const FORM_NAME = 'ContactForm';

const Form = HocForm(FORM_NAME, { enableReinitialize: true });

class ContactForm extends Component {
	state = {
		submited: false,
		initialValues: {},
	};

	componentDidMount() {
		if (this.props.email) {
			const initialValues = {
				email: this.props.email,
				...this.props.contactFormData,
				...this.props.initialValues,
			};
			this.setInitialValues(initialValues);
		}
	}

	setInitialValues = (initialValues = {}) => {
		this.setState({ initialValues });
	};

	onSubmit = (values) => {
		return sendSupportMail(values)
			.then((data) => {
				this.setState({ submited: true });

				// if (this.props.onSubmitSuccess) {
				//   this.props.onSubmitSuccess(data);
				// }
			})
			.catch((err) => {
				const _error =
					err.response && err.response.data
						? err.response.data.message
						: err.message;
				throw new SubmissionError({ _error });
			});
	};

	generateFormFields = (email) => ({
		email: {
			type: 'email',
			stringId: 'FORM_FIELDS.EMAIL_LABEL,FORM_FIELDS.EMAIL_PLACEHOLDER',
			label: STRINGS['FORM_FIELDS.EMAIL_LABEL'],
			placeholder: STRINGS['FORM_FIELDS.EMAIL_PLACEHOLDER'],
			validate: [required, isEmail],
			fullWidth: true,
			disabled: !!email,
		},
		category: {
			type: 'select',
			stringId: 'CONTACT_FORM.CATEGORY_LABEL,CONTACT_FORM.CATEGORY_PLACEHOLDER',
			label: STRINGS['CONTACT_FORM.CATEGORY_LABEL'],
			placeholder: STRINGS['CONTACT_FORM.CATEGORY_PLACEHOLDER'],
			options: [
				{
					value: 'verify',
					label: STRINGS['CONTACT_FORM.CATEGORY_OPTIONS.OPTION_VERIFY'],
					stringId: 'CONTACT_FORM.CATEGORY_OPTIONS.OPTION_VERIFY',
				},
				{
					value: 'level',
					label: STRINGS['CONTACT_FORM.CATEGORY_OPTIONS.OPTION_LEVEL'],
					stringId: 'CONTACT_FORM.CATEGORY_OPTIONS.OPTION_LEVEL',
				},
				{
					value: 'deposit',
					label: STRINGS['CONTACT_FORM.CATEGORY_OPTIONS.OPTION_DEPOSIT'],
					stringId: 'CONTACT_FORM.CATEGORY_OPTIONS.OPTION_DEPOSIT',
				},
				{
					value: 'bug',
					label: STRINGS['CONTACT_FORM.CATEGORY_OPTIONS.OPTION_BUG'],
					stringId: 'CONTACT_FORM.CATEGORY_OPTIONS.OPTION_BUG',
				},
				{
					value: 'personal',
					label: STRINGS['CONTACT_FORM.CATEGORY_OPTIONS.OPTION_PERSONAL_INFO'],
					stringId: 'CONTACT_FORM.CATEGORY_OPTIONS.OPTION_PERSONAL_INFO',
				},
				{
					value: 'bank_transfer',
					label: STRINGS['CONTACT_FORM.CATEGORY_OPTIONS.OPTION_BANK_TRANSFER'],
					stringId: 'CONTACT_FORM.CATEGORY_OPTIONS.OPTION_BANK_TRANSFER',
				},
			],
			validate: [required],
			fullWidth: true,
		},
		subject: {
			type: 'text',
			stringId: 'CONTACT_FORM.SUBJECT_LABEL,CONTACT_FORM.SUBJECT_PLACEHOLDER',
			label: STRINGS['CONTACT_FORM.SUBJECT_LABEL'],
			placeholder: STRINGS['CONTACT_FORM.SUBJECT_PLACEHOLDER'],
			validate: [required],
			fullWidth: true,
		},
		description: {
			type: 'textarea',
			stringId:
				'CONTACT_FORM.DESCRIPTION_LABEL,CONTACT_FORM.DESCRIPTION_PLACEHOLDER',
			label: STRINGS['CONTACT_FORM.DESCRIPTION_LABEL'],
			placeholder: STRINGS['CONTACT_FORM.DESCRIPTION_PLACEHOLDER'],
			validate: [required],
			fullWidth: true,
			rows: '2',
		},
		attachment: {
			type: 'file',
			stringId:
				'CONTACT_FORM.ATTACHMENT_LABEL,CONTACT_FORM.ATTACHMENT_PLACEHOLDER',
			label: STRINGS['CONTACT_FORM.ATTACHMENT_LABEL'],
			placeholder: STRINGS['CONTACT_FORM.ATTACHMENT_PLACEHOLDER'],
			fullWidth: true,
			multiple: true,
			length: 3,
		},
	});

	render() {
		const { onClose, email, icons: ICONS } = this.props;
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
					iconId="CONTACT_US_ICON"
					iconPath={ICONS['CONTACT_US_ICON']}
					stringId="CONTACT_US_TEXT"
					text={STRINGS['CONTACT_US_TEXT']}
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
	contactFormData: store.app.contactFormData,
});

export default connect(mapStateToProps)(withConfig(ContactForm));
