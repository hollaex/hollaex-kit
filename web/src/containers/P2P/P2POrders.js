import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { Button } from 'antd';

import './_P2P.scss';
import classnames from 'classnames';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import Filter from './Filters';
import { EditWrapper } from 'components';
import { fetchTransactions } from './actions/p2pActions';
import { formatToCurrency } from 'utils/currency';

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
	const [transactionDetails, setTransactionDetails] = useState([]);
	// const [option, setOption] = useState('2');
	const [transactionStatus, setTransactionStatus] = useState('P2P.ALL_ORDERS');

	const orderStatus = ['P2P.PROCESSING', 'P2P.ALL_ORDERS'];

	useEffect(() => {
		fetchTransactions()
			.then((res) => {
				setTransactions(res.data);
				setTransactionDetails(res.data);
			})
			.catch((err) => err);
	}, [refresh]);

	const formatAmount = (currency, amount) => {
		const min = coins[currency].min;
		const formattedAmount = formatToCurrency(amount, min);
		return formattedAmount;
	};

	const handleStatus = (status) => {
		setTransactionStatus(status);
		if (status === 'P2P.PROCESSING') {
			setFilter('active');
			setTransactions(transactionDetails);
		}
		if (status === 'P2P.ALL_ORDERS') {
			setFilter();
		}
	};
	return (
		<div
			className={classnames(
				...[
					'P2pOrder p2p-order-tab-container',
					isMobile ? 'mobile-view-p2p' : '',
				]
			)}
		>
			<div className="order-status-button-container">
				{orderStatus?.map((status) => {
					return (
						<div
							className={
								transactionStatus === status
									? 'transaction-button-active important-text transaction-button'
									: 'transaction-button'
							}
							onClick={() => handleStatus(status)}
						>
							<EditWrapper stringId={status}>{STRINGS[status]}</EditWrapper>
						</div>
					);
				})}
			</div>
			{transactionStatus === 'P2P.ALL_ORDERS' && (
				<Filter
					transaction={transactions}
					transactionFilter={filter}
					setTransactions={setTransactions}
					transactionDetails={transactionDetails}
					setTransactionDetails={setTransactionDetails}
				/>
			)}
			<div className="stake_theme p2p-order-table-wrapper">
				<table className="p2p-order-table w-100">
					<thead>
						<tr className="table-bottom-border">
							<th className="trade-button-header">
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
							<th>
								<EditWrapper stringId="P2P.OPERATION">
									{STRINGS['P2P.OPERATION']}
								</EditWrapper>
							</th>
						</tr>
					</thead>
					<tbody className="p2p-order-table-body">
						{transactions
							?.filter((x) =>
								filter
									? ['active', 'appealed']?.includes(x?.transaction_status)
									: true
							)
							?.map((transaction) => {
								return (
									<tr className="table-row">
										<td className="trade-button important-text">
											{transaction?.user_id === user?.id ? (
												<Button className="p2p-buy-order-button important-text border-0">
													<span>
														<EditWrapper stringId="P2P.BUY_COIN">
															{STRINGS['P2P.BUY_COIN']}
														</EditWrapper>
														{` ${transaction?.deal?.buying_asset?.toUpperCase()}`}
													</span>
												</Button>
											) : (
												<Button className="p2p-sell-order-button important-text border-0">
													<span>
														<EditWrapper stringId="P2P.SELL_COIN">
															{STRINGS['P2P.SELL_COIN']}
														</EditWrapper>
														{` ${transaction?.deal?.buying_asset?.toUpperCase()}`}
													</span>
												</Button>
											)}
										</td>

										<td className="transaction-fiat-amount">
											<span>${transaction?.amount_fiat}</span>
											<span className="ml-2">
												{transaction?.deal?.spending_asset?.toUpperCase()}
											</span>
										</td>
										<td className="transaction-currency-amount">
											<span>
												$
												{formatAmount(
													transaction?.deal?.buying_asset,
													transaction?.price
												)}
											</span>
											<span className="ml-2">
												{transaction?.deal?.buying_asset?.toUpperCase()}
											</span>
										</td>
										<td className="crypto-amount">
											<span>
												$
												{formatAmount(
													transaction?.deal?.buying_asset,
													transaction?.amount_digital_currency
												)}
											</span>
											<span className="ml-2">
												{transaction?.deal?.buying_asset?.toUpperCase()}
											</span>
										</td>
										<td className="transaction-user-name">
											{transaction?.user_id === user?.id ? (
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
										<td className="transaction-status">
											<span>
												{transaction?.transaction_status?.toUpperCase()}
											</span>
										</td>

										<td className="view-orders">
											<div
												onClick={() => {
													setDisplayOrder(true);
													setSelectedTransaction(transaction);
													router.replace(`/p2p/order/${transaction?.id}`);
												}}
											>
												<EditWrapper stringId="P2P.VIEW_ORDER">
													<span className="purpleTextP2P">
														{STRINGS['P2P.VIEW_ORDER']}
													</span>
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
