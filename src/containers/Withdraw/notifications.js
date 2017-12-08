import React from 'react';
import { setNotification, NOTIFICATIONS } from '../../actions/appActions';

export const setWithdrawNotificationSuccess = (data, dispatch) => {
  const message = (
    <div className="text-center">
      <h2>Success!</h2>
      <p>Your bitcoins have been sent</p>
    </div>
  );

  dispatch(setNotification(NOTIFICATIONS.WITHDRAWAL, message));
}

export const setWithdrawNotificationError = (error, dispatch) => {
  const message = error._error || JSON.stringify(error);
  dispatch(setNotification(NOTIFICATIONS.ERROR, message));
}
