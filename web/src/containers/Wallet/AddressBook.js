import React, { useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { Input, Button } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';

import GenerateAddress from './GenerateAddress';
import withConfig from 'components/ConfigProvider/withConfig';
import icons from 'config/icons/dark';
import CopyToClipboard from 'react-copy-to-clipboard';
import STRINGS from 'config/localizedStrings';
import { Coin, Dialog, EditWrapper, IconTitle, Image, Table } from 'components';
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
	const [selectedAsset, setSelectedAsset] = useState(null);
	const [networkOptions, setNetworkOptions] = useState(null);
	const [isValidAddress, setIsValidAddress] = useState(false);

	const AddressBookTableData = [
		{
			stringId: 'DEVELOPERS_TOKENS_TABLE.NAME',
			label: STRINGS['DEVELOPERS_TOKENS_TABLE.NAME'],
			key: 'name',
			renderCell: (data, key) => (
				<td key={key}>
					<div className="d-flex justify-content-start table_text">
						{data?.addresses?.map((data) => data?.label) || '-'}
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
						{data?.addresses?.map((data) => {
							const asset = getNetworkNameByKey(data?.network);
							const networkIcon = networkList.filter((item) =>
								asset === item?.network ? item?.iconId : null
							);
							return (
								<div className="table-content">
									<Coin
										iconId={
											networkIcon[0]?.iconId
												? networkIcon[0]?.iconId
												: coins[data?.network?.toLowerCase()]?.icon_id
										}
										type="CS2"
									/>
									<span>
										{`${
											coins[data?.network]?.fullname
										} (${data?.network?.toUpperCase()})`}
									</span>
								</div>
							);
						}) || '-'}
					</div>
				</td>
			),
		},
		{
			stringId: 'WITHDRAWALS_FORM_NETWORK_LABEL',
			label: STRINGS['WITHDRAWALS_FORM_NETWORK_LABEL'],
			key: 'network',
			renderCell: (data, key) => (
				<td key={key}>
					<div className="d-flex justify-content-center">
						{data?.addresses?.map((data) => {
							const asset = getNetworkNameByKey(data?.network);
							const networkIcon = networkList.filter((item) =>
								asset === item?.network ? item?.iconId : null
							);
							return (
								<div className="table-content">
									<span>{asset ? asset : data?.network?.toUpperCase()}</span>
									<Coin
										iconId={
											networkIcon[0]?.iconId
												? networkIcon[0]?.iconId
												: coins[data?.network?.toLowerCase()]?.icon_id
										}
										type="CS2"
									/>
								</div>
							);
						}) || '-'}
					</div>
				</td>
			),
		},
		{
			stringId: 'WITHDRAW_PAGE.WITHDRAWAL_CONFIRM_ADDRESS',
			label: STRINGS['WITHDRAW_PAGE.WITHDRAWAL_CONFIRM_ADDRESS'],
			key: 'address',
			renderCell: (data, key) => (
				<td key={key}>
					<div className="d-flex justify-content-center">
						{data?.addresses?.map((data) => {
							return (
								<div className="align-items-center">
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
							);
						}) || '-'}
					</div>
				</td>
			),
		},
		{
			stringId: 'ADDRESS_BOOK.DATE_ADDED',
			label: STRINGS['ADDRESS_BOOK.DATE_ADDED'],
			key: 'date added',
			renderCell: (data, key) => {
				let formatDate = '';
				if (data?.created_at) {
					const date = new Date(data.created_at);
					if (!isNaN(date)) {
						formatDate = date.toISOString().slice(0, 10).replace(/-/g, '/');
					}
				}
				return (
					<td key={key}>
						<div className="d-flex justify-content-center">{formatDate}</div>
					</td>
				);
			},
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
							onClick={() => onHandleRemove()}
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
		coins[selectedAsset]?.network && coins[selectedAsset]?.network.split(',');
	let network =
		coins[selectedAsset]?.network && coins[selectedAsset]?.network !== 'other'
			? coins[selectedAsset]?.network
			: coins[selectedAsset]?.symbol;
	const networkIcon = coins[network]?.icon_id;

	useEffect(() => {
		const getAddress = async () => {
			const res = await getAddressBookDetails();
			setGetUserData(res);
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

	const onHandleRemove = () => {};

	const onHandleClose = (currStep) => {
		setRenderPopUps((prev) => ({ ...prev, [currStep]: false }));
		setSelectedAsset(null);
		setNetworkOptions(null);
		setIsValidAddress(null);
		setUserLabel('');
	};

	const onHandlePopUpBtn = (previousStep, nextStep) => {
		setRenderPopUps((prev) => ({ ...prev, [previousStep]: false }));
		setRenderPopUps((prev) => ({ ...prev, [nextStep]: true }));
		if (previousStep === 'step2' && nextStep === 'step1') {
			setSelectedAsset(null);
			setNetworkOptions(null);
			setIsValidAddress(null);
		}
		if (previousStep === 'step3' && nextStep === 'step2') {
			setUserLabel('');
		}
	};

	const onHandleConfirm = async () => {
		try {
			const selectedNetwork = networkOptions
				? renderNetworkField(networkOptions)
				: network;
			const currValue = {
				addresses: [
					{
						label: userLabel,
						address: isValidAddress,
						network: selectedNetwork,
					},
				],
			};
			const userDetails = { addresses: [getUserData, currValue] };
			await setUserLabelAndAddress(userDetails);
		} catch (error) {
			console.error(error);
		}
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
									networkoptions={networkOptions}
									setNetworkOptions={setNetworkOptions}
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
										<Coin iconId={coins[selectedAsset]?.icon_id} type="CS2" />
										<span>{`${
											coins[selectedAsset].fullname
										} (${selectedAsset.toUpperCase()})`}</span>
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
													<span>{networkOptions}</span>
													{networkList.map((data) =>
														data.network === networkOptions ? (
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
									<div>
										<span>{isValidAddress}</span>
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
									disabled={
										!/^(?=.*[a-zA-Z])[a-zA-Z0-9]{3,15}$/.test(userLabel)
									}
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
										<Coin iconId={coins[selectedAsset].icon_id} type="CS2" />
										<span>{`${
											coins[selectedAsset].fullname
										} (${selectedAsset.toUpperCase()})`}</span>
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
													<span>{networkOptions}</span>
													{networkList.map((data) =>
														data.network === networkOptions ? (
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
									<div>
										<span>{isValidAddress}</span>
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
								onClick={() => onHandleConfirm()}
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
				<div className="address-book-content-wrapper">
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
						{getUserData === 0 && (
							<div className="empty-content-display">
								<div className="no-link-icon">
									<Image
										iconId={'WITHDRAW_TITLE'}
										icon={ICONS['WITHDRAW_TITLE']}
										alt={'text'}
										svgWrapperClassName="withdraw-main-icon"
									/>
								</div>
								<div className="address-book-text">
									<EditWrapper stringId="ADDRESS_BOOK.NO_LINK">
										{STRINGS['ADDRESS_BOOK.NO_LINK']}
									</EditWrapper>
								</div>
								<div
									className="blue-link"
									onClick={() =>
										setRenderPopUps((prev) => ({ ...prev, step1: true }))
									}
								>
									<EditWrapper stringId="ADDRESS_BOOK.ADD_WITHDRAW_ADDRESS">
										{STRINGS['ADDRESS_BOOK.ADD_WITHDRAW_ADDRESS']}
									</EditWrapper>
								</div>
							</div>
						)}
						<Table
							rowClassName="pt-2 pb-2"
							headers={AddressBookTableData}
							data={[getUserData]}
							count={5}
							pageSize={10}
						/>
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
