import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { SubmissionError, change } from 'redux-form';
import { resetPassword } from '../../actions/authAction';
import ResetPasswordForm from './ResetPasswordForm';
import ResetPasswordSuccess from './ResetPasswordSuccess';
import { IconTitle, Dialog } from '../../components';
import { ContactForm } from '../';
import { FLEX_CENTER_CLASSES, ICONS, SUPPORT_HELP_URL } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

let errorTimeOut = null;

class ResetPassword extends Component {
	state = {
		success: false,
		showContactForm: false
	};

	componentWillUnmount() {
		if (errorTimeOut) {
			clearTimeout(errorTimeOut);
		}
	}

	onSubmitResetPassword = ({ password, captcha }) => {
		const { code } = this.props.params;
		const values = {
			code,
			new_password: password,
			captcha
		};
		return resetPassword(values)
			.then((res) => {
				this.setState({ success: true });
			})
			.catch((error) => {
				const errors = {};
				if (error.response) {
					const { message = '' } = error.response.data;
					if (message.toLowerCase().indexOf('password') > -1) {
						// TODO set error in constants for language
						errors.password = message;
					} else {
						errors._error = message || error.message;
					}
				} else {
					errors._error = error.message;
				}
				errorTimeOut = setTimeout(() => {
					this.props.change('RequestPasswordForm', 'captcha', '');
				}, 5000);
				throw new SubmissionError(errors);
			});
	};

	onOpenDialog = () => {
		if (window) {
			window.open(SUPPORT_HELP_URL, '_blank');
		}
		// this.setState({ showContactForm: true });
	};

	onCloseDialog = () => {
		this.setState({ showContactForm: false });
	};

	onClickLogin = () => {
		this.props.router.replace('/login');
	};

	render() {
		const { languageClasses, activeTheme } = this.props;
		const { success, showContactForm } = this.state;

		if (success) {
			return <ResetPasswordSuccess onClick={this.onClickLogin} />;
		}

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
						iconPath={ICONS.SET_NEW_PASSWORD}
						text={STRINGS.RESET_PASSWORD.TITLE}
						textType="title"
						underline={true}
						className="w-100"
						subtitle={STRINGS.RESET_PASSWORD.SUBTITLE}
						useSvg={true}
						actionProps={{
							text: STRINGS.HELP_TEXT,
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
						<ResetPasswordForm theme={activeTheme} onSubmit={this.onSubmitResetPassword} />
					</div>
				</div>
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

const mapDispatchToProps = (dispatch) => ({
	change: bindActionCreators(change, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
