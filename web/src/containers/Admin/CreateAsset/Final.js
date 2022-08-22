import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import { STATIC_ICONS } from 'config/icons';
import Coins from '../Coins';
import IconToolTip from '../IconToolTip';
import { getNetworkLabelByKey } from 'utils/wallet';
import { formatPercentage } from 'utils/currency';
import { Link } from 'react-router';
import { getTabParams } from '../AdminFinancials/Assets';

const Final = ({
	isPreview = false,
	isConfigure = false,
	coinFormData = {},
	handleBack,
	handleConfirmation,
	handleEdit = () => {},
	handleFileChange = () => {},
	setConfigEdit,
	handleDelete = () => {},
	user_id,
	submitting = false,
	handleWithdrawalEdit,
	handleScreenChange,
	isPresentCoin,
	coins,
	selectedCoinSymbol,
	exchange = {},
	constants = {},
	allCoins = {},
}) => {
	const { meta = {}, type } = coinFormData;
	let coinData = {};
	allCoins.forEach((item) => {
		if (item.symbol === coinFormData.symbol) {
			coinData = {
				...coinData,
				...item,
			};
		}
	});
	const { withdrawal_fees = {}, deposit_fees = {} } = coinData;
	const { onramp = {} } = constants;
	const [isUpgrade, setIsUpgrade] = useState(false);
	const tabParams = getTabParams();

	useEffect(() => {
		if (exchange?.plan === 'fiat' || exchange?.plan === 'boost') {
			setIsUpgrade(true);
		}
	}, [exchange]);

	const getSymbolBasedFields = (type) => {
		switch (type) {
			case 'percentage':
				return ['min', 'max'];
			case 'static':
			default:
				return ['value', 'levels'];
		}
	};

	const renderNetworkFee = ([key, data], index) => {
		const { symbol: assetSymbol } = coinFormData;
		const { symbol, type } = data;
		const network = getNetworkLabelByKey(key);
		const symbolBasedFields = getSymbolBasedFields(type);
		const unit = type === 'percentage' ? assetSymbol : symbol;
		const keyArr = withdrawal_fees && Object.keys(withdrawal_fees).length;

		return (
			<div key={key} className="pb-3">
				{network ? (
					<div>
						<b className="caps-first">network</b>: {network}
					</div>
				) : null}
				<Fragment>
					{data &&
						Object.entries(data).map(([key, value]) => {
							const hasUnit = symbolBasedFields.includes(key);

							if (key && key === 'levels') {
								return (
									<div key={key} className="d-flex align-start">
										<div>
											<b className="caps-first">{key}</b>:
										</div>
										<div className="pl-1">
											{value &&
												Object.entries(value).map(([level, fee]) => {
													if (level && fee) {
														const feeText = hasUnit
															? `${fee} ${unit}`
															: formatPercentage(fee);
														return (
															<div
																key={fee}
															>{`Tier ${level} @ ${feeText}`}</div>
														);
													} else {
														return null;
													}
												})}
										</div>
									</div>
								);
							} else {
								const valueText = hasUnit ? `${value} ${unit}` : value;

								return (
									<div key={key}>
										<b className="caps-first">{key}</b>: {valueText}
									</div>
								);
							}
						})}
					{keyArr > 1 && index === 0 ? (
						<div className="border-separator"></div>
					) : null}
				</Fragment>
			</div>
		);
	};

	const renderFees = (fees) => {
		return Object.entries(fees).map(renderNetworkFee);
	};

	const handleMoveBack = () => {
		const isExchangeCoin = !!coins.filter(
			(item) => item.symbol === selectedCoinSymbol
		).length;
		if (coinFormData.id && isPresentCoin) {
			handleScreenChange('step1');
		} else if (!coinFormData.id || isExchangeCoin) {
			handleBack(true);
		} else {
			handleScreenChange('edit_withdrawal_fees');
		}
	};

	const isOwner = coinFormData.owner_id === user_id;

	return (
		<Fragment>
			<div className="title">
				{isPreview || isConfigure
					? `Manage ${coinFormData.symbol}`
					: 'Create or add a new coin'}
			</div>
			{!isPreview && !isConfigure ? (
				type === 'fiat' ? (
					<div className="grey-warning">
						<div className="icon-wrapper">
							<img
								className="fiat-icon"
								src={STATIC_ICONS.CURRENCY_SYMBOL}
								alt="new_coin"
							/>
						</div>
						<div>
							<p>
								Since fiat currencies aren't on the blockchain they are the full
								responsibility of the exchange operator to managed for solvency.
							</p>
							<p>
								In order to facilitate FIAT deposits and withdrawals a banking
								or payment system must be connected to your exchange.
							</p>
						</div>
					</div>
				) : (
					<div className="grey-warning">
						<div className="warning-text">!</div>
						<div>
							<div className="sub-title">
								Please check the details carefully.
							</div>
							<div>
								To avoid delays it is important to take the time to review the
								accuracy of the details below
							</div>
						</div>
					</div>
				)
			) : null}
			<div className="preview-coin-container">
				<div className="preview-content preview-content-align">
					{!isPreview && !isConfigure ? (
						<span className="preview-color-tip sub-title">
							Color
							<span className="line"></span>
						</span>
					) : null}
					<Coins
						nohover
						large
						small
						fullname={coinFormData.fullname}
						type={(coinFormData.symbol || '').toLowerCase()}
						color={meta.color}
					/>
					{isConfigure ? (
						<Fragment>
							<div className="edit-content">
								<b>Color: </b>
								{meta.color}
							</div>
							<Button
								className="green-btn"
								type="primary"
								onClick={() => setConfigEdit('edit-color')}
							>
								Edit
							</Button>
							<div className="description-small">
								This will be viewed on your wallet and transaction history page
							</div>
						</Fragment>
					) : null}
					{!isPreview && !isConfigure ? (
						<Fragment>
							<span className="preview-symbol-tip sub-title">
								<span className="line"></span>
								Symbol
							</span>
							<span className="preview-name-tip sub-title">
								<span className="line"></span>
								Name
							</span>
						</Fragment>
					) : null}
				</div>
				<div className="preview-content">
					{isConfigure ? (
						<Fragment>
							{coinFormData.logo ? (
								<img
									src={coinFormData.logo}
									alt="coins"
									className="icon-preview"
								/>
							) : (
								<div className="icon-upload">
									<div className="file-container">
										<label>
											<UploadOutlined
												style={{ fontSize: '94px', color: '#808080' }}
											/>
											<input
												type="file"
												onChange={(e) => handleFileChange(e, 'logo')}
												name="logo"
											/>
										</label>
									</div>
								</div>
							)}
						</Fragment>
					) : (
						<img
							src={
								coinFormData.logo
									? coinFormData.logo
									: STATIC_ICONS.COIN_ICONS[
											(coinFormData.symbol || '').toLowerCase()
									  ]
									? STATIC_ICONS.COIN_ICONS[
											(coinFormData.symbol || '').toLowerCase()
									  ]
									: STATIC_ICONS.MISSING_ICON
							}
							alt="coins"
							className="icon-preview"
						/>
					)}
					{isConfigure ? (
						<Fragment>
							<div className="edit-content">
								<b>Icon: </b>
								{coinFormData.iconName}
							</div>
							<div className="icon-upload">
								<div className="file-container">
									<label>
										<div className="upload-box">Upload</div>
										<input
											type="file"
											onChange={(e) => handleFileChange(e, 'logo')}
											name="logo"
										/>
									</label>
								</div>
							</div>
							<div className="description-small">
								Icon will be used in various trading related pages
							</div>
						</Fragment>
					) : null}
					{!isPreview && !isConfigure ? (
						<span className="preview-icon-tip sub-title">
							<span className="line"></span>
							Icon
						</span>
					) : null}
				</div>
			</div>
			<div className="preview-detail-container">
				<div className="title">Asset info</div>
				<div>
					<b>Name:</b> {coinFormData.fullname}
				</div>
				<div>
					<b>Symbol:</b> {(coinFormData.symbol || '').toUpperCase()}
				</div>
				<div className="type-wrap">
					<div className="warning-container">
						<b>Type: </b>
						<span className="ml-2">{coinFormData.type}</span>
						{isPreview &&
						!coinFormData.verified &&
						coinFormData.created_by === user_id ? (
							<IconToolTip
								type="warning"
								tip="This asset is in pending verification"
								onClick={() => handleEdit(coinFormData)}
							/>
						) : null}
					</div>
				</div>
				{coinFormData.network ? (
					<div>
						<b>Network:</b> {coinFormData.network}
					</div>
				) : null}
				{coinFormData.standard ? (
					<div>
						<b>Standard:</b> {coinFormData.standard}
					</div>
				) : null}
				{type === 'blockchain' ? (
					<div>
						<b>Contract:</b> {coinFormData.contract}
					</div>
				) : null}
				{!isConfigure ? (
					<div>
						<b>Color:</b> {meta.color}
					</div>
				) : (
					<div className="btn-wrapper">
						<Button
							className="green-btn"
							type="primary"
							onClick={() => setConfigEdit('edit-info')}
						>
							Edit
						</Button>
					</div>
				)}
			</div>
			<div className="preview-detail-container">
				<div className="title">Parameters</div>
				<div>
					<b>Status:</b> {coinFormData.active ? 'Active' : 'Not active'}
				</div>
				<div>
					<b>Price:</b> {coinFormData.estimated_price}
				</div>
				{/* <div>
					<b>Fee for withdrawal:</b> {coinFormData.withdrawal_fee}
				</div> */}
				<div>
					<b>Minimum withdrawal amount:</b> {coinFormData.min}
				</div>
				<div>
					<b>Maximum withdrawal amount:</b> {coinFormData.max}
				</div>
				<div>
					<b>Increment Amount:</b> {coinFormData.increment_unit}
				</div>
				{/* <div>
					<b>Decimal points:</b> {meta.decimal_points}
				</div> */}
				{isConfigure ? (
					<div className="btn-wrapper">
						<Button
							className="green-btn"
							type="primary"
							onClick={() => setConfigEdit('edit-params')}
						>
							Edit
						</Button>
					</div>
				) : null}
			</div>
			<div className="preview-detail-container">
				<div className="title">Withdrawal Fee</div>
				<div>
					{withdrawal_fees ? (
						<div>{renderFees(withdrawal_fees)}</div>
					) : (
						<Fragment>
							<b>{coinFormData.symbol}:</b> {coinFormData.withdrawal_fee}
						</Fragment>
					)}
					{isConfigure && (
						<div className="btn-wrapper">
							<Button
								className="green-btn mb-3"
								type="primary"
								onClick={() => handleWithdrawalEdit('withdraw')}
								disabled={!isOwner}
							>
								Edit
							</Button>
						</div>
					)}
				</div>
				<div className="preview-detail-container pl-0">
					<div className="title">Deposit Fee</div>
					<div>
						{deposit_fees && <div>{renderFees(deposit_fees)}</div>}
						{isConfigure && (
							<div className="btn-wrapper">
								<Button
									className="green-btn"
									type="primary"
									onClick={() => handleWithdrawalEdit('deposit')}
									disabled={!isOwner}
								>
									Edit
								</Button>
							</div>
						)}
					</div>
				</div>
				{(tabParams?.isFiat === 'onRamp' ||
					tabParams?.isFiat === 'offRamp') && (
					<div>
						<div className="preview-detail-container"></div>
						<div className="finalfiatwrapper">
							<div className="title">Fiat ramps</div>
							{!isUpgrade ? (
								<>
									<Link
										className="fiatlink"
										to="/admin/fiat?tab=2&isAssetHome=true"
									>
										View fiat controls
									</Link>
									<div className="d-flex ml-4">
										<div className="d-flex align-items-center justify-content-between upgrade-section my-4">
											<div>
												<div className="font-weight-bold">
													Add fiat deposits & withdrawals
												</div>
												<div>Allow your users to send USD & other fiat</div>
											</div>
											<div className="ml-5 button-wrapper">
												<a
													href="https://dash.bitholla.com/billing"
													target="_blank"
													rel="noopener noreferrer"
												>
													<Button type="primary" className="w-100">
														Upgrade Now
													</Button>
												</a>
											</div>
										</div>
									</div>
								</>
							) : (
								Object.keys(onramp).filter((item) => item === tabParams?.symbol)
									.length && (
									<div className="mb-3">
										{Object.keys(onramp[tabParams?.symbol]).map((val, i) => {
											let name = '';
											if (onramp[tabParams?.symbol]?.[val]?.type === 'manual') {
												name =
													onramp[tabParams?.symbol]?.[val]?.data[0][0].value;
											} else {
												name = onramp[tabParams?.symbol]?.[val]?.data;
											}
											return (
												<div className="d-flex align-items-center mt-3">
													On-ramp {i + 1}: {name}
													<span className="small-circle mr-2 ml-2 d-flex"></span>
													<span>PUBLISHED</span>
												</div>
											);
										})}
										<div className="mt-3">
											<Link
												className="fiatlink"
												to="/admin/fiat?tab=2&isAssetHome=true"
											>
												View fiat controls
											</Link>
										</div>
									</div>
								)
							)}
						</div>
					</div>
				)}
			</div>
			{isPreview || isConfigure ? (
				<div className="preview-detail-container">
					<div className="title">Manage</div>
					<div className="btn-wrapper">
						<Button
							type="danger"
							onClick={() => handleDelete(coinFormData.symbol)}
							disabled={submitting}
						>
							Remove
						</Button>
						<div className="separator"></div>
						<div className="description-small remove">
							Removing this coin will permanently delete this coin from your
							exchange and render any pairs using it inactive. Use with caution!
						</div>
					</div>
				</div>
			) : null}
			{!isPreview && !isConfigure ? (
				<div className="btn-wrapper">
					<Button className="green-btn" type="primary" onClick={handleMoveBack}>
						Back
					</Button>
					<div className="separator"></div>
					<Button
						className="green-btn"
						type="primary"
						onClick={handleConfirmation}
					>
						Confirm
					</Button>
				</div>
			) : null}
		</Fragment>
	);
};

const mapStateToProps = (state) => {
	return {
		exchange: state.asset && state.asset.exchange ? state.asset.exchange : {},
		constants: state.app.constants,
		allCoins: state.asset.allCoins,
	};
};

export default connect(mapStateToProps, null)(Final);
