import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, Tabs, message, Table } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import { STATIC_ICONS } from 'config/icons';
import Coins from '../Coins';
import IconToolTip from '../IconToolTip';
import { getNetworkLabelByKey } from 'utils/wallet';
import { Link } from 'react-router';
import { getTabParams } from '../AdminFinancials/Assets';
import RemoveConfirmation from '../Confirmation';
import { updateConstants } from '../Trades/actions';
import { Input } from 'antd';
import { renderAsset } from '../Deposits/utils';
import { CloseOutlined } from '@ant-design/icons';
import { requestAdminData } from 'actions/appActions';
import BurnModal from './Burn';
const TabPane = Tabs.TabPane;

// const basicCoins = ['btc', 'xht', 'eth', 'usdt'];

const Final = ({
	isPreview = false,
	isConfigure = false,
	coinFormData = {},
	handleBack,
	handleConfirmation,
	handleEdit = () => {},
	handleFileChange = () => {},
	setConfigEdit,
	handleDelete = () => {},
	user_id,
	submitting = false,
	handleWithdrawalEdit,
	handleScreenChange,
	isPresentCoin,
	coins,
	selectedCoinSymbol,
	exchange = {},
	constants = {},
	allCoins = {},
	isLoading,
	handleChangeNumber,
	exchangeData,
	onClose,
	handleBurn,
	exchangeUsers,
	userEmails,
	handleMint,
	selectedMarkupAsset = {},
	exchangeCoins,
	setSelectedMarkupAsset = () => {},
}) => {
	let isUpdateRequired = false;
	if (
		(exchange &&
			exchange.plan === 'basic' &&
			coinFormData.type !== 'blockchain') ||
		(exchange &&
			exchange.plan === 'crypto' &&
			coinFormData.type !== 'blockchain')
	) {
		isUpdateRequired = true;
	}
	const { meta = {}, type } = coinFormData;
	let coinData = {};
	allCoins.forEach((item) => {
		if (item.symbol === coinFormData.symbol) {
			coinData = {
				...coinData,
				...item,
			};
		}
	});

	const showMintAndBurnButtons =
		coinFormData?.verified &&
		(coinFormData?.owner_id === user_id || type === 'fiat');

	const { withdrawal_fees = {}, deposit_fees = {} } = coinData;
	const { onramp = {} } = constants;
	const [isUpgrade, setIsUpgrade] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const tabParams = getTabParams();
	const [coinCustomizations, setCoinCustomizations] = useState([]);
	const [selectedCoin, setSelectedCoin] = useState(true);
	const [displayCostumizationModal, setDisplayCostumizationModal] = useState(
		false
	);
	const [activeTab, setActiveTab] = useState('0');

	useEffect(() => {
		if (exchange?.plan === 'fiat' || exchange?.plan === 'boost') {
			setIsUpgrade(true);
		}
	}, [exchange]);

	useEffect(() => {
		if (Object.keys(selectedMarkupAsset)?.length) {
			setSelectedMarkupAsset({});
			onHandleActiveTab('1');
		}
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedMarkupAsset]);

	const renderNetworkFee = ([key, data], index) => {
		const network = getNetworkLabelByKey(key);
		const keyArr = withdrawal_fees && Object.keys(withdrawal_fees).length;

		return (
			<div key={key} className="pb-3">
				{network ? (
					<div>
						<b className="caps-first">network</b>: {network}
					</div>
				) : null}
				<Fragment>
					{data &&
						Object.entries(data).map(([key, value]) => {
							if (key === 'active' && withdrawal_fees) {
								return (
									<div key={key}>
										<b>Status:</b> {value ? 'Active' : 'Not active'}
									</div>
								);
							} else if (!['levels', 'min', 'max', 'type'].includes(key)) {
								const valueText = value;
								return (
									<div key={key}>
										<b className="caps-first">{key}</b>: {valueText}
									</div>
								);
							}
							return <></>;
						})}
					{keyArr > 1 && index === 0 ? (
						<div className="border-separator"></div>
					) : null}
				</Fragment>
			</div>
		);
	};

	const renderFees = (fees) => {
		return Object.entries(fees).map(renderNetworkFee);
	};

	const handleMoveBack = () => {
		const isExchangeCoin = !!coins.filter(
			(item) => item.symbol === selectedCoinSymbol
		).length;
		if (coinFormData.id && isPresentCoin) {
			handleScreenChange('step1');
		} else if (!coinFormData.id || isExchangeCoin) {
			handleBack(true);
		} else {
			handleScreenChange('edit_withdrawal_fees');
		}
	};

	const isOwner = coinFormData.owner_id === user_id;
	const networkMap = {
		eth: 'Ethereum (ETH)',
		trx: 'Tron (TRX)',
		bnb: 'Binance Smart Chain (BNB)',
		matic: 'Polygon (MATIC)',
		btc: 'Bitcoin (BTC)',
		ltc: 'Litecoin (LTC)',
		doge: 'Dogecoin (DOGE)',
		sol: 'Solana (SOL)',
		ada: 'Cardano (ADA)',
		dot: 'Polkadot (DOT)',
		avax: 'Avalanche (AVAX)',
		xrp: 'Ripple (XRP)',
		xlm: 'Stellar (XLM)',
		etc: 'Ethereum Classic (ETC)',
		bch: 'Bitcoin Cash (BCH)',
		usdt: 'Tether (USDT)',
		usdc: 'USD Coin (USDC)',
		dai: 'Dai (DAI)',
		shib: 'Shiba Inu (SHIB)',
		op: 'Optimism (OP)',
		arb: 'Arbitrum (ARB)',
		ftm: 'Fantom (FTM)',
		cro: 'Cronos (CRO)',
		apt: 'Aptos (APT)',
		sui: 'Sui (SUI)',
		near: 'Near Protocol (NEAR)',
		icp: 'Internet Computer (ICP)',
		egld: 'MultiversX (EGLD)',
		algo: 'Algorand (ALGO)',
		kas: 'Kaspa (KAS)',
		mina: 'Mina Protocol (MINA)',
		ton: 'Toncoin (TON)',
		vet: 'VeChain (VET)',
		qnt: 'Quant (QNT)',
		hbar: 'Hedera (HBAR)',
		rune: 'THORChain (RUNE)',
		zec: 'Zcash (ZEC)',
		enj: 'Enjin Coin (ENJ)',
		sand: 'The Sandbox (SAND)',
		mana: 'Decentraland (MANA)',
		axs: 'Axie Infinity (AXS)',
		gala: 'GALA (GALA)',
		aave: 'Aave (AAVE)',
		uni: 'Uniswap (UNI)',
		comp: 'Compound (COMP)',
		mkr: 'Maker (MKR)',
		ldo: 'Lido DAO (LDO)',
		snx: 'Synthetix (SNX)',
		yfi: 'Yearn Finance (YFI)',
		xht: 'HollaEx (XHT)',
	};

	const columns = [
		{
			title: 'Network',
			dataIndex: 'symbol',
			key: 'symbol',
			render: (user_id, data) => {
				return <div className="d-flex">{data?.net}</div>;
			},
		},
		{
			title: 'Name',
			dataIndex: 'fullname',
			key: 'fullname',
			render: (user_id, data) => {
				return (
					<div className="d-flex">
						{networkMap[data?.net?.toLowerCase()] || data?.fullname}
					</div>
				);
			},
		},
		{
			title: 'Withdrawal Fee Markup',
			dataIndex: 'withdrawal_fee_markup',
			key: 'withdrawal_fee_markup',
			render: (user_id, data) => {
				return (
					<div className="d-flex">{data?.withdrawal_fee_markup || '-'}</div>
				);
			},
		},
		{
			title: 'Deposit Fee Markup',
			dataIndex: 'deposit_fee_markup',
			key: 'deposit_fee_markup',
			render: (user_id, data) => {
				return <div className="d-flex">{data?.deposit_fee_markup || '-'}</div>;
			},
		},
		{
			title: 'Edit',
			dataIndex: 'edit',
			key: 'edit',
			render: (user_id, data) => {
				return (
					<div className="d-flex">
						<Button
							onClick={(e) => {
								e.stopPropagation();
								setSelectedCoin(data);
								setDisplayCostumizationModal(true);
							}}
							style={{ backgroundColor: '#CB7300', color: 'white' }}
						>
							Edit
						</Button>
					</div>
				);
			},
		},
	];

	const handleCostumizationModal = () => {
		setDisplayCostumizationModal(false);
		setSelectedCoin();
	};

	const requesCoinConfiguration = () => {
		requestAdminData()
			.then((response) => {
				const data = response?.data?.kit?.coin_customizations || {};
				setCoinCustomizations(data);
			})
			.catch(() => {});
	};
	const onHandleActiveTab = (key) => {
		setActiveTab(key);
	};
	useEffect(() => {
		// setIsLoading(true);
		requesCoinConfiguration();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<Tabs
			defaultActiveKey="0"
			activeKey={activeTab}
			onChange={onHandleActiveTab}
		>
			<TabPane tab={`${coinFormData?.symbol?.toUpperCase()} Summary`} key="0">
				<Fragment>
					<div className="title">
						{isPreview || isConfigure
							? `Manage ${coinFormData.symbol}`
							: 'Add Asset'}
					</div>
					{isUpdateRequired ? (
						<div className="red-warning">
							<div className="icon-wrapper">
								<div className="image-crypto">
									<img
										className="fiat-icon"
										src={STATIC_ICONS['CLOUD_PLAN_CRYPTO_PRO_FIAT_RAMP']}
										alt="new_coin"
									/>
								</div>
							</div>
							<div>
								Only upgraded plans can freely add other digital assets. Visit
								the billing page and upgrade your exchange plan to either{' '}
								<Link className="link-content" to="/billing">
									Crypto Pro
								</Link>
								,{' '}
								<Link className="link-content" to="/billing">
									Fiat Ramp
								</Link>{' '}
								or{' '}
								<Link className="link-content" to="/billing">
									Boost
								</Link>
								.
							</div>
						</div>
					) : !isPreview && !isConfigure ? (
						type === 'fiat' ? (
							<div className="grey-warning">
								<div className="icon-wrapper">
									<img
										className="fiat-icon"
										src={STATIC_ICONS.CURRENCY_SYMBOL}
										alt="new_coin"
									/>
								</div>
								<div>
									<p>
										Since fiat currencies aren't on the blockchain they are the
										full responsibility of the exchange operator to managed for
										solvency.
									</p>
									<p>
										In order to facilitate FIAT deposits and withdrawals a
										banking or payment system must be connected to your
										exchange.
									</p>
								</div>
							</div>
						) : (
							<div className="grey-warning">
								<div className="warning-text">!</div>
								<div>
									<div className="sub-title">
										Please check the details carefully.
									</div>
									<div>
										To avoid delays it is important to take the time to review
										the accuracy of the details below
									</div>
								</div>
							</div>
						)
					) : null}
					<div className="preview-coin-container" style={{ width: '30rem' }}>
						<div className="preview-content preview-content-align">
							{!isPreview && !isConfigure ? (
								<span className="preview-color-tip sub-title">
									Color
									<span className="line"></span>
								</span>
							) : null}
							<Coins
								nohover
								large
								small
								fullname={coinFormData.fullname}
								type={(coinFormData.symbol || '').toLowerCase()}
								color={meta.color}
							/>
							{isConfigure ? (
								<Fragment>
									<div className="edit-content">
										<b>Color: </b>
										{meta.color}
									</div>
									<Button
										className="green-btn"
										type="primary"
										onClick={() => setConfigEdit('edit-color')}
									>
										Edit
									</Button>
									<div className="description-small">
										This will be viewed on your wallet and transaction history
										page
									</div>
								</Fragment>
							) : null}
							{!isPreview && !isConfigure ? (
								<Fragment>
									<span className="preview-symbol-tip sub-title">
										<span className="line"></span>
										Symbol
									</span>
									<span className="preview-name-tip sub-title">
										<span className="line"></span>
										Name
									</span>
								</Fragment>
							) : null}
						</div>
						<div className="preview-content">
							{isConfigure ? (
								<Fragment>
									{coinFormData.logo ? (
										<img
											src={coinFormData.logo}
											alt="coins"
											className="icon-preview"
										/>
									) : (
										<div className="icon-upload">
											<div className="file-container">
												<label>
													<UploadOutlined
														style={{ fontSize: '94px', color: '#808080' }}
													/>
													<input
														type="file"
														onChange={(e) => handleFileChange(e, 'logo')}
														name="logo"
													/>
												</label>
											</div>
										</div>
									)}
								</Fragment>
							) : (
								<img
									src={
										coinFormData.logo
											? coinFormData.logo
											: STATIC_ICONS.COIN_ICONS[
													(coinFormData.symbol || '').toLowerCase()
											  ]
											? STATIC_ICONS.COIN_ICONS[
													(coinFormData.symbol || '').toLowerCase()
											  ]
											: STATIC_ICONS.MISSING_ICON
									}
									alt="coins"
									className="icon-preview"
								/>
							)}
							{isConfigure ? (
								<Fragment>
									<div className="edit-content">
										<b>Icon: </b>
										{coinFormData.iconName}
									</div>
									<div className="icon-upload">
										<div className="file-container">
											<label>
												<div className="upload-box">Upload</div>
												<input
													type="file"
													onChange={(e) => handleFileChange(e, 'logo')}
													name="logo"
												/>
											</label>
										</div>
									</div>
									<div className="description-small">
										Icon will be used in various trading related pages
									</div>
								</Fragment>
							) : null}
							{!isPreview && !isConfigure ? (
								<span className="preview-icon-tip sub-title">
									<span className="line"></span>
									Icon
								</span>
							) : null}
						</div>
					</div>
					<div className="preview-detail-container">
						<div className="title">Asset info</div>
						<div>
							<b>Name:</b> {coinFormData.fullname}
						</div>
						<div>
							<b>Symbol:</b> {(coinFormData.symbol || '').toUpperCase()}
						</div>
						<div className="type-wrap">
							<div className="warning-container">
								<b>Type: </b>
								<span className="ml-2">{coinFormData.type}</span>
								{isPreview &&
								!coinFormData.verified &&
								coinFormData.created_by === user_id ? (
									<IconToolTip
										type="warning"
										tip="This asset is in pending verification"
										onClick={() => handleEdit(coinFormData)}
									/>
								) : null}
							</div>
						</div>
						{coinFormData.network ? (
							<div>
								<b>Network:</b> {coinFormData.network}
							</div>
						) : null}
						{coinFormData.standard ? (
							<div>
								<b>Standard:</b> {coinFormData.standard}
							</div>
						) : null}
						{type === 'blockchain' ? (
							<div>
								<b>Contract:</b> {coinFormData.contract}
							</div>
						) : null}
						{!isConfigure ? (
							<div>
								<b>Color:</b> {meta.color}
							</div>
						) : (
							<div className="btn-wrapper">
								<Button
									className="green-btn"
									type="primary"
									onClick={() => setConfigEdit('edit-info')}
								>
									Edit
								</Button>
							</div>
						)}
					</div>
					<div className="preview-detail-container">
						<div className="title">Parameters</div>
						<div>
							<b>Status:</b> {coinFormData.active ? 'Active' : 'Not active'}
						</div>
						<div>
							<b>Estimated Price:</b> {coinFormData.estimated_price}
						</div>
						{/* <div>
					<b>Fee for withdrawal:</b> {coinFormData.withdrawal_fee}
				</div> */}
						<div>
							<b>Minimum amount:</b> {coinFormData.min}
						</div>
						<div>
							<b>Maximum amount:</b> {coinFormData.max}
						</div>
						<div>
							<b>Increment Amount (e.g. 0.0001):</b>{' '}
							{coinFormData.increment_unit}
						</div>
						{/* <div>
					<b>Decimal points:</b> {meta.decimal_points}
				</div> */}
						{isConfigure ? (
							<div className="btn-wrapper">
								<Button
									className="green-btn"
									type="primary"
									onClick={() => setConfigEdit('edit-params')}
								>
									Edit
								</Button>
							</div>
						) : null}
					</div>
					<div className="preview-detail-container">
						<div className="title">Withdrawal Fee</div>
						<div>
							{withdrawal_fees ? (
								<div>{renderFees(withdrawal_fees)}</div>
							) : (
								<Fragment>
									<b>{coinFormData.symbol}:</b> {coinFormData.withdrawal_fee}
								</Fragment>
							)}
							{isConfigure && (
								<div className="btn-wrapper">
									<Button
										className="green-btn mb-3"
										type="primary"
										onClick={() => handleWithdrawalEdit('withdraw')}
										disabled={!isOwner}
									>
										Edit
									</Button>
								</div>
							)}
						</div>
						<div className="preview-detail-container pl-0">
							<div className="title">Deposit Fee</div>
							<div>
								{deposit_fees && <div>{renderFees(deposit_fees)}</div>}
								{isConfigure && (
									<div className="btn-wrapper">
										<Button
											className="green-btn"
											type="primary"
											onClick={() => handleWithdrawalEdit('deposit')}
											disabled={!isOwner}
										>
											Edit
										</Button>
									</div>
								)}
							</div>
						</div>
						{(tabParams?.isFiat === 'onRamp' ||
							tabParams?.isFiat === 'offRamp') && (
							<div>
								<div className="preview-detail-container"></div>
								<div className="finalfiatwrapper">
									<div className="title">Fiat ramps</div>
									{!isUpgrade ? (
										<>
											<Link
												className="fiatlink"
												to="/admin/fiat?tab=2&isAssetHome=true"
											>
												View fiat controls
											</Link>
											<div className="d-flex ml-4">
												<div className="d-flex align-items-center justify-content-between upgrade-section my-4">
													<div>
														<div className="font-weight-bold">
															Add fiat deposits & withdrawals
														</div>
														<div>Allow your users to send USD & other fiat</div>
													</div>
													<div className="ml-5 button-wrapper">
														<a
															href="https://dash.hollaex.com/billing"
															target="_blank"
															rel="noopener noreferrer"
														>
															<Button type="primary" className="w-100">
																Upgrade Now
															</Button>
														</a>
													</div>
												</div>
											</div>
										</>
									) : (
										Object.keys(onramp).filter(
											(item) => item === tabParams?.symbol
										).length && (
											<div className="mb-3">
												{Object.keys(onramp[tabParams?.symbol]).map(
													(val, i) => {
														let name = '';
														if (
															onramp[tabParams?.symbol]?.[val]?.type ===
															'manual'
														) {
															name =
																onramp[tabParams?.symbol]?.[val]?.data[0][0]
																	.value;
														} else {
															name = onramp[tabParams?.symbol]?.[val]?.data;
														}
														return (
															<div className="d-flex align-items-center mt-3">
																On-ramp {i + 1}: {name}
																<span className="small-circle mr-2 ml-2 d-flex"></span>
																<span>PUBLISHED</span>
															</div>
														);
													}
												)}
												<div className="mt-3">
													<Link
														className="fiatlink"
														to="/admin/fiat?tab=2&isAssetHome=true"
													>
														View fiat controls
													</Link>
												</div>
											</div>
										)
									)}
								</div>
							</div>
						)}
					</div>
					{isPreview || isConfigure ? (
						<div className="preview-detail-container">
							<div className="title">Manage</div>
							<div className="btn-wrapper">
								<Button
									type="danger"
									onClick={() => setIsVisible(true)}
									disabled={submitting}
								>
									Remove
								</Button>
								<div className="separator"></div>
								<div className="description-small remove">
									Removing this coin will delist this coin from your exchange.
									Make sure you remove any associated pairs first. Use with
									caution!
								</div>
							</div>
						</div>
					) : null}
					{!isPreview && !isConfigure ? (
						<div className="btn-wrapper">
							<Button
								className="green-btn"
								type="primary"
								onClick={handleMoveBack}
							>
								Back
							</Button>
							<div className="separator"></div>
							<Button
								type="primary"
								onClick={handleConfirmation}
								disabled={isUpdateRequired}
							/>
							<Button
								className="green-btn"
								type="primary"
								onClick={handleConfirmation}
							>
								Confirm
							</Button>
						</div>
					) : null}
					{isVisible ? (
						<Modal
							visible={isVisible}
							footer={null}
							onCancel={() => setIsVisible(false)}
						>
							<RemoveConfirmation
								onCancel={setIsVisible}
								onHandleRemoveAsset={handleDelete}
								removeCoin={coinFormData}
								removeContent={'Assets'}
								isLoading={isLoading}
							/>
						</Modal>
					) : null}
				</Fragment>
			</TabPane>
			<TabPane
				tab={`${coinFormData?.symbol?.toUpperCase()} Fee Markups`}
				key="1"
			>
				<div style={{ position: 'absolute' }}>
					<h2>{coinFormData?.symbol?.toUpperCase()} Fee Markups</h2>
					<h5>
						Below are the blockchain protocols that this asset(
						{coinFormData?.symbol?.toUpperCase()}) operates on for deposits and
						withdrawals
					</h5>

					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							gap: 20,
							marginBottom: 20,
						}}
					>
						<div>
							<Coins
								nohover
								large
								small
								fullname={coinFormData.fullname}
								type={(coinFormData.symbol || '').toLowerCase()}
								color={meta.color}
							/>
						</div>
						{coinFormData?.network?.split(',')?.map((net) => {
							return (
								<div style={{ fontWeight: 'bold' }}>
									<div>{networkMap[net.trim()] || net}</div>
									<div style={{ color: 'green' }}>Enabled</div>
								</div>
							);
						})}
					</div>

					<h4>Chain markup fee:</h4>
					<div style={{ marginBottom: 15 }}>
						You can adjust withdrawal markup fee for each specific blockchain
						for this coin. This fee is an additional fee added to the default
						network fee (blockchain fee) and is a fee collected as as source of
						revenue by the exchange operators.
					</div>

					<Table
						className="blue-admin-table"
						columns={columns}
						dataSource={coinFormData?.network?.split(',')?.map((net) => {
							return {
								symbol: coinFormData.symbol,
								net: net?.toUpperCase(),
								fullname: coinFormData.fullname,
								withdrawal_fee_markup:
									coinCustomizations[coinFormData?.symbol]?.fee_markups?.[
										net?.toLowerCase()
									]?.withdrawal?.value,
								symbol_withdrawal:
									coinCustomizations[coinFormData?.symbol]?.fee_markups?.[
										net?.toLowerCase()
									]?.withdrawal?.symbol,
								symbol_deposit:
									coinCustomizations[coinFormData?.symbol]?.fee_markups?.[
										net?.toLowerCase()
									]?.deposit?.symbol,
								deposit_fee_markup:
									coinCustomizations[coinFormData?.symbol]?.fee_markups?.[
										net?.toLowerCase()
									]?.deposit?.value,
							};
						})}
						rowKey={(data) => {
							return data.id;
						}}
						pagination={false}
					/>

					{/* <div style={{ marginTop: 15 }}>Looking for universal markup fees?</div>
					<div style={{ textDecoration: 'underline' }} onClick={() => { handleTabChange(1)}} >Click Here</div> */}
				</div>

				{displayCostumizationModal && (
					<Modal
						maskClosable={false}
						closeIcon={<CloseOutlined style={{ color: 'white' }} />}
						bodyStyle={{
							backgroundColor: '#27339D',
						}}
						visible={displayCostumizationModal}
						footer={null}
						onCancel={() => {
							handleCostumizationModal();
						}}
					>
						<div
							style={{
								fontWeight: '600',
								color: 'white',
								fontSize: 18,
								marginBottom: 10,
							}}
						>
							Edit Coin Fee Markup
						</div>
						<div style={{ marginBottom: 30 }}>
							Set an additional withdrawal fee for this coin to generate extra
							revenue.
						</div>
						<div style={{ marginBottom: 20 }}>
							<div style={{ marginBottom: 10 }}>
								<div className="mb-1">Withdrawal Fee Markup</div>
								<Input
									type="number"
									placeholder="Enter Fee Markup"
									value={selectedCoin.withdrawal_fee_markup}
									onChange={(e) => {
										setSelectedCoin({
											...selectedCoin,
											withdrawal_fee_markup: e.target.value,
										});
									}}
									suffix={renderAsset(selectedCoin?.symbol)}
								/>
							</div>
						</div>
						<div style={{ marginBottom: 20 }}>
							<div style={{ marginBottom: 10 }}>
								<div className="mb-1">Deposit Fee Markup</div>
								<Input
									type="number"
									placeholder="Enter Fee Markup"
									value={selectedCoin.deposit_fee_markup}
									onChange={(e) => {
										setSelectedCoin({
											...selectedCoin,
											deposit_fee_markup: e.target.value,
										});
									}}
									suffix={renderAsset(selectedCoin?.symbol)}
								/>
							</div>
						</div>

						{/* <div style={{ marginBottom: 20 }}>
							<div style={{ marginBottom: 10 }}>
								<div className="mb-1">Fee coin for withdrawal</div>
								<Select
									showSearch
									className="select-box"
									placeholder="Select fee coin"
									value={selectedCoin.symbol_withdrawal}
									style={{ width: 200 }}
									onChange={(e) => {
										setSelectedCoin({
											...selectedCoin,
											symbol_withdrawal: e,
										});
									}}
								>
									{Object.keys(exchangeCoins).map((key) => (
										<Select.Option value={exchangeCoins[key].symbol}>
											{exchangeCoins[key].fullname}
										</Select.Option>
									))}
								</Select>
							</div>
						</div>
						<div style={{ marginBottom: 20 }}>
							<div style={{ marginBottom: 10 }}>
								<div className="mb-1">Fee coin for deposit</div>
								<Select
									showSearch
									className="select-box"
									placeholder="Select fee coin"
									value={selectedCoin.symbol_deposit}
									style={{ width: 200 }}
									onChange={(e) => {
										setSelectedCoin({
											...selectedCoin,
											symbol_deposit: e,
										});
									}}
								>
									{Object.keys(exchangeCoins).map((key) => (
										<Select.Option value={exchangeCoins[key].symbol}>
											{exchangeCoins[key].fullname}
										</Select.Option>
									))}
								</Select>
							</div>
						</div> */}
						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								gap: 15,
								justifyContent: 'space-between',
							}}
						>
							<Button
								onClick={() => {
									handleCostumizationModal();
								}}
								style={{
									backgroundColor: '#288500',
									color: 'white',
									flex: 1,
									height: 35,
								}}
								type="default"
							>
								Back
							</Button>
							<Button
								onClick={async () => {
									try {
										if (selectedCoin.withdrawal_fee_markup) {
											selectedCoin.withdrawal_fee_markup = Number(
												selectedCoin.withdrawal_fee_markup
											);
										}

										if (selectedCoin.deposit_fee_markup) {
											selectedCoin.deposit_fee_markup = Number(
												selectedCoin.deposit_fee_markup
											);
										}

										await updateConstants({
											kit: {
												coin_customizations: {
													...coinCustomizations,
													[selectedCoin.symbol]: {
														symbol: selectedCoin.symbol,
														...coinCustomizations[selectedCoin.symbol],
														fee_markups: {
															...coinCustomizations[selectedCoin.symbol]
																.fee_markups,
															[selectedCoin.net.toLowerCase()]: {
																withdrawal: {
																	...coinCustomizations?.[selectedCoin?.symbol]
																		?.fee_markups?.[
																		selectedCoin?.net?.toLowerCase()
																	]?.withdrawal,
																	value:
																		selectedCoin.withdrawal_fee_markup || 0,
																	symbol:
																		selectedCoin.symbol_withdrawal ||
																		exchangeCoins?.[selectedCoin.symbol]
																			?.withdrawal_fees?.[
																			selectedCoin?.net?.toLowerCase()
																		]?.symbol,
																},
																deposit: {
																	...coinCustomizations?.[selectedCoin?.symbol]
																		?.fee_markups?.[
																		selectedCoin?.net?.toLowerCase()
																	]?.deposit,
																	value: selectedCoin.deposit_fee_markup || 0,
																	symbol:
																		selectedCoin.symbol_deposit ||
																		selectedCoin?.symbol,
																},
															},
														},
													},
												},
											},
										});

										message.success('Changes saved.');
										handleCostumizationModal();
										requesCoinConfiguration();
									} catch (error) {
										message.error(error.data.message);
									}
								}}
								style={{
									backgroundColor: '#288500',
									color: 'white',
									flex: 1,
									height: 35,
								}}
								type="default"
							>
								PROCEED
							</Button>
						</div>
					</Modal>
				)}
			</TabPane>
			{showMintAndBurnButtons && (
				<TabPane tab="Mint" key="2">
					<BurnModal
						type="mint"
						coinFormData={coinFormData}
						exchange={exchangeData}
						handleChangeNumber={handleChangeNumber}
						onClose={onClose}
						handleMint={handleMint}
						exchangeUsers={exchangeUsers}
						userEmails={userEmails}
					/>
				</TabPane>
			)}
			{showMintAndBurnButtons && (
				<TabPane tab="Burn" key="3">
					<BurnModal
						type="burn"
						coinFormData={coinFormData}
						exchange={exchangeData}
						handleChangeNumber={handleChangeNumber}
						onClose={onClose}
						handleBurn={handleBurn}
						exchangeUsers={exchangeUsers}
						userEmails={userEmails}
					/>
				</TabPane>
			)}
		</Tabs>
	);
};

const mapStateToProps = (state) => {
	return {
		exchange: state.asset && state.asset.exchange ? state.asset.exchange : {},
		constants: state.app.constants,
		allCoins: state.asset.allCoins,
		exchangeCoins: state.app.coins,
	};
};

export default connect(mapStateToProps, null)(Final);
