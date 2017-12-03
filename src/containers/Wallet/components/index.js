import React from 'react';
import { ActionNotification, IconTitle } from '../../../components';
import DumbField from '../../../components/Form/FormFields/DumbField';
import { generateWalletActionsText, fiatSymbol } from '../../../utils/currency';
import { ICONS, CURRENCIES } from '../../../config/constants';
import STRINGS from '../../../config/localizedStrings';

export const renderDumbField = (data) => <DumbField {...data} />;

export const renderBankInformation = ({ bank_name, account_number, account_owner }, fullWidth = false) => {
  const allowCopy = true;
  const fields = [
    { label: STRINGS.USER_VERIFICATION.BANK_ACCOUNT_FORM.FORM_FIELDS.BANK_NAME_LABEL, value: bank_name, key: 'bank_name', allowCopy, fullWidth },
    { label: STRINGS.USER_VERIFICATION.BANK_ACCOUNT_FORM.FORM_FIELDS.ACCOUNT_OWNER_LABEL, value: account_owner, key: 'account_owner', allowCopy, fullWidth },
    { label: STRINGS.USER_VERIFICATION.BANK_ACCOUNT_FORM.FORM_FIELDS.ACCOUNT_NUMBER_LABEL, value: account_number, key: 'account_number', allowCopy, fullWidth },
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
      {type === 'withdraw' ? withdrawText : depositText}
    </div>
  )
}

export const renderAvailableBalanceText = (symbol, balance) => {
  const { shortName, fullName, formatToCurrency } = CURRENCIES[symbol];
  const available = formatToCurrency(balance[`${symbol}_available`]);

  return (
    <div className="text">
      <p>
        {`${STRINGS.AVAILABLE_TEXT} ${fullName} ${STRINGS.BALANCE_TEXT}: ${available} ${shortName}`}
      </p>
    </div>
  );
}

export const renderNeedHelpAction = (openContactForm) => (
  <ActionNotification
    text={STRINGS.NEED_HELP_TEXT}
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
