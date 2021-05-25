import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { SubmissionError } from 'redux-form';
import { isMobile } from 'react-device-detect';
import { openContactForm } from 'actions/appActions';
import {
	resetPassword,
	otpRequest,
	otpActivate,
	otpSetActivated,
	otpRevoke,
} from '../../actions/userAction';
import {
	// CustomTabs,
	CustomMobileTabs,
	// CustomTabBar,
	MobileTabBar,
	Dialog,
	SuccessDisplay,
	OtpForm,
	IconTitle,
	Loader,
	HeaderSection,
	Button,
	TabController,
} from '../../components';
import { errorHandler } from '../../components/OtpForm/utils';
import ChangePasswordForm, { generateFormValues } from './ChangePasswordForm';
import { OTP, renderOTPForm } from './OTP';
import { DeveloperSection } from './DeveloperSection';
// import { FreezeSection } from './FreezeSection';

import { generateLogins } from './utils_logins';
import { RECORD_LIMIT } from './constants';
import LoginDisplay from './LoginDisplay';
import { getUserLogins } from '../../actions/userAction';

import STRINGS from '../../config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
// import { ICONS } from 'config/constants';

class UserVerification extends Component {
	state = {
		tabs: [],
		headers: [],
		dialogIsOpen: false,
		modalText: '',
		iconId: '',
		icon: '',
		activeTab: 0,
		jumpToPage: 0,
		freeze: false,
	};

	componentDidMount() {
		this.calculateTabs(this.props.user, this.state.activeTab);
		if (this.props.openApiKey) {
			this.openDevelopers();
		}

		this.props.getUserLogins(RECORD_LIMIT);
		this.openLogins();
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.activeLanguage !== this.props.activeLanguage) {
			this.openLogins();
		}

