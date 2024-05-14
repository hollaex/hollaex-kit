import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Input, Select } from 'antd';
import {
	CaretDownOutlined,
	CheckOutlined,
	ExclamationCircleFilled,
} from '@ant-design/icons';

import {
	depositCurrency,
	depositNetwork,
	depositNetworkOptions,
} from 'actions/appActions';
import { Button, Coin, EditWrapper } from 'components';
import { STATIC_ICONS } from 'config/icons';
import { assetsSelector } from 'containers/Wallet/utils';
import { renderLabel } from 'containers/Withdraw/utils';
import { getNetworkNameByKey } from 'utils/wallet';
import STRINGS from 'config/localizedStrings';

const DepositComponent = ({
	coins,
	pinnedAssets,
	assets,
	currency,
	openQRCode,
	onOpen,
	onCopy,
	updateAddress,
	depositAddress,
	showGenerateButton,
	...rest
}) => {
	const { Option } = Select;
	const {
		setDepositNetworkOptions,
		setDepositNetwork,
		setDepositCurrency,
		getDepositNetworkOptions,
		getDepositCurrency,
	} = rest;

	const [currStep, setCurrStep] = useState({
		stepOne: false,
		stepTwo: false,
		stepThree: false,
		stepFour: false,
	});
	const [selectedAsset, setSelectedAsset] = useState('');
	const [topAssets, setTopAssets] = useState([]);
	const [isPinnedAssets, setIsPinnedAssets] = useState(false);

	const defaultCurrency = currency !== '' && currency;

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
		setSelectedAsset(defaultCurrency);
		if (defaultCurrency) {
			setDepositCurrency(defaultCurrency);
			setCurrStep({ ...currStep, stepTwo: true });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const coinLength =
		coins[getDepositCurrency]?.network &&
		coins[getDepositCurrency]?.network.split(',');
	let network =
		coins[getDepositCurrency]?.network &&
		coins[getDepositCurrency]?.network !== 'other'
			? coins[getDepositCurrency]?.network
			: coins[getDepositCurrency]?.symbol;
	const defaultNetwork =
		defaultCurrency &&
		coins[defaultCurrency]?.network &&
		coins[defaultCurrency]?.network !== 'other'
			? coins[defaultCurrency]?.network
			: coins[defaultCurrency]?.symbol;
	const isSteps =
		(coinLength && coinLength.length === 1) ||
		(currStep.stepTwo && !coinLength) ||
		currStep.stepThree;
	const iconId = coins[getDepositCurrency]?.icon_id || coins[currency]?.icon_id;
	const currentCurrency = getDepositCurrency ? getDepositCurrency : currency;
	const { min } = coins[currentCurrency];

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
			setCurrStep((prev) => ({ ...prev, stepTwo: true }));
			setDepositCurrency(val);
			network = val ? val : coins[getDepositCurrency]?.symbol;
			setDepositNetworkOptions('');
			setDepositNetwork(val);
		} else if (!val) {
			setDepositCurrency('');
			setCurrStep((prev) => ({
				...prev,
				stepTwo: false,
				stepThree: false,
				stepFour: false,
			}));
		}
		setSelectedAsset(val);
		updateAddress();
	};

	const onHandleChangeNetwork = (val) => {
		if (val) {
			setCurrStep((prev) => ({ ...prev, stepThree: true }));
			setDepositNetworkOptions(val);
			updateAddress();
		} else if (!val) {
			setCurrStep((prev) => ({ ...prev, stepThree: false, stepFour: false }));
		}
	};

	const renderScanIcon = () => {
		return (
			<div className="d-flex">
				<div
					className="render-scan-wrapper d-flex"
					onClick={() => openQRCode()}
				>
					<div className="img-wrapper">
						<img alt="scan-icon" src={STATIC_ICONS['QR_CODE_SHOW']}></img>
					</div>
				</div>
				<div className="divider"></div>
				<div className="render-deposit-scan-wrapper" onClick={() => onCopy()}>
					{renderLabel('COPY_TEXT')}
				</div>
			</div>
		);
	};

	return (
		<div className="deposit-wrapper-fields mt-5">
			<div className="d-flex justify-content-between">
				<div className="d-flex">
					<div className="custom-field d-flex flex-column">
						<span className="custom-step-selected">1</span>
						<span
							className={`custom-line${currStep.stepTwo ? '-selected' : ''}`}
						></span>
					</div>
					<div className="mt-2 ml-5 withdraw-main-label-selected">
						{renderLabel('ACCORDIAN.SELECT_ASSET')}
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
									onClick={() => onHandleChangeSelect(data, true)}
								>
									{data?.toUpperCase()}
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
						{renderLabel('ACCORDIAN.SELECT_NETWORK')}
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
									defaultCurrency && !isPinnedAssets && coinLength?.length < 1
										? defaultNetwork
										: coinLength && coinLength.length <= 1
										? getNetworkNameByKey(network)
										: coinLength && coinLength.length > 1
										? getNetworkNameByKey(getDepositNetworkOptions)
										: coins[getDepositCurrency]?.symbol.toUpperCase()
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
								{renderLabel('DEPOSIT_FORM_NETWORK_WARNING')}
							</div>
						</div>
					</div>
				)}
			</div>
			<div
				className={`d-flex ${!showGenerateButton && 'justify-content-between'}`}
			>
				<div className="d-flex h-25">
					<div className="custom-field d-flex flex-column">
						<span className={`custom-step${isSteps ? '-selected' : ''}`}>
							3
						</span>
					</div>
					<div
						className={`mt-2 ml-5 withdraw-main-label${
							isSteps ? '-selected' : ''
						}`}
					>
						<div className="d-flex">
							<div className=" d-flex step3-icon-wrapper">
								<Coin iconId={iconId} type="CS5" />
								<span
									className={`ml-2 withdraw-main-label${
										isSteps ? '-selected' : ''
									}`}
								>
									{getDepositCurrency.toUpperCase()}
								</span>
							</div>
							<div
								className={`ml-1 withdraw-main-label${
									isSteps ? '-selected' : ''
								}`}
							>
								{renderLabel('SUMMARY.DEPOSIT')}
							</div>
						</div>
						<span className="address-label">
							{renderLabel('ACCORDIAN.ADDRESS')}
						</span>
					</div>
				</div>
				{((coinLength && coinLength.length === 1) ||
					(currStep.stepTwo && !coinLength) ||
					currStep.stepThree) &&
					(showGenerateButton ? (
						<div className="generate-deposit-label">
							<div>{renderLabel('WITHDRAW_PAGE.GENERATE_DEPOSIT_TEXT_1')}</div>
							<div>{renderLabel('WITHDRAW_PAGE.GENERATE_DEPOSIT_TEXT_2')}</div>
						</div>
					) : (
						<div className="deposit-address-wrapper">
							<div className="d-flex flex-row deposit-address-field">
								<Input
									className="destination-input-field"
									suffix={renderScanIcon()}
									value={depositAddress}
								></Input>
								{currStep.stepFour && <CheckOutlined className="mt-3 ml-3" />}
							</div>
							<div className="warning-text d-flex mt-2">
								<ExclamationCircleFilled className="mt-1 mr-2" />
								<div className="address-warning-text">
									<EditWrapper>
										{STRINGS.formatString(
											STRINGS['DEPOSIT_FORM_MIN_WARNING'],
											min,
											currentCurrency.toUpperCase()
										)}
									</EditWrapper>
								</div>
							</div>
						</div>
					))}
			</div>
			{showGenerateButton && (
				<div className="btn-wrapper-deposit">
					<Button
						stringId="GENERATE_WALLET"
						label={STRINGS['GENERATE_WALLET']}
						onClick={onOpen}
					/>
				</div>
			)}
		</div>
	);
};

const mapStateToProps = (state) => ({
	getDepositCurrency: state.app.depositFields.depositCurrency,
	getDepositNetwork: state.app.depositFields.depositNetwork,
	getDepositNetworkOptions: state.app.depositFields.depositNetworkOptions,
	pinnedAssets: state.app.pinned_assets,
	assets: assetsSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
	setDepositCurrency: bindActionCreators(depositCurrency, dispatch),
	setDepositNetwork: bindActionCreators(depositNetwork, dispatch),
	setDepositNetworkOptions: bindActionCreators(depositNetworkOptions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(DepositComponent);
