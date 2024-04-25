import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { Button, message } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { CheckboxButton, IconTitle, EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';
import { Image } from 'hollaex-web-lib';
import { RenderBtn, RenderBackBtn } from './utils_logins';
import { STATIC_ICONS } from 'config/icons';

const OtpFormSteps = ({
	secret,
	email,
	activateOTP,
	constants = {},
	ICONS,
	closeDialog,
	handleOTPCheckbox,
	handleUpdateOtp,
	selectedStep,
}) => {
	const [step, setStep] = useState(0);
	const [otpValue, setOtpValue] = useState();
	const app_name = constants.api_name.replace(' ', '').trim() || '';

	useEffect(() => {
		if (selectedStep) {
			setStep(selectedStep);
			handleUpdateOtp(false);
		}
	}, [selectedStep, handleUpdateOtp]);

	return (
		<div className="otp_form-wrapper">
			<IconTitle
				stringId="ACCOUNT_SECURITY.OTP.CONTENT.TITLE"
				text={STRINGS['ACCOUNT_SECURITY.OTP.CONTENT.TITLE']}
				iconId="OTP_KEYS"
				iconPath={ICONS['OTP_KEYS']}
				className="w-100 m-0"
				textType="title"
			/>
			{step === 0 && (
				<div className="step-one-pop-up text-center">
					<div className="otp-border"></div>
					<div className="d-flex justify-content-center">
						<div className="download-content-title">
							<EditWrapper stringId="ACCOUNT_SECURITY.OTP.DOWNLOAD_APP">
								{STRINGS['ACCOUNT_SECURITY.OTP.DOWNLOAD_APP']}
							</EditWrapper>
						</div>
						<img
							alt="app-store"
							className="mx-2"
							src={STATIC_ICONS['GOOGLE_AUTHENTICATOR']}
						></img>
						<div className="download-content-title">
							<EditWrapper stringId="ACCOUNT_SECURITY.OTP.GOOGLE_AUTHENTICATOR">
								{STRINGS['ACCOUNT_SECURITY.OTP.GOOGLE_AUTHENTICATOR']}
							</EditWrapper>
						</div>
					</div>
					<div className="d-flex justify-content-center mt-2 mb-4">
						<div
							className="store-wrapper"
							onClick={() =>
								window.open(
									'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en&gl=US',
									'_blank'
								)
							}
						>
							<div className="d-flex">
								<img
									alt="google-play"
									className="mx-2 store-icons"
									src={STATIC_ICONS['GOOGLE_PLAY']}
								></img>
								<div>
									<div>
										<EditWrapper stringId="ACCOUNT_SECURITY.OTP.DOWNLOAD_FROM">
											{STRINGS['ACCOUNT_SECURITY.OTP.DOWNLOAD_FROM']}
										</EditWrapper>
									</div>
									<div style={{ fontWeight: 'bold' }}>
										<EditWrapper stringId="ACCOUNT_SECURITY.OTP.GOOGLE_PLAY">
											{STRINGS['ACCOUNT_SECURITY.OTP.GOOGLE_PLAY']}
										</EditWrapper>
									</div>
								</div>
							</div>
						</div>
						<div
							className="store-wrapper ml-5"
							onClick={() =>
								window.open(
									'https://apps.apple.com/us/app/google-authenticator/id388497605',
									'_blank'
								)
							}
						>
							<div className="d-flex">
								<img
									alt="app-store"
									className="mx-2 store-icons"
									src={STATIC_ICONS['APP_STORE']}
								></img>
								<div>
									<div>
										<EditWrapper stringId="ACCOUNT_SECURITY.OTP.DOWNLOAD_FROM">
											{STRINGS['ACCOUNT_SECURITY.OTP.DOWNLOAD_FROM']}
										</EditWrapper>
									</div>
									<div style={{ fontWeight: 'bold' }}>
										<EditWrapper stringId="ACCOUNT_SECURITY.OTP.APPLE">
											{STRINGS['ACCOUNT_SECURITY.OTP.APPLE']}
										</EditWrapper>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="app-info">
						<EditWrapper stringId="ACCOUNT_SECURITY.OTP.APP_INFO">
							{STRINGS['ACCOUNT_SECURITY.OTP.APP_INFO']}
						</EditWrapper>
					</div>
					<div className="d-flex justify-content-center">
						<div className="otp-border-footer"></div>
					</div>
					<div className="uninstall-info">
						<EditWrapper stringId="ACCOUNT_SECURITY.OTP.DONT_UNINSTALL">
							{STRINGS['ACCOUNT_SECURITY.OTP.DONT_UNINSTALL']}
						</EditWrapper>
					</div>
					<div>
						<EditWrapper stringId="ACCOUNT_SECURITY.OTP.INFO_UNINSTALL">
							{STRINGS['ACCOUNT_SECURITY.OTP.INFO_UNINSTALL']}
						</EditWrapper>
					</div>
					<RenderBtn
						closeDialog={closeDialog}
						setStep={setStep}
						step={1}
						label={'ACCOUNT_SECURITY.OTP.PROCEED'}
					/>
				</div>
			)}

			{step === 1 && (
				<div className="step-two-pop-up">
					<div className="otp_form-section-wrapper">
						<div className="otp_form-section-title text-center mb-5">
							<EditWrapper
								stringId="ACCOUNT_SECURITY.OTP.CONTENT.MESSAGE_1"
								render={(string) => <span>{string}</span>}
							>
								{STRINGS['ACCOUNT_SECURITY.OTP.CONTENT.MESSAGE_1']}
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
					<div className="otp-border mt-3"></div>
					<div className="otp_form-section-wrapper">
						<div className="otp_form-section-title">
							<EditWrapper
								stringId="ACCOUNT_SECURITY.OTP.CONTENT.MESSAGE_5"
								render={(string) => <span>{string}</span>}
							>
								{STRINGS['ACCOUNT_SECURITY.OTP.CONTENT.MESSAGE_5']}
							</EditWrapper>
						</div>
						<div className="otp_form-section-content otp_secret">{secret}</div>
						<div className="note-txt">
							<EditWrapper stringId="ACCOUNT_SECURITY.OTP.NOTE">
								{STRINGS.formatString(
									STRINGS['ACCOUNT_SECURITY.OTP.NOTE'],
									STRINGS['ACCOUNT_SECURITY.OTP.MANUEL_DESCRIPTION_2'],
									STRINGS['ACCOUNT_SECURITY.OTP.MANUEL_DESCRIPTION_3']
								)}
							</EditWrapper>
						</div>
					</div>
					<div className="otp_form-section-wrapper">
						<RenderBtn
							goBack={0}
							setStep={setStep}
							step={2}
							label={'ACCOUNT_SECURITY.OTP.NEXT'}
						/>
					</div>
				</div>
			)}

			{step === 2 && (
				<div className="step-three-pop-up">
					<div className="otp_form-section-title">
						<EditWrapper stringId="ACCOUNT_SECURITY.OTP.MANUEL_DESCRIPTION">
							{STRINGS['ACCOUNT_SECURITY.OTP.MANUEL_DESCRIPTION']}
						</EditWrapper>
					</div>
					<div className="mt-5">
						<EditWrapper stringId="ACCOUNT_SECURITY.OTP.MANUEL_KEY">
							{STRINGS['ACCOUNT_SECURITY.OTP.MANUEL_KEY']}
						</EditWrapper>
					</div>
					<input
						value={otpValue}
						className="verfication-field"
						placeholder={STRINGS['ACCOUNT_SECURITY.OTP.MANUEL_PLACEHOLDER']}
						onChange={(e) => {
							setOtpValue(e.target.value);
						}}
					/>
					<div className="warning-text">
						<EditWrapper stringId="ACCOUNT_SECURITY.OTP.MANUEL_WARNING">
							{STRINGS['ACCOUNT_SECURITY.OTP.MANUEL_WARNING']}
						</EditWrapper>
					</div>

					<div className="btn-wrapper">
						<RenderBackBtn
							setStep={setStep}
							step={1}
							label={'ACCOUNT_SECURITY.OTP.NEXT'}
						/>
						<Button
							onClick={() => {
								if (!otpValue) {
									message.error(STRINGS['ACCOUNT_SECURITY.OTP.MANUEL_ERROR_1']);
									return;
								}
								if (otpValue !== secret) {
									message.error(STRINGS['ACCOUNT_SECURITY.OTP.MANUEL_ERROR_2']);
									return;
								}
								handleUpdateOtp(true);
								handleOTPCheckbox(false);
							}}
							className="proceed-btn"
						>
							<EditWrapper stringId="ACCOUNT_SECURITY.OTP.NEXT">
								{STRINGS['ACCOUNT_SECURITY.OTP.NEXT']}
							</EditWrapper>
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};

export const renderOTPForm = (
	secret,
	email,
	activateOTP,
	constants = {},
	ICONS,
	closeDialog,
	handleOTPCheckbox = () => {},
	handleUpdateOtp = () => {},
	selectedStep
) => {
	return (
		<OtpFormSteps
			secret={secret}
			email={email}
			activateOTP={activateOTP}
			constants={constants}
			ICONS={ICONS}
			closeDialog={closeDialog}
			handleOTPCheckbox={handleOTPCheckbox}
			handleUpdateOtp={handleUpdateOtp}
			selectedStep={selectedStep}
		/>
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
		<div>
			{!otp_enabled ? (
				<div className="otp-field-wrapper">
					<div className="warning_text">
						<EditWrapper stringId="ACCOUNT_SECURITY.OTP.CONTENT.WARNING">
							{STRINGS.formatString(
								STRINGS['ACCOUNT_SECURITY.OTP.CONTENT.WARNING'],
								<span className="improtant-text">
									{STRINGS['ACCOUNT_SECURITY.OTP.CONTENT.STRONGLY_RECOMMEND']}
								</span>,
								STRINGS['ACCOUNT_SECURITY.OTP.CONTENT.WARNING_CONTENT']
							)}
						</EditWrapper>
					</div>
					<div className={!otp_enabled ? 'user_security-wrapper' : ''}>
						<CloseCircleOutlined />
						<span className="font-weight-bold mb-3">
							<EditWrapper stringId="ACCOUNT_SECURITY.OTP.2FA_DISABLED">
								{STRINGS['ACCOUNT_SECURITY.OTP.2FA_DISABLED']}
							</EditWrapper>
						</span>
						<span className="text-center">
							<EditWrapper stringId="ACCOUNT_SECURITY.OTP.2FA_CONTENT_ONE">
								{STRINGS.formatString(
									STRINGS['ACCOUNT_SECURITY.OTP.2FA_CONTENT_ONE'],
									<span className="font-weight-bold">
										{STRINGS['ACCOUNT_SECURITY.OTP.TITLE']}
									</span>,
									STRINGS['ACCOUNT_SECURITY.OTP.2FA_CONTENT_TWO']
								)}
							</EditWrapper>
						</span>
					</div>
				</div>
			) : (
				<div className="user_security-wrapper-disabled">
					{otp_enabled && (
						<Image
							iconId={'SUCCESS_BLACK'}
							icon={icons['SUCCESS_BLACK']}
							wrapperClassName="OTP_Success ml-2"
							width="20px"
							height="20px"
						/>
					)}
					<span className="font-weight-bold mb-3">
						<EditWrapper stringId="ACCOUNT_SECURITY.OTP.2FA_DISABLED">
							{STRINGS['ACCOUNT_SECURITY.OTP.2FA_DISABLED']}
						</EditWrapper>
					</span>
					<span className="text-center d-flex flex-column">
						<span>
							<EditWrapper stringId="ACCOUNT_SECURITY.OTP.2FA_CONTENT_ONE">
								{STRINGS.formatString(
									STRINGS['ACCOUNT_SECURITY.OTP.2FA_CONTENT_ONE'],
									<span className="font-weight-bold">
										{STRINGS['ACCOUNT_SECURITY.OTP.TITLE']}
									</span>,
									STRINGS['ACCOUNT_SECURITY.OTP.2FA_CONTENT_THREE']
								)}
							</EditWrapper>
						</span>
						<span>
							<EditWrapper stringId="ACCOUNT_SECURITY.OTP.2FA_CONTENT_FOUR">
								{STRINGS['ACCOUNT_SECURITY.OTP.2FA_CONTENT_FOUR']}
							</EditWrapper>
						</span>
					</span>
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
		</div>
	</div>
);
