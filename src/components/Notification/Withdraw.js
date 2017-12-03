import React from 'react';
import { CurrencyBallWithPrice, ActionNotification } from '../';
import { ICONS } from '../../config/constants';

import STRINGS from '../../config/localizedStrings';

const WithdrawContent = ({ information, content, amount, symbol, price, openContactForm }) => {
  return (
    <div className="notification-content-wrapper">
      {content}
    </div>
  );
}

export default WithdrawContent;
