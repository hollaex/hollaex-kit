/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
// import { ReactSVG } from 'react-svg';

import { IconTitle, EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { Button, Checkbox, message } from 'antd';
import { fetchDeals, editDeal } from './actions/p2pActions';
import { formatToCurrency } from 'utils/currency';
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
						{myDeals.length === 0 ? (
							<EditWrapper stringId="P2P.NO_DEALS">
								{STRINGS['P2P.NO_DEALS']}
							</EditWrapper>
						) : (
							<EditWrapper stringId="P2P.NUM_DEALS">
								{myDeals.length} {STRINGS['P2P.NUM_DEALS']}
							</EditWrapper>
						)}
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
								message.success(STRINGS['P2P.CHANGES_SAVED']);
							} catch (error) {
								message.error(error.message);
							}
						}}
					>
						<EditWrapper stringId="P2P.ACTIVATE">
							{STRINGS['P2P.ACTIVATE']}
						</EditWrapper>
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
								message.success(STRINGS['P2P.CHANGES_SAVED']);
							} catch (error) {
								message.error(error.message);
							}
						}}
					>
						<EditWrapper stringId="P2P.TAKE_OFFLINE">
							{STRINGS['P2P.TAKE_OFFLINE']}
						</EditWrapper>
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
							<th>
								<EditWrapper stringId="P2P.EDIT">
									{STRINGS['P2P.EDIT']}
								</EditWrapper>
							</th>
							<th>
								<EditWrapper stringId="P2P.SIDE">
									{STRINGS['P2P.SIDE']}
								</EditWrapper>
							</th>
							<th>
								<EditWrapper stringId="P2P.STATUS">
									{STRINGS['P2P.STATUS']}
								</EditWrapper>
							</th>
							<th>
								<EditWrapper stringId="P2P.PRICE_DISPLAYED">
									{STRINGS['P2P.PRICE_DISPLAYED']}
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
							<th>
								<EditWrapper stringId="P2P.EDIT_DEAL">
									{STRINGS['P2P.EDIT_DEAL']}
								</EditWrapper>
							</th>
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
										{deal.status ? (
											<EditWrapper stringId="P2P.ACTIVE">
												{STRINGS['P2P.ACTIVE']}
											</EditWrapper>
										) : (
											<EditWrapper stringId="P2P.INACTIVE">
												{STRINGS['P2P.INACTIVE']}
											</EditWrapper>
										)}
									</td>
									<td style={{ width: '15%' }} className="td-fit">
										{formatRate(
											deal.exchange_rate,
											deal.spread,
											deal.spending_asset
										)}{' '}
										{deal.spending_asset.toUpperCase()}
									</td>
									<td style={{ width: '15%' }} className="td-fit">
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
											<EditWrapper stringId="P2P.EDIT_DEAL_BUTTON">
												{STRINGS['P2P.EDIT_DEAL_BUTTON']}
											</EditWrapper>
											: {deal.side.toUpperCase()}
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
