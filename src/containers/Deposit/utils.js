import React from 'react';
import QRCode from 'qrcode.react';

import { fiatSymbol } from '../../utils/currency';
import { CURRENCIES } from '../../config/constants';

import {
  renderBankInformation,
  renderDumbField,
  renderCopy,
} from '../Wallet/components';

import {
  BANK_INFORMATION,
  CRYPTO_LABELS,
  MESSAGE_NO_DATA_AVAILABLE,
  MESSAGE_QR_CODE,
  INFORMATION_MESSAGES,
  LIMIT_MESSAGE,
  INCREASE_LIMIT,
} from './constants';

const FIAT_SYMBOL = CURRENCIES[fiatSymbol].currencySymbol;
const FIAT_FORMAT = CURRENCIES[fiatSymbol].formatToCurrency;
const FIAT_SHORT_NAME = CURRENCIES[fiatSymbol].shortName;

export const generateFiatInformation = () => (
  <div className="text">
    {INFORMATION_MESSAGES.map((message, index) => <p key={index}>{message}</p>)}
  </div>
);

const renderBTCContent = (label = '', address = '') => address ? (
  <div className="deposit_info-wrapper d-flex align-items-center">
    <div className="deposit_info-crypto-wrapper">
      {renderDumbField({ label, value: address, fullWidth: true, allowCopy: true })}
    </div>
    <div className="deposit_info-qr-wrapper d-flex align-items-center justify-content-center">
      <div className="qr_code-wrapper d-flex flex-column">
        <QRCode
          value={address}
        />
        <div className="qr-text">{MESSAGE_QR_CODE}</div>
      </div>
    </div>
  </div>
) : <div>{MESSAGE_NO_DATA_AVAILABLE}</div>;

export const renderContent = (symbol, crypto_wallet = {}) => {
  switch (symbol) {
    case fiatSymbol:
      return renderBankInformation(BANK_INFORMATION);
    case 'btc':
      return renderBTCContent(CRYPTO_LABELS.btc, crypto_wallet.bitcoin);
    default:
      return <div>{MESSAGE_NO_DATA_AVAILABLE}</div>;
  }
}

export const renderExtraInformation = (limit = 0) => {
  if (limit === 0) {
    return;
  }

  return (
    <div className="extra_information-wrapper d-flex">
      {`${LIMIT_MESSAGE}: ${FIAT_SYMBOL}${FIAT_FORMAT(limit)} ${FIAT_SHORT_NAME}`}
      <div className="link">({INCREASE_LIMIT})</div>
    </div>
  )
}
