import React, { useState } from 'react';
import { connect } from 'react-redux';
import { ReactSVG } from 'react-svg';

import { IconTitle, EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { Button, Select, Input, message } from 'antd';
import moment from 'moment';
import { createChatMessage, fetchTransactions } from './actions/p2pActions';

const buyerConfirmMessage = () => (
	<div
		style={{
			marginTop: 10,
			marginBottom: 10,
			textAlign: 'center',
			color: 'grey',
		}}
	>
		Buyer has marked this order as paid. Waiting for vendor to check, confirm
		and realease funds (23/08,25 23:53)
	</div>
);

const venderConfirmMessage = () => (
	<div
		style={{
			marginTop: 10,
			marginBottom: 10,
			textAlign: 'center',
			color: 'grey',
		}}
	>
		Vendor confirmed the transaction and released the funds.
	</div>
);

const P2POrder = ({
	data,
	onClose,
	coins,
	pairs,
	constants = {},
	icons: ICONS,
	transaction_limits,
	tiers = {},
	setDisplayOrder,
	selectedTransaction,
	setSelectedTransaction,
	user,
}) => {
	const coin = coins[selectedTransaction.deal.buying_asset];
	const [selectedOrder, setSelectedOrder] = useState(selectedTransaction);
	const [chatMessage, setChatMessage] = useState();

	return (
		<>
			<div
				onClick={() => {
					setDisplayOrder(false);
				}}
				style={{
					marginBottom: 10,
					cursor: 'pointer',
					textDecoration: 'underline',
				}}
			>
				Back
			</div>
			<div
				style={{
					height: 750,
					backgroundColor: '#303236',
					width: '100%',
					padding: 20,
				}}
			>
				<div
					className="wallet-assets_block"
					style={{ display: 'flex', gap: 50, marginTop: 20 }}
				>
					<div style={{ flex: 1 }}>
						<div style={{ display: 'flex', gap: 10 }}>
							{/* <div>ICON</div> */}
							<div>
								<div>ORDER</div>
								<div>
									Buy {coin?.fullname?.toUpperCase()} (
									{coin?.symbol?.toUpperCase()})
								</div>
							</div>
						</div>
						<div
							style={{
								borderBottom: '1px solid grey',
								marginTop: 10,
								marginBottom: 10,
							}}
						></div>
						<div
							style={{
								flex: 1,
								display: 'flex',
								justifyContent: 'space-between',
							}}
						>
							<div>
								Amount to{' '}
								{user.id === selectedOrder?.merchant_id ? 'sell' : 'send'}:
							</div>
							<div>
								{user.id === selectedOrder?.merchant_id && (
									<div>
										{selectedOrder?.amount_digital_currency}{' '}
										{selectedOrder?.deal?.buying_asset?.toUpperCase()}
									</div>
								)}
								{user.id === selectedOrder?.user_id && (
									<div>
										{selectedOrder?.amount_fiat}{' '}
										{selectedOrder?.deal?.spending_asset?.toUpperCase()}
									</div>
								)}
								<div>(required flat transfer amount)</div>
							</div>
						</div>
						<div
							style={{
								borderBottom: '1px solid grey',
								marginTop: 10,
								marginBottom: 10,
							}}
						></div>
						<div
							style={{
								flex: 1,
								display: 'flex',
								justifyContent: 'space-between',
							}}
						>
							<div>Price:</div>
							<div>
								<div>
									{selectedOrder?.price}{' '}
									{selectedOrder?.deal?.spending_asset?.toUpperCase()}
								</div>
								<div>
									(per {selectedOrder?.deal?.buying_asset?.toUpperCase()})
								</div>
							</div>
						</div>
						<div
							style={{
								borderBottom: '1px solid grey',
								marginTop: 10,
								marginBottom: 10,
							}}
						></div>
						<div
							style={{
								flex: 1,
								display: 'flex',
								justifyContent: 'space-between',
							}}
						>
							<div>Receiving amount:</div>
							{user.id === selectedOrder?.merchant_id && (
								<div>
									<div>
										{selectedOrder?.amount_fiat}{' '}
										{selectedOrder?.deal?.spending_asset?.toUpperCase()}
									</div>
									<div>
										({selectedOrder?.deal?.spending_asset?.toUpperCase()} amount
										you'll receive)
									</div>
								</div>
							)}

							{user.id === selectedOrder?.user_id && (
								<div>
									<div>
										{selectedOrder?.amount_digital_currency}{' '}
										{selectedOrder?.deal?.buying_asset?.toUpperCase()}
									</div>
									<div>
										({selectedOrder?.deal?.buying_asset?.toUpperCase()} amount
										you'll receive)
									</div>
								</div>
							)}
						</div>
						<div
							style={{
								borderBottom: '1px solid grey',
								marginTop: 10,
								marginBottom: 10,
							}}
						></div>

						<div style={{ marginBottom: 20 }}>
							<div>TRANSFER DETAILS</div>
							{user.id === selectedOrder?.user_id && (
								<div style={{ marginBottom: 20 }}>
									Here's the selected payment method, transfer money to seller.
									After you've successfully transferred the money please click
									confirm below to notify the seller
								</div>
							)}

							{user.id === selectedOrder?.merchant_id && (
								<div style={{ marginBottom: 20 }}>
									Below is the payment account and method that is shared with
									the buyer.
								</div>
							)}

							<div style={{ border: '1px solid grey', padding: 15 }}>
								<div
									style={{
										display: 'flex',
										gap: 10,
										marginBottom: 10,
										justifyContent: 'space-between',
									}}
								>
									<div>Payment Method:</div>
									<div>{selectedOrder?.payment_method_used?.system_name}</div>
								</div>

								{selectedOrder?.payment_method_used?.fields?.map((x) => {
									return (
										<div
											style={{
												display: 'flex',
												justifyContent: 'space-between',
											}}
										>
											<div>{x?.name}:</div>
											<div>{x?.value}</div>
										</div>
									);
								})}
							</div>
						</div>

						<div>
							<div>Expected tiem until funds are release: 15m 41s</div>

							{user.id === selectedOrder?.user_id && (
								<div style={{ marginBottom: 20 }}>
									Once funds are released you will find the funds credited to
									your funding wallet
								</div>
							)}

							{user.id === selectedOrder?.merchant_id && (
								<>
									<div style={{ marginTop: 15, marginBottom: 15 }}>
										The buyer has not sent the payment yet. Once you receive
										payment you will be notified here.
									</div>
									<div style={{ marginBottom: 15 }}>
										Please kindly confirm and relase crpyto ufnds to buyer below
										once complete
									</div>
								</>
							)}

							<div style={{ display: 'flex', gap: 10 }}>
								<div>Appeal</div>
								<div>Cancel order</div>
								<div style={{ padding: 10 }}>CONFIRM AND RELEASE CRYPTO</div>
							</div>
						</div>
					</div>
					<div style={{ flex: 1 }}>
						<div>CHAT WITH VENDOR</div>
						{/* chat box */}
						<div
							style={{
								border: '1px solid grey',
								position: 'relative',
								height: '90%',
								backgroundColor: '#383A3E',
								padding: 15,
							}}
						>
							<div>Vendor name: {selectedOrder?.merchant?.full_name}</div>
							<div
								style={{
									borderBottom: '1px solid grey',
									marginTop: 10,
									marginBottom: 10,
								}}
							></div>
							<div
								style={{
									marginTop: 15,
									marginBottom: 20,
									textAlign: 'center',
									color: 'grey',
								}}
							>
								{user.id === selectedOrder?.user_id && (
									<div>
										You've initiated and created an order with
										{selectedOrder?.merchant?.full_name} (
										{moment(selectedOrder?.created_at).format(
											'DD/MMM/YYYY, hh:mmA '
										)}
										).
									</div>
								)}

								{user.id === selectedOrder?.user_id && (
									<div>
										Please communicate with the vendor to confirm your incoming
										payment.
									</div>
								)}
							</div>

							{/* chat */}
							<div style={{ minHeight: 400, overflowY: 'scroll' }}>
								<div>
									{selectedOrder?.messages.map((message, index) => {
										if (index === 0) {
											return (
												<div
													style={{
														display: 'flex',
														flexDirection: 'column',
														marginBottom: 20,
													}}
												>
													<div>{selectedOrder?.merchant?.full_name}:</div>
													<div>{message.message}</div>
													<div>
														{moment(message?.created_at || new Date()).format(
															'DD/MMM/YYYY, hh:mmA '
														)}
													</div>
												</div>
											);
										} else {
											if (message.type === 'notification') {
												return (
													<div
														style={{
															marginTop: 10,
															marginBottom: 10,
															textAlign: 'center',
															color: 'grey',
														}}
													>
														Buyer has marked this order as paid. Waiting for
														vendor to check, confirm and realease funds (
														{moment(message?.created_at || new Date()).format(
															'DD/MMM/YYYY, hh:mmA '
														)}
														)
													</div>
												);
											} else {
												if (message.sender_id === user.id) {
													return (
														<div
															style={{
																display: 'flex',
																flexDirection: 'column',
																textAlign: 'right',
															}}
														>
															<div>Buyer:</div>
															<div>{message.message}</div>
															<div>
																{moment(
																	message?.created_at || new Date()
																).format('DD/MMM/YYYY, hh:mmA ')}
															</div>
														</div>
													);
												} else {
													return (
														<div
															style={{
																display: 'flex',
																flexDirection: 'column',
																marginBottom: 20,
															}}
														>
															<div>{selectedOrder?.merchant?.full_name}:</div>
															<div>{message.message}</div>
															<div>
																{moment(
																	message?.created_at || new Date()
																).format('DD/MMM/YYYY, hh:mmA ')}
															</div>
														</div>
													);
												}
											}
										}
									})}
								</div>
							</div>

							<div
								style={{
									position: 'absolute',
									bottom: 0,
									padding: 10,
									marginBottom: 20,
									border: '1px solid grey',
									width: '90%',
								}}
							>
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										gap: 10,
									}}
								>
									<div style={{ flex: 6 }}>
										<Input
											value={chatMessage}
											onChange={(e) => {
												setChatMessage(e.target.value);
												console.log(e.target.value);
											}}
										/>
									</div>
									<div
										style={{ color: '#5A60E5', cursor: 'pointer' }}
										onClick={async () => {
											try {
												await createChatMessage({
													receiver_id:
														user.id === selectedOrder?.merchant_id
															? selectedOrder?.user_id
															: selectedOrder?.merchant_id,
													message: chatMessage,
													transaction_id: selectedOrder.id,
												});
												const transaction = await fetchTransactions({
													id: selectedOrder.id,
												});
												setSelectedOrder(transaction.data[0]);
												setChatMessage();
											} catch (error) {
												message.error(error.data.message);
											}
										}}
									>
										SEND
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div
				style={{
					display: 'flex',
					gap: 10,
					textAlign: 'center',
					justifyContent: 'center',
					marginTop: 10,
				}}
			>
				<div>CANCEL</div>
				<div>CONFIRM TRANSFER AND NOTIFY VENDOR</div>
			</div>
		</>
	);
};

const mapStateToProps = (state) => ({
	pairs: state.app.pairs,
	coins: state.app.coins,
	constants: state.app.constants,
	transaction_limits: state.app.transaction_limits,
	user: state.user,
});

export default connect(mapStateToProps)(withConfig(P2POrder));
