import React, { Fragment, useState, useEffect } from 'react';
import { Input, Button, Checkbox, message } from 'antd';
import debounce from 'lodash.debounce';

import { STATIC_ICONS } from 'config/icons';
import { updateExchange } from '../AdminFinancials/action';

const Step2 = ({
	coins = [],
	exchangeCoins = [],
	activeTab,
	handleSearch,
	handleScreenChange,
	handleResetAsset,
	onClose,
	exchangeData = {},
	handleModalClose = () => {},
}) => {
	const [selectedAssets, setSelectedAssets] = useState([]);
	const [isProcessing, setIsProcessing] = useState(false);
	const [loadingStep, setLoadingStep] = useState(0);

	const loadingMessages = [
		{ title: `Looking for coin${selectedAssets?.length === 1 ? '' : 's'}` },
		{
			title: `Inserting coin${
				selectedAssets?.length === 1 ? '' : 's'
			} into exchange`,
		},
		{ title: 'Your assets are being finalized and added' },
	];

	const debouncedReload = debounce(() => {
		window.location.reload();
	}, 20000);

	useEffect(() => {
		if (isProcessing) {
			const interval = setInterval(() => {
				setLoadingStep((prevStep) => {
					if (prevStep < loadingMessages?.length - 1) {
						return prevStep + 1;
					}
					return prevStep;
				});
			}, 20000);

			return () => {
				clearInterval(interval);
				debouncedReload.cancel();
			};
		}
	}, [isProcessing, loadingMessages.length, debouncedReload]);

	useEffect(() => {
		if (isProcessing && loadingStep === loadingMessages?.length - 1) {
			debouncedReload();
		}
	}, [isProcessing, loadingStep, loadingMessages.length, debouncedReload]);

	const handleCreateNew = () => {
		handleScreenChange('step3');
		handleResetAsset();
	};
	const coinKeys = exchangeCoins?.map((data) => data?.symbol) || [];

	const handleAssetSelect = (coin, checked) => {
		checked
			? setSelectedAssets((prev) => [...prev, coin])
			: setSelectedAssets((prev) =>
					prev?.filter((asset) => asset?.symbol !== coin?.symbol)
			  );
	};

	const saveSelectedAssets = async (coinData) => {
		if (!coinData?.length || coinData?.some((data) => !data?.symbol)) return;
		const coinFullNames = coinData?.map((data) => data?.symbol) || [];
		try {
			let formProps = {
				id: exchangeData?.id,
				coins: [...exchangeData?.coins, ...coinFullNames],
			};
			await updateExchange(formProps);
		} catch (error) {
			if (error && error?.data) {
				message.error(error?.data?.message);
			}
			setIsProcessing(false);
			handleModalClose(true);
		}
	};

	const handleSelectAll = (checked) => {
		const availableCoins =
			coins?.filter(
				(coin) => !coinKeys?.includes(coin?.symbol) && coin?.verified
			) || [];
		checked ? setSelectedAssets(availableCoins) : setSelectedAssets([]);
	};

	const handleAddSelectedAssets = async () => {
		if (!selectedAssets?.length) {
			return;
		}
		handleModalClose(false);
		setLoadingStep(0);
		setIsProcessing(true);
		saveSelectedAssets(selectedAssets);
	};

	const availableCoins = coins?.filter(
		(coin) => !coinKeys?.includes(coin?.symbol) && coin?.verified
	);
	const isAllSelected =
		availableCoins?.length > 0 &&
		selectedAssets?.length === availableCoins?.length;

	if (isProcessing) {
		const currentMessage =
			loadingMessages[loadingStep] || loadingMessages[0] || {};

		return (
			<div className="asset-loader mt-5">
				<div className="asset-loader-spinner-container">
					<div className="asset-loader-spinner">
						{[...Array(8)]?.map((_, i) => (
							<div key={i} className="asset-loader-dot" />
						))}
					</div>
					<div className="asset-loader-dollar">$</div>
				</div>

				<div className="asset-loader-text">
					<div className="asset-loader-title">{currentMessage?.title}</div>
					<div className="asset-loader-subtitle">Please wait...</div>
				</div>
			</div>
		);
	}

	return (
		<Fragment>
			<div className="first-title">
				{activeTab === '0' ? 'HollaEx assets' : 'Assets'}
			</div>
			<div className="title">Select an asset</div>
			<Input
				placeholder={'Search name or paste token contract address'}
				onChange={handleSearch}
			/>
			<div className="sub-title asset-header mt-4">
				<span>Asset:</span>
				<span
					className="select-all-link"
					onClick={() => handleSelectAll(!isAllSelected)}
				>
					SELECT ALL
				</span>
			</div>
			<div className="coin-option-wrapper">
				{availableCoins?.map((coin, index) => {
					const isSelected = selectedAssets?.some(
						(asset) => asset?.symbol === coin?.symbol
					);
					return (
						<div
							key={index}
							className="coin-option coin-option-multi"
							onClick={() => handleAssetSelect(coin, !isSelected)}
							style={{ cursor: 'pointer' }}
						>
							<div className="coin-option-content">
								<img
									src={
										coin && coin?.logo
											? coin?.logo
											: STATIC_ICONS.COIN_ICONS[
													(coin?.symbol || '').toLowerCase()
											  ]
											? STATIC_ICONS.COIN_ICONS[
													(coin?.symbol || '').toLowerCase()
											  ]
											: STATIC_ICONS.MISSING_ICON
									}
									alt="coins"
									className="coin-icon"
								/>
								<span>
									{`${coin?.fullname} (${coin?.symbol})`}
									{`${coin?.issuer ? ' - ' + coin?.issuer : ''}`}
								</span>
							</div>
							<Checkbox
								checked={isSelected}
								onChange={(e) => {
									e.stopPropagation();
									handleAssetSelect(coin, e.target?.checked);
								}}
								onClick={(e) => e.stopPropagation()}
							/>
						</div>
					);
				})}
			</div>
			<div className="selected-count">
				Selected Assets: {selectedAssets ? selectedAssets?.length : 0}
			</div>
			<div className="create-new-link">
				<div className="button-container">
					<Button className="btn-content back-button" onClick={onClose}>
						Back
					</Button>
					<Button
						type="primary"
						className="add-selected-button mt-2"
						onClick={handleAddSelectedAssets}
						disabled={selectedAssets?.length === 0 || isProcessing}
						loading={isProcessing}
					>
						Add Selected Assets
					</Button>
				</div>
				<div className="create-new-text">Can't find what your looking for?</div>
				<span className="anchor create-new-link" onClick={handleCreateNew}>
					Create a brand new asset
				</span>
			</div>
		</Fragment>
	);
};

export default Step2;
