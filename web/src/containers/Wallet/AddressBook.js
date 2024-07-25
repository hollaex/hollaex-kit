import React, { useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { Input, Button, message, Spin } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';

import GenerateAddress from './GenerateAddress';
import withConfig from 'components/ConfigProvider/withConfig';
import icons from 'config/icons/dark';
import CopyToClipboard from 'react-copy-to-clipboard';
import STRINGS from 'config/localizedStrings';
import AddressBookEmptyTable from './utils';
import { Coin, Dialog, EditWrapper, IconTitle, Table } from 'components';
import { assetsSelector, RenderBtn } from './utils';
import {
	networkList,
	renderNetworkField,
	renderNetworkWithLabel,
} from 'containers/Withdraw/utils';
import { renderBackToWallet } from 'containers/Deposit/utils';
import { openContactForm, setSnackNotification } from 'actions/appActions';
import { renderNeedHelpAction } from './components';
import { getAddressBookDetails, setUserLabelAndAddress } from './actions';
import { getNetworkNameByKey } from 'utils/wallet';

const AddressBook = ({
	coins,
	router,
	pinnedAssets,
	assets,
	icons: ICONS,
	constants = { links: {} },
	setSnackNotification,
	openContactForm,
}) => {
	const [getUserData, setGetUserData] = useState([]);
	const [renderPopUps, setRenderPopUps] = useState({
		step1: false,
		step2: false,
		step3: false,
	});
	const [userLabel, setUserLabel] = useState('');
	const [topAssets, setTopAssets] = useState([]);
	const [selectedAsset, setSelectedAsset] = useState({
		selectedCurrency: null,
		networkOptions: null,
		address: null,
	});
	const [isValidAddress, setIsValidAddress] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const AddressBookTableData = [
		{
			stringId: 'DEVELOPERS_TOKENS_TABLE.NAME',
			label: STRINGS['DEVELOPERS_TOKENS_TABLE.NAME'],
			key: 'name',
			renderCell: (data, key) => (
				<td key={key}>
					<div className="d-flex justify-content-start table_text">
						{data?.label || '-'}
					</div>
				</td>
			),
		},
		{
			stringId: 'ASSETS',
			label: STRINGS['ASSETS'],
			key: 'assets',
			renderCell: (data, key) => (
				<td key={key}>
					<div className="d-flex justify-content-center">
						<div className="table-content">
							<Coin iconId={coins[data?.currency]?.icon_id} type="CS7" />
							<span className="text-nowrap mt-1">
								{`${
									coins[data?.currency]?.fullname
								} (${data?.currency?.toUpperCase()})`}
							</span>
						</div>
					</div>
				</td>
			),
		},
		{
			stringId: 'WITHDRAWALS_FORM_NETWORK_LABEL',
			label: STRINGS['WITHDRAWALS_FORM_NETWORK_LABEL'],
			key: 'network',
			renderCell: (data, key) => {
				let network =
					coins[data?.network]?.network &&
					coins[data?.network]?.network !== 'other'
						? getNetworkNameByKey(coins[data?.network]?.network)
						: coins[data?.currency]?.symbol?.toUpperCase();
				return (
					<td key={key}>
						<div className="d-flex justify-content-center">
							<span className="network-field">{network}</span>
							<Coin
								iconId={
									coins[data?.network]?.icon_id
										? coins[data?.network]?.icon_id
										: coins[data?.currency]?.icon_id
								}
								type="CS2"
							/>
						</div>
					</td>
				);
			},
		},
		{
			stringId: 'WITHDRAW_PAGE.WITHDRAWAL_CONFIRM_ADDRESS',
			label: STRINGS['WITHDRAW_PAGE.WITHDRAWAL_CONFIRM_ADDRESS'],
			key: 'address',
			renderCell: (data, key) => (
				<td key={key} className="address-field-wrapper">
					<div className="d-flex justify-content-center">
						<div className="align-items-center address-content">
							<span>{data?.address}</span>
							<CopyToClipboard
								text={data?.address}
								onCopy={() => {
									handleCopy();
								}}
							>
								<Button className="copy-btn">
									<div className="remove-btn">
										<EditWrapper stringId="REFERRAL_LINK.COPY">
											{STRINGS['REFERRAL_LINK.COPY']}
										</EditWrapper>
									</div>
								</Button>
							</CopyToClipboard>
						</div>
					</div>
				</td>
			),
		},
		{
			stringId: 'ADDRESS_BOOK.DATE_ADDED',
			label: STRINGS['ADDRESS_BOOK.DATE_ADDED'],
			key: 'date added',
			renderCell: (data, key) => (
				<td key={key}>
					<div className="d-flex justify-content-center">
						{data?.created_at
							? new Date(data.created_at)
									.toISOString()
									.slice(0, 10)
									.replace(/-/g, '/')
							: '-'}
					</div>
				</td>
			),
		},
		{
			stringId: 'ADDRESS_BOOK.REMOVE',
			label: STRINGS['ADDRESS_BOOK.REMOVE'],
			key: 'remove',
			renderCell: (data, key) => (
				<td key={key}>
					<div className="d-flex justify-content-end">
						<div
							className="link-content fs-13 text-uppercase remove-btn"
							onClick={() => onHandleAddressBookDetails(data, 'revoke')}
						>
							<EditWrapper stringId="ADDRESS_BOOK.REMOVE">
								{STRINGS['ADDRESS_BOOK.REMOVE']}
							</EditWrapper>
						</div>
					</div>
				</td>
			),
		},
	];

	const coinLength =
		coins[selectedAsset?.selectedCurrency]?.network &&
		coins[selectedAsset?.selectedCurrency]?.network?.split(',');
	let network =
		coins[selectedAsset?.selectedCurrency]?.network &&
		coins[selectedAsset?.selectedCurrency]?.network !== 'other'
			? coins[selectedAsset?.selectedCurrency]?.network
			: coins[selectedAsset?.selectedCurrency]?.symbol;
	const networkIcon = coins[network]?.icon_id;

	useEffect(() => {
		const getAddress = async () => {
			try {
				setIsLoading(false);
				const res = await getAddressBookDetails();
				setIsLoading(true);
				setGetUserData(res?.addresses);
			} catch (error) {
				console.error(error);
			}
		};
		getAddress();
	}, []);

	const onGoBack = () => {
		return router.push('/wallet');
	};

	const handleCopy = () => {
		setSnackNotification({
			icon: icons.COPY_NOTIFICATION,
			content: STRINGS['COPY_SUCCESS_TEXT'],
			timer: 2000,
		});
	};

	const onHandleClose = (currStep) => {
		setRenderPopUps((prev) => ({ ...prev, [currStep]: false }));
		setSelectedAsset((prev) => ({
			...prev,
			selectedCurrency: null,
			networkOptions: null,
		}));
		setIsValidAddress(null);
		setUserLabel('');
	};

	const onHandlePopUpBtn = (previousStep, nextStep) => {
		setRenderPopUps((prev) => ({ ...prev, [previousStep]: false }));
		setRenderPopUps((prev) => ({ ...prev, [nextStep]: true }));
		if (previousStep === 'step2' && nextStep === 'step1') {
			setSelectedAsset((prev) => ({
				...prev,
				selectedCurrency: null,
				networkOptions: null,
			}));
			setIsValidAddress(null);
		}
		if (previousStep === 'step3' && nextStep === 'step2') {
			setUserLabel('');
		}
	};

	const onHandleAddressBookDetails = async (data, type) => {
		const selectedNetwork = selectedAsset?.networkOptions
			? renderNetworkField(selectedAsset?.networkOptions)
			: network;
		const hasAsset = getUserData.some(
			(val) =>
				val?.currency === selectedAsset?.selectedCurrency &&
				val?.network === selectedNetwork
		);

		const filterData = () =>
			getUserData.filter((val) => val.label !== data.label);
		const removeCreatedAt = (arr) => arr.map(({ created_at, ...rest }) => rest);

		if (type === 'revoke') {
			const filteredData = filterData();
			const restFilteredData = removeCreatedAt(filteredData);
			setGetUserData(filteredData);

			try {
				await setUserLabelAndAddress({ addresses: restFilteredData });
			} catch (error) {
				console.error(error);
			}
		} else if (!hasAsset) {
			const currValue = {
				label: userLabel,
				address: selectedAsset?.address,
				network: selectedNetwork,
				currency: selectedAsset?.selectedCurrency,
			};
			const restGetUserData = removeCreatedAt(getUserData);
			setGetUserData([
				...getUserData,
				{ ...currValue, created_at: new Date().toISOString() },
			]);

			try {
				await setUserLabelAndAddress({
					addresses: [...restGetUserData, currValue],
				});
			} catch (error) {
				console.error(error);
			}
		} else {
			message.error(STRINGS['ADDRESS_BOOK.ASSET_ALREADY_HAVE_ADDRESS']);
		}

		onHandleClose('step3');
	};

	const onHandleUserLabel = () => {
		const isValidLabel = getUserData.filter((data) => userLabel === data.label);
		return (
			(isValidLabel && isValidLabel.length) ||
			!/^(?=.*[a-zA-Z])[a-zA-Z0-9]{3,15}$/.test(userLabel)
		);
	};

	return (
		<div className="address-book-wrapper">
			{renderPopUps.step1 && (
				<Dialog
					className="address_book_popup_wrapper add_withdrawal_address_wrapper"
					isOpen={renderPopUps.step1}
					onCloseDialog={() => {
						onHandleClose('step1');
					}}
				>
					<div className="address-book-popup-wrapper">
						<div>
							<div className="address-book-header-content">
								<div className="address-book-title">
									<EditWrapper stringId="ADDRESS_BOOK.ADD_WITHDRAW_ADDRESS">
										{STRINGS['ADDRESS_BOOK.ADD_WITHDRAW_ADDRESS']}
									</EditWrapper>
								</div>
								<div>
									<EditWrapper stringId="ADDRESS_BOOK.ADD_WITHDRAW_ADDRESS_DESC_1">
										{STRINGS['ADDRESS_BOOK.ADD_WITHDRAW_ADDRESS_DESC_1']}
									</EditWrapper>
								</div>
								<div>
									<EditWrapper stringId="ADDRESS_BOOK.ADD_WITHDRAW_ADDRESS_DESC_2">
										{STRINGS['ADDRESS_BOOK.ADD_WITHDRAW_ADDRESS_DESC_2']}
									</EditWrapper>
								</div>
							</div>
							<div className="address-book-content">
								<GenerateAddress
									topAssets={topAssets}
									setTopAssets={setTopAssets}
									selectedAsset={selectedAsset}
									setSelectedAsset={setSelectedAsset}
									assets={assets}
									pinnedAssets={pinnedAssets}
									coins={coins}
									coinLength={coinLength}
									network={network}
									networkIcon={networkIcon}
									isValidAddress={isValidAddress}
									setIsValidAddress={setIsValidAddress}
								/>
							</div>
							<div className="address-book-popup-button-wrapper">
								<RenderBtn
									string="REFERRAL_LINK.BACK"
									buttonClassName="back-btn"
									onHandleClick={() => onHandleClose('step1')}
								/>
								<RenderBtn
									string="REFERRAL_LINK.NEXT"
									buttonClassName="next-btn"
									disabled={!isValidAddress}
									onHandleClick={() => onHandlePopUpBtn('step1', 'step2')}
								/>
							</div>
						</div>
					</div>
				</Dialog>
			)}
			{renderPopUps.step2 && (
				<Dialog
					isOpen={renderPopUps.step2}
					onCloseDialog={() => onHandleClose('step2')}
					className="address_book_popup_wrapper"
				>
					<div>
						<div className="name-address-popup-wrapper">
							<div className="name-address-header-content">
								<div className="address-book-title confirm-title-text">
									<EditWrapper stringId="ADDRESS_BOOK.NAME_YOUR_ADDRESS_TITLE">
										{STRINGS['ADDRESS_BOOK.NAME_YOUR_ADDRESS_TITLE']}
									</EditWrapper>
								</div>
								<div>
									<EditWrapper stringId="ADDRESS_BOOK.NAME_YOUR_ADDRESS_DESC">
										{STRINGS['ADDRESS_BOOK.NAME_YOUR_ADDRESS_DESC']}
									</EditWrapper>
								</div>
							</div>
							<div className="address-book-field mt-3">
								<div className="confirm-title-text">
									<EditWrapper stringId="ADDRESS_BOOK.USER_LABEL">
										{STRINGS['ADDRESS_BOOK.USER_LABEL']}
									</EditWrapper>
								</div>
								<div className="address-book-input-field">
									<Input
										placeholder={STRINGS['ADDRESS_BOOK.USER_FIELD_PLACEHOLDER']}
										onChange={(e) => setUserLabel(e.target.value)}
										value={userLabel}
									/>
								</div>
							</div>
							<div className="mt-4 mb-3 address-book-detail-line"></div>
							<div className="selected-assets-content">
								<div className="assets-field">
									<div className="confirm-title-text">
										<EditWrapper stringId="ASSETS">
											{STRINGS['ASSETS']}:
										</EditWrapper>
									</div>
									<div className="selected-asset">
										<Coin
											iconId={coins[selectedAsset?.selectedCurrency]?.icon_id}
											type="CS2"
										/>
										<span>{`${
											coins[selectedAsset?.selectedCurrency]?.fullname
										} (${selectedAsset?.selectedCurrency?.toUpperCase()})`}</span>
									</div>
								</div>
								<div className="assets-field">
									<div className="confirm-title-text">
										<EditWrapper stringId="WITHDRAWALS_FORM_NETWORK_LABEL">
											{STRINGS['WITHDRAWALS_FORM_NETWORK_LABEL']}:
										</EditWrapper>
									</div>
									<div>
										<span>
											{' '}
											{coinLength?.length === 1 ? (
												renderNetworkWithLabel(networkIcon, network)
											) : coinLength?.length > 1 ? (
												<div className="selected-network">
													<span>{selectedAsset?.networkOptions}</span>
													{networkList.map((data) =>
														data.network === selectedAsset?.networkOptions ? (
															<Coin iconId={data.iconId} type="CS2" />
														) : null
													)}
												</div>
											) : coins[network]?.network ? (
												coins[network]?.network?.toUpperCase()
											) : (
												coins[network]?.symbol?.toUpperCase()
											)}
										</span>
									</div>
								</div>
								<div className="assets-field mt-4">
									<div className="confirm-title-text">
										<EditWrapper stringId="WITHDRAW_PAGE.WITHDRAWAL_CONFIRM_ADDRESS">
											{STRINGS['WITHDRAW_PAGE.WITHDRAWAL_CONFIRM_ADDRESS']}:
										</EditWrapper>
									</div>
									<div className="selected-asset-address">
										<span>{selectedAsset?.address}</span>
									</div>
								</div>
							</div>
							<div className="address-book-popup-button-wrapper">
								<RenderBtn
									string="REFERRAL_LINK.BACK"
									buttonClassName="back-btn"
									onHandleClick={() => onHandlePopUpBtn('step2', 'step1')}
								/>
								<RenderBtn
									string="REFERRAL_LINK.NEXT"
									buttonClassName="next-btn"
									disabled={onHandleUserLabel()}
									onHandleClick={() => onHandlePopUpBtn('step2', 'step3')}
								/>
							</div>
						</div>
					</div>
				</Dialog>
			)}
			{renderPopUps.step3 && (
				<Dialog
					isOpen={renderPopUps.step3}
					onCloseDialog={() => onHandleClose('step3')}
					className="address_book_popup_wrapper"
				>
					<div className="check-confirm-content-wrapper">
						<div className="confirm-header-wrapper">
							<div className="address-book-title">
								<EditWrapper stringId="ADDRESS_BOOK.CHECK_AND_CONFIRM">
									{STRINGS['ADDRESS_BOOK.CHECK_AND_CONFIRM']}
								</EditWrapper>
							</div>
							<div>
								<EditWrapper stringId="ADDRESS_BOOK.WARNING_ADDRESS">
									{STRINGS['ADDRESS_BOOK.WARNING_ADDRESS']}
								</EditWrapper>
							</div>
						</div>
						<div className="selected-assets-content mt-4">
							<div className="assets-field confirm_name_detail">
								<div className="confirm-title-text">
									<EditWrapper stringId="DEVELOPERS_TOKENS_TABLE.NAME">
										{STRINGS['DEVELOPERS_TOKENS_TABLE.NAME']}:
									</EditWrapper>
								</div>
								<div>
									<span> {userLabel}</span>
								</div>
							</div>
							<div className="assets-content">
								<div className="assets-field">
									<div className="confirm-title-text">
										<EditWrapper stringId="ASSETS">
											{STRINGS['ASSETS']}:
										</EditWrapper>
									</div>
									<div className="selected-asset">
										<Coin
											iconId={coins[selectedAsset?.selectedCurrency]?.icon_id}
											type="CS2"
										/>
										<span>{`${
											coins[selectedAsset?.selectedCurrency]?.fullname
										} (${selectedAsset?.selectedCurrency?.toUpperCase()})`}</span>
									</div>
								</div>
								<div className="assets-field">
									<div className="confirm-title-text">
										<EditWrapper stringId="WITHDRAWALS_FORM_NETWORK_LABEL">
											{STRINGS['WITHDRAWALS_FORM_NETWORK_LABEL']}:
										</EditWrapper>
									</div>
									<div>
										<span>
											{' '}
											{coinLength?.length === 1 ? (
												renderNetworkWithLabel(networkIcon, network)
											) : coinLength?.length > 1 ? (
												<div className="selected-network">
													<span>{selectedAsset?.networkOptions}</span>
													{networkList.map((data) =>
														data.network === selectedAsset?.networkOptions ? (
															<Coin iconId={data.iconId} type="CS2" />
														) : null
													)}
												</div>
											) : coins[network]?.network ? (
												coins[network]?.network?.toUpperCase()
											) : (
												coins[network]?.symbol?.toUpperCase()
											)}
										</span>
									</div>
								</div>
								<div className="mt-3 mb-3 address-book-detail-line"></div>
								<div className="assets-field">
									<div className="confirm-title-text">
										<EditWrapper stringId="WITHDRAW_PAGE.WITHDRAWAL_CONFIRM_ADDRESS">
											{STRINGS['WITHDRAW_PAGE.WITHDRAWAL_CONFIRM_ADDRESS']}:
										</EditWrapper>
									</div>
									<div className="selected-asset-address">
										<span>{selectedAsset?.address}</span>
									</div>
								</div>
							</div>
						</div>
						<div className="warning-message-wrapper">
							<ExclamationCircleFilled />
							<div className="mt-1">
								<EditWrapper stringId="ADDRESS_BOOK.ENSURE_DESC">
									{STRINGS['ADDRESS_BOOK.ENSURE_DESC']}
								</EditWrapper>
							</div>
						</div>
						<div className="address-book-popup-button-wrapper">
							<RenderBtn
								string="REFERRAL_LINK.BACK"
								buttonClassName="back-btn"
								onHandleClick={() => onHandlePopUpBtn('step3', 'step2')}
							/>
							<Button
								className="text-uppercase next-btn"
								type="default"
								onClick={() => onHandleAddressBookDetails(null, 'confirm')}
								disabled={false}
							>
								<EditWrapper stringId={'DUST.CONFIRMATION.CONFIRM'}>
									{STRINGS['DUST.CONFIRMATION.CONFIRM']}
								</EditWrapper>
							</Button>
						</div>
					</div>
				</Dialog>
			)}
			<div className="address-book-form">
				<div className="address-book-tab-header-content">
					<div>
						<div className="address-book-icon">
							<IconTitle
								stringId="ADDRESS_BOOK.ADDRESS_BOOK_LABEL"
								text={STRINGS['ADDRESS_BOOK.ADDRESS_BOOK_LABEL']}
								textType="title"
								iconPath={ICONS['ADDRESS_BOOK']}
								iconId="ADDRESS_BOOK"
							/>
						</div>
					</div>
				</div>
				<div className="address-book-header-link">
					{renderBackToWallet(onGoBack)}
					{openContactForm &&
						!isMobile &&
						renderNeedHelpAction(
							openContactForm,
							constants.links,
							icons['BLUE_QUESTION'],
							'BLUE_QUESTION'
						)}
				</div>
				<div
					className={
						isMobile
							? 'address-book-content-wrapper'
							: 'address-book-content-wrapper mb-5'
					}
				>
					<div className="address-book-content">
						<div className="address-book-title-text">
							<EditWrapper stringId="ADDRESS_BOOK.WITHDRAWAL_ADDRESS_BOOK">
								{STRINGS['ADDRESS_BOOK.WITHDRAWAL_ADDRESS_BOOK']}
							</EditWrapper>
						</div>
						<div className="">
							<EditWrapper stringId="ADDRESS_BOOK.ADDRESS_BOOK_DESC_1">
								{STRINGS['ADDRESS_BOOK.ADDRESS_BOOK_DESC_1']}
							</EditWrapper>
						</div>
						<div className="">
							<EditWrapper stringId="ADDRESS_BOOK.ADDRESS_BOOK_DESC_2">
								{STRINGS['ADDRESS_BOOK.ADDRESS_BOOK_DESC_2']}
							</EditWrapper>
						</div>
						<span className="blue-link mt-2">
							<EditWrapper stringId="ADDRESS_BOOK.ADD_ADDRESS_LINK">
								<span
									onClick={() =>
										setRenderPopUps((prev) => ({ ...prev, step1: true }))
									}
								>
									{STRINGS['ADDRESS_BOOK.ADD_ADDRESS_LINK']}
								</span>
							</EditWrapper>
						</span>
					</div>
					<div className="address-book-table-wrapper">
						{isLoading ? (
							<Table
								showHeaderNoData={true}
								rowClassName="pt-2 pb-2"
								headers={AddressBookTableData}
								data={getUserData}
								count={getUserData?.length}
								pageSize={10}
								noData={
									<AddressBookEmptyTable setRenderPopUps={setRenderPopUps} />
								}
							/>
						) : (
							<div className="d-flex justify-content-center align-items-center">
								<Spin size="large" />
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (store) => ({
	pinnedAssets: store.app.pinned_assets,
	assets: assetsSelector(store),
	coins: store.app.coins,
	constants: store.app.constants,
});

const mapDispatchToProps = (dispatch) => ({
	setSnackNotification: bindActionCreators(setSnackNotification, dispatch),
	openContactForm: bindActionCreators(openContactForm, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(AddressBook));
