import React from 'react';
import { Button } from '../';
import { NotificationWraper, NotificationContent } from './Notification';

import STRINGS from '../../config/localizedStrings';

const ERROR_DENIED = 'Error Denied: ';
const ERROR_INVALID_TOKEN = 'Invalid token';
const ERROR_INVALID_IP = 'Login again';
export const ERROR_TOKEN_EXPIRED = 'Token is expired';
const ERROR_INACTIVE = 'Inactive';

const getMessage = (message = '') => {
	const indexOfError = message.indexOf(ERROR_DENIED);
	let errorMessage = message;
	if (indexOfError === 0) {
		errorMessage = message.substring(ERROR_DENIED.length);
	}

	switch (errorMessage) {
		case ERROR_TOKEN_EXPIRED:
			return STRINGS['LOGOUT_ERROR_TOKEN_EXPIRED'];
		case ERROR_INVALID_IP:
			return STRINGS['LOGOUT_ERROR_LOGIN_AGAIN'];
		case ERROR_INACTIVE:
			return STRINGS['LOGOUT_ERROR_INACTIVE'];
		case ERROR_INVALID_TOKEN:
		default:
			return STRINGS['LOGOUT_ERROR_INVALID_TOKEN'];
	}
};

const LogoutNotification = ({ data, onClose, icons: ICONS }) => {
	return (
		<NotificationWraper
			title={STRINGS['LOGOUT_TITLE']}
			icon={ICONS['SESSION_TIMED_OUT']}
			className="logout-notification"
		>
			<NotificationContent>{getMessage(data.message)}</NotificationContent>
			<Button label={STRINGS['CLOSE_TEXT']} onClick={onClose} />
		</NotificationWraper>
	);
};

export default LogoutNotification;
