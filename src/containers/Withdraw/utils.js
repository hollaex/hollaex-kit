import React from 'react';
import { ActionNotification } from '../../components';
import { ICONS, CURRENCIES } from '../../config/constants';
import { generateWalletActionsText, fiatSymbol } from '../../utils/currency';

const MESSAGE_AVAILABLE = 'Available';
const MESSAGE_BALANCE = 'Balance';
const NEED_HELP = 'need help';
const MESSAGE_1 = 'You can only withdraw to a bank account in a name that matches the name registered with your EXIR account.';
const MESSAGE_2 = 'Withdrawal min amount';
const MESSAGE_3 = 'Daily withdrawal max amount';
const MESSAGE_LIMIT = 'Increase your daily limit';

const renderTitle = (symbol) => {
  const { withdrawText } = generateWalletActionsText(symbol, true);
  return (
    <div className="title text-capitalize">
      {withdrawText}
    </div>
  )
}

const renderAvailableBalanceText = (symbol, balance) => {
  const { shortName, fullName, formatToCurrency } = CURRENCIES[symbol];
  const available = formatToCurrency(balance[`${symbol}_available`]);

  return (
    <div className="text">
      <p>
        {`${MESSAGE_AVAILABLE} ${fullName} ${MESSAGE_BALANCE}: ${available} ${shortName}`}
      </p>
    </div>
  );
}

const generateFiatInformation = (currency, limits = {}) => {
  const { minAmount = 2, maxAmount = 10000 } = limits;
  const { currencySymbol, shortName, formatToCurrency } = currency;
  return (
    <div className="text">
      <p>{MESSAGE_1}</p>
      <p>{`${MESSAGE_2}: ${currencySymbol}${formatToCurrency(minAmount)} ${shortName}`}</p>
      <p>{`${MESSAGE_3}: ${currencySymbol}${formatToCurrency(maxAmount)} ${shortName} (${MESSAGE_LIMIT})`}</p>
    </div>
  );
}

export const renderInformation = (symbol, balance, openContactForm) => {
  return (
    <div className="information_block">
      <div className="information_block-text_wrapper">
        {renderTitle(symbol)}
        {renderAvailableBalanceText(symbol, balance)}
        {symbol === fiatSymbol && generateFiatInformation(CURRENCIES[fiatSymbol])}
      </div>
      <ActionNotification
        text={NEED_HELP}
        status="information"
        iconPath={ICONS.BLUE_QUESTION}
        onClick={openContactForm}
      />
    </div>
  );
}
