import { setNotification, NOTIFICATIONS } from '../../actions/appActions';

export const setWithdrawNotificationSuccess = (data, dispatch) => {
	dispatch(setNotification(NOTIFICATIONS.WITHDRAWAL, { ...data }));
};

export const setWithdrawNotificationError = (error, dispatch) => {
	const message = error._error || JSON.stringify(error);
	dispatch(setNotification(NOTIFICATIONS.ERROR, message));
};

export const setWithdrawEmailConfirmation = (data, dispatch) => {
	dispatch(
		setNotification(NOTIFICATIONS.WITHDRAWAL_EMAIL_CONFIRMATION, { ...data })
	);
};
