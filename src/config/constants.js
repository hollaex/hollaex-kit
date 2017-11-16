import config from './index'
import { formatBtcAmount, formatFiatAmount } from '../utils/string';

import STRINGS from './localizedStrings';

export const ENV = process.env.NODE_ENV || 'development'
export const NETWORK = process.env.REACT_APP_NETWORK || 'testnet'

export const APP_TITLE = STRINGS.APP_TITLE;

export const TOKEN_TIME = 24 * 60 * 60 * 1000; // 1 hour
export const SESSION_TIME = 60 * 60 * 1000; // 1 hour
export const API_URL = config[ENV][NETWORK].API_URL;
export const WS_URL = config[ENV][NETWORK].WS_URL;

export const ICONS = {
  USER: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-01.png`,
  FINGERPRINT: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-02.png`,
  LOCK: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-03.png`,
  BELL: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-04.png`,
  LIFESAVER: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-05.png`,
  CHECK: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-06.png`,
  BLUE_PLUS: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-07.png`,
  BLUE_QUESTION: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-08.png`,
  RED_WARNING: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-09.png`,
  GENDER_F: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-10.png`,
  GENDER_M: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-11.png`,
  BITCOIN_CLEAR: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-13.png`,
  BITCOIN_DARK: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-14.png`,
  USER_DARK: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-12.png`,
  USER_WHITE: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-15.png`,
  RED_ARROW: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-16.png`,
  BLUE_CLIP: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-17.png`,
  GREY_RIGHT_TRIANGLE: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-18.png`,
  BLACK_CHECK: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-19.png`,
  WHITE_CHECK: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-20.png`,
  BALCK_CORNER_TRIANGLE: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-21.png`,
  KEYS: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-22.png`,
  GREEN_CHECK: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-23.png`,
  LETTER: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-24.png`,
  SQUARE_DOTS: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-25.png`,
  COPY: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-26.png`,
  LOGOUT: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-27.png`,
}

export const SOCIAL_ICONS = {
  FACEBOOK: `${process.env.PUBLIC_URL}/assets/icons/facebook.png`,
  LINKEDIN: `${process.env.PUBLIC_URL}/assets/icons/linkedin.png`,
  TWIITER: `${process.env.PUBLIC_URL}/assets/icons/twitter.png`,
  GOOGLE: `${process.env.PUBLIC_URL}/assets/icons/google.png`,
};

export const EXIR_LOGO = `${process.env.PUBLIC_URL}/assets/logo/logo-default.png`;

export const CURRENCIES = {
  fiat: {
    symbol: 'fiat',
    name: STRINGS.FIAT_NAME,
    fullName: STRINGS.FIAT_FULLNAME,
    shortName: STRINGS.FIAT_SHORTNAME,
    currencySymbol: STRINGS.FIAT_CURRENCY_SYMBOL,
    formatToCurrency: formatFiatAmount,
    iconPath: '/assets/acounts/account-icons-14.png',
  },
  btc: {
    symbol: 'btc',
    name: STRINGS.BTC_NAME,
    fullName: STRINGS.BTC_FULLNAME,
    shortName: STRINGS.BTC_SHORTNAME,
    currencySymbol: 'B',
    formatToCurrency: formatBtcAmount,
    iconPath: '/assets/acounts/account-icons-14.png',
  },
}

export const FLEX_CENTER_CLASSES = ['d-flex', 'justify-content-center', 'align-items-center'];

export const TIMESTAMP_FORMAT = STRINGS.TIMESTAMP_FORMAT;
export const HOUR_FORMAT = STRINGS.HOUR_FORMAT;

export const LIMIT_VALUES = {
  PRICE: {
    MIN: 100,
    MAX: 10000,
  },
  SIZE: {
    MIN: 0.0001,
    MAX: 21000000,
  }
};

export const DEPOSIT_LIMITS = {
  fiat: {
    DAILY: 100000,
    MIN: 1000,
    MAX: 100000,
  }
};

export const TOKEN_KEY = `${ENV}_${NETWORK}_TOKEN`;
export const LANGUAGE_KEY = `${ENV}_${NETWORK}_LANGUAGE`;

export const BANK_INFORMATION = {
  bank_name: process.env.BANK_NAME || 'Exir Trade',
  account_owner: process.env.ACCOUNT_OWNER || 'Bank Melli',
  account_number: process.env.ACCOUNT_NUMBER || '2313-0631-2313-3121',
};

export const BANK_PAYMENT_LINK = 'https://api.moneyar.com/IPG/default.aspx?uid=';
