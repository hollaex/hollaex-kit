import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { SubmissionError, change, stopSubmit, reset } from 'redux-form';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import { isMobile } from 'react-device-detect';
import { message } from 'antd';
import { setPricesAndAssetPending } from 'actions/assetActions';
import {
	performLogin,
	storeLoginResult,
	setLogoutMessage,
	performGoogleLogin,
} from 'actions/authAction';
import LoginForm, { FORM_NAME } from './LoginForm';
import {
	Dialog,
	OtpForm,
	IconTitle,
	Notification,
	EditWrapper,
} from 'components';
import { NOTIFICATIONS } from 'actions/appActions';
import { errorHandler } from 'components/OtpForm/utils';
import { FLEX_CENTER_CLASSES } from 'config/constants';

import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import GoogleOAuthLogin from 'utils/googleOAuth';
import CloudflareTurnstile from 'components/CloudflareTurnstile';

let errorTimeOut = null;

const BottomLink = () => (
	<div className="text-align-center">
		<div className={classnames('f-1', 'link_wrapper')}>
			{STRINGS['LOGIN.NO_ACCOUNT']}
			<Link to="/signup" className={classnames('blue-link')}>
				{STRINGS['LOGIN.CREATE_ACCOUNT']}
			</Link>
		</div>

		<div className={classnames('f-1', 'link_wrapper')}>
			{STRINGS['LOGIN.LOOKING_PRICES']}
			<Link to="/markets" className={classnames('blue-link')}>
				{STRINGS['LOGIN.VIEW_MARKETS']}
			</Link>
		</div>
	</div>
);

class Login extends Component {
	state = {
		values: {},
		otpDialogIsOpen: false,
		logoutDialogIsOpen: false,
		termsDialogIsOpen: false,
		depositDialogIsOpen: false,
		token: '',
		turnstileNonce: 0,
		captchaToken: '',
	};

	componentDidMount() {
		if (this.props.logoutMessage) {
			this.setState({ logoutDialogIsOpen: true });
		}
	}
	UNSAFE_componentWillReceiveProps(nextProps) {
		if (
			nextProps.logoutMessage &&
			nextProps.logoutMessage !== this.props.logoutMessage
		) {
			this.setState({ logoutDialogIsOpen: true });
		}
	}

	componentWillUnmount() {
		this.props.setLogoutMessage();
		if (errorTimeOut) {
			clearTimeout(errorTimeOut);
		}
	}

	redirectToHome = () => {
		this.props.router.replace('/account');
	};

	redirectToResetPassword = () => {
		this.props.router.replace('/reset-password');
	};

	redirectToService = (url) => {
		window.location.href = `https://${url}`;
	};

	resetCaptcha = () => {
		// Clear the stored captcha token and remount the Turnstile widget to force a fresh token
		this.props.change(FORM_NAME, 'captcha', '');
		this.setState({ captchaToken: '' });
		this.setState((prevState) => ({
			turnstileNonce: (prevState.turnstileNonce || 0) + 1,
		}));
	};

	getServiceParam = () => {
		let service = '';
		if (
			this.props.location &&
			this.props.location.query &&
			this.props.location.query.service
		) {
			service = this.props.location.query.service;
		} else if (
			window.location &&
			window.location.search &&
			window.location.search.includes('service')
		) {
			service = window.location.search.split('?service=')[1];
		}
		return service;
	};

	// checkLogin = () => {
	// 	// const termsAccepted = localStorage.getItem('termsAccepted');
	// 	// if (!termsAccepted) {
	// 	// 	this.setState({ termsDialogIsOpen: true });
	// 	// } else {
	// 		this.redirectToHome();
	// 	// }
	// };

	onSubmitLogin = (values) => {
		const turnstileSiteKey = this.props.constants?.cloudflare_turnstile
			?.site_key;
		const turnstileEnabled = !!turnstileSiteKey && turnstileSiteKey !== 'null';
		if (turnstileEnabled && !values?.captcha) {
			throw new SubmissionError({ _error: STRINGS['INVALID_CAPTCHA'] });
		}

		const service = this.getServiceParam();
		if (service) {
			values.service = service;
		}
		return performLogin(values)
			.then((res) => {
				if (res.data.token) this.setState({ token: res.data.token });
				this.props.setPricesAndAssetPending();
				// if ((!Object.keys(this.props.info).length) || (!this.props.info.active)
				// 	|| (this.props.info.is_trial && this.props.info.active
				// 		&& moment().diff(this.props.info.created_at, 'seconds') > EXCHANGE_EXPIRY_SECONDS))
				// 	this.checkExpiryExchange();
				// else
				if (res.data && res.data.callbackUrl)
					this.redirectToService(res.data.callbackUrl);
				else this.redirectToHome();
			})
			.catch((err) => {
				const _error =
					err.response && err.response.data
						? err.response.data.message
						: err.message;

				let error = {};

				if (_error.toLowerCase().indexOf('otp') > -1) {
					// A POST /login was made, always refresh captcha token for the next request
					this.resetCaptcha();
					// Ensure OTP form opens in a clean state (no stale error message)
					this.props.reset('OtpForm');
					this.props.stopSubmit('OtpForm', {});
					const { captcha, ...rest } = values || {};
					this.setState({ values: rest, otpDialogIsOpen: true });
					error._error = STRINGS['VALIDATIONS.OTP_LOGIN'];
				} else {
					// For any non-OTP error, force a fresh Turnstile token for the next attempt
					this.resetCaptcha();
					if (_error === 'User is not activated') {
						error._error = STRINGS['VALIDATIONS.FROZEN_ACCOUNT'];
					} else {
						error._error = _error;
					}
					if (
						_error
							.toLowerCase()
							?.includes('suspicious login detected, please check your email')
					) {
						this.props.router.replace('/email-confirm');
					}
					throw new SubmissionError(error);
				}
			});
	};

