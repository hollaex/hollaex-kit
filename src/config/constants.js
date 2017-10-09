import config from './index'
import { formatBtcAmount, formatFiatAmount } from '../utils/string';

export const ENV = process.env.NODE_ENV || 'development'
export const NETWORK = process.env.REACT_APP_NETWORK || 'testnet'

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
}

export const CURRENCIES = {
  btc: {
    symbol: 'btc',
    name: 'Bitcoin',
    currencySymbol: 'B',
    formatToCurrency: formatBtcAmount,
    iconPath: '/assets/acounts/account-icons-14.png',
  },
  fiat: {
    symbol: 'fiat',
    name: 'Dollar',
    currencySymbol: '$',
    formatToCurrency: formatFiatAmount,
    iconPath: '/assets/acounts/account-icons-14.png',
  },
}
