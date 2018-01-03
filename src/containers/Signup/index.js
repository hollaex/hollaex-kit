import React, { Component } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';
import { SubmissionError } from 'redux-form';
import { performSignup } from '../../actions/authAction';
import SignupForm, { generateFormFields } from './SignupForm';
import SignupSuccess from './SignupSuccess';
import { ContactForm } from '../';
import { IconTitle, Dialog } from '../../components';
import { EXIR_LOGO, FLEX_CENTER_CLASSES, ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

class Signup extends Component {
	state = {
		success: false,
		showContactForm: false
	};

	onSubmitSignup = (formValues) => {
		const values = {
			email: formValues.email,
			password: formValues.password
		};
		return performSignup(values)
			.then((res) => {
				this.setState({ success: true });
			})
			.catch((error) => {
				const errors = {};
				if (error.response.status === 409) {
					errors.email = STRINGS.VALIDATIONS.USER_EXIST;
				} else if (error.response) {
					const { message = '' } = error.response.data;
					if (message.toLowerCase().indexOf('password') > -1) {
						// TODO set error in constants for language
						errors.password = STRINGS.VALIDATIONS.INVALID_PASSWORD;
					} else {
						errors._error = message || error.message;
					}
				} else {
					errors._error = error.message;
				}
				throw new SubmissionError(errors);
			});
	};

	onOpenDialog = () => {
		this.setState({ showContactForm: true });
	};

	onCloseDialog = () => {
		this.setState({ showContactForm: false });
	};

	render() {
		const { languageClasses } = this.props;
		const { success, showContactForm } = this.state;

		if (success) {
			return <SignupSuccess />;
		}

		const formFields = generateFormFields(STRINGS);

		return (
			<div className={classnames(...FLEX_CENTER_CLASSES, 'flex-column', 'f-1')}>
				<div
					className={classnames(
						...FLEX_CENTER_CLASSES,
						'flex-column',
						'auth_wrapper',
						'w-100'
					)}
				>
					<IconTitle
						iconPath={EXIR_LOGO}
						text={STRINGS.SIGNUP_TEXT}
						textType="title"
						underline={true}
						className="w-100"
						subtitle={STRINGS.formatString(
							STRINGS.SIGN_UP.SIGNUP_TO,
							STRINGS.APP_TITLE
						)}
						actionProps={{
							text: STRINGS.HELP_TEXT,
							iconPath: ICONS.HELP_ICON,
							onClick: this.onOpenDialog
						}}
					/>
					<div
						className={classnames(
							...FLEX_CENTER_CLASSES,
							'flex-column',
							'auth_form-wrapper',
							'w-100'
						)}
					>
						<SignupForm
							onSubmit={this.onSubmitSignup}
							formFields={formFields}
						/>
					</div>
				</div>
				<div className={classnames('f-1', 'link_wrapper', 'multi_links')}>
					<div>
						{STRINGS.SIGN_UP.HAVE_ACCOUNT}
						<Link to="/login" className={classnames('blue-link')}>
							{STRINGS.SIGN_UP.GOTO_LOGIN}
						</Link>
					</div>
					<div>
						{STRINGS.SIGN_UP.NO_EMAIL}
						<Link to="/verify" className={classnames('blue-link')}>
							{STRINGS.SIGN_UP.REQUEST_EMAIL}
						</Link>
					</div>
				</div>
				<Dialog
					isOpen={showContactForm}
					label="contact-modal"
					onCloseDialog={this.onCloseDialog}
					shouldCloseOnOverlayClick={false}
					showCloseText={true}
					style={{ 'z-index': 100 }}
					className={classnames(languageClasses)}
				>
					<ContactForm onSubmitSuccess={this.onCloseDialog} />
				</Dialog>
			</div>
		);
	}
}

export default Signup;
