import math from 'mathjs';
import { createSelector } from 'reselect';
import { getDecimals } from 'utils/utils';
import { formatPercentage, formatNumber } from 'utils/currency';
import { BASE_CURRENCY, DEFAULT_COIN_DATA } from 'config/constants';

export const subtract = (a = 0, b = 0) => {
	const remaining = math.chain(a).subtract(b).done();
	return remaining;
};

const sumQuantities = (orders) =>
	orders.reduce((total, [, size]) => math.add(total, size), 0);

const sumOrderTotal = (orders) =>
	orders.reduce(
		(total, [price, size]) =>
			math.add(total, math.multiply(math.fraction(size), math.fraction(price))),
		0
	);

const calcMaxCumulative = (askOrders, bidOrders) => {
	const totalAsks = sumQuantities(askOrders);
	const totalBids = sumQuantities(bidOrders);
	return Math.max(totalAsks, totalBids);
};

const pushCumulativeAmounts = (orders) => {
	let cumulative = 0;
	let cumulativePrice = 0;
	return orders.map((order) => {
		const [price, size] = order;
		const id = price;
		cumulative = math.add(cumulative, size);
		cumulativePrice = math.add(
			cumulativePrice,
			math.multiply(math.fraction(size), math.fraction(price))
		);
		return [...order, cumulative, cumulativePrice, id];
	});
};

const round = (number, depth) => {
	const precision = getDecimals(depth);
	let result = math
		.chain(number)
		.divide(depth)
		.round()
		.multiply(depth)
		.round(precision)
		.done();

	// this is to prevent setting the price to 0
	if (!result) {
		result = math
			.chain(number)
			.divide(depth)
			.ceil()
			.multiply(depth)
			.round(precision)
			.done();
	}

	return result;
};

const calculateOrders = (orders, depth) =>
	orders.reduce((result, [price, size]) => {
		const lastIndex = result.length - 1;
		const [lastPrice, lastSize] = result[lastIndex] || [];

		if (lastPrice && math.equal(round(price, depth), lastPrice)) {
			result[lastIndex] = [lastPrice, math.add(lastSize, size)];
		} else {
			result.push([round(price, depth), size]);
		}

		return result;
	}, []);

const getPairsOrderBook = (state) => state.orderbook.pairsOrderbooks;
const getQuickTradeOrderBook = (state) => state.quickTrade.pairsOrderbooks;
const getPair = (state) => state.app.pair;
const getActiveOrderMarket = (state) => state.app.activeOrdersMarket;
const getRecentTradesMarket = (state) => state.app.recentTradesMarket;
const getOrderBookLevels = (state) =>
	state.user.settings.interface.order_book_levels;
const getPairsTrades = (state) => state.orderbook.pairsTrades;
const getActiveOrders = (state) => state.order.activeOrders;
const getUserTradesData = (state) => state.wallet.trades.data;
const getPairs = (state) => state.app.pairs;
const getDepth = (state) => state.orderbook.depth;
const getChartClose = (state) => state.orderbook.chart_last_close;
const getTickers = (state) => state.app.tickers;
const getCoins = (state) => state.app.coins;
const getFavourites = (state) => state.app.favourites;

export const orderbookSelector = createSelector(
	[getPairsOrderBook, getPair, getOrderBookLevels, getPairs, getDepth],
	(pairsOrders, pair, level, pairs, depthLevel = 1) => {
		const { increment_price = 1 } = pairs[pair] || {};
		const { asks: rawAsks = [], bids: rawBids = [] } = pairsOrders[pair] || {};

		const depth = math.multiply(depthLevel, increment_price);
		const calculatedAsks = calculateOrders(rawAsks, depth);
		const calculatedBids = calculateOrders(rawBids, depth);

		const filteredAsks = calculatedAsks.filter((ask, index) => index < level);
		const filteredBids = calculatedBids.filter((bid, index) => index < level);

		const maxCumulative = calcMaxCumulative(filteredAsks, filteredBids);
		const asks = pushCumulativeAmounts(filteredAsks);
		const bids = pushCumulativeAmounts(filteredBids);

		return { maxCumulative, asks, bids };
	}
);

const pushId = (record) => {
	const { price, size, timestamp, side } = record;
	const id = `${price}${size}${timestamp}${side}`;
	return { id, ...record };
};

