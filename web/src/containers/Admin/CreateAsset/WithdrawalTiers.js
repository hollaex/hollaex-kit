import React, { useState, useEffect } from 'react';
import { Button, InputNumber } from 'antd';
import { Image } from 'components';
import withConfig from 'components/ConfigProvider/withConfig';
import { STATIC_ICONS } from 'config/icons';

const WithDrawTiers = ({
	userTiers,
	icons: ICONS,
	handleScreenChange,
	handleNext,
	withdrawalFees,
	selectedTier,
	handleTierValues,
	tierValues,
	keyType,
	assetType,
}) => {
	const [confirmPopup, setConfirmPopup] = useState(false);
	const [withDrawTiers, setWithdrawTiers] = useState({});
	useEffect(() => {
		handleTierValues(false, withdrawalFees[selectedTier]?.levels, selectedTier);
		setWithdrawTiers(withdrawalFees[selectedTier]?.levels, selectedTier);
		// eslint-disable-next-line
	}, []);

	const handleTier = (level, e) => {
		if (level && e) {
			setWithdrawTiers({ ...tierValues, [level]: e }, selectedTier);
			handleTierValues(false, { ...tierValues, [level]: e }, selectedTier);
		} else if (level) {
			let temp = tierValues;
			delete temp[level];
			setWithdrawTiers({ ...temp }, selectedTier);
			handleTierValues(false, { ...temp }, selectedTier);
		}
	};
	const handleConfirm = (val) => {
		if (val === 'confirm') {
			setConfirmPopup(true);
		} else {
			setConfirmPopup(false);
		}
	};
	return (
		<div>
			{!confirmPopup ? (
				<div className="tieredWrapper">
					<div className="title mb-3">
						Tiered {assetType === 'deposit' ? 'deposit' : 'withdraw'} fees
					</div>
					<div className="mb-3">
						Set specific user account tier{' '}
						{assetType === 'deposit' ? 'deposit' : 'withdrawal'} fees.
					</div>
					<div className="mb-3">
						Note, setting the specific values is option and that leaving them
						empty will result in using the default value set in previously.
					</div>
					<div className="mb-3">
						Any values set below will override the default.
					</div>
					<div className="mb-4">
						<div
							className={`${
								keyType === 'static' ? 'headStaticTier' : 'headPercentageTier'
							}`}
						>
							<div className="d-flex">
								<Image
									icon={
										assetType === 'deposit'
											? STATIC_ICONS['DEPOSIT_TIERS_SECTION']
											: STATIC_ICONS['WITHDRAW_TIERS_SECTION']
									}
									wrapperClassName="mr-2 tiers-icon"
								/>
								<div className="withdrawhead">
									{assetType === 'deposit' ? 'Deposit' : 'Withdraw'}{' '}
									{`${
										keyType === 'static' ? `static ${selectedTier} ` : '%'
									} fee`}
								</div>
							</div>
						</div>
						{Object.keys(userTiers).length &&
							Object.keys(userTiers).map((level, index) => {
								let init = tierValues;
								let initValue = '';
								init &&
									Object.keys(init).filter((item) => {
										if (item === level) {
											return (initValue = init[level]);
										} else {
											return null;
										}
									});
								return (
									<div className="d-flex py-2" key={index}>
										<div className="f-1">
											<div className="d-flex align-items-center">
												<Image
													icon={ICONS[`LEVEL_ACCOUNT_ICON_${level}`]}
													wrapperClassName="table-tier-icon mr-2"
												/>
												{`Tiers ${level}`}
											</div>
										</div>
										<div className="f-1 px-2 ">
											<InputNumber
												formatter={(value) => {
													if (value && keyType === 'percentage') {
														return `${value}%`;
													}
													return value;
												}}
												parser={(value) => value.replace('%', '')}
												onChange={(value) => handleTier(level, value)}
												value={initValue ? initValue : ''}
												className="tieredInput"
												min={0}
											/>
										</div>
									</div>
								);
							})}
					</div>
					<div className="d-flex my-4">
						<Button
							type="primary"
							className="green-btn"
							onClick={() => handleScreenChange('edit_withdrawal_fees')}
						>
							Back
						</Button>
						<div className="mx-2"></div>
						<Button
							type="primary"
							className="green-btn"
							onClick={() => handleConfirm('confirm')}
							disabled={!tierValues || !Object.keys(tierValues).length}
						>
							Confirm
						</Button>
					</div>
				</div>
			) : (
				<div className="checkToConfirmDeposit">
					<div className="title mb-3">Check and confirm</div>
					<div>
						For the below user tier levels the default{' '}
						{assetType === 'deposit' ? 'deposit' : 'withdrawal'} fee value will
						be overridden.
					</div>
					<div>
						Are you sure you want to make an exception to the default{' '}
						{assetType === 'deposit' ? 'deposit' : 'withdrawal'}
						fee rule?
					</div>
					<span
						className={`${
							keyType === 'static' ? 'd-flex legend' : 'd-flex legend2'
						}`}
					>
						<Image
							icon={
								assetType === 'deposit'
									? STATIC_ICONS['DEPOSIT_TIERS_SECTION']
									: STATIC_ICONS['WITHDRAW_TIERS_SECTION']
							}
							wrapperClassName="tiers-icon"
						/>
						<div>
							{assetType === 'deposit' ? 'Deposit' : 'Withdraw'}{' '}
							{`${keyType === 'static' ? `static ${selectedTier} ` : '%'} fee`}
						</div>
					</span>
					<div className="confirmTiers">
						{Object.keys(tierValues).map((level, index) => {
							return (
								<div key={index} className="d-flex mb-2">
									<div className="d-flex align-items-center">
										<Image
											icon={ICONS[`LEVEL_ACCOUNT_ICON_${level}`]}
											wrapperClassName="table-tier-icon mr-2"
										/>
										{`Tiers ${level}`}
									</div>
									<div className="centerBorder"></div>
									<div>
										<span className="bold">{`${
											keyType === 'static' ? 'Static value:' : 'Percent value:'
										} ${tierValues[level]}${
											keyType === 'static' ? ` ${selectedTier} ` : ` %`
										} `}</span>{' '}
									</div>
								</div>
							);
						})}
					</div>
					<div className="btn-wrapper">
						<Button
							type="primary"
							className="green-btn"
							onClick={() => handleConfirm('back')}
						>
							Back
						</Button>
						<div className="separator"></div>
						<Button
							type="primary"
							className="green-btn"
							onClick={() => {
								handleTierValues(true, withDrawTiers, selectedTier);
								handleNext(selectedTier, tierValues);
							}}
						>
							Confirm
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};
export default withConfig(WithDrawTiers);
