import React from 'react';
import { Button } from '../';
import { NotificationWraper, NotificationContent } from './Notification';
import { EditWrapper } from 'components';

import STRINGS from '../../config/localizedStrings';

const ContactFormNotification = ({ onClose, icons: ICONS }) => {
	return (
		<NotificationWraper
			title={STRINGS['CONTACT_FORM.SUCCESS_TITLE']}
			icon={ICONS['EMAIL_SENT']}
			className="contact-form-notification"
		>
			<NotificationContent>
				<EditWrapper stringId="CONTACT_FORM.SUCCESS_MESSAGE_1">
					{STRINGS['CONTACT_FORM.SUCCESS_MESSAGE_1']}
				</EditWrapper>
				<br />
				<EditWrapper stringId="CONTACT_FORM.SUCCESS_MESSAGE_2">
					{STRINGS['CONTACT_FORM.SUCCESS_MESSAGE_2']}
				</EditWrapper>
			</NotificationContent>
			<Button label={STRINGS['CLOSE_TEXT']} onClick={onClose} />
		</NotificationWraper>
	);
};

export default ContactFormNotification;
