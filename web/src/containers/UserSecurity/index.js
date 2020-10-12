import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { SubmissionError} from 'redux-form';
import { isMobile } from 'react-device-detect';
import classnames from 'classnames';
import { ICONS } from '../../config/constants';
import {openContactForm} from '../../actions/appActions';
import {
	resetPassword,
	otpRequest,
	otpActivate,
	otpSetActivated,
	otpRevoke
} from '../../actions/userAction';
import {
	CustomTabs,
	CustomMobileTabs,
	CustomTabBar,
	MobileTabBar,
	Dialog,
	SuccessDisplay,
	OtpForm,
	IconTitle,
	Loader,
	HeaderSection,
	Button

} from '../../components';
import { errorHandler } from '../../components/OtpForm/utils';
import ChangePasswordForm, { generateFormValues } from './ChangePasswordForm';
import { OTP , renderOTPForm } from './OTP';
import { DeveloperSection } from './DeveloperSection';
import { FreezeSection } from './FreezeSection';

import { generateLogins } from './utils_logins';
import { RECORD_LIMIT } from './constants';
import HistoryDisplay  from './HistoryDisplay';
import { getUserLogins } from '../../actions/userAction';

import STRINGS from '../../config/localizedStrings';

class UserVerification extends Component {
	state = {
		tabs: [],
		headers: [],
		dialogIsOpen: false,
		modalText: '',
		activeTab: 0,
		jumpToPage: 0,
		freeze : false
	};

	componentDidMount() {
		this.calculateSections(this.props.user,this.state.activeTab);
		if (this.props.openApiKey) {
			this.openDevelopers();
		}

		this.props.getUserLogins(RECORD_LIMIT);
		this.openLogins();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.activeLanguage !== this.props.activeLanguage) {
			this.openLogins();
		}

		if (
			nextProps.user.otp.requested !== this.props.user.otp.requested ||
			nextProps.user.otp.requesting !== this.props.user.otp.requesting ||
			nextProps.user.otp.activated !== this.props.user.otp.activated ||
			nextProps.user.otp_enabled === this.props.user.otp_enabled ||
			nextProps.activeLanguage !== this.props.activeLanguage
		) {
			this.calculateSections(nextProps.user,this.state.activeTab);
		}

