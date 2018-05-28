import React, { Component } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { SubmissionError, change } from 'redux-form';
import { bindActionCreators } from 'redux';
import { performSignup } from '../../actions/authAction';
import SignupForm, { generateFormFields, FORM_NAME } from './SignupForm';
import SignupSuccess from './SignupSuccess';
import { ContactForm } from '../';
import { IconTitle, Dialog } from '../../components';
import {
	HOLLAEX_LOGO,
	FLEX_CENTER_CLASSES,
	ICONS
} from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

const BottomLinks = () => (
	<div className={classnames('f-1', 'link_wrapper', 'multi_links')}>
		<div>
			{STRINGS.SIGN_UP.HAVE_ACCOUNT}
			<Link to="/login" className="blue-link">
				{STRINGS.SIGN_UP.GOTO_LOGIN}
			</Link>
		</div>
		<div>
			{STRINGS.SIGN_UP.NO_EMAIL}
			<Link to="/verify" className="blue-link">
				{STRINGS.SIGN_UP.REQUEST_EMAIL}
			</Link>
		</div>
	</div>
);

class Signup extends Component {
	state = {
		success: false,
		showContactForm: false
	};

	onSubmitSignup = (values) => {
		return performSignup(values)
			.then((res) => {
				this.setState({ success: true });
			})
			.catch((error) => {
				const errors = {};
				this.props.change(FORM_NAME, 'captcha', '');
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
		const { languageClasses, activeTheme } = this.props;
		const { success, showContactForm } = this.state;

		if (success) {
			return <SignupSuccess />;
		}

		const formFields = generateFormFields(STRINGS, activeTheme);

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
						iconPath={HOLLAEX_LOGO}
						text={STRINGS.SIGNUP_TEXT}
						textType="title"
						underline={true}
						useSvg={true}
						className="w-100 exir-logo"
						subtitle={STRINGS.formatString(
							STRINGS.SIGN_UP.SIGNUP_TO,
							STRINGS.APP_TITLE
						)}
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
						<SignupForm
							onSubmit={this.onSubmitSignup}
							formFields={formFields}
						/>
						{isMobile && <BottomLinks />}
					</div>
				</div>
				{!isMobile && <BottomLinks />}
				<Dialog
					isOpen={showContactForm}
					label="contact-modal"
					onCloseDialog={this.onCloseDialog}
					shouldCloseOnOverlayClick={false}
					style={{ 'z-index': 100 }}
					className={classnames(languageClasses)}
					showCloseText={false}
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

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
