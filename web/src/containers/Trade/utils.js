import math from 'mathjs';
import { createSelector } from 'reselect';
import { getDecimals, handleUpgrade } from 'utils/utils';
import {
	formatCurrencyByIncrementalUnit,
	formatPercentage,
	formatNumber,
	calculateOraclePrice,
} from 'utils/currency';
import { BASE_CURRENCY, DEFAULT_COIN_DATA } from 'config/constants';
import { SORT } from 'actions/appActions';

export const subtract = (a = 0, b = 0) => {
	const remaining = math.chain(a).subtract(b).done();
	return remaining;
};

const sumQuantities = (orders) =>
	orders.reduce((total, [, size]) => math.add(total, size), 0);

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
const getPair = (state) => state.app.pair;
const getActiveOrderMarket = (state) => state.app.activeOrdersMarket;
const getRecentTradesMarket = (state) => state.app.recentTradesMarket;
const getOrderBookLevels = (state) =>
	state.user.settings.interface.order_book_levels;
const getPairsTrades = (state) => state.orderbook.pairsTrades;
const getActiveOrders = (state) => state.order.activeOrders;
const getUserTradesData = (state) => state.wallet.trades.data;
export const getPairs = (state) => state.app.pairs;
const getDepth = (state) => state.orderbook.depth;
const getChartClose = (state) => state.orderbook.chart_last_close;
const getTickers = (state) => state.app.tickers;
const getCoins = (state) => state.app.coins;
export const getFavourites = (state) => state.app.favourites;
const getPrices = (state) => state.asset.oraclePrices;
const getNativeCurrency = (state) => state.app.constants.native_currency;
const getSortMode = (state) => state.app.sort.mode;
const getSortDir = (state) => state.app.sort.is_descending;
export const getKitInfo = (state) => state.app.info;
export const getPinnedMarkets = (state) => state.app.pinned_markets;

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
		const data = (pairsTrades[pair] || [])?.filter(
			(record) => record && record
		);
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

const pairKeysSelector = createSelector([getPairs], (pairs) =>
	Object.keys(pairs)
);

export const selectMarketOptions = createSelector(
	[pairKeysSelector, getPairs, getCoins],
	(pairKeys, pairs, coins) => {
		const markets = pairKeys.map((key) => {
			const { pair_base, pair_2 } = pairs[key] || {};

			return {
				key,
				pairBase: {
					symbol: coins[pair_base].symbol,
					fullname: coins[pair_base].fullname,
				},
				pair2: {
					symbol: coins[pair_2].symbol,
					fullname: coins[pair_2].fullname,
				},
			};
		});

		return markets;
	}
);

export const unsortedMarketsSelector = createSelector(
	[
		pairKeysSelector,
		getPairs,
		getTickers,
		getCoins,
		getPrices,
		getNativeCurrency,
	],
	(pairKeys, pairs, tickers, coins, prices, native_currency) => {
		const markets = pairKeys.map((key) => {
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
			const { volume = 0, open, close } = tickers[key] || {};
			const { [pair_base]: price = 0 } = prices;
			const baseCoin = coins[native_currency] || DEFAULT_COIN_DATA;

			const priceDifference = open === 0 ? 0 : (close || 0) - (open || 0);

			const tickerPercent =
				priceDifference === 0 || open === 0
					? 0
					: (priceDifference / open) * 100;

			const priceDifferencePercent = isNaN(tickerPercent)
				? formatPercentage(0)
				: formatPercentage(tickerPercent);

			const volume_native = calculateOraclePrice(volume, price);
			const volume_native_text = `${formatCurrencyByIncrementalUnit(
				volume_native,
				baseCoin.increment_unit
			)} ${baseCoin.display_name}`;

			const fullMarketName = `${fullname}/${pairTwo.fullname}`;

			return {
				key,
				pair: pairs[key],
				symbol,
				pairTwo,
				fullname,
				fullMarketName,
				ticker: tickers[key] || {},
				increment_price,
				priceDifference,
				tickerPercent,
				priceDifferencePercent,
				display_name,
				pair_base_display,
				pair_2_display,
				icon_id,
				volume_native,
				volume_native_text,
			};
		});

		return markets;
	}
);

const getSortFunction = (mode) => {
	switch (mode) {
		case SORT.CHANGE:
			return (a, b) => math.subtract(b.tickerPercent, a.tickerPercent);
		case SORT.VOL:
		default:
			return (a, b) => math.subtract(b.volume_native, a.volume_native);
	}
};

const sortedMarketsSelector = createSelector(
	[unsortedMarketsSelector, getSortMode, getSortDir],
	(markets, mode, is_descending) => {
		const sortedMarkets = markets.sort(getSortFunction(mode, is_descending));
		return is_descending ? sortedMarkets : [...sortedMarkets].reverse();
	}
);

export const pinnedMarketsSelector = createSelector(
	[getPairs, getKitInfo, getPinnedMarkets],
	(pairs, info, pinnedMarkets) => {
		const isBasic = handleUpgrade(info);
		if (isBasic) {
			const pinnedCoins = ['xht'];
			const pinnedMarkets = [];
			Object.entries(pairs).forEach(([key, { pair_base, pair_2 }]) => {
				if (pinnedCoins.includes(pair_base) || pinnedCoins.includes(pair_2)) {
					pinnedMarkets.push(key);
				}
			});
			return pinnedMarkets;
		} else {
			return pinnedMarkets;
		}
	}
);

export const MarketsSelector = createSelector(
	[sortedMarketsSelector, getPairs, getFavourites, pinnedMarketsSelector],
	(markets, pairs, favourites, pins = []) => {
		const favouriteMarkets = [];
		const pinnedMarkets = [];
		const restMarkets = [];

		markets
			.filter(({ key }) => !pins.includes(key))
			.forEach((market) => {
				const { key } = market;

				if (favourites.includes(key)) {
					favouriteMarkets.push(market);
				} else {
					restMarkets.push(market);
				}
			});

		pins.forEach((pin) => {
			const market = markets.find(({ key }) => key === pin);
			if (market) {
				pinnedMarkets.push(market);
			}
		});

		return [...pinnedMarkets, ...favouriteMarkets, ...restMarkets];
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
