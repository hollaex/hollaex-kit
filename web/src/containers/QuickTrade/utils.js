import { createSelector } from 'reselect';
import math from 'mathjs';

const getTickers = (state) => state.app.tickers;
const getOrderLimits = (state) => state.app.orderLimits;
const getBroker = (state) => state.app.broker;
const getPair = (state) => state.app.pair;

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
export const BrokerLimitsSelector = createSelector(
	[getBroker, getPair],
	(broker, pair) => {
		let brokerObj = {};
		broker.forEach(
			(item) => (brokerObj = { ...brokerObj, [item.symbol]: item })
		);
		let brokerPairLimits = {};
		if (brokerObj && brokerObj[pair]) {
			brokerPairLimits = {
				[pair]: {
					SIZE: {
						MIN: brokerObj[pair].min_size,
						MAX: brokerObj[pair].max_size,
						STEP: brokerObj[pair].increment_size,
					},
					PRICE: {},
				},
			};
		}
		return brokerPairLimits;
	}
);