	onSubmitLoginOtp = (values) => {
		return performLogin(
			Object.assign(
				{ otp_code: values.otp_code, captcha: this.state.captchaToken },
				this.state.values
			)
		)
			.then((res) => {
				this.setState({ otpDialogIsOpen: false });
				if (res.data.token) this.setState({ token: res.data.token });
				this.props.setPricesAndAssetPending();
				// if ((!Object.keys(this.props.info).length) || (!this.props.info.active)
				// 	|| (this.props.info.is_trial && this.props.info.active
				// 		&& moment().diff(this.props.info.created_at, 'seconds') > EXCHANGE_EXPIRY_SECONDS))
				// 	this.checkExpiryExchange();
				// else
				if (res.data && res.data.callbackUrl)
					this.redirectToService(res.data.callbackUrl);
				else this.redirectToHome();
			})
			.catch((err) => {
				const data = err?.response?.data || {};
				const code = data?.code;
				const _error = data?.message || err?.message;
				const turnstileSiteKey = this.props.constants?.cloudflare_turnstile
					?.site_key;
				const turnstileEnabled =
					!!turnstileSiteKey && turnstileSiteKey !== 'null';

				// A POST /login was made, always refresh captcha token for the next request
				this.resetCaptcha();

				// Wrong OTP: keep the OTP dialog open and show the error there.
				// (Do not close the dialog for code 52.)
				if (Number(code) === 52) {
					return errorHandler(err);
				}

				// If credentials are wrong (even if OTP was correct), take user back to login form.
				const credentialErrorCodes = new Set([22, 23, 24, 25, 26, 27]);
				const isCaptchaError =
					typeof _error === 'string' &&
					_error.toLowerCase().includes('captcha');

				if (credentialErrorCodes.has(Number(code)) || isCaptchaError) {
					this.setState({ otpDialogIsOpen: false, values: {} });
					// Clear OTP inputs + login password field so user can re-enter safely
					this.props.reset('OtpForm');
					this.props.stopSubmit('OtpForm', {});
					this.props.change(FORM_NAME, 'password', '');
					this.resetCaptcha();
					this.props.stopSubmit(FORM_NAME, { _error });
					throw new SubmissionError({ _error });
				}

				// When Turnstile is enabled, tokens are effectively single-use. Any server error
				// during OTP submit should force a fresh captcha token for the next attempt.
				if (turnstileEnabled) {
					this.setState({ otpDialogIsOpen: false });
					this.props.reset('OtpForm');
					this.props.stopSubmit('OtpForm', {});
					this.resetCaptcha();
					this.props.stopSubmit(FORM_NAME, { _error });
					throw new SubmissionError({ _error });
				}

				return errorHandler(err);
			});
	};

	onAcceptTerms = () => {
		localStorage.setItem('termsAccepted', true);
		if (this.state.token) storeLoginResult(this.state.token);
		this.setState({ termsDialogIsOpen: false });
		this.redirectToHome();
	};

	onCloseDialog = () => {
		this.setState({ otpDialogIsOpen: false });
		this.props.reset('OtpForm');
		this.props.stopSubmit('OtpForm', {});
	};

	onCloseLogoutDialog = () => {
		this.props.setLogoutMessage();
		this.setState({ logoutDialogIsOpen: false });
	};

	gotoWallet = () => {
		this.props.router.replace('/wallet');
		this.setState({ depositDialogIsOpen: false });
		localStorage.setItem('deposit_initial_display', true);
	};

