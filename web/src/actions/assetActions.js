import axios from 'axios';
import { DEFAULT_COIN_DATA } from 'config/constants';
import {
	calculateBalancePrice,
	calculateOraclePrice,
	calculatePricePercentage,
	formatToCurrency,
	donutFormatPercentage,
} from 'utils/currency';

export const SET_PRICES_AND_ASSET_PENDING = 'SET_PRICES_AND_ASSET_PENDING';
export const SET_PRICES_AND_ASSET_SUCCESS = 'SET_PRICES_AND_ASSET_SUCCESS';
export const SET_PRICES_AND_ASSET_FAILURE = 'SET_PRICES_AND_ASSET_FAILURE';
export const SET_SOCKET_PRICES = 'SET_SOCKET_PRICES';
export const SET_ALL_COINS = 'SET_ALL_COINS';
export const SET_ALL_PAIRS = 'SET_ALL_PAIRS';
export const SET_EXCHANGE = 'SET_EXCHANGE';
export const SET_DASH_TOKEN = 'SET_DASH_TOKEN';

export const setPricesAndAssetPending = () => {
	return (dispatch) => {
		dispatch({ type: SET_PRICES_AND_ASSET_PENDING });
	};
};

export const setPricesAndAsset = (balance, coins) => {
	return (dispatch, getState) => {
		dispatch({ type: SET_PRICES_AND_ASSET_PENDING });

		const wsPriceData = getState()?.asset?.wsPriceData || {};
		const totalAsset = calculateBalancePrice(balance, wsPriceData, coins);

		dispatch({
			type: SET_PRICES_AND_ASSET_SUCCESS,
			payload: {
				totalAsset,
				chartData: generateChartData(balance, wsPriceData, coins, totalAsset),
			},
		});
	};
};

export const setCoins = (allCoins) => {
	return (dispatch) => {
		dispatch({
			type: SET_ALL_COINS,
			payload: {
				allCoins,
			},
		});
	};
};

export const setAllPairs = (allPairs) => {
	return (dispatch) => {
		dispatch({
			type: SET_ALL_PAIRS,
			payload: {
				allPairs,
			},
		});
	};
};

export const setExchange = (exchange) => {
	return (dispatch) => {
		dispatch({
			type: SET_EXCHANGE,
			payload: {
				exchange,
			},
		});
	};
};

export const setDashToken = (dashToken) => {
	return (dispatch) => {
		dispatch({
			type: SET_DASH_TOKEN,
			payload: {
				dashToken,
			},
		});
	};
};

export const setSocketprices = (prices) => {
	return (dispatch) => {
		dispatch({
			type: SET_SOCKET_PRICES,
			payload: {
				wsPriceData: prices,
			},
		});
	};
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