		if (
			nextProps.user.otp.requested &&
			nextProps.user.otp.requested !== this.props.user.otp.requested
		) {
			this.setState({ dialogIsOpen: true, modalText: '', stringId: '' });
		} else if (nextProps.user.otp.error !== this.props.user.otp.error) {
			this.setState({
				dialogIsOpen: true,
				modalText: nextProps.user.otp.error,
				stringId: '',
			});
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			prevProps.user.otp.requested !== this.props.user.otp.requested ||
			prevProps.user.otp.requesting !== this.props.user.otp.requesting ||
			prevProps.user.otp.activated !== this.props.user.otp.activated ||
			prevProps.user.otp_enabled !== this.props.user.otp_enabled ||
			prevProps.activeLanguage !== this.props.activeLanguage ||
			this.state.activeTab !== prevState.activeTab
		) {
			this.calculateTabs(this.props.user, this.state.activeTab);
		}
	}

	renderLoginsTab = () => {
		const { logins } = this.props;
		const { headers } = this.state;

		const props = {};

		props.title = STRINGS.ACCOUNT_SECURITY.LOGIN.CONTENT.TITLE;
		props.headers = headers.logins;
		props.data = logins;
		props.handleNext = this.handleNext;
		props.jumpToPage = this.state.jumpToPage;

		return <LoginDisplay {...props} />;
	};

	openLogins() {
		this.setState({
			headers: {
				logins: generateLogins(),
			},
		});
	}

	handleNext = (pageCount, pageNumber) => {
		const { logins } = this.props;
		const pageTemp = pageNumber % 2 === 0 ? 2 : 1;
		const apiPageTemp = Math.floor((pageNumber + 1) / 2);
		if (
			RECORD_LIMIT === pageCount * pageTemp &&
			apiPageTemp >= logins.page &&
			logins.isRemaining
		) {
			this.props.getUserLogins(RECORD_LIMIT, logins.page + 1);
			this.setState({ jumpToPage: pageNumber });
		}
	};

	calculateTabs = (user, activeTab) => {
		// const {freeze}= this.state;
		const formValues = generateFormValues();
		const { otp_enabled, otp, verification_level } = user;
		const { icons: ICONS } = this.props;

		const tabs = [
			{
				title: isMobile ? (
					<CustomMobileTabs
						stringId={'ACCOUNT_SECURITY.OTP.TITLE'}
						title={STRINGS['ACCOUNT_SECURITY.OTP.TITLE']}
						icon={ICONS.SETTING_NOTIFICATION_ICON}
					/>
				) : (
					// <CustomTabs
					// 	stringId={'ACCOUNT_SECURITY.OTP.TITLE'}
					// 	title={STRINGS['ACCOUNT_SECURITY.OTP.TITLE']}
					// 	icon={ICONS.SECURITY_OTP_ICON}
					// />
					<div>{STRINGS['ACCOUNT_SECURITY.OTP.TITLE']}</div>
				),
				content: activeTab === 0 && (
					<OTP
						requestOTP={this.handleOTPCheckbox}
						data={otp}
						otp_enabled={otp_enabled}
						icons={ICONS}
					>
						{/*otp_enabled && (
							<div className="d-flex flex-column">
								<CheckboxButton
									label={STRINGS["ACCOUNT_SECURITY.OTP.ENABLED_TEXTS.TEXT_1"]}
									checked={true}
								/>
								<CheckboxButton
									label={STRINGS["ACCOUNT_SECURITY.OTP.ENABLED_TEXTS.TEXT_2"]}
									checked={true}
								/>
							</div>
						)*/}
					</OTP>
				),
				notification: {
					stringId:
						'ACCOUNT_SECURITY.OTP.OTP_ENABLED,ACCOUNT_SECURITY.OTP.OTP_DISABLED',
					text: otp_enabled
						? STRINGS['ACCOUNT_SECURITY.OTP.OTP_ENABLED']
						: STRINGS['ACCOUNT_SECURITY.OTP.OTP_DISABLED'],
					status: otp_enabled ? 'success' : 'warning',
					iconPath: otp_enabled ? ICONS['GREEN_CHECK'] : ICONS['RED_ARROW'],
					iconId: 'GREEN_CHECK,RED_ARROW',
					allowClick: !otp_enabled,
				},
			},

			{
				title: isMobile ? (
					<CustomMobileTabs
						stringId={'ACCOUNT_SECURITY.CHANGE_PASSWORD.TITLE'}
						title={STRINGS['ACCOUNT_SECURITY.CHANGE_PASSWORD.TITLE']}
						icon={ICONS.SECURITY_CHANGE_PASSWORD_ICON}
					/>
				) : (
					// <CustomTabs
					// 	stringId={'ACCOUNT_SECURITY.CHANGE_PASSWORD.TITLE'}
					// 	title={STRINGS['ACCOUNT_SECURITY.CHANGE_PASSWORD.TITLE']}
					// 	icon={ICONS.SECURITY_CHANGE_PASSWORD_ICON}
					// />
					<div>{STRINGS['ACCOUNT_SECURITY.CHANGE_PASSWORD.TITLE']}</div>
				),
				content: activeTab === 1 && (
					<ChangePasswordForm
						onSubmit={this.onSubmitChangePassword}
						formFields={formValues}
					/>
				),
				disabled: false,
				notification: {
					stringId: 'ACCOUNT_SECURITY.CHANGE_PASSWORD.ACTIVE',
					text: STRINGS['ACCOUNT_SECURITY.CHANGE_PASSWORD.ACTIVE'],
					status: 'success',
					iconPath: ICONS['GREEN_CHECK'],
					iconId: 'GREEN_CHECK',
					allowClick: true,
				},
			},

			{
				title: isMobile ? (
					<CustomMobileTabs
						stringId={'DEVELOPER_SECTION.TITLE'}
						title={STRINGS['DEVELOPER_SECTION.TITLE']}
						icon={ICONS.SECURITY_API_ICON}
					/>
				) : (
					// <CustomTabs
					// 	stringId={'DEVELOPER_SECTION.TITLE'}
					// 	title={STRINGS['DEVELOPER_SECTION.TITLE']}
					// 	icon={ICONS.SECURITY_API_ICON}
					// />
					<div>{STRINGS['DEVELOPER_SECTION.TITLE']}</div>
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
					// text: STRINGS[`DEVELOPER_SECTION.${otp_enabled ? 'ACTIVE' : 'INACTIVE'}`],
					status: otp_enabled ? 'success' : 'disabled',
					iconId: 'TOKEN_TOKENS_ACTIVE,TOKEN_TOKENS_INACTIVE',
					iconPath: otp_enabled
						? ICONS['TOKEN_TOKENS_ACTIVE']
						: ICONS['TOKEN_TOKENS_INACTIVE'], // TODO check
					allowClick: true,
				},
			},
			// TODO Login history feature
			/*
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
			*/
			// TODO Freezing feature
			/*{
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
			}*/
		];

		this.setState({ tabs });
	};

	openFreeze = () => {
		this.setState({
			freeze: true,
		});
	};

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

	handleOTPCheckbox = (checked = false) => {
		if (checked) {
			this.props.requestOTP();
		} else {
			// TODO cancel otp
			this.setState({ dialogIsOpen: true, modalText: '', stringId: '' });
		}
	};

	onSubmitActivateOtp = (values) => {
		const { icons: ICONS } = this.props;
		return otpActivate(values)
			.then((res) => {
				this.props.otpSetActivated(true);
				this.setState({
					dialogIsOpen: true,
					iconId: 'OTP_ACTIVE',
					icon: ICONS['OTP_ACTIVE'],
					modalText: STRINGS['ACCOUNT_SECURITY.OTP.DIALOG.SUCCESS'],
					stringId: 'ACCOUNT_SECURITY.OTP.DIALOG.SUCCESS',
				});
			})
			.catch((err) => {
				const _error =
					err.response && err.response.data
						? err.response.data.message
						: err.message;
				throw new SubmissionError({ code: _error });
			});
	};

	onSubmitChangePassword = (values) => {
		return resetPassword({
			old_password: values.old_password,
			new_password: values.new_password,
		})
			.then((res) => {
				this.setState({
					dialogIsOpen: true,
					modalText: STRINGS['ACCOUNT_SECURITY.CHANGE_PASSWORD.DIALOG.SUCCESS'],
					stringId: 'ACCOUNT_SECURITY.CHANGE_PASSWORD.DIALOG.SUCCESS',
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
		const { icons: ICONS } = this.props;
		return otpRevoke({ code: values.otp_code })
			.then(() => {
				this.props.otpSetActivated(false);
				this.setState({
					dialogIsOpen: true,
					iconId: 'OTP_DEACTIVATED',
					icon: ICONS['OTP_DEACTIVATED'],
					modalText: STRINGS['ACCOUNT_SECURITY.OTP.DIALOG.REVOKE'],
					stringId: 'ACCOUNT_SECURITY.OTP.DIALOG.REVOKE',
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

	onCloseDialog = () => {
		this.setState({ dialogIsOpen: false, iconId: '', icon: '' });
	};

	// onSubmitotp = (values) => {
	// 	this.props.otpSetActivated(true);
	// 	return renderOTPForm(this.onSubmitActivateOtp);

	// };

	renderModalContent = (
		{ requested, activated, secret, error },
		otp_enabled,
		email,
		modalText,
		constants,
		icons
	) => {
		const { stringId, icon, iconId } = this.state;

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
			return renderOTPForm(
				secret,
				email,
				this.onSubmitActivateOtp,
				constants,
				icons
			);
		} else {
			return (
				<SuccessDisplay
					onClick={this.onCloseDialog}
					text={modalText}
					success={!error}
					iconId={iconId}
					iconPath={icon}
					stringId={stringId}
				/>
			);
		}
	};

	render() {
		if (this.props.user.verification_level === 0) {
			return <Loader />;
		}
		const { dialogIsOpen, modalText, activeTab, tabs, freeze } = this.state;
		const { otp, email, otp_enabled } = this.props.user;
		const { icons: ICONS, openContactForm } = this.props;
		//const { onCloseDialog } = this;

		if (freeze === true) {
			return (
				<div>
					{!isMobile && (
						<IconTitle
							stringId="ACCOUNT_SECURITY.FREEZE.CONTENT.TITLE_1"
							text={STRINGS['ACCOUNT_SECURITY.FREEZE.CONTENT.TITLE_1']}
							textType="title"
						/>
					)}
					<HeaderSection
						stringId="ACCOUNT_SECURITY.FREEZE.CONTENT.TITLE_2"
						title={STRINGS['ACCOUNT_SECURITY.FREEZE.CONTENT.TITLE_2']}
						openContactForm={openContactForm}
					>
						<div> {STRINGS['ACCOUNT_SECURITY.FREEZE.CONTENT.MESSAGE_2']}</div>
						<div className="mb-2">
							{' '}
							{STRINGS['ACCOUNT_SECURITY.FREEZE.CONTENT.MESSAGE_3']}{' '}
						</div>

						<div> {STRINGS['ACCOUNT_SECURITY.FREEZE.CONTENT.MESSAGE_4']} </div>
						<div> {STRINGS['ACCOUNT_SECURITY.FREEZE.CONTENT.MESSAGE_5']} </div>
						<div className="mb-2">
							{' '}
							{STRINGS['ACCOUNT_SECURITY.FREEZE.CONTENT.MESSAGE_6']}{' '}
						</div>
						<div className="warning_text">
							{STRINGS['ACCOUNT_SECURITY.FREEZE.CONTENT.WARNING_2']}
						</div>
					</HeaderSection>
					<div className="mb-4 mt-4 blue-link pointer">
						<Button
							//onClick={}
							label={'YES,FREEZE'}
						/>
					</div>
				</div>
			);
		}
		return (
			<div className="user-security-container">
				{!isMobile && (
					<IconTitle
						stringId="ACCOUNTS.TAB_SECURITY"
						text={STRINGS['ACCOUNTS.TAB_SECURITY']}
						iconId="TAB_SECURITY"
						iconPath={ICONS['TAB_SECURITY']}
						textType="title"
					/>
				)}
				<HeaderSection
					stringId="ACCOUNTS.TAB_SETTINGS"
					title={STRINGS['ACCOUNTS.TAB_SETTINGS']}
					openContactForm={openContactForm}
				>
					<div className="header-content">
						<div>{STRINGS['ACCOUNT_SECURITY.TITLE_TEXT']}</div>
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
							this.props.constants,
							this.props.icons
						)
					) : (
						<div />
					)}
				</Dialog>

				{!isMobile ? (
					<TabController
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
	logins: state.wallet.logins,
	user: state.user,
	activeLanguage: state.app.language,
	activeTheme: state.app.theme,
	constants: state.app.constants,
});

const mapDispatchToProps = (dispatch) => ({
	getUserLogins: (limit, page = 1) => dispatch(getUserLogins({ limit, page })),
	requestOTP: () => dispatch(otpRequest()),
	otpSetActivated: (active) => dispatch(otpSetActivated(active)),
	openContactForm: bindActionCreators(openContactForm, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(UserVerification));
