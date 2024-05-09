import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Input, Select } from 'antd';
import { Coin } from 'components';
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
	withdrawAddress,
	withdrawAmount,
	withdrawCurrency,
	withdrawNetwork,
	withdrawNetworkOptions,
} from 'actions/appActions';
import { getPrices } from 'actions/assetActions';
import { renderEstimatedValueAndFee, renderWithdrawlabel } from './utils';
import { validAddress } from 'components/Form/validations';

const RenderWithdraw = ({
	coins,
	UpdateCurrency,
	onOpenDialog,
	assets,
	pinnedAssets,
	...rest
}) => {
	const { Option } = Select;

	const [currStep, setCurrStep] = useState({
		stepOne: false,
		stepTwo: false,
		stepThree: false,
		stepFour: false,
	});
	const [maxAmount, setMaxAmount] = useState(0);
	const [topAssets, setTopAssets] = useState([]);
	const [selectedAsset, setSelectedAsset] = useState('');
	const [prices, setPrices] = useState({});

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

	const curretPrice = prices[getWithdrawCurrency];
	const estimatedWithdrawValue = curretPrice * getWithdrawAmount;
	const fee =
		selectedAsset &&
		coins[selectedAsset].withdrawal_fees &&
		Object.keys(coins[selectedAsset]?.withdrawal_fees).length &&
		coins[selectedAsset].withdrawal_fees[selectedAsset]?.value
			? coins[selectedAsset].withdrawal_fees[selectedAsset]?.value
			: selectedAsset &&
			  coins[selectedAsset].withdrawal_fees &&
			  Object.keys(coins[selectedAsset]?.withdrawal_fees).length &&
			  coins[selectedAsset].withdrawal_fees[getWithdrawNetworkOptions]?.value
			? coins[selectedAsset].withdrawal_fees[getWithdrawNetworkOptions]?.value
			: selectedAsset && coins[selectedAsset].withdrawal_fee
			? coins[selectedAsset]?.withdrawal_fee
			: 0;

	const isAmount = useMemo(() => {
		return (
			!getWithdrawAddress ||
			!getWithdrawCurrency ||
			getWithdrawAmount <= 0 ||
			getWithdrawAmount > maxAmount ||
			maxAmount <= 0 ||
			!network
		);
	}, [
		getWithdrawAddress,
		getWithdrawCurrency,
		getWithdrawAmount,
		maxAmount,
		network,
	]);

	const currentNetwork =
		getWithdrawNetworkOptions !== '' ? getWithdrawNetworkOptions : network;

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

	const getOraclePrices = async () => {
		try {
			const prices = await getPrices({ coins });
			setPrices(prices);
		} catch (error) {
			console.error(error);
		}
	};

	const onHandleChangeSelect = (val) => {
		if (val) {
			if (currStep.stepTwo || currStep.stepThree || currStep.stepFour) {
				setCurrStep((prev) => ({
					...prev,
					stepTwo: false,
					stepThree: false,
					stepFour: false,
				}));
			}
			setCurrStep((prev) => ({ ...prev, stepTwo: true }));
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
		getOraclePrices();
	};

	const onHandleChangeNetwork = (val) => {
		if (val) {
			setCurrStep((prev) => ({ ...prev, stepThree: true }));
			setWithdrawNetworkOptions(val);
		} else if (!val) {
			setCurrStep((prev) => ({ ...prev, stepThree: false, stepFour: false }));
		}
	};

	const onHandleAddress = (val) => {
		const isValid = validAddress(
			getWithdrawCurrency,
			STRINGS[`WITHDRAWALS_${selectedAsset.toUpperCase()}_INVALID_ADDRESS`],
			currentNetwork
		);
		if (val) {
			setCurrStep((prev) => ({ ...prev, stepFour: true }));
			setWithdrawAddress(val);
		} else if (!val) {
			setCurrStep((prev) => ({ ...prev, stepFour: false }));
		}
		setIsValidAdress({ isValid: isValid() });
	};

	const onHandleAmount = (val) => {
		setWithdrawAmount(val);
	};

	const renderAmountIcon = () => {
		return (
			<div
				onClick={() => getWithdrawlMAx(getWithdrawCurrency, true)}
				className="d-flex render-amount-icon-wrapper"
			>
				<span className="suffix-text">
					{renderWithdrawlabel('CALCULATE_MAX')}
				</span>
				<div className="img-wrapper">
					<img alt="max-icon" src={STATIC_ICONS['MAX_ICON']} />
				</div>
			</div>
		);
	};

	const renderScanIcon = () => {
		return (
			<div className="render-scan-wrapper d-flex">
				<span className="suffix-text">
					{renderWithdrawlabel('ACCORDIAN.SCAN')}
				</span>
				<div className="img-wrapper">
					<img alt="scan-icon" src={STATIC_ICONS['QR_CODE_SCAN']}></img>
				</div>
			</div>
		);
	};

	const isSteps =
		(coinLength && coinLength.length === 1) ||
		(currStep.stepTwo && !coinLength) ||
		currStep.stepThree;
	const withdrawFeeFormat = `(≈ ${fee} ${getWithdrawCurrency?.toUpperCase()})`;
	const estimatedFormat = `≈ ${Math.round(
		estimatedWithdrawValue
	)} ${getWithdrawCurrency?.toUpperCase()}`;

	return (
		<div className="mt-5">
			<div className="d-flex justify-content-between">
				<div className="d-flex">
					<div className="custom-field d-flex flex-column">
						<span className="custom-step-selected">1</span>
						<span
							className={`custom-line${currStep.stepTwo ? '-selected' : ''}`}
						></span>
					</div>
					<div className="mt-2 ml-5 withdraw-main-label-selected">
						{renderWithdrawlabel('ACCORDIAN.SELECT_ASSET')}
					</div>
				</div>
				<div className="select-wrapper">
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
						{currStep.stepTwo && <CheckOutlined className="mt-3 ml-3" />}
					</div>
					<div className="mt-2 d-flex">
						{topAssets.map((data, inx) => {
							return (
								<span
									key={inx}
									className={`currency-label ${
										selectedAsset === data ? 'opacity-100' : 'opacity-30'
									}`}
									onClick={() => onHandleChangeSelect(data)}
								>
									{data}
								</span>
							);
						})}
					</div>
				</div>
			</div>
			<div className="d-flex justify-content-between">
				<div className="d-flex h-25">
					<div className="custom-field d-flex flex-column">
						<span
							className={`custom-step${currStep.stepTwo ? '-selected' : ''}`}
						>
							2
						</span>
						<span
							className={`custom-line${
								(coinLength && coinLength.length === 1) ||
								(currStep.stepTwo && !coinLength) ||
								currStep.stepThree ||
								currStep.stepTwo
									? '-selected'
									: ''
							}`}
						></span>
					</div>
					<div
						className={`mt-2 ml-5 withdraw-main-label${
							currStep.stepTwo ? '-selected' : ''
						}`}
					>
						{renderWithdrawlabel('ACCORDIAN.SELECT_NETWORK')}
					</div>
				</div>
				{currStep.stepTwo && (
					<div className="select-wrapper">
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
									coinLength && coinLength.length <= 1
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
									coinLength.map((data) => (
										<Option value={data}>
											<div className="d-flex gap-1">
												<div>{getNetworkNameByKey(data).toUpperCase()}</div>
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
								{renderWithdrawlabel('DEPOSIT_FORM_NETWORK_WARNING')}
							</div>
						</div>
					</div>
				)}
			</div>
			<div className="d-flex justify-content-between">
				<div className="d-flex h-25">
					<div className="custom-field d-flex flex-column">
						<span className={`custom-step${isSteps ? '-selected' : ''}`}>
							3
						</span>
						<span
							className={`custom-line${currStep.stepFour ? '-selected' : ''}`}
						></span>
					</div>
					<div
						className={`mt-2 ml-5 withdraw-main-label${
							isSteps ? '-selected' : ''
						}`}
					>
						{renderWithdrawlabel('ACCORDIAN.DESTINATION')}
					</div>
				</div>
				{((coinLength && coinLength.length === 1) ||
					(currStep.stepTwo && !coinLength) ||
					currStep.stepThree) && (
					<div className="d-flex flex-row select-wrapper">
						<Input
							className="destination-input-field"
							suffix={renderScanIcon()}
							onChange={(e) => onHandleAddress(e.target.value)}
						></Input>
						{currStep.stepFour && <CheckOutlined className="mt-3 ml-3" />}
					</div>
				)}
			</div>
			<div className="d-flex justify-content-between">
				<div className="d-flex h-25">
					<div className="custom-field d-flex flex-column">
						<span
							className={`custom-step${currStep.stepFour ? '-selected' : ''}`}
						>
							4
						</span>
					</div>
					<div className="d-flex">
						<div className=" d-flex mt-2 ml-5">
							<Coin iconId={iconId} type="CS4" />
							<span
								className={`ml-2 withdraw-main-label${
									currStep.stepFour ? '-selected' : ''
								}`}
							>
								{getWithdrawCurrency.toUpperCase()}
							</span>
						</div>
						<div
							className={`mt-2 ml-1 withdraw-main-label${
								currStep.stepFour ? '-selected' : ''
							}`}
						>
							{renderWithdrawlabel('ACCORDIAN.AMOUNT')}
						</div>
					</div>
				</div>
				{currStep.stepFour && (
					<div className="d-flex flex-row select-wrapper">
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
				)}
			</div>
			{currStep.stepFour && (
				<div className="bottom-content">
					{renderEstimatedValueAndFee(
						renderWithdrawlabel,
						'ACCORDIAN.ESTIMATED',
						estimatedFormat
					)}
					<span>--</span>
					{renderEstimatedValueAndFee(
						renderWithdrawlabel,
						'ACCORDIAN.TRANSACTION_FEE',
						withdrawFeeFormat
					)}
				</div>
			)}
			{currStep.stepFour && (
				<div className="withdraw-btn-wrapper">
					<Button disabled={isAmount} onClick={onOpenDialog} className="mb-3">
						{STRINGS['WITHDRAWALS_BUTTON_TEXT'].toUpperCase()}
					</Button>
				</div>
			)}
		</div>
	);
};

const mapStateToForm = (state) => ({
	getWithdrawCurrency: state.app.withdrawFields.withdrawCurrency,
	getWithdrawNetwork: state.app.withdrawFields.withdrawNetwork,
	getWithdrawNetworkOptions: state.app.withdrawFields.withdrawNetworkOptions,
	getWithdrawAddress: state.app.withdrawFields.withdrawAddress,
	getWithdrawAmount: state.app.withdrawFields.withdrawAmount,
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
});

export default connect(mapStateToForm, mapDispatchToProps)(RenderWithdraw);
