import React from 'react';
import { setNotification, NOTIFICATIONS } from '../../actions/appActions';
import { BLOCKTRAIL_ENDPOINT } from '../../config/constants';

export const setWithdrawNotificationSuccess = (data, dispatch) => {
  const message = (
    <div className="text-center">
      <h2>Success!</h2>
      <p>Your bitcoins have been sent</p>
      {/*data.transaction_id &&
        <div className="notification-link-wrapper">
          <a
            href={`${BLOCKTRAIL_ENDPOINT}${data.transaction_id}`}
            target="_blank"
            className="notification-link"
          >
            {data.transaction_id}
          </a>
        </div>
      */}
    </div>
  );

  dispatch(setNotification(NOTIFICATIONS.WITHDRAWAL, message));
}

export const setWithdrawNotificationError = (error, dispatch) => {
  const message = error._error || JSON.stringify(error);
  dispatch(setNotification(NOTIFICATIONS.ERROR, message));
}
