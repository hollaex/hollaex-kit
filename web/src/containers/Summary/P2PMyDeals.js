import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ReactSVG } from 'react-svg';

import { IconTitle, EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { Button, Select, Checkbox, Input } from 'antd';
import { fetchDeals } from './actions/p2pActions';

const P2PMyDeals = ({
	data,
	onClose,
	coins,
	pairs,
	constants = {},
	icons: ICONS,
	transaction_limits,
	tiers = {},
	user,
	refresh,
}) => {
	const [myDeals, setMyDeals] = useState([]);

	useEffect(() => {
		fetchDeals({ user_id: user.id })
			.then((res) => {
				setMyDeals(res.data);
			})
			.catch((err) => err);
	}, [refresh]);

	return (
		<div
			style={{
				height: 600,
				backgroundColor: '#303236',
				width: '100%',
				padding: 20,
			}}
		>
			<div style={{ display: 'flex', gap: 10 }}>
				<span>
					<Checkbox style={{ color: 'white' }}>2 Deals</Checkbox>:
				</span>
				<span>
					<Button
						style={{
							backgroundColor: '#5E63F6',
							color: 'white',
						}}
					>
						ACTIVATE ALL
					</Button>
				</span>
				<span>
					<Button
						style={{
							backgroundColor: '#5E63F6',
							color: 'white',
						}}
					>
						TAKE ALL OFFLINE
					</Button>
				</span>
			</div>

			<div
				className="wallet-assets_block"
				style={{ display: 'flex', marginTop: 20 }}
			>
				<table style={{ border: 'none', borderCollapse: 'collapse' }}>
					<thead>
						<tr
							className="table-bottom-border"
							style={{ borderBottom: 'grey 1px solid', padding: 10 }}
						>
							<th>Side</th>
							<th>Status</th>
							<th>Price displayed</th>
							<th>Limit/Available</th>
							<th>Payment</th>
							<th>Edit deal</th>
						</tr>
					</thead>
					<tbody className="font-weight-bold">
						{myDeals.map((deal) => {
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
									<td style={{ minWidth: '14.5em' }} className="td-fit">
										<Button
											style={{
												backgroundColor:
													deal.side === 'buy' ? '#288500' : 'red',
												color: 'white',
											}}
										>
											{deal.side.toUpperCase()}{' '}
										</Button>
									</td>

									<td style={{ minWidth: '14.5em' }} className="td-fit">
										{deal.status ? 'ACTIVE' : 'INACTIVE'}
									</td>
									<td style={{ minWidth: '14.5em' }} className="td-fit">
										{deal.exchange_rate * (1 + Number(deal.spread || 0))}{' '}
										{deal.spending_asset.toUpperCase()}
									</td>
									<td style={{ minWidth: '14.5em' }} className="td-fit">
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
											minWidth: '10em',
											flexWrap: 'wrap',
											display: 'flex',
											padding: 5,
										}}
									>
										{deal.payment_methods
											.map((method) => method.system_name)
											.join(', ')}
									</td>
									<td style={{ minWidth: '14.5em' }} className="td-fit">
										<Button ghost>Edit {deal.side} deal</Button>
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
	user: state.user,
});

export default connect(mapStateToProps)(withConfig(P2PMyDeals));
