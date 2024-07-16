import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { change } from 'redux-form';
import { Input, Select } from 'antd';
import {
	CaretDownOutlined,
	CheckOutlined,
	CloseOutlined,
} from '@ant-design/icons';

import QRScanner from 'containers/Withdraw/QRScanner';
import STRINGS from 'config/localizedStrings';
import { Coin, Dialog, EditWrapper } from 'components';
import {
	networkList,
	renderNetworkField,
	renderNetworkWithLabel,
	renderScanIcon,
} from 'containers/Withdraw/utils';
import { onHandleSymbol } from 'containers/Deposit/utils';
import { validAddress } from 'components/Form/validations';
import { FORM_NAME } from 'containers/Withdraw/form';

const GenerateAddress = ({
	topAssets,
	selectedAsset,
	networkoptions,
	setTopAssets,
	setSelectedAsset,
	setNetworkOptions,
	assets,
	pinnedAssets,
	coins,
	coinLength,
	network,
	networkIcon,
	setIsValidAddress,
	isValidAddress,
	dispatch,
}) => {
	const [qrScannerOpen, setQrScannerOpen] = useState(false);

	const { Option } = Select;

	const displayAssets =
		selectedAsset &&
		`${coins[selectedAsset].fullname} (${selectedAsset.toUpperCase()})`;

	const displayNetwork =
		coinLength?.length === 1
			? renderNetworkWithLabel(networkIcon, network)
			: coinLength?.length > 1
			? networkoptions
			: network?.toUpperCase();

	const currentNetwork =
		coinLength?.length === 1 ? network : renderNetworkField(networkoptions);

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const renderPinnedAsset = (data) => {
		const icon_id = coins[data]?.icon_id;
		return (
			<div className="d-flex justify-content-around">
				{data.toUpperCase()}
				<span className="pinned-asset-icon ml-1 mt-1">
					<Coin iconId={icon_id} type="CS1" />
				</span>
			</div>
		);
	};

	const onHandleChangeSelect = (symbol) => {
		setSelectedAsset(symbol);
		setIsValidAddress(null);
	};

	const onHandleChangeNetwork = (symbol) => {
		setNetworkOptions(symbol);
		setIsValidAddress(null);
	};

	const onHandleScan = () => {
		setQrScannerOpen(true);
	};

	const closeQRScanner = () => {
		setQrScannerOpen(false);
	};

	const onHandleAddress = (val) => {
		const isValid = validAddress(
			selectedAsset,
			STRINGS[`WITHDRAWALS_${selectedAsset?.toUpperCase()}_INVALID_ADDRESS`],
			currentNetwork,
			val
		)();
		if (!isValid) {
			setIsValidAddress(val);
		} else {
			setIsValidAddress(false);
		}
	};

	const getQRData = (data) => {
		dispatch(change(FORM_NAME, 'address', data));
	};

	return (
		<div className="generate-address-form-wrapper">
			<div className="select-method-field">
				<div className="input-label-field">
					<div className="custom-field">
						<div className="select-step">1</div>
						<div className="custom-line"></div>
					</div>
					<div className="label-content">
						<EditWrapper stringId="ACCORDIAN.SELECT_ASSET">
							{STRINGS['ACCORDIAN.SELECT_ASSET']}
						</EditWrapper>
					</div>
				</div>
				<div className="select-field">
					<div className="mb-3 d-flex">
						{topAssets.map((data, inx) => {
							return (
								<span
									key={inx}
									className={`currency-label ${
										selectedAsset === data ? 'opacity-100' : 'opacity-30'
									}`}
									onClick={() => onHandleChangeSelect(data)}
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
							placeholder={STRINGS['WITHDRAW_PAGE.SELECT']}
							allowClear={true}
							value={displayAssets}
							suffixIcon={<CaretDownOutlined />}
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
							onClear={() => setSelectedAsset(null)}
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
						{selectedAsset ? (
							<CheckOutlined className="mt-3 ml-3" />
						) : (
							<CloseOutlined className="mt-3 ml-3" />
						)}
					</div>
				</div>
			</div>
			<div className="select-network-field">
				<div
					className={
						!selectedAsset ? 'input-label-field-disable' : 'input-label-field'
					}
				>
					<div className="custom-field">
						<div className="select-step">2</div>
						<div className="custom-line"></div>
					</div>
					<div className="label-content">
						<EditWrapper stringId="ACCORDIAN.SELECT_NETWORK">
							{STRINGS['ACCORDIAN.SELECT_NETWORK']}
						</EditWrapper>
					</div>
				</div>
				<div className="network-field">
					{selectedAsset && (
						<div className="d-flex">
							<Select
								className="custom-select-input-style elevated select-field"
								dropdownClassName="custom-select-style"
								onChange={onHandleChangeNetwork}
								value={displayNetwork}
								placeholder={STRINGS['WITHDRAW_PAGE.SELECT']}
								allowClear={true}
								showSearch={true}
								suffixIcon={<CaretDownOutlined />}
							>
								{coinLength &&
									coinLength?.length > 1 &&
									networkList.map((data, inx) => {
										const coin = data.iconId.split('_');
										return coinLength?.map((coinData, coinInx) => {
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
							{displayNetwork ? (
								<CheckOutlined className="mt-3 ml-3" />
							) : (
								<CloseOutlined className="mt-3 ml-3" />
							)}
						</div>
					)}
				</div>
			</div>
			<div className="address-field">
				<div
					className={
						!displayNetwork ? 'input-label-field-disable' : 'input-label-field'
					}
				>
					<div className="custom-field">
						<div className="select-step">3</div>
					</div>
					<div className="label-content">
						<div>
							<EditWrapper stringId="USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.ADDRESS_LABEL">
								{
									STRINGS[
										'USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS.ADDRESS_LABEL'
									]
								}
								:
							</EditWrapper>
						</div>
					</div>
				</div>
				<div className="network-field">
					{displayNetwork && (
						<div className="d-flex">
							<Input
								className="destination-input-field"
								onChange={(e) => onHandleAddress(e.target.value)}
								suffix={renderScanIcon(onHandleScan)}
								placeholder={STRINGS['WITHDRAWALS_FORM_ADDRESS_PLACEHOLDER']}
							/>
							{isValidAddress ? (
								<CheckOutlined className="mt-3 ml-3" />
							) : (
								<CloseOutlined className="mt-3 ml-3" />
							)}
						</div>
					)}
					<Dialog
						isOpen={qrScannerOpen}
						label="withdraw-modal"
						onCloseDialog={closeQRScanner}
						shouldCloseOnOverlayClick={false}
						showCloseText={true}
					>
						{qrScannerOpen && (
							<QRScanner
								closeQRScanner={closeQRScanner}
								getQRData={getQRData}
							/>
						)}
					</Dialog>
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	coins: state.app.coins,
});

const mapDispatchToProps = (dispatch) => ({
	dispatch,
});
export default connect(mapStateToProps, mapDispatchToProps)(GenerateAddress);
