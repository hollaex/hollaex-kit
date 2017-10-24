import React, { Component } from 'react';
import { SubmissionError } from 'redux-form';
import { Link } from 'react-router';
import { performLogin } from '../../actions/authAction';
import LoginForm from './LoginForm';
import { Dialog, OtpForm } from '../../components';
import { errorHandler } from '../../components/OtpForm/utils';

class Login extends Component {
  state = {
    values: {},
    otpDialogIsOpen: false,
  }

  redirectToHome = () => {
    this.props.router.replace('/');
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
      <div className="d-flex justify-content-center align-items-center flex-column col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-sm-8 offset-sm-2 login_wrapper">
        <div className="d-flex justify-content-center align-items-center">
          <div><h1>Login/</h1></div>
          <div><Link to='/signup' style={{textDecoration:'none'}}><h5>SignUp</h5></Link></div>
        </div>
        <div className="d-flex justify-content-center align-items-center w-100">
          <LoginForm onSubmit={this.onSubmitLogin} />
        </div>
        <Link to='/reset-password'>Reset password</Link>
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
