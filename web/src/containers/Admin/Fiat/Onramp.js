import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { STATIC_ICONS } from 'config/icons';
import { Button, Tooltip, Modal, Select } from 'antd';
import { QuestionCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router';

import Coins from '../Coins';
import PaymentAccountPopup from './PaymentPopup';
import PaymentAccounts from './PaymentAccounts';

import './index.css';

const Onramp = ({
	activeTab,
	handleTabChange,
	allCoins,
	exchange,
	isUpgrade,
	onramp,
	offramp,
	user_payments,
}) => {
	const [coins, setCoins] = useState([]);
	const [type, setType] = useState('');
	const [isVisible, setIsVisible] = useState(false);
	const [formType, setFormType] = useState('');
	const [isPaymentForm, setIsPaymentForm] = useState(false);
	const [coinSymbol, setCoinSymbol] = useState('');
	const [selectOffField, setSelectOffField] = useState([]);
	const [fiatCoins, setFiatCoins] = useState([]);
	const [selectedAsset, setSelectedAsset] = useState('');
	const [showCoins, setShowCoins] = useState(false);
	const [customName, setCustomName] = useState('');
	const [pluginName, setPluginName] = useState('');

	useEffect(() => {
		let coins = allCoins;
		if (activeTab === 'onRamp') {
			coins = coins.filter((item) => Object.keys(onramp).includes(item.symbol));
		} else {
			coins = coins.filter((item) =>
				Object.keys(offramp).includes(item.symbol)
			);
		}
		let selectedAssetData = allCoins;
		if (selectedAsset) {
			selectedAssetData = selectedAssetData.filter(
				(item) => item.symbol === selectedAsset
			);
			coins = [...coins, ...selectedAssetData];
		}
		if (coins.length) {
			setCoins(coins);
		}
	}, [allCoins, onramp, offramp, activeTab, exchange, selectedAsset]);

	useEffect(() => {
		let filteredFiatCoins = [];
		let rampData = activeTab === 'onRamp' ? onramp : offramp;
		if (Object.keys(rampData).length) {
			allCoins &&
				allCoins
					.filter((item) => !Object.keys(rampData).includes(item.symbol))
					.forEach((item) => {
						if (item.type === 'fiat') {
							filteredFiatCoins = [
								...filteredFiatCoins,
								{
									symbol: item?.symbol,
									color: item?.meta?.color,
									fullname: item?.fullname,
								},
							];
						}
					});
		} else {
			allCoins &&
				allCoins.forEach((item) => {
					if (item.type === 'fiat') {
						filteredFiatCoins = [
							...filteredFiatCoins,
							{ ...item, color: item?.meta?.color, fullname: item?.fullname },
						];
					}
				});
			setCoins([filteredFiatCoins[0]]);
		}
		setFiatCoins(filteredFiatCoins);
	}, [allCoins, onramp, offramp, activeTab]);

	useEffect(() => {
		if (Object.keys(onramp).length && !selectedAsset) {
			setIsPaymentForm(true);
		}
		// eslint-disable-next-line
	}, []);

	const handleSelectCoin = (e) => {
		if (e) {
			setSelectedAsset(e);
		}
	};

	const handleRamp = (type, showCoin, coinSymb = coinSymbol, offrampSelect) => {
		setIsVisible(true);
		setType(type);
		setCoinSymbol(coinSymb);
		setSelectOffField(offrampSelect);
		setShowCoins(showCoin);
	};

	const onCancel = () => {
		setIsVisible(false);
		setSelectOffField([]);
	};

	const handleoffRampTab = (e) => {
		setIsVisible(false);
		handleTabChange(e);
	};

	const formUpdate = (val, plugin) => {
		setIsPaymentForm(true);
		setFormType(val);
		setCustomName(plugin);
	};

	const handleOffRampProceed = (type) => {
		setType(type);
	};

	const updatePlugin = (e) => {
		setFormType('plugin');
		setPluginName(e);
	};

	const setCoindata = (coinSymb = coinSymbol) => {
		setCoinSymbol(coinSymb);
	};

	const renderSelect = (type) => {
		return (
			<div className="mt-4 d-flex align-items-center">
				<div className="mr-3">Fiat coins:</div>
				<div className="coinSelect flex-direction-column">
					<Select
						onChange={(e) => handleSelectCoin(e, type)}
						size="small"
						value={
							selectedAsset
								? selectedAsset
								: fiatCoins && fiatCoins[0] && fiatCoins[0].symbol
						}
						className="mb-2"
					>
						{fiatCoins &&
							fiatCoins.map((option, index) => (
								<Select.Option value={option.symbol} key={index}>
									<div className="d-flex align-items-center mt-1 summary-coin">
										<Coins
											type={option?.symbol?.toLowerCase()}
											small={true}
											color={option?.color || ''}
										/>
										<div className="ml-2">{option?.symbol}</div>
									</div>
								</Select.Option>
							))}
					</Select>
				</div>
			</div>
		);
	};

	return (
		<div className="payment-acc-wrapper">
			<Fragment>
				<div className="d-flex justify-content-between">
					<div className="d-flex align-items-center">
						<img
							src={
								activeTab === 'onRamp'
									? STATIC_ICONS.ONRAMP_DOLLAR_ICON
									: STATIC_ICONS.OFFRAMP_DOLLAR_ICON
							}
							alt="pay-icon"
							className="pay-icon"
						/>
						<div>
							<div className="d-flex align-items-center">
								<div className="mr-3 w-50">
									{activeTab === 'onRamp'
										? 'Connect an on-ramp. This can simply be bank deposit details and/or other payment processor details. Below are fiat assets that you can connect deposit details for. Once connected, these details will be displayed to users in their asset wallet deposit page for that specific asset.'
										: 'Add an off-ramp to allow your users a way to withdraw fiat.'}
								</div>
								<Tooltip
									overlayClassName={
										activeTab === 'onRamp'
											? 'admin-general-description-tip general-description-tip-right align-onramp-tooltip'
											: 'admin-general-description-tip general-description-tip-right align-onramp-tooltip off-ramp-adjust'
									}
									title={
										<img
											src={
												activeTab === 'onRamp'
													? STATIC_ICONS.FIAT_ONRAMP_TOOLTIP
													: STATIC_ICONS.FIAT_OFFRAMP_TOOLTIP
											}
											className="description_footer"
											alt="footer"
										/>
									}
									placement="right"
								>
									<QuestionCircleOutlined className="quesIcon" />
								</Tooltip>
							</div>
						</div>
					</div>
					<Button
						type="primary"
						className={!isUpgrade ? 'green-btn disableall' : 'green-btn'}
						// disabled={activeTab === 'offRamp' ? true : false}
						onClick={() =>
							handleRamp(activeTab === 'onRamp' ? 'onramp' : 'offramp', true)
						}
					>
						{activeTab === 'onRamp' ? 'Add on-ramp' : 'Add off-ramp'}
					</Button>
				</div>
				<div className="border-divider"></div>
				{!isUpgrade ? (
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
				) : null}
				<div className={!isUpgrade ? 'disableall' : ''}>
					{!Object.keys(user_payments).length ? (
						<div className="paymentbox">
							<InfoCircleOutlined
								style={{ fontSize: '35px' }}
								className="mr-3 ml-4"
							/>
							<div className="paymentContent">
								We've noticed that there hasn't been any Payment Accounts added
								yet. To start it is recommended to{' '}
								<span
									onClick={() => handleTabChange('1')}
									className="underline"
								>
									add a Payment Account
								</span>
								.
							</div>
						</div>
					) : null}
					{(activeTab === 'onRamp' && !Object.keys(onramp).length) ||
					(activeTab === 'offRamp' && !Object.keys(offramp).length)
						? renderSelect('deposit')
						: null}
					{coins.map((item, index) => {
						return (
							<div key={index}>
								<div className="paymentbox2">
									<div className="mr-4 ml-4">
										<Coins
											type={item?.symbol.toLowerCase()}
											color={item?.meta ? item?.meta.color : ''}
											fullname={item?.fullname}
											nohover
											large
											small
										/>
									</div>
									<div className="d-flex flex-column ml-5 mr-5">
										<span>
											<b>Name</b>: {item?.fullname}
										</span>
										<span>
											<b>Symbol</b>: {item?.symbol}
										</span>
										<span>
											<b>Type</b>: {item?.type}
										</span>
										<span>
											<b>Status</b>: {item?.verified ? 'Active' : 'In active'}
										</span>
										<Link
											to={`/admin/financials?tab=0&preview=true&symbol=${item?.symbol}&isFiat=${activeTab}`}
											className="underline assetclick"
										>
											Manage asset
										</Link>
									</div>
									{activeTab === 'onRamp' ? (
										<Button
											type="primary"
											className="green-btn ml-5"
											onClick={() => handleRamp('onramp', false, item?.symbol)}
										>
											Add on-ramp
										</Button>
									) : (
										<Button
											type="primary"
											className="green-btn ml-5"
											// disabled={true}
											onClick={() =>
												handleRamp(
													'offramp',
													false,
													item?.symbol,
													offramp[item?.symbol]
												)
											}
										>
											Add off-ramp
										</Button>
									)}
								</div>
								{/* {(isPaymentForm && activeTab === 'onRamp') || item?.symbol === coinSymbol ? ( */}
								{isPaymentForm ? (
									<PaymentAccounts
										formType={formType}
										isDisplayFormData={true}
										onramp={onramp[item?.symbol]}
										currentActiveTab={activeTab}
										coinSymbol={coinSymbol ? coinSymbol : item?.symbol}
										onRampCoins={!isPaymentForm ? Object.keys(onramp) : []}
										customName={customName}
										user_payments={activeTab === 'offRamp' ? user_payments : {}}
										isUpgrade={isUpgrade}
										originalonramp={onramp}
										offramp={offramp[item?.symbol]}
										pluginName={pluginName}
										currentsymbol={item?.symbol}
										isPaymentForm={formType === 'plugin' && customName}
										setCoindata={setCoindata}
									/>
								) : null}
								<div className="border-divider"></div>
							</div>
						);
					})}
				</div>
			</Fragment>
			<Modal visible={isVisible} footer={null} width={500} onCancel={onCancel}>
				<PaymentAccountPopup
					handleClosePlugin={onCancel}
					handleTabChange={handleoffRampTab}
					type={type}
					tabUpdate={handleRamp}
					formUpdate={formUpdate}
					selectOffField={selectOffField}
					coins={coins}
					coinSymbol={coinSymbol}
					activeTab={activeTab}
					fiatCoins={fiatCoins}
					selectedAsset={selectedAsset}
					showCoins={showCoins}
					handleSelectCoin={handleSelectCoin}
					user_payments={
						activeTab === 'onRamp' ? onramp[coinSymbol] : user_payments
					}
					currentActiveTab={activeTab}
					handleOffRampProceed={handleOffRampProceed}
					updatePlugin={updatePlugin}
					handleSaveAndPublish={onCancel}
					setCoindata={setCoindata}
				/>
			</Modal>
		</div>
	);
};

const mapStateToProps = (state) => ({
	allCoins: state.asset.allCoins,
	exchange: state.asset && state.asset.exchange,
});

export default connect(mapStateToProps)(Onramp);
