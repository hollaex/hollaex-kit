import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { isMobile } from 'react-device-detect';
import { Input, Modal, Select, Button } from 'antd';
import {
	CaretDownOutlined,
	CheckOutlined,
	CloseOutlined,
	ExclamationCircleFilled,
} from '@ant-design/icons';

import {
	depositCurrency,
	depositNetwork,
	depositNetworkOptions,
} from 'actions/appActions';
import { Coin, EditWrapper } from 'components';
import { STATIC_ICONS } from 'config/icons';
import { assetsSelector } from 'containers/Wallet/utils';
import {
	networkList,
	renderLabel,
	renderNetworkField,
	renderNetworkWithLabel,
} from 'containers/Withdraw/utils';
import STRINGS from 'config/localizedStrings';
import { onHandleSymbol } from './utils';
import { handlePopupContainer } from 'utils/utils';

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
	router,
	selectedNetwork,
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
	const [isVisible, setIsVisible] = useState(false);
	const [networkData, setNetworkData] = useState(null);

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
	const networkHasTag = ['xrp', 'xlm', 'ton'];
	const hasTag = ['xrp', 'xlm', 'ton', 'pmn'];

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
			if (networkHasTag.includes(defaultCurrency)) {
				coinLength?.length === 1
					? setCurrStep({
							...currStep,
							stepTwo: true,
							stepThree: true,
							stepFour: true,
					  })
					: setCurrStep({
							...currStep,
							stepTwo: true,
							stepThree: false,
							stepFour: false,
					  });
			} else {
				setCurrStep({ ...currStep, stepTwo: true });
			}
			setDepositCurrency(defaultCurrency);
			setSelectedAsset(defaultCurrency);
			updateAddress(defaultCurrency);
			setDepositNetwork(defaultNetwork);
		}
		return () => {
			setDepositNetworkOptions(null);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [defaultCurrency]);

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

	useEffect(() => {
		if (selectedAsset) {
			if (hasTag.includes(defaultCurrency) || hasTag.includes(defaultNetwork)) {
				setIsVisible(true);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedAsset]);

	const onHandleChangeSelect = (val, pinned_assets = false) => {
		if (pinned_assets) {
			setIsPinnedAssets(pinned_assets);
		}
		if (val) {
			if (currStep.stepTwo || currStep.stepThree || currStep.stepFour) {
				if (networkHasTag.includes(val)) {
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
			setDepositNetworkOptions(null);
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
		router.push(`/wallet/${val}/deposit`);
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
			if (
				coinLength?.length > 1 &&
				networkHasTag.includes(renderNetworkField(val))
			) {
				setIsVisible(true);
			}
			setCurrStep((prev) => ({ ...prev, stepThree: true }));
			setDepositNetworkOptions(val);
			updateAddress(renderNetworkField(val), true);
			setDepositNetwork(val);
			setNetworkData(val);
		} else if (!val) {
			setCurrStep((prev) => ({ ...prev, stepThree: false, stepFour: false }));
		}
	};

	const renderScanIcon = (isTag = false, type = 'address') => {
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
				<CopyToClipboard
					text={type !== 'address' ? optionalTag : address && address[0]}
				>
					<div className="render-deposit-scan-wrapper" onClick={() => onCopy()}>
						{renderLabel('COPY_TEXT')}
					</div>
				</CopyToClipboard>
			</div>
		);
	};

	const onHandleClear = (type) => {
		if (type === 'coin') {
			setSelectedAsset(null);
			setDepositCurrency('');
			setCurrStep({
				...currStep,
				stepTwo: false,
				stepThree: false,
				stepFour: false,
			});
		}
		if (type === 'network') {
			setDepositNetworkOptions(null);
			setNetworkData(null);
		}
	};

	const onHandleSelect = (symbol) => {
		const curr = onHandleSymbol(symbol);
		if (curr !== symbol && networkHasTag.includes(curr)) {
			if (
				networkHasTag.includes(defaultCurrency) ||
				networkHasTag.includes(defaultNetwork)
			) {
				setIsVisible(true);
			} else {
				setIsVisible(false);
			}
		}
	};

	const renderDepositWarningPopup = () => {
		return (
			<div className="warning-popup-wrapper">
				<div>
					<EditWrapper>
						{STRINGS['WITHDRAW_PAGE.WARNING_DEPOSIT_INFO_1']}
					</EditWrapper>
				</div>
				<div className="mt-3">
					<EditWrapper>
						{STRINGS['WITHDRAW_PAGE.WARNING_DEPOSIT_INFO_2']}
					</EditWrapper>
				</div>
				<div className="button-wrapper">
					<Button className="holla-button" onClick={() => setIsVisible(false)}>
						<EditWrapper>
							{STRINGS['USER_SETTINGS.DELETE_ACCOUNT.CONFIRMATION.KEY']}
						</EditWrapper>
					</Button>
				</div>
			</div>
		);
	};

	const renderOptionalField =
		(['xrp', 'xlm'].includes(selectedAsset) ||
			['xlm', 'ton'].includes(
				coinLength &&
					coinLength.length > 1 &&
					getDepositNetworkOptions &&
					getDepositNetworkOptions
					? renderNetworkField(networkData)
					: network
			)) &&
		depositAddress;
	const networkIcon = selectedNetwork
		? coins[selectedNetwork]?.icon_id
		: coins[defaultNetwork]?.icon_id;
	const networkOptionsIcon = coins[getDepositNetworkOptions]?.icon_id;

	return (
		<div
			className={
				isDisbaleDeposit
					? 'withdraw-deposit-disable deposit-wrapper-fields mt-5'
					: `deposit-wrapper-fields ${isMobile ? '' : 'mt-5'}`
			}
		>
			<Modal
				title={STRINGS['WITHDRAW_PAGE.WARNING']}
				visible={isVisible}
				onCancel={() => setIsVisible(false)}
				footer={false}
				className="withdrawal-remove-tag-modal"
				closeIcon={<CloseOutlined />}
				width={'420px'}
			>
				{renderDepositWarningPopup()}
			</Modal>
			<div>
				<div className="d-flex">
					<div className="custom-field d-flex flex-column align-items-center">
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
							<div className="mb-3 d-flex">
								{topAssets.map((data, inx) => {
									return (
										<span
											key={inx}
											className={`currency-label ${
												selectedAsset === data ? 'opacity-100' : 'opacity-30'
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
									allowClear={selectedAsset ? true : false}
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
									onSelect={(e) => onHandleSelect(e)}
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
								{currStep.stepTwo && <CheckOutlined className="mt-3 ml-3" />}
							</div>
						</div>
					</div>
				</div>
			</div>
			<div>
				<div className="d-flex h-25">
					<div className="custom-field d-flex flex-column align-items-center">
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
									isMobile
										? 'select-wrapper mobile-view'
										: `select-wrapper ${
												coinLength?.length > 1 ? '' : 'deposit-network-field'
										  }`
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
										allowClear={networkData ? true : false}
										onChange={onHandleChangeNetwork}
										value={
											defaultCurrency &&
											!isPinnedAssets &&
											coinLength?.length < 1
												? defaultNetwork
												: coinLength && coinLength.length <= 1
												? getDepositNetworkOptions && getDepositNetworkOptions
													? networkData
													: renderNetworkWithLabel(networkIcon, network)
												: coinLength && coinLength.length > 1
												? getDepositNetworkOptions && getDepositNetworkOptions
													? networkData
													: renderNetworkWithLabel(
															networkOptionsIcon,
															getDepositNetworkOptions
													  )
												: coins[getDepositCurrency]?.symbol.toUpperCase()
										}
										disabled={
											(coinLength && coinLength.length === 1) ||
											!(coinLength && coinLength.length)
										}
										placeholder={STRINGS['WITHDRAW_PAGE.SELECT']}
										onClear={() => onHandleClear('network')}
										getPopupContainer={handlePopupContainer}
									>
										{coinLength &&
											coinLength?.length === 1 &&
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
										{coinLength &&
											coinLength?.length > 1 &&
											networkList.map((data, inx) => {
												const coin = data.iconId.split('_');
												return coinLength.map((coinData, coinInx) => {
													if (coinData === coin[0]?.toLowerCase()) {
														return (
															<Option
																key={`${inx}-${coinInx}`}
																value={data?.network}
															>
																<div className="d-flex gap-1">
																	<div className="d-flex">
																		{data?.network}
																		<div className="ml-2 mt-1">
																			<Coin
																				iconId={data.iconId}
																				type="CS2"
																				className="mt-2 withdraw-network-icon"
																			/>
																		</div>
																	</div>
																</div>
															</Option>
														);
													}
													return null;
												});
											})}
									</Select>
									{(coinLength &&
										coinLength.length === 1 &&
										!isDisbaleDeposit) ||
									(currStep.stepTwo && !coinLength) ||
									currStep.stepThree ? (
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
			<div className={!depositAddress && 'd-flex'}>
				<div className="d-flex w-100">
					<div className="custom-field d-flex flex-column align-items-center">
						<span className={`custom-step${isSteps ? '-selected' : ''}`}>
							3
						</span>
						{renderOptionalField && (
							<span
								className={`custom-line${renderOptionalField ? '-large' : ''}`}
							></span>
						)}
					</div>
					<div
						className={`d-flex mt-2 ml-5 w-100 ${
							isMobile ? 'flex-column mb-5' : 'justify-content-between'
						} withdraw-main-label${isSteps ? '-selected' : ''}`}
					>
						<div className="d-flex">
							<div className=" d-flex step3-icon-wrapper">
								{getDepositCurrency && (
									<span>
										<Coin iconId={iconId} type={isMobile ? 'CS8' : 'CS5'} />
									</span>
								)}
								<span
									className={`${
										getDepositCurrency && `ml-2`
									} withdraw-main-label${isSteps ? '-selected' : ''}`}
								>
									{getDepositCurrency.toUpperCase()}
								</span>
							</div>
							<div
								className={`${
									getDepositCurrency && `ml-2`
								} withdraw-main-label${isSteps ? '-selected' : ''}`}
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
											onClick={onOpen}
											className="holla-button text-uppercase"
										>
											{STRINGS['GENERATE_WALLET']}
										</Button>
									</div>
								</div>
							) : (
								<div className="deposit-address-wrapper">
									<div className="d-flex flex-row deposit-address-field">
										<Input
											className={`${
												networkHasTag.includes(selectedAsset)
													? 'destination-input-field tag-field'
													: 'destination-input-field'
											}`}
											suffix={renderScanIcon(
												networkHasTag.includes(selectedAsset),
												'address'
											)}
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
			{renderOptionalField && (
				<div>
					<div className="d-flex h-25">
						<div className="custom-field d-flex flex-column align-items-center">
							<span
								className={`custom-step${
									(coinLength &&
										coinLength.length === 1 &&
										!isDisbaleDeposit) ||
									(currStep.stepTwo && !coinLength) ||
									currStep.stepThree
										? '-selected'
										: ''
								}`}
							>
								4
							</span>
						</div>
						<div
							className={`optional-tag withdraw-main-label${
								(coinLength && coinLength.length === 1 && !isDisbaleDeposit) ||
								(currStep.stepTwo && !coinLength) ||
								currStep.stepThree
									? '-selected'
									: ''
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
												suffix={renderScanIcon(true, 'optionalTag')}
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
