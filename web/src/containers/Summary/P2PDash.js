import React, { useState } from 'react';
import { connect } from 'react-redux';
import { ReactSVG } from 'react-svg';
import { Switch } from 'antd';
import { IconTitle, EditWrapper, Coin } from 'components';
import STRINGS from 'config/localizedStrings';
import { Button, Select, Input } from 'antd';
import { Link } from 'react-router';
import withConfig from 'components/ConfigProvider/withConfig';
const P2PDash = ({
	data,
	onClose,
	coins,
	pairs,
	constants = {},
	icons: ICONS,
	transaction_limits,
	tiers = {},
}) => {
	const [expandRow, setExpandRow] = useState(false);

	return (
		<div
			style={{
				height: 800,
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
					<Switch />
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
				<Button ghost>BTC</Button>
				<Button ghost>XHT</Button>
				<Button ghost>USDT</Button>
				<Button ghost>ETH</Button>
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
							style={{ backgroundColor: '#303236' }}
							placeholder="USD"
							// value={}
							onChange={(e) => {}}
						>
							<Select.Option value={1}></Select.Option>
						</Select>
					</span>
				</div>
				<div style={{ display: 'flex', gap: 10 }}>
					<span>Amount</span>
					<span>
						<Input placeholder="Input spend amount" />
					</span>
				</div>

				<div style={{ display: 'flex', gap: 10 }}>
					<span>Payment Method</span>
					<span>
						<Select
							showSearch
							style={{ backgroundColor: '#303236' }}
							placeholder="All payment methods"
							// value={}
							onChange={(e) => {}}
						>
							<Select.Option value={1}></Select.Option>
						</Select>
					</span>
				</div>

				<div style={{ display: 'flex', gap: 10 }}>
					<span>Available Regions</span>
					<span>
						<Select
							showSearch
							style={{ backgroundColor: '#303236' }}
							placeholder="All Region"
							// value={}
							onChange={(e) => {}}
						>
							<Select.Option value={1}></Select.Option>
						</Select>
					</span>
				</div>
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
							<th>Vendor</th>
							<th>Price (Lowest first)</th>
							<th>Limit/Available</th>
							<th>Payment</th>
							<th>Trade</th>
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
							<td
								style={{ minWidth: '15.5em', padding: 10 }}
								className="td-fit"
							>
								<span
									onClick={() => {
										setExpandRow(!expandRow);
									}}
								>
									+
								</span>{' '}
								name_crpyto_vendor
							</td>
							<td
								style={{ minWidth: '15.5em', padding: 10 }}
								className="td-fit"
							>
								$50,000 USD
							</td>
							<td
								style={{ minWidth: '15.5em', padding: 10 }}
								className="td-fit"
							>
								<div>Available: 1.1 BTC</div>
								<div>Limit: $80.00 - $2,243.00 USD</div>
							</td>
							<td
								style={{
									maxWidth: '15em',
									flexWrap: 'wrap',
									display: 'flex',
									padding: 10,
								}}
							>
								SWIFT, Bank transfer, PayPal, NETELLER, BBVA, Other Name,
							</td>
							<td
								style={{ minWidth: '15.5em', padding: 10 }}
								className="td-fit"
							>
								<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
									<Button
										style={{
											backgroundColor: '#288500',
											color: 'white',
										}}
									>
										Buy BTC {'>'}
									</Button>
								</div>
							</td>
						</tr>
						{expandRow && expandRow && (
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
									<div>Payment time limti 30 minutes</div>
									<div>
										Terms and conditions: There are the terms and conditions
										that is set by the vendor here
									</div>
								</td>
								<td
									style={{ minWidth: '15.5em', padding: 10 }}
									className="td-fit"
								></td>
								<td
									style={{ minWidth: '15.5em', padding: 10 }}
									className="td-fit"
								></td>
								<td
									style={{
										maxWidth: '15em',
										flexWrap: 'wrap',
										display: 'flex',
										padding: 10,
									}}
								></td>
								<td style={{ idth: '20.5em', padding: 10 }} className="td-fit">
									<div
										style={{
											display: 'flex',
											justifyContent: 'flex-end',
											flexDirection: 'column',
										}}
									>
										<div style={{ display: 'flex' }}>
											<span>Select payment Method</span>
											<span>
												<Select
													showSearch
													placeholder="Bank transfer"
													// value={}
													onChange={(e) => {}}
												>
													<Select.Option value={1}></Select.Option>
												</Select>
											</span>
										</div>

										<div style={{ display: 'flex' }}>
											<span>Spend Amount</span>
											<span>
												<Input placeholder="USD" />
											</span>
										</div>
										<div style={{ display: 'flex' }}>
											<span>Amount to receive</span>
											<span>
												<Input placeholder="USD" />
											</span>
										</div>
									</div>
								</td>
							</tr>
						)}

						{/* {expandRow &&
                    <tr className="table-row"
                    style={{borderBottom: "grey 1px solid", padding: 10,   }}
                    //  key={index}
                    >
                        <td>
                             <div
                                 className="td-fit"
                                 style={{ minWidth: '15.5em', padding: 10, display: 'flex' }}
                             >
                             <div style={{ flex: 1 }}>
                                 <div >Payment time limti 30 minutes</div>
                                 <div >Terms and conditions: There are the terms and conditions that is set by the vendor here</div>
                             </div>
                             <div style={{ flex: 1 }}>
                                 <div >Payment time limti 30 minutes</div>
                                 <div >Terms and conditions: There are the terms and conditions that is set by the vendor here</div>
                             </div>
                             </div>
                        </td>
                </tr>
                        } */}
						<tr
							className="table-row"
							style={{ borderBottom: 'grey 1px solid', padding: 10 }}
							//  key={index}
						>
							<td
								style={{ minWidth: '15.5em', padding: 10 }}
								className="td-fit"
							>
								<span onClick={() => {}}>+ </span>name_crpyto_vendor
							</td>
							<td
								style={{ minWidth: '15.5em', padding: 10 }}
								className="td-fit"
							>
								$50,000 USD
							</td>
							<td
								style={{ minWidth: '15.5em', padding: 10 }}
								className="td-fit"
							>
								<div>Available: 1.1 BTC</div>
								<div>Limit: $80.00 - $2,243.00 USD</div>
							</td>
							<td
								style={{
									maxWidth: '15em',
									flexWrap: 'wrap',
									display: 'flex',
									padding: 10,
								}}
							>
								SWIFT, Bank transfer, PayPal, NETELLER, BBVA, Other Name,
							</td>
							<td
								style={{ minWidth: '15.5em', padding: 10 }}
								className="td-fit"
							>
								<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
									<Button
										style={{
											backgroundColor: '#288500',
											color: 'white',
										}}
									>
										Buy BTC {'>'}
									</Button>
								</div>
							</td>
						</tr>
						<tr
							className="table-row"
							style={{ borderBottom: 'grey 1px solid', padding: 10 }}
							//  key={index}
						>
							<td
								style={{ minWidth: '15.5em', padding: 10 }}
								className="td-fit"
							>
								<span onClick={() => {}}>+ </span>name_crpyto_vendor
							</td>
							<td
								style={{ minWidth: '15.5em', padding: 10 }}
								className="td-fit"
							>
								$50,000 USD
							</td>
							<td
								style={{ minWidth: '15.5em', padding: 10 }}
								className="td-fit"
							>
								<div>Available: 1.1 BTC</div>
								<div>Limit: $80.00 - $2,243.00 USD</div>
							</td>
							<td
								style={{
									maxWidth: '15em',
									flexWrap: 'wrap',
									display: 'flex',
									padding: 10,
								}}
							>
								SWIFT, Bank transfer, PayPal, NETELLER, BBVA, Other Name,
							</td>
							<td
								style={{ minWidth: '15.5em', padding: 10 }}
								className="td-fit"
							>
								<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
									<Button
										style={{
											backgroundColor: '#288500',
											color: 'white',
										}}
									>
										Buy BTC {'>'}
									</Button>
								</div>
							</td>
						</tr>
						<tr
							className="table-row"
							style={{ borderBottom: 'grey 1px solid', padding: 10 }}
							//  key={index}
						>
							<td
								style={{ minWidth: '15.5em', padding: 10 }}
								className="td-fit"
							>
								<span onClick={() => {}}>+ </span>name_crpyto_vendor
							</td>
							<td
								style={{ minWidth: '15.5em', padding: 10 }}
								className="td-fit"
							>
								$50,000 USD
							</td>
							<td
								style={{ minWidth: '15.5em', padding: 10 }}
								className="td-fit"
							>
								<div>Available: 1.1 BTC</div>
								<div>Limit: $80.00 - $2,243.00 USD</div>
							</td>
							<td
								style={{
									maxWidth: '15em',
									flexWrap: 'wrap',
									display: 'flex',
									padding: 10,
								}}
							>
								SWIFT, Bank transfer, PayPal, NETELLER, BBVA, Other Name,
							</td>
							<td
								style={{ minWidth: '15.5em', padding: 10 }}
								className="td-fit"
							>
								<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
									<Button
										style={{
											backgroundColor: '#288500',
											color: 'white',
										}}
									>
										Buy BTC {'>'}
									</Button>
								</div>
							</td>
						</tr>
						<tr
							className="table-row"
							style={{ borderBottom: 'grey 1px solid', padding: 10 }}
							//  key={index}
						>
							<td
								style={{ minWidth: '15.5em', padding: 10 }}
								className="td-fit"
							>
								<span onClick={() => {}}>+ </span>name_crpyto_vendor
							</td>
							<td
								style={{ minWidth: '15.5em', padding: 10 }}
								className="td-fit"
							>
								$50,000 USD
							</td>
							<td
								style={{ minWidth: '15.5em', padding: 10 }}
								className="td-fit"
							>
								<div>Available: 1.1 BTC</div>
								<div>Limit: $80.00 - $2,243.00 USD</div>
							</td>
							<td
								style={{
									maxWidth: '15em',
									flexWrap: 'wrap',
									display: 'flex',
									padding: 10,
								}}
							>
								SWIFT, Bank transfer, PayPal, NETELLER, BBVA, Other Name,
							</td>
							<td
								style={{ minWidth: '15.5em', padding: 10 }}
								className="td-fit"
							>
								<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
									<Button
										style={{
											backgroundColor: '#288500',
											color: 'white',
										}}
									>
										Buy BTC {'>'}
									</Button>
								</div>
							</td>
						</tr>
						<tr
							className="table-row"
							style={{ borderBottom: 'grey 1px solid', padding: 10 }}
							//  key={index}
						>
							<td
								style={{ minWidth: '15.5em', padding: 10 }}
								className="td-fit"
							>
								<span onClick={() => {}}>+ </span>name_crpyto_vendor
							</td>
							<td
								style={{ minWidth: '15.5em', padding: 10 }}
								className="td-fit"
							>
								$50,000 USD
							</td>
							<td
								style={{ minWidth: '15.5em', padding: 10 }}
								className="td-fit"
							>
								<div>Available: 1.1 BTC</div>
								<div>Limit: $80.00 - $2,243.00 USD</div>
							</td>
							<td
								style={{
									maxWidth: '15em',
									flexWrap: 'wrap',
									display: 'flex',
									padding: 10,
								}}
							>
								SWIFT, Bank transfer, PayPal, NETELLER, BBVA, Other Name,
							</td>
							<td
								style={{ minWidth: '15.5em', padding: 10 }}
								className="td-fit"
							>
								<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
									<Button
										style={{
											backgroundColor: '#288500',
											color: 'white',
										}}
									>
										Buy BTC {'>'}
									</Button>
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

export default connect(mapStateToProps)(withConfig(P2PDash));
