import React from 'react';
import { IconTitle, Button } from '../../components';
import { ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

const ResetPasswordSuccess = ({ onClick, ...rest }) => {
	return (
		<div className="auth_wrapper">
			<IconTitle
				iconPath={ICONS.SUCCESS_BLACK}
				text={STRINGS.SUCCESS_TEXT}
				textType="title"
				className="w-100"
				useSvg={true}
			/>
			<div className="text-center">
				{STRINGS["RESET_PASSWORD_SUCCESS.TEXT_1"]}
				<br />
				{STRINGS["RESET_PASSWORD_SUCCESS.TEXT_2"]}
			</div>
			<Button
				label={STRINGS.LOGIN_TEXT}
				onClick={onClick}
				className="button-margin"
			/>
		</div>
	);
};
export default ResetPasswordSuccess;
