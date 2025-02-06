import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isMobile } from 'react-device-detect';
import { Link } from 'react-router';
import { Button, Input, Select } from 'antd';
import BigNumber from 'bignumber.js';
import math from 'mathjs';

import { Coin, EditWrapper } from 'components';
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
	networkList,
	onHandleSymbol,
	renderEstimatedValueAndFee,
	renderLabel,
	renderNetworkField,
	renderNetworkWithLabel,
	renderScanIcon,
} from './utils';
import { email, validAddress } from 'components/Form/validations';
import { getAddressBookDetails } from 'containers/Wallet/actions';
import { getDecimals, handlePopupContainer } from 'utils/utils';
import { roundNumber, toFixed } from 'utils/currency';
import { BASE_CURRENCY } from 'config/constants';
import { setScannedAddress } from 'actions/walletActions';

const RenderWithdraw = ({
	coins,
	UpdateCurrency,
	onOpenDialog,
	assets,
	pinnedAssets,
	router,
	onHandleScan,
	selectedNetwork,
	optionalTag,
	...rest
}) => {
	const { Option } = Select;
	const methodOptions = [
		STRINGS['WITHDRAW_PAGE.WITHDRAWAL_CONFIRM_ADDRESS'],
		STRINGS['FORM_FIELDS.EMAIL_LABEL'],
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
	const [selectedAddress, setSelectedAddress] = useState([]);
	const [prices, setPrices] = useState({});
	const [selectedAsset, setSelectedAsset] = useState({
		selectedCurrency: null,
		networkData: null,
		addressField: null,
	});
	const [isValidField, setIsValidField] = useState({
		isPinnedAssets: false,
		isValidEmail: false,
		isDisbaleWithdraw: false,
		isSelected: false,
		dropdownOpen: false,
		isOptionalTag: false,
	});
	const hasTag = ['xrp', 'xlm', 'ton', 'pmn'];
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
		selectedMethod,
		setSelectedMethod,
		setReceiverEmail,
		receiverWithdrawalEmail,
		setWithdrawOptionaltag,
		scannedAddress,
		setScannedAddress,
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
		selectedMethod === STRINGS['FORM_FIELDS.EMAIL_LABEL']
			? 0
			: calculateFee(
					selectedAsset?.selectedCurrency,
					getWithdrawNetworkOptions,
					coins
			  );
	const feeCoin = calculateFeeCoin(
		selectedAsset?.selectedCurrency,
		getWithdrawNetworkOptions,
		coins
	);

	const feeMarkup =
		selectedAsset?.selectedCurrency &&
		coin_customizations?.[selectedAsset?.selectedCurrency]?.fee_markup;
	if (feeMarkup) {
		const incrementUnit =
			coins?.[selectedAsset?.selectedCurrency]?.increment_unit;
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
	const isValidUserEmail = isValidField?.isValidEmail;
	const { selectedCurrency } = selectedAsset;

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
		const getAddress = async () => {
			try {
				const res = await getAddressBookDetails();
				setSelectedAddress([res]);
			} catch (err) {
				console.error(err);
			}
		};
		getAddress();
		if (defaultCurrency) {
			setSelectedAsset((prev) => ({
				...prev,
				selectedCurrency: defaultCurrency,
			}));
			setWithdrawCurrency(defaultCurrency);
			if (coinLength?.length > 1) {
				setCurrStep({ ...currStep, stepTwo: true });
			}
			setCurrStep({ ...currStep, stepTwo: true, stepThree: true });
			setWithdrawOptionaltag(null);
		} else {
			setSelectedAsset((prev) => ({ ...prev, selectedCurrency: null }));
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
			setIsValidField((prev) => ({ ...prev, isValidEmail: false }));
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (getWithdrawCurrency && !isWithdrawal) {
			setSelectedAsset((prev) => ({ ...prev, selectedCurrency: '' }));
			setIsValidField((prev) => ({ ...prev, isDisbaleWithdraw: true }));
			setCurrStep({
				stepOne: true,
				stepTwo: true,
				stepThree: false,
				stepFour: false,
				stepFive: false,
			});
		} else {
			setIsValidField((prev) => ({ ...prev, isDisbaleWithdraw: false }));
		}
	}, [getWithdrawCurrency, isWithdrawal]);

	useEffect(() => {
		const networkOption = defaultNetwork?.split(',')?.length;
		if (defaultCurrency) {
			if (
				selectedCurrency &&
				(selectedMethod === 'Email' ||
					networkOption <= 1 ||
					selectedAsset?.networkData)
			) {
				getWithdrawMAx(defaultCurrency);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getWithdrawNetworkOptions, selectedMethod, selectedCurrency]);

	useEffect(() => {
		if (
			scannedAddress &&
			scannedAddress?.length &&
			scannedAddress !== STRINGS['QR_CODE.NOT_FOUND'] &&
			scannedAddress !== STRINGS['QR_CODE.NO_RESULT'] &&
			scannedAddress !== STRINGS['QR_CODE.PERMISSION_DENIED']
		) {
			onHandleAddress(scannedAddress, 'address');
		}
		return () => {
			setScannedAddress('');
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [scannedAddress]);

	const isAmount = useMemo(() => {
		const isCondition =
			selectedMethod === STRINGS['FORM_FIELDS.EMAIL_LABEL']
				? !isValidField?.isValidEmail
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
		isValidUserEmail,
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
				selectedMethod === STRINGS['FORM_FIELDS.EMAIL_LABEL']
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
		setScannedAddress('');
		setWithdrawAmount('');
		setReceiverEmail('');
		setWithdrawOptionaltag(null);
		setSelectedMethod(method);
		setCurrStep((prev) => ({ ...prev, stepTwo: true }));
		setIsValidAdress(false);
		setIsValidField((prev) => ({
			...prev,
			isValidEmail: false,
			isOptionalTag: false,
		}));
		setSelectedAsset((prev) => ({ ...prev, addressField: null }));
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
			setIsValidField((prev) => ({ ...prev, isPinnedAssets: pinned_assets }));
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
			setWithdrawNetworkOptions('');
			setIsValidAdress(false);
			setIsValidField((prev) => ({ ...prev, isValidEmail: false }));
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
		setSelectedAsset((prev) => ({
			...prev,
			selectedCurrency:
				val && coins[val] && coins[val].allow_withdrawal ? val : '',
			addressField: null,
		}));
		setWithdrawAddress('');
		setScannedAddress('');
		setReceiverEmail('');
		setWithdrawOptionaltag(null);
		setIsValidField((prev) => ({ ...prev, isOptionalTag: false }));
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
			setWithdrawNetworkOptions(renderNetworkField(val));
			setSelectedAsset((prev) => ({ ...prev, networkData: val }));
		} else if (!val) {
			setCurrStep((prev) => ({ ...prev, stepFour: false, stepFive: false }));
		}
		setWithdrawAddress(null);
		setScannedAddress('');
		setIsValidAdress(false);
		setWithdrawOptionaltag(null);
		setSelectedAsset((prev) => ({ ...prev, addressField: null }));
		setIsValidField((prev) => ({ ...prev, isOptionalTag: false }));
	};

	const onHandleAddress = (val, method) => {
		const isValid = validAddress(
			getWithdrawCurrency,
			STRINGS[
				`WITHDRAWALS_${selectedAsset?.selectedCurrency?.toUpperCase()}_INVALID_ADDRESS`
			],
			currentNetwork,
			val
		)();

		if (method === 'email') {
			const validate = email(val);
			if (!validate) {
				setIsValidField((prev) => ({ ...prev, isValidEmail: true }));
			} else {
				setIsValidField((prev) => ({ ...prev, isValidEmail: false }));
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
		setWithdrawOptionaltag(null);
	};

	const onHandleAmount = (val) => {
		if (val >= 0) {
			const curr = defaultCurrency
				? defaultCurrency
				: selectedAsset?.selectedCurrency;
			const { increment_unit, min } = coins[curr];
			let decimal = getDecimals(increment_unit);
			let decValue = toFixed(val);
			let valueDecimal = getDecimals(decValue);
			let result = val;
			if (decimal < valueDecimal) {
				const newValue = decValue
					.toString()
					.substring(0, decValue.toString().length - (valueDecimal - decimal));
				result = roundNumber(val, 8);
				if (math.larger(newValue, min)) {
					result = parseFloat(newValue);
				}
			}
			setWithdrawAmount(result);
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
		if (value === '') {
			setIsValidField((prev) => ({ ...prev, isOptionalTag: true }));
		}
		setWithdrawOptionaltag(value);
	};

	const onHandleClear = (type) => {
		if (type === 'coin') {
			setWithdrawCurrency('');
			setSelectedAsset((prev) => ({
				...prev,
				selectedCurrency: null,
				addressField: null,
			}));
		}
		if (type === 'network') {
			setWithdrawAddress(null);
			setScannedAddress('');
			setWithdrawNetworkOptions('');
			setSelectedAsset((prev) => ({
				...prev,
				networkData: null,
				addressField: null,
			}));
		}
		if (type === 'address') {
			setSelectedAsset((prev) => ({ ...prev, addressField: null }));
		}
		setCurrStep({
			...currStep,
			stepThree: false,
			stepFour: false,
			stepFive: false,
		});
		setWithdrawOptionaltag(null);
		setIsValidAdress(false);
		setIsValidField((prev) => ({
			...prev,
			isValidEmail: false,
			isOptionalTag: false,
		}));
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

	const handleDropdownVisibleChange = (open) => {
		setIsValidField((prev) => ({ ...prev, dropdownOpen: open }));
	};

	const onchangeAddressField = (val) => {
		if (val) {
			if (val === STRINGS['WITHDRAW_PAGE.NEW_ADDRESS']) {
				setWithdrawOptionaltag(null);
				setWithdrawAddress(null);
				setScannedAddress('');
				setIsValidAdress(false);
			}
			if (val !== STRINGS['WITHDRAW_PAGE.NEW_ADDRESS']) {
				const optionValue = val.split(',');
				setIsValidField((prev) => ({ ...prev, isSelected: true }));
				onHandleAddress(optionValue[0], 'address');
				if (isCondition && optionValue?.length > 1) {
					setWithdrawOptionaltag(optionValue[1]);
				}
			}
			if (val === STRINGS['ADDRESS_BOOK.VIEW_ADDRESS_BOOK_LABEL']) {
				setWithdrawOptionaltag(null);
				return router.push('/wallet/address-book');
			}
		}
		setSelectedAsset((prev) => ({ ...prev, addressField: val }));
		setIsValidField((prev) => ({
			...prev,
			isOptionalTag: false,
			dropdownOpen: false,
		}));
	};

	const withdrawFeeFormat =
		selectedMethod === STRINGS['FORM_FIELDS.EMAIL_LABEL']
			? 0
			: `+ ${fee} ${
					(getWithdrawCurrency || currency) && feeCoin?.toUpperCase()
			  }`;

	const incrementUnit = coins[BASE_CURRENCY].increment_unit;
	const decimalPoint = new BigNumber(incrementUnit).dp();
	const estimatedFormat = `≈ ${new BigNumber(estimatedWithdrawValue)
		.decimalPlaces(decimalPoint)
		.toNumber()} ${BASE_CURRENCY?.toUpperCase()}`;

	const isCondition =
		(['xrp', 'xlm'].includes(selectedAsset?.selectedCurrency) ||
			['xlm', 'ton'].includes(
				coinLength &&
					coinLength.length > 1 &&
					getWithdrawNetworkOptions &&
					getWithdrawNetworkOptions
					? renderNetworkField(selectedAsset?.networkData)
					: network
			)) &&
		selectedMethod !== STRINGS['FORM_FIELDS.EMAIL_LABEL'];
	const isEmailAndAddress =
		coinLength &&
		coinLength?.length > 1 &&
		selectedMethod !== STRINGS['FORM_FIELDS.EMAIL_LABEL']
			? getWithdrawNetworkOptions !== null
			: currStep.stepThree ||
			  (selectedAsset?.selectedCurrency && selectedMethod);
	const renderNetwork =
		coinLength &&
		coinLength?.length > 1 &&
		selectedMethod !== STRINGS['FORM_FIELDS.EMAIL_LABEL']
			? getWithdrawNetworkOptions
			: true;
	const renderAmountField =
		(selectedMethod === STRINGS['FORM_FIELDS.EMAIL_LABEL'] &&
			isValidField?.isValidEmail) ||
		((selectedMethod === STRINGS['WITHDRAW_PAGE.WITHDRAWAL_CONFIRM_ADDRESS'] ||
			(selectedMethod && selectedMethod === 'Address')) &&
			isValidAddress);
	const isErrorMaxAmountField = getWithdrawAmount > maxAmount && maxAmount > 0;
	const minAmount = defaultCurrency
		? coins[defaultCurrency]?.min
		: coins[selectedAsset && selectedAsset?.selectedCurrency]?.min;
	const isErrorMinAmountField =
		getWithdrawAmount && getWithdrawAmount < minAmount && minAmount > 0;
	const networkIcon = selectedNetwork
		? coins[selectedNetwork]?.icon_id
		: coins[defaultNetwork]?.icon_id;
	const networkOptionsIcon = coins[getWithdrawNetworkOptions]?.icon_id;
	const getAddress = [];
	(function onGetAddress() {
		return selectedAddress?.filter((data) =>
			data?.addresses?.filter((item) =>
				coinLength?.length === 1 &&
				item?.currency === selectedAsset?.selectedCurrency
					? getAddress.push(item)
					: coinLength?.length > 1 &&
					  item?.currency === selectedAsset?.selectedCurrency &&
					  item?.network === getWithdrawNetworkOptions
					? getAddress.push(item)
					: null
			)
		);
	})();

	const selectAddressField = [
		{
			value: STRINGS['WITHDRAW_PAGE.NEW_ADDRESS'],
			label: STRINGS['WITHDRAW_PAGE.NEW_ADDRESS'],
		},
		...(getAddress?.map((addressObj) => {
			const splitAddress = addressObj?.address?.split(':');
			return {
				value: splitAddress && splitAddress,
				label: (
					<div className="d-flex asset-address-field">
						<span>{addressObj?.label}</span>
						<div className="d-flex flex-direction-column address-text">
							<span>: {splitAddress && splitAddress[0]}</span>
							{splitAddress &&
								splitAddress.length > 1 &&
								isCondition &&
								(!isValidField?.isSelected || isValidField?.dropdownOpen) && (
									<div className="assets-field">
										<div className="ml-2">
											<EditWrapper stringId="ACCORDIAN.TAG">
												{STRINGS['ACCORDIAN.TAG']}
											</EditWrapper>
											<span className="ml-1">{splitAddress[1]}</span>
										</div>
									</div>
								)}
						</div>
					</div>
				),
			};
		}) || []),
		{
			value: STRINGS['ADDRESS_BOOK.VIEW_ADDRESS_BOOK_LABEL'],
			label: STRINGS['ADDRESS_BOOK.VIEW_ADDRESS_BOOK_LABEL'],
		},
	];

	const currencyNetwork = (network) => {
		return (
			coins[selectedAsset?.selectedCurrency]?.withdrawal_fees &&
			coins[selectedAsset?.selectedCurrency]?.withdrawal_fees[network]
		);
	};

	const selectedAssetNetwork =
		coinLength?.length > 1
			? renderNetworkField(selectedAsset?.networkData)
			: network;
	const isActiveWithdrawNetwork = currencyNetwork(selectedAssetNetwork);
	return (
		<div
			className={
				isValidField?.isDisbaleWithdraw
					? 'withdraw-deposit-disable mt-1'
					: 'mt-1'
			}
		>
			<div>
				<div className="d-flex">
					<div className="custom-field d-flex flex-column align-items-center">
						<span className="custom-step-selected">1</span>
						<span
							className={`custom-line${currStep.stepTwo ? '-selected' : ''} ${
								selectedMethod ===
									STRINGS['WITHDRAW_PAGE.WITHDRAWAL_CONFIRM_ADDRESS'] &&
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
									placeholder={STRINGS['WITHDRAW_PAGE.METHOD_FIELD_LABEL']}
									onChange={onHandleChangeMethod}
									value={
										selectedMethod === 'Address'
											? STRINGS['WITHDRAW_PAGE.WITHDRAWAL_CONFIRM_ADDRESS']
											: selectedMethod
									}
									getPopupContainer={handlePopupContainer}
								>
									{methodOptions.map((val, inx) => (
										<Option key={inx} value={val}>
											{val}
										</Option>
									))}
								</Select>
								{currStep.stepTwo && <CheckOutlined className="mt-3 ml-3" />}
							</div>
							{selectedMethod === STRINGS['FORM_FIELDS.EMAIL_LABEL'] && (
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
														selectedAsset?.selectedCurrency === data
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
											placeholder={STRINGS['WITHDRAW_PAGE.SELECT']}
											allowClear={
												selectedAsset?.selectedCurrency ? true : false
											}
											value={
												selectedAsset?.selectedCurrency &&
												`${
													coins[selectedAsset?.selectedCurrency].fullname
												} (${selectedAsset?.selectedCurrency.toUpperCase()})`
											}
											onClear={() => onHandleClear('coin')}
											onSelect={(e) => {
												const curr = onHandleSymbol(e);
												onHandleChangeSelect(curr);
											}}
											getPopupContainer={handlePopupContainer}
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
										{selectedMethod === STRINGS['FORM_FIELDS.EMAIL_LABEL'] ? (
											isEmailAndAddress && renderNetwork ? (
												<CheckOutlined className="mt-3 ml-3" />
											) : (
												<CloseOutlined className="mt-3 ml-3" />
											)
										) : currStep.stepThree ||
										  (selectedAsset?.selectedCurrency && selectedMethod) ? (
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
			{selectedMethod !== STRINGS['FORM_FIELDS.EMAIL_LABEL'] && (
				<div>
					<div className="d-flex h-25">
						<div className="custom-field d-flex flex-column align-items-center">
							<span
								className={`custom-step${
									isEmailAndAddress || selectedAsset?.selectedCurrency
										? '-selected'
										: ''
								}`}
							>
								3
							</span>
							<span
								className={`custom-line${
									currStep.stepThree ||
									(selectedAsset?.selectedCurrency && selectedMethod)
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
									currStep.stepThree ||
									(selectedAsset?.selectedCurrency && selectedMethod)
										? '-selected'
										: ''
								}`}
							>
								{renderLabel('ACCORDIAN.SELECT_NETWORK')}
							</div>
							{(currStep.stepThree ||
								(selectedAsset?.selectedCurrency && selectedMethod)) && (
								<div
									className={
										isMobile ? 'select-wrapper mobile-view' : 'select-wrapper'
									}
								>
									<div
										className={
											coinLength?.length === 1 &&
											isActiveWithdrawNetwork?.active === false
												? 'd-flex withdraw-network-field select-field-disabled'
												: 'd-flex withdraw-network-field'
										}
									>
										<Select
											showSearch={true}
											placeholder={STRINGS['WITHDRAW_PAGE.SELECT']}
											className={`custom-select-input-style elevated ${
												coinLength && coinLength.length > 1
													? 'select-field'
													: 'disabled'
											}`}
											dropdownClassName="custom-select-style withdraw-selected-network"
											suffixIcon={<CaretDownOutlined />}
											allowClear={selectedAsset?.networkData ? true : false}
											onChange={onHandleChangeNetwork}
											value={
												defaultCurrency &&
												!isValidField?.isPinnedAssets &&
												coinLength?.length < 1 ? (
													defaultNetwork
												) : coinLength && coinLength.length <= 1 ? (
													getWithdrawNetworkOptions &&
													getWithdrawNetworkOptions ? (
														<span className="d-flex">
															{selectedAsset?.networkData}
															{coins[network] &&
															currencyNetwork(selectedAsset?.networkData)
																?.active !== false ? (
																<span className="ml-1 secondary-text">
																	(
																	<span>
																		{calculateFee(
																			selectedAsset?.selectedCurrency,
																			selectedAsset?.networkData,
																			coins
																		)}
																	</span>
																	<span className="ml-1">
																		{calculateFeeCoin(
																			selectedAsset?.selectedCurrency,
																			selectedAsset?.networkData,
																			coins
																		)?.toUpperCase()}
																	</span>
																	)
																</span>
															) : (
																<EditWrapper stringId="LEVELS.BLOCKED">
																	<span className="ml-1 secondary-text">
																		({STRINGS['LEVELS.BLOCKED']})
																	</span>
																</EditWrapper>
															)}
														</span>
													) : (
														<span className="d-flex">
															{renderNetworkWithLabel(networkIcon, network)}
															{coins[network] &&
															currencyNetwork(network)?.active !== false ? (
																<span className="ml-1 secondary-text">
																	(
																	<span>
																		{calculateFee(
																			selectedAsset?.selectedCurrency,
																			network,
																			coins
																		)}
																	</span>
																	<span className="ml-1">
																		{calculateFeeCoin(
																			selectedAsset?.selectedCurrency,
																			network,
																			coins
																		)?.toUpperCase()}
																	</span>
																	)
																</span>
															) : (
																<EditWrapper stringId="LEVELS.BLOCKED">
																	<span className="ml-1 secondary-text">
																		({STRINGS['LEVELS.BLOCKED']})
																	</span>
																</EditWrapper>
															)}
														</span>
													)
												) : coinLength && coinLength.length > 1 ? (
													getWithdrawNetworkOptions &&
													getWithdrawNetworkOptions ? (
														selectedAsset?.networkData
													) : (
														renderNetworkWithLabel(
															networkOptionsIcon,
															getWithdrawNetworkOptions
														)
													)
												) : (
													coins[getWithdrawCurrency]?.symbol.toUpperCase()
												)
											}
											disabled={
												(coinLength && coinLength.length === 1) ||
												!(coinLength && coinLength.length)
											}
											onClear={() => onHandleClear('network')}
											getPopupContainer={handlePopupContainer}
										>
											{coinLength?.length === 1 &&
												coinLength &&
												coinLength.map((data, inx) => {
													const getSelectedSymbol = renderNetworkField(
														data?.network
													);
													const isActiveNetwork =
														currencyNetwork(getSelectedSymbol)?.active !==
														false;
													return (
														<Option
															key={inx}
															value={data}
															disabled={!isActiveNetwork}
														>
															<div className="d-flex withdraw-network-options">
																<div>
																	{renderNetworkWithLabel(
																		coins[data]?.icon_id,
																		data
																	)}
																</div>
																{isActiveNetwork ? (
																	<span className="secondary-text">
																		{calculateFee(
																			selectedAsset?.selectedCurrency,
																			data,
																			coins
																		)}
																		<span className="ml-1">
																			{calculateFeeCoin(
																				selectedAsset?.selectedCurrency,
																				data,
																				coins
																			)?.toUpperCase()}
																		</span>
																	</span>
																) : (
																	<EditWrapper stringId="LEVELS.BLOCKED">
																		<span className="ml-1 secondary-text">
																			({STRINGS['LEVELS.BLOCKED']})
																		</span>
																	</EditWrapper>
																)}
															</div>
														</Option>
													);
												})}
											{coinLength &&
												coinLength?.length > 1 &&
												networkList.map((data, inx) => {
													const coin = data.iconId.split('_');
													const getSelectedSymbol = renderNetworkField(
														data?.network
													);
													const isActiveNetwork =
														currencyNetwork(getSelectedSymbol)?.active !==
														false;

													return coinLength.map((coinData, coinInx) => {
														if (coinData === coin[0]?.toLowerCase()) {
															return (
																<Option
																	key={`${inx}-${coinInx}`}
																	value={data?.network}
																	disabled={!isActiveNetwork}
																>
																	<div className="d-flex withdraw-network-options w-100">
																		<div
																			className={
																				isActiveNetwork
																					? 'd-flex important-text'
																					: 'd-flex secondary-text'
																			}
																		>
																			{data?.network}
																			<div className="ml-2 mt-1">
																				<Coin
																					iconId={data.iconId}
																					type="CS2"
																					className="mt-2 withdraw-network-icon"
																				/>
																			</div>
																		</div>
																		{isActiveNetwork ? (
																			<span className="secondary-text">
																				{calculateFee(
																					selectedAsset?.selectedCurrency,
																					getSelectedSymbol,
																					coins
																				)}
																				<span className="ml-1">
																					{calculateFeeCoin(
																						selectedAsset?.selectedCurrency,
																						getSelectedSymbol,
																						coins
																					)?.toUpperCase()}
																				</span>
																			</span>
																		) : (
																			<EditWrapper stringId="LEVELS.BLOCKED">
																				<span className="ml-1 secondary-text">
																					({STRINGS['LEVELS.BLOCKED']})
																				</span>
																			</EditWrapper>
																		)}
																	</div>
																</Option>
															);
														}
														return null;
													});
												})}
										</Select>
										{selectedMethod !== STRINGS['FORM_FIELDS.EMAIL_LABEL'] &&
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
					hasTag.includes(getWithdrawCurrency) &&
					selectedMethod &&
					selectedMethod !== STRINGS['FORM_FIELDS.EMAIL_LABEL'] &&
					'destination-field'
				} ${isMobile && isMobile && 'destination-field-mobile'}`}
			>
				<div className="d-flex h-25 ">
					<div
						className={`custom-field d-flex flex-column align-items-center ${
							hasTag.includes(getWithdrawCurrency) &&
							selectedMethod &&
							selectedMethod !== STRINGS['FORM_FIELDS.EMAIL_LABEL'] &&
							'destination-field'
						} ${isMobile && isMobile && 'destination-field-mobile'}`}
					>
						<span
							className={`custom-step${isEmailAndAddress ? '-selected' : ''}`}
						>
							{selectedMethod === STRINGS['FORM_FIELDS.EMAIL_LABEL'] ? 3 : 4}
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
									STRINGS['WITHDRAW_PAGE.WITHDRAWAL_CONFIRM_ADDRESS'] ||
									selectedMethod === 'Address'
									? 'ACCORDIAN.DESTINATION'
									: 'FORM_FIELDS.EMAIL_LABEL'
							)}
						</div>
						<div className="destination-field-wrapper">
							{isEmailAndAddress &&
								renderNetwork &&
								isActiveWithdrawNetwork &&
								isActiveWithdrawNetwork?.active !== false && (
									<div
										className={
											isMobile
												? 'd-flex flex-row select-wrapper mobile-view'
												: 'd-flex flex-row select-wrapper'
										}
									>
										{selectedMethod ===
											STRINGS['WITHDRAW_PAGE.WITHDRAWAL_CONFIRM_ADDRESS'] ||
										selectedMethod === 'Address' ? (
											<div className="destination-input-wrapper">
												{getAddress && getAddress?.length === 0 && (
													<Input
														className="destination-input-field destination-input-address-field"
														onChange={(e) =>
															onHandleAddress(e.target.value, 'address')
														}
														value={getWithdrawAddress}
														placeholder={
															STRINGS['WITHDRAW_PAGE.WITHDRAW_ADDRESS']
														}
														suffix={renderScanIcon(onHandleScan)}
													></Input>
												)}
												{getAddress && getAddress?.length > 0 && (
													<Select
														placeholder={STRINGS['WITHDRAW_PAGE.SELECT']}
														className="custom-select-input-style elevated select-field destination-select-field"
														dropdownClassName="custom-select-style"
														suffixIcon={<CaretDownOutlined />}
														allowClear={
															selectedAsset?.addressField ? true : false
														}
														value={selectedAsset?.addressField}
														onChange={onchangeAddressField}
														onDropdownVisibleChange={
															handleDropdownVisibleChange
														}
														onClear={() => onHandleClear('address')}
														getPopupContainer={handlePopupContainer}
													>
														{selectAddressField?.map((data) => {
															return (
																<Option key={data?.value}>
																	<div
																		className={
																			data?.value === 'View address book'
																				? 'withdraw-dropdown-address'
																				: data?.value !== 'New Address' &&
																				  data?.value !== 'View address book' &&
																				  'withdraw-dropdown-address-options'
																		}
																	>
																		{data?.label}
																	</div>
																</Option>
															);
														})}
													</Select>
												)}
												{selectedAsset.addressField === 'New Address' && (
													<div className="d-flex">
														<Input
															className="destination-input-field destination-input-address-field"
															onChange={(e) =>
																onHandleAddress(e.target.value, 'address')
															}
															value={getWithdrawAddress}
															placeholder={
																STRINGS['WITHDRAW_PAGE.WITHDRAW_ADDRESS']
															}
															suffix={renderScanIcon(onHandleScan)}
														></Input>
													</div>
												)}
												{!selectedAsset.addressField &&
													!selectedAsset.addressField && (
														<div className="blue-link address-link">
															<Link to="/wallet/address-book">
																<EditWrapper stringId="ADDRESS_BOOK.MANAGE_ADDRESS_BOOK">
																	{STRINGS['ADDRESS_BOOK.MANAGE_ADDRESS_BOOK']}
																</EditWrapper>
															</Link>
														</div>
													)}
											</div>
										) : (
											<Input
												className="destination-input-field"
												onChange={(e) =>
													onHandleAddress(e.target.value, 'email')
												}
												value={receiverWithdrawalEmail}
												placeholder={
													STRINGS['WITHDRAW_PAGE.WITHDRAW_EMAIL_ADDRESS']
												}
											></Input>
										)}
										{selectedMethod === STRINGS['FORM_FIELDS.EMAIL_LABEL'] ? (
											isValidField?.isValidEmail ? (
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
				title={STRINGS['WITHDRAW_PAGE.WARNING']}
				visible={isWarning}
				onCancel={() => setIsWarning(false)}
				footer={false}
				className="withdrawal-remove-tag-modal"
				width="420px"
			>
				{renderWithdrawWarningPopup()}
			</Modal>
			<Modal
				title={STRINGS['WITHDRAW_PAGE.REMOVE_TITLE']}
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
								: selectedMethod === STRINGS['FORM_FIELDS.EMAIL_LABEL']
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
											(isErrorMaxAmountField && isErrorMinAmountField) ||
											(maxAmount &&
												maxAmount &&
												isErrorMinAmountField &&
												isErrorMinAmountField)
												? `destination-input-field field-error`
												: `destination-input-field`
										}
										suffix={renderAmountIcon()}
										type="number"
										placeholder={STRINGS['WITHDRAW_PAGE.ENTER_AMOUNT']}
									></Input>
									{!isAmount && !isErrorMinAmountField ? (
										<CheckOutlined className="mt-3 ml-3" />
									) : (
										<CloseOutlined className="mt-3 ml-3" />
									)}
								</div>
								{isErrorMaxAmountField && (
									<div className="d-flex mt-2 warning_text">
										<ExclamationCircleFilled className="mt-1 mr-1" />
										{renderLabel('WITHDRAW_PAGE.MAX_AMOUNT_WARNING_INFO')}
									</div>
								)}
								{maxAmount && maxAmount && isErrorMinAmountField ? (
									<div className="d-flex mt-2 warning_text">
										<ExclamationCircleFilled className="mt-1 mr-1" />
										{STRINGS.formatString(
											STRINGS['WITHDRAW_PAGE.MIN_AMOUNT_WARNING_INFO'],
											minAmount,
											selectedAsset
										)}
									</div>
								) : null}
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
												disabled={
													isAmount ||
													(isErrorMinAmountField && isErrorMinAmountField)
												}
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
	optionalTag: state.app.withdrawFields.optionalTag,
	scannedAddress: state.wallet.scannedAddress,
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
	setScannedAddress: bindActionCreators(setScannedAddress, dispatch),
});

export default connect(mapStateToForm, mapDispatchToProps)(RenderWithdraw);
