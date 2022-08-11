import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { STATIC_ICONS } from 'config/icons';
import { Button, Tooltip, Modal, Select, message, Spin } from 'antd';
import {
	QuestionCircleOutlined,
	InfoCircleOutlined,
	CaretDownOutlined,
	CaretUpOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router';

import Coins from '../Coins';
import PaymentAccountPopup from './PaymentPopup';
import RampPaymentAccounts from './RampPaymentAccounts';
import { updateConstants } from '../General/action';
import { getConstants } from '../Settings/action';

import './index.css';

const { Option } = Select;

const Offramp = ({
	activeTab,
	handleTabChange,
	allCoins,
	exchange,
	isUpgrade,
	offramp,
	user_payments,
	setConfig,
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
	const [selectOffField, setSelectOffField] = useState([]);
	const [fiatCoins, setFiatCoins] = useState([]);
	const [selectedAsset, setSelectedAsset] = useState('');
	const [showCoins, setShowCoins] = useState(false);
	const [customName, setCustomName] = useState('');
	const [pluginName, setPluginName] = useState('');
	const [selectedCoin, setSelectedCoin] = useState({});
	const [kitOfframpData, setKitOfframpData] = useState({});
	const [showSelect, setShowSelect] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [selectedPayType, setSelectedPayType] = useState({});
	const [currentCoinItem, setCoinItem] = useState('');
	const [currentOfframpIndex, setCurrentOfframpIndex] = useState(0);
	const [selectedPaymentType, setSelectedPaymentType] = useState('');
	const [isPayChanged, setIsPayChanged] = useState(false);
	const [currentType, setCurrentType] = useState('');
	const [isProceed, setIsProceed] = useState(false);
	const [offrampCurrentType, setOfframpCurrentType] = useState('');
	const [isDisable, setIsDisable] = useState(false);

	useEffect(() => {
		let coins =
			allCoins &&
			allCoins.filter(
				(val) =>
					exchange && exchange.coins && exchange.coins.includes(val.symbol)
			);
		coins = coins.filter((item) => Object.keys(offramp).includes(item.symbol));
		let selectedAssetData = allCoins;
		if (selectedAsset) {
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
		}
		if (!coins.length) {
			setCoins(fiatCoins && fiatCoins.length ? [fiatCoins?.[0]] : []);
		}
		if (coins.length) {
			setCoins(coins);
		}
	}, [allCoins, offramp, exchange, selectedAsset, fiatCoins]);

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
	}, [allCoins, offramp, exchange]);

	useEffect(() => {
		if (Object.keys(offramp).length && !selectedAsset) {
			setIsPaymentForm(true);
		}
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (isVisible) {
			setSelectedPaymentType(
				user_payments &&
					selectedCoin &&
					offramp &&
					Object.keys(user_payments).filter(
						(item) =>
							offramp[selectedCoin.symbol] &&
							!offramp[selectedCoin.symbol].includes(item)
					) &&
					Object.keys(user_payments).filter(
						(item) =>
							offramp[selectedCoin.symbol] &&
							!offramp[selectedCoin.symbol].includes(item)
					)[0]
			);
		}
	}, [offramp, user_payments, selectedCoin, isVisible]);

	const handleSelectCoin = (e) => {
		if (e) {
			setSelectedAsset(e);
			setSelectedPaymentType(
				user_payments &&
					selectedCoin &&
					offramp &&
					Object.keys(user_payments).filter(
						(item) =>
							offramp[selectedCoin.symbol] &&
							!offramp[selectedCoin.symbol].includes(item)
					) &&
					Object.keys(user_payments).filter(
						(item) =>
							offramp[selectedCoin.symbol] &&
							!offramp[selectedCoin.symbol].includes(item)
					)[0]
			);
		}
	};

	const handleRamp = (
		type,
		showCoin,
		coinSymb = coinSymbol,
		offrampSelect,
		_,
		showSelect = false
	) => {
		setSelectedAsset(coinSymb);
		setTimeout(() => {
			setIsVisible(true);
		}, 100);
		if (coinSymb) {
			let IndexNum;
			fiatCoins.forEach((item, index) => {
				if (item.symbol === coinSymb) {
					IndexNum = index;
				}
			});
			setSelectedCoin(fiatCoins[IndexNum]);
		} else {
			setSelectedCoin(fiatCoins && fiatCoins[0]);
		}
		setType(type);
		setShowSelect(showSelect);
		setCoinSymbol(coinSymb);
		setSelectOffField(offrampSelect);
		setShowCoins(showCoin);
	};

	const onCancel = () => {
		setIsVisible(false);
		setSelectOffField([]);
		setSelectedPaymentType('');
		setIsPayChanged(false);
	};

	const handleoffRampTab = (e) => {
		setIsVisible(false);
		handleTabChange(e);
	};

	const formUpdate = (val, plugin, isCustomPay, curIndex, currentType = '') => {
		setIsPaymentForm(true);
		setFormType(val);
		setCustomName(plugin);
		if (currentType && currentType === 'add') {
			setIsProceed(true);
		}
		if (currentType) setCurrentType(currentType);
	};

	const handleOffRampProceed = (type, paymentType, selectedSymbol) => {
		let kitData = {
			kit: {
				offramp: {
					[selectedSymbol]: [paymentType],
				},
			},
		};
		if (Object.keys(offramp).length && selectedSymbol) {
			kitData = {
				kit: {
					offramp: {
						...offramp,
						[selectedSymbol]: offramp[selectedSymbol]
							? [...offramp[selectedSymbol], paymentType]
							: [paymentType],
					},
				},
			};
		}
		setKitOfframpData(kitData);
		setType(type);
	};

	const updatePlugin = (e) => {
		setFormType('plugin');
		setPluginName(e);
	};

	const setCoindata = (coinSymb = coinSymbol) => {
		setCoinSymbol(coinSymb);
	};

	const setPaymentMethod = (e, item, index) => {
		setSelectedPayType({
			...selectedPayType,
			[item]: e,
		});
		setCurrentOfframpIndex(index);
		setCoinItem(item);
	};

	const handleOpenPayment = () => {
		setIsOpen(!isOpen);
	};

	const handleOpen = (text) => {
		if (text === 'open') {
			setIsOpen(true);
		} else {
			setIsOpen(false);
		}
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
		setSelectOffField([]);
		updateConstantsData(kitOfframpData);
	};

	const updateConstantsData = (bodyData) => {
		setIsLoading(true);
		updateConstants(bodyData)
			.then((res) => {
				if (res) {
					getConstantData();
					message.success('Updated successfully');
				}
			})
			.catch((err) => {
				let error = err && err.data ? err.data.message : err.message;
				message.error(error);
			});
	};

	const getConstantData = () => {
		getConstants()
			.then((res) => {
				setConfig(res && res.kit);
				getUpdatedKitData(res && res.kit);
			})
			.catch((error) => {
				const message = error.data ? error.data.message : error.message;
				console.log('message', message);
			});
		setIsLoading(false);
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
			<Spin spinning={isLoading} size="large">
				<div className="payment-acc-wrapper">
					<Fragment>
						<div className="d-flex justify-content-between">
							<div className="d-flex align-items-center">
								<img
									src={STATIC_ICONS.OFFRAMP_DOLLAR_ICON}
									alt="pay-icon"
									className="pay-icon"
								/>
								<div>
									<div className="d-flex align-items-center">
										<div className="mr-3 w-50">
											Add an off-ramp to allow your users a way to withdraw
											fiat. Off-ramps require previously added{' '}
											<Link to="/admin/fiat?tab=1" className="anchor">
												payment Accounts
											</Link>
											.
										</div>
										<Tooltip
											overlayClassName="admin-general-description-tip general-description-tip-right"
											title={
												<img
													src={STATIC_ICONS.FIAT_OFFRAMP_TOOLTIP}
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
									handleRamp('offramp', true, null, null, null, true)
								}
								disabled={
									!user_payments ||
									!Object.keys(user_payments).length ||
									isDisable
								}
							>
								Add off-ramp
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
									</div>
								</div>
							) : null}
							{!Object.keys(offramp).length ? renderSelect('deposit') : null}
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
													handleRamp(
														'offramp',
														false,
														item?.symbol,
														offramp[item?.symbol],
														selectedCoin,
														false
													)
												}
												disabled={
													(Object.keys(offramp).includes(item?.symbol) &&
														Object.keys(user_payments).length ===
															offramp[item?.symbol].length) ||
													isDisable
												}
											>
												Add off-ramp
											</Button>
										</div>
										{user_payments &&
										Object.keys(user_payments).length &&
										Object.keys(user_payments).length > 1 &&
										offramp[item?.symbol]?.length &&
										offramp[item?.symbol]?.length > 1 ? (
											<div className="mt-4">
												<div>
													Payment accounts (
													{offramp[item?.symbol]
														? offramp[item?.symbol].length
														: 0}{' '}
													method saved)
												</div>
												<div className="mb-3">
													<Select
														className="paymentSelect"
														defaultValue={
															selectedPayType[item?.symbol]
																? selectedPayType[item?.symbol][0]
																: offramp &&
																  offramp[item?.symbol] &&
																  offramp[item?.symbol][0]
														}
														value={selectedPayType[item?.symbol]}
														suffixIcon={
															isOpen ? (
																<CaretDownOutlined
																	className="downarrow"
																	onClick={() => handleOpen('close')}
																/>
															) : (
																<CaretUpOutlined
																	className="downarrow"
																	onClick={() => handleOpen('open')}
																/>
															)
														}
														onClick={handleOpenPayment}
														open={isOpen}
														onChange={(val) =>
															setPaymentMethod(val, item?.symbol, index)
														}
													>
														{Object.keys(user_payments).map(
															(userPaymentItem, index) => {
																return Object.keys(offramp).map((data) => {
																	if (
																		offramp[data].includes(userPaymentItem) &&
																		data === item?.symbol
																	) {
																		return (
																			<Option
																				value={userPaymentItem}
																				key={index}
																			>
																				User payment account{' '}
																				{offramp[data].indexOf(
																					userPaymentItem
																				) + 1}
																				: {userPaymentItem}
																			</Option>
																		);
																	} else {
																		return null;
																	}
																});
															}
														)}
													</Select>
												</div>
											</div>
										) : null}
										{isPaymentForm || item.symbol === coinSymbol ? (
											<RampPaymentAccounts
												formType={formType}
												isDisplayFormData={true}
												currentActiveTab={activeTab}
												coinSymbol={coinSymbol ? coinSymbol : item?.symbol}
												customName={customName}
												user_payments={user_payments}
												isUpgrade={isUpgrade}
												offramp={offramp[item?.symbol]}
												pluginName={pluginName}
												currentsymbol={item?.symbol}
												isPaymentForm={formType === 'plugin' && customName}
												setCoindata={setCoindata}
												selectedPaymentType={
													selectedPayType[item?.symbol]
														? selectedPayType[item?.symbol]
														: offramp &&
														  offramp[item?.symbol] &&
														  offramp[item?.symbol][0]
												}
												selectedPayType={selectedPayType}
												currentCoinItem={currentCoinItem}
												currentOfframpIndex={currentOfframpIndex}
												originalofframp={offramp}
												getUpdatedKitData={getUpdatedKitData}
												setSelectedPayType={setSelectedPayType}
												paymentIndex={
													selectedPayType && selectedPayType[item?.symbol]
														? offramp &&
														  offramp[item?.symbol] &&
														  offramp[item?.symbol].indexOf(
																selectedPayType && selectedPayType[item?.symbol]
														  ) + 1
														: 1
												}
												currentOnrampType={currentType}
												OnsetCurrentType={setCurrentType}
												isProceed={isProceed}
												setIsProceed={setIsProceed}
												isLoading={isLoading}
												setIsLoading={setIsLoading}
												setOfframpCurrentType={setOfframpCurrentType}
												offrampCurrentType={offrampCurrentType}
												setCoinSymbol={setCoinSymbol}
												isDisable={isDisable}
												setIsDisable={setIsDisable}
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
					user_payments={user_payments}
					currentActiveTab={activeTab}
					handleOffRampProceed={handleOffRampProceed}
					updatePlugin={updatePlugin}
					handleSaveAndPublish={handleSaveAndPublish}
					setCoindata={setCoindata}
					singleCoin={selectedCoin}
					offramp={offramp}
					showSelect={showSelect}
					selectedPaymentType={
						selectedPaymentType || Object.keys(user_payments)?.[0]
					}
					isPayChanged={isPayChanged}
					setIsPayChanged={setIsPayChanged}
					currentIndex={currentOfframpIndex}
					setCurrentOfframpIndex={setCurrentOfframpIndex}
					paymentSelectData={selectedPaymentType}
				/>
			</Modal>
		</div>
	);
};

const mapStateToProps = (state) => ({
	allCoins: state.asset.allCoins,
	exchange: state.asset && state.asset.exchange,
});

export default connect(mapStateToProps)(Offramp);
