import React from 'react';
import { ActionNotification, Accordion } from '../../components';
import { ICONS, CURRENCIES } from '../../config/constants';
import { generateWalletActionsText, fiatSymbol } from '../../utils/currency';
import DumbField from '../../components/Form/FormFields/DumbField';

const FIAT_SYMBOL = CURRENCIES[fiatSymbol].currencySymbol;
const FIAT_FORMAT = CURRENCIES[fiatSymbol].formatToCurrency;

const MESSAGE_AVAILABLE = 'Available';
const MESSAGE_BALANCE = 'Balance';
const NEED_HELP = 'need help';
const MESSAGE_1 = 'You can only withdraw to a bank account in a name that matches the name registered with your EXIR account.';
const MESSAGE_2 = 'Withdrawal min amount';
const MESSAGE_3 = 'Daily withdrawal max amount';
const MESSAGE_LIMIT = 'Increase your daily limit';

const MESSAGE_FEE_TRANSACTION_1 = 'Transactions fee of';
const MESSAGE_FEE_TRANSACTION_2 = 'included in withdrawal';

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

export const generateFeeMessage = (fee, price, symbol) => {
  const { shortName, formatToCurrency } = CURRENCIES[symbol];
  const fiatFee = fee;
  return `${MESSAGE_FEE_TRANSACTION_1} ${formatToCurrency(fee)} ${shortName} (${FIAT_SYMBOL} ${FIAT_FORMAT(fiatFee)}) ${MESSAGE_FEE_TRANSACTION_2}`;
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

const renderBankInformation = ({ bank_name, account_number, account_owner }) => {
  return (
    <div className="bank_account-data-wrapper">
      <DumbField
        label="Bank Name"
        value={bank_name}
      />
      <DumbField
        label="Bank Account Owner’s Name"
        value={account_owner}
      />
      <DumbField
        label="Bank Account Number"
        value={account_number}
      />
    </div>
  )
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
