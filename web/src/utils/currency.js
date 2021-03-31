import math from 'mathjs';
import numbro from 'numbro';
import store from 'store';
import STRINGS from '../config/localizedStrings';
import { BASE_CURRENCY, DEFAULT_COIN_DATA } from '../config/constants';
import { findPath, convertPathToPairNames } from './data';

export const BTC_FORMAT = '0,0.[0000]';
export const ETH_FORMAT = '0,0.[0000]';
export const XRP_FORMAT = '0,0.[]';
export const BCH_FORMAT = '0,0.[0000]';
export const BTC_FULL_FORMAT = '0,0.[00000000]';
export const ETH_FULL_FORMAT = '0,0.[00000000]';
export const XRP_FULL_FORMAT = '0,0.[0]';
export const BCH_FULL_FORMAT = '0,0.[00000000]';
export const BASE_FORMAT = '0,0.[0000]';
export const PERCENTAGE_FORMAT = '0.[00]%';
export const DONUT_PERCENTAGE_FORMAT = '0.[0]%';
export const AVERAGE_FORMAT = '3a';

// export const CURRENCY_FORMAT = {
// 	BTC_FORMAT: '0,0.[0000]',
// 	ETH_FORMAT: '0,0.[0000]',
// 	XRP_FORMAT: '0,0.[]',
// 	BCH_FORMAT: '0,0.[0000]',
// 	BTC_FULL_FORMAT: '0,0.[00000000]',
// 	ETH_FULL_FORMAT: '0,0.[00000000]',
// 	XRP_FULL_FORMAT: '0,0.[0]',
// 	BCH_FULL_FORMAT: '0,0.[00000000]',
// 	EUR_FORMAT: '0,0.[0000]',
// };

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

export const formatToCurrency = (amount = 0, min = 0, fullFormat = false) => {
	let formatObj = getFormat(min, fullFormat);
	return numbro(roundNumber(amount, formatObj.digit)).format(formatObj.format);
};

export const formatToSimple = (amount = 0, min = 0, fullFormat = false) => {
	let formatObj = getFormat(min, fullFormat);
	return numbro(math.number(amount)).format(formatObj.format);
};

export const formatToFixed = (amount = 0, min = 0, fullFormat = false) => {
	let formatObj = getFormat(min, fullFormat);
	return numbro(math.number(amount).toFixed(formatObj.digit)).format(
		formatObj.format
	);
};

export const formatCurrency = (
	amount = 0,
	currency = BASE_CURRENCY,
	type = 'simple'
) => {
	switch (currency.toLowerCase()) {
		case 'btc':
			return numbro(roundNumber(amount, 8)).format(BTC_FULL_FORMAT);
		case 'eth':
			return numbro(roundNumber(amount, 8)).format(ETH_FULL_FORMAT);
		case 'bch':
			return numbro(roundNumber(amount, 8)).format(BCH_FULL_FORMAT);
		case 'xrp':
			return numbro(roundNumber(amount, 8)).format(XRP_FULL_FORMAT);
		case 'eur':
			return numbro(roundNumber(amount, 8)).format(BASE_FORMAT);
		case 'usdt':
			return numbro(roundNumber(amount, 8)).format(BASE_FORMAT);
		case 'xht':
			return numbro(roundNumber(amount, 8)).format(BASE_FORMAT);
		case 'xmr':
			return numbro(roundNumber(amount, 8)).format(BASE_FORMAT);
		default:
			return numbro(roundNumber(amount, 8)).format(BASE_FORMAT);
	}
};
export const formatPercentage = (value = 0) =>
	numbro(math.number(value / 100)).format(PERCENTAGE_FORMAT);
export const donutFormatPercentage = (value = 0) =>
	numbro(math.number(value / 100)).format(DONUT_PERCENTAGE_FORMAT);
export const formatBtcAmount = (amount = 0) =>
	numbro(roundNumber(amount, 4)).format(BTC_FORMAT);
export const formatBtcFullAmount = (amount = 0) =>
	numbro(roundNumber(amount, 8)).format(BTC_FULL_FORMAT);
export const formatBaseAmount = (amount = 0) =>
	numbro(roundNumber(amount, 2)).format(BASE_FORMAT);
export const formatEthAmount = (amount = 0) =>
	numbro(roundNumber(amount, 4)).format(ETH_FORMAT);
export const formatEthFullAmount = (amount = 0) =>
	numbro(roundNumber(amount, 8)).format(ETH_FULL_FORMAT);
export const formatXrpAmount = (amount = 0) =>
	numbro(roundNumber(amount, 4)).format(XRP_FORMAT);
export const formatXrpFullAmount = (amount = 0) =>
	numbro(roundNumber(amount, 8)).format(XRP_FULL_FORMAT);
export const formatBchAmount = (amount = 0) =>
	numbro(roundNumber(amount, 4)).format(BCH_FORMAT);
export const formatBchFullAmount = (amount = 0) =>
	numbro(roundNumber(amount, 8)).format(BCH_FULL_FORMAT);
export const formatNumber = (number, round = 0) => {
	return roundNumber(number, round);
};
export const formatAverage = (amount = 0) =>
	numbro(amount).format(AVERAGE_FORMAT);

