import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isMobile } from 'react-device-detect';
import { Button, Input, Select } from 'antd';
import BigNumber from 'bignumber.js';
import { Coin } from 'components';
import STRINGS from 'config/localizedStrings';
import {
	CaretDownOutlined,
	CheckOutlined,
	CloseOutlined,
	ExclamationCircleFilled,
} from '@ant-design/icons';
import { STATIC_ICONS } from 'config/icons';
import {
	getWithdrawalMax,
	setFee,
	setIsValidAdress,
	setReceiverEmail,
	setSelectedMethod,
	setWithdrawOptionaltag,
	withdrawAddress,
	withdrawAmount,
	withdrawCurrency,
	withdrawNetwork,
	withdrawNetworkOptions,
} from 'actions/appActions';
import { getPrices } from 'actions/assetActions';
import {
	calculateFee,
	calculateFeeCoin,
	onHandleSymbol,
	renderEstimatedValueAndFee,
	renderLabel,
	renderNetworkWithLabel,
} from './utils';
import { email, validAddress } from 'components/Form/validations';
import strings from 'config/localizedStrings';

const RenderWithdraw = ({
	coins,
	UpdateCurrency,
	onOpenDialog,
	assets,
	pinnedAssets,
	router,
	onHandleScan,
	selectedNetwork,
	...rest
}) => {
	const { Option } = Select;
	const methodOptions = [
		strings['WITHDRAW_PAGE.WITHDRAWAL_CONFIRM_ADDRESS'],
		strings['FORM_FIELDS.EMAIL_LABEL'],
	];
	const [currStep, setCurrStep] = useState({
		stepOne: false,
		stepTwo: false,
		stepThree: false,
		stepFour: false,
		stepFive: false,
	});
	const [maxAmount, setMaxAmount] = useState(0);
	const [topAssets, setTopAssets] = useState([]);
	const [selectedAsset, setSelectedAsset] = useState(null);
	const [prices, setPrices] = useState({});
	const [isPinnedAssets, setIsPinnedAssets] = useState(false);
	const [optionalTag, setOptionalTag] = useState('');
	const [isValidEmail, setIsValidEmail] = useState(false);
	const [isDisbaleWithdraw, setIsDisbaleWithdraw] = useState(false);
	// const [isCheck, setIsCheck] = useState(false);
	// const [isVisible, setIsVisible] = useState(false);
	// const [isWarning, setIsWarning] = useState(false);

	const {
		setWithdrawCurrency,
		setWithdrawNetworkOptions,
		setWithdrawAddress,
		setWithdrawAmount,
		getWithdrawCurrency,
		getWithdrawNetworkOptions,
		getWithdrawAddress,
		getWithdrawAmount,
		setFee,
		setWithdrawNetwork,
		currency,
		coin_customizations,
		setIsValidAdress,
		isValidAddress,
		getNativeCurrency,
		selectedMethod,
		setSelectedMethod,
		setReceiverEmail,
		receiverWithdrawalEmail,
		setWithdrawOptionaltag,
	} = rest;

	const defaultCurrency = currency !== '' && currency;
	const iconId = coins[getWithdrawCurrency]?.icon_id;
	const coinLength =
		coins[getWithdrawCurrency]?.network &&
		coins[getWithdrawCurrency]?.network.split(',');
	let network =
		coins[getWithdrawCurrency]?.network &&
		coins[getWithdrawCurrency]?.network !== 'other'
			? coins[getWithdrawCurrency]?.network
			: coins[getWithdrawCurrency]?.symbol;

	const curretPrice = getWithdrawCurrency
		? prices[getWithdrawCurrency]
		: prices[defaultCurrency];
	const estimatedWithdrawValue = curretPrice * getWithdrawAmount || 0;
	let fee =
		selectedMethod === strings['FORM_FIELDS.EMAIL_LABEL']
			? 0
			: calculateFee(selectedAsset, getWithdrawNetworkOptions, coins);
	const feeCoin = calculateFeeCoin(
		selectedAsset,
		getWithdrawNetworkOptions,
		coins
	);

	const feeMarkup =
		selectedAsset && coin_customizations?.[selectedAsset]?.fee_markup;
	if (feeMarkup) {
		const incrementUnit = coins?.[selectedAsset]?.increment_unit;
		const decimalPoint = new BigNumber(incrementUnit).dp();
		const roundedMarkup = new BigNumber(feeMarkup)
			.decimalPlaces(decimalPoint)
			.toNumber();

		fee = new BigNumber(fee || 0).plus(roundedMarkup || 0).toNumber();
	}

	const currentNetwork =
		getWithdrawNetworkOptions !== '' ? getWithdrawNetworkOptions : network;
	const defaultNetwork =
		defaultCurrency &&
		coins[defaultCurrency]?.network &&
		coins[defaultCurrency]?.network !== 'other'
			? coins[defaultCurrency]?.network
			: coins[defaultCurrency]?.symbol;
	const isWithdrawal = coins[getWithdrawCurrency]?.allow_withdrawal;

	useEffect(() => {
		const topWallet = assets
			.filter((item, index) => {
				return index <= 3;
			})
			.map((data) => {
				return data[0];
			});
		if (pinnedAssets.length) {
			setTopAssets(pinnedAssets);
		} else {
			setTopAssets(topWallet);
		}
	}, [assets, pinnedAssets]);

	useEffect(() => {
		UpdateCurrency(getWithdrawCurrency);
		setFee(fee);
		setWithdrawNetwork(currentNetwork);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getWithdrawCurrency, UpdateCurrency, fee, setFee]);

	useEffect(() => {
		if (defaultCurrency) {
			setSelectedAsset(defaultCurrency);
			setWithdrawCurrency(defaultCurrency);
			if (coinLength?.length > 1) {
				setCurrStep({ ...currStep, stepTwo: true });
			}
			setCurrStep({ ...currStep, stepTwo: true, stepThree: true });
			getWithdrawMAx(defaultCurrency);
		} else {
			setSelectedAsset(null);
		}
		// if (
		// 	['xrp', 'xlm', 'ton', 'pmn'].includes(defaultCurrency) ||
		// 	['xrp', 'xlm', 'ton', 'pmn'].includes(currentNetwork)
		// ) {
		// 	setIsWarning(true);
		// }
		getOraclePrices();
		setCurrStep({ ...currStep, stepTwo: true });

		return () => {
			setIsValidAdress(false);
			setIsValidEmail(false);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (getWithdrawCurrency && !isWithdrawal) {
			setSelectedAsset('');
			setIsDisbaleWithdraw(true);
			setCurrStep({
				stepOne: true,
				stepTwo: true,
				stepThree: false,
				stepFour: false,
				stepFive: false,
			});
		} else {
			setIsDisbaleWithdraw(false);
		}
	}, [getWithdrawCurrency, isWithdrawal]);

	const isAmount = useMemo(() => {
		const isCondition =
			selectedMethod === strings['FORM_FIELDS.EMAIL_LABEL']
				? !isValidEmail
				: !isValidAddress;
		return (
			!getWithdrawAddress ||
			!getWithdrawCurrency ||
			getWithdrawAmount <= 0 ||
			getWithdrawAmount > maxAmount ||
			maxAmount <= 0 ||
			!network ||
			isCondition
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		getWithdrawAddress,
		getWithdrawCurrency,
		getWithdrawAmount,
		maxAmount,
		network,
		isValidAddress,
		isValidEmail,
	]);

	const getOraclePrices = async () => {
		try {
			const prices = await getPrices({ coins });
			setPrices(prices);
		} catch (error) {
			console.error(error);
		}
	};

	const getWithdrawMAx = async (getWithdrawCurrency, isMaxAmount = false) => {
		try {
			const res = await getWithdrawalMax(
				getWithdrawCurrency && getWithdrawCurrency,
				selectedMethod === strings['FORM_FIELDS.EMAIL_LABEL']
					? 'email'
					: getWithdrawNetworkOptions
					? getWithdrawNetworkOptions
					: network
					? network
					: defaultNetwork
			);
			isMaxAmount && setWithdrawAmount(res?.data?.amount);
			setMaxAmount(res?.data?.amount);
		} catch (error) {
			console.error(error);
		}
	};

	const onHandleChangeMethod = (method) => {
		setWithdrawAddress('');
		setWithdrawAmount('');
		setReceiverEmail('');
		setSelectedMethod(method);
		setCurrStep((prev) => ({ ...prev, stepTwo: true }));
		setIsValidAdress(false);
		setIsValidEmail(false);
		if (!method) {
			setCurrStep((prev) => ({
				...prev,
				stepTwo: false,
				stepThree: false,
				stepFour: false,
				stepFive: false,
			}));
		}
	};

	const onHandleChangeSelect = (val, pinned_assets = false) => {
		if (pinned_assets) {
			setIsPinnedAssets(pinned_assets);
		}
		if (val) {
			if (
				currStep.stepTwo ||
				currStep.stepThree ||
				currStep.stepFour ||
				currStep.stepFive
			) {
				setCurrStep((prev) => ({
					...prev,
					stepTwo: false,
					stepThree: false,
					stepFour: false,
					stepFive: false,
				}));
			}
			if (coins[val] && !coins[val].allow_withdrawal) {
				setCurrStep((prev) => ({ ...prev, stepTwo: true, stepThree: false }));
			} else {
				setCurrStep((prev) => ({ ...prev, stepTwo: true, stepThree: true }));
			}
			setWithdrawCurrency(val);
			network = val ? val : coins[getWithdrawCurrency]?.symbol;
			getWithdrawMAx(val);
			setWithdrawNetworkOptions(null);
			setIsValidAdress(false);
			setIsValidEmail(false);
			router.push(`/wallet/${val}/withdraw`);
		} else if (!val) {
			setWithdrawCurrency('');
			setCurrStep((prev) => ({
				...prev,
				stepThree: false,
				stepFour: false,
				stepFive: false,
			}));
			setWithdrawAmount('');
		}
		setSelectedAsset(
			val && coins[val] && coins[val].allow_withdrawal ? val : ''
		);
		setWithdrawAddress('');
		setReceiverEmail('');
	};

	const renderPinnedAsset = (data) => {
		const icon_id = coins[data]?.icon_id;
		return (
			<div className="d-flex justify-content-around">
				{data.toUpperCase()}
				<span className="pinned-asset-icon">
					<Coin iconId={icon_id} type="CS1" />
				</span>
			</div>
		);
	};

	const onHandleChangeNetwork = (val) => {
		if (val) {
			setCurrStep((prev) => ({ ...prev, stepFour: true }));
			setWithdrawNetworkOptions(val);
		} else if (!val) {
			setCurrStep((prev) => ({ ...prev, stepFour: false, stepFive: false }));
		}
	};

	const onHandleAddress = (val, method) => {
		const isValid = validAddress(
			getWithdrawCurrency,
			STRINGS[`WITHDRAWALS_${selectedAsset.toUpperCase()}_INVALID_ADDRESS`],
			currentNetwork,
			val
		)();
		if (method === 'email') {
			const validate = email(val);
			if (!validate) {
				setIsValidEmail(true);
			} else {
				setIsValidEmail(false);
			}
		}
		if (val) {
			setCurrStep((prev) => ({ ...prev, stepFive: true }));
		} else if (!val) {
			setCurrStep((prev) => ({ ...prev, stepFour: false, stepFive: false }));
		}
		setWithdrawAddress(val);
		setReceiverEmail(val);
		setIsValidAdress({ isValid: !isValid });
		setWithdrawAmount('');
	};

	const onHandleAmount = (val) => {
		if (val >= 0) {
			setWithdrawAmount(val);
		}
	};

	// const onHandleRemove = () => {
	// 	if (!isCheck) {
	// 		setOptionalTag('');
	// 	}
	// 	setIsCheck(true);
	// 	setIsVisible(false);
	// };

	const renderAmountIcon = () => {
		return (
			<div
				onClick={() => getWithdrawMAx(getWithdrawCurrency, true)}
				className="d-flex render-amount-icon-wrapper"
			>
				<span className="suffix-text">{renderLabel('CALCULATE_MAX')}</span>
				<div className="img-wrapper">
					<img alt="max-icon" src={STATIC_ICONS['MAX_ICON']} />
				</div>
			</div>
		);
	};

	// const renderRemoveTag = () => {
	// 	return (
	// 		<div className="remove-tag-wrapper">
	// 			<div className="tag-body">
	// 				<div className="mb-4">
	// 					<EditWrapper>
	// 						{STRINGS['WITHDRAW_PAGE.REMOVE_TAG_NOTE_1']}
	// 					</EditWrapper>
	// 				</div>
	// 				<div className="mb-4">
	// 					<EditWrapper>
	// 						{STRINGS.formatString(
	// 							STRINGS['WITHDRAW_PAGE.REMOVE_TAG_NOTE_2'],
	// 							<span className="font-weight-bold">
	// 								{STRINGS['WITHDRAW_PAGE.REMOVE_TAG_NOTE_3']}
	// 							</span>,
	// 							STRINGS['WITHDRAW_PAGE.REMOVE_TAG_NOTE_4']
	// 						)}
	// 					</EditWrapper>
	// 				</div>
	// 			</div>
	// 			<div className="button-wrapper">
	// 				<Button className="holla-button" onClick={() => setIsVisible(false)}>
	// 					<EditWrapper>{STRINGS['WITHDRAW_PAGE.BACK_BTN']}</EditWrapper>
	// 				</Button>
	// 				<Button className="holla-button" onClick={onHandleRemove}>
	// 					<EditWrapper>{STRINGS['WITHDRAW_PAGE.REMOVE_TAG']}</EditWrapper>
	// 				</Button>
	// 			</div>
	// 		</div>
	// 	);
	// };

	// const renderWithdrawWarningPopup = () => {
	// 	return (
	// 		<div className="warning-popup-wrapper">
	// 			<div>
	// 				<EditWrapper>
	// 					{STRINGS['WITHDRAW_PAGE.WARNING_WITHDRAW_INFO_1']}
	// 				</EditWrapper>
	// 			</div>
	// 			<div className="mt-3">
	// 				<EditWrapper>
	// 					{STRINGS['WITHDRAW_PAGE.WARNING_WITHDRAW_INFO_2']}
	// 				</EditWrapper>
	// 			</div>
	// 			<div className="button-wrapper">
	// 				<Button className="holla-button" onClick={() => setIsWarning(false)}>
	// 					<EditWrapper>
	// 						{STRINGS['USER_SETTINGS.DELETE_ACCOUNT.CONFIRMATION.KEY']}
	// 					</EditWrapper>
	// 				</Button>
	// 			</div>
	// 		</div>
	// 	);
	// };

	const onHandleOptionalTag = (value) => {
		setOptionalTag(value);
		setWithdrawOptionaltag(value);
	};

	const onHandleClear = (type) => {
		if (type === 'coin') {
			setSelectedAsset(null);
			setWithdrawCurrency('');
		}
		if (type === 'network') {
			setWithdrawAddress(null);
			setWithdrawNetworkOptions(null);
		}
		setCurrStep({
			...currStep,
			stepThree: false,
			stepFour: false,
			stepFive: false,
		});
		setIsValidAdress(false);
		setIsValidEmail(false);
	};

	// const onHandleSelect = (symbol) => {
	// 	const curr = onHandleSymbol(symbol);
	// 	if (curr !== symbol) {
	// 		if (
	// 			['xrp', 'xlm', 'ton'].includes(defaultCurrency) ||
	// 			['xrp', 'xlm', 'ton'].includes(defaultNetwork)
	// 		) {
	// 			setIsWarning(true);
	// 		} else {
	// 			setIsWarning(false);
	// 		}
	// 	}
	// };

	const renderScanIcon = () => {
		return (
			<div
				className="render-scan-wrapper d-flex"
				onClick={() => onHandleScan()}
			>
				<span className="suffix-text">{renderLabel('ACCORDIAN.SCAN')}</span>
				<div className="img-wrapper">
					<img alt="scan-icon" src={STATIC_ICONS['QR_CODE_SCAN']}></img>
				</div>
			</div>
		);
	};

	const withdrawFeeFormat =
		selectedMethod === strings['FORM_FIELDS.EMAIL_LABEL']
			? 0
			: `+ ${fee} ${
					(getWithdrawCurrency || currency) && feeCoin?.toUpperCase()
			  }`;
	const estimatedFormat = `≈ ${Math.round(
		estimatedWithdrawValue
	)} ${getNativeCurrency?.toUpperCase()}`;
	const isCondition =
		(['xrp', 'xlm'].includes(selectedAsset) ||
			['xlm', 'ton'].includes(network)) &&
		selectedMethod !== strings['FORM_FIELDS.EMAIL_LABEL'];
	const isEmailAndAddress =
		coinLength &&
		coinLength?.length > 1 &&
		selectedMethod !== strings['FORM_FIELDS.EMAIL_LABEL']
			? getWithdrawNetworkOptions !== null
			: currStep.stepThree || (selectedAsset && selectedMethod);
	const renderNetwork =
		coinLength &&
		coinLength?.length > 1 &&
		selectedMethod !== strings['FORM_FIELDS.EMAIL_LABEL']
			? getWithdrawNetworkOptions
			: true;
	const renderAmountField =
		(selectedMethod === strings['FORM_FIELDS.EMAIL_LABEL'] && isValidEmail) ||
		((selectedMethod === strings['WITHDRAW_PAGE.WITHDRAWAL_CONFIRM_ADDRESS'] ||
			(selectedMethod && selectedMethod === 'Address')) &&
			isValidAddress);
	const isErrorAmountField = getWithdrawAmount > maxAmount && maxAmount > 0;
	const networkIcon = selectedNetwork
		? coins[selectedNetwork]?.icon_id
		: coins[defaultNetwork]?.icon_id;
	const networkOptionsIcon = coins[getWithdrawNetworkOptions]?.icon_id;

	return (
		<div
			className={isDisbaleWithdraw ? 'withdraw-deposit-disable mt-1' : 'mt-1'}
		>
			<div>
				<div className="d-flex">
					<div className="custom-field d-flex flex-column align-items-center">
						<span className="custom-step-selected">1</span>
						<span
							className={`custom-line${currStep.stepTwo ? '-selected' : ''} ${
								selectedMethod ===
									strings['WITHDRAW_PAGE.WITHDRAWAL_CONFIRM_ADDRESS'] &&
								isMobile &&
								isMobile &&
								'custom-line-selected-mobile '
							}`}
						></span>
					</div>
					<div
						className={
							isMobile
								? 'd-flex w-100 flex-column'
								: 'd-flex w-100 justify-content-between'
						}
					>
						<div className="mt-2 ml-5 withdraw-main-label-selected">
							{renderLabel('WITHDRAWALS_FORM_METHOD')}
						</div>
						<div
							className={
								isMobile ? 'select-wrapper mobile-view' : 'select-wrapper'
							}
						>
							<div className="d-flex">
								<Select
									className="custom-select-input-style elevated select-field"
									dropdownClassName="custom-select-style"
									suffixIcon={<CaretDownOutlined />}
									placeholder={strings['WITHDRAW_PAGE.METHOD_FIELD_LABEL']}
									onChange={onHandleChangeMethod}
									value={
										selectedMethod === 'Address'
											? strings['WITHDRAW_PAGE.WITHDRAWAL_CONFIRM_ADDRESS']
											: selectedMethod
									}
								>
									{methodOptions.map((val, inx) => (
										<Option key={inx} value={val}>
											{val}
										</Option>
									))}
								</Select>
								{currStep.stepTwo && <CheckOutlined className="mt-3 ml-3" />}
							</div>
							{selectedMethod === strings['FORM_FIELDS.EMAIL_LABEL'] && (
								<div className="email-text">
									{renderLabel('WITHDRAWALS_FORM_MAIL_INFO')}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			<div>
				<div className="d-flex">
					<div className="custom-field d-flex flex-column align-items-center">
						<span
							className={`custom-step${currStep.stepTwo ? '-selected' : ''}`}
						>
							2
						</span>
						<span
							className={`custom-line${currStep.stepTwo ? '-selected' : ''}`}
						></span>
					</div>
					<div
						className={
							isMobile
								? 'd-flex w-100 flex-column'
								: 'd-flex w-100 justify-content-between'
						}
					>
						<div
							className={`mt-2 ml-5 withdraw-main-label${
								currStep.stepTwo ? '-selected' : ''
							}`}
						>
							{renderLabel('ACCORDIAN.SELECT_ASSET')}
						</div>
						<div
							className={
								isMobile ? 'select-wrapper mobile-view' : 'select-wrapper'
							}
						>
							{currStep.stepTwo && (
								<div>
									<div className="mb-3 d-flex">
										{topAssets.map((data, inx) => {
											return (
												<span
													key={inx}
													className={`currency-label ${
														selectedAsset === data
															? 'opacity-100'
															: 'opacity-30'
													}`}
													onClick={() => onHandleChangeSelect(data, true)}
												>
													{renderPinnedAsset(data)}
												</span>
											);
										})}
									</div>
									<div className="d-flex">
										<Select
											showSearch={true}
											className="custom-select-input-style elevated select-field"
											dropdownClassName="custom-select-style"
											suffixIcon={<CaretDownOutlined />}
											placeholder={strings['WITHDRAW_PAGE.SELECT']}
											allowClear={true}
											value={
												selectedAsset &&
												`${
													coins[selectedAsset].fullname
												} (${selectedAsset.toUpperCase()})`
											}
											onClear={() => onHandleClear('coin')}
											onKeyDown={(e) => {
												if (e.key === 'Enter') {
													const highlightedOption = document.querySelector(
														'.ant-select-item-option-active'
													);
													if (highlightedOption) {
														const value = highlightedOption
															.querySelector('div')
															.textContent.trim();
														const curr = onHandleSymbol(value);
														onHandleChangeSelect(curr);
													}
												}
											}}
											// onSelect={(e) => onHandleSelect(e)}
										>
											{Object.entries(coins).map(
												([_, { symbol, fullname, icon_id }]) => (
													<Option
														key={`${fullname} (${symbol.toUpperCase()})`}
														value={`${fullname} (${symbol.toUpperCase()})`}
													>
														<div
															className="d-flex gap-1"
															onClick={() => onHandleChangeSelect(symbol)}
														>
															<Coin iconId={icon_id} type="CS3" />
															<div>{`${fullname} (${symbol.toUpperCase()})`}</div>
														</div>
													</Option>
												)
											)}
										</Select>
										{selectedMethod === strings['FORM_FIELDS.EMAIL_LABEL'] ? (
											isEmailAndAddress && renderNetwork ? (
												<CheckOutlined className="mt-3 ml-3" />
											) : (
												<CloseOutlined className="mt-3 ml-3" />
											)
										) : currStep.stepThree ||
										  (selectedAsset && selectedMethod) ? (
											<CheckOutlined className="mt-3 ml-3" />
										) : (
											<CloseOutlined className="mt-3 ml-3" />
										)}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			{selectedMethod !== strings['FORM_FIELDS.EMAIL_LABEL'] && (
				<div>
					<div className="d-flex h-25">
						<div className="custom-field d-flex flex-column align-items-center">
							<span
								className={`custom-step${
									isEmailAndAddress || selectedAsset ? '-selected' : ''
								}`}
							>
								3
							</span>
							<span
								className={`custom-line${
									currStep.stepThree || (selectedAsset && selectedMethod)
										? '-selected'
										: ''
								} ${isMobile && 'custom-line-network-selected '}`}
							></span>
						</div>
						<div
							className={
								isMobile
									? 'd-flex w-100 flex-column'
									: 'd-flex w-100 justify-content-between'
							}
						>
							<div
								className={`mt-2 ml-5 withdraw-main-label${
									currStep.stepThree || (selectedAsset && selectedMethod)
										? '-selected'
										: ''
								}`}
							>
								{renderLabel('ACCORDIAN.SELECT_NETWORK')}
							</div>
							{(currStep.stepThree || (selectedAsset && selectedMethod)) && (
								<div
									className={
										isMobile ? 'select-wrapper mobile-view' : 'select-wrapper'
									}
								>
									<div className="d-flex withdraw-network-field">
										<Select
											showSearch={true}
											placeholder={strings['WITHDRAW_PAGE.SELECT']}
											className={`custom-select-input-style elevated ${
												coinLength && coinLength.length > 1
													? 'select-field'
													: 'disabled'
											}`}
											dropdownClassName="custom-select-style"
											suffixIcon={<CaretDownOutlined />}
											allowClear={true}
											onChange={onHandleChangeNetwork}
											value={
												defaultCurrency &&
												!isPinnedAssets &&
												coinLength?.length < 1
													? defaultNetwork
													: coinLength && coinLength.length <= 1
													? renderNetworkWithLabel(networkIcon, network)
													: coinLength && coinLength.length > 1
													? renderNetworkWithLabel(
															networkOptionsIcon,
															getWithdrawNetworkOptions
													  )
													: coins[getWithdrawCurrency]?.symbol.toUpperCase()
											}
											disabled={
												(coinLength && coinLength.length === 1) ||
												!(coinLength && coinLength.length)
											}
											onClear={() => onHandleClear('network')}
										>
											{coinLength &&
												coinLength.map((data, inx) => (
													<Option key={inx} value={data}>
														<div className="d-flex gap-1">
															<div>
																{renderNetworkWithLabel(
																	coins[data]?.icon_id,
																	data
																)}
															</div>
														</div>
													</Option>
												))}
										</Select>
										{selectedMethod !== strings['FORM_FIELDS.EMAIL_LABEL'] &&
										isEmailAndAddress &&
										renderNetwork ? (
											<CheckOutlined className="mt-3 ml-3" />
										) : (
											<CloseOutlined className="mt-3 ml-3" />
										)}
									</div>
									<div className="d-flex mt-2 warning-text">
										<ExclamationCircleFilled className="mt-1" />
										<div className="ml-2 w-75">
											{renderLabel('DEPOSIT_FORM_NETWORK_WARNING')}
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
			<div
				className={`${
					['xrp', 'xlm', 'ton', 'pmn'].includes(getWithdrawCurrency) &&
					selectedMethod &&
					selectedMethod !== strings['FORM_FIELDS.EMAIL_LABEL'] &&
					'destination-field'
				} ${isMobile && isMobile && 'destination-field-mobile'}`}
			>
				<div className="d-flex h-25 ">
					<div
						className={`custom-field d-flex flex-column align-items-center ${
							['xrp', 'xlm', 'ton', 'pmn'].includes(getWithdrawCurrency) &&
							selectedMethod &&
							selectedMethod !== strings['FORM_FIELDS.EMAIL_LABEL'] &&
							'destination-field'
						} ${isMobile && isMobile && 'destination-field-mobile'}`}
					>
						<span
							className={`custom-step${isEmailAndAddress ? '-selected' : ''}`}
						>
							{selectedMethod === strings['FORM_FIELDS.EMAIL_LABEL'] ? 3 : 4}
						</span>
						<span
							className={`custom-line${isEmailAndAddress ? '-selected' : ''} ${
								isMobile && 'custom-line-selected-mobile'
							}`}
						></span>
					</div>
					<div
						className={
							isMobile
								? 'd-flex w-100 flex-column'
								: 'd-flex w-100 justify-content-between'
						}
					>
						<div
							className={`mt-2 ml-5 withdraw-main-label${
								isEmailAndAddress ? '-selected' : ''
							}`}
						>
							{renderLabel(
								selectedMethod ===
									strings['WITHDRAW_PAGE.WITHDRAWAL_CONFIRM_ADDRESS'] ||
									selectedMethod === 'Address'
									? 'ACCORDIAN.DESTINATION'
									: 'FORM_FIELDS.EMAIL_LABEL'
							)}
						</div>
						{isEmailAndAddress && renderNetwork && (
							<div
								className={
									isMobile
										? 'd-flex flex-row select-wrapper mobile-view'
										: 'd-flex flex-row select-wrapper'
								}
							>
								{selectedMethod ===
									strings['WITHDRAW_PAGE.WITHDRAWAL_CONFIRM_ADDRESS'] ||
								selectedMethod === 'Address' ? (
									<Input
										className="destination-input-field"
										onChange={(e) => onHandleAddress(e.target.value, 'address')}
										value={getWithdrawAddress}
										placeholder={strings['WITHDRAW_PAGE.WITHDRAW_ADDRESS']}
										suffix={renderScanIcon()}
									></Input>
								) : (
									<Input
										className="destination-input-field"
										onChange={(e) => onHandleAddress(e.target.value, 'email')}
										value={receiverWithdrawalEmail}
										placeholder={
											strings['WITHDRAW_PAGE.WITHDRAW_EMAIL_ADDRESS']
										}
									></Input>
								)}
								{selectedMethod === strings['FORM_FIELDS.EMAIL_LABEL'] ? (
									isValidEmail ? (
										<CheckOutlined className="mt-3 ml-3" />
									) : (
										<CloseOutlined className="mt-3 ml-3" />
									)
								) : isValidAddress ? (
									<CheckOutlined className="mt-3 ml-3" />
								) : (
									<CloseOutlined className="mt-3 ml-3" />
								)}
							</div>
						)}
					</div>
				</div>
			</div>
			{isCondition && (
				<div>
					<div className="d-flex h-25">
						<div className="custom-field d-flex flex-column align-items-center">
							<span
								className={`custom-line-extra-large ${
									isEmailAndAddress ? 'custom-line-extra-large-active' : ''
								}`}
							></span>
							<span
								className={`custom-step${isEmailAndAddress ? '-selected' : ''}`}
							>
								5
							</span>
							<span
								className={`custom-line${
									isEmailAndAddress ? '-selected-large' : ''
								}`}
							></span>
						</div>
						<div
							className={
								isMobile
									? 'd-flex w-100 flex-column'
									: 'd-flex w-100 justify-content-between'
							}
						>
							<div
								className={`mt-3 pt-4 ml-5 withdraw-main-label${
									isEmailAndAddress ? '-selected' : ''
								}`}
							>
								{renderLabel('ACCORDIAN.OPTIONAL_TAG')}
							</div>
							{isEmailAndAddress && (
								<div
									className={
										isMobile
											? 'd-flex select-wrapper mobile-view'
											: 'd-flex select-wrapper mt-4'
									}
								>
									{/* <div className="d-flex justify-content-end width-80 mb-2">
										<div className={isCheck ? 'opacity-100' : 'opacity-30'}>
											<Checkbox
												className="pr-3 check-optional"
												onClick={() => {
													!isCheck ? setIsVisible(true) : setIsCheck(!isCheck);
												}}
												checked={isCheck}
											/>
											<span>No Tag</span>
										</div>
									</div> */}
									<div>
										<Input
											onChange={(e) => onHandleOptionalTag(e.target.value)}
											value={optionalTag}
											className="destination-input-field"
											type={
												selectedAsset === 'xrp' || selectedAsset === 'xlm'
													? 'number'
													: 'text'
											}
											// disabled={isCheck}
										></Input>
										{optionalTag && <CheckOutlined className="mt-3 ml-3" />}
									</div>
									<div className="d-flex mt-2 warning-text">
										<ExclamationCircleFilled className="mt-1" />
										<div className="ml-2 w-75">
											{renderLabel('WITHDRAWALS_FORM_DESTINATION_TAG_WARNING')}
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
			{/* <Modal
				title={strings['WITHDRAW_PAGE.WARNING']}
				visible={isWarning}
				onCancel={() => setIsWarning(false)}
				footer={false}
				className="withdrawal-remove-tag-modal"
				width="420px"
			>
				{renderWithdrawWarningPopup()}
			</Modal>
			<Modal
				title={strings['WITHDRAW_PAGE.REMOVE_TITLE']}
				visible={isVisible}
				onCancel={() => setIsVisible(false)}
				footer={false}
				className="withdrawal-remove-tag-modal"
			>
				{renderRemoveTag()}
			</Modal> */}
			<div>
				<div className="d-flex h-25">
					<div className="custom-field d-flex flex-column align-items-center">
						<span
							className={`custom-step${renderAmountField ? '-selected' : ''}`}
						>
							{isCondition
								? 6
								: selectedMethod === strings['FORM_FIELDS.EMAIL_LABEL']
								? 4
								: 5}
						</span>
						<span
							className={renderAmountField ? 'custom-line-selected-end' : ''}
						></span>
					</div>
					<div
						className={
							isMobile
								? 'd-flex w-100 flex-column'
								: 'd-flex w-100 justify-content-between'
						}
					>
						<div className=" d-flex mt-2 ml-5">
							<span className="amount-field-icon">
								<Coin iconId={iconId} type="CS4" />
							</span>
							<span
								className={`${
									getWithdrawCurrency && `ml-2`
								} withdraw-main-label${renderAmountField ? '-selected' : ''}`}
							>
								{getWithdrawCurrency.toUpperCase()}
							</span>
							<div
								className={`${
									getWithdrawCurrency && `ml-2`
								} withdraw-main-label${renderAmountField ? '-selected' : ''}`}
							>
								{renderLabel('ACCORDIAN.AMOUNT')}
							</div>
						</div>
						{renderAmountField && (
							<div
								className={
									isMobile
										? 'd-flex flex-column select-wrapper mobile-view'
										: 'd-flex flex-column select-wrapper'
								}
							>
								<div className="d-flex">
									<Input
										disabled={getWithdrawAmount < 0}
										onChange={(e) => onHandleAmount(e.target.value)}
										value={getWithdrawAmount}
										className={
											isErrorAmountField
												? `destination-input-field field-error`
												: `destination-input-field`
										}
										suffix={renderAmountIcon()}
										type="number"
										placeholder={strings['WITHDRAW_PAGE.ENTER_AMOUNT']}
									></Input>
									{!isAmount ? (
										<CheckOutlined className="mt-3 ml-3" />
									) : (
										<CloseOutlined className="mt-3 ml-3" />
									)}
								</div>
								{isErrorAmountField && (
									<div className="d-flex mt-2 warning_text">
										<ExclamationCircleFilled className="mt-1 mr-1" />
										{renderLabel('WITHDRAW_PAGE.MAX_AMOUNT_WARNING_INFO')}
									</div>
								)}
								{!maxAmount && maxAmount === 0 && (
									<div className="d-flex mt-2 warning-text">
										<ExclamationCircleFilled className="mt-1 mr-1" />
										{renderLabel('WITHDRAW_PAGE.ZERO_BALANCE')}
									</div>
								)}
								{currStep.stepFive && (
									<div
										className={`d-flex h-25 ${
											!isMobile ? 'bottom-wrapper' : ''
										}`}
									>
										<div className="custom-field d-flex flex-column align-items-center line-wrapper">
											<span
												className={
													currStep.stepFive ? 'custom-line-selected-end' : ''
												}
											></span>
										</div>
										<div className="bottom-content-wrapper">
											<div className="bottom-content">
												{renderEstimatedValueAndFee(
													renderLabel,
													'ACCORDIAN.ESTIMATED',
													estimatedFormat
												)}
												<span>--</span>
												{renderEstimatedValueAndFee(
													renderLabel,
													'ACCORDIAN.TRANSACTION_FEE',
													withdrawFeeFormat
												)}
											</div>
										</div>
									</div>
								)}
								{currStep.stepFive && (
									<div className="d-flex h-25 bottom-btn-wrapper">
										{isCondition && (
											<div className="custom-field d-flex flex-column align-items-center line-wrapper">
												<span
													className={
														currStep.stepFive ? 'custom-line-selected-end' : ''
													}
												></span>
											</div>
										)}
										{isCondition && (
											<span className="cross-line-selected"></span>
										)}
										<div className="withdraw-btn-wrapper">
											<Button
												disabled={isAmount}
												onClick={onOpenDialog}
												className="mb-3"
											>
												{STRINGS['WITHDRAWALS_BUTTON_TEXT'].toUpperCase()}
											</Button>
										</div>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

const mapStateToForm = (state) => ({
	getWithdrawCurrency: state.app.withdrawFields.withdrawCurrency,
	getWithdrawNetwork: state.app.withdrawFields.withdrawNetwork,
	getWithdrawNetworkOptions: state.app.withdrawFields.withdrawNetworkOptions,
	getWithdrawAddress: state.app.withdrawFields.withdrawAddress,
	getWithdrawAmount: state.app.withdrawFields.withdrawAmount,
	coin_customizations: state.app.constants.coin_customizations,
	isValidAddress: state.app.isValidAddress,
	getNativeCurrency: state.app.constants.native_currency,
	selectedMethod: state.app.selectedWithdrawMethod,
	receiverWithdrawalEmail: state.app.receiverWithdrawalEmail,
});

const mapDispatchToProps = (dispatch) => ({
	setWithdrawCurrency: bindActionCreators(withdrawCurrency, dispatch),
	setWithdrawNetwork: bindActionCreators(withdrawNetwork, dispatch),
	setWithdrawNetworkOptions: bindActionCreators(
		withdrawNetworkOptions,
		dispatch
	),
	setWithdrawAddress: bindActionCreators(withdrawAddress, dispatch),
	setWithdrawAmount: bindActionCreators(withdrawAmount, dispatch),
	setFee: bindActionCreators(setFee, dispatch),
	setIsValidAdress: bindActionCreators(setIsValidAdress, dispatch),
	setSelectedMethod: bindActionCreators(setSelectedMethod, dispatch),
	setReceiverEmail: bindActionCreators(setReceiverEmail, dispatch),
	setWithdrawOptionaltag: bindActionCreators(setWithdrawOptionaltag, dispatch),
});

export default connect(mapStateToForm, mapDispatchToProps)(RenderWithdraw);
