import validator from 'validator';
import WAValidator from 'wallet-address-validator';
import math from 'mathjs';
import { NETWORK } from '../../config/constants';
import { fiatSymbol, roundNumber } from '../../utils/currency';
import STRINGS from '../../config/localizedStrings';

const passwordRegEx = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;

export const required = (value) =>
	!value ? STRINGS.VALIDATIONS.REQUIRED : undefined;
export const requiredBoolean = (value) =>
	value === undefined ? STRINGS.VALIDATIONS.REQUIRED : undefined;
export const requiredWithCustomMessage = (message) => (value) =>
	!value ? message : undefined;

export const maxLength = (length, message) => (value = '') =>
	value.length > length ? message : undefined;
export const exactLength = (length, message) => (value = '') =>
	value.length !== length ? message : undefined;
export const onlyNumbers = (value = '') =>
	validator.isNumeric(value) ? undefined : STRINGS.VALIDATIONS.ONLY_NUMBERS;
export const email = (value = '') =>
	!validator.isEmail(value) ? STRINGS.VALIDATIONS.INVALID_EMAIL : undefined;

export const password = (value) =>
	!passwordRegEx.test(value)
		? STRINGS.VALIDATIONS.INVALID_PASSWORD_2
		: undefined;

export const validAddress = (symbol = '', message) => {
	const currency = symbol.toUpperCase();
	return (address) => {
		const valid = WAValidator.validate(address, currency, NETWORK);
		return !valid
			? message ||
					STRINGS.formatString(
						STRINGS.VALIDATIONS.INVALID_CURRENCY,
						currency,
						address
					)
			: undefined;
	};
};

export const minValue = (minValue, message) => (value) =>
	value < minValue
		? message || STRINGS.formatString(STRINGS.VALIDATIONS.MIN_VALUE, minValue)
		: undefined;
export const maxValue = (maxValue, message) => (value) =>
	value > maxValue
		? message || STRINGS.formatString(STRINGS.VALIDATIONS.MAX_VALUE, maxValue)
		: undefined;
export const step = (step, message) => (value = 0) =>
	value % step > 0
		? message || STRINGS.formatString(STRINGS.VALIDATIONS.STEP, step)
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
				STRINGS.VALIDATIONS.INVALID_BALANCE,
				available,
				operation
			);
		return errorMessage;
	}
	return undefined;
};

export const evaluateOrder = (
	symbol = '',
	balance = {},
	order = {},
	orderType = '',
	side = '',
	marketPrice = 0
) => {
	let orderPrice = 0;
	let available = 0;

	if (side === 'sell') {
		available = balance[`${symbol}_available`];
		orderPrice = order.size;
	} else {
		available = balance[`${fiatSymbol}_available`];

		if (orderType === 'market') {
			orderPrice = marketPrice;
		} else {
			orderPrice = math.multiply(
				math.fraction(order.size || 0),
				math.fraction(order.price || 0)
			);
		}
	}

	if ((available === 0 && orderPrice > 0) || available < orderPrice) {
		return STRINGS.VALIDATIONS.INSUFFICIENT_BALANCE;
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
	return roundNumber(accumulated);
};

export const isBefore = (
	before = '',
	message = STRINGS.VALIDATIONS.INVALID_DATE
) => {
	const beforeDate = before ? new Date(before) : new Date();
	const beforeValue = beforeDate.toString();
	return (value = '') => {
		const valueDate = new Date(value).toString();
		const valid = validator.isBefore(valueDate, beforeValue);
		return valid ? undefined : message;
	};
};

export const normalizeInt = (value) => validator.toInt(value) || 0;

export const validateOtp = (message = STRINGS.OTP_FORM.ERROR_INVALID) => (
	value = ''
) => {
	let error = undefined;
	if (value.length !== 6 || !validator.isNumeric(value)) {
		error = message;
	}
	return error;
};