		if (
			nextProps.user.otp.requested &&
			nextProps.user.otp.requested !== this.props.user.otp.requested
		) {
			this.setState({ dialogIsOpen: true, modalText: '' });
		} else if (nextProps.user.otp.error !== this.props.user.otp.error) {
			this.setState({
				dialogIsOpen: true,
				modalText: nextProps.user.otp.error
			});
		}
	}

	componentWillUpdate(nextProps, nextState) {
		if (
			this.state.activeTab !== nextState.activeTab &&
			nextState.activeTab !== 0
		) {
			this.calculateSections(nextProps, nextState.activeTab);
		}
	}

	renderLoginsTab = () => {
		const { logins } = this.props;
		const { headers} = this.state;
		// const name = STRINGS[`${symbol.toUpperCase()}_NAME`];

		const props = {
		};

				props.title = STRINGS.ACCOUNT_SECURITY.LOGIN.CONTENT.TITLE;
				props.headers = headers.logins;
				props.data = logins;
				props.handleNext = this.handleNext;
				props.jumpToPage = this.state.jumpToPage;


		return <HistoryDisplay {...props} />;
	};

	openLogins() {
		this.setState({
			headers: {
				logins: generateLogins()
			}
		});
	}

	handleNext = (pageCount, pageNumber) => {
		const { logins } = this.props;
		const pageTemp = (pageNumber % 2) === 0 ? 2 : 1;
		const apiPageTemp = Math.floor(((pageNumber + 1) / 2));
				if (RECORD_LIMIT === (pageCount * pageTemp)
					&& apiPageTemp >= logins.page
					&& logins.isRemaining) {
					this.props.getUserLogins( RECORD_LIMIT, logins.page + 1);
					this.setState({ jumpToPage: pageNumber });
				}
	};

	calculateSections = (user , activeTab) => {
		const {freeze}= this.state;
		const formValues = generateFormValues();
		const { otp_enabled, otp, verification_level } = user;

		const tabs = [
			{
				title: isMobile ? (
					<CustomMobileTabs
						title={STRINGS.ACCOUNT_SECURITY.OTP.TITLE}
						icon={ICONS.SETTING_NOTIFICATION_ICON}
					/>
				) : (
					<CustomTabs
						title={STRINGS.ACCOUNT_SECURITY.OTP.TITLE}
						icon={ICONS.SETTING_NOTIFICATION_ICON}
					/>
				),
				content: activeTab === 0 && (
					<OTP
						requestOTP={this.handleOTPCheckbox}
						data={otp}
						otp_enabled={otp_enabled}
					>
						{/*otp_enabled && (
							<div className="d-flex flex-column">
								<CheckboxButton
									label={STRINGS.ACCOUNT_SECURITY.OTP.ENABLED_TEXTS.TEXT_1}
									checked={true}
								/>
								<CheckboxButton
									label={STRINGS.ACCOUNT_SECURITY.OTP.ENABLED_TEXTS.TEXT_2}
									checked={true}
								/>
							</div>
						)*/}
					</OTP>
				),
				notification: {
					text: otp_enabled
						? STRINGS.ACCOUNT_SECURITY.OTP.OTP_ENABLED
						: STRINGS.ACCOUNT_SECURITY.OTP.OTP_DISABLED,
					status: otp_enabled ? 'success' : 'warning',
					iconPath: otp_enabled ? ICONS.GREEN_CHECK : ICONS.RED_ARROW,
					allowClick: !otp_enabled
				}
			},

			{
				title: isMobile ? (
					<CustomMobileTabs
						title={STRINGS.ACCOUNT_SECURITY.CHANGE_PASSWORD.TITLE}
						icon={ICONS.SETTING_INTERFACE_ICON}
					/>
				) : (
					<CustomTabs
						title={STRINGS.ACCOUNT_SECURITY.CHANGE_PASSWORD.TITLE}
						icon={ICONS.SETTING_INTERFACE_ICON}
					/>
				),
				content: activeTab === 1 && (
					<ChangePasswordForm
						onSubmit={this.onSubmitChangePassword}
						formFields={formValues}
					/>
				),
				disabled: false,
				notification: {
					text: STRINGS.ACCOUNT_SECURITY.CHANGE_PASSWORD.ACTIVE,
					status: 'success',
					iconPath: ICONS.GREEN_CHECK,
					allowClick: true
				}
			},

			{
				title: isMobile ? (
					<CustomMobileTabs
						title={STRINGS.DEVELOPER_SECTION.TITLE}
						icon={ICONS.SETTING_LANGUAGE_ICON}
					/>
				) : (
					<CustomTabs
						title={STRINGS.DEVELOPER_SECTION.TITLE}
						icon={ICONS.SETTING_LANGUAGE_ICON}
					/>
				),
				content: activeTab === 2 && (
					<DeveloperSection
						otp_enabled={otp_enabled}
						openOtp={this.openOtp}
						verification_level={verification_level}
					/>
				),
				disabled: false,
				notification: {
					// text: STRINGS.DEVELOPER_SECTION[otp_enabled ? 'ACTIVE' : 'INACTIVE'],
					status: otp_enabled ? 'success' : 'disabled',
					iconPath: otp_enabled
						? ICONS.TOKENS_ACTIVE
						: ICONS.TOKENS_INACTIVE, // TODO check
					allowClick: true
				}
			},

			{
				title: isMobile ? (
					<CustomMobileTabs
						title={STRINGS.ACCOUNT_SECURITY.LOGIN.TITLE}
						icon={ICONS.SETTING_INTERFACE_ICON}
					/>
				) : (
					<CustomTabs
						title={STRINGS.ACCOUNT_SECURITY.LOGIN.TITLE}
						icon={ICONS.DEPOSIT_HISTORY}
					/>
				),
				content: activeTab === 3 && (
					<div className={classnames('inner_container', 'with_border_top')}>
						{this.renderLoginsTab()}
					</div>
				)
			},
			{
				title: isMobile ? (
					<CustomMobileTabs
						title={STRINGS.ACCOUNT_SECURITY.FREEZE.TITLE}
						icon={ICONS.SETTING_LANGUAGE_ICON}
					/>
				) : (
					<CustomTabs
						title={STRINGS.ACCOUNT_SECURITY.FREEZE.TITLE}
						icon={ICONS.SETTING_LANGUAGE_ICON}
					/>
				),
				content: activeTab === 4 && freeze === false && (
					<FreezeSection
					handleSubmit={this.openFreeze}
					/>
				)
			}

		];

		this.setState({ tabs });
	};