export const tradeHistorySelector = createSelector(
	getPairsTrades,
	getPair,
	(pairsTrades, pair) => {
		const data = pairsTrades[pair] || [];
		const dataWithId = data.map((record) => pushId(record));
		const sizeArray = data.map(({ size }) => size);
		const maxAmount = Math.max(...sizeArray);
		return { data: dataWithId, maxAmount };
	}
);

export const marketPriceSelector = createSelector(
	[tradeHistorySelector, getChartClose],
	({ data: tradeHistory }, chartCloseValue) => {
		const marketPrice =
			tradeHistory && tradeHistory.length > 0
				? tradeHistory[0].price
				: chartCloseValue;
		return marketPrice;
	}
);

const modifyTradesAndOrders = (data, coins) => {
	return data.map((record) => {
		const { symbol: pair, fee_coin } = record;
		const [pair_base, pair_2] = pair.split('-');
		const { display_name: pair_base_display, icon_id } =
			coins[pair_base] || DEFAULT_COIN_DATA;
		const { display_name: pair_2_display } = coins[pair_2] || DEFAULT_COIN_DATA;
		const { display_name: fee_coin_display } =
			coins[fee_coin || pair_base] || DEFAULT_COIN_DATA;
		const display_name = `${pair_base_display}-${pair_2_display}`;
		return {
			...record,
			display_name,
			pair_base_display,
			pair_2_display,
			fee_coin_display,
			icon_id,
		};
	});
};

export const activeOrdersSelector = createSelector(
	getActiveOrders,
	getActiveOrderMarket,
	getCoins,
	(orders, pair, coins) => {
		return modifyTradesAndOrders(
			pair ? orders.filter(({ symbol }) => symbol === pair) : orders,
			coins
		);
	}
);

export const userTradesSelector = createSelector(
	getUserTradesData,
	getRecentTradesMarket,
	getCoins,
	(trades, pair, coins) => {
		return modifyTradesAndOrders(
			pair ? trades.filter(({ symbol }) => symbol === pair) : trades,
			coins
		);
	}
);

const getSide = (_, { side }) => side;
const getSize = (_, { size }) => (!!size ? size : 0);
const getFirstAssetCheck = (_, { isFirstAsset }) => isFirstAsset;

const calculateMarketPrice = (orderSize = 0, orders = []) =>
	orders.reduce(
		([accumulatedPrice, accumulatedSize], [price = 0, size = 0]) => {
			if (math.larger(orderSize, accumulatedSize)) {
				const remainingSize = math.subtract(orderSize, accumulatedSize);
				if (math.largerEq(remainingSize, size)) {
					return [
						math.sum(accumulatedPrice, math.multiply(size, price)),
						math.sum(accumulatedSize, size),
					];
				} else {
					return [
						math.sum(accumulatedPrice, math.multiply(remainingSize, price)),
						math.sum(accumulatedSize, remainingSize),
					];
				}
			} else {
				return [accumulatedPrice, accumulatedSize];
			}
		},
		[0, 0]
	);

const calculateMarketPriceByTotal = (orderSize = 0, orders = []) =>
	orders.reduce(
		([accumulatedPrice, accumulatedSize], [price = 0, size = 0]) => {
			if (math.larger(orderSize, accumulatedPrice)) {
				let currentTotal = math.multiply(size, price);
				const remainingSize = math.subtract(orderSize, accumulatedPrice);
				if (math.largerEq(remainingSize, currentTotal)) {
					return [
						math.sum(accumulatedPrice, currentTotal),
						math.sum(accumulatedSize, size),
					];
				} else {
					let remainingBaseSize = math.divide(remainingSize, price);
					return [
						math.sum(accumulatedPrice, math.multiply(remainingBaseSize, price)),
						math.sum(accumulatedSize, remainingBaseSize),
					];
				}
			} else {
				return [accumulatedPrice, accumulatedSize];
			}
		},
		[0, 0]
	);

export const estimatedMarketPriceSelector = createSelector(
	[getPairsOrderBook, getPair, getSide, getSize],
	(pairsOrders, pair, side, size) => {
		const { [side === 'buy' ? 'asks' : 'bids']: orders = [] } =
			pairsOrders[pair] || {};
		const totalOrders = sumQuantities(orders);
		if (math.larger(size, totalOrders)) {
			return [0, size];
		} else {
			return calculateMarketPrice(size, orders);
		}
	}
);

