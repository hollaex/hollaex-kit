import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isMobile } from 'react-device-detect';
import { Button, Checkbox, Input, Modal, Select } from 'antd';
import BigNumber from 'bignumber.js';
import { Coin, EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';
import {
	CaretDownOutlined,
	CheckOutlined,
	ExclamationCircleFilled,
} from '@ant-design/icons';
import { getNetworkNameByKey } from 'utils/wallet';
import { STATIC_ICONS } from 'config/icons';
import {
	getWithdrawalMax,
	setFee,
	setIsValidAdress,
	setSelectedMethod,
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
	renderEstimatedValueAndFee,
	renderLabel,
} from './utils';
import { email, validAddress } from 'components/Form/validations';

const RenderWithdraw = ({
	coins,
	UpdateCurrency,
	onOpenDialog,
	assets,
	pinnedAssets,
	...rest
}) => {
	const { Option } = Select;
	const methodOptions = ['Address', 'Email'];
	const [currStep, setCurrStep] = useState({
		stepOne: false,
		stepTwo: false,
		stepThree: false,
		stepFour: false,
		stepFive: false,
	});
	const [maxAmount, setMaxAmount] = useState(0);
	const [topAssets, setTopAssets] = useState([]);
	const [selectedAsset, setSelectedAsset] = useState('');
	const [prices, setPrices] = useState({});
	const [isPinnedAssets, setIsPinnedAssets] = useState(false);
	const [optionalTag, setOptionalTag] = useState('');
	const [isCheck, setIsCheck] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	// const [selectedMethod, setSelectedMethod] = useState('Address');

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

	const curretPrice = prices[getNativeCurrency];
	const estimatedWithdrawValue = curretPrice * getWithdrawAmount || 0;
	let fee = calculateFee(selectedAsset, getWithdrawNetworkOptions, coins);
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

	const isAmount = useMemo(() => {
		return (
			!getWithdrawAddress ||
			!getWithdrawCurrency ||
			getWithdrawAmount <= 0 ||
			getWithdrawAmount > maxAmount ||
			maxAmount <= 0 ||
			!network ||
			!isValidAddress
		);
	}, [
		getWithdrawAddress,
		getWithdrawCurrency,
		getWithdrawAmount,
		maxAmount,
		network,
		isValidAddress,
	]);

	const currentNetwork =
		getWithdrawNetworkOptions !== '' ? getWithdrawNetworkOptions : network;
	const defaultNetwork =
		defaultCurrency &&
		coins[defaultCurrency]?.network &&
		coins[defaultCurrency]?.network !== 'other'
			? coins[defaultCurrency]?.network
			: coins[defaultCurrency]?.symbol;

	const getOraclePrices = async () => {
		try {
			const prices = await getPrices({ coins });
			setPrices(prices);
		} catch (error) {
			console.error(error);
		}
	};

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
		setSelectedAsset(defaultCurrency);
		if (defaultCurrency) {
			setWithdrawCurrency(defaultCurrency);
			setCurrStep({ ...currStep, stepTwo: true, stepThree: true });
		}
		getOraclePrices();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getWithdrawlMAx = async (getWithdrawCurrency, isMaxAmount = false) => {
		try {
			const res = await getWithdrawalMax(
				getWithdrawCurrency && getWithdrawCurrency,
				network
			);
			isMaxAmount && setWithdrawAmount(res?.data?.amount);
			setMaxAmount(res?.data?.amount);
		} catch (error) {
			console.error(error);
		}
	};

	const onHandleChangeMethod = (method) => {
		setSelectedMethod(method);
		setCurrStep((prev) => ({ ...prev, stepTwo: true }));
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
			if (currStep.stepTwo || currStep.stepThree || currStep.stepFour) {
				setCurrStep((prev) => ({
					...prev,
					stepTwo: false,
					stepThree: false,
					stepFour: false,
				}));
			}
			setCurrStep((prev) => ({ ...prev, stepTwo: true, stepThree: true }));
			setWithdrawCurrency(val);
			network = val ? val : coins[getWithdrawCurrency]?.symbol;
			getWithdrawlMAx(val);
			setWithdrawNetworkOptions('');
		} else if (!val) {
			setWithdrawCurrency('');
			setCurrStep((prev) => ({
				...prev,
				stepTwo: false,
				stepThree: false,
				stepFour: false,
			}));
			setWithdrawAmount(0);
		}
		setSelectedAsset(val);
		setWithdrawAddress('');
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
		const validate = email(val);
		if (validate) {
		}
		if (val) {
			setCurrStep((prev) => ({ ...prev, stepFour: true }));
		} else if (!val) {
			setCurrStep((prev) => ({ ...prev, stepFour: false, stepFive: false }));
		}
		setWithdrawAddress(val);
		setIsValidAdress({ isValid: !isValid });
		setWithdrawAmount(0);
	};

	const onHandleAmount = (val) => {
		setWithdrawAmount(val);
	};

	const onHandleRemove = () => {
		if (!isCheck) {
			setOptionalTag('');
		}
		setIsCheck(true);
		setIsVisible(false);
	};

	const renderAmountIcon = () => {
		return (
			<div
				onClick={() => getWithdrawlMAx(getWithdrawCurrency, true)}
				className="d-flex render-amount-icon-wrapper"
			>
				<span className="suffix-text">{renderLabel('CALCULATE_MAX')}</span>
				<div className="img-wrapper">
					<img alt="max-icon" src={STATIC_ICONS['MAX_ICON']} />
				</div>
			</div>
		);
	};

	const renderRemoveTag = () => {
		return (
			<div className="remove-tag-wrapper">
				<div className="tag-body">
					<div className="mb-4">
						<EditWrapper>
							{STRINGS['WITHDRAW_PAGE.REMOVE_TAG_NOTE_1']}
						</EditWrapper>
					</div>
					<div className="mb-4">
						<EditWrapper>
							{STRINGS.formatString(
								STRINGS['WITHDRAW_PAGE.REMOVE_TAG_NOTE_2'],
								<span className="font-weight-bold">
									{STRINGS['WITHDRAW_PAGE.REMOVE_TAG_NOTE_3']}
								</span>,
								STRINGS['WITHDRAW_PAGE.REMOVE_TAG_NOTE_4']
							)}
						</EditWrapper>
					</div>
				</div>
				<div className="button-wrapper">
					<Button className="holla-button" onClick={() => setIsVisible(false)}>
						<EditWrapper>{STRINGS['WITHDRAW_PAGE.BACK_BTN']}</EditWrapper>
					</Button>
					<Button className="holla-button" onClick={onHandleRemove}>
						<EditWrapper>{STRINGS['WITHDRAW_PAGE.REMOVE_TAG']}</EditWrapper>
					</Button>
				</div>
			</div>
		);
	};

	// const renderScanIcon = () => {
	//  return (
	//      <div className="render-scan-wrapper d-flex">
	//          <span className="suffix-text">
	//              {renderLabel('ACCORDIAN.SCAN')}
	//          </span>
	//          <div className="img-wrapper">
	//              <img alt="scan-icon" src={STATIC_ICONS['QR_CODE_SCAN']}></img>
	//          </div>
	//      </div>
	//  );
	// };

	const isSteps = currStep.stepFour;
	// (coinLength && coinLength.length === 1) ||
	// (currStep.stepTwo && !coinLength) ||
	// currStep.stepThree;
	const withdrawFeeFormat =
		selectedMethod === 'Email'
			? 0
			: `+ ${fee} ${selectedAsset && feeCoin?.toUpperCase()} (≈ ${fee} ${
					selectedAsset && feeCoin?.toUpperCase()
			  })`;
	const estimatedFormat = `≈ ${Math.round(
		estimatedWithdrawValue
	)} ${getNativeCurrency?.toUpperCase()}`;
	const isWithdrawal = coins[getWithdrawCurrency]?.allow_withdrawal;
	const isCondition =
		(['xrp', 'xlm'].includes(selectedAsset) ||
			['xlm', 'ton'].includes(network)) &&
		selectedMethod !== 'Email';

	return (
		<div
			className={
				getWithdrawCurrency && !isWithdrawal
					? 'withdraw-deposit-disable mt-1'
					: 'mt-1'
			}
		>
			<div>
				<div className="d-flex">
					<div className="custom-field d-flex flex-column">
						<span className="custom-step-selected">1</span>
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
									placeholder="Select Method"
									onChange={onHandleChangeMethod}
									allowClear={true}
									value={selectedMethod}
								>
									{methodOptions.map((val, inx) => (
										<Option key={inx} value={val}>
											{val}
										</Option>
									))}
								</Select>
								{currStep.stepTwo && <CheckOutlined className="mt-3 ml-3" />}
							</div>
							{selectedMethod === 'Email' && (
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
					<div className="custom-field d-flex flex-column">
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
									<div className="d-flex">
										<Select
											showSearch={true}
											className="custom-select-input-style elevated select-field"
											dropdownClassName="custom-select-style"
											suffixIcon={<CaretDownOutlined />}
											placeholder="Select"
											onChange={onHandleChangeSelect}
											allowClear={true}
											value={selectedAsset}
										>
											{Object.entries(coins).map(
												([_, { symbol, fullname, icon_id }]) => (
													<Option key={symbol} value={symbol}>
														<div className="d-flex gap-1">
															<Coin iconId={icon_id} type="CS3" />
															<div>{`${fullname} (${symbol.toUpperCase()})`}</div>
														</div>
													</Option>
												)
											)}
										</Select>
										{currStep.stepTwo && (
											<CheckOutlined className="mt-3 ml-3" />
										)}
									</div>
									<div className="mt-3 d-flex">
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
													{data.toUpperCase()}
												</span>
											);
										})}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			{selectedMethod !== 'Email' && (
				<div>
					<div className="d-flex h-25">
						<div className="custom-field d-flex flex-column">
							<span
								className={`custom-step${
									currStep.stepThree ? '-selected' : ''
								}`}
							>
								3
							</span>
							<span
								className={`custom-line${
									currStep.stepThree || (selectedAsset && selectedMethod)
										? '-selected'
										: ''
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
									currStep.stepThree ? '-selected' : ''
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
									<div className="d-flex">
										<Select
											showSearch={true}
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
													? getNetworkNameByKey(network)
													: coinLength && coinLength.length > 1
													? getNetworkNameByKey(getWithdrawNetworkOptions)
													: coins[getWithdrawCurrency]?.symbol.toUpperCase()
											}
											disabled={
												(coinLength && coinLength.length === 1) ||
												!(coinLength && coinLength.length)
											}
										>
											{coinLength &&
												coinLength.map((data, inx) => (
													<Option key={inx} value={data}>
														<div className="d-flex gap-1">
															<div>
																{getNetworkNameByKey(data).toUpperCase()}
															</div>
														</div>
													</Option>
												))}
										</Select>
										{(currStep.stepThree || coinLength) && (
											<CheckOutlined className="mt-3 ml-3" />
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
			<div>
				<div className="d-flex h-25">
					<div className="custom-field d-flex flex-column">
						<span className={`custom-step${isSteps ? '-selected' : ''}`}>
							{selectedMethod === 'Email' ? 3 : 4}
						</span>
						<span
							className={`custom-line${currStep.stepFour ? '-selected' : ''}`}
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
								isSteps ? '-selected' : ''
							}`}
						>
							{renderLabel(
								selectedMethod === 'Address'
									? 'ACCORDIAN.DESTINATION'
									: 'ACCORDIAN.EMAIL'
							)}
						</div>
						{(currStep.stepThree || (selectedAsset && selectedMethod)) && (
							<div
								className={
									isMobile
										? 'd-flex flex-row select-wrapper mobile-view'
										: 'd-flex flex-row select-wrapper'
								}
							>
								{selectedMethod === 'Address' ? (
									<Input
										className="destination-input-field"
										// suffix={renderScanIcon()}
										onChange={(e) => onHandleAddress(e.target.value, 'address')}
										value={getWithdrawAddress}
									></Input>
								) : (
									<Input
										className="destination-input-field"
										onChange={(e) => onHandleAddress(e.target.value, 'email')}
									></Input>
								)}
								{currStep.stepFour && <CheckOutlined className="mt-3 ml-3" />}
							</div>
						)}
					</div>
				</div>
			</div>
			{isCondition && (
				<div>
					<div className="d-flex h-25">
						<div className="custom-field d-flex flex-column">
							<span
								className={`custom-line-extra-large ${
									currStep.stepFour ? 'custom-line-extra-large-active' : ''
								}`}
							></span>
							<span
								className={`custom-step${currStep.stepFour ? '-selected' : ''}`}
							>
								4
							</span>
							<span
								className={`custom-line${
									currStep.stepFour ? '-selected-large' : ''
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
									currStep.stepFour ? '-selected' : ''
								} ${!isCheck ? 'opacity-100' : 'opacity-50'}`}
							>
								{renderLabel('ACCORDIAN.OPTIONAL_TAG')}
							</div>
							{currStep.stepFour && (
								<div
									className={
										isMobile
											? 'd-flex select-wrapper mobile-view'
											: 'd-flex select-wrapper'
									}
								>
									<div className="d-flex justify-content-end width-80 mb-2">
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
									</div>
									<div>
										<Input
											onChange={(e) => setOptionalTag(e.target.value)}
											value={optionalTag}
											className={`destination-input-field ${
												!isCheck ? 'opacity-100' : 'opacity-30'
											}`}
											type={
												selectedAsset === 'xrp' || selectedAsset === 'xlm'
													? 'number'
													: 'text'
											}
											disabled={isCheck}
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
			<Modal
				title="Remove Tag"
				visible={isVisible}
				onCancel={() => setIsVisible(false)}
				footer={false}
				className="withdrawal-remove-tag-modal"
			>
				{renderRemoveTag()}
			</Modal>
			<div>
				<div className="d-flex h-25">
					<div className="custom-field d-flex flex-column">
						<span
							className={`custom-step${currStep.stepFour ? '-selected' : ''}`}
						>
							{isCondition ? 6 : selectedMethod === 'Email' ? 4 : 5}
						</span>
						<span
							className={currStep.stepFour ? 'custom-line-selected-end' : ''}
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
							{currStep.stepFour && (
								<span className="amount-field-icon">
									<Coin iconId={iconId} type="CS4" />
								</span>
							)}
							{currStep.stepFour && (
								<span
									className={`ml-2 withdraw-main-label${
										currStep.stepFour ? '-selected' : ''
									}`}
								>
									{getWithdrawCurrency.toUpperCase()}
								</span>
							)}
							<div
								className={`ml-1 withdraw-main-label${
									currStep.stepFour ? '-selected' : ''
								}`}
							>
								{renderLabel('ACCORDIAN.AMOUNT')}
							</div>
						</div>
						{currStep.stepFour && (
							<div
								className={
									isMobile
										? 'd-flex flex-column select-wrapper mobile-view'
										: 'd-flex flex-column select-wrapper'
								}
							>
								<div className="d-flex">
									<Input
										disabled={maxAmount === 0}
										onChange={(e) => onHandleAmount(e.target.value)}
										value={getWithdrawAmount}
										className="destination-input-field"
										suffix={renderAmountIcon()}
										type="number"
									></Input>
									{!isAmount && <CheckOutlined className="mt-3 ml-3" />}
								</div>
								{currStep.stepFour && (
									<div
										className={`d-flex h-25 ${
											!isMobile ? 'bottom-wrapper' : ''
										}`}
									>
										<div className="custom-field d-flex flex-column line-wrapper">
											<span
												className={
													currStep.stepFour ? 'custom-line-selected-end' : ''
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
								{currStep.stepFour && (
									<div className="d-flex h-25 bottom-btn-wrapper">
										{isCondition && (
											<div className="custom-field d-flex flex-column line-wrapper">
												<span
													className={
														currStep.stepFour ? 'custom-line-selected-end' : ''
													}
												></span>
											</div>
										)}
										{isCondition && (
											<span className="cross-line-selected"></span>
										)}
										<div className="withdraw-btn-wrapper">
											<Button
												disabled={''}
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
});

export default connect(mapStateToForm, mapDispatchToProps)(RenderWithdraw);
