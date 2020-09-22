import React from 'react';
import { CheckboxButton, IconTitle } from '../../components';
import QRCode from 'qrcode.react';
import OTPForm from './OTPForm';
import { ICONS } from '../../config/constants';

import STRINGS from '../../config/localizedStrings';

export const renderOTPForm = (secret, email, activateOTP, constants = {}) => {
	const app_name = constants.api_name.replace(' ', '').trim() || '';
	return (
		<div className="otp_form-wrapper">
			<IconTitle
				text={STRINGS["ACCOUNT_SECURITY.OTP.CONTENT.TITLE"]}
				iconPath={ICONS.OTP_KEYS}
				className="w-100"
				textType="title"
				useSvg={true}
			/>
			<div className="otp_form-section-wrapper">
				<div className="otp_form-section-title">
					<span>{STRINGS["ACCOUNT_SECURITY.OTP.CONTENT.MESSAGE_1"]}</span>
				</div>
				<div className="otp_form-section-text">
					{STRINGS["ACCOUNT_SECURITY.OTP.CONTENT.MESSAGE_2"]}
				</div>
				<div className="d-flex justify-content-center otp_form-section-content">
					<div className="qr-code-wrapper d-flex justify-content-center align-items-center">
						<QRCode
							value={`otpauth://totp/${app_name}-${email}?secret=${secret}&issuer=${app_name}`}
							size={150}
						/>
					</div>
				</div>
			</div>
			<div className="otp_form-section-wrapper">
				<div className="otp_form-section-title">
					<span>{STRINGS["ACCOUNT_SECURITY.OTP.CONTENT.MESSAGE_5"]}</span>
				</div>
				<div className="otp_form-section-text">
					{STRINGS["ACCOUNT_SECURITY.OTP.CONTENT.MESSAGE_3"]}
					<br />
					{STRINGS["ACCOUNT_SECURITY.OTP.CONTENT.MESSAGE_4"]}
				</div>
				<div className="otp_form-section-content otp_secret">{secret}</div>
			</div>
			<div className="otp_form-section-wrapper">
				<div className="otp_form-section-title">
					<span>{STRINGS["ACCOUNT_SECURITY.OTP.CONTENT.INPUT"]}</span>
				</div>
				<OTPForm onSubmit={activateOTP} />
			</div>
		</div>
	);
}

export const OTP = ({ requestOTP, data, otp_enabled, children }) => (
	<div className="user_security-wrapper">
		{!otp_enabled && (
			<div className="warning_text">
				{STRINGS["ACCOUNT_SECURITY.OTP.CONTENT.WARNING"]}
			</div>
		)}
		<CheckboxButton
			label={
				STRINGS[`ACCOUNT_SECURITY.OTP.CONTENT.${otp_enabled ? 'DISABLE' : 'ENABLE'}`]
			}
			onClick={requestOTP}
			disabled={data.requesting}
			loading={data.requesting}
			checked={otp_enabled}
		>
			{children}
		</CheckboxButton>
	</div>
);
