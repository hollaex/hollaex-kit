import React from 'react';
import { connect } from 'react-redux';
import { ReactSVG } from 'react-svg';

import { IconTitle, EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { Button, Select, Checkbox, Input } from 'antd';
const P2PMyDeals = ({
	data,
	onClose,
	coins,
	pairs,
	constants = {},
	icons: ICONS,
	transaction_limits,
	tiers = {},
}) => {
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
					<Checkbox style={{ color: 'white' }}>2 Deals</Checkbox>;
				</span>
				<span>
					<Button
						style={{
							backgroundColor: '#5E63F6',
							color: 'white',
						}}
					>
						ACTIVE ALL
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
										backgroundColor: '#288500',
										color: 'white',
									}}
								>
									Buy{' '}
								</Button>
							</td>

							<td style={{ minWidth: '14.5em' }} className="td-fit">
								ACTIVE
							</td>
							<td style={{ minWidth: '14.5em' }} className="td-fit">
								$0.95 USD
							</td>
							<td style={{ minWidth: '14.5em' }} className="td-fit">
								<div>Available: 1.1 BTC</div>
								<div>Limit: $80.00 - $2,243.00 USD</div>
							</td>
							<td
								style={{
									maxWidth: '15em',
									flexWrap: 'wrap',
									display: 'flex',
									padding: 5,
								}}
							>
								SWIFT, Bank transfer, PayPal, NETELLER, BBVA, Other Name,
							</td>
							<td style={{ maxWidth: '14.5em' }} className="td-fit">
								<Button ghost>Edit buy deal</Button>
							</td>
						</tr>

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
										backgroundColor: '#288500',
										color: 'white',
									}}
								>
									Buy{' '}
								</Button>
							</td>

							<td style={{ minWidth: '14.5em' }} className="td-fit">
								ACTIVE
							</td>
							<td style={{ minWidth: '14.5em' }} className="td-fit">
								$0.95 USD
							</td>
							<td style={{ minWidth: '14.5em' }} className="td-fit">
								<div>Available: 1.1 BTC</div>
								<div>Limit: $80.00 - $2,243.00 USD</div>
							</td>
							<td
								style={{
									maxWidth: '15em',
									flexWrap: 'wrap',
									display: 'flex',
									padding: 5,
								}}
							>
								SWIFT, Bank transfer, PayPal, NETELLER, BBVA, Other Name,
							</td>
							<td style={{ maxWidth: '14.5em' }} className="td-fit">
								<Button ghost>Edit buy deal</Button>
							</td>
						</tr>
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
});

export default connect(mapStateToProps)(withConfig(P2PMyDeals));
