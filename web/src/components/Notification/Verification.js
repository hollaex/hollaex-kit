import React from 'react';

import { Button } from '../';
import { ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';
import { NotificationWraper, NotificationContent } from './Notification';

const getTitleAndIcon = (type) => {
	const data = {
		icon: '',
		title: ''
	};

	if (type === 'skip') {
		data.icon = ICONS.VERIFICATION_WARNING;
		data.title = STRINGS["VERIFICATION_NOTIFICATION_SKIP_TITLE"];
	} else if (type === 'complete') {
		data.icon = ICONS.VERIFICATION_SUCCESS;
		data.title = STRINGS["VERIFICATION_NOTIFICATION_SUCCESS_TITLE"];
	}

	return data;
};

const VerificationNotification = ({ data: { type, onClick } }) => {
	const notificationProps = getTitleAndIcon(type);
	return (
		<NotificationWraper
			{...notificationProps}
			className="notification_verification"
		>
			<NotificationContent>
				{type === 'skip'
					? STRINGS["VERIFICATION_NOTIFICATION_SKIP_TEXT"]
					: STRINGS["VERIFICATION_NOTIFICATION_SUCCESS_TEXT"]}
			</NotificationContent>
			<Button
				label={STRINGS["VERIFICATION_NOTIFICATION_BUTTON"]}
				onClick={onClick}
			/>
		</NotificationWraper>
	);
};

export default VerificationNotification;
