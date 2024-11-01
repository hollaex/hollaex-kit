import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
	Switch,
	message,
	Button,
	Select,
	Input,
	InputNumber,
	Rate,
} from 'antd';
import {
	PlusSquareOutlined,
	MinusSquareOutlined,
	ExclamationOutlined,
	ExclamationCircleFilled,
	CloseOutlined,
} from '@ant-design/icons';

import './_P2P.scss';
import classnames from 'classnames';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import NoDealsData from './Utilis';
import P2PDashMobile from './P2PDashMobile';
import { EditWrapper, Dialog, Coin } from 'components';
import {
	fetchDeals,
	createTransaction,
	fetchTransactions,
	fetchP2PPaymentMethods,
} from './actions/p2pActions';
import { COUNTRIES_OPTIONS } from 'utils/countries';
import { formatToCurrency } from 'utils/currency';
import { isMobile } from 'react-device-detect';
import { fetchFeedback, fetchP2PProfile } from './actions/p2pActions';
import { Loading } from 'containers/DigitalAssets/components/utils';

const P2PDash = ({
	data,
	onClose,
	coins,
	pairs,
	constants = {},
	icons: ICONS,
	transaction_limits,
	tiers = {},
	user,
	setDisplayOrder,
	refresh,
	setSelectedTransaction,
	p2p_config,
	setTab,
	changeProfileTab,
	tab,
}) => {
	const [expandRow, setExpandRow] = useState(false);
	const [selectedDeal, setSelectedDeal] = useState();
	const [selectedMethod, setSelectedMethod] = useState();
	const [deals, setDeals] = useState([]);
	const [amountCurrency, setAmountCurrency] = useState();
	const [amountFiat, setAmountFiat] = useState();
	const [filterCoin, setFilterCoin] = useState();
	const [filterDigital] = useState();
	const [filterRegion, setFilterRegion] = useState();
	const [filterAmount, setFilterAmount] = useState();
	const [filterMethod, setFilterMethod] = useState();
	const [methods, setMethods] = useState([]);
	const [loading, setLoading] = useState(false);
	const [displayUserFeedback, setDisplayUserFeedback] = useState(false);
	const [displayOrderCreation, setDisplayOrderCreation] = useState(false);
	const [userFeedback, setUserFeedback] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [userProfile, setUserProfile] = useState();
	const [selectedProfile, setSelectedProfile] = useState();
	const [myMethods, setMyMethods] = useState([]);
	// const inputRef = useRef(null);
	const [isBuySelected, setIsBuySelected] = useState(true);
	const [buyValue, setBuyValue] = useState([]);
	const [selectedCoin, setSelectedCoin] = useState('USDT');
	const [isFilter, setIsFilter] = useState(false);

	const displayAssets = ['USDT', 'XHT', 'BTC', 'ETH'];

	useEffect(() => {
		fetchDeals({ status: true })
			.then((res) => {
				setDeals(res.data);
				const buyDeals = res.data?.filter((deal) => deal?.side === 'sell');
				const filteredDeals = buyDeals?.filter((deal) =>
					selectedCoin?.includes(deal?.buying_asset?.toUpperCase())
				);
				setBuyValue(filteredDeals);
				const newMethods = [];

				res.data.forEach((deal) => {
					deal.payment_methods.forEach((method) => {
						if (!newMethods.find((x) => x.system_name === method.system_name)) {
							newMethods.push(method);
						}
					});
				});

				setMethods(newMethods || []);
			})
			.catch((err) => err);

		fetchP2PPaymentMethods({ is_p2p: true, status: 3 })
			.then((res) => {
				setMyMethods(res.data);
			})
			.catch((err) => err);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [refresh]);

	useEffect(() => {
		if (tab !== 0 && isMobile) {
			setIsFilter(false);
		}
	}, [tab]);

	const formatAmount = (currency, amount) => {
		const min = coins[currency].min;
		const formattedAmount = formatToCurrency(amount, min);
		return formattedAmount;
	};

	const formatRate = (rate, spread, asset, side) => {
		const amount =
			side === 'sell'
				? rate * (1 + Number(spread / 100 || 0))
				: rate * (1 - Number(spread / 100 || 0));
		return formatAmount(asset, amount);
	};

	const handleToggle = () => {
		const newIsBuySelected = !isBuySelected;
		const filteredDeals = deals?.filter((deal) =>
			!newIsBuySelected ? deal?.side === 'buy' : deal?.side === 'sell'
		);
		const cryptoAsset = filteredDeals?.filter((deal) =>
			selectedCoin?.includes(deal?.buying_asset?.toUpperCase())
		);
		setIsBuySelected(newIsBuySelected);
		setBuyValue(cryptoAsset);
	};

	const handleCryptoAsset = (asset) => {
		setSelectedCoin(asset);

		const filteredDeals = deals?.filter((deal) =>
			!isBuySelected ? deal?.side === 'buy' : deal?.side === 'sell'
		);
		const cryptoAsset = filteredDeals?.filter((deal) =>
			asset?.includes(deal?.buying_asset?.toUpperCase())
		);
		setBuyValue(cryptoAsset);
	};

	const handleVendorFeedback = async (deal) => {
		// changeProfileTab(deal.merchant);
		try {
			setIsLoading(true);
			setSelectedProfile(deal.merchant);
			const feedbacks = await fetchFeedback({
				merchant_id: deal.merchant.id,
			});
			const profile = await fetchP2PProfile({
				user_id: deal.merchant.id,
			});
			setUserFeedback(feedbacks.data);
			setIsLoading(false);
			setUserProfile(profile);
			setDisplayUserFeedback(true);
		} catch (error) {
			return error;
		}
	};

	const filteredDeals = buyValue?.filter(
		(deal) =>
			(filterCoin ? filterCoin === deal.spending_asset : true) &&
			(filterDigital ? filterDigital === deal.buying_asset : true) &&
			(filterAmount ? filterAmount < deal.max_order_value : true) &&
			(filterMethod
				? deal.payment_methods.find((x) => x.system_name === filterMethod)
				: true) &&
			(filterRegion ? filterRegion === deal.region : true)
	);

	return (
		<div
			className={classnames(
				...[
					buyValue?.length > 0
						? 'p2p-tab-container'
						: 'p2p-tab-container p2p-no-deals-container',
					isMobile ? 'mobile-view-p2p' : '',
				]
			)}
		>
			{displayUserFeedback && (
				<Dialog
					className="p2p-profile-popup-wrapper"
					isOpen={displayUserFeedback}
					onCloseDialog={() => {
						setDisplayUserFeedback(false);
					}}
				>
					<div className="vender-profile-popup-container">
						{isMobile && (
							<span
								className="vendor-close-icon secondary-text"
								onClick={() => {
									setDisplayUserFeedback(false);
								}}
							>
								<CloseOutlined />
							</span>
						)}
						<div className="vendor-details">
							<h3 className="stake_theme">
								{selectedProfile?.full_name || (
									<EditWrapper stringId="P2P.ANONYMOUS">
										{STRINGS['P2P.ANONYMOUS']}
									</EditWrapper>
								)}
								{` `}(
								<EditWrapper stringId="P2P.TAB_PROFILE">
									{STRINGS['P2P.TAB_PROFILE']}
								</EditWrapper>
								)
							</h3>

							<div>
								<div className="profile-description-card-container">
									<div className="profile-description-cards">
										<div className="p2p-profile-card">
											<div className="p2p-profile-card-header fs-16">
												<EditWrapper stringId="P2P.TOTAL_ORDERS">
													{STRINGS['P2P.TOTAL_ORDERS']}
												</EditWrapper>
											</div>
											<div className="p2p-profile-card-content">
												{`${userProfile?.totalTransactions} ${STRINGS['P2P.TIMES']}`}
											</div>
										</div>
										<div className="p2p-profile-card">
											<div className="p2p-profile-card-header fs-16">
												<EditWrapper stringId="P2P.COMPLETION_RATE">
													{STRINGS['P2P.COMPLETION_RATE']}
												</EditWrapper>
											</div>
											<div className="p2p-profile-card-content">
												{(userProfile?.completionRate || 0).toFixed(2)}%
											</div>
										</div>
										<div className="p2p-profile-card">
											<div className="p2p-profile-card-header fs-16">
												<EditWrapper stringId="P2P.POSITIVE_FEEDBACK">
													{STRINGS['P2P.POSITIVE_FEEDBACK']}
												</EditWrapper>
											</div>
											<div className="p2p-profile-card-content">
												{(userProfile?.positiveFeedbackRate || 0).toFixed(2)}%
											</div>
											<div>
												<EditWrapper stringId="P2P.POSITIVE">
													{STRINGS['P2P.POSITIVE']}
												</EditWrapper>{' '}
												{userProfile?.positiveFeedbackCount} /{' '}
												<EditWrapper stringId="P2P.NEGATIVE">
													{STRINGS['P2P.NEGATIVE']}
												</EditWrapper>{' '}
												{userProfile?.negativeFeedbackCount}
											</div>
										</div>
									</div>
								</div>

								<div className="feedback-card">
									<span>{STRINGS['P2P.FEEDBACK']}</span>
									<span className="ml-2">({userFeedback.length || 0})</span>
								</div>
								{userFeedback.length === 0 ? (
									<div className="empty-feedback">
										<EditWrapper stringId="P2P.NO_FEEDBACK">
											{STRINGS['P2P.NO_FEEDBACK']}
										</EditWrapper>
									</div>
								) : (
									<table className="p2p-feedback-table">
										<thead className="p2p-feedback-table-header">
											<tr className="table-bottom-border p2p-header-row">
												<th>
													<EditWrapper stringId="P2P.COMMENT">
														{STRINGS['P2P.COMMENT']}
													</EditWrapper>
												</th>
												<th>
													<EditWrapper stringId="P2P.RATING">
														{STRINGS['P2P.RATING']}
													</EditWrapper>
												</th>
											</tr>
										</thead>
										<tbody className="p2p-feedback-table-body">
											{userFeedback.map((deal, index) => {
												return (
													<tr className="table-row feedback-table-body-row">
														<td className="td-fit feedback-comment w-25">
															{isLoading ? (
																<Loading index={index} />
															) : (
																<span>{deal.comment}</span>
															)}
														</td>
														<td className="td-fit feedback-rating w-25">
															{isLoading ? (
																<Loading index={index} />
															) : (
																<Rate
																	disabled
																	allowHalf={false}
																	autoFocus={false}
																	allowClear={false}
																	value={deal.rating}
																/>
															)}
														</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								)}
							</div>
						</div>
					</div>
				</Dialog>
			)}

			{displayOrderCreation && (
				<Dialog
					isOpen={displayOrderCreation}
					onCloseDialog={() => setDisplayOrderCreation(false)}
					className="p2p-order-creation-popup-wrapper"
				>
					<div className="order-creation-popup-container">
						<div className="asset-order-creation-title important-text font-weight-bold fs-16">
							<span className="asset-icon">
								<Coin
									iconId={coins[selectedDeal?.buying_asset]?.icon_id}
									type="CS8"
								/>
							</span>
							<span>{coins[selectedDeal?.buying_asset]?.fullname}</span>
							<span>({selectedDeal?.buying_asset?.toUpperCase()})</span>
							<EditWrapper stringId="P2P.ORDER_CREATION">
								<span>{STRINGS['P2P.ORDER_CREATION']}</span>
							</EditWrapper>
						</div>
						<div className="order-creation-description mt-3">
							<EditWrapper
								stringId={STRINGS.formatString(
									STRINGS['P2P.ORDER_CREATION_DESC_1'],
									STRINGS['P2P.ORDER_CREATION_DESC_2'],
									STRINGS['P2P.YOU_HAVE_TEXT'],
									<span className="important-text text-decoration-underline">
										15 {STRINGS['P2P.MINUTES']}
									</span>,
									STRINGS['P2P.COMPLETE_PAYMENT_PROCESS']
								)}
							>
								{STRINGS.formatString(
									STRINGS['P2P.ORDER_CREATION_DESC_1'],
									STRINGS['P2P.ORDER_CREATION_DESC_2'],
									STRINGS['P2P.YOU_HAVE_TEXT'],
									<span className="important-text text-decoration-underline">
										15 {STRINGS['P2P.MINUTES']}
									</span>,
									STRINGS['P2P.COMPLETE_PAYMENT_PROCESS']
								)}
							</EditWrapper>
						</div>
						<div className="warning-message-container mt-3">
							<div className="warning-message-details">
								<span className="warning-title font-weight-bold important-text">
									<EditWrapper stringId="WITHDRAW_PAGE.WARNING">
										{STRINGS['WITHDRAW_PAGE.WARNING']?.toUpperCase()}
										<ExclamationOutlined />
									</EditWrapper>
								</span>
								<span className="warning-description">
									<EditWrapper stringId="P2P.WARINNG_DESC">
										{STRINGS['P2P.WARINNG_DESC']}
									</EditWrapper>
								</span>
								<span className="cancelling-order-message">
									<EditWrapper stringId="P2P.ORDER_CANCEL_DESC">
										<span className="text-decoration-underline font-weight-bold">
											{STRINGS['P2P.ORDER_CANCEL_DESC']}
										</span>
									</EditWrapper>
								</span>
							</div>
							<div className="confirm-order-creation mt-3 mb-5">
								<EditWrapper
									stringId={STRINGS.formatString(
										STRINGS['P2P.CONFIRM_ORDER_CREATION'],
										selectedDeal?.side === 'sell'
											? STRINGS['P2P.SEND_MONEY']
											: STRINGS['P2P.RECEIVE_MONEY']
									)}
								>
									{STRINGS.formatString(
										STRINGS['P2P.CONFIRM_ORDER_CREATION'],
										selectedDeal?.side === 'sell'
											? STRINGS['P2P.SEND_MONEY']
											: STRINGS['P2P.RECEIVE_MONEY']
									)}
								</EditWrapper>
							</div>
						</div>
						<div className="order-create-button-container w-100">
							<Button
								className="w-50 back-btn important-text"
								onClick={() => setDisplayOrderCreation(false)}
							>
								<EditWrapper stringId="BACK_TEXT">
									{STRINGS['BACK_TEXT'].toUpperCase()}
								</EditWrapper>
							</Button>
							<Button
								className="w-50 create-order-btn important-text"
								disabled={loading}
								onClick={async () => {
									try {
										if (amountFiat && selectedMethod) {
											setLoading(true);
											const transaction = await createTransaction({
												deal_id: selectedDeal.id,
												amount_fiat:
													selectedDeal.side === 'sell'
														? amountFiat
														: Number(amountCurrency),
												payment_method_used: selectedMethod,
												side: selectedDeal.side,
											});
											message.success(STRINGS['P2P.ORDER_CREATED']);
											const transData = await fetchTransactions({
												id: transaction.id,
											});

											if (transData.data[0])
												transData.data[0].first_created = true;
											setSelectedTransaction(transData.data[0]);
											setDisplayOrder(true);
											setLoading(false);
										} else {
											message.error(
												STRINGS['P2P.SELECT_PAYMENT_METHOD_AND_AMOUNT']
											);
											setLoading(false);
										}
									} catch (error) {
										message.error(error.data.message);
										setLoading(false);
										setDisplayOrderCreation(false);
									}
								}}
							>
								<EditWrapper
									strings={STRINGS['P2P.CREATE_ORDER'].toUpperCase()}
								>
									{STRINGS['P2P.CREATE_ORDER'].toUpperCase()}
								</EditWrapper>
							</Button>
						</div>
					</div>
				</Dialog>
			)}

			{/* <div
				style={{
					textAlign: 'center',
					display: 'flex',
					gap: 10,
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<EditWrapper stringId="P2P.I_WANT_TO_BUY">
					{STRINGS['P2P.I_WANT_TO_BUY']}
				</EditWrapper>
				<span>
					<Switch disabled />
				</span>
				<EditWrapper stringId="P2P.I_WANT_TO_SELL">
					{STRINGS['P2P.I_WANT_TO_SELL']}
				</EditWrapper>
			</div> */}
			{/* <div
				style={{
					textAlign: 'center',
					display: 'flex',
					gap: 10,
					marginTop: 25,
					marginBottom: 25,
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<span style={{ fontWeight: 'bold' }}>Crypto</span>

				{p2p_config?.digital_currencies.map((coin) => (
					<Button
						ghost
						onClick={() => {
							setFilterDigital(coin);
						}}
					>
						{coin.toUpperCase()}
					</Button>
				))}
				<Button
					ghost
					onClick={() => {
						setFilterDigital();
					}}
				>
					<EditWrapper stringId="P2P.ALL">{STRINGS['P2P.ALL']}</EditWrapper>
				</Button>
			</div> */}
			<div className="p2p-buy-sell-toggle">
				<div className={isBuySelected ? 'toggle-buy-text' : 'secondary-text'}>
					<EditWrapper stringId="P2P.I_WANT_TO_BUY">
						{STRINGS['P2P.I_WANT_TO_BUY']}
					</EditWrapper>
				</div>
				<div>
					<Switch
						checked={!isBuySelected}
						onChange={handleToggle}
						className={isBuySelected ? 'toggle-buy' : 'toggle-sell'}
					/>
				</div>
				<div className={isBuySelected ? 'secondary-text' : 'toggle-sell-text'}>
					<EditWrapper stringId="P2P.I_WANT_TO_SELL">
						{STRINGS['P2P.I_WANT_TO_SELL']}
					</EditWrapper>
				</div>
			</div>
			<div className="crypto-assets">
				<div className="important-text font-weight-bold">
					<EditWrapper stringId="P2P.CRYPTO">
						{STRINGS['P2P.CRYPTO']}
					</EditWrapper>
				</div>
				{displayAssets?.map((asset) => {
					return (
						<div
							className={
								selectedCoin === asset ? 'selected-asset asset' : 'asset'
							}
							key={asset}
							onClick={() => handleCryptoAsset(asset)}
						>
							{asset}
						</div>
					);
				})}
			</div>
			{isMobile && (
				<span
					className="show-filter-text my-3 mr-5"
					onClick={() => setIsFilter(!isFilter)}
				>
					<EditWrapper
						stringId={
							isFilter
								? STRINGS['P2P.HIDE_FILTERS']
								: STRINGS['P2P.SHOW_FILTERS']
						}
					>
						<span className="text-decoration-underline blue-link">
							{isFilter
								? STRINGS['P2P.HIDE_FILTERS']
								: STRINGS['P2P.SHOW_FILTERS']}
						</span>
					</EditWrapper>
				</span>
			)}
			{!isMobile && (
				<div className="p2p-order-search-container">
					<div className="p2p-fiat-currency-container">
						<EditWrapper stringId="P2P.SPEND_FIAT_CURRENCY">
							{STRINGS['P2P.SPEND_FIAT_CURRENCY']}:
						</EditWrapper>
						<span>
							<Select
								showSearch
								className="p2p-select-field"
								dropdownClassName="p2p-custom-style-dropdown"
								placeholder={STRINGS['P2P.SELECT_FIAT']}
								value={filterCoin}
								onChange={(e) => {
									setFilterCoin(e);
								}}
							>
								<Select.Option value={null}>{STRINGS['P2P.ALL']}</Select.Option>
								{p2p_config?.fiat_currencies.map((coin) => (
									<Select.Option value={coin}>
										{coin?.toUpperCase()}
									</Select.Option>
								))}
							</Select>
						</span>
					</div>
					<div className="p2p-amount">
						<EditWrapper stringId="P2P.AMOUNT">
							{STRINGS['P2P.AMOUNT']}:
						</EditWrapper>
						<span>
							<Input
								value={filterAmount}
								onChange={(e) => {
									setFilterAmount(e.target.value);
								}}
								placeholder={
									isBuySelected
										? STRINGS['P2P.INPUT_SPEND_AMOUNT']
										: STRINGS['P2P.INPUT_SELL_AMOUNT']
								}
								// suffix={STRINGS['WALLET_ASSETS_SEARCH_TXT']}
							/>
						</span>
					</div>
					<div className="p2p-payment-method">
						<EditWrapper stringId="P2P.PAYMENT_METHOD">
							{STRINGS['P2P.PAYMENT_METHOD']}:
						</EditWrapper>
						<span>
							<Select
								showSearch
								className="p2p-select-field"
								dropdownClassName="p2p-custom-style-dropdown"
								placeholder={STRINGS['P2P.ALL_PAYMENT_METHODS']}
								value={filterMethod}
								onChange={(e) => {
									setFilterMethod(e);
								}}
							>
								<Select.Option value={null}>{STRINGS['P2P.ALL']}</Select.Option>
								{methods.map((method) => (
									<Select.Option value={method.system_name}>
										{method.system_name}
									</Select.Option>
								))}
							</Select>
						</span>
					</div>
					<div className="p2p-avaliable-regions">
						<EditWrapper stringId="P2P.AVAILABLE_REGIONS">
							{STRINGS['P2P.AVAILABLE_REGIONS']}:
						</EditWrapper>
						<span>
							<Select
								showSearch
								className="p2p-select-field"
								dropdownClassName="p2p-custom-style-dropdown"
								placeholder={STRINGS['P2P.ALL_REGION']}
								value={filterRegion}
								onChange={(e) => {
									setFilterRegion(e);
								}}
							>
								<Select.Option value={null}>{STRINGS['P2P.ALL']}</Select.Option>
								{COUNTRIES_OPTIONS.filter((cn) =>
									deals?.find((deal) => deal.region === cn.value)
								).map((cn) => (
									<Select.Option value={cn.value}>{cn.label}</Select.Option>
								))}
							</Select>
						</span>
					</div>
				</div>
			)}
			{isMobile && isFilter && (
				<div className="p2p-order-search-container ml-5">
					<div className="p2p-fiat-currency-container">
						<EditWrapper stringId="P2P.SPEND_FIAT_CURRENCY">
							{STRINGS['P2P.SPEND_FIAT_CURRENCY']}:
						</EditWrapper>
						<span>
							<Select
								showSearch
								className="p2p-select-field"
								dropdownClassName="p2p-custom-style-dropdown"
								placeholder={STRINGS['P2P.SELECT_FIAT']}
								value={filterCoin}
								onChange={(e) => {
									setFilterCoin(e);
								}}
							>
								<Select.Option value={null}>{STRINGS['P2P.ALL']}</Select.Option>
								{p2p_config?.fiat_currencies.map((coin) => (
									<Select.Option value={coin}>
										{coin?.toUpperCase()}
									</Select.Option>
								))}
							</Select>
						</span>
					</div>
					<div className="p2p-amount">
						<EditWrapper stringId="P2P.AMOUNT">
							{STRINGS['P2P.AMOUNT']}:
						</EditWrapper>
						<span>
							<Input
								value={filterAmount}
								onChange={(e) => {
									setFilterAmount(e.target.value);
								}}
								placeholder={
									isBuySelected
										? STRINGS['P2P.INPUT_SPEND_AMOUNT']
										: STRINGS['P2P.INPUT_SELL_AMOUNT']
								}
								// suffix={STRINGS['WALLET_ASSETS_SEARCH_TXT']}
							/>
						</span>
					</div>
					<div className="p2p-payment-method">
						<EditWrapper stringId="P2P.PAYMENT_METHOD">
							{STRINGS['P2P.PAYMENT_METHOD']}:
						</EditWrapper>
						<span>
							<Select
								showSearch
								className="p2p-select-field"
								dropdownClassName="p2p-custom-style-dropdown"
								placeholder={STRINGS['P2P.ALL_PAYMENT_METHODS']}
								value={filterMethod}
								onChange={(e) => {
									setFilterMethod(e);
								}}
							>
								<Select.Option value={null}>{STRINGS['P2P.ALL']}</Select.Option>
								{methods.map((method) => (
									<Select.Option value={method.system_name}>
										{method.system_name}
									</Select.Option>
								))}
							</Select>
						</span>
					</div>
					<div className="p2p-avaliable-regions">
						<EditWrapper stringId="P2P.AVAILABLE_REGIONS">
							{STRINGS['P2P.AVAILABLE_REGIONS']}:
						</EditWrapper>
						<span>
							<Select
								showSearch
								className="p2p-select-field"
								dropdownClassName="p2p-custom-style-dropdown"
								placeholder={STRINGS['P2P.ALL_REGION']}
								value={filterRegion}
								onChange={(e) => {
									setFilterRegion(e);
								}}
							>
								<Select.Option value={null}>{STRINGS['P2P.ALL']}</Select.Option>
								{COUNTRIES_OPTIONS.filter((cn) =>
									deals?.find((deal) => deal.region === cn.value)
								).map((cn) => (
									<Select.Option value={cn.value}>{cn.label}</Select.Option>
								))}
							</Select>
						</span>
					</div>
				</div>
			)}
			{filteredDeals?.length > 0 ? (
				!isMobile ? (
					<div className="stake_theme p2p-table-container mt-5">
						<table className="p2p-stake-table fs-12 w-100">
							<thead className="p2p-stake-table-header secondary-text">
								<tr>
									<th className="text-align-start p2p-vendor-header">
										<EditWrapper stringId="P2P.VENDOR">
											{STRINGS['P2P.VENDOR']}
										</EditWrapper>
									</th>
									<th>
										<EditWrapper stringId="P2P.PRICE_LOWEST_FIRST">
											{STRINGS['P2P.PRICE_LOWEST_FIRST']}
										</EditWrapper>
									</th>
									<th>
										<EditWrapper stringId="P2P.LIMIT_AVAILABLE">
											{STRINGS['P2P.LIMIT_AVAILABLE']}
										</EditWrapper>
									</th>
									<th>
										<EditWrapper stringId="P2P.PAYMENT">
											{STRINGS['P2P.PAYMENT']}
										</EditWrapper>
									</th>
									<th className="text-align-center">
										<EditWrapper stringId="P2P.TRADE">
											{STRINGS['P2P.TRADE']}
										</EditWrapper>
									</th>
								</tr>
							</thead>
							<tbody className="p2p-table-body-container">
								{filteredDeals?.map((deal) => {
									return (
										<>
											<tr
												className={
													expandRow && expandRow && deal.id === selectedDeal.id
														? 'subTable p2p-expendable-row'
														: 'p2p-table-row'
												}
											>
												<td
													onClick={() => {
														setExpandRow(!expandRow);
														setSelectedDeal(deal);
														setAmountCurrency();
														setSelectedMethod();
														setAmountFiat();
													}}
													className="td-fit vendor-title"
												>
													<span>
														{expandRow && deal.id === selectedDeal.id ? (
															<MinusSquareOutlined />
														) : (
															<PlusSquareOutlined />
														)}
													</span>{' '}
													<span className="ml-2">
														{deal.merchant.full_name || (
															<EditWrapper stringId="P2P.ANONYMOUS">
																{STRINGS['P2P.ANONYMOUS']}
															</EditWrapper>
														)}
													</span>
												</td>
												<td
													onClick={() => {
														setExpandRow(!expandRow);
														setSelectedDeal(deal);
														setAmountCurrency();
														setSelectedMethod();
														setAmountFiat();
													}}
													className="td-fit price-value"
												>
													<span className="fs-16">{`${formatRate(
														deal.exchange_rate,
														deal.spread,
														deal.spending_asset,
														deal.side
													)}`}</span>{' '}
													<span>{deal.spending_asset.toUpperCase()}</span>
												</td>
												<td
													className="td-fit avaliable-amount"
													onClick={() => {
														setExpandRow(!expandRow);
														setSelectedDeal(deal);
														setAmountCurrency();
														setSelectedMethod();
														setAmountFiat();
													}}
												>
													<div className="p2p-avaliable-price">
														<EditWrapper stringId="P2P.AVAILABLE">
															{STRINGS['P2P.AVAILABLE']}:
														</EditWrapper>
														<div className="mt-3" s>
															<EditWrapper stringId="P2P.LIMIT">
																{STRINGS['P2P.LIMIT']}:
															</EditWrapper>
														</div>
													</div>
													<div className="p2p-limit-price">
														<div className="p2p-avaliable-price">
															<span className="ml-1">
																{deal.total_order_amount}{' '}
															</span>
															<span>{deal.buying_asset.toUpperCase()}</span>
															<Coin
																iconId={coins[deal?.buying_asset].icon_id}
																type="CS4"
															/>
														</div>
														<div className="mt-3">
															<span className="ml-1">
																{deal.min_order_value} - {deal.max_order_value}{' '}
															</span>
															<span>{deal.spending_asset.toUpperCase()}</span>
														</div>
													</div>
												</td>
												<td
													className="payment-methods"
													onClick={() => {
														setExpandRow(!expandRow);
														setSelectedDeal(deal);
														setAmountCurrency();
														setSelectedMethod();
														setAmountFiat();
													}}
												>
													<span>
														{deal.payment_methods
															.map((method) => method.system_name)
															.join(', ')}
													</span>
												</td>
												<td className="td-fit trade-button">
													{!(
														expandRow &&
														expandRow &&
														deal.id === selectedDeal.id
													) && (
														<div>
															<Button
																className={
																	deal.side === 'sell'
																		? 'greenButtonP2P'
																		: 'redButtonP2P'
																}
																disabled={loading || expandRow || !user?.id}
																onClick={async () => {
																	try {
																		if (
																			!expandRow &&
																			deal.id !== selectedDeal
																		) {
																			setExpandRow(true);
																			setSelectedDeal(deal);
																			return;
																		}
																		if (amountFiat && selectedMethod) {
																			setLoading(true);
																			const transaction = await createTransaction(
																				{
																					deal_id: selectedDeal.id,
																					amount_fiat:
																						selectedDeal.side === 'sell'
																							? amountFiat
																							: amountCurrency,
																					payment_method_used: selectedMethod,
																					side: selectedDeal.side,
																				}
																			);
																			message.success(
																				STRINGS['P2P.ORDER_CREATED']
																			);
																			const transData = await fetchTransactions(
																				{
																					id: transaction.id,
																				}
																			);
																			setSelectedTransaction(transData.data[0]);
																			setDisplayOrder(true);
																			setLoading(false);
																		} else {
																			message.error(
																				STRINGS[
																					'P2P.SELECT_PAYMENT_METHOD_AND_AMOUNT'
																				]
																			);
																			setLoading(false);
																		}
																	} catch (error) {
																		message.error(error.data.message);
																		setLoading(false);
																	}
																}}
															>
																{deal.side === 'sell' ? 'BUY' : 'SELL'}{' '}
																{deal.buying_asset.toUpperCase()} {'>'}
															</Button>
														</div>
													)}
												</td>
											</tr>
											{expandRow && expandRow && deal.id === selectedDeal.id && (
												<tr className="subTable p2p-expendable-row">
													<td className="td-fit title-description">
														<div
															className="ml-3 mb-4 vendor-profile-description"
															onClick={() => handleVendorFeedback(deal)}
														>
															<EditWrapper stringId="P2P.VIEW_PROFILE">
																({STRINGS['P2P.VIEW_PROFILE']})
															</EditWrapper>
														</div>
														<div className="payment-description secondary-text ml-3">
															<EditWrapper
																stringId={STRINGS.formatString(
																	STRINGS['P2P.PAYMENT_TIME_LIMIT_LABEL'],
																	STRINGS['P2P.30_MINUTES']
																)}
															>
																{STRINGS.formatString(
																	STRINGS['P2P.PAYMENT_TIME_LIMIT_LABEL'],
																	<span className="payment-time-limit">
																		{STRINGS['P2P.30_MINUTES']}
																	</span>
																)}
															</EditWrapper>
														</div>
														<div className="p2p-terms-condition secondary-text mt-4 ml-3">
															<EditWrapper stringId="P2P.TERMS_CONDITIONS">
																{STRINGS['P2P.TERMS_CONDITIONS']}:
															</EditWrapper>
															<span className="deal-terms ml-1">
																{deal.terms}
															</span>
														</div>
													</td>
													<td
														className="td-fit payment-details-container"
														colspan="4"
													>
														{selectedDeal?.side === 'sell' ? (
															<div className="payment-details">
																<div className="payment-method">
																	<EditWrapper stringId="P2P.SELECT_PAYMENT_METHOD">
																		{STRINGS['P2P.SELECT_PAYMENT_METHOD']}:
																	</EditWrapper>
																	<span
																		className={
																			!selectedMethod?.system_name
																				? 'payment-method-field-container error-field'
																				: 'payment-method-field-container'
																		}
																	>
																		<Select
																			showSearch
																			className="payment-method-field w-100"
																			dropdownClassName="p2p-custom-style-dropdown"
																			placeholder="Payment Method"
																			value={selectedMethod?.system_name}
																			onChange={(e) => {
																				setSelectedMethod(
																					deal.payment_methods.find(
																						(x) => x.system_name === e
																					)
																				);
																			}}
																		>
																			{deal.payment_methods.map((method) => {
																				return (
																					<Select.Option
																						value={method.system_name}
																					>
																						{method.system_name}
																					</Select.Option>
																				);
																			})}
																		</Select>
																	</span>
																</div>

																<div className="p2p-amount-spent">
																	<span>
																		<EditWrapper stringId="P2P.SPEND_AMOUNT">
																			{STRINGS['P2P.SPEND_AMOUNT']}
																		</EditWrapper>{' '}
																		({deal.spending_asset.toUpperCase()}):
																	</span>

																	<span className="amount-spent-field-container">
																		<InputNumber
																			className={
																				amountFiat <= 0 ||
																				!amountFiat ||
																				deal.min_order_value > amountFiat ||
																				deal.max_order_value < amountFiat
																					? 'error-field amount-spent-field'
																					: 'amount-spent-field'
																			}
																			value={amountFiat}
																			onChange={(e) => {
																				setAmountFiat(e);
																				const currencyAmount =
																					Number(e) /
																					Number(
																						deal.exchange_rate *
																							(1 +
																								Number(deal.spread / 100 || 0))
																					);

																				const formatted = formatAmount(
																					deal.buying_asset,
																					currencyAmount
																				);

																				setAmountCurrency(formatted);
																			}}
																			placeholder={deal.spending_asset.toUpperCase()}
																			autoFocus={true}
																		/>
																	</span>
																</div>
																<div className="error-field-container">
																	{deal.min_order_value > amountFiat && (
																		<div className="error-message">
																			<ExclamationCircleFilled />
																			<EditWrapper
																				stringId={STRINGS.formatString(
																					STRINGS['P2P.MINIMUM_AMOUNT_WARNING'],
																					STRINGS[
																						'P2P.SPEND_AMOUNT'
																					].toLowerCase(),
																					deal.min_order_value
																				)}
																			>
																				<span className="error-message ml-1">
																					{STRINGS.formatString(
																						STRINGS[
																							'P2P.MINIMUM_AMOUNT_WARNING'
																						],
																						STRINGS[
																							'P2P.SPEND_AMOUNT'
																						].toLowerCase(),
																						deal.min_order_value
																					)}
																				</span>
																			</EditWrapper>
																		</div>
																	)}
																	{deal.max_order_value < amountFiat && (
																		<div className="error-message">
																			<ExclamationCircleFilled />
																			<EditWrapper
																				stringId={STRINGS.formatString(
																					STRINGS['P2P.MAXIMUM_AMOUNT_WARNING'],
																					STRINGS[
																						'P2P.SPEND_AMOUNT'
																					].toLowerCase(),
																					deal.max_order_value
																				)}
																			>
																				<span className="error-message ml-1">
																					{STRINGS.formatString(
																						STRINGS[
																							'P2P.MAXIMUM_AMOUNT_WARNING'
																						],
																						STRINGS[
																							'P2P.SPEND_AMOUNT'
																						].toLowerCase(),
																						deal.max_order_value
																					)}
																				</span>
																			</EditWrapper>
																		</div>
																	)}
																</div>
																<div className="p2p-amount-receive">
																	<div className="amount-receive-title">
																		<span>
																			<EditWrapper stringId="P2P.AMOUNT_TO_RECEIVE">
																				{STRINGS['P2P.AMOUNT_TO_RECEIVE']}
																			</EditWrapper>{' '}
																			({deal.buying_asset.toUpperCase()})
																		</span>
																		<Coin
																			iconId={coins[deal?.buying_asset].icon_id}
																			type="CS4"
																		/>
																	</div>

																	<span className="amount-receive-field-container">
																		<Input
																			className="greyButtonP2P amount-receive-field"
																			readOnly
																			value={amountCurrency}
																			placeholder={deal.buying_asset.toUpperCase()}
																		/>
																	</span>
																</div>
																<div className="error-field-container">
																	{deal.min_order_value <= amountFiat &&
																		deal.max_order_value >= amountFiat &&
																		!selectedMethod?.system_name && (
																			<span className="error-message">
																				<ExclamationCircleFilled />
																				<EditWrapper stringId="P2P.SELECT_PAYMENT_METHOD_AND_AMOUNT">
																					<span className="ml-1">
																						{
																							STRINGS[
																								'P2P.SELECT_PAYMENT_METHOD_AND_AMOUNT'
																							]
																						}
																					</span>
																				</EditWrapper>
																			</span>
																		)}
																</div>
																<div className="trade-button-container">
																	<Button
																		className="greyButtonP2P"
																		onClick={async () => {
																			setExpandRow(false);
																			setSelectedDeal(null);
																			setAmountCurrency();
																			setSelectedMethod();
																			setAmountFiat();
																		}}
																	>
																		<EditWrapper stringId="P2P.CANCEL">
																			{STRINGS['P2P.CANCEL']}
																		</EditWrapper>
																	</Button>
																	<Button
																		className={
																			selectedDeal.side === 'sell'
																				? 'greenButtonP2P'
																				: 'redButtonP2P'
																		}
																		disabled={
																			loading ||
																			!user?.id ||
																			amountFiat <= 0 ||
																			!selectedMethod?.system_name ||
																			deal.min_order_value > amountFiat ||
																			deal.max_order_value < amountFiat
																		}
																		onClick={async () => {
																			try {
																				if (
																					!expandRow &&
																					deal.id !== selectedDeal
																				) {
																					setExpandRow(true);
																					setSelectedDeal(deal);
																					return;
																				} else {
																					setDisplayOrderCreation(true);
																				}
																			} catch (error) {
																				// message.error(error.data.message);
																				setLoading(false);
																			}
																		}}
																	>
																		{deal.side === 'sell' ? 'BUY' : 'SELL'}{' '}
																		{deal.buying_asset.toUpperCase()} {'>'}
																	</Button>
																</div>
															</div>
														) : (
															<div className="payment-details">
																<div className="payment-method">
																	<EditWrapper stringId="P2P.SELECT_PAYMENT_METHOD">
																		{STRINGS['P2P.SELECT_PAYMENT_METHOD']}
																	</EditWrapper>
																	{deal?.payment_methods?.filter((a) =>
																		myMethods?.find(
																			(x) =>
																				x.name.toLowerCase() ===
																				a.system_name?.toLowerCase()
																		)
																	).length === 0 && (
																		<span className="add-payment-container">
																			<Button
																				onClick={() => {
																					setTab('2');
																				}}
																				className="purpleButtonP2P add-payment-button w-100"
																			>
																				<EditWrapper stringId="P2P.ADD_PAYMENT_METHOD">
																					{STRINGS['P2P.ADD_PAYMENT_METHOD']}
																				</EditWrapper>
																			</Button>
																		</span>
																	)}
																	{deal?.payment_methods?.filter((a) =>
																		myMethods?.find(
																			(x) =>
																				x.name.toLowerCase() ===
																				a.system_name?.toLowerCase()
																		)
																	).length > 0 && (
																		<span
																			className={
																				!selectedMethod?.system_name
																					? 'payment-method-field-container error-field'
																					: 'payment-method-field-container'
																			}
																		>
																			<Select
																				className="payment-method-field w-100"
																				dropdownClassName="p2p-custom-style-dropdown"
																				showSearch
																				placeholder="Payment Method"
																				value={selectedMethod?.system_name}
																				onChange={(e) => {
																					setSelectedMethod(
																						myMethods.find((x) => x.name === e)
																							.details
																					);
																				}}
																			>
																				{deal?.payment_methods
																					?.filter((a) =>
																						myMethods?.find(
																							(x) =>
																								x.name.toLowerCase() ===
																								a.system_name?.toLowerCase()
																						)
																					)
																					.map((method) => {
																						return (
																							<Select.Option
																								value={method.system_name}
																							>
																								{method.system_name}
																							</Select.Option>
																						);
																					})}
																			</Select>
																		</span>
																	)}
																</div>

																<div className="p2p-amount-spent">
																	<div className="amount-receive-title">
																		<span>
																			<EditWrapper stringId="P2P.SELL_AMOUNT">
																				{STRINGS['P2P.SELL_AMOUNT']}
																			</EditWrapper>{' '}
																			({deal.buying_asset.toUpperCase()})
																		</span>
																		<Coin
																			iconId={coins[deal?.buying_asset].icon_id}
																			type="CS4"
																		/>
																	</div>

																	<span className="amount-spent-field-container">
																		<InputNumber
																			className={
																				amountFiat <= 0 ||
																				!amountFiat ||
																				deal.min_order_value > amountFiat ||
																				deal.max_order_value < amountFiat
																					? 'error-field amount-spent-field'
																					: 'amount-spent-field'
																			}
																			value={amountFiat}
																			onChange={(e) => {
																				setAmountFiat(e);
																				const currencyAmount =
																					Number(e) *
																					Number(
																						deal.exchange_rate *
																							(1 -
																								Number(deal.spread / 100 || 0))
																					);

																				const formatted = formatAmount(
																					deal.spending_asset,
																					currencyAmount
																				);

																				setAmountCurrency(formatted);
																			}}
																			placeholder={deal.buying_asset.toUpperCase()}
																			autoFocus={true}
																		/>
																	</span>
																</div>
																<div className="error-field-container">
																	{deal.min_order_value > amountFiat && (
																		<div className="error-message">
																			<ExclamationCircleFilled />
																			<EditWrapper
																				stringId={STRINGS.formatString(
																					STRINGS['P2P.MINIMUM_AMOUNT_WARNING'],
																					STRINGS[
																						'P2P.SPEND_AMOUNT'
																					].toLowerCase(),
																					deal.min_order_value
																				)}
																			>
																				<span className="error-message ml-1">
																					{STRINGS.formatString(
																						STRINGS[
																							'P2P.MINIMUM_AMOUNT_WARNING'
																						],
																						STRINGS[
																							'P2P.SPEND_AMOUNT'
																						].toLowerCase(),
																						deal.min_order_value
																					)}
																				</span>
																			</EditWrapper>
																		</div>
																	)}
																	{deal.max_order_value < amountFiat && (
																		<div className="error-message">
																			<ExclamationCircleFilled />
																			<EditWrapper
																				stringId={STRINGS.formatString(
																					STRINGS['P2P.MAXIMUM_AMOUNT_WARNING'],
																					STRINGS[
																						'P2P.SPEND_AMOUNT'
																					].toLowerCase(),
																					deal.max_order_value
																				)}
																			>
																				<span className="error-message ml-1">
																					{STRINGS.formatString(
																						STRINGS[
																							'P2P.MAXIMUM_AMOUNT_WARNING'
																						],
																						STRINGS[
																							'P2P.SPEND_AMOUNT'
																						].toLowerCase(),
																						deal.max_order_value
																					)}
																				</span>
																			</EditWrapper>
																		</div>
																	)}
																</div>
																<div className="p2p-amount-receive">
																	<span>
																		<EditWrapper stringId="P2P.AMOUNT_TO_RECEIVE">
																			{STRINGS['P2P.AMOUNT_TO_RECEIVE']}
																		</EditWrapper>{' '}
																		({deal.spending_asset.toUpperCase()})
																	</span>

																	<span className="amount-receive-field-container">
																		<Input
																			className="greyButtonP2P amount-receive-field"
																			readOnly
																			value={amountCurrency}
																			placeholder={deal.spending_asset.toUpperCase()}
																		/>
																	</span>
																</div>
																<div className="error-field-container">
																	{deal.min_order_value <= amountFiat &&
																		deal.max_order_value >= amountFiat &&
																		!selectedMethod?.system_name && (
																			<span className="error-message">
																				<ExclamationCircleFilled />
																				<EditWrapper stringId="P2P.SELECT_PAYMENT_METHOD_AND_AMOUNT">
																					<span className="ml-1">
																						{
																							STRINGS[
																								'P2P.SELECT_PAYMENT_METHOD_AND_AMOUNT'
																							]
																						}
																					</span>
																				</EditWrapper>
																			</span>
																		)}
																</div>
																<div className="trade-button-container">
																	<Button
																		className="greyButtonP2P"
																		onClick={async () => {
																			setExpandRow(false);
																			setSelectedDeal(null);
																			setAmountCurrency();
																			setSelectedMethod();
																			setAmountFiat();
																		}}
																	>
																		<EditWrapper stringId="P2P.CANCEL">
																			{STRINGS['P2P.CANCEL']}
																		</EditWrapper>
																	</Button>

																	<Button
																		className={
																			selectedDeal.side === 'sell'
																				? 'greenButtonP2P'
																				: 'redButtonP2P'
																		}
																		disabled={
																			loading ||
																			!user?.id ||
																			amountFiat <= 0 ||
																			!selectedMethod?.system_name ||
																			deal.min_order_value > amountFiat ||
																			deal.max_order_value < amountFiat
																		}
																		onClick={async () => {
																			try {
																				if (
																					!expandRow &&
																					deal.id !== selectedDeal
																				) {
																					setExpandRow(true);
																					setSelectedDeal(deal);
																					return;
																				} else {
																					setDisplayOrderCreation(true);
																				}
																			} catch (error) {
																				message.error(error.data.message);
																				setLoading(false);
																			}
																		}}
																	>
																		{deal.side === 'sell' ? 'BUY' : 'SELL'}{' '}
																		{deal.buying_asset.toUpperCase()} {'>'}
																	</Button>
																</div>
															</div>
														)}
													</td>
												</tr>
											)}
										</>
									);
								})}
							</tbody>
						</table>
					</div>
				) : (
					<P2PDashMobile
						buyValue={buyValue}
						filterCoin={filterCoin}
						filterAmount={filterAmount}
						filterMethod={filterMethod}
						filterRegion={filterRegion}
						filterDigital={filterDigital}
						formatRate={formatRate}
						selectedDeal={selectedDeal}
						setSelectedDeal={setSelectedDeal}
						selectedMethod={selectedMethod}
						setDisplayOrderCreation={setDisplayOrderCreation}
						amountFiat={amountFiat}
						amountCurrency={amountCurrency}
						formatAmount={formatAmount}
						setAmountFiat={setAmountFiat}
						setAmountCurrency={setAmountCurrency}
						setSelectedMethod={setSelectedMethod}
						handleVendorFeedback={handleVendorFeedback}
						userProfile={userProfile}
						setTab={setTab}
						myMethods={myMethods}
					/>
				)
			) : (
				<NoDealsData />
			)}
		</div>
	);
};

const mapStateToProps = (state) => ({
	pairs: state.app.pairs,
	coins: state.app.coins,
	constants: state.app.constants,
	transaction_limits: state.app.transaction_limits,
	user: state.user,
	p2p_config: state.app.constants.p2p_config,
});

export default connect(mapStateToProps)(withConfig(P2PDash));
