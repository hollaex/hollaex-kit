import React from 'react';
import { IconTitle, Button } from '../../components';
import STRINGS from '../../config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

const ResetPasswordSuccess = ({ onClick, icons: ICONS, ...rest }) => {
	return (
		<div className="auth_wrapper">
			<IconTitle
				iconId="SUCCESS_BLACK"
				iconPath={ICONS['SUCCESS_BLACK']}
				stringId="SUCCESS_TEXT"
				text={STRINGS['SUCCESS_TEXT']}
				textType="title"
				className="w-100"
			/>
			<div className="text-center">
				{STRINGS['RESET_PASSWORD_SUCCESS.TEXT_1']}
				<br />
				{STRINGS['RESET_PASSWORD_SUCCESS.TEXT_2']}
			</div>
			<Button
				label={STRINGS['LOGIN_TEXT']}
				onClick={onClick}
				className="button-margin"
			/>
		</div>
	);
};
export default withConfig(ResetPasswordSuccess);
