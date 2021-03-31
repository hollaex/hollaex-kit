import React from 'react';
import { MIN_LEVEL_FOR_TOKENS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';
import { FieldError } from '../../components/Form/FormFields/FieldWrapper';
import ApiKeyContainer from './ApiKey';
import DumbField from '../../components/Form/FormFields/DumbField';
import { EditWrapper } from 'components';

const NoLevel = () => (
	<div className="mt-4 mb-4 apply_rtl">
		<EditWrapper stringId="DEVELOPER_SECTION.INVALID_LEVEL">
			{STRINGS['DEVELOPER_SECTION.INVALID_LEVEL']}
		</EditWrapper>
	</div>
);

export const NoOtpEnabled = ({ openOtp }) => (
	<div>
		<div className="mb-2">
			<EditWrapper stringId="DEVELOPER_SECTION.INFORMATION_TEXT">
				{STRINGS['DEVELOPER_SECTION.INFORMATION_TEXT']}
			</EditWrapper>
		</div>
		<div className="mb-2">
			<FieldError
				stringId="DEVELOPER_SECTION.ERROR_INACTIVE_OTP"
				error={STRINGS['DEVELOPER_SECTION.ERROR_INACTIVE_OTP']}
				displayError={true}
				className="input_block-error-wrapper apply_rtl warning_text"
			/>
		</div>
		<div className="mb-4 mt-4 blue-link pointer" onClick={openOtp}>
			<EditWrapper stringId="DEVELOPER_SECTION.ENABLE_2FA">
				{STRINGS['DEVELOPER_SECTION.ENABLE_2FA']}
			</EditWrapper>
		</div>
	</div>
);

export const OtpEnabled = ({ fetching, openDialog }) => (
	<div>
		<div className="mb-2">
			<EditWrapper stringId="DEVELOPER_SECTION.INFORMATION_TEXT">
				{STRINGS['DEVELOPER_SECTION.INFORMATION_TEXT']}
			</EditWrapper>
		</div>
		<div className="mb-2">
			<EditWrapper stringId="DEVELOPER_SECTION.WARNING_TEXT">
				{STRINGS['DEVELOPER_SECTION.WARNING_TEXT']}
			</EditWrapper>
		</div>
		{!fetching && (
			<div className="mb-4 mt-4 blue-link pointer" onClick={openDialog}>
				<EditWrapper stringId="DEVELOPER_SECTION.GENERATE_KEY">
					{STRINGS['DEVELOPER_SECTION.GENERATE_KEY']}
				</EditWrapper>
			</div>
		)}
	</div>
);

export const PopupInfo = ({ type }) => {
	return (
		<div className="popup_info-wrapper mb-4">
			<div className="popup_info-title pb-1">
				<EditWrapper
					stringId={`DEVELOPERS_TOKENS_POPUP.${type.toUpperCase()}_TITLE`}
				>
					{STRINGS[`DEVELOPERS_TOKENS_POPUP.${type.toUpperCase()}_TITLE`]}
				</EditWrapper>
			</div>
			<div className="popup_info-text mt-2">
				<EditWrapper
					stringId={`DEVELOPERS_TOKENS_POPUP.${type.toUpperCase()}_TEXT`}
				>
					{STRINGS[`DEVELOPERS_TOKENS_POPUP.${type.toUpperCase()}_TEXT`]}
				</EditWrapper>
			</div>
		</div>
	);
};

export const TokenCreatedInfo = ({ token }) => {
	const props_api_key = {
		stringId: 'DEVELOPERS_TOKENS_POPUP.API_KEY_LABEL',
		label: STRINGS['DEVELOPERS_TOKENS_POPUP.API_KEY_LABEL'],
		className: 'token-value-input',
		value: token.tokenKey,
		fullWidth: true,
		allowCopy: true,
	};
	const props_secret_key = {
		stringId: 'DEVELOPERS_TOKENS_POPUP.SECRET_KEY_LABEL',
		label: STRINGS['DEVELOPERS_TOKENS_POPUP.SECRET_KEY_LABEL'],
		className: 'token-value-input',
		value: token.secret,
		fullWidth: true,
		allowCopy: true,
	};
	return (
		<div className="popup_info-wrapper mb-4">
			<div className="popup_info-title pb-1">
				<EditWrapper stringId="DEVELOPERS_TOKENS_POPUP.CREATED_TITLE">
					{STRINGS['DEVELOPERS_TOKENS_POPUP.CREATED_TITLE']}
				</EditWrapper>
			</div>
			<div className="popup_info-text mt-2">
				<EditWrapper stringId="DEVELOPERS_TOKENS_POPUP.CREATED_TEXT_1">
					{STRINGS['DEVELOPERS_TOKENS_POPUP.CREATED_TEXT_1']}
				</EditWrapper>
				<br />
				<EditWrapper stringId="DEVELOPERS_TOKENS_POPUP.CREATED_TEXT_2">
					{STRINGS['DEVELOPERS_TOKENS_POPUP.CREATED_TEXT_2']}
				</EditWrapper>
			</div>
			<div className="mt-4">
				<DumbField {...props_api_key} />
			</div>
			<div className="mt-4">
				<DumbField {...props_secret_key} />
			</div>
		</div>
	);
};

export const DeveloperSection = ({ verification_level, ...rest }) => {
	let content;
	if (verification_level < MIN_LEVEL_FOR_TOKENS) {
		content = <NoLevel />;
	} else {
		content = <ApiKeyContainer {...rest} />;
	}
	return (
		<div className="mt-4 mb-4 apply_rtl dev-section-wrapper">{content}</div>
	);
};
