import math from 'mathjs';
import numbro from 'numbro';
import { CURRENCIES } from '../config/constants';
import STRINGS from '../config/localizedStrings';

export const fiatSymbol = 'fiat';
export const fiatName = CURRENCIES[fiatSymbol].name;
export const fiatShortName = CURRENCIES[fiatSymbol].shortName;
export const fiatFormatToCurrency = CURRENCIES[fiatSymbol].formatToCurrency;

export const BTC_FORMAT = '0,0.[0000]';
export const BTC_FULL_FORMAT = '0,0.[00000000]';
export const FIAT_FORMAT = '0,0.[00]';
export const PERCENTAGE_FORMAT = '0.[00]%';

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

export const formatPercentage = (value = 0) =>
	numbro(math.number(value / 100)).format(PERCENTAGE_FORMAT);
export const formatBtcAmount = (amount = 0) =>
	numbro(math.number(amount)).format(BTC_FORMAT);
export const formatBtcFullAmount = (amount = 0) =>
	numbro(math.number(amount)).format(BTC_FULL_FORMAT);
export const formatFiatAmount = (amount = 0) =>
	numbro(math.number(amount)).format(FIAT_FORMAT);
export const formatNumber = (number, round = 0) => {
	return math.round(number, round);
};

export const calculatePrice = (value = 0, price = 1) =>
	math.number(math.multiply(math.fraction(value), math.fraction(price)));

export const calculateBalancePrice = (balance, prices) => {
	let accumulated = math.fraction(0);
	Object.entries(prices).forEach(([key, value]) => {
		if (balance.hasOwnProperty(`${key}_balance`)) {
			accumulated = math.add(
				math.multiply(
					math.fraction(balance[`${key}_balance`]),
					math.fraction(value)
				),
				accumulated
			);
		}
	});
	return math.number(accumulated);
};

export const generateWalletActionsText = (symbol, useFullName = false) => {
	const name = STRINGS[`${symbol.toUpperCase()}_NAME`];
	const fullName = STRINGS[`${symbol.toUpperCase()}_FULLNAME`];

	const nameToDisplay = useFullName ? fullName : name;

	const depositText = `${
		symbol === fiatSymbol
			? STRINGS.WALLET_BUTTON_FIAT_DEPOSIT
			: STRINGS.WALLET_BUTTON_CRYPTOCURRENCY_DEPOSIT
	} ${nameToDisplay}`;
	const withdrawText = `${
		symbol === fiatSymbol
			? STRINGS.WALLET_BUTTON_FIAT_WITHDRAW
			: STRINGS.WALLET_BUTTON_CRYPTOCURRENCY_WITHDRAW
	} ${nameToDisplay}`;

	return {
		depositText,
		withdrawText
	};
};

export const getCurrencyFromName = (name = '') => {
	switch (name.toLowerCase()) {
		case 'btc':
		case 'bitcoin':
			return 'btc';
		case 'eth':
		case 'ethereum':
			return 'eth';
		case 'eur':
		case 'euro':
		case 'fiat':
			return 'fiat';
		default:
			return '';
	}
};
