import React, { Component } from 'react';
import { Icon } from 'antd';
import { loadReCaptcha } from 'react-recaptcha-v3';
import { CAPTCHA_SITEKEY } from '../../../config/constants';

import { performLogin } from './actions';
import { setToken, removeToken, isUser } from '../../../utils';
import './index.css';

import { AdminHocForm } from '../../../components';
import {
	validateRequired,
	validateOTP
} from '../../../components/AdminForm/validations';

const Form = AdminHocForm('LOGIN_FORM', 'login-form');

export default class Login extends Component {
	componentWillMount = () => {
		loadReCaptcha(CAPTCHA_SITEKEY);
	}

	onSubmit = (values) => {
		return performLogin(values)
			.then((body) => {
				setToken(body.token, values.email);
				if (!isUser()) {
					this.props.history.replace('/');
				} else {
					removeToken();
					setTimeout(() => {
						this.props.history.replace('/');
					}, 500);
					throw { data: { message: 'user not authorized' } };
				}
			})
			.catch((err) => {
				console.log(err.data);
				setTimeout(() => {
					this.props.history.replace('/');
				}, 1500);
				// throw new SubmissionError({ _error: err.data.message })
			});
	};

	render() {
		return (
			<div className="login_page">
				<Form
					onSubmit={this.onSubmit}
					buttonText="Login"
					fields={{
						email: {
							type: 'input',
							placeholder: 'Email',
							validate: [validateRequired],
							prefix: <Icon type="user" />
						},
						password: {
							type: 'password',
							placeholder: 'Password',
							validate: [validateRequired],
							prefix: <Icon type="lock" />
						},
						otp_code: {
							type: 'string',
							placeholder: 'OTP Code',
							validate: [validateOTP],
							prefix: <Icon type="key" />
						},
						captcha: {
							type: 'captcha',
							validate: [validateRequired]
						}
					}}
				/>
			</div>
		);
	}
}
