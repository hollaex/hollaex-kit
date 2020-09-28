import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { SubmissionError } from 'redux-form';
import { resetPassword } from '../../actions/authAction';
import ResetPasswordForm from './ResetPasswordForm';
import ResetPasswordSuccess from './ResetPasswordSuccess';
import { IconTitle, Dialog } from '../../components';
import { ContactForm } from '../';
import { FLEX_CENTER_CLASSES, ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

class ResetPassword extends Component {
	state = {
		success: false,
		showContactForm: false
	};

	onSubmitResetPassword = ({ password }) => {
		const { code } = this.props.params;
		const values = {
			code,
			new_password: password
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
				throw new SubmissionError(errors);
			});
	};

	onOpenDialog = () => {
		const { links = {} } = this.props.constants;
		if (window && links && links.helpdesk) {
			window.open(links.helpdesk, '_blank');
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
						text={STRINGS["RESET_PASSWORD.TITLE"]}
						textType="title"
						underline={true}
						className="w-100"
						subtitle={STRINGS["RESET_PASSWORD.SUBTITLE"]}
						useSvg={true}
						actionProps={{
							text: STRINGS["HELP_TEXT"],
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
						<ResetPasswordForm onSubmit={this.onSubmitResetPassword} />
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
	activeTheme: store.app.theme,
	constants: store.app.constants
});

export default connect(mapStateToProps)(ResetPassword);
