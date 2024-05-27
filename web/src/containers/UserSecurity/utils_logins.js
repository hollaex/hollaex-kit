import React from 'react';
import { Button } from 'antd';
import { getFormatTimestamp } from 'utils/utils';
import STRINGS from 'config/localizedStrings';
import { EditWrapper } from 'components';

export const generateLogins = () => {
	return [
		{
			label: STRINGS['ACCOUNT_SECURITY.LOGIN.IP_ADDRESS'],
			key: 'ip',
			renderCell: ({ ip }, key, index) => {
				return <td key={index}>{ip}</td>;
			},
		},
		{
			label: STRINGS['ACCOUNT_SECURITY.LOGIN.TIME'],
			key: 'timestamp',
			renderCell: ({ timestamp }, key, index) => {
				return <td key={index}>{getFormatTimestamp(timestamp)}</td>;
			},
		},
	];
};

export const RenderBtn = ({ closeDialog, setStep, step, goBack, label }) => {
	return (
		<div className="btn-wrapper">
			<Button
				onClick={() => {
					closeDialog ? closeDialog() : setStep(goBack);
				}}
				className="back-btn"
			>
				<EditWrapper stringId="ACCOUNT_SECURITY.OTP.BACK">
					{STRINGS['ACCOUNT_SECURITY.OTP.BACK']}
				</EditWrapper>
			</Button>
			<Button
				onClick={() => {
					setStep(step);
				}}
				className="proceed-btn"
			>
				<EditWrapper stringId={label}>{STRINGS[label]}</EditWrapper>
			</Button>
		</div>
	);
};

export const RenderBackBtn = ({ setStep, setErrorMsg, setOtpValue, step }) => {
	return (
		<Button
			onClick={() => {
				setStep(step);
				setErrorMsg('');
				setOtpValue('');
			}}
			className="back-btn"
		>
			<EditWrapper stringId="ACCOUNT_SECURITY.OTP.BACK">
				{STRINGS['ACCOUNT_SECURITY.OTP.BACK']}
			</EditWrapper>
		</Button>
	);
};
