import math from 'mathjs';
import { createSelector } from 'reselect';
import { DIGITAL_ASSETS_SORT } from 'actions/appActions';
import { unsortedMarketsSelector, getPairs } from 'containers/Trade/utils';
import { getPinnedAssets } from 'containers/Wallet/utils';

const getSortMode = (state) => state.app.digital_assets_sort.mode;
const getSortDir = (state) => state.app.digital_assets_sort.is_descending;

const getSortFunction = (mode) => {
	switch (mode) {
		case DIGITAL_ASSETS_SORT.CHANGE:
		default:
			return (a, b) => math.subtract(b.tickerPercent, a.tickerPercent);
	}
};

const sortedMarketsSelector = createSelector(
	[unsortedMarketsSelector, getSortMode, getSortDir],
	(markets, mode, is_descending) => {
		const sortedMarkets = markets.sort(getSortFunction(mode, is_descending));
		return is_descending ? sortedMarkets : [...sortedMarkets].reverse();
	}
);

const pinnedMarketsSelector = createSelector(
	[getPairs, getPinnedAssets],
	(pairs, pinnedAssets) => {
		const pinnedMarkets = [];

		pinnedAssets.forEach((pin) => {
			for (const key in pairs) {
				const { pair_base } = pairs[key];
				if (pin === pair_base) {
					pinnedMarkets.push(key);
					break;
				}
			}
		});

		return pinnedMarkets;
	}
);

export const MarketsSelector = createSelector(
	[sortedMarketsSelector, pinnedMarketsSelector],
	(markets, pins = []) => {
		const pinnedMarkets = [];
		const restMarkets = markets.filter(({ key }) => !pins.includes(key));

		pins.forEach((pin) => {
			const market = markets.find(({ key }) => key === pin);
			if (market) {
				pinnedMarkets.push(market);
			}
		});

		return [...pinnedMarkets, ...restMarkets];
	}
);
