import React from 'react';
import { Accordion } from '../../components';
import { ICONS, CURRENCIES } from '../../config/constants';
import { generateWalletActionsText, fiatSymbol } from '../../utils/currency';
import DumbField from '../../components/Form/FormFields/DumbField';
import STRINGS from '../../config/localizedStrings';

import {
  renderBankInformation,
  renderTitle,
  renderAvailableBalanceText,
  renderNeedHelpAction,
} from '../Wallet/components';

const FIAT_SYMBOL = CURRENCIES[fiatSymbol].currencySymbol;
const FIAT_FORMAT = CURRENCIES[fiatSymbol].formatToCurrency;

export const generateFiatInformation = (currency, limits = {}) => {
  const { minAmount = 2, maxAmount = 10000 } = limits;
  const { currencySymbol, shortName, formatToCurrency } = currency;
  return (
    <div className="text">
      <p>{STRINGS.WITHDRAW_PAGE.FIAT_MESSAGE_1}</p>
      <p>{`${STRINGS.WITHDRAW_PAGE.FIAT_MESSAGE_2}: ${currencySymbol}${formatToCurrency(minAmount)} ${shortName}`}</p>
      <p>{`${STRINGS.WITHDRAW_PAGE.FIAT_MESSAGE_3}: ${currencySymbol}${formatToCurrency(maxAmount)} ${shortName} (${STRINGS.WITHDRAW_PAGE.MESSAGE_LIMIT})`}</p>
    </div>
  );
}

export const generateFeeMessage = (fee, price, symbol) => {
  const { shortName, formatToCurrency } = CURRENCIES[symbol];
  const fiatFee = fee;
  return STRINGS.formatString(STRINGS.WITHDRAW_PAGE.MESSAGE_FEE, `${formatToCurrency(fee)} ${shortName}`, `${FIAT_SYMBOL} ${FIAT_FORMAT(fiatFee)}`)
}

export const renderExtraInformation = (symbol, bank_account) => symbol === fiatSymbol && (
  <div className="bank_account-information-wrapper">
    <Accordion
      sections={[
        {
          title: STRINGS.WITHDRAW_PAGE.BANK_TO_WITHDRAW,
          content: renderBankInformation(bank_account),
          notification: {
            text: STRINGS.NEED_HELP_TEXT,
            status: 'information',
            iconPath: ICONS.BLUE_QUESTION,
            allowClick: true,
          }
        }
      ]}
    />
  </div>
);
