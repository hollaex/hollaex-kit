import validator from 'validator';
import WAValidator from 'wallet-address-validator';
import math from 'mathjs';
import { NETWORK } from '../../config/constants';
import { calculatePrice, fiatSymbol } from '../../utils/currency';

const ERROR_MESSAGE_REQUIRED = 'Required field';
const ERROR_MESSAGE_BEFORE_DATE = 'Invalid date';

export const required = (value) => !value ? ERROR_MESSAGE_REQUIRED : undefined;
export const requiredBoolean = (value) => value === undefined ? ERROR_MESSAGE_REQUIRED : undefined;
export const requiredWithCustomMessage = (message) => (value) => !value ? message : undefined;

export const exactLength = (length, message) => (value = '') => value.length !== length ? message : undefined;

export const email = (value) => !validator.isEmail(value) ? 'Invalid email' : undefined;

const passwordRegEx = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^\&*\)\(+=._-]).{8,}$/;
const INVALID_PASSWORD = 'Invalid password. It has to contain at least 8 characters, a digit in the password and a special character.';

export const password = (value) => !passwordRegEx.test(value) ? INVALID_PASSWORD : undefined

export const validAddress = (symbol = '', message) => {
  const currency = symbol.toUpperCase();
  return (address) => {
    const valid = WAValidator.validate(address, currency, NETWORK);
    return !valid ? (message || `Invalid ${currency} address (${address})`) : undefined;
  }
}

export const minValue = (minValue, message) => (value) => value < minValue ? (message || `Value must be ${minValue} or higher.`) : undefined;
export const maxValue = (maxValue, message) => (value) => value > maxValue ? (message || `Value must be ${minValue} or lower.`) : undefined;

export const checkBalance = (available, message, fee = 0) => (value = 0) => {
  const operation = fee > 0 ?
    math.number(math.add(
      math.fraction(value),
      math.multiply(math.fraction(value), math.fraction(fee))
    )) :
    value;

  if (operation > available) {
    const errorMessage = (message || `Insufficient balance available (${available}) to perform the operation (${operation}).`);
    return errorMessage;
  }
  return undefined;
}


export const evaluateOrder = (symbol = '', balance = {}, order = {}, orderType = '', side = '') => {

  if (orderType === 'market') {
    // TODO calculate with server
    return '';
  } else {
    let orderPrice = 0;
    let available = 0;
    if (side === 'sell') {
      available = balance[`${symbol}_available`];
      orderPrice = order.size;
    } else if (side === 'buy') {
      available = balance[`${fiatSymbol}_available`];
      orderPrice = math.multiply(math.fraction(order.size || 0), math.fraction(order.price || 0));
    }
    if (available < orderPrice) {
      return 'Insufficient balance';
    }
  }

  return '';
}

export const isBefore = (before = '', message = ERROR_MESSAGE_BEFORE_DATE) => {
  const beforeDate = before ? new Date(before) : new Date();
  const beforeValue = beforeDate.toString();
  return (value = '') => {
    const valueDate = new Date(value).toString();
    const valid = validator.isBefore(valueDate, beforeValue);
    return valid ? undefined : message;
  }
}

export const normalizeInt = (value) => validator.toInt(value) || 0;
