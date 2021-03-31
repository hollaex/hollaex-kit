import axios from 'axios';
import { BASE_CURRENCY, DEFAULT_COIN_DATA } from 'config/constants';
import {
	calculateBalancePrice,
	calculateOraclePrice,
	calculatePricePercentage,
	formatToCurrency,
	donutFormatPercentage,
} from 'utils/currency';

export const SET_PRICES_AND_ASSET = 'SET_PRICES_AND_ASSET';

export const setPricesAndAsset = (balance, coins) => {
	return (dispatch) => {
		getPrices({ coins }).then((prices) => {
			const totalAsset = calculateBalancePrice(balance, prices, coins);

			dispatch({
				type: SET_PRICES_AND_ASSET,
				payload: {
					oraclePrices: prices,
					totalAsset,
					chartData: generateChartData(balance, prices, coins, totalAsset),
				},
			});
		});
	};
};

const ENDPOINTS = {
	GET_PRICE: '/oracle/prices',
};

export const getPrices = async ({
	amount = 1,
	quote = BASE_CURRENCY,
	coins = {},
}) => {
	const assets = Object.keys(coins).join();
	const { data: prices = {} } = await axios.get(ENDPOINTS.GET_PRICE, {
		params: { amount, quote, assets },
	});
	return prices;
};

export const generateChartData = (balance, prices, coins, totalAsset) => {
	const data = [];

	Object.keys(coins).forEach((currency) => {
		const { symbol, min } = coins[currency] || DEFAULT_COIN_DATA;
		const currencyBalance = calculateOraclePrice(
			balance[`${symbol}_balance`],
			prices[symbol]
		);
		const balancePercent = calculatePricePercentage(
			currencyBalance,
			totalAsset
		);
		data.push({
			...coins[currency],
			balance: balancePercent,
			balanceFormat: formatToCurrency(currencyBalance, min),
			balancePercentage: donutFormatPercentage(balancePercent),
		});
	});

	return data;
};
