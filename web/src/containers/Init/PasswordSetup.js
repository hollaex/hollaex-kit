import React from 'react';
import { Input, Form, Button, message } from 'antd';
import { ReactSVG } from 'react-svg';

import { adminSignup } from '../../actions/authAction';
import { setExchangeInitialized } from '../../utils/initialize';

const { Item } = Form;

const passwordRegEx = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;

const PasswordSetup = (props) => {
	const handleSubmit = (values) => {
		props.onFieldChange(values.password, 'password');
		props.onChangeStep('retype-password');
	};
	return (
		<div className="setup-container">
			<div className="content info-container">
				<div>
					<ReactSVG src={props.icon} className="email-icon" />
				</div>
				<div className="wrapper">
					<div className="header">Create a memorable password</div>
					<div className="description">
						<div className="desc-warning">
							This password will be unrecoverable upon account creation.
						</div>
						<div>Make sure this password is something you can remember.</div>
					</div>
					<Form name="password-form" onFinish={handleSubmit}>
						<div className="setup-field-wrapper setup-field-content">
							<div className="setup-field-label">Password</div>
							<Item
								name="password"
								rules={[
									{
										required: true,
										message: 'Please input your password!',
									},
									() => ({
										validator(rule, value) {
											if (!value || passwordRegEx.test(value)) {
												return Promise.resolve();
											}
											return Promise.reject(
												'Password must contain at least 8 characters, at least one digit and one special character.'
											);
										},
									}),
								]}
							>
								<Input.Password />
							</Item>
						</div>
						<div className="btn-wrapper">
							<Button onClick={() => props.onChangeStep('email')}>Back</Button>
							<div className="separator"></div>
							<Button htmlType="submit">Proceed</Button>
						</div>
					</Form>
				</div>
			</div>
		</div>
	);
};

export const ReTypePasswordContainer = (props) => {
	const handleSubmit = () => {
		if (props.initialValues) {
			adminSignup(props.initialValues)
				.then((res) => {
					props.setMessage('Account successfully created');
					props.onChangeStep('login');
					setExchangeInitialized(true);
				})
				.catch((error) => {
					let errMsg = '';
					if (error.response) {
						errMsg = error.response.data.message;
					} else {
						errMsg = error.message;
					}
					message.error(errMsg);
				});
		}
	};
	return (
		<div className="setup-container">
			<div className="content info-container">
				<div>
					<ReactSVG src={props.icon} className="email-icon" />
				</div>
				<div className="wrapper">
					<div className="header">Retype your password</div>
					<div className="description">
						<div>
							To make sure your password is correct please type it again.
						</div>
					</div>
					<Form name="retype-password-form" onFinish={handleSubmit}>
						<div className="setup-field-wrapper setup-field-content">
							<div className="setup-field-label">Retype password</div>
							<Item
								name="re-password"
								rules={[
									{
										required: true,
										message: 'Please input your password again!',
									},
									() => ({
										validator(rule, value) {
											if (!value || props.initialValues.password === value) {
												return Promise.resolve();
											}
											return Promise.reject('Password does not match!');
										},
									}),
								]}
							>
								<Input.Password />
							</Item>
						</div>
						<div className="btn-wrapper">
							<Button onClick={() => props.onChangeStep('password')}>
								Back
							</Button>
							<div className="separator"></div>
							<Button htmlType="submit">Proceed</Button>
						</div>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default PasswordSetup;
