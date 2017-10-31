import React from 'react';
import { ActionNotification, IconTitle } from '../../../components';
import DumbField from '../../../components/Form/FormFields/DumbField';
import { generateWalletActionsText, fiatSymbol } from '../../../utils/currency';
import { ICONS, CURRENCIES } from '../../../config/constants';

const TEXT_BANK_NAME = 'Bank Name';
const TEXT_ACCOUNT_OWNER = 'Bank Account Owner’s Name';
const TEXT_ACCOUNT_NUMBER = 'Bank Account Number';

const TEXT_AVAILABLE = 'Available';
const TEXT_BALANCE = 'Balance';

const TEXT_NEED_HELP = 'need help';

export const renderDumbField = (data) => <DumbField {...data} />;

export const renderBankInformation = ({ bank_name, account_number, account_owner }) => {
  const fields = [
    { label: TEXT_BANK_NAME, value: bank_name, key: 'bank_name', allowCopy: true },
    { label: TEXT_ACCOUNT_OWNER, value: account_owner, key: 'account_owner', allowCopy: true },
    { label: TEXT_ACCOUNT_NUMBER, value: account_number, key: 'account_number', allowCopy: true },
  ];

  return (
    <div className="bank_account-data-wrapper">
      {fields.map((field) => renderDumbField(field))}
    </div>
  );
}



export const renderTitle = (symbol, type = 'withdraw') => {
  const { withdrawText, depositText } = generateWalletActionsText(symbol, true);
  return (
    <div className="title text-capitalize">
      {type === 'withdrawText' ? withdrawText : depositText}
    </div>
  )
}

export const renderAvailableBalanceText = (symbol, balance) => {
  const { shortName, fullName, formatToCurrency } = CURRENCIES[symbol];
  const available = formatToCurrency(balance[`${symbol}_available`]);

  return (
    <div className="text">
      <p>
        {`${TEXT_AVAILABLE} ${fullName} ${TEXT_BALANCE}: ${available} ${shortName}`}
      </p>
    </div>
  );
}

export const renderNeedHelpAction = (openContactForm) => (
  <ActionNotification
    text={TEXT_NEED_HELP}
    status="information"
    iconPath={ICONS.BLUE_QUESTION}
    onClick={openContactForm}
  />
);

export const renderInformation = (symbol, balance, openContactForm, generateFiatInformation) => {
  return (
    <div className="information_block">
      <div className="information_block-text_wrapper">
        {renderTitle(symbol, 'withdraw')}
        {renderAvailableBalanceText(symbol, balance)}
        {symbol === fiatSymbol && generateFiatInformation(CURRENCIES[fiatSymbol])}
      </div>
      {openContactForm && renderNeedHelpAction(openContactForm)}
    </div>
  );
}

export const renderTitleSection = (symbol, type, icon) => {
  const { withdrawText, depositText } = generateWalletActionsText(symbol);
  const text = type === 'withdraw' ? withdrawText : depositText;

  return (
    <IconTitle
      text={text}
      iconPath={icon}
      textType="title"
    />
  )
}
