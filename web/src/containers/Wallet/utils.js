import math from 'mathjs';
import { createSelector } from 'reselect';
import { calculateOraclePrice } from 'utils/currency';
import { WALLET_SORT } from 'actions/appActions';
import { handleUpgrade } from 'utils/utils';
import { DEFAULT_PINNED_COINS } from 'config/constants';

const getCoins = (state) => state.app.coins;
const getBalances = (state) => state.user.balance;
const getOraclePrices = (state) => state.asset.oraclePrices;
const getSortMode = (state) => state.app.wallet_sort.mode;
const getSortDir = (state) => state.app.wallet_sort.is_descending;
const getKitInfo = (state) => state.app.info;
export const getPinnedAssets = (state) => state.app.pinned_assets;

export const selectAssetOptions = createSelector([getCoins], (coins) => {
	const assets = Object.entries(coins).map(([key, { symbol, fullname }]) => {
		return {
			key,
			symbol,
			fullname,
		};
	});

	return assets;
});

export const pinnedAssetsSelector = createSelector(
	[getKitInfo, getPinnedAssets],
	(info, pinnedAssets) => {
		const isBasic = handleUpgrade(info);

		if (isBasic) {
			return DEFAULT_PINNED_COINS;
		} else {
			return pinnedAssets;
		}
	}
);

const unsortedAssetsSelector = createSelector(
	[getCoins, getBalances, getOraclePrices],
	(coins, balances, oraclePrices) => {
		const assets = {};

		Object.entries(coins).forEach(([key, coin]) => {
			if (balances.hasOwnProperty(`${key}_balance`)) {
				const oraclePrice = oraclePrices[key];
				const balance = balances[`${key}_balance`];
				const price = calculateOraclePrice(balance, oraclePrice);

				assets[key] = {
					...coin,
					oraclePrice,
					balance,
					price,
				};
			}
		});

		return assets;
	}
);

const getSortFunction = (mode) => {
	switch (mode) {
		case WALLET_SORT.AMOUNT:
		default:
			return ([, a], [, b]) => math.subtract(b.price, a.price);
	}
};

export const sortedAssetsSelector = createSelector(
	[unsortedAssetsSelector, getSortMode, getSortDir],
	(unsortedAssets, mode, is_descending) => {
		const sorted_assets = Object.entries(unsortedAssets).sort(
			getSortFunction(mode)
		);
		return is_descending ? sorted_assets : [...sorted_assets].reverse();
	}
);

export const assetsSelector = createSelector(
	[sortedAssetsSelector, pinnedAssetsSelector],
	(assets, pins = []) => {
		const pinnedAssets = [];
		const restAssets = [];

		assets
			.filter(([key]) => !pins.includes(key))
			.forEach((asset) => {
				restAssets.push(asset);
			});

		pins.forEach((pin) => {
			const asset = assets.find(([key]) => key === pin);
			if (asset) {
				pinnedAssets.push(asset);
			}
		});

		return [...pinnedAssets, ...restAssets];
	}
);

export const searchAssets = (assets, searchValue = '', isZeroBalanceHidden) => {
	const searchTerm = searchValue.toLowerCase().trim();

	return assets.filter(([key, { fullname, balance }]) => {
		const coinName = fullname ? fullname.toLowerCase() : '';
		const hasCoinBalance = !!balance;
		const isCoinHidden = isZeroBalanceHidden && !hasCoinBalance;

		return (
			!isCoinHidden &&
			(key.indexOf(searchTerm) !== -1 || coinName.indexOf(searchTerm) !== -1)
		);
	});
};
