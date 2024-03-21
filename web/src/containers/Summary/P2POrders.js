import React from 'react';
import { connect } from 'react-redux';
import { ReactSVG } from 'react-svg';

import { IconTitle, EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { Button, Select, Input } from 'antd';
import P2POrder from './P2POrder';
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
				<Button ghost>Processing</Button>
				<Button ghost>All Orders</Button>
				{/* <Button ghost>Profit & Loss Statement</Button> */}
			</div>

			<div style={{ display: 'flex', marginTop: 20 }}>
				<table style={{ border: 'none', borderCollapse: 'collapse' }}>
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
							<th>Operation</th>
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
							<td style={{ minWidth: '15.5em' }}>
								<Button
									style={{
										backgroundColor: '#288500',
										color: 'white',
									}}
								>
									Buy USDT {'>'}
								</Button>
							</td>

							<td style={{ minWidth: '10.5em' }}>$100 USD</td>
							<td style={{ minWidth: '10.5em' }}>$0.95 USD</td>
							<td style={{ minWidth: '10.5em' }}>105.2354 USDT</td>
							<td style={{ minWidth: '15.5em' }}>name_crypto_vendor</td>
							<td style={{ minWidth: '10.5em' }}>Unpaid</td>

							<td style={{ minWidth: '5.5em' }}>
								<div
									onClick={() => {
										setDisplayOrder(true);
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

						<tr
							className="table-row"
							style={{
								borderBottom: 'grey 1px solid',
								padding: 10,
								position: 'relative',
							}}
							//  key={index}
						>
							<td style={{ minWidth: '10.5em' }}>
								<Button
									style={{
										backgroundColor: '#92433D',
										color: 'white',
									}}
								>
									Sell USDT {'>'}
								</Button>
							</td>

							<td style={{ minWidth: '10.5em' }}>$100 USD</td>
							<td style={{ minWidth: '10.5em' }}>$0.95 USD</td>
							<td style={{ minWidth: '10.5em' }}>105.2354 USDT</td>
							<td style={{ minWidth: '10.5em' }}>name_crypto_vendor</td>
							<td style={{ minWidth: '10.5em' }}>Unpaid</td>

							<td style={{ minWidth: '5.5em', cursor: 'pointer' }}>
								<div
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

export default connect(mapStateToProps)(withConfig(P2POrders));
