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
  COPY_NEW: `${process.env.PUBLIC_URL}/assets/images/copy.svg`,
  COPY: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-26.png`,
  LOGOUT: `${process.env.PUBLIC_URL}/assets/acounts/account-icons-27.png`,
  LOGO_BLUE: `${process.env.PUBLIC_URL}/assets/logo-blue-exir.svg`,
  LOGO_GREY: `${process.env.PUBLIC_URL}/assets/images/EXIR-grey-login.svg`,
  BACKGROUND_LARGE: `${process.env.PUBLIC_URL}/assets/background-site-large.jpg`,
  BACKGROUND_SMALL: `${process.env.PUBLIC_URL}/assets/background-site-smaller.jpg`,
  ACCOUNT_LINE: `${process.env.PUBLIC_URL}/assets/images/account.svg`,
  ACCOUNT_RECOVERY: `${process.env.PUBLIC_URL}/assets/images/account-recovery.svg`,
  BITCOIN_WALLET: `${process.env.PUBLIC_URL}/assets/images/bitcoin-wallet.svg`,
  CHECK_SENDING_BITCOIN: `${process.env.PUBLIC_URL}/assets/images/check-sending-bitcoin.svg`,
  DATA: `${process.env.PUBLIC_URL}/assets/images/data.svg`,
  DEPOSIT_BITCOIN: `${process.env.PUBLIC_URL}/assets/images/deposit-bitcoin.svg`,
  DEPOSIT_HISTORY: `${process.env.PUBLIC_URL}/assets/images/deposit-history.svg`,
  DEPOSIT_HISTORY_GREY: `${process.env.PUBLIC_URL}/assets/images/deposit-history-grey.svg`,
  DEPOSIT_RECEIVED_BITCOIN: `${process.env.PUBLIC_URL}/assets/images/deposit-received-bitcoin.svg`,
  DEPOSIT_SUCCESS: `${process.env.PUBLIC_URL}/assets/images/D-W-Success.svg`,
  WITHDRAWAL_SUCCESS: `${process.env.PUBLIC_URL}/assets/images/D-W-Success.svg`,
  EMAIL: `${process.env.PUBLIC_URL}/assets/images/email.svg`,
  EMAIL_SENT: `${process.env.PUBLIC_URL}/assets/images/email-sent.svg`,
  OTP_DOTS: `${process.env.PUBLIC_URL}/assets/images/f2fa-pin.svg`,
  DEPOSIT_FIAT: `${process.env.PUBLIC_URL}/assets/images/fiat-deposit.svg`,
  DEPOSIT_FIAT_COMPLETE: `${process.env.PUBLIC_URL}/assets/images/fiat-deposit-completed.svg`,
  FIAT_WALLET: `${process.env.PUBLIC_URL}/assets/images/fiat-wallet.svg`,
  GEAR_BLACK: `${process.env.PUBLIC_URL}/assets/images/gear.svg`,
  GEAR_GREY: `${process.env.PUBLIC_URL}/assets/images/gear-grey.svg`,
  HELP_ICON: `${process.env.PUBLIC_URL}/assets/images/help.svg`,
  ID_BLACK: `${process.env.PUBLIC_URL}/assets/images/id.svg`,
  ID_GREY: `${process.env.PUBLIC_URL}/assets/images/id-grey.svg`,
  INCOMING_BITCOIN: `${process.env.PUBLIC_URL}/assets/images/Incoming-bitcoin.svg`,
  LICENSE: `${process.env.PUBLIC_URL}/assets/images/licence.svg`,
  LIQUID: `${process.env.PUBLIC_URL}/assets/images/liquid.svg`,
  MARGIN: `${process.env.PUBLIC_URL}/assets/images/margin.svg`,
  PASSWORD_RESET: `${process.env.PUBLIC_URL}/assets/images/password-reset.svg`,
  PAYMENT_OPTIONS: `${process.env.PUBLIC_URL}/assets/images/payment-options.svg`,
  QUICK_TRADE: `${process.env.PUBLIC_URL}/assets/images/quick-trade.svg`,
  SECURE: `${process.env.PUBLIC_URL}/assets/images/secure.svg`,
  SECURITY_BLACK: `${process.env.PUBLIC_URL}/assets/images/security.svg`,
  SECURITY_GREY: `${process.env.PUBLIC_URL}/assets/images/security-grey.svg`,
  SET_NEW_PASSWORD: `${process.env.PUBLIC_URL}/assets/images/set-new-password.svg`,
  SUCCESS_BLACK: `${process.env.PUBLIC_URL}/assets/images/success-black.svg`,
  TRADE_HISTORY_GREY: `${process.env.PUBLIC_URL}/assets/images/trade-history-grey.svg`,
  TRADES_ICON: `${process.env.PUBLIC_URL}/assets/images/Trades.svg`,
  TRADE_SUCCESS: `${process.env.PUBLIC_URL}/assets/images/trade-success.svg`,
  TRANSACTION_HISTORY: `${process.env.PUBLIC_URL}/assets/images/transaction-history.svg`,
  UPDATE_QUICK_TRADE: `${process.env.PUBLIC_URL}/assets/images/update-quick-trade.svg`,
  VERIFICATION_SENT: `${process.env.PUBLIC_URL}/assets/images/verification-resent.svg`,
  WITHDRAW: `${process.env.PUBLIC_URL}/assets/images/withdraw.svg`,
  WITHDRAW_HISTORY: `${process.env.PUBLIC_URL}/assets/images/withdraw-history.svg`,
  WITHDRAW_HISTORY_GREY: `${process.env.PUBLIC_URL}/assets/images/withdraw-history-grey.svg`,
  BLUE_ARROW_LEFT: `${process.env.PUBLIC_URL}/assets/images/blue-arrow-left.svg`,
  BLUE_ARROW_RIGHT: `${process.env.PUBLIC_URL}/assets/images/blue-arrow-right.svg`,
  SESSION_TIMED_OUT: `${process.env.PUBLIC_URL}/assets/images/session-timed-out.svg`,
  BLUE_EDIT: `${process.env.PUBLIC_URL}/assets/images/blue-edit-exir-icon.svg`,
  BLUE_PLUS: `${process.env.PUBLIC_URL}/assets/images/max-plus-blue-icon.svg`,
  TOMAN_T_ICON: `${process.env.PUBLIC_URL}/assets/images/toman-t-icon.svg`,
  NOTIFICATION_ORDER_LIMIT_BUY_FILLED: `${process.env.PUBLIC_URL}/assets/images/limit-buy-order-filled-01.svg`,
  NOTIFICATION_ORDER_LIMIT_BUY_CREATED: `${process.env.PUBLIC_URL}/assets/images/limit-buy-order-icon-01.svg`,
  NOTIFICATION_ORDER_LIMIT_BUY_FILLED_PART: `${process.env.PUBLIC_URL}/assets/images/limit-buy-order-part-filled-01.svg`,
  NOTIFICATION_ORDER_LIMIT_SELL_FILLED: `${process.env.PUBLIC_URL}/assets/images/limit-sell-order-filled-01.svg`,
  NOTIFICATION_ORDER_LIMIT_SELL_CREATED: `${process.env.PUBLIC_URL}/assets/images/limit-sell-order-icon-01.svg`,
  NOTIFICATION_ORDER_LIMIT_SELL_FILLED_PART: `${process.env.PUBLIC_URL}/assets/images/limit-sell-order-part-filled-01.svg`,
  NOTIFICATION_ORDER_MARKET_BUY_FILLED: `${process.env.PUBLIC_URL}/assets/images/market-buy-01.svg`,
  NOTIFICATION_ORDER_MARKET_SELL_FILLED: `${process.env.PUBLIC_URL}/assets/images/market-sell-01.svg`,
}

export const SOCIAL_ICONS = {
  FACEBOOK: `${process.env.PUBLIC_URL}/assets/icons/facebook.png`,
  LINKEDIN: `${process.env.PUBLIC_URL}/assets/icons/linkedin.png`,
  TWIITER: `${process.env.PUBLIC_URL}/assets/icons/twitter.png`,
  GOOGLE: `${process.env.PUBLIC_URL}/assets/icons/google.png`,
};

export const EXIR_LOGO = `${process.env.PUBLIC_URL}/assets/images/EXIR-grey-login.svg`;
export const EXIR_BLUE_LOGO = `${process.env.PUBLIC_URL}/assets/logo-blue-exir.svg`;

export const CURRENCIES = {
  fiat: {
    symbol: 'fiat',
    name: STRINGS.FIAT_NAME,
    fullName: STRINGS.FIAT_FULLNAME,
    shortName: STRINGS.FIAT_SHORTNAME,
    currencySymbol: STRINGS.FIAT_CURRENCY_SYMBOL,
    formatToCurrency: formatFiatAmount,
    iconPath: ICONS.TOMAN_T_ICON,
  },
  btc: {
    symbol: 'btc',
    name: STRINGS.BTC_NAME,
    fullName: STRINGS.BTC_FULLNAME,
    shortName: STRINGS.BTC_SHORTNAME,
    currencySymbol: 'B',
    formatToCurrency: formatBtcAmount,
    iconPath: ICONS.BITCOIN_DARK,
  },
}

export const FLEX_CENTER_CLASSES = ['d-flex', 'justify-content-center', 'align-items-center'];

export const TIMESTAMP_FORMAT = STRINGS.TIMESTAMP_FORMAT;
export const HOUR_FORMAT = STRINGS.HOUR_FORMAT;
export const TIMESTAMP_FORMAT_FA = STRINGS.TIMESTAMP_FORMAT.split('/').map((s) => `j${s}`).join('/');

export const LIMIT_VALUES = {
  PRICE: {
    MIN: 500000,
    MAX: 100000000,
    STEP: 5000,
  },
  SIZE: {
    MIN: 0.0001,
    MAX: 21000000,
    STEP: 0.0001,
  }
};

export const DEPOSIT_LIMITS = {
  fiat: {
    DAILY: 50000000,
    MIN: 100,
    MAX: 50000000,
  }
};

export const WITHDRAW_LIMITS = {
  fiat: {
    MIN: 1000,
    STEP: 1,
  },
  btc: {
    MIN: 0.0001,
    MAX: 10,
    STEP: 0.0001,
  }
}
export const TOKEN_KEY = `${ENV}_${NETWORK}_TOKEN`;
export const LANGUAGE_KEY = `${ENV}_${NETWORK}_LANGUAGE`;

export const BANK_INFORMATION = {
  bank_name: process.env.BANK_NAME || 'Exir Trade',
  account_owner: process.env.ACCOUNT_OWNER || 'Bank Melli',
  account_number: process.env.ACCOUNT_NUMBER || '2313-0631-2313-3121',
};

export const BANK_PAYMENT_LINK = 'https://api.moneyar.com/IPG/default.aspx?uid=';
export const MIN_VERIFICATION_LEVEL_TO_WITHDRAW = 2;
