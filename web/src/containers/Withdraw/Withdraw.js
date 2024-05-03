import React, { useEffect, useState } from 'react';
import { Button, Input, Select } from 'antd';
import { Coin, EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';
import {
	CaretDownOutlined,
	CheckOutlined,
	ExclamationCircleFilled,
} from '@ant-design/icons';
import { getNetworkNameByKey } from 'utils/wallet';
import { STATIC_ICONS } from 'config/icons';
import { getWithdrawalMax } from 'actions/appActions';

export const RenderContent = ({
	coins,
	UpdateCurrency,
	onOpenDialog,
	assets,
	pinnedAssets,
}) => {
	const { Option } = Select;

	const [currStep, setCurrStep] = useState({
		stepOne: false,
		stepTwo: false,
		stepThree: false,
		stepFour: false,
	});
	const [currency, setCurrency] = useState('');
	const [networkOptions, setNetworkOptions] = useState('');
	// const [address, setAddress] = useState('');
	const [maxAmount, setMaxAmount] = useState(0);
	const [topAssets, setTopAssets] = useState([]);

	const iconId = coins[currency]?.icon_id;
	const coinLength =
		coins[currency]?.network && coins[currency]?.network.split(',');
	let network =
		coins[currency]?.network && coins[currency]?.network !== 'other'
			? coins[currency]?.network
			: coins[currency]?.symbol;
	let isAmount = false;

	useEffect(() => {
		const res = assets
			.filter((item, index) => {
				return index <= 3;
			})
			.map((data) => {
				return data[0];
			});
		if (pinnedAssets.length) {
			setTopAssets(pinnedAssets);
		} else {
			setTopAssets(res);
		}
	}, [assets, pinnedAssets]);

	useEffect(() => {
		UpdateCurrency(currency);
	}, [currency, UpdateCurrency]);

	const onHandleChangeSelect = (val) => {
		if (val) {
			setCurrStep((prev) => ({ ...prev, stepTwo: true }));
			setCurrency(val);
			network = val ? val : coins[currency]?.symbol;
		} else if (!val) {
			setCurrency('');
			setCurrStep((prev) => ({
				...prev,
				stepTwo: false,
				stepThree: false,
				stepFour: false,
			}));
			setMaxAmount(0);
		}
	};

	const onHandleChangeNetwork = (val) => {
		if (val) {
			setCurrStep((prev) => ({ ...prev, stepThree: true }));
			setNetworkOptions(val);
		} else if (!val) {
			setCurrStep((prev) => ({ ...prev, stepThree: false, stepFour: false }));
		}
	};

	const onHandleAddress = (val) => {
		if (val) {
			setCurrStep((prev) => ({ ...prev, stepFour: true }));
			// setAddress(val)
		} else if (!val) {
			setCurrStep((prev) => ({ ...prev, stepFour: false }));
		}
	};

	const onHandleDisable = () => {};

	const fetchWithdrawlMAx = async () => {
		try {
			const res = await getWithdrawalMax(
				currency,
				network
				// !emailMethod ? this.props?.data?.network : 'email'
			);
			setMaxAmount(res?.data?.amount);
			if (res?.data?.amount === 0) {
				isAmount = true;
			}
		} catch (error) {
			console.error(error);
		}
	};

	const onHandleAmount = (val) => {
		setMaxAmount(val);
	};

	const renderAmountIcon = () => {
		return (
			<div
				onClick={() => fetchWithdrawlMAx()}
				className="d-flex render-amount-icon-wrapper"
			>
				<span className="suffix-text">
					<EditWrapper stringId="CALCULATE_MAX">
						{STRINGS['CALCULATE_MAX']}
					</EditWrapper>
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
					<EditWrapper stringId="ACCORDIAN.SCAN">
						{STRINGS['ACCORDIAN.SCAN']}
					</EditWrapper>
				</span>
				<div className="img-wrapper">
					<img alt="scan-icon" src={STATIC_ICONS['QR_CODE_SCAN']}></img>
				</div>
			</div>
		);
	};

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
						<EditWrapper stringId="ACCORDIAN.SELECT_ASSET">
							{STRINGS['ACCORDIAN.SELECT_ASSET']}
						</EditWrapper>
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
						>
							<Option value={null}>{STRINGS['ALL']}</Option>
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
					<div className="mt-3 d-flex">
						{topAssets.map((data) => {
							return <span className="currency-label">{data}</span>;
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
							className={`custom-line${currStep.stepThree ? '-selected' : ''}`}
						></span>
					</div>
					<div
						className={`mt-2 ml-5 withdraw-main-label${
							currStep.stepTwo ? '-selected' : ''
						}`}
					>
						<EditWrapper stringId="ACCORDIAN.SELECT_NETWORK">
							{STRINGS['ACCORDIAN.SELECT_NETWORK']}
						</EditWrapper>
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
										? getNetworkNameByKey(networkOptions)
										: coins[currency]?.symbol.toUpperCase()
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
								<EditWrapper stringId="DEPOSIT_FORM_NETWORK_WARNING">
									{STRINGS['DEPOSIT_FORM_NETWORK_WARNING']}
								</EditWrapper>
							</div>
						</div>
					</div>
				)}
			</div>
			<div className="d-flex justify-content-between">
				<div className="d-flex h-25">
					<div className="custom-field d-flex flex-column">
						<span
							className={`custom-step${currStep.stepThree ? '-selected' : ''}`}
						>
							3
						</span>
						<span
							className={`custom-line${currStep.stepFour ? '-selected' : ''}`}
						></span>
					</div>
					<div
						className={`mt-2 ml-5 withdraw-main-label${
							currStep.stepThree ? '-selected' : ''
						}`}
					>
						<EditWrapper stringId="ACCORDIAN.DESTINATION">
							{STRINGS['ACCORDIAN.DESTINATION']}
						</EditWrapper>
					</div>
				</div>
				{((coinLength && coinLength.length === 1) ||
					(currStep.stepTwo && !coinLength) ||
					currStep.stepThree) && (
					<div className="select-wrapper">
						<Input
							className="destination-input-field"
							suffix={renderScanIcon()}
							onChange={(e) => onHandleAddress(e.target.value)}
						></Input>
					</div>
				)}
			</div>
			<div className="d-flex justify-content-between">
				<div className="d-flex h-25">
					<div className="custom-field d-flex flex-column">
						<span
							className={`custom-step${currStep.stepOne ? '-selected' : ''}`}
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
								{currency.toUpperCase()}
							</span>
						</div>
						<div
							className={`mt-2 ml-1 withdraw-main-label${
								currStep.stepFour ? '-selected' : ''
							}`}
						>
							<EditWrapper stringId="ACCORDIAN.AMOUNT">
								{STRINGS['ACCORDIAN.AMOUNT']}
							</EditWrapper>
						</div>
					</div>
				</div>
				{currStep.stepFour && (
					<div className="select-wrapper">
						<Input
							disabled={isAmount}
							onChange={(e) => onHandleAmount(e.target.value)}
							value={maxAmount}
							className="destination-input-field"
							suffix={renderAmountIcon()}
						></Input>
					</div>
				)}
			</div>
			{currStep.stepFour && (
				<div className="bottom-content">
					<div className="mt-2 ml-1">
						<EditWrapper stringId="ACCORDIAN.ESTIMATED">
							{STRINGS['ACCORDIAN.ESTIMATED']}
						</EditWrapper>
					</div>
					<span>--</span>
					<div className="mt-2 ml-1">
						<EditWrapper stringId="ACCORDIAN.TRANSACTION_FEE">
							{STRINGS['ACCORDIAN.TRANSACTION_FEE']}
						</EditWrapper>
					</div>
				</div>
			)}
			{currStep.stepFour && (
				<div className="btn-wrapper">
					<Button disabled={onHandleDisable} onClick={''} className="mb-3">
						{STRINGS['WITHDRAWALS_BUTTON_TEXT'].toUpperCase()}
					</Button>
				</div>
			)}
		</div>
	);
};
