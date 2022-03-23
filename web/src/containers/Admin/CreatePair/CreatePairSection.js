import React, { useState } from 'react';
import { Link } from 'react-router';
import { Select, Button } from 'antd';
import { STATIC_ICONS } from 'config/icons';

const { Option } = Select;

const getCoinSource = (coin, symbol) => {
	if (coin && coin.logo) {
		return coin.logo;
	} else if (STATIC_ICONS.COIN_ICONS[(symbol || '').toLowerCase()]) {
		return STATIC_ICONS.COIN_ICONS[(symbol || '').toLowerCase()];
	} else {
		return STATIC_ICONS.MISSING_ICON;
	}
};

const CreatePairSection = ({
	coins = [],
	allPairs = [],
	coinSecondary = [],
	formData = {},
	isExchangeWizard = false,
	activeTab,
	setPresetPair,
	handleChange,
	moveToStep,
	pairs,
	handleExistPair
}) => {
	const [isExistError, setExistError] = useState('');
	const checkExist = () => {
		const existFromPair = allPairs.filter(
			(pair) => pair.name === `${formData.pair_base}-${formData.pair_2}`
		);
		const existExchangePair = pairs.includes(`${formData.pair_base}-${formData.pair_2}`);
		if (!formData.pair_2) {
			setExistError("Can't create a market without adding a second asset.");
		} else if (existExchangePair) {
			setExistError('The market has already been added');
		} else if (existFromPair.length && !existExchangePair) {
			handleExistPair(true);
			moveToStep('preview');
		} else {
			setExistError('');
			handleChange(`${formData.pair_base}-${formData.pair_2}`, 'name');
			moveToStep('step2');
		}
	};

	const handleBack = () => {
		moveToStep('step1');
		setPresetPair(activeTab);
	};

	return (
		<div className="add-pair-wrapper">
			<div className="title">Add Market</div>
			<div className="coin-container">
				<div className="pair-wrapper">
					<div className="flex-container">
						<div className="sub-title">Base Asset</div>
						<div>What will be traded</div>
						<div className="flex-container full-width">
							<Select
								onChange={(value) => {
									setExistError('');
									handleChange(value, 'pair_base');
								}}
								value={formData.pair_base}
							>
								{coins.map((data, index) => {
									let symbol = typeof data === 'string' ? data : data.symbol;
									let fullname =
										typeof data === 'string' ? data : data.fullname;
									return (
										<Option key={index} value={symbol}>
											<img
												src={getCoinSource(data, symbol)}
												alt="coins"
												className="coin-icon"
											/>
											{`${fullname} (${(symbol || '').toUpperCase()})`}
										</Option>
									);
								})}
							</Select>
						</div>
					</div>
					<div className="vs-content">vs</div>
					<div className="flex-container">
						<div className="sub-title">Priced</div>
						<div>What it will be priced in</div>
						<div className="flex-container full-width">
							<Select
								onChange={(value) => {
									setExistError('');
									handleChange(value, 'pair_2');
								}}
								value={formData.pair_2}
							>
								{coinSecondary.map((data, index) => {
									let symbol = typeof data === 'string' ? data : data.symbol;
									let fullname =
										typeof data === 'string' ? data : data.fullname;
									return (
										<Option key={index} value={symbol}>
											<img
												src={getCoinSource(data, symbol)}
												alt="coins"
												className="coin-icon"
											/>
											{`${fullname} (${(symbol || '').toUpperCase()})`}
										</Option>
									);
								})}
							</Select>
						</div>
					</div>
				</div>
				{isExistError ? (
					<div className="pair-field-error">{isExistError}</div>
				) : null}
				{!isExchangeWizard ? (
					<div className="footer-info">
						Can't find your asset? Create/add one{' '}
						<Link to="/admin/financials?tab=1&isAsset=true">here.</Link>
					</div>
				) : null}
			</div>
			<div className="btn-wrapper">
				<Button className="green-btn" type="primary" onClick={handleBack}>
					Back
				</Button>
				<div className="separator"></div>
				<Button
					className="green-btn"
					type="primary"
					onClick={checkExist}
					disabled={!formData.pair_base}
				>
					Next
				</Button>
			</div>
		</div>
	);
};

export default CreatePairSection;
