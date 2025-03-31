import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router';
import { isMobile } from 'react-device-detect';
import { Input, message } from 'antd';

import classnames from 'classnames';
import STRINGS from 'config/localizedStrings';
import queryString from 'query-string';
import withConfig from 'components/ConfigProvider/withConfig';
import HelpfulResourcesForm from 'containers/HelpfulResourcesForm';
import { Button, Loader, Dialog, Image } from 'components';
import {
	performConfirmLogin,
	freezeAccount,
} from './actions/loginConfirmation';
import { FLEX_CENTER_CLASSES } from 'config/constants';
import { EditWrapper } from 'components';
import './_loginConfirmation.scss';

class ConfirmLogin extends Component {
	state = {
		is_success: false,
		error_txt: '',
		loading: false,
		confirm: false,
		token: '',
		inputToken: '',
		prompt: false,
		freeze_account: false,
		isHelpFulResource: false,
	};

	componentDidMount() {
		const { token, prompt, freeze_account } = queryString.parse(
			window.location.search
		);
		this.setState({
			token,
			prompt: prompt === 'true' ? true : false,
			freeze_account: freeze_account === 'true' ? true : false,
		});
	}

	confirmLogin = () => {
		this.setState({ loading: true });
		const token = this.state.prompt ? this.state.inputToken : this.state.token;
		if (this.state.freeze_account) {
			return freezeAccount(token)
				.then((response) => {
					this.setState({ is_success: true, error_txt: '', loading: false });
					return response;
				})
				.catch((err) => {
					this.setState({
						is_success: false,
						error_txt: err.response.data.message || err.message,
						loading: false,
					});
				});
		} else {
			return performConfirmLogin(token)
				.then((response) => {
					this.setState({ is_success: true, error_txt: '', loading: false });
					return response;
				})
				.catch((err) => {
					this.setState({
						is_success: false,
						error_txt: err.response.data.message || err.message,
						loading: false,
					});
				});
		}
	};

	onHandleContactUs = () => {
		this.setState({ isHelpFulResource: true });
	};

	onHandleNavigate = () => {
		this.props.router.push('/login');
	};

	onCloseDialog = () => {
		this.setState({ isHelpFulResource: false });
	};

