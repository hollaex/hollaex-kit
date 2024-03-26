import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ReactSVG } from 'react-svg';
import { Switch, message } from 'antd';
import { IconTitle, EditWrapper, Coin } from 'components';
import STRINGS from 'config/localizedStrings';
import { Button, Select, Input, InputNumber } from 'antd';
// import { Link } from 'react-router';
import withConfig from 'components/ConfigProvider/withConfig';
import {
	fetchDeals,
	createTransaction,
	fetchTransactions,
} from './actions/p2pActions';
import { COUNTRIES_OPTIONS } from 'utils/countries';
import { formatToCurrency } from 'utils/currency';
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

	return (
		<div
			style={{
				minHeight: 800,
				backgroundColor: '#303236',
				width: '100%',
				padding: 20,
			}}
		>
			<div
				style={{
					textAlign: 'center',
					display: 'flex',
					gap: 10,
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<span>I want to buy</span>
				<span>
					<Switch disabled />
				</span>
				<span>I want to sell</span>
			</div>
			<div
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

				{Object.values(coins || {})
					.filter((coin) => coin.type !== 'fiat')
					.map((coin) => (
						<Button
							ghost
							onClick={() => {
								setFilterDigital(coin.symbol);
							}}
						>
							{coin.symbol.toUpperCase()}
						</Button>
					))}
				<Button
					ghost
					onClick={() => {
						setFilterDigital();
					}}
				>
					All
				</Button>
			</div>

			<div
				style={{
					textAlign: 'center',
					display: 'flex',
					gap: 10,
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<div style={{ display: 'flex', gap: 10 }}>
					<span>Spend Fiat currency</span>
					<span>
						<Select
							showSearch
							style={{ backgroundColor: '#303236', width: 150 }}
							placeholder="Select fiat"
							value={filterCoin}
							onChange={(e) => {
								setFilterCoin(e);
							}}
						>
							<Select.Option value={null}>All</Select.Option>
							{Object.values(coins || {})
								.filter((coin) => coin.type === 'fiat')
								.map((coin) => (
									<Select.Option value={coin.symbol}>
										{coin.fullname}
									</Select.Option>
								))}
						</Select>
					</span>
				</div>
				<div style={{ display: 'flex', gap: 10 }}>
					<span>Amount</span>
					<span>
						<Input
							value={filterAmount}
							onChange={(e) => {
								setFilterAmount(e.target.value);
							}}
							placeholder="Input spend amount"
						/>
					</span>
				</div>

				<div style={{ display: 'flex', gap: 10 }}>
					<span>Payment Method</span>
					<span>
						<Select
							showSearch
							style={{ backgroundColor: '#303236', width: 120 }}
							placeholder="All payment methods"
							value={filterMethod}
							onChange={(e) => {
								setFilterMethod(e);
							}}
						>
							<Select.Option value={null}>All</Select.Option>
							{methods.map((method) => (
								<Select.Option value={method.system_name}>
									{method.system_name}
								</Select.Option>
							))}
						</Select>
					</span>
				</div>

				<div style={{ display: 'flex', gap: 10 }}>
					<span>Available Regions</span>
					<span>
						<Select
							showSearch
							style={{ backgroundColor: '#303236', width: 120 }}
							placeholder="All Region"
							value={filterRegion}
							onChange={(e) => {
								setFilterRegion(e);
							}}
						>
							<Select.Option value={null}>All</Select.Option>
							{COUNTRIES_OPTIONS.map((cn) => (
								<Select.Option value={cn.value}>{cn.label}</Select.Option>
							))}
						</Select>
					</span>
				</div>
			</div>
			<div
				className="wallet-assets_block"
				style={{ display: 'flex', marginTop: 20 }}
			>
				<table
					style={{ border: 'none', borderCollapse: 'collapse', width: '100%' }}
				>
					<thead>
						<tr
							className="table-bottom-border"
							style={{ borderBottom: 'grey 1px solid', padding: 10 }}
						>
							<th>Vendor</th>
							<th>Price (Lowest first)</th>
							<th>Limit/Available</th>
							<th>Payment</th>
							<th style={{ display: 'flex', justifyContent: 'flex-end' }}>
								Trade
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
											className="table-row"
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
													setAmountFiat();
												}}
												className="td-fit"
											>
												<span>+</span> {deal.merchant.full_name}
											</td>
											<td
												style={{ width: '20%', padding: 10 }}
												className="td-fit"
											>
												{deal.exchange_rate * (1 + Number(deal.spread || 0))}{' '}
												{deal.spending_asset.toUpperCase()}
											</td>
											<td
												style={{ width: '20%', padding: 10 }}
												className="td-fit"
											>
												<div>
													Available: {deal.total_order_amount}{' '}
													{deal.buying_asset.toUpperCase()}
												</div>
												<div>
													Limit: {deal.min_order_value} - {deal.max_order_value}{' '}
													{deal.spending_asset.toUpperCase()}
												</div>
											</td>
											<td
												style={{
													width: '100%',
													flexWrap: 'wrap',
													display: 'flex',
													padding: 10,
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
												<div
													style={{
														display: 'flex',
														justifyContent: 'flex-end',
													}}
												>
													<Button
														style={{
															backgroundColor: '#288500',
															color: 'white',
														}}
														onClick={async () => {
															try {
																if (!expandRow && deal.id !== selectedDeal) {
																	setExpandRow(true);
																	setSelectedDeal(deal);
																	return;
																}
																if (amountFiat && selectedMethod) {
																	const transaction = await createTransaction({
																		deal_id: selectedDeal.id,
																		amount_fiat: amountFiat,
																		payment_method_used: selectedMethod,
																	});
																	message.success('Order Created.');

																	const transData = await fetchTransactions({
																		id: transaction.id,
																	});

																	setSelectedTransaction(transData.data[0]);
																	setDisplayOrder(true);
																} else {
																	message.error(
																		'please select payment method and input amount'
																	);
																}
															} catch (error) {
																message.error(error.data.message);
															}
														}}
													>
														{deal.side === 'sell' ? 'BUY' : 'SELL'}{' '}
														{deal.buying_asset.toUpperCase()} {'>'}
													</Button>
												</div>
											</td>
										</tr>
										{expandRow && expandRow && deal.id === selectedDeal.id && (
											<tr
												className="table-row"
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
													<div>Payment time limit 30 minutes</div>
													<div>Terms and conditions: {deal.terms}</div>
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
															<span>Select payment Method</span>
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
															<span>Spend Amount</span>
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
																					(1 + Number(deal.spread || 0))
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
															<span>Amount to receive</span>
															<span>
																<Input
																	style={{ width: 100 }}
																	readOnly
																	value={amountCurrency}
																/>
															</span>
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
});

export default connect(mapStateToProps)(withConfig(P2PDash));