export const estimatedQuickTradePriceSelector = createSelector(
	[getQuickTradeOrderBook, getPair, getSide, getSize, getFirstAssetCheck],
	(pairsOrders, pair, side, size, isFirstAsset) => {
		const { [side === 'buy' ? 'asks' : 'bids']: orders = [] } =
			pairsOrders[pair] || {};
		let totalOrders = sumQuantities(orders);
		if (!isFirstAsset) {
			totalOrders = sumOrderTotal(orders);
		}
		if (math.larger(size, totalOrders)) {
			return [0, size];
		} else if (!isFirstAsset) {
			const [priceValue, sizeValue] = calculateMarketPriceByTotal(size, orders);
			return [priceValue / sizeValue, sizeValue];
		} else {
			const [priceValue, sizeValue] = calculateMarketPrice(size, orders);
			return [priceValue / sizeValue, sizeValue];
		}
	}
);

export const sortedPairKeysSelector = createSelector(
	[getPairs, getTickers, getFavourites],
	(pairs, tickers, favourites) => {
		const sortedPairKeys = Object.keys(pairs).sort((a, b) => {
			const { volume: volumeA = 0, close: closeA = 0 } = tickers[a] || {};
			const { volume: volumeB = 0, close: closeB = 0 } = tickers[b] || {};
			const marketCapA = math.multiply(volumeA, closeA);
			const marketCapB = math.multiply(volumeB, closeB);
			return marketCapB - marketCapA;
		});

		const pinnedCoins = ['xht'];
		const favouriteKeys = [];
		const pinnedKeys = [];
		const filteredKeys = [];

		sortedPairKeys.forEach((key) => {
			const { pair_base, pair_2 } = pairs[key];
			if (favourites.includes(key)) {
				favouriteKeys.push(key);
			} else if (
				pinnedCoins.includes(pair_base) ||
				pinnedCoins.includes(pair_2)
			) {
				pinnedKeys.push(key);
			} else {
				filteredKeys.push(key);
			}
		});

		return [...favouriteKeys, ...pinnedKeys, ...filteredKeys];
	}
);

export const MarketsSelector = createSelector(
	[sortedPairKeysSelector, getPairs, getTickers, getCoins],
	(sortedPairKeys, pairs, tickers, coins) => {
		const markets = sortedPairKeys.map((key) => {
			const {
				pair_base,
				pair_2,
				increment_price,
				display_name,
				pair_base_display,
				pair_2_display,
				icon_id,
			} = pairs[key] || {};
			const { fullname, symbol = '' } =
				coins[pair_base || BASE_CURRENCY] || DEFAULT_COIN_DATA;
			const pairTwo = coins[pair_2] || DEFAULT_COIN_DATA;
			const { open, close } = tickers[key] || {};

			const priceDifference = open === 0 ? 0 : (close || 0) - (open || 0);

			const tickerPercent =
				priceDifference === 0 || open === 0
					? 0
					: (priceDifference / open) * 100;

			const priceDifferencePercent = isNaN(tickerPercent)
				? formatPercentage(0)
				: formatPercentage(tickerPercent);
			return {
				key,
				pair: pairs[key],
				symbol,
				pairTwo,
				fullname,
				ticker: tickers[key] || {},
				increment_price,
				priceDifference,
				priceDifferencePercent,
				display_name,
				pair_base_display,
				pair_2_display,
				icon_id,
			};
		});

		return markets;
	}
);

export const depthChartSelector = createSelector(
	[orderbookSelector, marketPriceSelector, getPairs, getPair],
	({ asks: fullAsks, bids: fullBids }, price, pairs, pair) => {
		const { increment_size = 1 } = pairs[pair] || {};

		const asks = fullAsks.map(([orderPrice, , accSize]) => [
			orderPrice,
			formatNumber(accSize, getDecimals(increment_size)),
		]);
		const bids = fullBids
			.map(([orderPrice, , accSize]) => [
				orderPrice,
				formatNumber(accSize, getDecimals(increment_size)),
			])
			.reverse();

		const series = [
			{
				name: 'Bids',
				data: bids,
				className: 'depth-chart__bids',
				marker: {
					enabled: false,
				},
				xAxis: 0,
			},
			{
				name: 'Asks',
				data: asks,
				className: 'depth-chart__asks',
				marker: {
					enabled: false,
				},
				xAxis: 1,
			},
		];

		return {
			price,
			series,
		};
	}
);
