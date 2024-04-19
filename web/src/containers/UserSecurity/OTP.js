import React, { useState } from 'react';
import QRCode from 'qrcode.react';
// import { Button, message } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { CheckboxButton, IconTitle, EditWrapper } from 'components';
import OTPForm from './OTPForm';
import STRINGS from 'config/localizedStrings';
import { Image } from 'hollaex-web-lib';
import { RenderBtn, RenderBackBtn } from './utils_logins';

const OtpFormSteps = ({
	secret,
	email,
	activateOTP,
	constants = {},
	ICONS,
	closeDialog,
}) => {
	const [step, setStep] = useState(0);
	const [otpValue, setOtpValue] = useState();
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
			{step === 0 && (
				<div className="step-one-pop-up text-center">
					<div className="otp-border"></div>
					<div className="download-content-title">
						<EditWrapper stringId="ACCOUNT_SECURITY.OTP.DOWNLOAD_APP">
							{STRINGS['ACCOUNT_SECURITY.OTP.DOWNLOAD_APP']}
						</EditWrapper>
					</div>
					<div className="store-icons-wrapper">
						<div
							style={{
								cursor: 'pointer',
								padding: 10,
								width: 140,
								height: 50,
								color: 'black',
								fontSize: 12,
								borderRadius: 10,
								backgroundColor: '#F5F5F7',
							}}
							onClick={() =>
								window.open(
									'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en&gl=US',
									'_blank'
								)
							}
						>
							<div style={{ display: 'flex', gap: 5 }}>
								<div>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="20px"
										height="20px"
										viewBox="0 0 24 24"
										fill="none"
									>
										<path
											fill-rule="evenodd"
											clip-rule="evenodd"
											d="M2 3.65629C2 2.15127 3.59967 1.18549 4.93149 1.88645L20.7844 10.2301C22.2091 10.9799 22.2091 13.0199 20.7844 13.7698L4.9315 22.1134C3.59968 22.8144 2 21.8486 2 20.3436V3.65629ZM19.8529 11.9999L16.2682 10.1132L14.2243 11.9999L16.2682 13.8866L19.8529 11.9999ZM14.3903 14.875L12.75 13.3608L6.75782 18.8921L14.3903 14.875ZM12.75 10.639L14.3903 9.12488L6.75782 5.10777L12.75 10.639ZM4 5.28391L11.2757 11.9999L4 18.7159V5.28391Z"
											fill="#0F0F0F"
										/>
									</svg>
								</div>
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
							onClick={() =>
								window.open(
									'https://apps.apple.com/us/app/google-authenticator/id388497605',
									'_blank'
								)
							}
							style={{
								cursor: 'pointer',
								padding: 10,
								width: 140,
								height: 50,
								color: 'black',
								fontSize: 12,
								borderRadius: 10,
								backgroundColor: '#F5F5F7',
							}}
						>
							<div style={{ display: 'flex', gap: 5 }}>
								<div>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="20px"
										height="20px"
										viewBox="-1.5 0 20 20"
										version="1.1"
									>
										<g
											id="Page-1"
											stroke="none"
											stroke-width="1"
											fill="none"
											fill-rule="evenodd"
										>
											<g
												id="Dribbble-Light-Preview"
												transform="translate(-102.000000, -7439.000000)"
												fill="#000000"
											>
												<g
													id="icons"
													transform="translate(56.000000, 160.000000)"
												>
													<path
														d="M57.5708873,7282.19296 C58.2999598,7281.34797 58.7914012,7280.17098 58.6569121,7279 C57.6062792,7279.04 56.3352055,7279.67099 55.5818643,7280.51498 C54.905374,7281.26397 54.3148354,7282.46095 54.4735932,7283.60894 C55.6455696,7283.69593 56.8418148,7283.03894 57.5708873,7282.19296 M60.1989864,7289.62485 C60.2283111,7292.65181 62.9696641,7293.65879 63,7293.67179 C62.9777537,7293.74279 62.562152,7295.10677 61.5560117,7296.51675 C60.6853718,7297.73474 59.7823735,7298.94772 58.3596204,7298.97372 C56.9621472,7298.99872 56.5121648,7298.17973 54.9134635,7298.17973 C53.3157735,7298.17973 52.8162425,7298.94772 51.4935978,7298.99872 C50.1203933,7299.04772 49.0738052,7297.68074 48.197098,7296.46676 C46.4032359,7293.98379 45.0330649,7289.44985 46.8734421,7286.3899 C47.7875635,7284.87092 49.4206455,7283.90793 51.1942837,7283.88393 C52.5422083,7283.85893 53.8153044,7284.75292 54.6394294,7284.75292 C55.4635543,7284.75292 57.0106846,7283.67793 58.6366882,7283.83593 C59.3172232,7283.86293 61.2283842,7284.09893 62.4549652,7285.8199 C62.355868,7285.8789 60.1747177,7287.09489 60.1989864,7289.62485"
														id="apple-[#173]"
													></path>
												</g>
											</g>
										</g>
									</svg>
								</div>
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
					<div className="otp-border"></div>
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
					<RenderBtn closeDialog={closeDialog} setStep={setStep} step={1} />
				</div>
			)}

			{step === 1 && (
				<div className="step-two-pop-up">
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
						<div className="otp_form-section-text" style={{ color: '#E59B07' }}>
							<EditWrapper stringId="ACCOUNT_SECURITY.OTP.MANUEL_DESCRIPTION_2">
								{STRINGS['ACCOUNT_SECURITY.OTP.MANUEL_DESCRIPTION_2']}
							</EditWrapper>
						</div>
						<div className="otp_form-section-content otp_secret">{secret}</div>
					</div>
					<div className="otp_form-section-wrapper">
						<RenderBtn closeDialog={closeDialog} setStep={setStep} step={2} />
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
					<div style={{ marginTop: 15 }}>
						<EditWrapper stringId="ACCOUNT_SECURITY.OTP.MANUEL_KEY">
							{STRINGS['ACCOUNT_SECURITY.OTP.MANUEL_KEY']}
						</EditWrapper>
					</div>
					<input
						value={otpValue}
						style={{
							backgroundColor: 'rgb(255,255,255, 0)',
							border: 'none',
							borderBottom: '1px solid #ccc',
							width: '100%',
							marginTop: 5,
						}}
						placeholder={STRINGS['ACCOUNT_SECURITY.OTP.MANUEL_PLACEHOLDER']}
						onChange={(e) => {
							setOtpValue(e.target.value);
						}}
					/>
					<div style={{ marginTop: 35 }}>
						<EditWrapper stringId="ACCOUNT_SECURITY.OTP.MANUEL_WARNING">
							{STRINGS['ACCOUNT_SECURITY.OTP.MANUEL_WARNING']}
						</EditWrapper>
					</div>

					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							gap: 15,
							marginTop: 20,
						}}
					>
						<div>
							<RenderBackBtn setStep={setStep} step={1} />
						</div>
					</div>
				</div>
			)}
			{step === 3 && (
				<div>
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
						<RenderBackBtn setStep={setStep} step={2} />
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
	closeDialog
) => {
	return (
		<OtpFormSteps
			secret={secret}
			email={email}
			activateOTP={activateOTP}
			constants={constants}
			ICONS={ICONS}
			closeDialog={closeDialog}
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
			{!otp_enabled && (
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
