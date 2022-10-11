import React from 'react';
import math from 'mathjs';
import numbro from 'numbro';
import validator from 'validator';
import isEmail from 'validator/lib/isEmail';

export const required = value => (!value ? "Required" : undefined);

export const editableRequired = (string) => (value) => (!value ? (string || "Required") : undefined);

export const validateOtp = (message) => (
  value = ''
) => {
  let error = undefined;
  if (value.length !== 6 || !validator.isNumeric(value)) {
    error = message;
  }
  return error;
};

export const DEFAULT_COIN_DATA = {
  fullname: '',
  symbol: '',
  min: 0.001,
};

const local_base_currnecy = localStorage.getItem('base_currnecy');

export const BASE_CURRENCY = local_base_currnecy
  ? local_base_currnecy.toLowerCase()
  : 'usdt';

export const CURRENCY_PRICE_FORMAT = '{0} {1}';

export const formatToCurrency = (amount = 0, min = 0, fullFormat = false) => {
  let formatObj = getFormat(min, fullFormat);
  return numbro(roundNumber(amount, formatObj.digit)).format(formatObj.format);
};

export const roundNumber = (number = 0, decimals = 4) => {
  if (number === 0) {
    return 0;
  } else if (decimals > 0) {
    const multipliedNumber = math.multiply(
      math.fraction(number),
      math.pow(10, decimals)
    );
    const dividedNumber = math.divide(
      math.floor(multipliedNumber),
      math.pow(10, decimals)
    );
    return math.number(dividedNumber);
  } else {
    return math.floor(number);
  }
};

export const getFormat = (min = 0, fullFormat) => {
  let value = math.format(min, { notation: 'fixed' });
  if (fullFormat) {
    return { digit: 8, format: '0,0.[00000000]' };
  } else if (min % 1) {
    let point = value.toString().split('.')[1]
      ? value.toString().split('.')[1]
      : '';
    let res = point
      .split('')
      .map((val) => 0)
      .join('');
    return { digit: point.length, format: `0,0.[${res}]` };
  } else {
    return { digit: 4, format: `0,0.[0000]` };
  }
};

export const getDecimals = (value = 0) => {
  let result = math.format(math.number(value), { notation: 'fixed' });
  return value % 1
    ? result.toString().split('.')[1]
      ? result.toString().split('.')[1].length
      : 0
    : 0;
};

export const normalizeBTC = (value = 0) => (value ? roundNumber(value, 8) : '');

export const maxValue = (maxValue, message) => (value = 0) =>
  value > maxValue
    ? message
    : undefined;

export const minValue = (minValue, message) => (value = 0) =>
  value < minValue
    ? message
    : undefined;

export const checkBalance = (available, message, fee = 0) => (value = 0) => {
  const operation =
    fee > 0
      ? math.number(
      math.add(
        math.fraction(value),
        math.multiply(math.fraction(value), math.fraction(fee))
      )
      )
      : value;

  if (operation > available) {
    return message;
  }
  return undefined;
};

export const checkBalance_new = (available, message, fee = 0) => (value = 0) => {
  const operation =
    fee > 0
      ? math.number(
      math.add(
        math.fraction(value),
        math.fraction(fee)
      )
      )
      : value;

  if (operation > available) {
    return message;
  }
  return undefined;
};

export const toFixed = (exponential) => {
  if (Math.abs(exponential) < 1.0) {
    let e = parseInt(exponential.toString().split('e-')[1], 10);
    if (e) {
      exponential *= Math.pow(10, e - 1);
      exponential =
        '0.' + new Array(e).join('0') + exponential.toString().substring(2);
    }
  } else {
    let e = parseInt(exponential.toString().split('+')[1], 10);
    if (e > 20) {
      e -= 20;
      exponential /= Math.pow(10, e);
      exponential += new Array(e + 1).join('0');
    }
  }
  return exponential;
};

export const email = (value = '') =>
  value && !isEmail(value) ? 'Invalid email address' : undefined;

export const maxLength = (length, message) => (value = "") =>
  value.length > length ? message : undefined;