import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { SubmissionError } from 'redux-form';
import { resetPassword } from '../../actions/authAction';
import ResetPasswordForm from './ResetPasswordForm';
import ResetPasswordSuccess from './ResetPasswordSuccess';
import { IconTitle, Dialog } from '../../components';
import { ContactForm } from '../';
import { FLEX_CENTER_CLASSES } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { openContactForm } from 'actions/appActions';

class ResetPassword extends Component {
	state = {
		success: false,
		showContactForm: false,
	};

	onSubmitResetPassword = ({ password }) => {
		const { code } = this.props.params;
		const values = {
			code,
			new_password: password,
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

	onCloseDialog = () => {
		this.setState({ showContactForm: false });
	};

	onClickLogin = () => {
		this.props.router.replace('/login');
	};

	render() {
		const {
			languageClasses,
			activeTheme,
			icons: ICONS,
			openContactForm,
		} = this.props;
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
						iconId="SET_NEW_PASSWORD"
						iconPath={ICONS['SET_NEW_PASSWORD']}
						stringId="RESET_PASSWORD.TITLE"
						text={STRINGS['RESET_PASSWORD.TITLE']}
						textType="title"
						underline={true}
						className="w-100"
						subtitle={STRINGS['RESET_PASSWORD.SUBTITLE']}
						actionProps={{
							stringId: 'HELP_TEXT',
							text: STRINGS['HELP_TEXT'],
							iconId: 'BLUE_QUESTION',
							iconPath: ICONS['BLUE_QUESTION'],
							onClick: openContactForm,
							useSvg: true,
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
	constants: store.app.constants,
});

const mapDispatchToProps = (dispatch) => ({
	openContactForm: bindActionCreators(openContactForm, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(ResetPassword));
