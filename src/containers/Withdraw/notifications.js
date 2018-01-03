import React from 'react';
import { setNotification, NOTIFICATIONS } from '../../actions/appActions';
import { BLOCKTRAIL_ENDPOINT } from '../../config/constants';

export const setWithdrawNotificationSuccess = (data, dispatch) => {
	dispatch(
		setNotification(NOTIFICATIONS.WITHDRAWAL, { ...data, currency: 'btc' })
	);
};

export const setWithdrawNotificationError = (error, dispatch) => {
	const message = error._error || JSON.stringify(error);
	dispatch(setNotification(NOTIFICATIONS.ERROR, message));
};
