import React, { Fragment, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { Form, Button, message, Input } from 'antd';
import { connect } from 'react-redux';

import {
	otpRequest,
	otpActivate,
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
	const handleSubmit = (code) => {
		return otpActivate(code)
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

	const open = () => {
		if (window) {
			window.open(
				'https://support.google.com/accounts/answer/1066447?hl=en',
				'_blank'
			);
		}
	};

	const maxLengthCheck = (object) => {
		if (object.target.value.length > object.target.maxLength) {
			object.target.value = object.target.value.slice(0, object.target.maxLength)
		}
	};

	return (
		<div className="security-content h-100">
			{user.otp_enabled ? (
				<Fragment>
					<div className="form-wrapper d-flex flex-direction-column h-100 mt-0 content-center">
						<div className="title-text">2FA is already enabled</div>
						<div className="btn-container">
							<Button onClick={() => handleNext(2)}>Proceed</Button>
						</div>
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
								<Item
									name="code"
									rules={[
										{ required: true, message: 'Please input your 2FA code!' },
									]}
									className="number_input-wrapper"
								>
									<Input
										type='number'
										placeholder="Enter 6-digit code"
										maxLength="6"
										onInput={maxLengthCheck}
									/>
								</Item>
							</div>
							<div className="btn-container">
								<Button htmlType="submit">Proceed</Button>
							</div>
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
