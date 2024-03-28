/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
// import { ReactSVG } from 'react-svg';

import { IconTitle, EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { Button, Checkbox, message } from 'antd';
import { fetchDeals, editDeal } from './actions/p2pActions';
import './_P2P.scss';
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
	setSelectedDealEdit,
	setTab,
}) => {
	const [myDeals, setMyDeals] = useState([]);
	const [checks, setCheks] = useState([]);
	useEffect(() => {
		fetchDeals({ user_id: user.id })
			.then((res) => {
				setMyDeals(res.data);
			})
			.catch((err) => err);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [refresh]);

	return (
		<div
			className="P2pOrder"
			style={{
				minHeight: 600,
				width: '100%',
				padding: 20,
			}}
		>
			<div style={{ display: 'flex', gap: 10 }}>
				<span>
					<Checkbox
						onChange={(e) => {
							if (e.target.checked) {
								setCheks(myDeals.map((deal) => deal.id));
							} else {
								setCheks([]);
							}
						}}
						style={{ color: 'white', position: 'relative', top: 5 }}
					>
						{myDeals.length === 0
							? 'There are no deals'
							: `${myDeals.length} Deals:`}
					</Checkbox>
				</span>
				<span>
					<Button
						style={{
							backgroundColor: '#5E63F6',
							color: 'white',
						}}
						onClick={async () => {
							try {
								await editDeal({
									edited_ids: checks,
									status: true,
								});
								const res = await fetchDeals({ user_id: user.id });
								setMyDeals(res.data);
								setCheks([]);
								message.success('changes saved');
							} catch (error) {
								message.error(error.message);
							}
						}}
					>
						ACTIVATE
					</Button>
				</span>
				<span>
					<Button
						style={{
							backgroundColor: '#5E63F6',
							color: 'white',
						}}
						onClick={async () => {
							try {
								await editDeal({
									edited_ids: checks,
									status: false,
								});
								const res = await fetchDeals({ user_id: user.id });
								setMyDeals(res.data);
								message.success('changes saved');
							} catch (error) {
								message.error(error.message);
							}
						}}
					>
						TAKE OFFLINE
					</Button>
				</span>
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
							<th>Edit</th>
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
									<td style={{ width: '5%' }} className="td-fit">
										<Checkbox
											checked={checks.find((id) => id === deal.id)}
											onChange={(e) => {
												if (e.target.checked) {
													if (!checks.find((id) => id === deal.id))
														setCheks([...checks, deal.id]);
												} else {
													setCheks(checks.filter((id) => id !== deal.id));
												}
											}}
										/>
									</td>

									<td style={{ width: '15%' }} className="td-fit">
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

									<td style={{ width: '15%' }} className="td-fit">
										{deal.status ? 'ACTIVE' : 'INACTIVE'}
									</td>
									<td style={{ width: '15%' }} className="td-fit">
										{deal.exchange_rate * (1 + Number(deal.spread || 0))}{' '}
										{deal.spending_asset.toUpperCase()}
									</td>
									<td style={{ width: '15%' }} className="td-fit">
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
											width: '15%',
											flexWrap: 'wrap',
											display: 'flex',
											padding: 5,
										}}
									>
										{deal.payment_methods
											.map((method) => method.system_name)
											.join(', ')}
									</td>
									<td style={{ width: '15%' }} className="td-fit">
										<Button
											onClick={() => {
												setSelectedDealEdit(deal);
												setTab('3');
											}}
											ghost
										>
											Edit {deal.side} deal
										</Button>
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
