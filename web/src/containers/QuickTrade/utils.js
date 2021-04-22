import { createSelector } from 'reselect';
import math from 'mathjs';

const getTickers = (state) => state.app.tickers;
const getOrderLimits = (state) => state.app.orderLimits;

export const QuickTradeLimitsSelector = createSelector(
	[getTickers, getOrderLimits],
	(tickers, orderLimits) => {
		const QTLimits = {};
		Object.entries(orderLimits).forEach(([pair, limits]) => {
			const { close = 0 } = tickers[pair] || {};
			const { SIZE = {} } = limits;
			const { MIN, MAX, STEP } = SIZE;
			const QTPRICE = {
				STEP: math.multiply(STEP, close),
				MIN: math.multiply(MIN, close),
				MAX: math.multiply(MAX, close),
			};
			QTLimits[pair] = { ...limits, PRICE: QTPRICE };
		});
		return QTLimits;
	}
);
