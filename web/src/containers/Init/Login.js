import React, { useEffect } from 'react';
import { message } from 'antd';
import { browserHistory } from 'react-router';
import { loadReCaptcha } from 'react-recaptcha-v3';
import { connect } from 'react-redux';
import ReactSVG from 'react-svg';

import { AdminHocForm } from '../../components';
import { performLogin } from '../../actions/authAction';
import {
	validateRequired,
	email,
} from '../../components/AdminForm/validations';
import {
	CAPTCHA_SITEKEY,
	DEFAULT_CAPTCHA_SITEKEY,
} from '../../config/constants';
import { STATIC_ICONS } from 'config/icons';
import { getLanguage } from '../../utils/string';
import { getExchangeInitialized } from '../../utils/initialize';
import { isAdmin } from '../../utils/token';

const LoginForm = AdminHocForm(
	'LOGIN_FORM',
	'setup-field-wrapper setup-field-content'
);

const Login = (props) => {
	const { constants = { captcha: {} } } = props;

	useEffect(() => {
		const initialized = getExchangeInitialized();
		if (
			initialized === 'false' ||
			(typeof initialized === 'boolean' && !initialized)
		) {
			browserHistory.push('/init');
		}

		let siteKey = DEFAULT_CAPTCHA_SITEKEY;
		if (CAPTCHA_SITEKEY) {
			siteKey = CAPTCHA_SITEKEY;
		} else if (constants.captcha && constants.captcha.site_key) {
			siteKey = constants.captcha.site_key;
		}
		loadReCaptcha(siteKey, () =>
			console.info('grepcaptcha is correctly loaded')
		);
		//  TODO: Fix react-hooks/exhaustive-deps
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const handleSubmit = (values) => {
		if (values) {
			performLogin(values)
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
							path={STATIC_ICONS.TIMEZONE_WORLD_MAP}
							wrapperClassName="map-icon"
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
								// otp_code: {
								// 	type: 'number',
								// 	label: '2FA (if active)',
								// },
								captcha: {
									type: 'captcha',
									language: getLanguage(),
									theme: props.theme,
									validate: [validateRequired],
								},
							}}
							onSubmit={handleSubmit}
							buttonText={'Proceed'}
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

export default connect(mapStateToProps)(Login);
