import React from 'react';
import { Button } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { createSelector } from 'reselect';
import math from 'mathjs';

import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { Coin, Dialog, EditWrapper } from 'components';
import { calculateOraclePrice } from 'utils/currency';
import { WALLET_SORT } from 'actions/appActions';
import { Image } from 'hollaex-web-lib';
import { networkList, renderNetworkWithLabel } from 'containers/Withdraw/utils';

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

export const AddressBookDialog = ({
	coins,
	network,
	coinLength,
	selectedAsset,
	userLabel,
	renderPopUps,
	networkIcon,
	hasOptionalTag,
	onHandleClose,
	onHandlePopUpBtn,
	onHandleAddressBookDetails,
	setRenderPopUps,
}) => {
	return (
		<Dialog
			isOpen={
				renderPopUps.step3
					? renderPopUps.step3
					: renderPopUps.remove && renderPopUps.remove
			}
			onCloseDialog={() => {
				renderPopUps.step3
					? onHandleClose('step3')
					: renderPopUps.remove &&
					  setRenderPopUps((prev) => ({ ...prev, remove: false }));
			}}
			className="address_book_popup_wrapper"
		>
			<div className="confirm-popup-wrapper">
				<div className="confirm-header-wrapper">
					<div className="address-book-title">
						<EditWrapper
							stringId={`${
								renderPopUps.step3
									? 'ADDRESS_BOOK.CHECK_AND_CONFIRM'
									: renderPopUps.remove && 'ADDRESS_BOOK.REMOVE_ADDRESS'
							}`}
						>
							{
								STRINGS[
									renderPopUps.step3
										? 'ADDRESS_BOOK.CHECK_AND_CONFIRM'
										: renderPopUps.remove && 'ADDRESS_BOOK.REMOVE_ADDRESS'
								]
							}
						</EditWrapper>
					</div>
					{renderPopUps.step3 && (
						<div>
							<EditWrapper stringId="ADDRESS_BOOK.WARNING_ADDRESS">
								{STRINGS['ADDRESS_BOOK.WARNING_ADDRESS']}
							</EditWrapper>
						</div>
					)}
				</div>
				<div className="selected-assets-content mt-4">
					<div className="assets-field confirm_name_detail">
						<div className="confirm-title-text">
							<EditWrapper stringId="DEVELOPERS_TOKENS_TABLE.NAME">
								{STRINGS['DEVELOPERS_TOKENS_TABLE.NAME']}:
							</EditWrapper>
						</div>
						<div>
							<span>
								{' '}
								{renderPopUps.step3
									? userLabel
									: renderPopUps.remove && selectedAsset?.selectedData?.label}
							</span>
						</div>
					</div>
					<div className="assets-content">
						<div className="assets-field">
							<div className="confirm-title-text">
								<EditWrapper stringId="ASSETS">
									{STRINGS['ASSETS']}:
								</EditWrapper>
							</div>
							<div className="selected-asset">
								<Coin
									iconId={
										coins[
											renderPopUps.step3
												? selectedAsset?.selectedCurrency
												: renderPopUps.remove &&
												  selectedAsset?.selectedData?.currency
										]?.icon_id
									}
									type="CS2"
								/>
								<span>{`${
									coins[
										renderPopUps.step3
											? selectedAsset?.selectedCurrency
											: renderPopUps.remove &&
											  selectedAsset?.selectedData?.currency
									]?.fullname
								} (${
									renderPopUps.step3
										? selectedAsset?.selectedCurrency.toUpperCase()
										: renderPopUps.remove &&
										  selectedAsset?.selectedData?.currency.toUpperCase()
								})`}</span>
							</div>
						</div>
						<div className="assets-field">
							<div className="confirm-title-text">
								<EditWrapper stringId="WITHDRAWALS_FORM_NETWORK_LABEL">
									{STRINGS['WITHDRAWALS_FORM_NETWORK_LABEL']}:
								</EditWrapper>
							</div>
							<div>
								<span>
									{' '}
									{renderPopUps.step3 ? (
										coinLength?.length === 1 ? (
											renderNetworkWithLabel(networkIcon, network)
										) : coinLength?.length > 1 ? (
											<div className="selected-network">
												<span>{selectedAsset?.networkOptions}</span>
												{networkList.map((data) =>
													data.network === selectedAsset?.networkOptions ? (
														<Coin iconId={data.iconId} type="CS2" />
													) : null
												)}
											</div>
										) : coins[network]?.network ? (
											coins[network]?.network?.toUpperCase()
										) : (
											coins[network]?.symbol?.toUpperCase()
										)
									) : (
										renderPopUps.remove &&
										renderNetworkWithLabel(
											coins[selectedAsset?.selectedData?.network]?.icon_id,
											selectedAsset?.selectedData?.network
										)
									)}
								</span>
							</div>
						</div>
						<div className="mt-3 mb-3 address-book-detail-line"></div>
						<div className="assets-field">
							<div className="confirm-title-text">
								<EditWrapper stringId="WITHDRAW_PAGE.WITHDRAWAL_CONFIRM_ADDRESS">
									{STRINGS['WITHDRAW_PAGE.WITHDRAWAL_CONFIRM_ADDRESS']}:
								</EditWrapper>
							</div>
							<div className="selected-asset-address">
								<span>
									{renderPopUps.step3
										? selectedAsset?.address
										: renderPopUps.remove &&
										  selectedAsset?.selectedData?.address.split(':')[0]}
								</span>
							</div>
						</div>
						{(renderPopUps.step3
							? hasOptionalTag && selectedAsset?.optionalTag
							: renderPopUps.remove &&
							  selectedAsset?.selectedData?.address?.split(':')[1]) && (
							<div className="assets-field">
								<div className="confirm-title-text">
									<EditWrapper stringId="ACCORDIAN.TAG">
										{STRINGS['ACCORDIAN.TAG']}
									</EditWrapper>
								</div>
								<div className="selected-asset-address">
									<span>
										{renderPopUps.step3
											? selectedAsset?.optionalTag
											: renderPopUps.remove &&
											  selectedAsset?.selectedData?.address?.split(':')[1]}
									</span>
								</div>
							</div>
						)}
					</div>
				</div>
				<div
					className={`${
						renderPopUps.step3
							? 'warning-message-wrapper'
							: renderPopUps.removie && 'remove-message-wrapper'
					}`}
				>
					{renderPopUps.step3 && <ExclamationCircleFilled />}
					<div className="mt-1">
						<EditWrapper
							stringId={`${
								renderPopUps.step3
									? 'ADDRESS_BOOK.ENSURE_DESC'
									: renderPopUps.remove && 'ADDRESS_BOOK.REMOVE_CONTENT'
							}`}
						>
							{
								STRINGS[
									renderPopUps.step3
										? 'ADDRESS_BOOK.ENSURE_DESC'
										: renderPopUps.remove && 'ADDRESS_BOOK.REMOVE_CONTENT'
								]
							}
						</EditWrapper>
					</div>
				</div>
				<div className="address-book-popup-button-wrapper">
					<RenderBtn
						string="REFERRAL_LINK.BACK"
						buttonClassName="back-btn"
						onHandleClick={() => {
							renderPopUps.step3
								? onHandlePopUpBtn('step3', 'step2')
								: renderPopUps.remove &&
								  setRenderPopUps((prev) => ({ ...prev, remove: false }));
						}}
					/>
					<Button
						className="text-uppercase next-btn"
						type="default"
						onClick={() => {
							if (renderPopUps.step3) {
								onHandleAddressBookDetails(null, 'confirm');
							}
							if (renderPopUps.remove) {
								onHandleAddressBookDetails(
									selectedAsset?.selectedData,
									'revoke'
								);
								setRenderPopUps((prev) => ({ ...prev, remove: false }));
							}
						}}
					>
						<EditWrapper
							stringId={`${
								renderPopUps.step3
									? 'DUST.CONFIRMATION.CONFIRM'
									: renderPopUps.remove && 'ADDRESS_BOOK.REMOVE'
							}`}
						>
							{
								STRINGS[
									renderPopUps.step3
										? 'DUST.CONFIRMATION.CONFIRM'
										: renderPopUps.remove && 'ADDRESS_BOOK.REMOVE'
								]
							}
						</EditWrapper>
					</Button>
				</div>
			</div>
		</Dialog>
	);
};
