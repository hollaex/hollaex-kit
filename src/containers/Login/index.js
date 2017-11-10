import React, { Component } from 'react';
import classnames from 'classnames';
import { SubmissionError } from 'redux-form';
import { Link } from 'react-router';
import { performLogin } from '../../actions/authAction';
import LoginForm from './LoginForm';
import { Dialog, OtpForm, IconTitle } from '../../components';
import { errorHandler } from '../../components/OtpForm/utils';
import { EXIR_LOGO, FLEX_CENTER_CLASSES, APP_TITLE, ICONS } from '../../config/constants';

const TEXTS = {
  TITLE: 'login',
  LOGIN_TO: `Login to ${APP_TITLE}`,
  CANT_LOGIN: 'Can\'t login?',
  NO_ACCOUNT: 'Don\'t have an account?',
  CREATE_ACCOUNT: 'Create one here',
}

class Login extends Component {
  state = {
    values: {},
    otpDialogIsOpen: false,
  }

  redirectToHome = () => {
    this.props.router.replace('/account');
  }

  redirectToResetPassword = () => {
    this.props.router.replace('/reset-password');
  }

  onSubmitLogin = (values) => {
    return performLogin(values)
      .then((res) => {
        this.redirectToHome();
      })
      .catch((err) => {
        const _error = err.response.data ? err.response.data.message : err.message;

        let error = {}

        if (_error.toLowerCase().indexOf('otp') > -1) {
          this.setState({ values, otpDialogIsOpen: true });
          error._error = 'Provide OTP code to login';
        } else {
          error.password = _error;
          throw new SubmissionError(error);
        }
      });
  }

  onSubmitLoginOtp = (values) => {
    return performLogin(Object.assign({ otp_code: values.otp_code }, this.state.values))
    .then((res) => {
      this.setState({ otpDialogIsOpen: false });
      this.redirectToHome();
    })
    .catch(errorHandler);
  }

  onCloseDialog = () => {
    this.setState({ otpDialogIsOpen: false });
  }

  render() {
    const { otpDialogIsOpen } = this.state;

    return (
      <div className={classnames(...FLEX_CENTER_CLASSES, 'flex-column', 'f-1', 'login_container')}>
        <div className={classnames(...FLEX_CENTER_CLASSES, 'flex-column', 'login_wrapper', 'auth_wrapper', 'w-100')}>
          <IconTitle
            iconPath={EXIR_LOGO}
            text={TEXTS.TITLE}
            textType="title"
            underline={true}
            className="w-100"
            subtitle={TEXTS.LOGIN_TO}
            actionProps={{
              text: TEXTS.CANT_LOGIN,
              iconPath: ICONS.RED_ARROW,
              onClick: this.redirectToResetPassword,
            }}
          />
          <div className={classnames(...FLEX_CENTER_CLASSES, 'flex-column', 'login_form-wrapper', 'auth_form-wrapper', 'w-100')}>
            <LoginForm onSubmit={this.onSubmitLogin} />
          </div>
        </div>
        <div className={classnames('f-1', 'link_wrapper')}>
          {TEXTS.NO_ACCOUNT}<Link to='/signup' className={classnames('blue-link')}>{TEXTS.CREATE_ACCOUNT}</Link>
        </div>
        <Dialog
          isOpen={otpDialogIsOpen}
          label="otp-modal"
          onCloseDialog={this.onCloseDialog}
          shouldCloseOnOverlayClick={false}
          showCloseText={true}
        >
          <OtpForm onSubmit={this.onSubmitLoginOtp} />
        </Dialog>
      </div>
    );
  }
}

export default Login;
