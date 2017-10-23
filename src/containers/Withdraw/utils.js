import React from 'react';
import { Accordion } from '../../components';
import { ICONS, CURRENCIES } from '../../config/constants';
import { generateWalletActionsText, fiatSymbol } from '../../utils/currency';
import DumbField from '../../components/Form/FormFields/DumbField';

import {
  renderBankInformation,
  renderTitle,
  renderAvailableBalanceText,
  renderNeedHelpAction,
} from '../Wallet/components';

const FIAT_SYMBOL = CURRENCIES[fiatSymbol].currencySymbol;
const FIAT_FORMAT = CURRENCIES[fiatSymbol].formatToCurrency;

const MESSAGE_1 = 'You can only withdraw to a bank account in a name that matches the name registered with your EXIR account.';
const MESSAGE_2 = 'Withdrawal min amount';
const MESSAGE_3 = 'Daily withdrawal max amount';
const MESSAGE_LIMIT = 'Increase your daily limit';

const MESSAGE_FEE_TRANSACTION_1 = 'Transactions fee of';
const MESSAGE_FEE_TRANSACTION_2 = 'included in withdrawal';

export const generateFiatInformation = (currency, limits = {}) => {
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

export const generateFeeMessage = (fee, price, symbol) => {
  const { shortName, formatToCurrency } = CURRENCIES[symbol];
  const fiatFee = fee;
  return `${MESSAGE_FEE_TRANSACTION_1} ${formatToCurrency(fee)} ${shortName} (${FIAT_SYMBOL} ${FIAT_FORMAT(fiatFee)}) ${MESSAGE_FEE_TRANSACTION_2}`;
}

export const renderExtraInformation = (symbol, bank_account) => symbol === fiatSymbol && (
  <div className="bank_account-information-wrapper">
    <Accordion
      sections={[
        {
          title: 'Bank to Withdraw to:',
          content: renderBankInformation(bank_account),
          notification: {
            text: 'need help',
            status: 'information',
            iconPath: ICONS.BLUE_QUESTION,
            allowClick: true,
          }
        }
      ]}
    />
  </div>
);
