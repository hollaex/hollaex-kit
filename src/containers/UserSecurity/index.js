import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SubmissionError } from 'redux-form';

import { ICONS } from '../../config/constants';
import { resetPassword, otpRequest, otpActivate, otpSetActivated } from '../../actions/userAction';
import { Accordion } from '../../components';
import ChangePasswordForm from './ChangePasswordForm';
import OTP from './OTP';

class UserVerification extends Component {
  state = {
    sections: [],
  }

  componentDidMount() {
    this.calculateSections(this.props.user);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.otp.requested !== this.props.user.otp.requested) {
      this.calculateSections(nextProps.user);
    }
  }


  calculateSections = (user) => {
    const { otp_enabled, otp } = user;

    const sections = [{
      title: 'Two-Factor Authentication',
      content: (
        <OTP
          requestOTP={this.props.requestOTP}
          activateOTP={this.onSubmitActivateOtp}
          data={otp}
        />
      ),
      disabled: otp_enabled,
      notification: {
        text: otp_enabled ? 'otp enabled' : 'PLEASE TURN ON 2FA',
        status: otp_enabled ? 'success' : 'warning',
        iconPath: otp_enabled ? ICONS.CHECK : ICONS.RED_ARROW,
        allowClick: !otp_enabled
      }
    },
    {
      title: 'Change Password',
      content: <ChangePasswordForm onSubmit={this.onSubmitChangePassword} />,
      disabled: false,
      notification: {
        text: 'active',
        status: 'success',
        iconPath: ICONS.CHECK,
        allowClick: true
      }
    }];

    this.setState({ sections });
  }

  onSubmitActivateOtp = (values) => {
    return otpActivate(values)
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err.response.data)
        const _error = err.response.data ? err.response.data.message : err.message
        throw new SubmissionError({ _error })
      });
  }

  onSubmitChangePassword = (values) => {
    return resetPassword({
      old_password: values.old_password,
      new_password: '12',
    })
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err.response.data)
        const _error = err.response.data ? err.response.data.message : err.message
        throw new SubmissionError({ _error })
      });
  }

  render() {
    if (this.props.user.verification_level === 0) {
      return <div>Loading</div>;
    }
    const { sections } = this.state;

    return (
      <div>
        <Accordion
          sections={sections}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  requestOTP: () => dispatch(otpRequest()),
  otpSetActivated: () => dispatch(otpSetActivated()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserVerification);
