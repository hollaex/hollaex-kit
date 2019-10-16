import React, { Component } from 'react';
import classnames from 'classnames';
import ReactSVG from 'react-svg';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { SubmissionError, change } from 'redux-form';
import { bindActionCreators } from 'redux';
import { performSignup } from '../../actions/authAction';
import SignupForm, { generateFormFields, FORM_NAME } from './SignupForm';
import SignupSuccess from './SignupSuccess';
import { RequestForm } from '../';
import { IconTitle, Dialog, MobileBarBack, BlueLink } from '../../components';
import {
	HOLLAEX_LOGO,
	HOLLAEX_LOGO_BLACK,
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
		showContactForm: false,
		isReferral: false
	};


	componentDidMount() {
		const affiliation_code = this.getReferralCode();
		if (affiliation_code) {
			this.setState({ isReferral: true });
		}
	}


	getReferralCode = () => {
		let affiliation_code = '';
		if (this.props.location
			&& this.props.location.query
			&& this.props.location.query.affiliation_code) {
			affiliation_code = this.props.location.query.affiliation_code;
		} else if (window.location
			&& window.location.search
			&& window.location.search.includes('affiliation_code')) {
			affiliation_code = window.location.search.split('?affiliation_code=')[1];
		}
		return affiliation_code;
	}

	onSubmitSignup = (values) => {
		const affiliation_code = this.getReferralCode();
		if (affiliation_code) {
			values.referral = affiliation_code;
		}
		return performSignup(values)
			.then((res) => {
				this.setState({ success: true });
			})
			.catch((error) => {
				const errors = {};
				setTimeout(() => {
					this.props.change(FORM_NAME, 'captcha', '');
				}, 5000);

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

	onGoBack = () => {
		this.props.router.push(`/login`);
	};

	onBackActiveEmail = () => {
		this.setState({ success: false });
	};

	render() {
		const { languageClasses, activeTheme } = this.props;
		const { success, showContactForm, isReferral } = this.state;

		if (success) {
			return <div>
				{isMobile && <MobileBarBack onBackClick={this.onBackActiveEmail} />}
				<SignupSuccess activeTheme={activeTheme} /></div>
		}

		const formFields = generateFormFields(STRINGS, activeTheme, isReferral);

		return (
			<div className={classnames(...FLEX_CENTER_CLASSES, 'flex-column', 'f-1')}>
				{isMobile && !showContactForm && <MobileBarBack onBackClick={this.onGoBack} />}
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
						imageWrapperClassName="auth_logo-wrapper"
						subtitle={STRINGS.formatString(
							STRINGS.SIGN_UP.SIGNUP_TO,
							STRINGS.APP_TITLE
						)}
						actionProps={{
							text: STRINGS.REQUEST_HEX_ACCESS.REQUEST_INVITE,
							iconPath: ICONS.BLUE_QUESTION,
							onClick: this.onOpenDialog,
							useSvg: true
						}}
					/>
					{!isReferral
						? <div className={classnames(' signup-warning', 'flex-row', 'd-flex', 'justify-content:space-between')}>
							<div className={classnames('d-flex')}>
								<ReactSVG path={ICONS.VERIFICATION_INCOMPLETE} wrapperClassName={'warning-icon'} />
							</div>
							<div className="signup-warning-text">
								{STRINGS.formatString(
									STRINGS.REQUEST_HEX_ACCESS.REFERRAL_INVITE_WARNING,
									<BlueLink
										onClick={this.onOpenDialog}
										text={STRINGS.REQUEST_HEX_ACCESS.REQUEST_INVITE.toLowerCase()}
									/>
								)}
							</div>
						</div>
						: null
					}
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
					theme={activeTheme}
				>
					<RequestForm
						initialValues={{ category: 'request_Hex_Invite' }}
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
