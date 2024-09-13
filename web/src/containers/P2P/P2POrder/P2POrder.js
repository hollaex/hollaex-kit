import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { Button, Input, message, Rate } from 'antd';
import { CheckCircleTwoTone } from '@ant-design/icons';
import moment from 'moment';

import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import classnames from 'classnames';
import BigNumber from 'bignumber.js';
import '../_P2P.scss';
import P2POrderDetails from './P2POrderDetails';
import P2POrderChat from './P2POrderChat';
import { Dialog, EditWrapper } from 'components';
import {
	createChatMessage,
	fetchTransactions,
	updateTransaction,
	createFeedback,
	fetchFeedback,
} from '../actions/p2pActions';
import { formatToCurrency } from 'utils/currency';
import { getToken } from 'utils/token';
import { WS_URL } from 'config/constants';

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
	p2p_message,
	p2p_status,
	p2p_transaction_id,
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
	// const [ready, setReady] = useState(false);
	const [displayCancelWarning, setDisplayCancelWarning] = useState();
	const [displayConfirmWarning, setDisplayConfirmWarning] = useState();
	const [lastClickTime, setLastClickTime] = useState(0);
	const [displayUserFeedback, setDisplayUserFeedback] = useState(false);
	const [userFeedback, setUserFeedback] = useState([]);
	const [userProfile, setUserProfile] = useState();
	const [selectedProfile, setSelectedProfile] = useState();
	const [isChat, setIsChat] = useState(false);

	useEffect(() => {
		setSelectedOrder((prevState) => {
			if (
				p2p_message?.id === selectedOrder?.id &&
				p2p_message?.receiver_id === user?.id &&
				(p2p_message?.sender_id === prevState?.merchant_id ||
					p2p_message?.sender_id === prevState?.user_id)
			) {
				const found =
					prevState?.messages?.[prevState?.messages?.length - 1]?.message ===
					p2p_message?.message;
				if (!found) {
					return prevState?.messages.push(p2p_message);
				}
			}
			return { ...prevState, ...{ messages: prevState?.messages } };
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [p2p_message]);

	useEffect(() => {
		if (p2p_transaction_id === selectedOrder?.id) updateP2PStatus();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [p2p_status]);

	useEffect(() => {
		fetchFeedback({ transaction_id: selectedOrder?.id })
			.then((res) => {
				if (res?.data?.length > 0) {
					setHasFeedback(true);
				}
			})
			.catch((err) => err);

		if (
			selectedOrder.user_status === 'pending' &&
			moment() >
				moment(selectedOrder?.created_at).add(
					selectedOrder?.transaction_duration || 30,
					'minutes'
				)
		) {
			if (selectedOrder?.transaction_status !== 'expired') {
				updateTransaction({
					id: selectedOrder?.id,
					transaction_status: 'expired',
				})
					.then((res) => {
						setSelectedOrder({
							...selectedOrder,
							transaction_status: 'expired',
						});
					})
					.catch((err) => err);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const url = `${WS_URL}/stream?authorization=Bearer ${getToken()}`;
		const p2pWs = new WebSocket(url);

		p2pWs.onopen = (evt) => {
			setWs(p2pWs);
			// setReady(true);

			setInterval(() => {
				p2pWs.send(
					JSON.stringify({
						op: 'ping',
					})
				);
			}, 55000);
		};

		return () => {
			p2pWs.close();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const updateP2PStatus = () => {
		fetchTransactions({ id: selectedOrder?.id })
			.then((transaction) => {
				if (transaction?.data[0]?.transaction_status === 'complete') {
					setHasFeedback(false);
				}
				setSelectedOrder(transaction?.data[0]);
			})
			.catch((err) => err);
	};
	// const getTransaction = async () => {
	// try {
	// const transaction = await fetchTransactions({
	// id: selectedOrder.id,
	// });
	// setSelectedOrder(transaction.data[0]);
	// } catch (error) {
	// return error;
	// }
	// };

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

		setSelectedOrder((prevState) => {
			return {
				...prevState,
				messages: [...(prevState?.messages || []), message],
			};
		});
	};

	const updateStatus = (status) => {
		ws.send(
			JSON.stringify({
				op: 'p2pChat',
				args: [
					{
						action: 'getStatus',
						data: {
							id: selectedOrder?.id,
							status,
							receiver_id:
								user?.id === selectedOrder?.merchant_id
									? selectedOrder?.user_id
									: selectedOrder?.merchant_id,
						},
					},
				],
			})
		);
	};

	const userReceiveAmount = () => {
		const incrementUnit =
			coins?.[selectedOrder?.deal.buying_asset]?.increment_unit;
		const buyerFeeAmount = new BigNumber(selectedOrder?.amount_digital_currency)
			.multipliedBy(p2p_config?.user_fee)
			.dividedBy(100)
			.toNumber();

		const decimalPoint = new BigNumber(incrementUnit).dp();
		const sourceAmount = new BigNumber(
			selectedOrder?.amount_digital_currency - buyerFeeAmount
		)
			.decimalPlaces(decimalPoint)
			.toNumber();
		return sourceAmount;
	};

	const sendChatMessage = async () => {
		const now = Date.now();
		if (now - lastClickTime >= 1000 && chatMessage?.trim()?.length > 0) {
			try {
				await createChatMessage({
					receiver_id:
						user?.id === selectedOrder?.merchant_id
							? selectedOrder?.user_id
							: selectedOrder?.merchant_id,
					message: chatMessage,
					transaction_id: selectedOrder?.id,
				});

				addMessage({
					sender_id: user?.id,
					type: 'message',
					receiver_id:
						user?.id === selectedOrder?.merchant_id
							? selectedOrder?.user_id
							: selectedOrder?.merchant_id,
					message: chatMessage,
					id: selectedOrder?.id,
				});

				setChatMessage();
			} catch (error) {
				message.error(error.data.message);
			}
			setLastClickTime(now);
		}
	};
	const formatAmount = (currency, amount) => {
		const min = coins[currency].min;
		const formattedAmount = formatToCurrency(amount, min);
		return formattedAmount;
	};

	const isOrderCreated =
		selectedOrder?.transaction_status === 'active' &&
		selectedOrder.user_status === 'pending';
	const isOrderVerified =
		selectedOrder.user_status === 'confirmed' &&
		selectedOrder.merchant_status === 'pending';
	const isOrderConfirmed = selectedOrder.merchant_status === 'confirmed';

	const onHandleConfirmOrder = async () => {
		try {
			await updateTransaction({
				id: selectedOrder?.id,
				user_status: 'confirmed',
			});
			updateP2PStatus();
			updateStatus('confirmed');
			message.success(STRINGS['P2P.CONFIRMED_TRANSACTION']);
		} catch (error) {
			message.error(error.data.message);
		}
	};

	const onHandleCancelOrder = async () => {
		try {
			setDisplayCancelWarning(true);
		} catch (error) {
			message.error(error.data.message);
		}
	};

	const renderConfirmButton = () => {
		return (
			<div className="confirm-notify-button-container">
				<Button
					className="cancel-btn important-text"
					onClick={() => onHandleCancelOrder()}
				>
					<EditWrapper stringId="P2P.CANCEL">
						{STRINGS['P2P.CANCEL']}
					</EditWrapper>
				</Button>
				<Button
					className="confirm-btn important-text"
					onClick={() => onHandleConfirmOrder()}
				>
					<EditWrapper stringId="P2P.CONFIRM_TRANSFER">
						{STRINGS['P2P.CONFIRM_TRANSFER']}
					</EditWrapper>
				</Button>
			</div>
		);
	};
	return (
		<>
			<Dialog
				className="transaction-appeal-popup-wrapper"
				isOpen={displayAppealModal}
				onCloseDialog={() => {
					setDisplayAppealModel(false);
				}}
			>
				<div className="transaction-appeal-popup-container important-text">
					<div className="transaction-appeal-title">
						<EditWrapper stringId="P2P.APPEAL_TRANSACTION">
							{STRINGS['P2P.APPEAL_TRANSACTION']}
						</EditWrapper>
					</div>
					<div className="appeal-reason-container">
						<div className="appeal-reason-title">
							<EditWrapper stringId="P2P.ENTER_REASON">
								{STRINGS['P2P.ENTER_REASON']}
							</EditWrapper>
						</div>
						<Input
							className="appeal-input-field important-text"
							value={appealReason}
							onChange={(e) => {
								setAppealReason(e.target.value);
							}}
						/>
					</div>
				</div>

				<div className="appeal-reason-button-container">
					<Button
						onClick={() => {
							setDisplayAppealModel(false);
						}}
						className="purpleButtonP2P cancel-btn"
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
										id: selectedOrder?.id,
										merchant_status: 'appeal',
										cancellation_reason: appealReason,
									});
									updateP2PStatus();
									updateStatus('appeal');
									message.success(STRINGS['P2P.APPEALED_TRANSACTION']);
								} else {
									await updateTransaction({
										id: selectedOrder.id,
										user_status: 'appeal',
										cancellation_reason: appealReason,
									});
									updateP2PStatus();
									updateStatus('appeal');
									message.success(STRINGS['P2P.APPEALED_TRANSACTION']);
								}
								setAppealSide();
								setDisplayAppealModel(false);
							} catch (error) {
								message.error(error.data.message);
							}
						}}
						className="purpleButtonP2P okay-btn"
						type="default"
					>
						<EditWrapper stringId="P2P.OKAY">{STRINGS['P2P.OKAY']}</EditWrapper>
					</Button>
				</div>
			</Dialog>

			{displayUserFeedback && (
				<Dialog
					className="display-user-feedback-popup-wrapper"
					isOpen={displayUserFeedback}
					onCloseDialog={() => {
						setDisplayUserFeedback(false);
					}}
				>
					<div className="display-user-feedback-popup-container">
						<div className="user-feedback">
							<div className="profile-title">
								{selectedProfile?.full_name || (
									<EditWrapper stringId="P2P.ANONYMOUS">
										{STRINGS['P2P.ANONYMOUS']}
									</EditWrapper>
								)}
								<span className="ml-2">
									(
									<EditWrapper stringId="P2P.TAB_PROFILE">
										{STRINGS['P2P.TAB_PROFILE']}
									</EditWrapper>
									)
								</span>
							</div>

							<div className="user-feedback-details-container">
								<div className="user-feedback-card-container">
									<div className="user-feedback-card-list">
										<div className="user-feedback-card">
											<div className="total-order-text fs-16">
												<EditWrapper stringId="P2P.TOTAL_ORDERS">
													{STRINGS['P2P.TOTAL_ORDERS']}
												</EditWrapper>
											</div>
											<div className="order-times-text">
												<span>{userProfile?.totalTransactions} </span>
												<span>
													<EditWrapper stringId="P2P.TIMES">
														{STRINGS['P2P.TIMES']}
													</EditWrapper>
												</span>
											</div>
										</div>
										<div className="user-feedback-card">
											<div className="total-order-text fs-16">
												<EditWrapper stringId="P2P.COMPLETION_RATE">
													{STRINGS['P2P.COMPLETION_RATE']}
												</EditWrapper>
											</div>
											<div className="order-times-text">
												{(userProfile?.completionRate || 0).toFixed(2)}%
											</div>
										</div>
										<div className="user-feedback-card">
											<div className="total-order-text fs-16">
												<EditWrapper stringId="P2P.POSITIVE_FEEDBACK">
													{STRINGS['P2P.POSITIVE_FEEDBACK']}
												</EditWrapper>
											</div>
											<div className="order-times-text">
												{(userProfile?.positiveFeedbackRate || 0).toFixed(2)}%
											</div>
											<div className="feedback-count">
												<EditWrapper stringId="P2P.POSITIVE">
													{STRINGS['P2P.POSITIVE']}
												</EditWrapper>
												{userProfile?.positiveFeedbackCount} /
												<EditWrapper stringId="P2P.NEGATIVE">
													{STRINGS['P2P.NEGATIVE']}
												</EditWrapper>
												{userProfile?.negativeFeedbackCount}
											</div>
										</div>
									</div>
								</div>

								<div className="total-feedback-count">
									<span>
										<EditWrapper stringId="P2P.FEEDBACK">
											{STRINGS['P2P.FEEDBACK']}
										</EditWrapper>
									</span>
									<span className="ml-2">({userFeedback?.length || 0})</span>
								</div>
								{userFeedback?.length === 0 ? (
									<div className="no-feedback-container">
										<EditWrapper stringId="P2P.NO_FEEDBACK">
											{STRINGS['P2P.NO_FEEDBACK']}
										</EditWrapper>
									</div>
								) : (
									<table className="feedback-table-container w-100">
										<thead>
											<tr className="table-header-row">
												<th>
													<EditWrapper stringId="P2P.COMMENT">
														{STRINGS['P2P.COMMENT']}
													</EditWrapper>
												</th>
												<th>
													<EditWrapper stringId="P2P.RATING">
														{STRINGS['P2P.RATING']}
													</EditWrapper>
												</th>
											</tr>
										</thead>
										<tbody>
											{userFeedback.map((deal) => {
												return (
													<tr className="table-bottom-row">
														<td className="td-fit">{deal.comment}</td>
														<td className="td-fit">
															<Rate
																disabled
																allowHalf={false}
																autoFocus={false}
																allowClear={false}
																value={deal.rating}
															/>
														</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								)}
							</div>
						</div>
					</div>
				</Dialog>
			)}

			{displayFeedbackModal && (
				<Dialog
					className="feedback-submit-popup-wrapper"
					isOpen={displayFeedbackModal}
					onCloseDialog={() => {
						setDisplayFeedbackModel(false);
					}}
				>
					<div className="feedback-submit-popup-container">
						<div className="submit-feedback-title">
							<EditWrapper stringId="P2P.SUBMIT_FEEDBACK">
								{STRINGS['P2P.SUBMIT_FEEDBACK']}
							</EditWrapper>
						</div>
						<div className="feedback-field-container">
							<div className="feedback-label">
								<EditWrapper stringId="P2P.INPUT_FEEDBACK">
									{STRINGS['P2P.INPUT_FEEDBACK']}
								</EditWrapper>
							</div>
							<Input
								className="feedback-input-field important-text"
								value={feedback}
								onChange={(e) => {
									setFeedback(e.target.value);
								}}
							/>
						</div>
						<div className="select-rating-container">
							<div className="select-rating-title">
								<EditWrapper stringId="P2P.SELECT_RATING">
									{STRINGS['P2P.SELECT_RATING']}
								</EditWrapper>
							</div>
							<Rate
								defaultValue={1}
								onChange={(e) => {
									if (e > 0) setRating(e);
								}}
								value={rating}
							/>
						</div>
					</div>

					<div className="submit-transaction-button-container">
						<Button
							onClick={() => {
								setDisplayFeedbackModel(false);
								setFeedback();
								setRating();
							}}
							className="cancel-btn important-text"
							type="default"
						>
							<EditWrapper stringId="P2P.CANCEL">
								{STRINGS['P2P.CANCEL']}
							</EditWrapper>
						</Button>
						<Button
							onClick={async () => {
								try {
									if (!rating || rating === 0) {
										message.error(STRINGS['P2P.SELECT_RATING']);
									}
									if (!feedback) {
										message.error(STRINGS['P2P.INPUT_FEEDBACK']);
									}
									await createFeedback({
										transaction_id: selectedOrder?.id,
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
							className="proceed-btn important-text"
							type="default"
						>
							<EditWrapper stringId="P2P.PROCEED">
								{STRINGS['P2P.PROCEED']}
							</EditWrapper>
						</Button>
					</div>
				</Dialog>
			)}

			{displayCancelWarning && (
				<Dialog
					className="cancel-popup-wrapper feedback-submit-popup-wrapper"
					isOpen={displayCancelWarning}
					onCloseDialog={() => {
						setDisplayCancelWarning(false);
					}}
				>
					<div className="feedback-submit-popup-container">
						<div className="submit-feedback-title">
							<EditWrapper stringId="P2P.CANCEL_WARNING">
								{STRINGS['P2P.CANCEL_WARNING']}
							</EditWrapper>
						</div>
					</div>

					<div className="submit-transaction-button-container">
						<Button
							onClick={() => {
								setDisplayCancelWarning(false);
							}}
							className="cancel-btn important-text"
							type="default"
						>
							<EditWrapper stringId="P2P.NO">{STRINGS['P2P.NO']}</EditWrapper>
						</Button>
						<Button
							onClick={async () => {
								try {
									await updateTransaction({
										id: selectedOrder?.id,
										user_status: 'cancelled',
									});
									updateP2PStatus();
									updateStatus('cancelled');
									message.success(STRINGS['P2P.TRANSACTION_CANCELLED']);
									setDisplayCancelWarning(false);
								} catch (error) {
									message.error(error.data.message);
								}
							}}
							className="proceed-btn important-text"
							type="default"
						>
							<EditWrapper stringId="P2P.PROCEED">
								{STRINGS['P2P.PROCEED']}
							</EditWrapper>
						</Button>
					</div>
				</Dialog>
			)}

			{displayConfirmWarning && (
				<Dialog
					className="confirm-popup-wrapper feedback-submit-popup-wrapper"
					isOpen={displayConfirmWarning}
					onCloseDialog={() => {
						setDisplayConfirmWarning(false);
					}}
				>
					<div className="feedback-submit-popup-container">
						<div className="confirm-title submit-feedback-title">
							<EditWrapper stringId="P2P.CONFIRM_WARNING">
								{STRINGS['P2P.CONFIRM_WARNING']}
							</EditWrapper>
						</div>
					</div>
					<div className="user-receive-amount-detail">
						<span>{userReceiveAmount()}</span>
						<span>{selectedOrder?.deal?.buying_asset?.toUpperCase()} </span>
						<span>
							<EditWrapper stringId="P2P.AMOUNT_RECEIVE">
								{STRINGS['P2P.AMOUNT_RECEIVE']}
							</EditWrapper>
						</span>
					</div>

					<div className="submit-transaction-button-container">
						<Button
							onClick={() => {
								setDisplayConfirmWarning(false);
							}}
							className="cancel-btn important-text"
							type="default"
						>
							<EditWrapper stringId="P2P.NO">{STRINGS['P2P.NO']}</EditWrapper>
						</Button>
						<Button
							onClick={async () => {
								try {
									await updateTransaction({
										id: selectedOrder?.id,
										merchant_status: 'confirmed',
									});
									updateP2PStatus();
									updateStatus('confirmed');
									message.success(STRINGS['P2P.CONFIRMED_TRANSACTION']);
									setDisplayConfirmWarning(false);
								} catch (error) {
									message.error(error.data.message);
								}
							}}
							className="proceed-btn important-text"
							type="default"
						>
							<EditWrapper stringId="P2P.PROCEED">
								{STRINGS['P2P.PROCEED']}
							</EditWrapper>
						</Button>
					</div>
				</Dialog>
			)}

			{!isChat && (
				<div
					className={
						isMobile ? 'back-to-orders-link my-4' : 'back-to-orders-link'
					}
					onClick={() => {
						setDisplayOrder(false);
						router.push('/p2p');
					}}
				>
					{'<'}
					<EditWrapper stringId="REFERRAL_LINK.BACK_LOWER">
						{STRINGS['REFERRAL_LINK.BACK_LOWER']}
					</EditWrapper>
					<span className="ml-2 back-to-order-text">
						<EditWrapper stringId="P2P.BACK_TO_ORDERS">
							{STRINGS['P2P.BACK_TO_ORDERS']}
						</EditWrapper>
					</span>
				</div>
			)}
			{isChat && (
				<div
					className={
						isMobile ? 'back-to-orders-link my-4' : 'back-to-orders-link'
					}
					onClick={() => {
						setIsChat(false);
					}}
				>
					{'<'}
					<EditWrapper stringId="REFERRAL_LINK.BACK_LOWER">
						{STRINGS['REFERRAL_LINK.BACK_LOWER']}
					</EditWrapper>
					<span className="ml-2 back-to-order-text">
						<EditWrapper stringId="P2P.BACK_TO_ORDERS">
							{STRINGS['P2P.BACK_TO_ORDERS']}
						</EditWrapper>
					</span>
				</div>
			)}
			{(isOrderCreated || isOrderVerified || isOrderConfirmed) && !isChat && (
				<div className="custom-stepper-container">
					<div
						className={
							isOrderCreated
								? 'trade-step-active trade-step-one'
								: 'trade-step-one'
						}
					>
						<div className="check-icon">
							{(isOrderCreated || isOrderVerified || isOrderConfirmed) && (
								<CheckCircleTwoTone />
							)}
						</div>
						<div className="trade-step-container">
							<div className={isOrderCreated && 'important-text'}>
								<EditWrapper stringId="P2P.STEP_1">
									{STRINGS['P2P.STEP_1']}:
								</EditWrapper>
							</div>
							<div className="ml-1">
								<EditWrapper stringId="P2P.P2P_ORDER_CREATED">
									{STRINGS['P2P.P2P_ORDER_CREATED']}
								</EditWrapper>
							</div>
						</div>
					</div>
					<div className="trade-custom-line"></div>
					<div
						className={
							isOrderVerified
								? 'trade-step-active trade-step-two'
								: 'trade-step-two'
						}
					>
						<div className="check-icon">
							{(isOrderVerified || isOrderConfirmed) && <CheckCircleTwoTone />}
						</div>
						<div className="trade-step-container">
							<div className={isOrderVerified && 'important-text'}>
								<EditWrapper stringId="P2P.STEP_2">
									{STRINGS['P2P.STEP_2']}:
								</EditWrapper>
							</div>
							<div className="ml-1">
								<EditWrapper stringId="P2P.VENDOR_CHECKS_TITLE">
									{STRINGS['P2P.VENDOR_CHECKS_TITLE']}
								</EditWrapper>
							</div>
						</div>
					</div>

					<div className="trade-custom-line"></div>
					<div
						className={
							isOrderConfirmed
								? 'trade-step-active trade-step-three'
								: 'trade-step-three'
						}
					>
						<div className="check-icon">
							{isOrderConfirmed && <CheckCircleTwoTone />}
						</div>
						<div className="trade-step-container">
							<div className={isOrderConfirmed && 'important-text'}>
								<EditWrapper stringId="P2P.STEP_3">
									{STRINGS['P2P.STEP_3']}:
								</EditWrapper>
							</div>
							<div className="ml-1">
								<EditWrapper stringId="P2P.FUND_RELEASED">
									{STRINGS['P2P.FUND_RELEASED']}
								</EditWrapper>
							</div>
						</div>
					</div>
				</div>
			)}
			{/* <div className='order-expiry-limit-container'>
				<div className='time-remaining-container'>
					<div className='important-text'>
						<EditWrapper stringId="P2P.ORDER_EXPIRY">
							{STRINGS['P2P.ORDER_EXPIRY']}
						</EditWrapper>
					</div>
					<span>30 Minutes</span>
				</div>
				<div className='order-details-container'>
					<div>
						<EditWrapper stringId="P2P.TRANSACTION_ID">
							{STRINGS['P2P.TRANSACTION_ID']}
						</EditWrapper>
					</div>
					<span className='important-text'>{selectedOrder.transaction_id}</span>
				</div>
			</div> */}
			<div
				className={classnames(
					...['P2pOrder p2p-order-wrapper', isMobile ? 'mobile-view-p2p' : '']
				)}
			>
				<div className="wallet-assets_block p2p-order-container">
					{!isChat && (
						<P2POrderDetails
							coin={coin}
							coins={coins}
							user={user}
							ICONS={ICONS}
							selectedOrder={selectedOrder}
							hasFeedback={hasFeedback}
							p2p_config={p2p_config}
							setDisplayConfirmWarning={setDisplayConfirmWarning}
							setAppealSide={setAppealSide}
							userReceiveAmount={userReceiveAmount}
							setDisplayAppealModel={setDisplayAppealModel}
							setDisplayCancelWarning={setDisplayCancelWarning}
							setDisplayFeedbackModel={setDisplayFeedbackModel}
							formatAmount={formatAmount}
							setIsChat={setIsChat}
						/>
					)}

					{(!isMobile || isChat) && (
						<P2POrderChat
							user={user}
							ICONS={ICONS}
							chatMessage={chatMessage}
							selectedOrder={selectedOrder}
							setUserProfile={setUserProfile}
							setChatMessage={setChatMessage}
							sendChatMessage={sendChatMessage}
							setSelectedProfile={setSelectedProfile}
							setUserFeedback={setUserFeedback}
							setDisplayUserFeedback={setDisplayUserFeedback}
						/>
					)}
					{isMobile &&
						!isChat &&
						user?.id === selectedOrder?.user_id &&
						selectedOrder?.transaction_status === 'active' &&
						selectedOrder?.user_status === 'pending' &&
						renderConfirmButton()}
				</div>
			</div>
			{!isMobile &&
				user?.id === selectedOrder?.user_id &&
				selectedOrder?.transaction_status === 'active' &&
				selectedOrder?.user_status === 'pending' &&
				renderConfirmButton()}
		</>
	);
};

const mapStateToProps = (state) => ({
	pairs: state.app.pairs,
	coins: state.app.coins,
	constants: state.app.constants,
	transaction_limits: state.app.transaction_limits,
	p2p_message: state.p2p.chat,
	p2p_status: state.p2p.status,
	p2p_transaction_id: state.p2p.transaction_id,
	user: state.user,
	p2p_config: state.app.constants.p2p_config,
});

export default connect(mapStateToProps)(withRouter(withConfig(P2POrder)));
