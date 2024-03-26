/* eslint-disable */
import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { ReactSVG } from 'react-svg';

import { IconTitle, EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { Button, Input, message, Modal } from 'antd';
import moment from 'moment';
import {
	createChatMessage,
	fetchTransactions,
	updateTransaction,
} from './actions/p2pActions';
import { withRouter } from 'react-router';

import { getToken } from 'utils/token';
import { WS_URL } from 'config/constants';
import { CloseOutlined } from '@ant-design/icons';
import './_P2P.scss';
// const buyerConfirmMessage = () => (
// 	<div
// 		style={{
// 			marginTop: 10,
// 			marginBottom: 10,
// 			textAlign: 'center',
// 			color: 'grey',
// 		}}
// 	>
// 		Buyer has marked this order as paid. Waiting for vendor to check, confirm
// 		and realease funds (23/08,25 23:53)
// 	</div>
// );

// const venderConfirmMessage = () => (
// 	<div
// 		style={{
// 			marginTop: 10,
// 			marginBottom: 10,
// 			textAlign: 'center',
// 			color: 'grey',
// 		}}
// 	>
// 		Vendor confirmed the transaction and released the funds.
// 	</div>
// );

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
	router,
}) => {
	const coin = coins[selectedTransaction.deal.buying_asset];
	const [selectedOrder, setSelectedOrder] = useState(selectedTransaction);
	const [chatMessage, setChatMessage] = useState();
	const [appealReason, setAppealReason] = useState();
	const [appealSide, setAppealSide] = useState();
	const [displayAppealModal, setDisplayAppealModel] = useState(false);
	const [ws, setWs] = useState();
	const [ready, setReady] = useState(false);
	const ref = useRef(null);

	useEffect(() => {
		ref.current.scroll({
			top: 9999,
			behavior: 'smooth',
		});
	}, [selectedOrder.messages]);

	// useEffect(() => {
	// 	fetchTransactions({ id: selectedOrder.id })
	// 	.then(transaction =>{
	// 		setSelectedOrder(transaction.data[0]);
	// 	})
	// 	.catch(err => err)

	// }, [selectedOrder.user_status, selectedOrder.merchant_status])

	useEffect(() => {
		const url = `${WS_URL}/stream?authorization=Bearer ${getToken()}`;
		const p2pWs = new WebSocket(url);

		p2pWs.onopen = (evt) => {
			setWs(p2pWs);
			setReady(true);
			p2pWs.send(
				JSON.stringify({
					op: 'subscribe',
					args: [`p2pChat:${selectedTransaction.id}`],
				})
			);
			setInterval(() => {
				p2pWs.send(
					JSON.stringify({
						op: 'ping',
					})
				);
			}, 55000);
		};

		p2pWs.onmessage = (evt) => {
			const data = JSON.parse(evt.data);
			switch (data.action) {
				case 'addMessage': {
					if (data.data) {
						const { id } = data.data;
						if (selectedOrder.id === id) {
							setSelectedOrder((prevState) => {
								const messages = [...prevState.messages];

								messages.push(data.data);

								return {
									...prevState,
									messages,
								};
							});
						}
					}
					break;
				}

				case 'getStatus': {
					fetchTransactions({ id: selectedOrder.id })
						.then((transaction) => {
							setSelectedOrder(transaction.data[0]);
						})
						.catch((err) => err);
					break;
				}

				default:
					break;
			}
		};

		// p2pWs.onerror = (evt) => {
		// 	console.error('p2p socket error', evt);
		// };

		return () => {
			p2pWs.send(
				JSON.stringify({
					op: 'unsubscribe',
					args: [`p2pChat:${selectedTransaction.id}`],
				})
			);
			p2pWs.close();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		getTransaction();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getTransaction = async () => {
		try {
			const transaction = await fetchTransactions({
				id: selectedOrder.id,
			});
			setSelectedOrder(transaction.data[0]);
		} catch (error) {
			return error;
		}
	};

	const addMessage = (message) => {
		ws.send(
			JSON.stringify({
				op: 'p2pChat',
				args: [
					{
						action: 'addMessage',
						data: message,
					},
				],
			})
		);
	};

	const updateStatus = (status) => {
		ws.send(
			JSON.stringify({
				op: 'p2pChat',
				args: [
					{
						action: 'getStatus',
						data: {
							id: selectedOrder.id,
							status,
						},
					},
				],
			})
		);
	};

	return (
		<>
			<Modal
				maskClosable={false}
				closeIcon={<CloseOutlined className="stake_theme" />}
				className="stake_table_theme stake_theme"
				bodyStyle={{}}
				visible={displayAppealModal}
				width={450}
				footer={null}
				onCancel={() => {
					setDisplayAppealModel(false);
				}}
			>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: 15,
						marginTop: 10,
					}}
				>
					<div
						style={{
							flex: 1,
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<h1 className="stake_theme">Appeal this transaction</h1>
					</div>
					<div style={{ flex: 1 }}>
						<div>Enter the reason why you are appealing this transaction</div>
						<Input
							width={300}
							value={appealReason}
							onChange={(e) => {
								setAppealReason(e.target.value);
							}}
						/>
					</div>
				</div>

				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						gap: 15,
						justifyContent: 'space-between',
						marginTop: 30,
					}}
				>
					<Button
						onClick={() => {
							setDisplayAppealModel(false);
						}}
						style={{
							backgroundColor: '#5D63FF',
							color: 'white',
							flex: 1,
							height: 35,
						}}
						type="default"
					>
						CANCEL
					</Button>
					<Button
						onClick={async () => {
							try {
								if (appealSide === 'merchant') {
									await updateTransaction({
										id: selectedOrder.id,
										merchant_status: 'appeal',
										cancellation_reason: appealReason,
									});

									updateStatus('appeal');
									// const transaction = await fetchTransactions({
									// 	id: selectedOrder.id,
									// });
									// setSelectedOrder(transaction.data[0]);
									message.success(
										'You have appealed the transaction, contact support to resolve your issue'
									);
								} else {
									await updateTransaction({
										id: selectedOrder.id,
										user_status: 'appeal',
										cancellation_reason: appealReason,
									});

									updateStatus('appeal');
									// const transaction = await fetchTransactions({
									// 	id: selectedOrder.id,
									// });
									// setSelectedOrder(transaction.data[0]);
									message.success(
										'You have appealed the transaction, contact support to resolve your issue'
									);
								}
								setAppealSide();
								setDisplayAppealModel(false);
							} catch (error) {
								message.error(error.data.message);
							}
						}}
						style={{
							backgroundColor: '#5D63FF',
							color: 'white',
							flex: 1,
							height: 35,
						}}
						type="default"
					>
						OKAY
					</Button>
				</div>
			</Modal>
			<div
				onClick={() => {
					setDisplayOrder(false);
					router.push('/p2p');
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
				className="P2pOrder"
				style={{
					minHeight: 650,
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
						<div>
							Transaction ID{': '}
							{selectedOrder.transaction_id}
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
							<div style={{ marginBottom: 10 }}>
								Expected time until funds are release: 30 minutes
							</div>

							{user.id === selectedOrder?.user_id && (
								<>
									{selectedOrder.user_status === 'pending' && (
										<>
											<div style={{ marginBottom: 20 }}>
												Please make the payment in the time provided above.
											</div>
											<div style={{ marginBottom: 20 }}>
												The order will otherwise be cancelled
											</div>
										</>
									)}

									{selectedOrder.user_status === 'confirmed' && (
										<div style={{ marginBottom: 20 }}>
											Once funds are released you will find the funds credited
											to your funding wallet
										</div>
									)}

									{selectedOrder.merchant_status === 'cancelled' && (
										<div style={{ marginBottom: 20 }}>
											Vendor cancelled the order, there will not be transfer of
											funds, If you think this is an error, Please contact
											support
										</div>
									)}

									{selectedOrder.merchant_status === 'confirmed' && (
										<div style={{ marginBottom: 20 }}>
											<div style={{ fontSize: 16, fontWeight: 'bold' }}>
												ORDER COMPLETE
											</div>
											<div>
												Vendor confirmed the transaction and funds transferred
												to your balance.
											</div>
										</div>
									)}
									{selectedOrder.merchant_status === 'appeal' && (
										<>
											<div style={{ marginTop: 15, marginBottom: 15 }}>
												Transaction appealed by the vendor, Please contact
												support with transaction id to resolve the issue
											</div>
										</>
									)}
									{selectedOrder.user_status === 'appeal' && (
										<>
											<div style={{ marginTop: 15, marginBottom: 15 }}>
												You appealed the transaction, Please contact support
												with transaction id to resolve the issue
											</div>
										</>
									)}
								</>
							)}

							{user.id === selectedOrder?.merchant_id && (
								<>
									{selectedOrder.merchant_status === 'confirmed' && (
										<div style={{ marginBottom: 20 }}>
											<div style={{ fontSize: 16, fontWeight: 'bold' }}>
												ORDER COMPLETE
											</div>
											<div>
												You've marked this order as complete and released the
												funds
											</div>
										</div>
									)}

									{selectedOrder.user_status === 'pending' && (
										<>
											<div style={{ marginTop: 15, marginBottom: 15 }}>
												The buyer has not sent the payment yet. Once you receive
												payment you will be notified here.
											</div>
											<div style={{ marginBottom: 15 }}>
												Please kindly confirm and relase crpyto funds to buyer
												below once complete
											</div>
										</>
									)}
									{selectedOrder.user_status === 'cancelled' && (
										<>
											<div style={{ marginTop: 15, marginBottom: 15 }}>
												Transaction canceled by the buyer
											</div>
										</>
									)}
									{selectedOrder.user_status === 'confirmed' &&
										selectedOrder?.merchant_status !== 'confirmed' && (
											<>
												<div style={{ marginTop: 15 }}>
													Buyer confirmed the payment
												</div>
												<div style={{ marginTop: 5, marginBottom: 15 }}>
													Please check that the payment from the buyer was sent
													and confirm and release funds below.
												</div>
											</>
										)}
									{selectedOrder.user_status === 'appeal' && (
										<>
											<div style={{ marginTop: 15, marginBottom: 15 }}>
												Transaction appealed by the buyer
											</div>
										</>
									)}
								</>
							)}

							<div style={{ display: 'flex', gap: 10 }}>
								{user.id === selectedOrder?.user_id && (
									<>
										{selectedOrder.user_status === 'confirmed' &&
											selectedOrder.merchant_status === 'pending' && (
												<>
													<div
														onClick={async () => {
															try {
																setDisplayAppealModel(true);
																setAppealSide('user');
															} catch (error) {
																message.error(error.data.message);
															}
														}}
														style={{
															textDecoration: 'underline',
															cursor: 'pointer',
															position: 'relative',
															top: 5,
														}}
													>
														Appeal
													</div>
													<div
														onClick={async () => {
															try {
																await updateTransaction({
																	id: selectedOrder.id,
																	user_status: 'cancelled',
																});
																updateStatus('cancelled');

																// const transaction = await fetchTransactions({
																// 	id: selectedOrder.id,
																// });
																// setSelectedOrder(transaction.data[0]);
																message.success(
																	'You have cancelled the transaction'
																);
															} catch (error) {
																message.error(error.data.message);
															}
														}}
														style={{
															textDecoration: 'underline',
															cursor: 'pointer',
															position: 'relative',
															top: 5,
														}}
													>
														Cancel order
													</div>
												</>
											)}
									</>
								)}

								{user.id === selectedOrder?.merchant_id &&
									selectedOrder?.merchant_status === 'pending' && (
										<span
											style={{
												display: 'flex',
												gap: 10,
												pointerEvents:
													selectedOrder.user_status !== 'confirmed'
														? 'none'
														: 'all',
												opacity:
													selectedOrder.user_status !== 'confirmed' ? 0.5 : 1,
											}}
										>
											<div
												onClick={async () => {
													try {
														setDisplayAppealModel(true);
														setAppealSide('merchant');
													} catch (error) {
														message.error(error.data.message);
													}
												}}
												style={{
													textDecoration: 'underline',
													cursor: 'pointer',
													position: 'relative',
													top: 5,
												}}
											>
												Appeal
											</div>

											<Button
												disabled={selectedOrder.user_status !== 'confirmed'}
												style={{ backgroundColor: '#5E63F6', color: 'white' }}
												onClick={async () => {
													try {
														await updateTransaction({
															id: selectedOrder.id,
															merchant_status: 'confirmed',
														});

														updateStatus('confirmed');

														// const transaction = await fetchTransactions({
														// 	id: selectedOrder.id,
														// });
														// setSelectedOrder(transaction.data[0]);
														message.success(
															'You have confirmed the transaction'
														);
													} catch (error) {
														message.error(error.data.message);
													}
												}}
											>
												CONFIRM AND RELEASE CRYPTO
											</Button>
										</span>
									)}
								{user.id === selectedOrder?.merchant_id &&
									selectedOrder?.merchant_status === 'appeal' && (
										<div style={{ fontWeight: 'bold' }}>
											You have appealed the transaction, Please contact support
											with transaction id to resolve your issue
										</div>
									)}
							</div>
						</div>
					</div>
					<div style={{ flex: 1 }}>
						<div>CHAT WITH VENDOR</div>
						{/* chat box */}
						<div
							className="P2pOrder"
							style={{
								border: '1px solid grey',
								position: 'relative',
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
										You've initiated and created an order with{' '}
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
							<div
								ref={ref}
								style={{
									height: 520,
									overflowY: 'scroll',
									display: 'flex',
									flexDirection: 'column-reverse',
								}}
							>
								<div>
									{selectedOrder?.messages.map((message, index) => {
										if (index === 0) {
											return (
												<div
													style={{
														display: 'flex',
														flexDirection: 'column',
														marginBottom: 20,
														textAlign: 'center',
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
														{message.message} (
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
															<div>You:</div>
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
															<div>
																{message.receiver_id ===
																selectedOrder.merchant_id
																	? 'Buyer'
																	: selectedOrder?.merchant?.full_name}
																:
															</div>
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
									// position: 'absolute',
									// bottom: 0,
									padding: 10,
									marginBottom: 5,
									marginTop: 10,
									border: '1px solid grey',
									width: '100%',
								}}
							>
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										gap: 10,
										pointerEvents:
											selectedOrder.transaction_status === 'complete'
												? 'none'
												: 'all',
									}}
								>
									<div style={{ flex: 6 }}>
										<Input
											value={chatMessage}
											onChange={(e) => {
												setChatMessage(e.target.value);
											}}
										/>
									</div>
									<div
										style={{
											color: '#5A60E5',
											cursor: 'pointer',
											position: 'relative',
											top: 3,
										}}
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

												addMessage({
													sender_id: user.id,
													type: 'message',
													receiver_id:
														user.id === selectedOrder?.merchant_id
															? selectedOrder?.user_id
															: selectedOrder?.merchant_id,
													message: chatMessage,
													id: selectedOrder.id,
												});

												// const transaction = await fetchTransactions({
												// 	id: selectedOrder.id,
												// });
												// setSelectedOrder(transaction.data[0]);
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

			{user.id === selectedOrder?.user_id &&
				selectedOrder.user_status === 'pending' && (
					<div
						style={{
							display: 'flex',
							gap: 10,
							textAlign: 'center',
							justifyContent: 'center',
							marginTop: 10,
						}}
					>
						<Button
							style={{ backgroundColor: '#5E63F6', color: 'white' }}
							onClick={async () => {
								try {
									await updateTransaction({
										id: selectedOrder.id,
										user_status: 'cancelled',
									});

									updateStatus('cancelled');
									// const transaction = await fetchTransactions({
									// 	id: selectedOrder.id,
									// });
									// setSelectedOrder(transaction.data[0]);
									message.success('You have cancelled the transaction');
								} catch (error) {
									message.error(error.data.message);
								}
							}}
						>
							CANCEL
						</Button>
						<Button
							style={{ backgroundColor: '#5E63F6', color: 'white' }}
							onClick={async () => {
								try {
									await updateTransaction({
										id: selectedOrder.id,
										user_status: 'confirmed',
									});
									updateStatus('confirmed');

									// const transaction = await fetchTransactions({
									// 	id: selectedOrder.id,
									// });
									// setSelectedOrder(transaction.data[0]);
									message.success(
										"You've successfuly confirmed the transaction"
									);
								} catch (error) {
									message.error(error.data.message);
								}
							}}
						>
							CONFIRM TRANSFER AND NOTIFY VENDOR
						</Button>
					</div>
				)}
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

export default connect(mapStateToProps)(withRouter(withConfig(P2POrder)));