	render() {
		const {
			is_success,
			error_txt,
			loading,
			confirm,
			freeze_account,
			isHelpFulResource,
		} = this.state;
		const { icons: ICONS } = this.props;
		let childProps = {};

		const OTPInput = () => {
			const handleChange = (e, index) => {
				const value = e.target.value;
				if (/[^0-9]/.test(value)) return;

				const newOtp = [...this.state.inputToken];
				newOtp[index] = value;
				this.setState({ inputToken: newOtp.join('') });

				const nextInput = document.getElementById(`otp-input-${index + 1}`);
				if (nextInput) {
					nextInput.focus();
				}
			};
			return (
				<div className="otp-container">
					{Array.from({ length: 6 }).map((_, index) => (
						<Input
							key={index}
							id={`otp-input-${index}`}
							type="text"
							maxLength="1"
							onChange={(e) => handleChange(e, index)}
							className="otp-checkbox"
						/>
					))}
				</div>
			);
		};

		if (!confirm) {
			childProps = {
				titleIcon: {
					iconId: freeze_account
						? 'CONFIRM_FREEZE_ICON'
						: 'SIDEBAR_ACCOUNT_INACTIVE',
					icon:
						ICONS[
							freeze_account
								? 'CONFIRM_FREEZE_ICON'
								: 'SIDEBAR_ACCOUNT_INACTIVE'
						],
					wrapperClassName: freeze_account ? '' : 'confirm-login-icon',
				},
				titleContent: {
					stringId: 'LOGIN_CONFIRMATION.LOGIN_CONFIRM_BUTTON',
					text:
						STRINGS[
							freeze_account
								? 'LOGIN_CONFIRMATION.CONFIRM_FREEZE_TITLE'
								: 'LOGIN_CONFIRMATION.LOGIN_CONFIRM_BUTTON'
						],
				},
				child: (
					<div className="login-confirm-option">
						<div className="confirm-warning-description">
							{this.state.freeze_account ? (
								<div className="description-text">
									<EditWrapper stringId="LOGIN_CONFIRMATION.FREEZE_CONFIRM_WARNING">
										<span>
											{STRINGS['LOGIN_CONFIRMATION.FREEZE_CONFIRM_WARNING']}
										</span>
									</EditWrapper>
									<EditWrapper stringId="LOGIN_CONFIRMATION.CONFIRM_WARNING_FREEZE_DESC">
										<span className="font-weight-bold">
											{
												STRINGS[
													'LOGIN_CONFIRMATION.CONFIRM_WARNING_FREEZE_DESC'
												]
											}
										</span>
									</EditWrapper>
								</div>
							) : (
								<div className="description-text">
									<EditWrapper stringId="LOGIN_CONFIRMATION.LOGIN_CONFIRM_WARNING">
										{STRINGS['LOGIN_CONFIRMATION.LOGIN_CONFIRM_WARNING']}
									</EditWrapper>
								</div>
							)}
						</div>

						<div>
							{this.state.prompt && (
								<div className="otp-checkbox-wrapper">{OTPInput()}</div>
							)}
						</div>

						<div className="button-container">
							{!this.state.freeze_account && (
								<Button
									onClick={() => {
										this.onHandleContactUs();
									}}
									label={STRINGS['CONTACT_US_TEXT'].toUpperCase()}
									className="confirm-btn"
								></Button>
							)}
							<Button
								onClick={async () => {
									if (this.state.prompt && this.state.inputToken.length !== 6) {
										message.error(
											STRINGS['LOGIN_CONFIRMATION.LOGIN_INPUT_CODE']
										);
										return;
									}
									this.setState({ confirm: true });
									this.confirmLogin();
								}}
								label={
									this.state.freeze_account
										? STRINGS['LOGIN_CONFIRMATION.FREEZE_CONFIRM_BUTTON']
										: STRINGS[
												'LOGIN_CONFIRMATION.LOGIN_CONFIRM_BUTTON'
										  ]?.toUpperCase()
								}
								className="confirm-btn"
							></Button>
						</div>
					</div>
				),
			};
		} else if (loading) {
			childProps = {
				loading,
				child: <Loader relative={true} background={false} />,
			};
		} else if (!is_success && error_txt) {
			childProps = {
				titleIcon: {
					iconId: 'RED_WARNING',
					icon: ICONS['RED_WARNING'],
				},
				titleContent: {
					stringId: 'ERROR_TEXT',
					text: STRINGS['ERROR_TEXT'],
				},
				child: (
					<div className="text-center mt-3 confirm-warning-description">
						<div className="description-text">{error_txt}</div>
						<div className="button-container">
							<Button
								onClick={() => this.onHandleNavigate()}
								label={STRINGS['LOGOUT_ERROR_LOGIN_AGAIN']?.toUpperCase()}
								className="confirm-btn"
							></Button>
						</div>
					</div>
				),
			};
		} else {
			childProps = {
				titleIcon: {
					iconId: freeze_account ? 'FROZEN_ICON' : 'SIDEBAR_ACCOUNT_INACTIVE',
					icon:
						ICONS[freeze_account ? 'FROZEN_ICON' : 'SIDEBAR_ACCOUNT_INACTIVE'],
					wrapperClassName: freeze_account
						? 'confirm-freeze-icon'
						: 'confirm-login-icon',
				},
				titleContent: {
					stringId: freeze_account
						? 'LOGIN_CONFIRMATION.ACCOUNT_FROZEN'
						: 'LOGIN_CONFIRMATION.ACCOUNT_CONFIRMED',
					text:
						STRINGS[
							freeze_account
								? 'LOGIN_CONFIRMATION.ACCOUNT_FROZEN'
								: 'LOGIN_CONFIRMATION.ACCOUNT_CONFIRMED'
						],
				},
				useSvg: true,
				child: (
					<div className="mt-3 login-confirm-option">
						<div className="confirm-warning-description">
							{this.state.freeze_account ? (
								<div className="description-text">
									<EditWrapper stringId="LOGIN_CONFIRMATION.FREEZE_CONFIRM_SUCCESS_1">
										{STRINGS['LOGIN_CONFIRMATION.FREEZE_CONFIRM_SUCCESS_1']}
									</EditWrapper>
									<EditWrapper stringId="LOGIN_CONFIRMATION.FREEZE_CONFIRM_SUCCESS_2">
										<span className="font-weight-bold">
											{STRINGS['LOGIN_CONFIRMATION.FREEZE_CONFIRM_SUCCESS_2']}
										</span>
									</EditWrapper>
								</div>
							) : (
								<>
									<div className="description-text">
										<EditWrapper stringId="LOGIN_CONFIRMATION.LOGIN_CONFIRM_SUCCESS_1">
											{STRINGS['LOGIN_CONFIRMATION.LOGIN_CONFIRM_SUCCESS_1']}
										</EditWrapper>
										<EditWrapper stringId="LOGIN_CONFIRMATION.LOGIN_CONFIRM_SUCCESS_2">
											<span className="font-weight-bold">
												{STRINGS['LOGIN_CONFIRMATION.LOGIN_CONFIRM_SUCCESS_2']}
											</span>
										</EditWrapper>
									</div>
								</>
							)}
						</div>
						<div className="button-container">
							<Button
								onClick={() =>
									freeze_account
										? this.onHandleContactUs()
										: this.onHandleNavigate()
								}
								label={STRINGS[
									freeze_account
										? 'CONTACT_US_TEXT'
										: 'LOGOUT_ERROR_LOGIN_AGAIN'
								]?.toUpperCase()}
								className="confirm-btn"
							></Button>
						</div>
					</div>
				),
			};
		}

		const BottomLink = () => (
			<>
				<div className={classnames('f-1', 'link_wrapper')}>
					{STRINGS['SIGN_UP.HAVE_ACCOUNT']}
					<Link to="/login" className={classnames('blue-link')}>
						{STRINGS['SIGN_UP.GOTO_LOGIN']}
					</Link>
				</div>
				<div className={classnames('f-1', 'link_wrapper')}>
					{STRINGS['LOGIN.NO_ACCOUNT']}
					<Link to="/signup" className={classnames('blue-link')}>
						{STRINGS['LOGIN.CREATE_ACCOUNT']}
					</Link>
				</div>
			</>
		);

		return (
			<div
				className={classnames(
					...FLEX_CENTER_CLASSES,
					'flex-column',
					'f-1',
					'login-confirm-warpper'
				)}
			>
				<div
					className={classnames(
						...FLEX_CENTER_CLASSES,
						'flex-column',
						'w-100',
						{ auth_wrapper: !loading }
					)}
				>
					{childProps?.titleIcon && (
						<div className="login-security-icon-wrapper">
							<Image
								textType="title"
								className="w-100"
								{...childProps.titleIcon}
							/>
							{confirm && !freeze_account && !error_txt && (
								<Image
									icon={ICONS['GREEN_CHECK']}
									wrapperClassName="success-icon"
								/>
							)}
						</div>
					)}
					{childProps?.titleContent && (
						<EditWrapper stringId={childProps?.titleContent?.stringId}>
							<span className="login-title">
								{STRINGS[childProps?.titleContent?.stringId]}
							</span>
						</EditWrapper>
					)}
					{childProps?.titleIcon && <div className="line-separator mt-3"></div>}
					{childProps.child}
				</div>
				{!isMobile && <BottomLink />}
				<Dialog
					isOpen={!!isHelpFulResource}
					onCloseDialog={this.onCloseDialog}
					className={isMobile ? 'login-confirm-contact-popup-wrapper' : ''}
					label="login-confirm-helpful-resource"
				>
					<HelpfulResourcesForm
						onSubmitSuccess={this.onCloseDialog}
						onClose={this.onCloseDialog}
					/>
				</Dialog>
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	coins: store.app.coins,
});

export default connect(mapStateToProps)(withRouter(withConfig(ConfirmLogin)));
