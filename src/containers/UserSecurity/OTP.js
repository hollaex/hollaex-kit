import React, { Component } from 'react';
import { Button, Dialog } from '../../components';
import QRCode from 'qrcode.react';
import OTPForm from './OTPForm';
import { IconTitle } from '../../components';
import { ICONS } from '../../config/constants';

class OTP extends Component {
  state = {
    dialogIsOpen: false
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.requested === true && this.props.data.requested === false) {
      this.setState({ dialogIsOpen: true });
    }
  }

  onCloseDialog = () => {
    this.setState({ dialogIsOpen: false });
  }

  renderOTPForm = (secret, activateOTP) => (
    <div className="otp_form-wrapper">
      <IconTitle
        text="Activate Two-Factor Authentication"
        iconPath={ICONS.KEYS}
      />
      <div className="otp_form-section-wrapper">
        <div className="otp_form-section-title">
          <span>Setup your two-factor authenticator</span>
        </div>
        <div className="otp_form-section-text">
          Scan the image below to automatically setuo otwo-factor authentication in your device.
        </div>
        <div className="d-flex justify-content-center otp_form-section-content">
          <QRCode
            value={`otpauth://totp/exir?secret=${secret}`}
            size={150}
          />
        </div>
      </div>
      <div className="otp_form-section-wrapper">
        <div className="otp_form-section-title">
          <span>Setup your two-factor authenticator</span>
        </div>
        <div className="otp_form-section-text">
          Use this key to manualy setup two-factor authentication on your device.<br />
          You can store this code to recover your 2FA. Do not store this key.
        </div>
        <div className=" otp_form-section-content otp_secret">{secret}</div>
      </div>
      <div className="otp_form-section-wrapper">
        <div className="otp_form-section-title">
          <span>Enter One-Time Password (OTP)</span>
        </div>
        <OTPForm
          onSubmit={activateOTP}
        />
      </div>
    </div>
  );

  renderOTPSuccess = () => (
    <div>
      Success
    </div>
  )

  render() {
    const { requestOTP, activateOTP, data } = this.props;

    return (
      <div className="user_security-wrapper">
        <div className="warning_text">
          We highly recommend you set up 2 factor authentication (2FA). Doing so will greatly increase the security of your funds.
        </div>
        <Button
          label="Enable Two-Factor Authentication"
          onClick={requestOTP}
          disabled={data.fetching}
        />
        <Dialog
					isOpen={this.state.dialogIsOpen}
					label="otp-modal"
					onCloseDialog={this.onCloseDialog}
				>
          {data.activated ?
            this.renderOTPSuccess() :
            this.renderOTPForm(data.secret, activateOTP)
          }
				</Dialog>
      </div>
    );
  }
}

export default OTP;
