import { createSelector } from 'reselect';
import { unique } from 'utils/data';

export const flipPair = (pair) => pair?.split('-').reverse().join('-');

export const getSourceOptions = (quicktrade = []) => {
	const coins = [];

	quicktrade
		.filter(({ active }) => !!active)
		.forEach(({ symbol }) => {
			coins.push(...symbol.split('-'));
		});

	return unique(coins);
};

const getQuickTrade = (state) => state.app.quicktrade;

export const quicktradePairSelector = createSelector(
	[getQuickTrade],
	(quicktrade) => {
		return Object.fromEntries(
			quicktrade
				.filter(({ active }) => !!active)
				.map((data) => [data.symbol, data])
		);
	}
);
