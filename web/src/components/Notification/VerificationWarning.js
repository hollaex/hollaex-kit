import React from 'react';
import { ICONS } from 'config/constants';
import { NotificationWraper } from './Notification';
import STRINGS from 'config/localizedStrings';

const VerificationWarningNotification = ({}) => {
	return (
		<NotificationWraper
			title={STRINGS['VERIFICATION_WARNING_TITLE']}
			icon={ICONS.NOTIFICATION_VERIFICATION_WARNING}
		/>
	);
};

export default VerificationWarningNotification;
