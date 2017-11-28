import React from 'react';
import { CurrencyBallWithPrice, ActionNotification } from '../';
import { ICONS } from '../../config/constants';

import STRINGS from '../../config/localizedStrings';

const DepositContent = ({ information, content, amount, symbol, price, openContactForm }) => {
  return (
    <div className="notification-content-wrapper">
      <div className="notification-content-header">
        {information}
        <ActionNotification
          text={STRINGS.NEED_HELP_TEXT}
          status="information"
          iconPath={ICONS.BLUE_QUESTION}
          onClick={openContactForm}
        />
      </div>
      {content}
      <div className="notification-content-block_amount">
        <CurrencyBallWithPrice
          symbol={symbol}
          amount={amount}
          price={price}
        />
      </div>
    </div>
  );
}

export default DepositContent
