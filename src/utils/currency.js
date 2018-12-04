import math from 'mathjs';
import numbro from 'numbro';
import STRINGS from '../config/localizedStrings';

export const BTC_FORMAT = '0,0.[0000]';
export const ETH_FORMAT = '0,0.[0000]';
export const BCH_FORMAT = '0,0.[0000]';
export const BTC_FULL_FORMAT = '0,0.[00000000]';
export const ETH_FULL_FORMAT = '0,0.[00000000]';
export const BCH_FULL_FORMAT = '0,0.[00000000]';
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

export const formatCurrency = (amount = 0, currency = 'fiat', type = 'simple') => {
	switch (currency.toLowerCase()) {
		case 'btc':
			return numbro(roundNumber(amount, 8)).format(BTC_FULL_FORMAT);
		case 'eth':
			return numbro(roundNumber(amount, 8)).format(ETH_FULL_FORMAT);
		case 'bch':
			return numbro(roundNumber(amount, 8)).format(BCH_FULL_FORMAT);
		case 'fiat':
			return numbro(roundNumber(amount, 8)).format(FIAT_FORMAT);
		default:
			return numbro(roundNumber(amount, 8)).format(FIAT_FORMAT); 
	}
}
export const formatPercentage = (value = 0) =>
	numbro(math.number(value / 100)).format(PERCENTAGE_FORMAT);
export const formatBtcAmount = (amount = 0) =>
	numbro(roundNumber(amount, 4)).format(BTC_FORMAT);
export const formatBtcFullAmount = (amount = 0) =>
	numbro(roundNumber(amount, 8)).format(BTC_FULL_FORMAT);
export const formatFiatAmount = (amount = 0) =>
	numbro(roundNumber(amount, 2)).format(FIAT_FORMAT);
export const formatEthAmount = (amount = 0) =>
	numbro(roundNumber(amount, 4)).format(ETH_FORMAT);
export const formatEthFullAmount = (amount = 0) =>
	numbro(roundNumber(amount, 8)).format(ETH_FULL_FORMAT);
export const formatBchAmount = (amount = 0) =>
	numbro(roundNumber(amount, 4)).format(BCH_FORMAT);
export const formatBchFullAmount = (amount = 0) =>
	numbro(roundNumber(amount, 8)).format(BCH_FULL_FORMAT);
export const formatNumber = (number, round = 0) => {
	return roundNumber(number, round);
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

export const calculatePricePercentage = (value = 0, total = 0) =>
	formatNumber(math.number(math.multiply(math.divide(math.fraction(value), math.fraction(total)), 100)));

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
		case 'bch':
		case 'bitcoincash':
			return 'bch';
		case 'eur':
		case 'euro':
		case 'fiat':
			return 'fiat';
		default:
			return '';
	}
};

export const getCurrencyFromSymbol = (symbol = '') => {
	switch (symbol.toLowerCase()) {
		case 'btc':
		case 'bitcoin':
			return 'bitcoin';
		case 'eth':
		case 'ethereum':
			return 'ethereum';
		case 'bch':
		case 'bitcoincash':
			return 'bitcoincash';
		case 'eur':
		case 'euro':
		case 'fiat':
			return 'fiat';
		default:
			return '';
	}
};

export const checkNonFiatPair = (pair) => !pair.includes(STRINGS.FIAT_SHORTNAME_EN.toLowerCase());
export const fiatSymbol = 'fiat';
export const fiatName = STRINGS.FIAT_NAME;
export const fiatShortName = STRINGS.FIAT_SHORTNAME;
export const fiatFormatToCurrency = formatFiatAmount;