export const calculatePrice = (value = 0, key = BASE_CURRENCY) => {
	let price;
	if (key === BASE_CURRENCY) {
		price = 1;
	} else {
		price = estimatePrice(key);
	}
	return math.number(math.multiply(math.fraction(value), math.fraction(price)));
};

export const calculateOraclePrice = (value = 0, price = 0) => {
	const effectivePrice = price >= 0 ? price : 0;
	return math.number(
		math.multiply(math.fraction(value), math.fraction(effectivePrice))
	);
};

export const calculateBalancePrice = (balance, prices = {}, coins = {}) => {
	let accumulated = math.fraction(0);
	Object.keys(coins).forEach((key) => {
		const price = prices[key] || 0;
		const effectivePrice = price >= 0 ? price : 0;
		if (balance.hasOwnProperty(`${key}_balance`)) {
			accumulated = math.add(
				math.multiply(
					math.fraction(balance[`${key}_balance`]),
					math.fraction(effectivePrice)
				),
				accumulated
			);
		}
	});
	return math.number(accumulated);
	// Object.entries(prices).forEach(([key, value]) => {
	// 	if (balance.hasOwnProperty(`${key}_balance`)) {
	// 		accumulated = math.add(
	// 			math.multiply(
	// 				math.fraction(balance[`${key}_balance`]),
	// 				math.fraction(value)
	// 			),
	// 			accumulated
	// 		);
	// 	}
	// });
	// return math.number(accumulated);
};

export const calculatePricePercentage = (value = 0, total) => {
	const priceTotal = total ? total : 1;
	return math.number(
		math.multiply(
			math.divide(math.fraction(value), math.fraction(priceTotal)),
			100
		)
	);
};

export const generateWalletActionsText = (
	symbol,
	coins,
	useFullName = false
) => {
	const { fullname } = coins[symbol] || DEFAULT_COIN_DATA;
	const name = fullname;

	const nameToDisplay = useFullName ? fullname : name;

	const depositText = `${
		symbol === BASE_CURRENCY
			? STRINGS['WALLET_BUTTON_BASE_DEPOSIT']
			: STRINGS['WALLET_BUTTON_CRYPTOCURRENCY_DEPOSIT']
	} ${nameToDisplay}`;

	const withdrawText = `${
		symbol === BASE_CURRENCY
			? STRINGS['WALLET_BUTTON_BASE_WITHDRAW']
			: STRINGS['WALLET_BUTTON_CRYPTOCURRENCY_WITHDRAW']
	} ${nameToDisplay}`;

	const stringId_withdraw =
		symbol === BASE_CURRENCY
			? 'WALLET_BUTTON_BASE_WITHDRAW'
			: 'WALLET_BUTTON_CRYPTOCURRENCY_WITHDRAW';

	const stringId_deposit =
		symbol === BASE_CURRENCY
			? 'WALLET_BUTTON_BASE_DEPOSIT'
			: 'WALLET_BUTTON_CRYPTOCURRENCY_DEPOSIT';

	return {
		depositText,
		withdrawText,
		stringId_withdraw,
		stringId_deposit,
	};
};

export const getCurrencyFromName = (name = '', coins) => {
	let currency = '';
	Object.keys(coins).forEach((key) => {
		let coinData = coins[key];
		if (
			(coinData.fullname &&
				coinData.fullname.toLowerCase() === name.toLowerCase()) ||
			(coinData.symbol && coinData.symbol.toLowerCase() === name.toLowerCase())
		) {
			currency = coinData.symbol;
		}
	});

	return currency;
	// switch (name.toLowerCase()) {
	// 	case 'btc':
	// 	case 'bitcoin':
	// 		return 'btc';
	// 	case 'eth':
	// 	case 'ethereum':
	// 		return 'eth';
	// 	case 'bch':
	// 	case 'bitcoincash':
	// 		return 'bch';
	// 	case 'xrp':
	// 	case 'ripple':
	// 		return 'xrp';
	// 	case 'eur':
	// 	case 'euro':
	// 		return 'eur';
	// 	case 'xht':
	// 		return 'xht';
	// 	case 'usdt':
	// 		return 'usdt';
	// 	case 'xmr':
	// 	case 'monero':
	// 		return 'xmr';
	// 	default:
	// 		return '';
	// }
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
		case 'xrp':
			return 'ripple';
		case 'eur':
		case 'euro':
			return 'euro';
		case 'xht':
			return 'xht';
		case 'usdt':
			return 'usdt';
		default:
			return symbol.toLowerCase();
	}
};

export const checkNonBasePair = (pair, coins) => {
	const { symbol = '' } = coins[BASE_CURRENCY] || DEFAULT_COIN_DATA;
	return !pair.includes(symbol.toLowerCase());
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

export const estimatePrice = (key) => {
	const {
		app: { pairs, tickers },
		orderbook: { prices },
	} = store.getState();

	if (prices[key]) return prices[key];

	const pairsArray = Object.entries(pairs).map(([, pairObj]) => pairObj);
	const path = findPath(pairsArray, key)[0];
	let estimatedPrice = 1;

	if (path) {
		convertPathToPairNames(path).forEach((pairKey) => {
			const { close = 0 } = tickers[pairKey] || {};
			estimatedPrice *= close;
		});
	} else {
		estimatedPrice = 0;
	}

	return estimatedPrice;
};
