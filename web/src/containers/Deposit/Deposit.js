import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { isMobile } from 'react-device-detect';
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
	const [selectedAsset, setSelectedAsset] = useState(null);
	const [topAssets, setTopAssets] = useState([]);
	const [isPinnedAssets, setIsPinnedAssets] = useState(false);
	const [optionalTag, setOptionalTag] = useState('');
	const [isDisbaleDeposit, setIsDisbaleDeposit] = useState(false);

	const defaultCurrency = currency !== '' && currency;
	const address = depositAddress?.split(':');
	const isTag = address && address[1];

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
		(coinLength && coinLength.length === 1 && !isDisbaleDeposit) ||
		(currStep.stepTwo && !coinLength) ||
		currStep.stepThree;
	const iconId = coins[getDepositCurrency]?.icon_id || coins[currency]?.icon_id;
	const currentCurrency = getDepositCurrency ? getDepositCurrency : currency;
	const min = coins[currentCurrency];
	const isDeposit = coins[getDepositCurrency]?.allow_deposit;

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
		if (defaultCurrency) {
			if (['xrp', 'xlm', 'ton'].includes(defaultCurrency)) {
				setCurrStep({
					...currStep,
					stepTwo: true,
					stepThree: true,
					stepFour: true,
				});
			} else {
				setCurrStep({ ...currStep, stepTwo: true });
			}
			setDepositCurrency(defaultCurrency);
			setSelectedAsset(defaultCurrency);
			updateAddress(defaultCurrency);
			setDepositNetwork(defaultNetwork);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (isTag) {
			setOptionalTag(address[1]);
		} else {
			setOptionalTag('');
		}
	}, [address, isTag]);

	useEffect(() => {
		if (getDepositCurrency && !isDeposit) {
			setSelectedAsset('');
			setIsDisbaleDeposit(true);
			setCurrStep({
				stepOne: true,
				stepTwo: false,
				stepThree: false,
				stepFour: false,
			});
		} else {
			setIsDisbaleDeposit(false);
		}
	}, [getDepositCurrency, isDeposit]);

	const onHandleChangeSelect = (val, pinned_assets = false) => {
		if (pinned_assets) {
			setIsPinnedAssets(pinned_assets);
		}
		if (val) {
			if (currStep.stepTwo || currStep.stepThree || currStep.stepFour) {
				if (['xrp', 'xlm', 'ton'].includes(val)) {
					setCurrStep((prev) => ({
						...prev,
						stepTwo: true,
						stepThree: true,
						stepFour: true,
					}));
				} else {
					setCurrStep((prev) => ({
						...prev,
						stepTwo: true,
						stepThree: false,
						stepFour: false,
					}));
				}
			}
			if (coins[val] && !coins[val].allow_deposit) {
				setCurrStep((prev) => ({ ...prev, stepTwo: false }));
			} else {
				setCurrStep((prev) => ({ ...prev, stepTwo: true }));
			}
			setDepositCurrency(val);
			network = val ? val : coins[getDepositCurrency]?.symbol;
			setDepositNetworkOptions('');
		} else if (!val) {
			setDepositCurrency('');
			setCurrStep((prev) => ({
				...prev,
				stepTwo: false,
				stepThree: false,
				stepFour: false,
			}));
		}
		let currentNetwork =
			coins[val]?.network && coins[val]?.network !== 'other'
				? coins[val]?.network
				: coins[val]?.symbol;
		setDepositNetwork(currentNetwork);
		setSelectedAsset(val && coins[val] && coins[val].allow_deposit ? val : '');
		updateAddress(val);
	};

	const onHandleChangeNetwork = (val) => {
		if (val) {
			setCurrStep((prev) => ({ ...prev, stepThree: true }));
			setDepositNetworkOptions(val);
			updateAddress(val, true);
			setDepositNetwork(val);
		} else if (!val) {
			setCurrStep((prev) => ({ ...prev, stepThree: false, stepFour: false }));
		}
	};

	const renderScanIcon = (isTag = false) => {
		return (
			<div className="d-flex">
				{!isTag && (
					<>
						<div
							className="render-scan-wrapper d-flex"
							onClick={() => openQRCode()}
						>
							<div className="img-wrapper">
								<img alt="scan-icon" src={STATIC_ICONS['QR_CODE_SHOW']}></img>
							</div>
						</div>
						<div className="divider"></div>
					</>
				)}
				<CopyToClipboard text={isTag ? optionalTag : address && address[0]}>
					<div className="render-deposit-scan-wrapper" onClick={() => onCopy()}>
						{renderLabel('COPY_TEXT')}
					</div>
				</CopyToClipboard>
			</div>
		);
	};

	const onHandleClear = (key) => {
		setSelectedAsset(null);
		setDepositCurrency('');
		setCurrStep({
			...currStep,
			stepTwo: false,
			stepThree: false,
			stepFour: false,
		});
	};

	return (
		<div
			className={
				isDisbaleDeposit
					? 'withdraw-deposit-disable deposit-wrapper-fields mt-5'
					: 'deposit-wrapper-fields mt-5'
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
							{renderLabel('ACCORDIAN.SELECT_ASSET')}
						</div>
						<div
							className={
								isMobile ? 'select-wrapper mobile-view' : 'select-wrapper'
							}
						>
							<div className="d-flex">
								<Select
									showSearch={true}
									className="custom-select-input-style elevated select-field"
									dropdownClassName="custom-select-style"
									suffixIcon={<CaretDownOutlined />}
									placeholder="Select"
									allowClear={true}
									value={
										selectedAsset &&
										`${
											coins[selectedAsset].fullname
										} (${selectedAsset.toUpperCase()})`
									}
									onClear={onHandleClear}
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
								{currStep.stepTwo && <CheckOutlined className="mt-3 ml-3" />}
							</div>
							<div className="mt-3 d-flex">
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
				</div>
			</div>
			<div>
				<div className="d-flex h-25">
					<div className="custom-field d-flex flex-column">
						<span
							className={`custom-step${currStep.stepTwo ? '-selected' : ''}`}
						>
							2
						</span>
						<span
							className={`custom-line${
								(coinLength && coinLength.length === 1 && !isDisbaleDeposit) ||
								(currStep.stepTwo && !coinLength) ||
								currStep.stepThree ||
								currStep.stepTwo
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
								currStep.stepTwo ? '-selected' : ''
							}`}
						>
							{renderLabel('ACCORDIAN.SELECT_NETWORK')}
						</div>
						{currStep.stepTwo && (
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
												? getNetworkNameByKey(getDepositNetworkOptions)
												: coins[getDepositCurrency]?.symbol.toUpperCase()
										}
										disabled={
											(coinLength && coinLength.length === 1) ||
											!(coinLength && coinLength.length)
										}
										placeholder="Select"
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
									{currStep.stepTwo && <CheckOutlined className="mt-3 ml-3" />}
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
			<div className={!depositAddress && 'd-flex'}>
				<div className="d-flex h-25">
					<div className="custom-field d-flex flex-column">
						<span className={`custom-step${isSteps ? '-selected' : ''}`}>
							3
						</span>
						{currStep.stepFour && depositAddress && (
							<span
								className={`custom-line${currStep.stepTwo ? '-large' : ''}`}
							></span>
						)}
					</div>
					<div
						className={`d-flex mt-2 ml-5  ${
							isMobile ? 'flex-column' : 'justify-content-between'
						} withdraw-main-label${isSteps ? '-selected' : ''}`}
					>
						<div className="d-flex">
							<div className=" d-flex step3-icon-wrapper">
								<span>
									<Coin iconId={iconId} type={isMobile ? 'CS8' : 'CS5'} />
								</span>
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
							<span
								className={`ml-2 withdraw-main-label${
									isSteps ? '-selected' : ''
								}`}
							>
								{renderLabel('ACCORDIAN.ADDRESS')}
							</span>
						</div>
						{((coinLength && coinLength.length === 1 && !isDisbaleDeposit) ||
							(currStep.stepTwo && !coinLength) ||
							currStep.stepThree) &&
							(!depositAddress && selectedAsset ? (
								<div className="generate-field-wrapper">
									<div className="generate-deposit-label">
										<div>
											{renderLabel('WITHDRAW_PAGE.GENERATE_DEPOSIT_TEXT_1')}
										</div>
										<div>
											{renderLabel('WITHDRAW_PAGE.GENERATE_DEPOSIT_TEXT_2')}
										</div>
									</div>
									<div className="btn-wrapper-deposit">
										<Button
											stringId="GENERATE_WALLET"
											label={STRINGS['GENERATE_WALLET']}
											onClick={onOpen}
										/>
									</div>
								</div>
							) : (
								<div className="deposit-address-wrapper">
									<div className="d-flex flex-row deposit-address-field">
										<Input
											className="destination-input-field"
											suffix={renderScanIcon()}
											value={address && address[0]}
										></Input>
									</div>
									<div className="warning-text d-flex mt-2">
										<ExclamationCircleFilled className="mt-1 mr-2" />
										<div className="address-warning-text">
											<EditWrapper>
												{STRINGS.formatString(
													STRINGS['DEPOSIT_FORM_MIN_WARNING'],
													min?.min,
													currentCurrency.toUpperCase()
												)}
											</EditWrapper>
										</div>
									</div>
								</div>
							))}
					</div>
				</div>
			</div>
			{(['xrp', 'xlm'].includes(selectedAsset) ||
				['xlm', 'ton'].includes(network)) &&
				depositAddress && (
					<div>
						<div className="d-flex h-25">
							<div className="custom-field d-flex flex-column">
								<span
									className={`custom-step${
										currStep.stepFour ? '-selected' : ''
									}`}
								>
									4
								</span>
							</div>
							<div
								className={`withdraw-main-label${
									currStep.stepFour ? '-selected' : ''
								} ${!isMobile ? 'ml-5' : ''}`}
							>
								<div
									className={
										isMobile
											? 'd-flex w-100 flex-column'
											: 'd-flex w-100 justify-content-between'
									}
								>
									<div className="mt-2 d-flex">
										<span className={isMobile ? 'ml-5' : ''}>
											<Coin iconId={iconId} type={isMobile ? 'CS8' : 'CS5'} />
										</span>
										<span className="ml-2">{renderLabel('ACCORDIAN.TAG')}</span>
									</div>
									{((coinLength && coinLength.length === 1) ||
										(currStep.stepTwo && !coinLength) ||
										currStep.stepThree) && (
										<div
											className={
												isMobile
													? 'd-flex select-wrapper destination-tag-field-wrapper mobile-view'
													: 'd-flex select-wrapper destination-tag-field-wrapper'
											}
										>
											<div className="destination-tag-field">
												<Input
													value={optionalTag}
													className="destination-input-field"
													type={
														selectedAsset === 'xrp' || selectedAsset === 'xlm'
															? 'number'
															: 'text'
													}
													suffix={renderScanIcon(true)}
												></Input>
											</div>
											<div className="d-flex mt-2 warning-text">
												<ExclamationCircleFilled className="mt-1" />
												<div className="ml-2 tag-text">
													{renderLabel(
														'DEPOSIT_FORM_TITLE_WARNING_DESTINATION_TAG'
													)}
												</div>
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				)}
		</div>
	);
};

const mapStateToProps = (state) => ({
	getDepositCurrency: state.app.depositFields.depositCurrency,
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
