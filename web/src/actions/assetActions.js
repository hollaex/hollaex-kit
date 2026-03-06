import axios from 'axios';
import { BASE_CURRENCY, DEFAULT_COIN_DATA } from 'config/constants';
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

const WS_QUOTE_CURRENCY = 'usdt';

const ENDPOINTS = {
	GET_PRICE: '/oracle/prices',
};

export const setPricesAndAssetPending = () => {
	return (dispatch) => {
		dispatch({ type: SET_PRICES_AND_ASSET_PENDING });
	};
};

export const getPrices = async ({
	amount = 1,
	quote = localStorage?.getItem('base_currnecy')
		? localStorage?.getItem('base_currnecy')
		: 'usdt',
	coins = {},
}) => {
	const assets = Object.keys(coins).join();
	const { data: prices = {} } = await axios.get(ENDPOINTS.GET_PRICE, {
		params: { amount, quote, assets },
	});
	return prices;
};

const extractUsdtToDisplayRate = (oraclePrices, displayCurrency) => {
	if (!displayCurrency || displayCurrency.toLowerCase() === WS_QUOTE_CURRENCY) {
		return 1;
	}
	const raw = oraclePrices?.[WS_QUOTE_CURRENCY];
	if (typeof raw === 'number' && raw > 0) return raw;
	if (raw && typeof raw === 'object' && typeof raw.price === 'number')
		return raw.price;
	return 1;
};

export const setPricesAndAsset = (balance, coins, displayCurrencyOverride) => {
	return async (dispatch, getState) => {
		dispatch({ type: SET_PRICES_AND_ASSET_PENDING });

		try {
			const state = getState();
			const wsPriceData = state?.asset?.wsPriceData || {};
			const displayCurrency =
				displayCurrencyOverride ||
				state?.user?.userData?.settings?.interface?.display_currency ||
				localStorage?.getItem('base_currnecy') ||
				BASE_CURRENCY;

			const prices = await getPrices({
				coins,
				quote: displayCurrency,
			});
			const totalAssetInUsdt = calculateBalancePrice(
				balance,
				wsPriceData,
				coins
			);
			const usdtToDisplayRate = extractUsdtToDisplayRate(
				prices,
				displayCurrency
			);
			const totalAsset = totalAssetInUsdt * usdtToDisplayRate;

			dispatch({
				type: SET_PRICES_AND_ASSET_SUCCESS,
				payload: {
					oraclePrices: prices,
					totalAsset,
					usdtToDisplayRate,
					chartData: generateChartData(
						balance,
						wsPriceData,
						coins,
						totalAsset,
						usdtToDisplayRate
					),
				},
			});
		} catch (err) {
			dispatch({ type: SET_PRICES_AND_ASSET_FAILURE });
		}
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

export const generateChartData = (
	balance,
	prices,
	coins,
	totalAsset,
	usdtToDisplayRate = 1
) => {
	const data = [];

	Object.keys(coins).forEach((currency) => {
		const { symbol, min } = coins[currency] || DEFAULT_COIN_DATA;
		const currencyBalanceInUsdt = calculateOraclePrice(
			balance[`${symbol}_balance`],
			prices[symbol]
		);
		const currencyBalance = currencyBalanceInUsdt * usdtToDisplayRate;
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