openFreeze =()=> {
	this.setState({
		freeze:true
	});
}

	renderContent = (tabs, activeTab) =>
		tabs[activeTab] && tabs[activeTab].content ? (
			tabs[activeTab].content
		) : (
			<div />
		);

	setActiveTab = (activeTab) => {
		this.setState({ activeTab });
	};

	/*logout = (message = '') => {
			this.props.logout(typeof message === 'string' ? message : '');
	};*/

	openContactForm = () => {
		const { links = {} } = this.props.constants;
		this.props.openContactForm({ helpdesk: links.helpdesk });
	};

	handleOTPCheckbox = (checked = false) => {
			if (checked) {
				this.props.requestOTP();
			} else {
				// TODO cancel otp
				this.setState({ dialogIsOpen: true, modalText: ''});
			}
		};

		onSubmitActivateOtp = (values) => {
			return otpActivate(values)
				.then((res) => {
					this.props.otpSetActivated(true);
					this.setState({
						dialogIsOpen: true,
						modalText: STRINGS.ACCOUNT_SECURITY.OTP.DIALOG.SUCCESS
					});
				})
				.catch((err) => {
					const _error = err.response.data
						? err.response.data.message
						: err.message;
					throw new SubmissionError({ code: _error });
				});
		};

		onSubmitChangePassword = (values) => {
			return resetPassword({
				old_password: values.old_password,
				new_password: values.new_password
			})
				.then((res) => {
					this.setState({
						dialogIsOpen: true,
						modalText:
							STRINGS.ACCOUNT_SECURITY.CHANGE_PASSWORD.DIALOG.SUCCESS
					});
				})
				.catch((err) => {
					const _error = err.response.data
						? err.response.data.message
						: err.message;
					throw new SubmissionError({ _error });
				});
		};

		onSubmitCancelOTP = (values) => {
			return otpRevoke({ code: values.otp_code })
				.then(() => {
					this.props.otpSetActivated(false);
					this.setState({
						dialogIsOpen: true,
						modalText: STRINGS.ACCOUNT_SECURITY.OTP.DIALOG.REVOKE
					});
				})
				.catch(errorHandler);
		};

		openOtp = () => {
			this.setActiveTab(0);
		};

		openDevelopers = () => {
			this.setActiveTab(2);
		};

		renderModalContent = () => {
			return (
				<SuccessDisplay
					onClick={this.onCloseDialog}
					text={this.state.modalText}
				/>
			);
		};

		onCloseDialog = () => {
			this.setState({ dialogIsOpen: false });
		};

		onSubmitotp = (values) => {
		this.props.otpSetActivated(true);
		return renderOTPForm(this.onSubmitActivateOtp);

		};

		renderModalContent = (
			{ requested, activated, secret, error },
			otp_enabled,
			email,
			modalText,
			constants

		) => {
			if (error) {
				return (
					<SuccessDisplay
						onClick={this.onCloseDialog}
						text={error}
						success={false}
					/>
				);
			} else if (otp_enabled && !modalText) {
				return <OtpForm onSubmit={this.onSubmitCancelOTP} />;
			} else if (requested && !activated) {
					return renderOTPForm(secret, email, this.onSubmitActivateOtp, constants);
			} else {
				return (
					<SuccessDisplay
						onClick={this.onCloseDialog}
						text={modalText}
						success={!error}
					/>
				);
			}
		};

		render() {
			if (this.props.user.verification_level === 0) {
				return <Loader />;
			}
			const {dialogIsOpen, modalText , activeTab , tabs ,freeze} = this.state;
			const { otp, email, otp_enabled } = this.props.user;
			//const { onCloseDialog } = this;


			if (freeze === true) {

			return (
				<div>
				{!isMobile && (
					<IconTitle
						text={STRINGS.ACCOUNT_SECURITY.FREEZE.CONTENT.TITLE_1}
						textType="title"
					/>
				)}
				<HeaderSection
				title={STRINGS.ACCOUNT_SECURITY.FREEZE.CONTENT.TITLE_2}
				openContactForm={this.openContactForm}
				>
					<div> {STRINGS.ACCOUNT_SECURITY.FREEZE.CONTENT.MESSAGE_2}	</div>
					<div className="mb-2"> {STRINGS.ACCOUNT_SECURITY.FREEZE.CONTENT.MESSAGE_3} </div>

					<div> {STRINGS.ACCOUNT_SECURITY.FREEZE.CONTENT.MESSAGE_4} </div>
					<div> {STRINGS.ACCOUNT_SECURITY.FREEZE.CONTENT.MESSAGE_5} </div>
					<div className="mb-2"> {STRINGS.ACCOUNT_SECURITY.FREEZE.CONTENT.MESSAGE_6} </div>
					<div className="warning_text">
						{STRINGS.ACCOUNT_SECURITY.FREEZE.CONTENT.WARNING_2}
					</div>

			</HeaderSection>
					 	<div className="mb-4 mt-4 blue-link pointer">
						<Button
							//onClick={}
							label={"YES,FREEZE"}
						/>
						</div>
					</div>
			)
}
			return (
				<div>
					{!isMobile && (
						<IconTitle
							text={STRINGS.ACCOUNTS.TAB_SECURITY}
							textType="title"
						/>
					)}
					<HeaderSection
					title={STRINGS.ACCOUNTS.TAB_SETTINGS}
					openContactForm={this.openContactForm}
				>
					<div className="header-content">
						<div>{STRINGS.ACCOUNT_SECURITY.TITLE_TEXT}</div>
					</div>
				</HeaderSection>

					<Dialog
						isOpen={dialogIsOpen && !otp.requesting}
						label="security-modal"
						onCloseDialog={this.onCloseDialog}
						showCloseText={!(otp.error || modalText)}
						theme={this.props.activeTheme}
					>
						{dialogIsOpen && !otp.requesting ? (
							this.renderModalContent(
								otp,
								otp_enabled,
								email,
								modalText,
								this.props.constants
							)
						) : (

					<div/>
						)}
					</Dialog>

					{!isMobile ? (
					<CustomTabBar
						activeTab={activeTab}
						setActiveTab={this.setActiveTab}
						tabs={tabs}
					/>
				) : (
					<MobileTabBar
						activeTab={activeTab}
						renderContent={this.renderContent}
						setActiveTab={this.setActiveTab}
						tabs={tabs}
					/>
				)}
				{!isMobile ? this.renderContent(tabs, activeTab) : null}

			</div>
			);
		}
	}

	const mapStateToProps = (state) => ({
		logins: state.wallet.deposits,
		user: state.user,
		activeLanguage: state.app.language,
		activeTheme: state.app.theme,
		constants: state.app.constants
	});

	const mapDispatchToProps = (dispatch) => ({
		getUserLogins: ( limit, page = 1) => dispatch(getUserLogins({ limit, page })),
		requestOTP: () => dispatch(otpRequest()),
		otpSetActivated: (active) => dispatch(otpSetActivated(active)),
		openContactForm: bindActionCreators(openContactForm, dispatch)
	});

	export default connect(
		mapStateToProps,
		mapDispatchToProps
	)(UserVerification);
