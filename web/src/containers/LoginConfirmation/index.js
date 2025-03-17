import React, { Component } from 'react';
import classnames from 'classnames';

import { IconTitle, Button, Loader } from 'components';
import { performConfirmLogin } from './actions/loginConfirmation';
import { FLEX_CENTER_CLASSES } from 'config/constants';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { EditWrapper } from 'components';
import { Button as AntBtn, message } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import './_loginConfirmation.scss';
import queryString from 'query-string';

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
		return performConfirmLogin(token, this.state.freeze_account)
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
	};

	handleTransaction = () => {
		this.props.router.push('/login');
	};

	render() {
		const { is_success, error_txt, loading, confirm } = this.state;
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
				<div style={{ display: 'flex', gap: '10px' }}>
					{Array.from({ length: 6 }).map((_, index) => (
						<input
							key={index}
							id={`otp-input-${index}`}
							type="text"
							maxLength="1"
							style={{
								width: '40px',
								height: '40px',
								textAlign: 'center',
								fontSize: '20px',
								border: '1px solid #ccc',
								borderRadius: '5px',
								outline: 'none',
								transition: 'border 0.2s',
								color: 'black',
							}}
							onChange={(e) => handleChange(e, index)}
							onFocus={(e) => (e.target.style.borderColor = '#007BFF')}
							onBlur={(e) => (e.target.style.borderColor = '#ccc')}
						/>
					))}
				</div>
			);
		};

		if (!confirm) {
			childProps = {
				child: (
					<div className="login-confirm-option">
						<div
							style={{
								fontSize: 22,
								color: 'white',
								marginTop: 10,
								marginBottom: 10,
							}}
						>
							{this.state.freeze_account ? (
								<EditWrapper stringId="LOGIN_CONFIRMATION.FREEZE_CONFIRM_FINAL">
									{STRINGS['LOGIN_CONFIRMATION.FREEZE_CONFIRM_FINAL']}
								</EditWrapper>
							) : (
								<EditWrapper stringId="LOGIN_CONFIRMATION.LOGIN_CONFIRM_FINAL">
									{STRINGS['LOGIN_CONFIRMATION.LOGIN_CONFIRM_FINAL']}
								</EditWrapper>
							)}
						</div>
						<div>
							{this.state.freeze_account ? (
								<EditWrapper stringId="LOGIN_CONFIRMATION.FREEZE_CONFIRM_WARNING">
									{STRINGS['LOGIN_CONFIRMATION.FREEZE_CONFIRM_WARNING']}
								</EditWrapper>
							) : (
								<EditWrapper stringId="LOGIN_CONFIRMATION.LOGIN_CONFIRM_WARNING">
									{STRINGS['LOGIN_CONFIRMATION.LOGIN_CONFIRM_WARNING']}
								</EditWrapper>
							)}
						</div>

						<div>
							{this.state.prompt && (
								<div
									style={{
										textAlign: 'center',
										marginTop: 10,
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									{OTPInput()}
								</div>
							)}
						</div>

						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								gap: 15,
								justifyContent: 'space-between',
								marginTop: 30,
							}}
						>
							<AntBtn
								onClick={() => {
									this.handleTransaction();
								}}
								style={{
									backgroundColor: '#5D63FF',
									color: 'white',
									flex: 1,
									height: 35,
									borderWidth: 0,
								}}
								type="default"
							>
								<EditWrapper stringId="LOGIN_CONFIRMATION.LOGIN_CANCEL_BUTTON">
									{STRINGS['LOGIN_CONFIRMATION.LOGIN_CANCEL_BUTTON']}
								</EditWrapper>
							</AntBtn>
							<AntBtn
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
								style={{
									backgroundColor: '#5D63FF',
									color: 'white',
									flex: 2,
									height: 35,
									borderWidth: 0,
								}}
								type="default"
							>
								{this.state.freeze_account ? (
									<EditWrapper stringId="LOGIN_CONFIRMATION.FREEZE_CONFIRM_BUTTON">
										{STRINGS['LOGIN_CONFIRMATION.FREEZE_CONFIRM_BUTTON']}
									</EditWrapper>
								) : (
									<EditWrapper stringId="LOGIN_CONFIRMATION.LOGIN_CONFIRM_BUTTON">
										{STRINGS['LOGIN_CONFIRMATION.LOGIN_CONFIRM_BUTTON']}
									</EditWrapper>
								)}
							</AntBtn>
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
				titleSection: {
					iconId: 'RED_WARNING',
					iconPath: ICONS['RED_WARNING'],
					stringId: 'ERROR_TEXT',
					text: STRINGS['ERROR_TEXT'],
				},
				child: (
					<div className="text-center mb-4">
						<div>{error_txt}</div>
					</div>
				),
			};
		} else {
			childProps = {
				titleSection: {
					iconId: 'GREEN_CHECK',
					iconPath: ICONS['GREEN_CHECK'],
					stringId: 'SUCCESS_TEXT',
					text: STRINGS['SUCCESS_TEXT'],
				},
				useSvg: true,
				child: (
					<div className="text-center mb-4">
						{this.state.freeze_account ? (
							<div>
								<EditWrapper stringId="LOGIN_CONFIRMATION.FREEZE_CONFIRM_SUCCESS_1">
									{STRINGS['LOGIN_CONFIRMATION.FREEZE_CONFIRM_SUCCESS_1']}
								</EditWrapper>
							</div>
						) : (
							<>
								<div>
									<EditWrapper stringId="LOGIN_CONFIRMATION.LOGIN_CONFIRM_SUCCESS_1">
										{STRINGS['LOGIN_CONFIRMATION.LOGIN_CONFIRM_SUCCESS_1']}
									</EditWrapper>
								</div>
								<div>
									<EditWrapper stringId="LOGIN_CONFIRMATION.LOGIN_CONFIRM_SUCCESS_2">
										{STRINGS['LOGIN_CONFIRMATION.LOGIN_CONFIRM_SUCCESS_2']}
									</EditWrapper>
								</div>
							</>
						)}
					</div>
				),
			};
		}
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
					<IconTitle
						textType="title"
						className="w-100"
						{...childProps.titleSection}
					/>
					{childProps.child}
					{!loading && confirm && (
						<Button
							className="w-50"
							stringId="LOGIN_CONFIRMATION.GO_LOGIN_HISTORY"
							label={STRINGS['LOGIN_CONFIRMATION.GO_LOGIN_HISTORY']}
							onClick={this.handleTransaction}
						/>
					)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (store) => ({
	coins: store.app.coins,
});

export default connect(mapStateToProps)(withRouter(withConfig(ConfirmLogin)));
