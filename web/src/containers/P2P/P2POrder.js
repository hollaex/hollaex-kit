/* eslint-disable */
import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { ReactSVG } from 'react-svg';

import { IconTitle, EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { Button, Input, message, Modal, Rate } from 'antd';
import moment from 'moment';
import {
	createChatMessage,
	fetchTransactions,
	updateTransaction,
	createFeedback,
	fetchFeedback,
} from './actions/p2pActions';
import { withRouter } from 'react-router';

import { getToken } from 'utils/token';
import { WS_URL } from 'config/constants';
import { CloseOutlined } from '@ant-design/icons';
import './_P2P.scss';

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
	p2p_config,
}) => {
	const coin = coins[selectedTransaction.deal.buying_asset];
	const [selectedOrder, setSelectedOrder] = useState(selectedTransaction);
	const [chatMessage, setChatMessage] = useState();
	const [appealReason, setAppealReason] = useState();
	const [feedback, setFeedback] = useState();
	const [rating, setRating] = useState();
	const [appealSide, setAppealSide] = useState();
	const [displayAppealModal, setDisplayAppealModel] = useState(false);
	const [displayFeedbackModal, setDisplayFeedbackModel] = useState(false);
	const [hasFeedback, setHasFeedback] = useState(false);
	const [ws, setWs] = useState();
	const [ready, setReady] = useState(false);
	const ref = useRef(null);

	useEffect(() => {
		ref.current.scroll({
			top: 9999,
			behavior: 'smooth',
		});
	}, [selectedOrder.messages]);

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

		return () => {
			p2pWs.send(
				JSON.stringify({
					op: 'unsubscribe',
					args: [`p2pChat:${selectedTransaction.id}`],
				})
			);
			p2pWs.close();
		};
	}, []);

	useEffect(() => {
		getTransaction();
		fetchFeedback({ transaction_id: selectedOrder.id }).then((res) => {
			if (res?.data?.length > 0) {
				setHasFeedback(true);
			}
		});
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
						<h1 className="stake_theme">
							<EditWrapper stringId="P2P.APPEAL_TRANSACTION">
								{STRINGS['P2P.APPEAL_TRANSACTION']}
							</EditWrapper>
						</h1>
					</div>
					<div style={{ flex: 1 }}>
						<div>
							<EditWrapper stringId="P2P.ENTER_REASON">
								{STRINGS['P2P.ENTER_REASON']}
							</EditWrapper>
						</div>
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
						<EditWrapper stringId="P2P.CANCEL">
							{STRINGS['P2P.CANCEL']}
						</EditWrapper>
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
									message.success(STRINGS['P2P.APPEALED_TRANSACTION']);
								} else {
									await updateTransaction({
										id: selectedOrder.id,
										user_status: 'appeal',
										cancellation_reason: appealReason,
									});

									updateStatus('appeal');
									message.success(STRINGS['P2P.APPEALED_TRANSACTION']);
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
						<EditWrapper stringId="P2P.OKAY">{STRINGS['P2P.OKAY']}</EditWrapper>
					</Button>
				</div>
			</Modal>

			{displayFeedbackModal && (
				<Modal
					maskClosable={false}
					closeIcon={<CloseOutlined className="stake_theme" />}
					className="stake_table_theme stake_theme"
					bodyStyle={{}}
					visible={displayFeedbackModal}
					width={450}
					footer={null}
					onCancel={() => {
						setDisplayFeedbackModel(false);
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
							<h1 className="stake_theme">
								<EditWrapper stringId="P2P.SUBMIT_FEEDBACK">
									{STRINGS['P2P.SUBMIT_FEEDBACK']}
								</EditWrapper>
							</h1>
						</div>
						<div style={{ flex: 1 }}>
							<div>
								<EditWrapper stringId="P2P.INPUT_FEEDBACK">
									{STRINGS['P2P.INPUT_FEEDBACK']}
								</EditWrapper>
							</div>
							<Input
								width={300}
								value={feedback}
								onChange={(e) => {
									setFeedback(e.target.value);
								}}
							/>
						</div>
						<div style={{ flex: 1 }}>
							<div>
								<EditWrapper stringId="P2P.SELECT_RATING">
									{STRINGS['P2P.SELECT_RATING']}
								</EditWrapper>
							</div>
							<Rate onChange={setRating} value={rating} />
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
								setDisplayFeedbackModel(false);
								setFeedback();
								setRating();
							}}
							style={{
								backgroundColor: '#5D63FF',
								color: 'white',
								flex: 1,
								height: 35,
							}}
							type="default"
						>
							<EditWrapper stringId="P2P.CANCEL">
								{STRINGS['P2P.CANCEL']}
							</EditWrapper>
						</Button>
						<Button
							onClick={async () => {
								try {
									if (!rating) {
										message.error(STRINGS['P2P.SELECT_RATING']);
									}
									if (!feedback) {
										message.error(STRINGS['P2P.INPUT_FEEDBACK']);
									}
									await createFeedback({
										transaction_id: selectedOrder.id,
										comment: feedback,
										rating: rating,
									});
									message.success(STRINGS['P2P.FEEDBACK_SUBMITTED']);
									setDisplayFeedbackModel(false);
									setFeedback();
									setRating();
									setHasFeedback(true);
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
							<EditWrapper stringId="P2P.PROCEED">
								{STRINGS['P2P.PROCEED']}
							</EditWrapper>
						</Button>
					</div>
				</Modal>
			)}
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
				<EditWrapper stringId="P2P.BACK">{STRINGS['P2P.BACK']}</EditWrapper>
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
							<div>
								<div>
									<EditWrapper stringId="P2P.ORDER">
										{STRINGS['P2P.ORDER']}
									</EditWrapper>
								</div>
								<div>
									<EditWrapper stringId="P2P.BUY_COIN">
										{STRINGS['P2P.BUY_COIN']}
									</EditWrapper>{' '}
									{coin?.fullname?.toUpperCase()} ({coin?.symbol?.toUpperCase()}
									)
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
							<EditWrapper stringId="P2P.TRANSACTION_ID">
								{STRINGS['P2P.TRANSACTION_ID']}
							</EditWrapper>
							{': '}
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
								<EditWrapper stringId="P2P.AMOUNT_TO">
									{STRINGS['P2P.AMOUNT_TO']}
								</EditWrapper>{' '}
								{user.id === selectedOrder?.merchant_id
									? STRINGS['P2P.SELL']
									: STRINGS['P2P.SEND_UPPER']}
								:
							</div>
							<div>
								{user.id === selectedOrder?.merchant_id && (
									<div style={{ textAlign: 'end' }}>
										{selectedOrder?.amount_digital_currency}{' '}
										{selectedOrder?.deal?.buying_asset?.toUpperCase()}
									</div>
								)}
								{user.id === selectedOrder?.user_id && (
									<div style={{ textAlign: 'end' }}>
										{selectedOrder?.amount_fiat}{' '}
										{selectedOrder?.deal?.spending_asset?.toUpperCase()}
									</div>
								)}
								<div>
									<EditWrapper stringId="P2P.REQUIRED_FLAT_TRANSFER_AMOUNT">
										{STRINGS['P2P.REQUIRED_FLAT_TRANSFER_AMOUNT']}
									</EditWrapper>
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
								<EditWrapper stringId="P2P.PRICE">
									{STRINGS['P2P.PRICE']}
								</EditWrapper>
								:
							</div>
							<div>
								<div style={{ textAlign: 'end' }}>
									{selectedOrder?.price}{' '}
									{selectedOrder?.deal?.spending_asset?.toUpperCase()}
								</div>
								<div>
									<EditWrapper stringId="P2P.PER_COIN">
										{STRINGS['P2P.PER_COIN']}
									</EditWrapper>{' '}
									{selectedOrder?.deal?.buying_asset?.toUpperCase()}
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
								<EditWrapper stringId="P2P.RECEIVING_AMOUNT">
									{STRINGS['P2P.RECEIVING_AMOUNT']}
								</EditWrapper>
								:
							</div>
							{user.id === selectedOrder?.merchant_id && (
								<div>
									<div style={{ textAlign: 'end' }}>
										{selectedOrder?.amount_fiat}{' '}
										{selectedOrder?.deal?.spending_asset?.toUpperCase()}
									</div>
									<div>
										{selectedOrder?.deal?.spending_asset?.toUpperCase()}{' '}
										<EditWrapper stringId="P2P.SPENDING_AMOUNT">
											{STRINGS['P2P.SPENDING_AMOUNT']}
										</EditWrapper>
									</div>
								</div>
							)}

							{user.id === selectedOrder?.user_id && (
								<div>
									<div style={{ textAlign: 'end' }}>
										{selectedOrder?.amount_digital_currency}{' '}
										{selectedOrder?.deal?.buying_asset?.toUpperCase()}
									</div>
									<div>
										{selectedOrder?.deal?.buying_asset?.toUpperCase()}{' '}
										<EditWrapper stringId="P2P.BUYING_AMOUNT">
											{STRINGS['P2P.BUYING_AMOUNT']}
										</EditWrapper>
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
						<div
							style={{
								flex: 1,
								display: 'flex',
								justifyContent: 'space-between',
							}}
						>
							<div>
								<EditWrapper stringId="P2P.FEE">
									{STRINGS['P2P.FEE']}
								</EditWrapper>
								:
							</div>
							{user.id === selectedOrder?.merchant_id && (
								<div>
									<div>{p2p_config?.merchant_fee}%</div>
								</div>
							)}

							{user.id === selectedOrder?.user_id && (
								<div>
									<div>{p2p_config?.user_fee}%</div>
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
							<div>
								<EditWrapper stringId="P2P.TRANSFER_DETAILS">
									{STRINGS['P2P.TRANSFER_DETAILS']}
								</EditWrapper>
							</div>
							{user.id === selectedOrder?.user_id && (
								<div style={{ marginBottom: 20 }}>
									<EditWrapper stringId="P2P.PAYMENT_INSTRUCTIONS">
										{STRINGS['P2P.PAYMENT_INSTRUCTIONS']}
									</EditWrapper>
								</div>
							)}

							{user.id === selectedOrder?.merchant_id && (
								<div style={{ marginBottom: 20 }}>
									<EditWrapper stringId="P2P.PAYMENT_ACCOUNT">
										{STRINGS['P2P.PAYMENT_ACCOUNT']}
									</EditWrapper>
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
									<div>
										<EditWrapper stringId="P2P.PAYMENT_METHOD">
											{STRINGS['P2P.PAYMENT_METHOD']}
										</EditWrapper>
										:
									</div>
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
								<EditWrapper stringId="P2P.EXPECTED_TIME">
									{STRINGS['P2P.EXPECTED_TIME']}
								</EditWrapper>
							</div>

							{user.id === selectedOrder?.user_id && (
								<>
									{selectedOrder.user_status === 'pending' && (
										<>
											<div style={{ marginBottom: 20 }}>
												<EditWrapper stringId="P2P.PAYMENT_TIME">
													{STRINGS['P2P.PAYMENT_TIME']}
												</EditWrapper>
											</div>
											<div style={{ marginBottom: 20 }}>
												<EditWrapper stringId="P2P.ORDER_CANCELLED">
													{STRINGS['P2P.ORDER_CANCELLED']}
												</EditWrapper>
											</div>
										</>
									)}

									{selectedOrder.user_status === 'confirmed' && (
										<div style={{ marginBottom: 20 }}>
											<EditWrapper stringId="P2P.FUNDS_CREDITED">
												{STRINGS['P2P.FUNDS_CREDITED']}
											</EditWrapper>
										</div>
									)}

									{selectedOrder.merchant_status === 'cancelled' && (
										<div style={{ marginBottom: 20 }}>
											<EditWrapper stringId="P2P.VENDOR_CANCELLED">
												{STRINGS['P2P.VENDOR_CANCELLED']}
											</EditWrapper>
										</div>
									)}

									{selectedOrder.merchant_status === 'confirmed' && (
										<div style={{ marginBottom: 20 }}>
											<div style={{ fontSize: 16, fontWeight: 'bold' }}>
												<EditWrapper stringId="P2P.ORDER_COMPLETE">
													{STRINGS['P2P.ORDER_COMPLETE']}
												</EditWrapper>
											</div>
											<div>
												<EditWrapper stringId="P2P.FUNDS_TRANSFERRED">
													{STRINGS['P2P.FUNDS_TRANSFERRED']}
												</EditWrapper>
											</div>
											{!hasFeedback && (
												<Button
													style={{ marginTop: 5 }}
													onClick={() => {
														setDisplayFeedbackModel(true);
													}}
													ghost
												>
													<EditWrapper stringId="P2P.SUBMIT_FEEDBACK">
														{STRINGS['P2P.SUBMIT_FEEDBACK']}
													</EditWrapper>
												</Button>
											)}
										</div>
									)}
									{selectedOrder.merchant_status === 'appeal' && (
										<>
											<div style={{ marginTop: 15, marginBottom: 15 }}>
												<EditWrapper stringId="P2P.VENDOR_APPEALED">
													{STRINGS['P2P.VENDOR_APPEALED']}
												</EditWrapper>
											</div>
										</>
									)}
									{selectedOrder.user_status === 'appeal' && (
										<>
											<div style={{ marginTop: 15, marginBottom: 15 }}>
												<EditWrapper stringId="P2P.USER_APPEALED">
													{STRINGS['P2P.USER_APPEALED']}
												</EditWrapper>
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
												<EditWrapper stringId="P2P.ORDER_COMPLETE">
													{STRINGS['P2P.ORDER_COMPLETE']}
												</EditWrapper>
											</div>
											<div>
												<EditWrapper stringId="P2P.ORDER_COMPLETE_VENDOR">
													{STRINGS['P2P.ORDER_COMPLETE_VENDOR']}
												</EditWrapper>
											</div>
										</div>
									)}

									{selectedOrder.user_status === 'pending' && (
										<>
											<div style={{ marginTop: 15, marginBottom: 15 }}>
												<EditWrapper stringId="P2P.PAYMENT_NOT_SENT">
													{STRINGS['P2P.PAYMENT_NOT_SENT']}
												</EditWrapper>
											</div>
											<div style={{ marginBottom: 15 }}>
												<EditWrapper stringId="P2P.CONFIRM_AND_RELEASE">
													{STRINGS['P2P.CONFIRM_AND_RELEASE']}
												</EditWrapper>
											</div>
										</>
									)}
									{selectedOrder.user_status === 'cancelled' && (
										<>
											<div style={{ marginTop: 15, marginBottom: 15 }}>
												<EditWrapper stringId="P2P.TRANSACTION_CANCELLED">
													{STRINGS['P2P.TRANSACTION_CANCELLED']}
												</EditWrapper>
											</div>
										</>
									)}
									{selectedOrder.user_status === 'confirmed' &&
										selectedOrder?.merchant_status !== 'confirmed' && (
											<>
												<div style={{ marginTop: 15 }}>
													<EditWrapper stringId="P2P.BUYER_CONFIRMED">
														{STRINGS['P2P.BUYER_CONFIRMED']}
													</EditWrapper>
												</div>
												<div style={{ marginTop: 5, marginBottom: 15 }}>
													<EditWrapper stringId="P2P.CHECK_AND_RELEASE">
														{STRINGS['P2P.CHECK_AND_RELEASE']}
													</EditWrapper>
												</div>
											</>
										)}
									{selectedOrder.user_status === 'appeal' && (
										<>
											<div style={{ marginTop: 15, marginBottom: 15 }}>
												<EditWrapper stringId="P2P.USER_APPEALED">
													{STRINGS['P2P.USER_APPEALED']}
												</EditWrapper>
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
														<EditWrapper stringId="P2P.APPEAL">
															{STRINGS['P2P.APPEAL']}
														</EditWrapper>
													</div>
													<div
														onClick={async () => {
															try {
																await updateTransaction({
																	id: selectedOrder.id,
																	user_status: 'cancelled',
																});
																updateStatus('cancelled');
																message.success(
																	STRINGS['P2P.TRANSACTION_CANCELLED']
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
														<EditWrapper stringId="P2P.CANCEL_ORDER">
															{STRINGS['P2P.CANCEL_ORDER']}
														</EditWrapper>
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
												<EditWrapper stringId="P2P.APPEAL">
													{STRINGS['P2P.APPEAL']}
												</EditWrapper>
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
														message.success(
															STRINGS['P2P.CONFIRMED_TRANSACTION']
														);
													} catch (error) {
														message.error(error.data.message);
													}
												}}
											>
												<EditWrapper stringId="P2P.CONFIRM_AND_RELEASE_CRYPTO">
													{STRINGS['P2P.CONFIRM_AND_RELEASE_CRYPTO']}
												</EditWrapper>
											</Button>
										</span>
									)}
								{user.id === selectedOrder?.merchant_id &&
									selectedOrder?.merchant_status === 'appeal' && (
										<div style={{ fontWeight: 'bold' }}>
											<EditWrapper stringId="P2P.VENDOR_APPEALED">
												{STRINGS['P2P.VENDOR_APPEALED']}
											</EditWrapper>
										</div>
									)}
							</div>
						</div>
					</div>
					<div style={{ flex: 1 }}>
						<div>
							<EditWrapper stringId="P2P.CHAT_WITH_VENDOR">
								{STRINGS['P2P.CHAT_WITH_VENDOR']}
							</EditWrapper>
						</div>
						<div
							className="P2pOrder"
							style={{
								border: '1px solid grey',
								position: 'relative',
								padding: 15,
							}}
						>
							<div>
								<EditWrapper stringId="P2P.VENDOR_NAME">
									{STRINGS['P2P.VENDOR_NAME']}
								</EditWrapper>{' '}
								{selectedOrder?.merchant?.full_name}
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
									marginTop: 15,
									marginBottom: 20,
									textAlign: 'center',
									color: 'grey',
								}}
							>
								{user.id === selectedOrder?.user_id && (
									<div>
										<EditWrapper stringId="P2P.ORDER_INITIATED">
											{STRINGS['P2P.ORDER_INITIATED']}
										</EditWrapper>{' '}
										{selectedOrder?.merchant?.full_name} (
										{moment(selectedOrder?.created_at).format(
											'DD/MMM/YYYY, hh:mmA '
										)}
										).
									</div>
								)}

								{user.id === selectedOrder?.user_id && (
									<div>
										<EditWrapper stringId="P2P.CONFIRM_PAYMENT">
											{STRINGS['P2P.CONFIRM_PAYMENT']}
										</EditWrapper>
									</div>
								)}
							</div>

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
														<EditWrapper stringId={`P2P.${message.message}`}>
															{STRINGS[`P2P.${message.message}`]}
														</EditWrapper>{' '}
														(
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
															<div>
																<EditWrapper stringId="P2P.YOU">
																	{STRINGS['P2P.YOU']}
																</EditWrapper>
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
																	? STRINGS['P2P.BUYER']
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

												setChatMessage();
											} catch (error) {
												message.error(error.data.message);
											}
										}}
									>
										<EditWrapper stringId="P2P.SEND_UPPER">
											{STRINGS['P2P.SEND_UPPER']}
										</EditWrapper>
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
									message.success(STRINGS['P2P.TRANSACTION_CANCELLED']);
								} catch (error) {
									message.error(error.data.message);
								}
							}}
						>
							<EditWrapper stringId="P2P.CANCEL">
								{STRINGS['P2P.CANCEL']}
							</EditWrapper>
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
									message.success(STRINGS['P2P.CONFIRMED_TRANSACTION']);
								} catch (error) {
									message.error(error.data.message);
								}
							}}
						>
							<EditWrapper stringId="P2P.CONFIRM_TRANSFER">
								{STRINGS['P2P.CONFIRM_TRANSFER']}
							</EditWrapper>
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
	p2p_config: state.app.constants.p2p_config,
});

export default connect(mapStateToProps)(withRouter(withConfig(P2POrder)));
