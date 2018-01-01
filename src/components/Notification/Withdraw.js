import React from 'react';
import { NotificationWraper, NotificationContent, InformationRow } from './Notification';
import { ICONS, BLOCKTRAIL_ENDPOINT } from '../../config/constants';
import { Button } from '../';

import STRINGS from '../../config/localizedStrings';

const WithdrawNotification = ({ data, onClose }) => {
  const notificationProps = {
    icon: ICONS[`COIN_WITHDRAW_${data.currency.toUpperCase()}`] || ICONS.COIN_WITHDRAW_FIAT,
    title: STRINGS.SUCCESS_TEXT,
  }

  return (
    <NotificationWraper {...notificationProps} className="notification-withdrawal text-center">
      <NotificationContent>
        {data.transaction_id &&
          <div>
            <span>{STRINGS.WITHDRAW_NOTIFICATION_TRANSACTION_ID}</span>
            <div className="notification-link-wrapper">
              <a
                href={`${BLOCKTRAIL_ENDPOINT}${data.transaction_id}`}
                target="_blank"
                className="notification-link"
              >
                {data.transaction_id}
              </a>
            </div>
          </div>
        }
      </NotificationContent>
      <Button
        label={STRINGS.CLOSE_TEXT}
        onClick={onClose}
      />
    </NotificationWraper>
  );
}

export default WithdrawNotification;
