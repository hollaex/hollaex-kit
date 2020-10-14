import React from 'react';
import { Button } from '../';
import { ICONS } from '../../config/constants';
import { NotificationWraper, NotificationContent } from './Notification';

import STRINGS from '../../config/localizedStrings';

const LogoutNotification = ({ onClose }) => {
	return (
		<NotificationWraper
			title={STRINGS["CONTACT_FORM.SUCCESS_TITLE"]}
			icon={ICONS.EMAIL_SENT}
			className="contact-form-notification"
		>
			<NotificationContent>
				{STRINGS["CONTACT_FORM.SUCCESS_MESSAGE_1"]}
				<br />
				{STRINGS["CONTACT_FORM.SUCCESS_MESSAGE_2"]}
			</NotificationContent>
			<Button label={STRINGS["CLOSE_TEXT"]} onClick={onClose} />
		</NotificationWraper>
	);
};

export default LogoutNotification;
