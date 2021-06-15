import validator from 'validator';
import WAValidator from 'multicoin-address-validator';
import math from 'mathjs';
import bchaddr from 'bchaddrjs';
import { roundNumber } from '../../utils/currency';
import STRINGS from '../../config/localizedStrings';
import { getDecimals } from 'utils/utils';

const passwordRegEx = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
const usernameRegEx = /^[a-z0-9_]{3,15}$/;

export const required = (value) =>
	!value ? STRINGS['VALIDATIONS.REQUIRED'] : undefined;
export const requiredBoolean = (value) =>
	value === undefined ? STRINGS['VALIDATIONS.REQUIRED'] : undefined;
export const requiredWithCustomMessage = (message) => (value) =>
	!value ? message : undefined;

export const maxLength = (length, message) => (value = '') =>
	value.length > length ? message : undefined;
export const exactLength = (length, message) => (value = '') =>
	value.length !== length ? message : undefined;
export const onlyNumbers = (value = '') =>
	validator.isNumeric(value) ? undefined : STRINGS['VALIDATIONS.ONLY_NUMBERS'];
export const email = (value = '') =>
	!validator.isEmail(value) ? STRINGS['VALIDATIONS.INVALID_EMAIL'] : undefined;

export const password = (value = '') =>
	!passwordRegEx.test(value)
		? STRINGS['VALIDATIONS.INVALID_PASSWORD_2']
		: undefined;

export const username = (value = '') =>
	!usernameRegEx.test(value) ? STRINGS['INVALID_USERNAME'] : undefined;

export const validAddress = (symbol = '', message, network) => {
	let currency = symbol.toUpperCase();
	return (address) => {
		let valid = true;

		if (network) {
			valid = WAValidator.validate(address, network);
			// switch (network) {
			// 	case 'ethereum':
			// 		valid = WAValidator.validate(address, 'eth');
			// 		break;
			// 	case 'stellar':
			// 		valid = WAValidator.validate(address, 'xlm');
			// 		break;
			// 	case 'tron':
			// 		valid = WAValidator.validate(address, 'trx');
			// 		break;
			// 	default:
			// 		break;
			// }
		} else {
			const supported = WAValidator.findCurrency(symbol);
			if (supported) {
				// this library recognizes this currency
				switch (currency) {
					case 'BTC':
						valid = WAValidator.validate(address, currency);
						break;
					case 'BCH':
						try {
							bchaddr.toLegacyAddress(address);
							valid = true;
						} catch (err) {
							valid = false;
						}
						break;
					case 'ETH':
						valid = WAValidator.validate(address, currency);
						break;
					case 'XRP':
						valid = WAValidator.validate(address, currency);
						break;
					default:
						valid = WAValidator.validate(address, currency);
						break;
				}
			}
		}

		return !valid
			? message ||
					STRINGS.formatString(
						STRINGS['VALIDATIONS.INVALID_CURRENCY'],
						currency,
						address
					)
			: undefined;
	};
};

export const minValue = (minValue, message) => (value = 0) =>
	value < minValue
		? message ||
		  STRINGS.formatString(STRINGS['VALIDATIONS.MIN_VALUE'], minValue)
		: undefined;

export const minValueNE = (minValue, message) => (value = 0) =>
	value <= minValue
		? message ||
		  STRINGS.formatString(STRINGS['VALIDATIONS.MIN_VALUE_NE'], minValue)
		: undefined;

export const maxValue = (maxValue, message) => (value = 0) =>
	value > maxValue
		? message ||
		  STRINGS.formatString(STRINGS['VALIDATIONS.MAX_VALUE'], maxValue)
		: undefined;

export const maxValueNE = (maxValue, message) => (value = 0) =>
	value >= maxValue
		? message ||
		  STRINGS.formatString(STRINGS['VALIDATIONS.MAX_VALUE_NE'], maxValue)
		: undefined;

