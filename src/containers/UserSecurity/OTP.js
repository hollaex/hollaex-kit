import React, { Component } from 'react';
import { CheckboxButton, IconTitle } from '../../components';
import QRCode from 'qrcode.react';
import OTPForm from './OTPForm';
import { ICONS } from '../../config/constants';

export const renderOTPForm = (secret, email, activateOTP) => (
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
          value={`otpauth://totp/EXIR ${email}?secret=${secret}`}
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

export const OTP = ({ requestOTP, data, otp_enabled, children }) => (
  <div className="user_security-wrapper">
    <div className="warning_text">
      We highly recommend you set up 2 factor authentication (2FA). Doing so will greatly increase the security of your funds.
    </div>
    <CheckboxButton
      label="Enable Two-Factor Authentication"
      onClick={requestOTP}
      disabled={data.requesting}
      loading={data.requesting}
      checked={otp_enabled}
    >
      {children}
    </CheckboxButton>
  </div>
);
