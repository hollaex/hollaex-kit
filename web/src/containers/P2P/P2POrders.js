/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
// import { ReactSVG } from 'react-svg';

import { IconTitle, EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { Button, Radio } from 'antd';
import { fetchTransactions } from './actions/p2pActions';
import { withRouter } from 'react-router';
import { formatToCurrency } from 'utils/currency';
import { isMobile } from 'react-device-detect';
import classnames from 'classnames';
import './_P2P.scss';
const P2POrders = ({
	data,
	onClose,
	coins,
	pairs,
	constants = {},
	icons: ICONS,
	transaction_limits,
	tiers = {},
	setDisplayOrder,
	setSelectedTransaction,
	refresh,
	user,
	router,
	changeProfileTab,
}) => {
	const [transactions, setTransactions] = useState([]);
	const [filter, setFilter] = useState();
	const [option, setOption] = useState('2');

	useEffect(() => {
		fetchTransactions()
			.then((res) => {
				setTransactions(res.data);
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
			className={classnames(...['P2pOrder', isMobile ? 'mobile-view-p2p' : ''])}
			style={{
				height: 600,
				overflowY: 'auto',
				width: '100%',
				padding: 20,
			}}
		>
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
				<Radio.Group value={option} onChange={(e) => setOption(e.target.value)}>
					<Radio.Button
						style={{ marginRight: 5 }}
						className="transparentButtonP2P"
						value="1"
						onClick={() => {
							setFilter('active');
						}}
					>
						<EditWrapper stringId="P2P.PROCESSING">
							{STRINGS['P2P.PROCESSING']}
						</EditWrapper>
					</Radio.Button>
					<Radio.Button
						className="transparentButtonP2P"
						value="2"
						onClick={() => {
							setFilter();
						}}
					>
						<EditWrapper stringId="P2P.ALL_ORDERS">
							{STRINGS['P2P.ALL_ORDERS']}
						</EditWrapper>
					</Radio.Button>
				</Radio.Group>
			</div>

			<div style={{ display: 'flex', marginTop: 20 }} className="stake_theme">
				<table
					style={{ border: 'none', borderCollapse: 'collapse', width: '100%' }}
				>
					<thead>
						<tr
							className="table-bottom-border"
							style={{ borderBottom: 'grey 1px solid', padding: 10 }}
						>
							<th>
								<EditWrapper stringId="P2P.TYPE_COIN">
									{STRINGS['P2P.TYPE_COIN']}
								</EditWrapper>
							</th>
							<th>
								<EditWrapper stringId="P2P.FIAT_AMOUNT">
									{STRINGS['P2P.FIAT_AMOUNT']}
								</EditWrapper>
							</th>
							<th>
								<EditWrapper stringId="P2P.PRICE">
									{STRINGS['P2P.PRICE']}
								</EditWrapper>
							</th>
							<th>
								<EditWrapper stringId="P2P.CRYPTO_AMOUNT">
									{STRINGS['P2P.CRYPTO_AMOUNT']}
								</EditWrapper>
							</th>
							<th>
								<EditWrapper stringId="P2P.COUNTERPARTY">
									{STRINGS['P2P.COUNTERPARTY']}
								</EditWrapper>
							</th>
							<th>
								<EditWrapper stringId="P2P.STATUS">
									{STRINGS['P2P.STATUS']}
								</EditWrapper>
							</th>
							<th
								style={{
									display: 'flex',
									justifyContent: 'flex-end',
								}}
							>
								<EditWrapper stringId="P2P.OPERATION">
									{STRINGS['P2P.OPERATION']}
								</EditWrapper>
							</th>
						</tr>
					</thead>
					<tbody className="font-weight-bold">
						{transactions
							.filter((x) =>
								filter
									? ['active', 'appealed'].includes(x.transaction_status)
									: true
							)
							.map((transaction) => {
								return (
									<tr
										className="table-row"
										style={{
											borderBottom: 'grey 1px solid',
											padding: 10,
											position: 'relative',
										}}
									>
										<td style={{ width: '17%' }}>
											{transaction?.user_id === user.id ? (
												<Button className="buySideP2P">
													<span>
														<EditWrapper stringId="P2P.BUY_COIN">
															{STRINGS['P2P.BUY_COIN']}
														</EditWrapper>
														{` ${transaction?.deal?.buying_asset?.toUpperCase()}`}
													</span>
												</Button>
											) : (
												<Button className="sellSideP2P">
													<span>
														<EditWrapper stringId="P2P.SELL_COIN">
															{STRINGS['P2P.SELL_COIN']}
														</EditWrapper>
														{` ${transaction?.deal?.buying_asset?.toUpperCase()}`}
													</span>
												</Button>
											)}
										</td>

										<td style={{ width: '17%', padding: 10 }}>
											{transaction?.amount_fiat}{' '}
											{transaction?.deal?.spending_asset?.toUpperCase()}
										</td>
										<td style={{ width: '17%' }}>
											{transaction?.price}{' '}
											{transaction?.deal?.buying_asset?.toUpperCase()}
										</td>
										<td style={{ width: '17%' }}>
											{formatAmount(
												transaction?.deal?.buying_asset,
												transaction?.amount_digital_currency
											)}{' '}
											{transaction?.deal?.buying_asset?.toUpperCase()}
										</td>
										<td style={{ width: '10%' }}>
											{transaction?.user_id === user.id ? (
												<span
													style={{ cursor: 'pointer' }}
													onClick={() => {
														changeProfileTab(transaction?.merchant);
													}}
												>
													{transaction?.merchant?.full_name || (
														<EditWrapper stringId="P2P.ANONYMOUS">
															{STRINGS['P2P.ANONYMOUS']}
														</EditWrapper>
													)}
												</span>
											) : (
												<span>
													{transaction?.buyer?.full_name || (
														<EditWrapper stringId="P2P.ANONYMOUS">
															{STRINGS['P2P.ANONYMOUS']}
														</EditWrapper>
													)}
												</span>
											)}
										</td>
										<td style={{ width: '10%' }}>
											{transaction?.transaction_status?.toUpperCase()}
										</td>

										<td style={{ width: '17%' }}>
											<div
												onClick={() => {
													setDisplayOrder(true);
													setSelectedTransaction(transaction);
													router.replace(`/p2p/order/${transaction.id}`);
												}}
												style={{
													display: 'flex',
													justifyContent: 'flex-end',
													cursor: 'pointer',
												}}
												className="purpleTextP2P"
											>
												<EditWrapper stringId="P2P.VIEW_ORDER">
													{STRINGS['P2P.VIEW_ORDER']}
												</EditWrapper>
											</div>
										</td>
									</tr>
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
	router: state.router,
	user: state.user,
});

export default connect(mapStateToProps)(withRouter(withConfig(P2POrders)));
