export const BANK_INFORMATION = {
  bank_name: 'Exir Trade',
  account_owner: 'Bank Melli',
  account_number: '2313-0631-2313-3121',
};
import STRINGS from '../../config/localizedStrings';

const { DEPOSIT } = STRINGS;

export const CRYPTO_LABELS = {
  btc: DEPOSIT.CRYPTO_LABELS.BTC,
};

export const INFORMATION_MESSAGES = DEPOSIT.INFORMATION_MESSAGES;

export const LIMIT_MESSAGE = DEPOSIT.LIMIT_MESSAGE;
export const INCREASE_LIMIT = DEPOSIT.INCREASE_LIMIT;

export const DEPOSIT_LIMITS = {
  fiat: {
    DAILY: 10000,
  }
};

export const MESSAGE_QR_CODE = DEPOSIT.QR_CODE;

export const MESSAGE_NO_DATA_AVAILABLE = DEPOSIT.NO_DATA;
