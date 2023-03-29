import math from 'mathjs';
import { createSelector } from 'reselect';
import { DIGITAL_ASSETS_SORT } from 'actions/appActions';
import {
	unsortedMarketsSelector,
	getPairs,
	getKitInfo,
} from 'containers/Trade/utils';
import { handleUpgrade } from 'utils/utils';
import { pinnedAssetsSelector } from 'containers/Wallet/utils';
import { DEFAULT_PINNED_COINS } from 'config/constants';

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
	[getPairs, getKitInfo, pinnedAssetsSelector],
	(pairs, info, pinnedAssets) => {
		const isBasic = handleUpgrade(info);

		const pinnedCoins = isBasic ? DEFAULT_PINNED_COINS : pinnedAssets;
		const pinnedMarkets = [];

		pinnedCoins.forEach((pin) => {
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
