import math from 'mathjs';
import { createSelector } from 'reselect';

export const subtract = (a = 0, b = 0) => {
	const remaining = math
		.chain(a)
		.subtract(b)
		.done();
	return remaining;
};

const getPairsOrderBook = state => state.orderbook.pairsOrderbooks;
const getPair = state => state.app.pair;
const getOrderBookLevels = state => state.user.settings.interface.order_book_levels;
const getPairsTrades = state => state.orderbook.pairsTrades;
const getActiveOrders = state => state.order.activeOrders;
const getUserTradesData = state => state.wallet.trades.data;

export const asksSelector = createSelector(getPairsOrderBook, getPair, getOrderBookLevels, (pairsOrders, pair, level) => {
	const { asks = [] } = pairsOrders[pair] || {};
	return asks.filter((ask, index) => index < level);
});

export const bidsSelector = createSelector(getPairsOrderBook, getPair, getOrderBookLevels, (pairsOrders, pair, level) => {
	const { bids = [] } = pairsOrders[pair] || {};
	return bids.filter((bid, index) => index < level);
});

export const tradeHistorySelector = createSelector(getPairsTrades, getPair, (pairsTrades, pair) => {
	return pairsTrades[pair] || {};
});

export const activeOrdersSelector = createSelector(getActiveOrders, getPair, (orders, pair) => {
	let count = 0;
	return orders.filter(
		({ symbol }) => symbol === pair && count++ < 50
	);
});

export const userTradesSelector = createSelector(getUserTradesData, getPair, (trades, pair) => {
	let count = 0;
	const filtered = trades.filter(
		({ symbol }) => symbol === pair && count++ < 10
	)
	return filtered;
});
