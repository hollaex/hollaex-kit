import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { STATIC_ICONS } from 'config/icons';
import { Button, Tooltip, Modal, Select, Spin } from 'antd';
import { QuestionCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router';

import Coins from '../Coins';
import PaymentAccountPopup from './PaymentPopup';
import RampPaymentAccounts from './RampPaymentAccounts';

import './index.css';

const Onramp = ({
	activeTab,
	allCoins,
	exchange,
	isUpgrade,
	onramp,
	user_payments,
	getUpdatedKitData = () => {},
	isLoading = false,
	setIsLoading = () => {},
}) => {
	const [coins, setCoins] = useState([]);
	const [type, setType] = useState('');
	const [isVisible, setIsVisible] = useState(false);
	const [formType, setFormType] = useState('');
	const [isPaymentForm, setIsPaymentForm] = useState(false);
	const [coinSymbol, setCoinSymbol] = useState('');
	const [fiatCoins, setFiatCoins] = useState([]);
	const [selectedAsset, setSelectedAsset] = useState('');
	const [showCoins, setShowCoins] = useState(false);
	const [customName, setCustomName] = useState('');
	const [pluginName, setPluginName] = useState('');
	const [selectedCoin, setSelectedCoin] = useState({});
	const [showSelect, setShowSelect] = useState(false);
	const [selectedPayType, setSelectedPayType] = useState({});
	const [selectedPaymentType, setSelectedPaymentType] = useState('');
	const [isPayChanged, setIsPayChanged] = useState(false);
	const [currentType, setCurrentType] = useState('');
	const [isProceed, setIsProceed] = useState(false);
	const [isDisable, setIsDisable] = useState(false);
	const [onrampIndex, setOnrampIndex] = useState(1);

	useEffect(() => {
		let coins =
			allCoins &&
			allCoins.filter(
				(val) =>
					exchange && exchange.coins && exchange.coins.includes(val.symbol)
			);
		let selectedAssetData = allCoins;
		if (exchange && exchange.coins) {
			coins = coins.filter((item) => Object.keys(onramp).includes(item.symbol));
		}
		if (!coins.length) {
			setCoins(fiatCoins && fiatCoins.length ? [fiatCoins?.[0]] : []);
		} else if (selectedAsset) {
			selectedAssetData = selectedAssetData.filter(
				(item) => item.symbol === selectedAsset
			);
			coins = [...coins, ...selectedAssetData];
			setCoins(coins);
			let value = {};
			selectedAssetData.forEach((d) => {
				if (d.symbol === selectedAsset) {
					value = {
						symbol: d?.symbol,
						color: d?.meta?.color,
						fullname: d?.fullname,
					};
				}
			});
			setSelectedCoin(value);
		} else if (coins.length) {
			setCoins(coins);
		}
	}, [allCoins, onramp, exchange, selectedAsset, fiatCoins]);

	useEffect(() => {
		let filteredFiatCoins = [];
		const FiatCoinData = allCoins.filter((item) =>
			exchange?.coins.includes(item?.symbol)
		);
		FiatCoinData &&
			FiatCoinData.forEach((item) => {
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
		setFiatCoins(filteredFiatCoins);
		setSelectedCoin(filteredFiatCoins?.[0]);
		setCoinSymbol(filteredFiatCoins?.[0]?.symbol);
	}, [allCoins, onramp, exchange]);

	useEffect(() => {
		if (Object.keys(onramp).length && !selectedAsset) {
			setIsPaymentForm(true);
		}
		// eslint-disable-next-line
	}, []);

	const handleSelectCoin = (e) => {
		if (e) {
			setCoinSymbol(e);
			setSelectedAsset(e);
		}
	};

	const handleRamp = (
		type,
		showCoin,
		coinSymb = coinSymbol,
		_,
		showSelect = false
	) => {
		setSelectedAsset(coinSymb);
		setIsVisible(true);
		setType(type);
		setShowSelect(showSelect);
		setCoinSymbol(coinSymb);
		setShowCoins(showCoin);
	};

	const onCancel = () => {
		setIsVisible(false);
		setSelectedPaymentType('');
		setIsPayChanged(false);
		if (showSelect) {
			setSelectedCoin(fiatCoins && fiatCoins[0]);
		}
	};

	const formUpdate = (val, plugin, isCustomPay, curIndex, currentType = '') => {
		setOnrampIndex(
			onramp && onramp[coinSymbol]
				? Object.keys(onramp[coinSymbol]).length + 1
				: 1
		);
		setIsPaymentForm(true);
		setFormType(val);
		setCustomName(plugin);
		if (currentType && currentType === 'add') {
			setIsProceed(true);
		}
		if (currentType) setCurrentType(currentType);
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

	const handleSaveAndPublish = () => {
		setIsVisible(false);
	};

	let symbolData = [];
	let coinData = [];
	coins.forEach((item) => {
		if (!symbolData.includes(item.symbol)) {
			symbolData.push(item.symbol);
			coinData.push(item);
		}
	});

	return (
		<div className="ramp-wrapper">
			<Spin spinning={isLoading || !allCoins.length} size="large">
				<div className="payment-acc-wrapper">
					<Fragment>
						<div className="d-flex justify-content-between">
							<div className="d-flex align-items-center">
								<img
									src={STATIC_ICONS.ONRAMP_DOLLAR_ICON}
									alt="pay-icon"
									className="pay-icon"
								/>
								<div>
									<div className="d-flex align-items-center">
										<div className="mr-3 w-50">
											Connect an on-ramp. This can simply be bank deposit
											details and/or other payment processor details. Below are
											fiat assets that you can connect deposit details for. Once
											connected, these details will be displayed to users in
											their asset wallet deposit page for that specific asset.
										</div>
										<Tooltip
											overlayClassName="admin-general-description-tip general-description-tip-right"
											title={
												<img
													src={STATIC_ICONS.FIAT_ONRAMP_TOOLTIP}
													className="fiatpayhelp fiatonramphelpnote"
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
								onClick={() =>
									handleRamp(
										'onramp',
										true,
										selectedCoin?.symbol,
										null,
										null,
										true
									)
								}
								disabled={
									!user_payments ||
									!Object.keys(user_payments).length ||
									isDisable
								}
							>
								Add on-ramp
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
										<div>
											We've noticed that there hasn't been any Payment Accounts
											added yet. To start it is recommended to{' '}
											<Link to="/admin/fiat?tab=1" className="underline">
												add a Payment Account
											</Link>
											.
										</div>
										<div>
											<Link to="/admin/fiat?tab=1" className="underline">
												<Button type="primary" className="green-btn">
													Add payment account
												</Button>
											</Link>
											<div className="small-gray-text">
												Add an on-ramp anyway{' '}
												<span
													className={
														isDisable ? 'anchor pointer-none' : 'anchor'
													}
													onClick={() => handleRamp('onramp', true)}
												>
													here
												</span>
											</div>
										</div>
									</div>
								</div>
							) : null}
							{!Object.keys(onramp).length &&
							user_payments &&
							Object.keys(user_payments).length
								? renderSelect('deposit')
								: null}
							{coinData.map((item, index) => {
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
													<b>Status</b>:{' '}
													{item?.verified ? 'Active' : 'In active'}
												</span>
												<Link
													to={`/admin/financials?tab=0&preview=true&symbol=${item?.symbol}&isFiat=${activeTab}`}
													className="underline assetclick"
												>
													Manage asset
												</Link>
											</div>
											<Button
												type="primary"
												className="green-btn ml-5"
												onClick={() =>
													handleRamp('onramp', false, item?.symbol)
												}
												disabled={
													!user_payments ||
													!Object.keys(user_payments).length ||
													isDisable
												}
											>
												Add on-ramp
											</Button>
										</div>
										{isPaymentForm ? (
											<RampPaymentAccounts
												formType={formType}
												isDisplayFormData={true}
												onramp={onramp[item?.symbol]}
												currentActiveTab={activeTab}
												coinSymbol={coinSymbol ? coinSymbol : item?.symbol}
												onRampCoins={!isPaymentForm ? Object.keys(onramp) : []}
												customName={customName}
												user_payments={user_payments}
												isUpgrade={isUpgrade}
												originalonramp={onramp}
												pluginName={pluginName}
												currentsymbol={item?.symbol}
												isPaymentForm={formType === 'plugin' && customName}
												setCoindata={setCoindata}
												selectedPaymentType={selectedPayType?.[item?.symbol]}
												selectedPayType={selectedPayType}
												getUpdatedKitData={getUpdatedKitData}
												setSelectedPayType={setSelectedPayType}
												paymentIndex={
													selectedPayType && selectedPayType[item?.symbol]
														? onramp &&
														  onramp[item?.symbol] &&
														  onramp[item?.symbol].indexOf(
																selectedPayType && selectedPayType[item?.symbol]
														  ) + 1
														: 1
												}
												currentOnrampType={currentType}
												OnsetCurrentType={setCurrentType}
												isProceed={isProceed}
												setIsProceed={setIsProceed}
												isModalVisible={isVisible}
												isLoading={isLoading}
												setIsLoading={setIsLoading}
												setIsDisable={setIsDisable}
												isDisable={isDisable}
												onrampIndex={onrampIndex}
												setOnrampIndex={setOnrampIndex}
											/>
										) : null}
										<div className="border-divider"></div>
									</div>
								);
							})}
						</div>
					</Fragment>
				</div>
			</Spin>
			<Modal visible={isVisible} footer={null} width={500} onCancel={onCancel}>
				<PaymentAccountPopup
					handleClosePlugin={onCancel}
					type={type}
					tabUpdate={handleRamp}
					formUpdate={formUpdate}
					coins={coins}
					coinSymbol={coinSymbol}
					activeTab={activeTab}
					fiatCoins={fiatCoins}
					selectedAsset={selectedAsset}
					showCoins={showCoins}
					handleSelectCoin={handleSelectCoin}
					user_payments={onramp[coinSymbol] || {}}
					currentActiveTab={activeTab}
					updatePlugin={updatePlugin}
					handleSaveAndPublish={handleSaveAndPublish}
					setCoindata={setCoindata}
					singleCoin={selectedCoin}
					showSelect={showSelect}
					selectedPaymentType={selectedPaymentType}
					isPayChanged={isPayChanged}
					setIsPayChanged={setIsPayChanged}
					isVisible={isVisible}
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
