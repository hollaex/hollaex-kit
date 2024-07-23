import React from 'react';
import { Button } from 'antd';
import { createSelector } from 'reselect';
import math from 'mathjs';

import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { EditWrapper } from 'components';
import { calculateOraclePrice } from 'utils/currency';
import { WALLET_SORT } from 'actions/appActions';
import { Image } from 'hollaex-web-lib';

const getCoins = (state) => state.app.coins;
const getBalances = (state) => state.user.balance;
const getOraclePrices = (state) => state.asset.oraclePrices;
const getSortMode = (state) => state.app.wallet_sort.mode;
const getSortDir = (state) => state.app.wallet_sort.is_descending;
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
	[sortedAssetsSelector, getPinnedAssets],
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

	return assets.filter(([key, { fullname, balance, symbol }]) => {
		const coinName = fullname ? fullname.toLowerCase() : '';
		const symbolName = symbol ? symbol.toLowerCase() : '';
		const hasCoinBalance = !!balance;
		const isCoinHidden = isZeroBalanceHidden && !hasCoinBalance;

		if (searchTerm) {
			return searchTerm === '0'
				? balance <= 0
				: coinName?.includes(searchTerm) || symbolName?.includes(searchTerm);
		} else {
			return (
				!isCoinHidden &&
				(key.indexOf(searchTerm) !== -1 || coinName.indexOf(searchTerm) !== -1)
			);
		}
	});
};

export const RenderBtn = ({
	string,
	buttonClassName,
	onHandleClick,
	disabled = false,
}) => {
	return (
		<Button
			className={buttonClassName}
			type="default"
			onClick={() => onHandleClick()}
			disabled={disabled}
		>
			<EditWrapper stringId={string}>{STRINGS[string]}</EditWrapper>
		</Button>
	);
};

const AddressBookEmptyTable = ({ setRenderPopUps, icons: ICONS }) => {
	return (
		<div>
			<div className="empty-content-display">
				<div className="no-link-icon">
					<Image
						iconId="WITHDRAW_TITLE"
						icon={ICONS['WITHDRAW_TITLE']}
						wrapperClassName="form_currency-ball margin-aligner"
					/>
				</div>
				<div className="address-book-text">
					<EditWrapper stringId="ADDRESS_BOOK.NO_LINK">
						{STRINGS['ADDRESS_BOOK.NO_LINK']}
					</EditWrapper>
				</div>
				<div
					className="blue-link"
					onClick={() => setRenderPopUps((prev) => ({ ...prev, step1: true }))}
				>
					<EditWrapper stringId="ADDRESS_BOOK.ADD_WITHDRAWAL_ADDRESS_LINK">
						{STRINGS['ADDRESS_BOOK.ADD_WITHDRAWAL_ADDRESS_LINK']}
					</EditWrapper>
				</div>
			</div>
		</div>
	);
};

export default withConfig(AddressBookEmptyTable);
