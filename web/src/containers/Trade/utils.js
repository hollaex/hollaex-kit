import math from 'mathjs';
import { createSelector } from 'reselect';

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

const calculateOrders = (orders, depth) =>
	orders.reduce((result, [price, size]) => {
		const lastIndex = result.length - 1;
		const [lastPrice, lastSize] = result[lastIndex] || [];
		if (lastPrice && Math.abs(price - lastPrice) < depth) {
			result[lastIndex] = [lastPrice, lastSize + size];
		} else {
			result.push([price, size]);
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
	(pairsOrders, pair, level, pairs, depthLevel) => {
		const { increment_price } = pairs[pair] || {};
		const { asks: rawAsks = [], bids: rawBids = [] } = pairsOrders[pair] || {};

		const depth = depthLevel * increment_price;
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
		let count = 0;
		return orders.filter(({ symbol }) => symbol === pair && count++ < 50);
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
