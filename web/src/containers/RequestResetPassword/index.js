import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { SubmissionError } from 'redux-form';
import { isMobile } from 'react-device-detect';
import { requestResetPassword } from '../../actions/authAction';
import ResetPasswordForm, { generateFormFields } from './ResetPasswordForm';
import { IconTitle, Dialog, MobileBarBack } from '../../components';
import { ContactForm } from '../';
import { FLEX_CENTER_CLASSES, ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';
import RequestResetPasswordSuccess from './RequestResetPasswordSuccess';

class RequestResetPassword extends Component {
	state = {
		success: false,
		showContactForm: false,
		formFields: generateFormFields()
	};

	onSubmitRequestResetPassword = (values) => {
		return requestResetPassword(values)
			.then((res) => {
				this.setState({ success: true });
			})
			.catch((error) => {
				if (error.response && error.response.status === 404) {
					this.setState({ success: true });
				} else {
					const errors = {};
					if (error.response) {
						const { message = '' } = error.response.data;
						errors._error = message || error.message;
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

	onClickLogin = () => {
		this.props.router.replace('login');
	};
	
	onGoBack = () => {
		this.props.router.push(`/login`);
	};

	accountRecovery = () => {
		this.setState({ success: false });
	}

	render() {
		const { languageClasses, activeTheme } = this.props;
		const { success, showContactForm, formFields } = this.state;

		return (
			<div className={classnames(...FLEX_CENTER_CLASSES, 'flex-column', 'f-1')}>
				{isMobile && !showContactForm && <MobileBarBack  onBackClick={success ? this.accountRecovery : this.onGoBack}>
				</MobileBarBack>}
				{success ? (
					<RequestResetPasswordSuccess
						onLoginClick={this.onClickLogin}
						onContactUs={this.onOpenDialog}
					/>
				) : (
					<div
						className={classnames(
							...FLEX_CENTER_CLASSES,
							'flex-column',
							'auth_wrapper',
							'w-100'
						)}
					>
						<IconTitle
							iconPath={ICONS.ACCOUNT_RECOVERY}
							text={STRINGS.REQUEST_RESET_PASSWORD.TITLE}
							textType="title"
							underline={true}
							useSvg={true}
							className="w-100"
							subtitle={STRINGS.REQUEST_RESET_PASSWORD.SUBTITLE}
							actionProps={{
								text: STRINGS.REQUEST_RESET_PASSWORD.SUPPORT,
								iconPath: ICONS.BLUE_QUESTION,
								onClick: this.onOpenDialog,
								useSvg: true
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
							<ResetPasswordForm
								onSubmit={this.onSubmitRequestResetPassword}
								formFields={formFields}
							/>
						</div>
					</div>
				)}
				<Dialog
					isOpen={showContactForm}
					label="contact-modal"
					onCloseDialog={this.onCloseDialog}
					shouldCloseOnOverlayClick={false}
					style={{ 'z-index': 100 }}
					className={classnames(languageClasses)}
					showCloseText={false}
					theme={activeTheme}
				>
					<ContactForm
						onSubmitSuccess={this.onCloseDialog}
						onClose={this.onCloseDialog}
					/>
				</Dialog>
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	activeTheme: store.app.theme
});

export default connect(mapStateToProps)(RequestResetPassword);
