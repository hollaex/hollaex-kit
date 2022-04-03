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
		let flippedPair = pair.split('-');
		flippedPair = flippedPair.reverse().join('-');
		let brokerPairLimits = {};
		const selectedBroker =
			brokerObj && (brokerObj[pair] ? brokerObj[pair] : brokerObj[flippedPair]);
		if (selectedBroker) {
			const { min_size, max_size, increment_size } = selectedBroker;
			brokerPairLimits = {
				[pair]: {
					SIZE: {
						MIN: min_size,
						MAX: max_size,
						STEP: increment_size,
					},
					PRICE: {},
				},
			};
		}
		return brokerPairLimits;
	}
);