export const step = (step, message) => (value = 0) =>
	math.larger(math.mod(math.bignumber(value), math.bignumber(step)), 0)
		? message || STRINGS.formatString(STRINGS['VALIDATIONS.STEP'], step)
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
		const errorMessage =
			message ||
			STRINGS.formatString(
				STRINGS['VALIDATIONS.INVALID_BALANCE'],
				available,
				operation
			);
		return errorMessage;
	}
	return undefined;
};

export const evaluateOrder = (
	pair_base = '',
	pair_2 = '',
	balance = {},
	order = {},
	orderType = '',
	side = '',
	marketPrice = 0
) => {
	let orderPrice = 0;
	let available = 0;

	if (side === 'sell') {
		available = balance[`${pair_base}_available`];
		orderPrice = order.size;
	} else {
		available = balance[`${pair_2}_available`];

		if (orderType === 'market') {
			orderPrice = marketPrice;
		} else {
			orderPrice = math.multiply(
				math.fraction(order.size || 0),
				math.fraction(order.price || 0)
			);
		}
	}

	if (available < orderPrice) {
		return STRINGS['VALIDATIONS.INSUFFICIENT_BALANCE'];
	}
	return '';
};

export const checkMarketPrice = (
	size,
	orders = [],
	type,
	side,
	orderPriceParam
) => {
	let accumulated = math.fraction(0);
	let remaining = math.fraction(size);
	const orderPrice = math.fraction(orderPriceParam);

	orders.some(([priceParam, amountParam], index) => {
		const price = math.fraction(priceParam);
		const amount = math.fraction(amountParam);

		if (type === 'limit') {
			if (side === 'buy' && math.smaller(orderPrice, price)) {
				return true;
			} else if (side === 'sell' && math.larger(orderPrice, price)) {
				return true;
			}
		}
		const orderSizeTaken = math.largerEq(remaining, amount)
			? amount
			: remaining;
		const takenPrice = math.multiply(price, orderSizeTaken);

		remaining = math.subtract(remaining, orderSizeTaken);
		accumulated = math.add(accumulated, takenPrice);

		return math.smallerEq(remaining, 0);
	});

	if (type === 'limit' && math.larger(remaining, 0)) {
		accumulated = math.add(accumulated, math.multiply(remaining, orderPrice));
	}
	if (type === 'market' && math.larger(remaining, 0)) {
		return -roundNumber(accumulated);
	}
	return roundNumber(accumulated);
};

export const isBefore = (
	before = '',
	message = STRINGS['VALIDATIONS.INVALID_DATE']
) => {
	const beforeDate = before ? new Date(before) : new Date();
	const beforeValue = beforeDate.toString();
	return (value = '') => {
		const valueDate = new Date(value).toString();
		const valid = validator.isBefore(valueDate, beforeValue);
		return valid ? undefined : message;
	};
};

export const normalizeInt = (value) => {
	if (validator.isNumeric(value)) {
		return validator.toInt(value);
	} else if (value === '0' || value === 0) {
		return 0;
	} else {
		return '';
	}
};
export const normalizeFloat = (value = '', increment = 0.01) => {
	if (validator.isFloat(value)) {
		const incrementPrecision = getDecimals(increment);
		const valuePrecision = (value + '.').split('.')[1].length;
		const precision = math.min(valuePrecision, incrementPrecision);
		if (validator.toFloat(value)) {
			return math.format(validator.toFloat(value), {
				notation: 'fixed',
				precision,
			});
		} else {
			return 0;
		}
	} else if (value === '0' || value === 0) {
		return 0;
	} else {
		return '';
	}
};
export const normalizeBTC = (value = 0) => (value ? roundNumber(value, 8) : '');
export const normalizeBTCFee = (value = 0) =>
	value ? roundNumber(value, 4) : '';

export const validateOtp = (message = STRINGS['OTP_FORM.ERROR_INVALID']) => (
	value = ''
) => {
	let error = undefined;
	if (value.length !== 6 || !validator.isNumeric(value)) {
		error = message;
	}
	return error;
};

export const normalizeEmail = (value = '') => value.toLowerCase();

export const tokenKeyValidation = required;
