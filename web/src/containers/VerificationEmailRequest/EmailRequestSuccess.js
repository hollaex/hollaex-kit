import React from 'react';
import classnames from 'classnames';
import { IconTitle, Button } from '../../components';
import STRINGS from '../../config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { FLEX_CENTER_CLASSES } from '../../config/constants';

const EmailRequestSuccess = ({ onClick, icons: ICONS, ...rest }) => {
	return (
		<div
			className={classnames(
				...FLEX_CENTER_CLASSES,
				'signup_success-wrapper',
				'flex-column',
				'h-100',
				'auth_wrapper'
			)}
		>
			<IconTitle
				stringId="VERIFICATION_EMAIL_REQUEST_SUCCESS.TITLE"
				iconId="VERIFICATION_SENT"
				iconPath={ICONS['VERIFICATION_SENT']}
				text={STRINGS['VERIFICATION_EMAIL_REQUEST_SUCCESS.TITLE']}
				textType="title"
				className="w-100"
			/>
			<div className="signup_success-content">
				<p>{STRINGS['VERIFICATION_EMAIL_REQUEST_SUCCESS.TEXT_1']}</p>
			</div>
			<Button label={STRINGS['CONTACT_US_TEXT']} onClick={onClick} />
		</div>
	);
};
export default withConfig(EmailRequestSuccess);
