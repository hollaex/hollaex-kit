import React, { Fragment, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { InputNumber, Form, Button, message } from 'antd';
import { connect } from 'react-redux';

import {
	otpRequest,
	otpActivate,
	otpRevoke,
	otpSetActivated,
} from '../../../actions/userAction';

const { Item } = Form;

const AccountSecurity = ({
	user = {},
	constants = {},
	handleNext,
	requestOTP,
	otpSetActivated,
}) => {
	const api_name = constants.api_name || '';
	const app_name = api_name.replace(' ', '').trim() || '';
	useEffect(() => {
		if (!user.otp_enabled) {
			requestOTP();
		}
	}, [requestOTP, user.otp_enabled]);
	useEffect(() => {
		if (!user.otp.requesting && user.otp.error) {
			message.error(user.otp.error);
		}
	}, [user.otp]);
	const handleSubmit = (values) => {
		return otpActivate({ code: values.code.toString() })
			.then((res) => {
				otpSetActivated(true);
				message.success('OTP activated successfully');
				handleNext(2);
			})
			.catch((err) => {
				const _error =
					err.response && err.response.data
						? err.response.data.message
						: err.message;
				message.error(_error);
			});
	};

	const handleDisable = (values) => {
		return otpRevoke({ code: values.code.toString() })
			.then((res) => {
				otpSetActivated(false);
				message.success('OTP disabled successfully');
				handleNext(2);
			})
			.catch((err) => {
				const _error =
					err.response && err.response.data
						? err.response.data.message
						: err.message;
				message.error(_error);
			});
	};

	const open = () => {
		if (window) {
			window.open(
				'https://support.google.com/accounts/answer/1066447?hl=en',
				'_blank'
			);
		}
	};

	return (
		<div className="security-content">
			{user.otp_enabled ? (
				<Fragment>
					<div className="title-text">2FA is already enabled</div>
					<div>Disable 2FA</div>
					<div className="form-wrapper">
						<Form name="security-form" onFinish={handleDisable}>
							<div className="setup-field-wrapper setup-field-content">
								<div className="setup-field-label">2FA code</div>
								<Item name="code">
									<InputNumber placeholder="Enter 6-digit code" maxLength={6} />
								</Item>
							</div>
							<div className="btn-container">
								<Button htmlType="submit">Proceed</Button>
							</div>
							<span className="step-link" onClick={() => handleNext(2)}>
								Skip this step
							</span>
						</Form>
					</div>
				</Fragment>
			) : (
				<Fragment>
					<div className="title-text">Scan this QR code</div>
					<div>
						<QRCode
							value={`otpauth://totp/${app_name}-${user.email}?secret=${user.otp.secret}&issuer=${app_name}`}
							bgColor="#0808df"
							fgColor="#c4c4c4"
						/>
					</div>
					<div>{user.otp.secret ? user.otp.secret : ''}</div>
					<div>
						Don't know what to do?{' '}
						<span className="step-link" onClick={open}>
							Click here for directions.
						</span>
					</div>
					<div className="form-wrapper">
						<Form name="security-form" onFinish={handleSubmit}>
							<div className="setup-field-wrapper setup-field-content">
								<div className="setup-field-label">2FA code</div>
								<Item name="code">
									<InputNumber placeholder="Enter 6-digit code" maxLength={6} />
								</Item>
							</div>
							<div className="btn-container">
								<Button htmlType="submit">Proceed</Button>
							</div>
							<span className="step-link" onClick={() => handleNext(2)}>
								Skip this step
							</span>
						</Form>
					</div>
				</Fragment>
			)}
		</div>
	);
};

const mapStateToProps = (state) => ({
	user: state.user,
	constants: state.app.constants,
});

const mapDispatchToProps = (dispatch) => ({
	requestOTP: () => dispatch(otpRequest()),
	otpSetActivated: (active) => dispatch(otpSetActivated(active)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountSecurity);
