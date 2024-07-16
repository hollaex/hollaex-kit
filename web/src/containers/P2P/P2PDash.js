/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { ReactSVG } from 'react-svg';
import { Switch, message } from 'antd';
import { IconTitle, EditWrapper, Coin } from 'components';
import STRINGS from 'config/localizedStrings';
import { Button, Select, Input, InputNumber, Modal, Rate } from 'antd';
// import { Link } from 'react-router';
import withConfig from 'components/ConfigProvider/withConfig';
import {
	fetchDeals,
	createTransaction,
	fetchTransactions,
} from './actions/p2pActions';
import { COUNTRIES_OPTIONS } from 'utils/countries';
import { formatToCurrency } from 'utils/currency';
import { isMobile } from 'react-device-detect';
import classnames from 'classnames';
import { CloseOutlined } from '@ant-design/icons';
import { fetchFeedback, fetchP2PProfile } from './actions/p2pActions';
import './_P2P.scss';

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
	changeProfileTab,
}) => {
	const [expandRow, setExpandRow] = useState(false);
	const [selectedDeal, setSelectedDeal] = useState();
	const [selectedMethod, setSelectedMethod] = useState();
	const [deals, setDeals] = useState([]);
	const [amountCurrency, setAmountCurrency] = useState();
	const [amountFiat, setAmountFiat] = useState();
	const [filterCoin, setFilterCoin] = useState();
	const [filterDigital, setFilterDigital] = useState();
	const [filterRegion, setFilterRegion] = useState();
	const [filterAmount, setFilterAmount] = useState();
	const [filterMethod, setFilterMethod] = useState();
	const [methods, setMethods] = useState([]);
	const [loading, setLoading] = useState(false);
	const [displayUserFeedback, setDisplayUserFeedback] = useState(false);
	const [userFeedback, setUserFeedback] = useState([]);
	const [userProfile, setUserProfile] = useState();
	const [selectedProfile, setSelectedProfile] = useState();
	const inputRef = useRef(null);
	useEffect(() => {
		fetchDeals({ status: true })
			.then((res) => {
				setDeals(res.data);
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
	}, [refresh]);

	const formatAmount = (currency, amount) => {
		const min = coins[currency].min;
		const formattedAmount = formatToCurrency(amount, min);
		return formattedAmount;
	};

	const formatRate = (rate, spread, asset) => {
		const amount = rate * (1 + Number(spread / 100 || 0));
		return formatAmount(asset, amount);
	};

	return (
		<div
			className={classnames(...['P2pOrder', isMobile ? 'mobile-view-p2p' : ''])}
			style={{
				height: 800,
				overflowY: 'auto',
				width: '100%',
				padding: 20,
			}}
		>
			{displayUserFeedback && (
				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined className="stake_theme" />}
					className="stake_table_theme stake_theme"
					bodyStyle={{}}
					visible={displayUserFeedback}
					width={500}
					footer={null}
					onCancel={() => {
						setDisplayUserFeedback(false);
					}}
				>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: 15,
							marginTop: 10,
						}}
					>
						<div
							style={{
								flex: 1,
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
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
								<div
									style={{
										textAlign: 'center',
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									<div
										style={{
											display: 'flex',
											justifyContent: 'space-between',
											gap: 10,
											marginBottom: 10,
										}}
									>
										<div
											style={{
												padding: 20,
												textAlign: 'center',
												fontWeight: 'bold',
												borderRadius: 5,
												border: '1px solid grey',
											}}
										>
											<div style={{ fontSize: 16 }}>
												<EditWrapper stringId="P2P.TOTAL_ORDERS">
													{STRINGS['P2P.TOTAL_ORDERS']}
												</EditWrapper>
											</div>
											<div style={{ fontSize: 17 }}>
												{userProfile?.totalTransactions} times
											</div>
										</div>
										<div
											style={{
												padding: 20,
												textAlign: 'center',
												fontWeight: 'bold',
												borderRadius: 5,
												border: '1px solid grey',
											}}
										>
											<div style={{ fontSize: 16 }}>
												<EditWrapper stringId="P2P.COMPLETION_RATE">
													{STRINGS['P2P.COMPLETION_RATE']}
												</EditWrapper>
											</div>
											<div style={{ fontSize: 17 }}>
												{(userProfile?.completionRate || 0).toFixed(2)}%
											</div>
										</div>
										<div
											style={{
												padding: 20,
												textAlign: 'center',
												fontWeight: 'bold',
												borderRadius: 5,
												border: '1px solid grey',
											}}
										>
											<div style={{ fontSize: 16 }}>
												<EditWrapper stringId="P2P.POSITIVE_FEEDBACK">
													{STRINGS['P2P.POSITIVE_FEEDBACK']}
												</EditWrapper>
											</div>
											<div style={{ fontSize: 17 }}>
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

								<div
									style={{
										marginTop: 10,
										marginBottom: 10,
										border: '1px solid grey',
										padding: 5,
										width: 150,
										borderRadius: 10,
										fontWeight: 'bold',
										cursor: 'default',
										textAlign: 'center',
									}}
								>
									Feedback({userFeedback.length || 0})
								</div>
								{userFeedback.length == 0 ? (
									<div
										style={{
											textAlign: 'center',
											fontSize: 15,
											border: '1px solid grey',
											padding: 10,
											borderRadius: 5,
										}}
									>
										<EditWrapper stringId="P2P.NO_FEEDBACK">
											{STRINGS['P2P.NO_FEEDBACK']}
										</EditWrapper>
									</div>
								) : (
									<table
										style={{
											border: 'none',
											borderCollapse: 'collapse',
											width: '100%',
										}}
									>
										<thead>
											<tr
												className="table-bottom-border"
												style={{ borderBottom: 'grey 1px solid', padding: 10 }}
											>
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
										<tbody className="font-weight-bold">
											{userFeedback.map((deal) => {
												return (
													<tr
														className="table-row"
														style={{
															borderBottom: 'grey 1px solid',
															padding: 10,
															position: 'relative',
														}}
													>
														<td style={{ width: '25%' }} className="td-fit">
															{deal.comment}
														</td>
														<td style={{ width: '25%' }} className="td-fit">
															<Rate
																disabled
																allowHalf={false}
																autoFocus={false}
																allowClear={false}
																value={deal.rating}
															/>
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
				</Modal>
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

			<div
				style={{
					textAlign: 'center',
					display: 'flex',
					gap: 10,
					alignItems: 'center',
					justifyContent: 'space-between',
					marginTop: 10,
				}}
			>
				<div style={{ display: 'flex', gap: 10 }}>
					<EditWrapper stringId="P2P.SPEND_FIAT_CURRENCY">
						{STRINGS['P2P.SPEND_FIAT_CURRENCY']}
					</EditWrapper>
					<span>
						<Select
							showSearch
							style={{ width: 120 }}
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
				<div style={{ display: 'flex', gap: 10 }}>
					<EditWrapper stringId="P2P.AMOUNT">
						{STRINGS['P2P.AMOUNT']}(Fiat)
					</EditWrapper>
					<span>
						<Input
							value={filterAmount}
							onChange={(e) => {
								setFilterAmount(e.target.value);
							}}
							placeholder={STRINGS['P2P.INPUT_FIAT_AMOUNT']}
						/>
					</span>
				</div>

				<div style={{ display: 'flex', gap: 10 }}>
					<EditWrapper stringId="P2P.PAYMENT_METHOD">
						{STRINGS['P2P.PAYMENT_METHOD']}
					</EditWrapper>
					<span>
						<Select
							showSearch
							style={{ width: 120 }}
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

				<div style={{ display: 'flex', gap: 10 }}>
					<EditWrapper stringId="P2P.AVAILABLE_REGIONS">
						{STRINGS['P2P.AVAILABLE_REGIONS']}
					</EditWrapper>
					<span>
						<Select
							showSearch
							style={{ width: 120 }}
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
			<div className="stake_theme" style={{ display: 'flex', marginTop: 20 }}>
				<table
					style={{ border: 'none', borderCollapse: 'collapse', width: '100%' }}
				>
					<thead>
						<tr
							className="table-bottom-border"
							style={{ borderBottom: 'grey 1px solid', padding: 10 }}
						>
							<th>
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
							<th style={{ display: 'flex', justifyContent: 'flex-end' }}>
								<EditWrapper stringId="P2P.TRADE">
									{STRINGS['P2P.TRADE']}
								</EditWrapper>
							</th>
						</tr>
					</thead>
					<tbody className="font-weight-bold">
						{deals
							.filter(
								(deal) =>
									(filterCoin ? filterCoin === deal.spending_asset : true) &&
									(filterDigital
										? filterDigital === deal.buying_asset
										: true) &&
									(filterAmount ? filterAmount < deal.max_order_value : true) &&
									(filterMethod
										? deal.payment_methods.find(
												(x) => x.system_name === filterMethod
										  )
										: true) &&
									(filterRegion ? filterRegion === deal.region : true)
							)
							.map((deal) => {
								return (
									<>
										<tr
											className={
												expandRow && expandRow && deal.id === selectedDeal.id
													? 'subTable'
													: 'table-row'
											}
											style={{
												borderBottom: 'grey 1px solid',
												padding: 10,
												position: 'relative',
											}}
											//  key={index}
										>
											<td
												style={{ width: '20%', padding: 10, cursor: 'pointer' }}
												onClick={() => {
													setExpandRow(!expandRow);
													setSelectedDeal(deal);
													setAmountCurrency();
													setSelectedMethod();
													setAmountFiat();
												}}
												className="td-fit"
											>
												<span>+</span>{' '}
												<span>
													{deal.merchant.full_name || (
														<EditWrapper stringId="P2P.ANONYMOUS">
															{STRINGS['P2P.ANONYMOUS']}
														</EditWrapper>
													)}
												</span>
											</td>
											<td
												style={{ width: '20%', padding: 10, cursor: 'pointer' }}
												onClick={() => {
													setExpandRow(!expandRow);
													setSelectedDeal(deal);
													setAmountCurrency();
													setSelectedMethod();
													setAmountFiat();
												}}
												className="td-fit"
											>
												{formatRate(
													deal.exchange_rate,
													deal.spread,
													deal.spending_asset
												)}{' '}
												{deal.spending_asset.toUpperCase()}
											</td>
											<td
												style={{ width: '20%', padding: 10, cursor: 'pointer' }}
												className="td-fit"
												onClick={() => {
													setExpandRow(!expandRow);
													setSelectedDeal(deal);
													setAmountCurrency();
													setSelectedMethod();
													setAmountFiat();
												}}
											>
												<div>
													<EditWrapper stringId="P2P.AVAILABLE">
														{STRINGS['P2P.AVAILABLE']}
													</EditWrapper>
													: {deal.total_order_amount}{' '}
													{deal.buying_asset.toUpperCase()}
												</div>
												<div>
													<EditWrapper stringId="P2P.LIMIT">
														{STRINGS['P2P.LIMIT']}
													</EditWrapper>
													: {deal.min_order_value} - {deal.max_order_value}{' '}
													{deal.spending_asset.toUpperCase()}
												</div>
											</td>
											<td
												style={{
													width: '100%',
													flexWrap: 'wrap',
													display: 'flex',
													padding: 10,
													cursor: 'pointer',
												}}
												onClick={() => {
													setExpandRow(!expandRow);
													setSelectedDeal(deal);
													setAmountCurrency();
													setSelectedMethod();
													setAmountFiat();
												}}
											>
												{deal.payment_methods
													.map((method) => method.system_name)
													.join(', ')}
											</td>
											<td
												style={{ width: '30%', padding: 10 }}
												className="td-fit"
											>
												{!(
													expandRow &&
													expandRow &&
													deal.id === selectedDeal.id
												) && (
													<div
														style={{
															display: 'flex',
															justifyContent: 'flex-end',
														}}
													>
														<Button
															className="greenButtonP2P"
															disabled={loading || expandRow || !user?.id}
															onClick={async () => {
																try {
																	if (!expandRow && deal.id !== selectedDeal) {
																		setExpandRow(true);
																		setSelectedDeal(deal);
																		return;
																	}
																	if (amountFiat && selectedMethod) {
																		setLoading(true);
																		const transaction = await createTransaction(
																			{
																				deal_id: selectedDeal.id,
																				amount_fiat: amountFiat,
																				payment_method_used: selectedMethod,
																			}
																		);
																		message.success(
																			STRINGS['P2P.ORDER_CREATED']
																		);
																		const transData = await fetchTransactions({
																			id: transaction.id,
																		});

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
											<tr
												className="subTable"
												style={{
													borderBottom: 'grey 1px solid',
													padding: 10,
													position: 'relative',
												}}
												//  key={index}
											>
												<td
													style={{ minWidth: '15.5em', padding: 10 }}
													className="td-fit"
												>
													<div
														onClick={async () => {
															// changeProfileTab(deal.merchant);

															try {
																setSelectedProfile(deal.merchant);
																const feedbacks = await fetchFeedback({
																	merchant_id: deal.merchant.id,
																});
																const profile = await fetchP2PProfile({
																	user_id: deal.merchant.id,
																});
																setUserFeedback(feedbacks.data);
																setUserProfile(profile);
																setDisplayUserFeedback(true);
															} catch (error) {
																return error;
															}
														}}
														style={{
															position: 'relative',
															bottom: 40,
															cursor: 'pointer',
														}}
													>
														(
														<EditWrapper stringId="P2P.VIEW_PROFILE">
															{STRINGS['P2P.VIEW_PROFILE']}
														</EditWrapper>
														)
													</div>
													<EditWrapper stringId="P2P.PAYMENT_TIME_LIMIT">
														{STRINGS['P2P.PAYMENT_TIME_LIMIT']}
													</EditWrapper>
													<div>
														<EditWrapper stringId="P2P.TERMS_CONDITIONS">
															{STRINGS['P2P.TERMS_CONDITIONS']}
														</EditWrapper>
														: {deal.terms}
													</div>
												</td>
												<td
													style={{ width: '5.5em', padding: 10 }}
													className="td-fit"
												></td>
												<td
													style={{ width: '5.5em', padding: 10 }}
													className="td-fit"
												></td>
												<td
													style={{
														width: '5.5em',
														flexWrap: 'wrap',
														display: 'flex',
														padding: 10,
													}}
												></td>
												<td
													style={{ width: '30em', padding: 10 }}
													className="td-fit"
												>
													<div
														style={{
															display: 'flex',
															justifyContent: 'flex-end',
															flexDirection: 'column',
														}}
													>
														<div
															style={{
																display: 'flex',
																gap: 15,
																marginBottom: 5,
																justifyContent: 'space-between',
															}}
														>
															<EditWrapper stringId="P2P.SELECT_PAYMENT_METHOD">
																{STRINGS['P2P.SELECT_PAYMENT_METHOD']}
															</EditWrapper>
															<span>
																<Select
																	showSearch
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
																			<Select.Option value={method.system_name}>
																				{method.system_name}
																			</Select.Option>
																		);
																	})}
																</Select>
															</span>
														</div>

														<div
															style={{
																display: 'flex',
																gap: 15,
																marginBottom: 5,
																justifyContent: 'space-between',
															}}
														>
															<span>
																<EditWrapper stringId="P2P.SPEND_AMOUNT">
																	{STRINGS['P2P.SPEND_AMOUNT']}
																</EditWrapper>{' '}
																({deal.spending_asset.toUpperCase()})
															</span>

															<span>
																<InputNumber
																	style={{ width: 100 }}
																	value={amountFiat}
																	onChange={(e) => {
																		setAmountFiat(e);
																		const currencyAmount =
																			Number(e) /
																			Number(
																				deal.exchange_rate *
																					(1 + Number(deal.spread / 100 || 0))
																			);

																		const formatted = formatAmount(
																			deal.buying_asset,
																			currencyAmount
																		);

																		setAmountCurrency(formatted);
																	}}
																	placeholder={deal.spending_asset.toUpperCase()}
																/>
															</span>
														</div>
														<div
															style={{
																display: 'flex',
																gap: 15,
																marginBottom: 5,
																justifyContent: 'space-between',
															}}
														>
															<span>
																<EditWrapper stringId="P2P.AMOUNT_TO_RECEIVE">
																	{STRINGS['P2P.AMOUNT_TO_RECEIVE']}
																</EditWrapper>{' '}
																({deal.buying_asset.toUpperCase()})
															</span>

															<span>
																<Input
																	style={{ width: 100 }}
																	className="greyButtonP2P"
																	readOnly
																	value={amountCurrency}
																	placeholder={deal.buying_asset.toUpperCase()}
																/>
															</span>
														</div>
														<div
															style={{
																display: 'flex',
																justifyContent: 'flex-end',
																marginTop: 15,
																gap: 10,
															}}
														>
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
																className="greenButtonP2P"
																disabled={loading || !user?.id}
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
																					amount_fiat: amountFiat,
																					payment_method_used: selectedMethod,
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
													</div>
												</td>
											</tr>
										)}
									</>
								);
							})}
					</tbody>
				</table>
			</div>
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
