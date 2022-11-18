import React from 'react';
import { CheckboxButton, IconTitle, EditWrapper } from 'components';
import QRCode from 'qrcode.react';
import OTPForm from './OTPForm';
import STRINGS from 'config/localizedStrings';
import { Image } from 'hollaex-web-lib';

export const renderOTPForm = (
	secret,
	email,
	activateOTP,
	constants = {},
	ICONS
) => {
	const app_name = constants.api_name.replace(' ', '').trim() || '';
	return (
		<div className="otp_form-wrapper">
			<IconTitle
				stringId="ACCOUNT_SECURITY.OTP.CONTENT.TITLE"
				text={STRINGS['ACCOUNT_SECURITY.OTP.CONTENT.TITLE']}
				iconId="OTP_KEYS"
				iconPath={ICONS['OTP_KEYS']}
				className="w-100"
				textType="title"
			/>
			<div className="otp_form-section-wrapper">
				<div className="otp_form-section-title">
					<EditWrapper
						stringId="ACCOUNT_SECURITY.OTP.CONTENT.MESSAGE_1"
						render={(string) => <span>{string}</span>}
					>
						{STRINGS['ACCOUNT_SECURITY.OTP.CONTENT.MESSAGE_1']}
					</EditWrapper>
				</div>
				<div className="otp_form-section-text">
					<EditWrapper stringId="ACCOUNT_SECURITY.OTP.CONTENT.MESSAGE_2">
						{STRINGS['ACCOUNT_SECURITY.OTP.CONTENT.MESSAGE_2']}
					</EditWrapper>
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
					<EditWrapper
						stringId="ACCOUNT_SECURITY.OTP.CONTENT.MESSAGE_5"
						render={(string) => <span>{string}</span>}
					>
						{STRINGS['ACCOUNT_SECURITY.OTP.CONTENT.MESSAGE_5']}
					</EditWrapper>
				</div>
				<div className="otp_form-section-text">
					<EditWrapper stringId="ACCOUNT_SECURITY.OTP.CONTENT.MESSAGE_3">
						{STRINGS['ACCOUNT_SECURITY.OTP.CONTENT.MESSAGE_3']}
					</EditWrapper>
					<br />
					<EditWrapper stringId="ACCOUNT_SECURITY.OTP.CONTENT.MESSAGE_4">
						{STRINGS['ACCOUNT_SECURITY.OTP.CONTENT.MESSAGE_4']}
					</EditWrapper>
				</div>
				<div className="otp_form-section-content otp_secret">{secret}</div>
			</div>
			<div className="otp_form-section-wrapper">
				<div className="otp_form-section-title">
					<EditWrapper
						stringId="ACCOUNT_SECURITY.OTP.CONTENT.INPUT"
						render={(string) => <span>{string}</span>}
					>
						{STRINGS['ACCOUNT_SECURITY.OTP.CONTENT.INPUT']}
					</EditWrapper>
				</div>
				<OTPForm onSubmit={activateOTP} />
			</div>
		</div>
	);
};

export const OTP = ({
	requestOTP,
	data = {},
	otp_enabled,
	children,
	icons = {},
}) => (
	<div>
		<div className={!otp_enabled ? 'user_security-wrapper' : ''}>
			{!otp_enabled && (
				<div className="warning_text">
					<EditWrapper stringId="ACCOUNT_SECURITY.OTP.CONTENT.WARNING">
						{STRINGS['ACCOUNT_SECURITY.OTP.CONTENT.WARNING']}
					</EditWrapper>
				</div>
			)}
		</div>
		<div className="d-flex w-100 justify-content-center align-items-center mt-5">
			<CheckboxButton
				stringId="ACCOUNT_SECURITY.OTP.CONTENT.ENABLE,ACCOUNT_SECURITY.OTP.CONTENT.DISABLE"
				label={
					STRINGS[
						`ACCOUNT_SECURITY.OTP.CONTENT.${otp_enabled ? 'DISABLE' : 'ENABLE'}`
					]
				}
				onClick={requestOTP}
				disabled={data.requesting}
				loading={data.requesting}
				checked={otp_enabled}
				icons={icons}
				customCheckIcon="SECURE"
			>
				{children}
			</CheckboxButton>
			{otp_enabled && (
				<Image
					iconId={'SUCCESS_BLACK'}
					icon={icons['SUCCESS_BLACK']}
					wrapperClassName="OTP_Success ml-2"
					width="20px"
					height="20px"
				/>
			)}
		</div>
	</div>
);
