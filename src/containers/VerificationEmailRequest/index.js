import React, { Component } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';
import { SubmissionError } from 'redux-form';
import { requestVerificationEmail } from '../../actions/authAction';
import EmailRequestForm from './EmailRequestForm';
import EmailRequestSuccess from './EmailRequestSuccess';
import { IconTitle, Dialog } from '../../components';
import { ContactForm } from '../';
import { EXIR_LOGO, FLEX_CENTER_CLASSES, ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

class VerifyEmailRequest extends Component {
	state = {
		success: false,
		showContactForm: false
	};

	onSubmitEmailRequest = (values) => {
		return requestVerificationEmail(values)
			.then((res) => {
				this.setState({ success: true });
			})
			.catch((error) => {
				if (error.response && error.response.status === 404) {
					this.setState({ success: true });
				} else {
					const errors = {};
					if (error.response) {
						errors._error = error.response.data.message;
					} else {
						errors._error = error.message;
					}
					throw new SubmissionError(errors);
				}
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
			return (
				<div>
					<EmailRequestSuccess onClick={this.onOpenDialog} />
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

		return (
			<div
				className={classnames(
					...FLEX_CENTER_CLASSES,
					'flex-column',
					'f-1',
					'login_container'
				)}
			>
				<div
					className={classnames(
						...FLEX_CENTER_CLASSES,
						'flex-column',
						'login_wrapper',
						'auth_wrapper',
						'w-100'
					)}
				>
					<IconTitle
						iconPath={EXIR_LOGO}
						text={STRINGS.VERIFICATION_EMAIL_REQUEST.TITLE}
						textType="title"
						underline={true}
						className="w-100"
					/>
					<div
						className={classnames(
							...FLEX_CENTER_CLASSES,
							'flex-column',
							'login_form-wrapper',
							'auth_form-wrapper',
							'w-100'
						)}
					>
						<EmailRequestForm onSubmit={this.onSubmitEmailRequest} />
					</div>
				</div>
				<div className={classnames('f-1', 'link_wrapper')}>
					{STRINGS.VERIFICATION_EMAIL_REQUEST.NO_EMAIL}
					<Link to="/verify" className={classnames('blue-link')}>
						{STRINGS.VERIFICATION_EMAIL_REQUEST.REQUEST_EMAIL}
					</Link>
				</div>
			</div>
		);
	}
}

export default VerifyEmailRequest;
