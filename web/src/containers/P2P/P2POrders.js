/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
// import { ReactSVG } from 'react-svg';

import { IconTitle, EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { Button } from 'antd';
import { fetchTransactions } from './actions/p2pActions';
import { withRouter } from 'react-router';
import { formatToCurrency } from 'utils/currency';
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
	router,
}) => {
	const [transactions, setTransactions] = useState([]);
	const [filter, setFilter] = useState();
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
			className="P2pOrder"
			style={{
				minHeight: 600,
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
				<Button
					ghost
					onClick={() => {
						setFilter('active');
					}}
				>
					Processing
				</Button>
				<Button
					ghost
					onClick={() => {
						setFilter();
					}}
				>
					All Orders
				</Button>
				{/* <Button ghost>Profit & Loss Statement</Button> */}
			</div>

			<div style={{ display: 'flex', marginTop: 20 }}>
				<table
					style={{ border: 'none', borderCollapse: 'collapse', width: '100%' }}
				>
					<thead>
						<tr
							className="table-bottom-border"
							style={{ borderBottom: 'grey 1px solid', padding: 10 }}
						>
							<th>Type/Coin</th>
							<th>Fiat amount</th>
							<th>Price</th>
							<th>Crypto amount</th>
							<th>Counterparty</th>
							<th>Status</th>
							<th
								style={{
									display: 'flex',
									justifyContent: 'flex-end',
								}}
							>
								Operation
							</th>
						</tr>
					</thead>
					<tbody className="font-weight-bold">
						{transactions
							.filter((x) => (filter ? x.transaction_status === filter : true))
							.map((transaction) => {
								return (
									<tr
										className="table-row"
										style={{
											borderBottom: 'grey 1px solid',
											padding: 10,
											position: 'relative',
										}}
										//  key={index}
									>
										<td style={{ width: '17%' }}>
											<Button
												style={{
													backgroundColor: '#288500',
													color: 'white',
												}}
											>
												Buy {transaction?.deal?.buying_asset?.toUpperCase()}
											</Button>
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
											{transaction?.merchant?.full_name}
										</td>
										<td style={{ width: '10%' }}>
											{transaction?.transaction_status?.toUpperCase()}
										</td>

										<td style={{ width: '17%' }}>
											<div
												onClick={() => {
													setDisplayOrder(true);
													setSelectedTransaction(transaction);
													router.push(`p2p/order/${transaction.id}`);
												}}
												style={{
													display: 'flex',
													justifyContent: 'flex-end',
													color: '#5E63F6',
													cursor: 'pointer',
												}}
											>
												View order
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
});

export default connect(mapStateToProps)(withRouter(withConfig(P2POrders)));
