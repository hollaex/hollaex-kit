import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { SubmissionError } from 'redux-form';
import { isMobile } from 'react-device-detect';
import { message } from 'antd';
import debounce from 'lodash.debounce';
import {
	openContactForm,
	setSecurityTab,
	setSelectedStep,
} from 'actions/appActions';
import {
	resetPassword,
	otpRequest,
	otpActivate,
	otpSetActivated,
	otpRevoke,
	getConfirmationPassword,
} from 'actions/userAction';
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
	EditWrapper,
	NotLoggedIn,
} from 'components';
import { errorHandler } from 'components/OtpForm/utils';
import ChangePasswordForm, {
	generateFormValues,
	selector as passwordSelector,
} from './ChangePasswordForm';
import { OTP, renderOTPForm } from './OTP';
import { DeveloperSection } from './DeveloperSection';
import Sessions from './Sessions';
import Logins from './Logins';
// import { FreezeSection } from './FreezeSection';
import { isLoggedIn } from 'utils/token';

import { generateLogins } from './utils_logins';
import { RECORD_LIMIT } from './constants';
import LoginDisplay from './LoginDisplay';
import { getUserLogins } from 'actions/userAction';

import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
// import { ICONS } from 'config/constants';

class UserSecurity extends Component {
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
		error: '',
		updatedPassword: {},
		isEnableOtpForm: false,
		otpFormStep: 0,
		isVerifyCode: false,
		verifyCode: null,
		timerMinutes: 6,
		timerSeconds: 0,
		timerExpired: false,
		isEmailVerify: false,
		isSuccessDialog: false,
	};

	componentDidMount() {
		this.calculateTabs(this.props.user, this.state.activeTab);
		if (this.props.openApiKey) {
			this.openDevelopers();
		}

		this.props.getUserLogins(RECORD_LIMIT);
		this.openLogins();
		if (this.props.getSecurityTab) {
			this.setState({
				activeTab: this.props.getSecurityTab,
			});
		} else {
			if (
				window.location.search &&
				window.location.search.includes('password')
			) {
				this.setState({ activeTab: 1 });
				this.props.setSecurityTab(1);
			} else if (
				window.location.search &&
				window.location.search.includes('apiKeys')
			) {
				this.setState({ activeTab: 2 });
				this.props.setSecurityTab(2);
			} else if (
				window.location.search &&
				window.location.search?.includes('sessions')
			) {
				this.setState({ activeTab: 3 });
				this.props.setSecurityTab(3);
			} else if (
				window.location.search &&
				window.location.search?.includes('login-history')
			) {
				this.setState({ activeTab: 4 });
				this.props.setSecurityTab(4);
			} else {
				this.setState({ activeTab: 0 });
				this.props.setSecurityTab(0);
			}
		}
		this.openCurrentTab();
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
		if (this.props.getSecurityTab !== this.state.activeTab) {
			this.setState({
				activeTab: this.props.getSecurityTab,
			});
		}
		if (
			prevProps.user.otp.requested !== this.props.user.otp.requested ||
			prevProps.user.otp.requesting !== this.props.user.otp.requesting ||
			prevProps.user.otp.activated !== this.props.user.otp.activated ||
			prevProps.user.otp_enabled !== this.props.user.otp_enabled ||
			prevState.error !== this.state.error ||
			prevProps.activeLanguage !== this.props.activeLanguage ||
			this.state.activeTab !== prevState.activeTab
		) {
			this.calculateTabs(this.props.user, this.state.activeTab);
		}
		if (
			this.state.activeTab !== prevState.activeTab ||
			JSON.stringify(prevProps.passwordFormValues) !==
				JSON.stringify(this.props.passwordFormValues)
		) {
			this.setState({
				error: undefined,
			});
		}
		if (
			JSON.stringify(prevState.activeTab) !==
			JSON.stringify(this.state.activeTab)
		) {
			this.openCurrentTab();
		}
		if (!prevState.isVerifyCode && this.state.isVerifyCode) {
			this.setState(
				{ timerMinutes: 6, timerSeconds: 0, timerExpired: false },
				() => this.startTimerDebounced()
			);
		}
	}

	componentWillUnmount() {
		if (this.props.getSecurityTab) {
			this.props.setSecurityTab(0);
		}
		if (this.timerCancel) {
			this.timerCancel();
		}
	}

	startTimerDebounced = () => {
		const tick = debounce(() => {
			const { timerMinutes, timerSeconds, timerExpired } = this.state;
			if (timerExpired) return;
			if (timerMinutes === 0 && timerSeconds === 0) {
				this.setState({ timerExpired: true });
				return;
			}
			if (timerSeconds === 0) {
				this.setState(
					(prevState) => ({
						timerMinutes: prevState?.timerMinutes - 1,
						timerSeconds: 59,
					}),
					() => this.startTimerDebounced()
				);
			} else {
				this.setState(
					(prevState) => ({
						timerSeconds: prevState?.timerSeconds - 1,
					}),
					() => this.startTimerDebounced()
				);
			}
		}, 1000);
		this.timerCancel = () => tick.cancel();
		tick();
	};

	handleCloseVerifyCode = () => {
		this.setState({ isVerifyCode: false, verifyCode: null, error: '' });
	};

	onHandleEmailVerifyClose = () => {
		this.setState({
			dialogIsOpen: false,
			iconId: '',
			icon: '',
			updatedPassword: {},
			isEnableOtpForm: false,
			isEmailVerify: false,
		});
	};

	handleCloseSuccessDialog = () => {
		this.props.router.push('/login');
		this.setState({ isSuccessDialog: false });
	};

	openCurrentTab = () => {
		let currentTab = '';
		if (this.state.activeTab === 1) {
			currentTab = 'password';
		} else if (this.state.activeTab === 2) {
			currentTab = 'apiKeys';
		} else if (this.state.activeTab === 3) {
			currentTab = 'sessions';
		} else if (this.state.activeTab === 4) {
			currentTab = 'login-history';
		} else {
			currentTab = '2fa';
		}
		this.props.router.push(`/security?${currentTab}`);
	};

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
						icon={ICONS.OPTION_2FA_ICON}
						iconClassName="security-icon"
					/>
				) : (
					// <CustomTabs
					// 	stringId={'ACCOUNT_SECURITY.OTP.TITLE'}
					// 	title={STRINGS['ACCOUNT_SECURITY.OTP.TITLE']}
					// 	icon={ICONS.SECURITY_OTP_ICON}
					// />
					<EditWrapper stringId="ACCOUNT_SECURITY.OTP.TITLE">
						{STRINGS['ACCOUNT_SECURITY.OTP.TITLE']}
					</EditWrapper>
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
					<EditWrapper stringId="ACCOUNT_SECURITY.CHANGE_PASSWORD.TITLE">
						{STRINGS['ACCOUNT_SECURITY.CHANGE_PASSWORD.TITLE']}
					</EditWrapper>
				),
				content: activeTab === 1 && (
					<ChangePasswordForm
						_error={this.state.error}
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
					<EditWrapper stringId="DEVELOPER_SECTION.TITLE">
						{STRINGS['DEVELOPER_SECTION.TITLE']}
					</EditWrapper>
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
			{
				title: isMobile ? (
					<CustomMobileTabs
						stringId={'SESSIONS.TAB'}
						title={STRINGS['SESSIONS.TAB']}
						icon={ICONS.SESSION_OPTION_ICON}
						iconClassName="security-icon"
					/>
				) : (
					<EditWrapper stringId="SESSIONS.TAB">
						{STRINGS['SESSIONS.TAB']}
					</EditWrapper>
				),
				content: activeTab === 3 && <Sessions />,
			},
			{
				title: isMobile ? (
					<CustomMobileTabs
						stringId={'LOGINS_HISTORY.TAB'}
						title={STRINGS['LOGINS_HISTORY.TAB']}
						icon={ICONS.LOGIN_OPTION_ICON}
						iconClassName="security-icon"
					/>
				) : (
					<EditWrapper stringId="LOGINS_HISTORY.TAB">
						{STRINGS['LOGINS_HISTORY.TAB']}
					</EditWrapper>
				),
				content: activeTab === 4 && <Logins />,
			},
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
		this.props.setSecurityTab(activeTab);
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

	setOtpModalsState = (values) => {
		this.setState({
			dialogIsOpen: true,
			modalText: undefined,
			updatedPassword: {
				old_password: values.old_password,
				new_password: values.new_password,
				version: 'v3',
			},
		});
	};

	onSubmitChangePassword = (values) => {
		this.setState({ verifyCode: null, isEmailVerify: true });
		const { otp_enabled } = this.props.user;
		if (otp_enabled) {
			this.setOtpModalsState(values);
		} else {
			return resetPassword({
				old_password: values.old_password,
				new_password: values.new_password,
				version: 'v3',
			})
				.then((res) => {
					this.setState({
						dialogIsOpen: true,
						modalText:
							STRINGS[
								'ACCOUNT_SECURITY.CHANGE_PASSWORD.DIALOG.EMAIL_CONFIRMATION'
							],
						stringId:
							'ACCOUNT_SECURITY.CHANGE_PASSWORD.DIALOG.EMAIL_CONFIRMATION',
					});
				})
				.catch((err) => {
					const _error =
						err.response && err.response.data
							? err.response.data.message
							: err.message;
					if (!_error) {
						message.error(STRINGS['CHANGE_PASSWORD_FAILED']);
					}
					throw new SubmissionError({ _error });
				});
		}
	};

	onSubmitCancelOTP = (values) => {
		const { icons: ICONS } = this.props;
		const { otp_enabled } = this.props.user;
		const { updatedPassword, isEnableOtpForm } = this.state;
		const body = {
			...updatedPassword,
			...values,
		};
		if (otp_enabled && Object.keys(updatedPassword).length) {
			return resetPassword(body)
				.then((res) => {
					this.setState({
						dialogIsOpen: true,
						modalText:
							STRINGS[
								'ACCOUNT_SECURITY.CHANGE_PASSWORD.DIALOG.EMAIL_CONFIRMATION'
							],
						stringId:
							'ACCOUNT_SECURITY.CHANGE_PASSWORD.DIALOG.EMAIL_CONFIRMATION',
					});
				})
				.catch((err) => {
					const _error =
						err.response && err.response.data
							? err.response.data.message
							: err.message;
					if (!_error) {
						message.error(STRINGS['CHANGE_PASSWORD_FAILED']);
					}
					if (_error !== 'Invalid OTP Code') {
						this.setState({
							dialogIsOpen: false,
							error: _error,
						});
					}
					throw new SubmissionError({ _error });
				});
		} else {
			if (isEnableOtpForm) {
				return otpActivate({ code: values.otp_code })
					.then(() => {
						this.props.otpSetActivated(true);
						this.setState({
							dialogIsOpen: true,
							iconId: 'OTP_ACTIVE',
							icon: ICONS['OTP_ACTIVE'],
							modalText: STRINGS['ACCOUNT_SECURITY.OTP.DIALOG.SUCCESS'],
							stringId: 'ACCOUNT_SECURITY.OTP.DIALOG.SUCCESS',
							isEnableOtpForm: false,
						});
					})
					.catch(errorHandler);
			} else {
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
			}
		}
	};

	openOtp = () => {
		this.setActiveTab(0);
	};

	openDevelopers = () => {
		this.setActiveTab(2);
	};

	onCloseDialog = () => {
		this.setState({
			dialogIsOpen: false,
			iconId: '',
			icon: '',
			updatedPassword: {},
			isEnableOtpForm: false,
		});
		this.props.setSelectedStep(0);
		if (
			this.state.modalText ===
			STRINGS['ACCOUNT_SECURITY.CHANGE_PASSWORD.DIALOG.EMAIL_CONFIRMATION']
		) {
			this.setState({ isVerifyCode: true });
		}
	};

	// onSubmitotp = (values) => {
	// 	this.props.otpSetActivated(true);
	// 	return renderOTPForm(this.onSubmitActivateOtp);

	// };

	handleUpdateOtp = (val) => {
		this.setState({ isEnableOtpForm: val });
	};

	renderModalContent = (
		{ requested, activated, secret, error },
		otp_enabled,
		email,
		modalText,
		constants,
		icons
	) => {
		const {
			stringId,
			icon,
			iconId,
			isEnableOtpForm,
			isEmailVerify,
		} = this.state;

		if (error) {
			return (
				<SuccessDisplay
					onClick={this.onCloseDialog}
					text={error}
					success={false}
				/>
			);
		} else if ((otp_enabled && !modalText) || isEnableOtpForm) {
			return (
				<OtpForm
					isEnableOtpForm={isEnableOtpForm}
					onSubmit={this.onSubmitCancelOTP}
				/>
			);
		} else if (requested && !activated) {
			const { selectedStep } = this.props;
			return renderOTPForm(
				secret,
				email,
				this.onSubmitActivateOtp,
				constants,
				icons,
				this.onCloseDialog,
				this.handleOTPCheckbox,
				this.handleUpdateOtp,
				selectedStep
			);
		} else if (isEmailVerify) {
			return this.renderEmailVerify();
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

	onHandleEnableBack = (val) => {
		this.props.setSelectedStep(val);
		this.setState({ isEnableOtpForm: false });
	};

	renderSuccessContent = () => {
		const { icons: ICONS } = this.props;
		return (
			<div className="success-popup-wrapper">
				<IconTitle
					iconPath={ICONS['CHECK']}
					iconId={'CHECK'}
					stringId="VERIFY_CODE.PASSWORD_CHANGED"
					text={STRINGS['VERIFY_CODE.PASSWORD_CHANGED']}
				/>
				<div className="text-center">
					<EditWrapper
						stringId={STRINGS['VERIFY_CODE.PASSWORD_CHANGED_DESCRIPTION']}
					>
						<span className="fs-14">
							{STRINGS['VERIFY_CODE.PASSWORD_CHANGED_DESCRIPTION']}
						</span>
					</EditWrapper>
				</div>
				<div className="text-center mt-3">
					<EditWrapper stringId={STRINGS['VERIFY_CODE.SECURITY_PROTOCOL']}>
						<span className="fs-14">
							{STRINGS['VERIFY_CODE.SECURITY_PROTOCOL']}
						</span>
					</EditWrapper>
				</div>
				<Button
					onClick={() => this.handleCloseSuccessDialog()}
					className="success-modal-okay-btn"
					label={STRINGS['P2P.OKAY']}
				/>
			</div>
		);
	};

	renderEmailVerify = () => {
		const { icons: ICONS } = this.props;
		return (
			<div className="email-verification-wrapper d-flex flex-column">
				<IconTitle
					iconPath={ICONS['VERIFICATION_EMAIL_NEW']}
					iconId={'VERIFICATION.EMAIL_NEW'}
					stringId="VERIFY_CODE.EMAIL_CONFIRMATION"
					text={STRINGS['VERIFY_CODE.EMAIL_CONFIRMATION']}
				/>
				<div className="mb-4 mt-3 text-center">
					<EditWrapper
						stringId={STRINGS['VERIFY_CODE.EMAIL_CONFIRMATION_DESCRIPTION']}
					>
						<span className="fs-14">
							{STRINGS['VERIFY_CODE.EMAIL_CONFIRMATION_DESCRIPTION']}
						</span>
					</EditWrapper>
				</div>
				<div className="d-flex gap-1 mt-3">
					<Button
						onClick={this.onHandleEmailVerifyClose}
						label={STRINGS['P2P.CANCEL']}
					/>
					<Button
						onClick={this.onCloseDialog}
						label={STRINGS['VERIFY_CODE.ENTER_EMAIL_CODE']}
					/>
				</div>
			</div>
		);
	};

	handleVerifyCodeChange = (idx, value) => {
		const { verifyCode } = this.state;
		const code = verifyCode || Array(7).fill('');
		if (/^[0-9a-zA-Z]?$/.test(value)) {
			const newCode = [...code];
			newCode[idx] = value;
			this.setState({ verifyCode: newCode, error: '' });
			if (value && idx < code.length - 1) {
				const nextInput = document.getElementById(
					`verify-code-input-${idx + 1}`
				);
				if (nextInput) nextInput.focus();
			}
		}
	};

	handleVerifyCodeKeyDown = (idx, e) => {
		const { verifyCode } = this.state;
		const code = verifyCode || Array(7).fill('');
		this.setState({ error: '' });
		if (e.key === 'Backspace') {
			if (!code[idx] && idx > 0) {
				const prevInput = document.getElementById(
					`verify-code-input-${idx - 1}`
				);
				if (prevInput) prevInput.focus();
			}
		} else if (e.key === 'ArrowLeft' && idx > 0) {
			const prevInput = document.getElementById(`verify-code-input-${idx - 1}`);
			if (prevInput) prevInput.focus();
		} else if (e.key === 'ArrowRight' && idx < code.length - 1) {
			const nextInput = document.getElementById(`verify-code-input-${idx + 1}`);
			if (nextInput) nextInput.focus();
		}
	};

	handleVerifyCodePaste = (e, idx) => {
		e.preventDefault();
		let pastedData = e.clipboardData.getData('Text')?.trim();
		if (!pastedData) return;
		pastedData = pastedData?.replace(/[-\s]/g, '');

		const { verifyCode } = this.state;
		const code = verifyCode || Array(7).fill('');
		const newCode = [...code];
		for (let i = 0; i < pastedData?.length && idx + i < code?.length; i++) {
			if (/^[0-9a-zA-Z]$/.test(pastedData[i])) {
				newCode[idx + i] = pastedData[i];
			}
		}

		this.setState({ verifyCode: newCode, error: '' }, () => {
			const nextIndex = idx + pastedData?.length;
			if (nextIndex < code?.length) {
				const nextInput = document.getElementById(
					`verify-code-input-${nextIndex}`
				);
				if (nextInput) nextInput.focus();
			}
		});
	};

	onHandleVerifyCode = async () => {
		const { verifyCode } = this.state;
		const code = verifyCode || Array(7)?.fill('');
		const rawCode = code?.join('')?.trim();
		const prefix = rawCode?.slice(0, 2);
		const numberPart = rawCode?.slice(2);
		const finalCode = `${prefix}-${numberPart}`;

		try {
			await getConfirmationPassword(finalCode);
			this.setState({ isSuccessDialog: true });
			this.handleCloseVerifyCode();
		} catch (err) {
			const errorMessage =
				err?.response?.data?.message || err?.message || 'Error verifying code';
			message.error(errorMessage);
			if (err?.response?.data?.code === 136) {
				this.setState({ error: errorMessage });
			} else {
				this.handleCloseVerifyCode();
			}
		}
	};

	renderVerifyCode = () => {
		const code = this.state?.verifyCode || Array(7).fill('');
		return (
			<div className="verify-code-wrapper">
				<div className="text-center">
					{!this.state.timerExpired ? (
						<IconTitle
							stringId="VERIFY_CODE.TITLE"
							text={STRINGS['VERIFY_CODE.TITLE']}
							iconId="EMAIL_CODE"
							iconPath={this.props.icons['EMAIL_CODE']}
							textType="title"
						/>
					) : (
						<IconTitle
							stringId="VERIFY_CODE.CODE_EXPIRED"
							text={STRINGS['VERIFY_CODE.CODE_EXPIRED']}
							textType="title"
						/>
					)}
				</div>
				<div className="d-flex align-items-center justify-content-between gap-1 timer-wrapper my-3">
					<div className="timer-divider"></div>
					<div className="timer-text">
						{`${
							this.state.timerMinutes
						}:${this.state.timerSeconds?.toString()?.padStart(2, '0')}`}
					</div>
					<div className="timer-divider"></div>
				</div>
				{this.state.timerExpired ? (
					<div className="expired-message-wrapper text-center">
						<div className="expired-message">
							<EditWrapper stringId="VERIFY_CODE.EXPIRED_MESSAGE">
								<span className="fs-14">
									{STRINGS['VERIFY_CODE.EXPIRED_MESSAGE']}
								</span>
							</EditWrapper>
						</div>
						<Button
							label={STRINGS['BACK_TEXT']}
							type="primary"
							className="w-100 mt-3"
							onClick={this.handleCloseVerifyCode}
						/>
					</div>
				) : (
					<>
						<div className="verification-code-fields my-5 d-flex justify-content-center">
							{(code || [])?.map((val, idx) => (
								<div key={idx} className="d-flex align-items-center">
									<input
										id={`verify-code-input-${idx}`}
										key={idx}
										type="text"
										maxLength={1}
										value={val}
										onChange={(e) =>
											this.handleVerifyCodeChange(idx, e.target.value)
										}
										onKeyDown={(e) => this.handleVerifyCodeKeyDown(idx, e)}
										className={`verification-code-input ${
											idx === 1 ? 'mr-3' : ''
										}`}
										onPaste={(e) => this.handleVerifyCodePaste(e, idx)}
										autoFocus={idx === 0}
									/>
									{idx === 1 && (
										<span className="verification-field-divider"></span>
									)}
								</div>
							))}
						</div>
						<div className="text-align-center mb-4">
							<EditWrapper stringId="VERIFY_CODE.DESCRIPTION">
								<span className="fs-14">
									{STRINGS.formatString(
										STRINGS['VERIFY_CODE.DESCRIPTION'],
										<span className="font-weight-bold">
											{this.props.user?.email ||
												STRINGS['HOME.EMAIL_TEXT'].toLowerCase()}
										</span>
									)}
								</span>
							</EditWrapper>
						</div>
						{this.state.error && (
							<span className="fs-14 bold verification-code-error">
								{this.state.error}
							</span>
						)}
						<Button
							label={STRINGS['VERIFY_CODE.VERIFY_CODE_TEXT']}
							type="submit"
							className="w-100 mt-3"
							onClick={this.onHandleVerifyCode}
							disabled={code?.some((c) => !c)}
						/>
					</>
				)}
			</div>
		);
	};

	render() {
		const {
			icons: ICONS,
			openContactForm,
			user: { otp, email, otp_enabled, verification_level },
		} = this.props;

		if (isLoggedIn() && verification_level === 0) {
			return <Loader />;
		}
		const {
			dialogIsOpen,
			modalText,
			activeTab,
			tabs,
			freeze,
			isEnableOtpForm,
			isEmailVerify,
		} = this.state;
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
				{!isMobile ? (
					<HeaderSection
						stringId="ACCOUNTS.TAB_SECURITY"
						title={isMobile && STRINGS['ACCOUNTS.TAB_SECURITY']}
						openContactForm={openContactForm}
					>
						<div className="header-content mt-3">
							<EditWrapper stringId="ACCOUNT_SECURITY.TITLE_TEXT">
								{STRINGS['ACCOUNT_SECURITY.TITLE_TEXT']}
							</EditWrapper>
						</div>
					</HeaderSection>
				) : (
					<div className="header-content">
						<EditWrapper stringId="ACCOUNT_SECURITY.TITLE_TEXT">
							{STRINGS['ACCOUNT_SECURITY.TITLE_TEXT']}
						</EditWrapper>
					</div>
				)}
				<Dialog
					isOpen={dialogIsOpen && !otp.requesting}
					label="security-modal"
					onCloseDialog={() =>
						isEmailVerify
							? this.onHandleEmailVerifyClose()
							: this.onCloseDialog()
					}
					showCloseText={!(otp.error || modalText) || isEmailVerify}
					isEnableOtpForm={isEnableOtpForm}
					onHandleEnableBack={this.onHandleEnableBack}
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

				<Dialog
					isOpen={this.state.isVerifyCode}
					label="verify-code"
					onCloseDialog={this.handleCloseVerifyCode}
					showCloseText={true}
					className="verify-code-modal"
				>
					{this.renderVerifyCode()}
				</Dialog>

				<Dialog
					isOpen={this.state.isSuccessDialog}
					label="success-modal"
					showCloseText={true}
					className="verification-success-modal"
					onCloseDialog={this.handleCloseSuccessDialog}
				>
					{this.renderSuccessContent()}
				</Dialog>

				<NotLoggedIn>
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
					{!isMobile && this.renderContent(tabs, activeTab)}
				</NotLoggedIn>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	logins: state.wallet.logins,
	user: state.user,
	activeLanguage: state.app.language,
	constants: state.app.constants,
	passwordFormValues: passwordSelector(
		state,
		...Object.keys(generateFormValues())
	),
	selectedStep: state.app.selectedStep,
	getSecurityTab: state.app.selectedSecurityTab,
});

const mapDispatchToProps = (dispatch) => ({
	getUserLogins: (limit, page = 1) => dispatch(getUserLogins({ limit, page })),
	requestOTP: () => dispatch(otpRequest()),
	otpSetActivated: (active) => dispatch(otpSetActivated(active)),
	openContactForm: bindActionCreators(openContactForm, dispatch),
	setSelectedStep: bindActionCreators(setSelectedStep, dispatch),
	setSecurityTab: bindActionCreators(setSecurityTab, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(UserSecurity));
