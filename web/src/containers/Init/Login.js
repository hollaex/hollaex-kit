import React from 'react';
import { message } from 'antd';
import { browserHistory } from 'react-router';

import { AdminHocForm } from '../../components';
import { performLogin } from '../../actions/authAction';
import {
    validateRequired,
    email
} from '../../components/AdminForm/validations';
import { getLanguage } from '../../utils/string';

const LoginForm = AdminHocForm('LOGIN_FORM', 'setup-field-wrapper setup-field-content');

const Login = (props) => {
    const handleSubmit = (values) => {
        if (values) {
            performLogin(values)
                .then(res => {
                    browserHistory.push('/admin');
                })
                .catch(error => {
                    let errMsg = ''
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
        <div className="setup-container">
            <div className="content">
                <div className="email-icon"></div>
                <div className="wrapper">
                    <div className="header">
                        Login
                    </div>
                    <LoginForm
                        fields={{
                            email: {
                                type: 'text',
                                label: 'Email',
                                validate: [validateRequired, email]
                            },
                            password: {
                                type: 'password',
                                label: 'Currency',
                                validate: [validateRequired]
                            },
                            otp_code: {
                                type: 'number',
                                label: '2FA (if active)',
                            },
                            captcha: {
                                type: 'captcha',
                                language: getLanguage(),
                                theme: props.theme,
                                validate: [validateRequired]
                            }
                        }}
                        onSubmit={handleSubmit}
                        buttonText={'Proceed'}
                    />
                </div>
            </div>
        </div>
    );
}

export default Login;
