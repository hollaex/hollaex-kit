import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { Button } from 'antd';
import { CheckCircleTwoTone, PlaySquareTwoTone } from '@ant-design/icons';

import './_P2P.scss';
import classnames from 'classnames';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import Filter from './Filters';
import NoDealsData from './Utilis';
import { Coin, EditWrapper } from 'components';
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
	tab,
}) => {
	const [transactions, setTransactions] = useState([]);
	const [filter, setFilter] = useState();
	const [transactionDetails, setTransactionDetails] = useState([]);
	// const [option, setOption] = useState('2');
	const [transactionStatus, setTransactionStatus] = useState('P2P.ALL_ORDERS');
	const [isFilter, setIsFilter] = useState(false);

	const orderStatus = ['P2P.PROCESSING', 'P2P.ALL_ORDERS'];
	const digitalCurrencies = localStorage?.getItem('digitalCurrencies');
	const selectedCurrencies = JSON.parse(digitalCurrencies);

	useEffect(() => {
		fetchTransactions()
			.then((res) => {
				setTransactions(res.data);
				setTransactionDetails(res.data);
			})
			.catch((err) => err);
	}, [refresh]);

	useEffect(() => {
		if (tab !== 1 && isMobile) {
			setIsFilter(false);
		}
	}, [tab]);

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
					transactions?.length > 0
						? 'P2pOrder p2p-order-tab-container'
						: 'P2pOrder p2p-order-tab-container p2p-no-deals-container',
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
				{isMobile && (
					<span
						className="d-flex justify-content-end w-100 blue-link"
						onClick={() => setIsFilter(!isFilter)}
					>
						{
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
						}
					</span>
				)}
			</div>
			{((transactionStatus === 'P2P.ALL_ORDERS' && !isMobile) || isFilter) && (
				<Filter
					transaction={transactions}
					transactionFilter={filter}
					setTransactions={setTransactions}
					transactionDetails={transactionDetails}
					setTransactionDetails={setTransactionDetails}
					selectedCurrencies={selectedCurrencies}
					tab={tab}
				/>
			)}
			<div className="stake_theme p2p-order-table-wrapper">
				{transactions?.length > 0 ? (
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
									const statusClassMap = {
										complete: 'active-green',
										appealed: 'active-orange',
										active: 'active-yellow',
									};

									const transactionStatusClass =
										statusClassMap[transaction?.transaction_status] ||
										'inactive-text';
									const isDisabled = [
										'expired',
										'cancelled',
										'closed',
									].includes(transaction?.transaction_status);
									return (
										<tr
											className={
												isDisabled
													? 'table-row table-row-inactive fs-12'
													: 'table-row fs-12'
											}
										>
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
												<span>{transaction?.amount_fiat}</span>
												<span className="ml-2">
													{transaction?.deal?.spending_asset?.toUpperCase()}
												</span>
											</td>
											<td className="transaction-currency-amount">
												<span>
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
												<div className="crypto-amount-detail">
													<span>
														{formatAmount(
															transaction?.deal?.buying_asset,
															transaction?.amount_digital_currency
														)}
													</span>
													<span>
														{transaction?.deal?.buying_asset?.toUpperCase()}
													</span>
													<Coin
														iconId={
															coins[transaction?.deal?.buying_asset]?.icon_id
														}
														type={isMobile ? 'CS10' : 'CS4'}
													/>
												</div>
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
												<div className="transaction-status-detail">
													<span className={transactionStatusClass}>
														{transaction?.transaction_status}
													</span>
													{transaction?.transaction_status === 'complete' && (
														<span className="complete-check-icon check-icon">
															<CheckCircleTwoTone />
														</span>
													)}
													{transaction?.transaction_status === 'active' && (
														<span className="active-icon">
															<PlaySquareTwoTone />
														</span>
													)}
												</div>
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
				) : (
					<NoDealsData />
				)}
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
