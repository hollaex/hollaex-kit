import React, { useEffect } from 'react';
import { message } from 'antd';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { ReactSVG } from 'react-svg';
import { change } from 'redux-form';
import { bindActionCreators } from 'redux';

import { AdminHocForm } from '../../components';
import { performLogin } from '../../actions/authAction';
import {
	validateRequired,
	email,
} from '../../components/AdminForm/validations';
import { STATIC_ICONS } from 'config/icons';
import { getLanguage } from '../../utils/string';
import { getExchangeInitialized } from '../../utils/initialize';
import { isAdmin } from '../../utils/token';

const LoginForm = AdminHocForm(
	'LOGIN_FORM',
	'setup-field-wrapper setup-field-content'
);

const Login = (props) => {
	useEffect(() => {
		const initialized = getExchangeInitialized();
		if (
			initialized === 'false' ||
			(typeof initialized === 'boolean' && !initialized)
		) {
			browserHistory.push('/init');
		}
	}, []);

	const handleSubmit = (values) => {
		if (values) {
			const formProps = { ...values };
			if (formProps.otp_code) {
				formProps.otp_code = formProps.otp_code.toString();
			}
			performLogin(formProps)
				.then((res) => {
					if (isAdmin()) {
						browserHistory.push('/admin');
					} else {
						browserHistory.push('/account');
					}
				})
				.catch((error) => {
					let errMsg = '';
					if (error.response) {
						errMsg = error.response.data.message;
					} else {
						errMsg = error.message;
					}
					setTimeout(() => {
						props.change('LOGIN_FORM', 'captcha', '');
					}, 5000);
					message.error(errMsg);
				});
		}
	};

	return (
		<div className="init-container">
			<div className="setup-container">
				<div className="content info-container">
					<div>
						<ReactSVG
							src={STATIC_ICONS.TIMEZONE_WORLD_MAP}
							className="map-icon"
						/>
					</div>
					<div className="wrapper">
						<div className="header">Login</div>
						<LoginForm
							fields={{
								email: {
									type: 'text',
									label: 'Email',
									validate: [validateRequired, email],
								},
								password: {
									type: 'password',
									label: 'Password',
									validate: [validateRequired],
								},
								otp_code: {
									type: 'number',
									label: '2FA (if active)',
								},
								captcha: {
									type: 'captcha',
									language: getLanguage(),
									theme: props.theme,
									validate: [validateRequired],
								},
							}}
							onSubmit={handleSubmit}
							buttonText={'Proceed'}
							submitOnKeyDown={true}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	constants: state.app.constants,
});

const mapDispatchToProps = (dispatch) => ({
	change: bindActionCreators(change, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
