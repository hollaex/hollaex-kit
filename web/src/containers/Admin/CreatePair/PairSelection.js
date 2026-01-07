import React, { useEffect, useState } from 'react';
import { Button, Input, Checkbox, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import debounce from 'lodash.debounce';

import Coins from '../Coins';
import { updateExchange } from '../AdminFinancials/action';

const PairSelection = ({
	coins = [],
	pairsRemaining = [],
	handleSearch,
	moveToStep,
	activeTab,
	handleSelectType,
	exchange = {},
	pairs = [],
	handleModalClose = () => {},
}) => {
	const [checkedPairs, setCheckedPairs] = useState([]);
	const [isProcessing, setIsProcessing] = useState(false);
	const [loadingStep, setLoadingStep] = useState(0);

	const loadingMessages = [
		{ title: `Looking for Market${checkedPairs?.length === 1 ? '' : 's'}` },
		{
			title: `Inserting Market${
				checkedPairs?.length === 1 ? '' : 's'
			} into exchange`,
		},
		{
			title: `Your Market${
				checkedPairs?.length === 1 ? '' : 's'
			} are being finalized and added`,
		},
	];

	const getCoinData = (pair) => {
		return (
			coins.filter((coin) => {
				if (typeof coin === 'string') {
					return coin === pair;
				}
				return coin.symbol === pair;
			})[0] || {}
		);
	};

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isProcessing, loadingMessages?.length, debouncedReload]);

	useEffect(() => {
		if (isProcessing && loadingStep === loadingMessages?.length - 1) {
			debouncedReload();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isProcessing, loadingStep, loadingMessages?.length, debouncedReload]);

	const handleBack = () => {
		moveToStep('pair-init-selection');
		handleSelectType();
	};

	const handleTogglePair = (pairKey) => {
		setCheckedPairs((prev) =>
			prev.includes(pairKey)
				? prev.filter((key) => key !== pairKey)
				: [...prev, pairKey]
		);
	};

	const handleSelectAll = () => {
		if (checkedPairs?.length === pairsRemaining?.length) {
			setCheckedPairs([]);
		} else {
			setCheckedPairs(
				pairsRemaining?.map((pair) => `${pair?.pair_base}-${pair?.pair_2}`)
			);
		}
	};

	const handleConfirmSelect = async () => {
		try {
			if (exchange?.id && exchange?.coins) {
				const formData = {
					pairs: [...pairs, ...checkedPairs],
					exchange: exchange?.id || '',
					coins: exchange?.coins || [],
				};
				handleModalClose(false);
				await updateExchange(formData);
				setLoadingStep(0);
				setIsProcessing(true);
			}
		} catch (error) {
			message.error(error?.data?.message || error?.data);
			setIsProcessing(false);
			handleModalClose(true);
		}
	};

	if (isProcessing) {
		const currentMessage =
			loadingMessages?.[loadingStep] || loadingMessages?.[0] || {};

		return (
			<div className="market-add-container">
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
			</div>
		);
	}
	return (
		<div className="market-add-container">
			<div className="first-title">
				{activeTab === '0' ? 'HollaEx markets' : 'Other markets'}
			</div>
			<div className="title">Select a market</div>
			<div>
				Markets are based on assets selected in the previous step. To see more
				markets go back and add more assets.
			</div>
			<Input placeholder={'Search market'} onChange={handleSearch} />
			<div className="d-flex justify-content-between align-items-center w-100 mt-3">
				<span>Markets:</span>
				<div className="d-flex align-items-center">
					<div
						className="d-inline mr-1 text-decoration-underline pointer"
						onClick={handleSelectAll}
					>
						SELECT ALL
					</div>
				</div>
			</div>
			<div className="coin-option-wrapper">
				{pairsRemaining?.map((pair, index) => {
					let pairBase = getCoinData(pair.pair_base);
					let pair2 = getCoinData(pair.pair_2);
					const pairKey = `${pair?.pair_base}-${pair?.pair_2}`;
					return (
						<div
							key={index}
							className="coin-option pointer"
							onClick={() => handleTogglePair(pairKey)}
						>
							<div className="d-flex align-items-center">
								<div className="d-flex align-items-center f-1">
									<Coins type={pairBase.symbol} small={true} />
									<span className="coin-full-name">{pairBase.fullname}</span>
								</div>
								<CloseOutlined
									style={{ fontSize: '24px', margin: '0px 15px' }}
								/>
								<div className="d-flex align-items-center f-1">
									<Coins type={pair2.symbol} small={true} />
									<span className="coin-full-name">{pair2.fullname}</span>
								</div>
								<div>{pair.issuer ? ` - ${pair.issuer}` : ''}</div>
								<Checkbox
									checked={checkedPairs?.includes(pairKey)}
									onChange={() => handleTogglePair(pairKey)}
									onClick={(e) => e.stopPropagation()}
								/>
							</div>
						</div>
					);
				})}
			</div>
			<div className="footer">
				<div>Can't find what your looking for?</div>
				<div className="anchor" onClick={handleBack}>
					Create a new market
				</div>
			</div>
			<div className="button-container mt-2">
				<Button
					className="btn-content back-button"
					type="primary"
					onClick={() => moveToStep('step1')}
				>
					Back
				</Button>
				<div className="separator"></div>
				<Button
					type="primary"
					className="add-selected-button"
					onClick={handleConfirmSelect}
					disabled={!checkedPairs?.length}
				>
					{`Add Selected Market${checkedPairs?.length > 1 ? 's' : ''}`}
				</Button>
			</div>
		</div>
	);
};

export default PairSelection;
