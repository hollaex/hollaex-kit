import React from 'react';
import { CurrencyBallWithPrice, ActionNotification } from '../';
import { ICONS } from '../../config/constants';

import STRINGS from '../../config/localizedStrings';

const WithdrawNotification = ({ type, data }) => {
  return (
    <div className="notification-content-wrapper">
      {data}
    </div>
  );
}

export default WithdrawNotification;