	handleGoogleLogin = async (token) => {
		try {
			const res = await performGoogleLogin({ google_token: token });
			if (res?.data?.token) this.setState({ token: res?.data?.token });
			this.props.setPricesAndAssetPending();
			storeLoginResult(res?.data?.token);
			if (res?.data?.callbackUrl) {
				this.redirectToService(res?.data?.callbackUrl);
			} else {
				this.redirectToHome();
			}
		} catch (err) {
			const _error =
				err.response && err.response.data
					? err.response.data.message
					: err.message;

			let error = {};

			if (_error === 'User is not activated') {
				error._error = STRINGS['VALIDATIONS.FROZEN_ACCOUNT'];
			} else {
				error._error = _error;
			}
			if (
				_error
					?.toLowerCase()
					?.includes('suspicious login detected, please check your email')
			) {
				this.props.router.replace('/email-confirm');
			}
			message.error(error?._error);
		}
	};

	render() {
		const {
			logoutMessage,
			activeTheme,
			constants = {},
			icons: ICONS,
		} = this.props;
		const { otpDialogIsOpen, logoutDialogIsOpen } = this.state;
		const turnstileSiteKey = constants?.cloudflare_turnstile?.site_key;
		const turnstileEnabled = !!turnstileSiteKey && turnstileSiteKey !== 'null';

		return (
			<div className={classnames(...FLEX_CENTER_CLASSES, 'flex-column', 'f-1')}>
				<div
					className={classnames(
						...FLEX_CENTER_CLASSES,
						'flex-column',
						'auth_wrapper',
						'login-wrapper',
						'w-100'
					)}
				>
					<IconTitle
						stringId="LOGIN_TEXT"
						text={STRINGS['LOGIN_TEXT']}
						textType="title"
						underline={true}
						className="w-100 holla-logo login-text"
						imageWrapperClassName="auth_logo-wrapper"
						subtitle={STRINGS.formatString(
							STRINGS['LOGIN.LOGIN_TO'],
							constants.api_name || ''
						)}
						actionProps={{
							stringId: 'LOGIN.CANT_LOGIN',
							text: STRINGS['LOGIN.CANT_LOGIN'],
							iconId: 'BLUE_ARROW_RIGHT',
							iconPath: ICONS['BLUE_ARROW_RIGHT'],
							onClick: this.redirectToResetPassword,
							useSvg: true,
							showActionText: true,
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
						<LoginForm
							onSubmit={this.onSubmitLogin}
							theme={activeTheme}
							turnstileEnabled={turnstileEnabled}
							extraContent={
								turnstileEnabled ? (
									<CloudflareTurnstile
										key={`turnstile-${this.state.turnstileNonce}`}
										siteKey={turnstileSiteKey}
										theme={activeTheme}
										onToken={(token) => {
											this.setState({ captchaToken: token });
											this.props.change(FORM_NAME, 'captcha', token);
										}}
									/>
								) : null
							}
						/>
						{isMobile && <BottomLink />}
					</div>
					{!!constants?.google_oauth?.client_id && (
						<div className="google-oauth-button-wrapper">
							<EditWrapper stringId="LOGIN.GOOGLE_LOGIN">
								<span>
									{STRINGS.formatString(
										STRINGS['LOGIN.GOOGLE_LOGIN'],
										STRINGS['LOGIN_TEXT']
									)}
								</span>
							</EditWrapper>
							<GoogleOAuthLogin
								onLoginSuccess={this.handleGoogleLogin}
								googleOAuth={constants?.google_oauth}
							/>
						</div>
					)}
				</div>
				{!isMobile && <BottomLink />}
				<Dialog
					isOpen={otpDialogIsOpen || logoutDialogIsOpen}
					label="otp-modal"
					onCloseDialog={this.onCloseDialog}
					shouldCloseOnOverlayClick={otpDialogIsOpen ? false : true}
					showCloseText={otpDialogIsOpen ? true : false}
					className="login-dialog"
					useFullScreen={isMobile}
					showBar={otpDialogIsOpen}
				>
					{otpDialogIsOpen && <OtpForm onSubmit={this.onSubmitLoginOtp} />}
					{logoutDialogIsOpen && (
						<Notification
							type={NOTIFICATIONS.LOGOUT}
							onClose={this.onCloseLogoutDialog}
							data={{ message: logoutMessage }}
						/>
					)}
					{/* {termsDialogIsOpen && <TermsOfService onAcceptTerms={this.onAcceptTerms} />} */}
					{/* {depositDialogIsOpen && <DepositFunds gotoWallet={this.gotoWallet} />} */}
				</Dialog>
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	activeTheme: store.app.theme,
	logoutMessage: store.auth.logoutMessage,
	info: store.app.info,
	constants: store.app.constants,
});

const mapDispatchToProps = (dispatch) => ({
	setLogoutMessage: bindActionCreators(setLogoutMessage, dispatch),
	change: bindActionCreators(change, dispatch),
	stopSubmit: bindActionCreators(stopSubmit, dispatch),
	reset: bindActionCreators(reset, dispatch),
	setPricesAndAssetPending: bindActionCreators(
		setPricesAndAssetPending,
		dispatch
	),
});

export default connect(mapStateToProps, mapDispatchToProps)(withConfig(Login));
