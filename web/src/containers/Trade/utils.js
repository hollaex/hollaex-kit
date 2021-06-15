import math from 'mathjs';
import { createSelector } from 'reselect';
import { getDecimals } from 'utils/utils';

export const subtract = (a = 0, b = 0) => {
	const remaining = math.chain(a).subtract(b).done();
	return remaining;
};

const sumQuantities = (orders) =>
	orders.reduce((total, [, size]) => total + size, 0);

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
		cumulative += size;
		cumulativePrice += math.multiply(math.fraction(size), math.fraction(price));
		return [...order, cumulative, cumulativePrice];
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
			result[lastIndex] = [lastPrice, lastSize + size];
		} else {
			result.push([round(price, depth), size]);
		}

		return result;
	}, []);

const getPairsOrderBook = (state) => state.orderbook.pairsOrderbooks;
const getPair = (state) => state.app.pair;
const getOrderBookLevels = (state) =>
	state.user.settings.interface.order_book_levels;
const getPairsTrades = (state) => state.orderbook.pairsTrades;
const getActiveOrders = (state) => state.order.activeOrders;
const getUserTradesData = (state) => state.wallet.trades.data;
const getPairs = (state) => state.app.pairs;
const getDepth = (state) => state.orderbook.depth;

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

export const tradeHistorySelector = createSelector(
	getPairsTrades,
	getPair,
	(pairsTrades, pair) => {
		const data = pairsTrades[pair] || [];
		const sizeArray = data.map(({ size }) => size);
		const maxAmount = Math.max(...sizeArray);
		return { data, maxAmount };
	}
);

export const marketPriceSelector = createSelector(
	[tradeHistorySelector],
	({ data: tradeHistory }) => {
		const marketPrice =
			tradeHistory && tradeHistory.length > 0 ? tradeHistory[0].price : 1;
		return marketPrice;
	}
);

export const activeOrdersSelector = createSelector(
	getActiveOrders,
	getPair,
	(orders, pair) => {
		return orders
	}
);

export const userTradesSelector = createSelector(
	getUserTradesData,
	getPair,
	(trades, pair) => {
		let count = 0;
		const filtered = trades.filter(
			({ symbol }) => symbol === pair && count++ < 10
		);
		return filtered;
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
