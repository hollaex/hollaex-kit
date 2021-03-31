import React from 'react';

import { Button } from '../';
import STRINGS from '../../config/localizedStrings';
import { NotificationWraper, NotificationContent } from './Notification';
import { EditWrapper } from 'components';

const getTitleAndIcon = (type, ICONS) => {
	const data = {
		iconId: '',
		stringId: '',
		icon: '',
		title: '',
	};

	if (type === 'skip') {
		data.iconId = 'VERIFICATION_WARNING';
		data.icon = ICONS['VERIFICATION_WARNING'];
		data.title = STRINGS['VERIFICATION_NOTIFICATION_SKIP_TITLE'];
		data.stringId = 'VERIFICATION_NOTIFICATION_SKIP_TITLE';
	} else if (type === 'complete') {
		data.iconId = 'VERIFICATION_SUCCESS';
		data.icon = ICONS['VERIFICATION_SUCCESS'];
		data.title = STRINGS['VERIFICATION_NOTIFICATION_SUCCESS_TITLE'];
		data.stringId = 'VERIFICATION_NOTIFICATION_SUCCESS_TITLE';
	}

	return data;
};

const VerificationNotification = ({ data: { type, onClick }, icons }) => {
	const notificationProps = getTitleAndIcon(type, icons);
	return (
		<NotificationWraper
			{...notificationProps}
			className="notification_verification"
		>
			<NotificationContent>
				<EditWrapper
					stringId={
						type === 'skip'
							? 'VERIFICATION_NOTIFICATION_SKIP_TEXT'
							: 'VERIFICATION_NOTIFICATION_SUCCESS_TEXT'
					}
				>
					{type === 'skip'
						? STRINGS['VERIFICATION_NOTIFICATION_SKIP_TEXT']
						: STRINGS['VERIFICATION_NOTIFICATION_SUCCESS_TEXT']}
				</EditWrapper>
			</NotificationContent>
			<EditWrapper stringId="VERIFICATION_NOTIFICATION_BUTTON" />
			<Button
				label={STRINGS['VERIFICATION_NOTIFICATION_BUTTON']}
				onClick={onClick}
			/>
		</NotificationWraper>
	);
};

export default VerificationNotification;
