import React from 'react';
import { IconTitle, Button } from '../../components';
import STRINGS from '../../config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

const ResetPasswordSuccess = ({
	label,
	onClick,
	icons: ICONS,
	is_loginText = true,
	...rest
}) => {
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
			{is_loginText ? (
				<div className="text-center">
					{STRINGS['RESET_PASSWORD_SUCCESS.TEXT_1']}
					<br />
					{STRINGS['RESET_PASSWORD_SUCCESS.TEXT_2']}
				</div>
			) : (
				<div className="text-center">
					{STRINGS['RESET_PASSWORD_SUCCESS.TEXT_1']}
				</div>
			)}
			<Button label={label} onClick={onClick} className="button-margin" />
		</div>
	);
};
export default withConfig(ResetPasswordSuccess);
