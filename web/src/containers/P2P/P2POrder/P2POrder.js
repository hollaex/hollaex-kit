import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { isMobile } from 'react-device-detect';
import { Button, Checkbox, Input, message, Rate, Tooltip } from 'antd';
import {
	CheckCircleTwoTone,
	CheckSquareTwoTone,
	ExclamationCircleFilled,
	ExclamationOutlined,
	SendOutlined,
} from '@ant-design/icons';

import { Coin, Dialog, EditWrapper, Image } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import moment from 'moment';
import {
	createChatMessage,
	fetchTransactions,
	updateTransaction,
	createFeedback,
	fetchFeedback,
	fetchP2PProfile,
} from '../actions/p2pActions';
import { formatToCurrency } from 'utils/currency';
import { getToken } from 'utils/token';
import { WS_URL } from 'config/constants';
import { renderFeedback, Timer } from '../Utilis';
import classnames from 'classnames';
import BigNumber from 'bignumber.js';
import '../_P2P.scss';
import P2POrderChat from './P2POrderChat';
import P2POrderDetails from './P2POrderDetails';

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
	isChat,
	selectedProfile,
	setSelectedProfile,
	displayUserFeedback,
	setDisplayUserFeedback,
	userFeedback,
	setUserFeedback,
	userProfile,
	setUserProfile,
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
	const [isDecalred, setIsDecalred] = useState(false);
	const [displayReleasedAmountPopup, setDisplayReleasedAmountPopup] = useState(
		false
	);

	const ref = useRef(null);
	const buttonRef = useRef(null);

	useEffect(() => {
		if (ref.current) {
			ref.current.scroll({
				top: 9999,
				behavior: 'smooth',
			});
		}
	}, [selectedOrder.messages]);

	const handleKeyDown = (event) => {
		if (event.key === 'Enter') {
			buttonRef.current.click();
		}
	};

	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);

		// Cleanup the event listener on component unmount
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	useEffect(() => {
		setSelectedOrder((prevState) => {
			if (
				p2p_message.id === selectedOrder.id &&
				p2p_message.receiver_id === user.id &&
				(p2p_message.sender_id === prevState.merchant_id ||
					p2p_message.sender_id === prevState.user_id)
			) {
				const found =
					prevState?.messages?.[prevState?.messages?.length - 1]?.message ===
					p2p_message.message;
				if (!found) {
					return {
						...prevState,
						messages: [...(prevState?.messages || []), p2p_message],
					};
				}
			}
			return { ...prevState, ...{ messages: prevState?.messages } };
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [p2p_message]);

	useEffect(() => {
		if (p2p_transaction_id === selectedOrder.id) updateP2PStatus();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [p2p_status]);

	useEffect(() => {
		fetchFeedback({ transaction_id: selectedOrder.id, user_id: user.id })
			.then((res) => {
				if (res?.data?.length > 0) {
					setHasFeedback(true);
				}
			})
			.catch((err) => err);

		if (
			selectedOrder.user_status === 'pending' &&
			moment() >
				moment(selectedOrder.created_at).add(
					selectedOrder.transaction_duration || 30,
					'minutes'
				)
		) {
			if (selectedOrder.transaction_status !== 'expired') {
				updateTransaction({
					id: selectedOrder.id,
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
		let pingInterval;

		const connectWebSocket = () => {
			const url = `${WS_URL}/stream?authorization=Bearer ${getToken()}`;
			const p2pWs = new WebSocket(url);

			p2pWs.onopen = () => {
				setWs(p2pWs);

				if (selectedTransaction.first_created) {
					p2pWs.send(
						JSON.stringify({
							op: 'p2pChat',
							args: [
								{
									action: 'getStatus',
									data: {
										id: selectedTransaction.id,
										status: 'created',
										title: 'p2p',
										receiver_id:
											user.id === selectedTransaction?.merchant_id
												? selectedTransaction?.user_id
												: selectedTransaction?.merchant_id,
									},
								},
							],
						})
					);
				}

				pingInterval = setInterval(() => {
					if (p2pWs.readyState === WebSocket.OPEN) {
						p2pWs.send(JSON.stringify({ op: 'ping' }));
					}
				}, 55000);
			};

			p2pWs.onclose = (event) => {
				clearInterval(pingInterval);
				setTimeout(connectWebSocket, 3000);
			};

			p2pWs.onerror = (error) => {
				clearInterval(pingInterval);
				p2pWs.close();
			};

			return p2pWs;
		};

		const p2pWs = connectWebSocket();

		return () => {
			clearInterval(pingInterval);
			p2pWs.close();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const updateP2PStatus = () => {
		fetchTransactions({ id: selectedOrder.id })
			.then((transaction) => {
				if (transaction.data[0].transaction_status === 'complete') {
					setHasFeedback(false);
				}
				setSelectedOrder(transaction.data[0]);
			})
			.catch((err) => err);
	};
	// const getTransaction = async () => {
	// 	try {
	// 		const transaction = await fetchTransactions({
	// 			id: selectedOrder.id,
	// 		});
	// 		setSelectedOrder(transaction.data[0]);
	// 	} catch (error) {
	// 		return error;
	// 	}
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

	const updateStatus = (status, title = '') => {
		ws.send(
			JSON.stringify({
				op: 'p2pChat',
				args: [
					{
						action: 'getStatus',
						data: {
							id: selectedOrder.id,
							status,
							title,
							receiver_id:
								user.id === selectedOrder?.merchant_id
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
			coins?.[selectedOrder.deal.buying_asset]?.increment_unit;
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
						user.id === selectedOrder?.merchant_id
							? selectedOrder?.user_id
							: selectedOrder?.merchant_id,
					message: chatMessage,
					transaction_id: selectedOrder.id,
				});

				addMessage({
					sender_id: user.id,
					sender_name: user?.full_name,
					type: 'message',
					receiver_id:
						user.id === selectedOrder?.merchant_id
							? selectedOrder?.user_id
							: selectedOrder?.merchant_id,
					receiver_name:
						user.id === selectedOrder?.merchant_id
							? selectedOrder?.buyer?.full_name
							: selectedOrder?.merchant?.full_name,
					message: chatMessage,
					id: selectedOrder.id,
				});

				setChatMessage();
			} catch (error) {
				message.error(error.data.message);
			}
			setLastClickTime(now);
		}
	};

	const isOrderCreated =
		selectedOrder?.transaction_status === 'active' &&
		selectedOrder.user_status === 'pending';
	const isOrderVerified =
		selectedOrder.user_status === 'confirmed' &&
		selectedOrder.merchant_status === 'pending';
	const isOrderConfirmed = selectedOrder.merchant_status === 'confirmed';

	const formatAmount = (currency, amount) => {
		const min = coins[currency]?.min;
		const formattedAmount = formatToCurrency(amount, min);
		return formattedAmount;
	};

	return (
		<>
			<Dialog
				className="transaction-appeal-popup-wrapper"
				isOpen={displayAppealModal}
				onCloseDialog={() => {
					setDisplayAppealModel(false);
				}}
				label="transaction-appeal-popup"
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

			{displayUserFeedback &&
				renderFeedback(
					displayUserFeedback,
					setDisplayUserFeedback,
					selectedProfile,
					userProfile,
					userFeedback
				)}

			{displayFeedbackModal && (
				<Dialog
					className="feedback-submit-popup-wrapper"
					isOpen={displayFeedbackModal}
					onCloseDialog={() => {
						setDisplayFeedbackModel(false);
					}}
					label="feedback-submit-popup"
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
								defaultValue={0}
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
							className="cancel-btn"
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
										return;
									}
									if (!feedback) {
										message.error(STRINGS['P2P.INPUT_FEEDBACK']);
										return;
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
							className="proceed-btn"
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
					label="cancel-popup"
				>
					<div className="feedback-submit-popup-container">
						<div className="submit-feedback-title">
							<EditWrapper stringId="P2P.CANCEL_WARNING">
								{STRINGS['P2P.CANCEL_WARNING']}
							</EditWrapper>
						</div>
						<div className="cancel-warning-text">
							<span className="warning-title font-weight-bold">
								<EditWrapper stringId="WITHDRAW_PAGE.WARNING">
									{STRINGS['WITHDRAW_PAGE.WARNING']?.toUpperCase()}
									<ExclamationOutlined />
								</EditWrapper>
							</span>
							<EditWrapper stringId="P2P.CANCEL_WARNING_TEXT">
								{STRINGS['P2P.CANCEL_WARNING_TEXT']}
							</EditWrapper>
						</div>
					</div>

					<div className="submit-transaction-button-container">
						<Button
							onClick={() => {
								setDisplayCancelWarning(false);
							}}
							className="cancel-btn"
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
							className="proceed-btn"
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
						setIsDecalred(false);
					}}
					label="confirm-popup"
				>
					<div className="feedback-submit-popup-container">
						<div className="d-flex justify-content-center">
							<span className="warning-icon">
								<ExclamationCircleFilled />
							</span>
						</div>
						<div className="confirm-title submit-feedback-title font-weight-bold">
							<EditWrapper stringId="P2P.CHECK_CONFIRM_TITLE">
								{STRINGS['P2P.CHECK_CONFIRM_TITLE']}
							</EditWrapper>
						</div>
						<div className="confirm-payment-description">
							<span className="payment-description secondary-text">
								<EditWrapper stringId="P2P.CHECK_CONFIRM_PAYMENT_DESC_1">
									{STRINGS.formatString(
										STRINGS['P2P.CHECK_CONFIRM_PAYMENT_DESC_1'],
										<span className="important-text font-weight-bold">
											{selectedOrder?.amount_fiat}
										</span>,
										<span className="important-text font-weight-bold">
											{selectedOrder?.deal?.spending_asset?.toUpperCase()}
										</span>
									)}
								</EditWrapper>
							</span>
							<span className="payment-description secondary-text">
								<EditWrapper stringId="P2P.CHECK_CONFIRM_PAYMENT_DESC_2">
									{STRINGS.formatString(
										STRINGS['P2P.CHECK_CONFIRM_PAYMENT_DESC_2'],
										<span className="important-text font-weight-bold">
											{userReceiveAmount()}
										</span>,
										<span className="important-text font-weight-bold">
											{selectedOrder?.deal?.buying_asset?.toUpperCase()}
										</span>
									)}
								</EditWrapper>
							</span>
							<div className="payment-declaration-text">
								<Checkbox
									id="declaration"
									onChange={() => setIsDecalred(!isDecalred)}
								/>
								<label htmlFor="declaration" className="ml-2">
									<EditWrapper stringId="P2P.CHECK_CONFIRM_DECLARATION">
										{STRINGS['P2P.CHECK_CONFIRM_DECLARATION']}
									</EditWrapper>
								</label>
							</div>
						</div>
					</div>
					<div className="submit-transaction-button-container">
						<Button
							onClick={() => {
								setDisplayConfirmWarning(false);
							}}
							className="cancel-btn"
							type="default"
						>
							<EditWrapper stringId="BACK_TEXT">
								{STRINGS['BACK_TEXT']?.toUpperCase()}
							</EditWrapper>
						</Button>
						<Button
							onClick={async () => {
								try {
									await updateTransaction({
										id: selectedOrder?.id,
										merchant_status: 'confirmed',
									});
									updateP2PStatus();
									updateStatus('confirmed', 'crypto');
									message.success(STRINGS['P2P.CONFIRMED_TRANSACTION']);
									setDisplayConfirmWarning(false);
									setIsDecalred(false);
									setDisplayReleasedAmountPopup(true);
								} catch (error) {
									message.error(error.data.message);
								}
							}}
							className={
								!isDecalred ? 'proceed-btn inactive-btn' : 'proceed-btn'
							}
							type="default"
							disabled={!isDecalred}
						>
							<EditWrapper stringId="CONFIRM_TEXT">
								{STRINGS['CONFIRM_TEXT']?.toUpperCase()}
							</EditWrapper>
						</Button>
					</div>
				</Dialog>
			)}

			<Dialog
				isOpen={displayReleasedAmountPopup}
				onCloseDialog={() => setDisplayReleasedAmountPopup(false)}
				className="release-amount-popup-wrapper feedback-submit-popup-wrapper"
				label="release-amount-popup"
			>
				<div className="release-amount-details-container">
					<div className="order-complete-title important-text">
						<EditWrapper stringId="P2P.P2P_ORDER_COMPLETE">
							{STRINGS['P2P.P2P_ORDER_COMPLETE']}
						</EditWrapper>
					</div>
					<div className="user-receive-amount-detail mt-3">
						<CheckSquareTwoTone className="check-icon" />
						<span className="ml-2">
							<EditWrapper stringId="P2P.AMOUNT_RECEIVE">
								{STRINGS.formatString(
									STRINGS['P2P.AMOUNT_RECEIVE'],
									<span className="font-weight-bold">
										{userReceiveAmount()}
									</span>,
									<span className="font-weight-bold">
										{selectedOrder?.deal?.buying_asset?.toUpperCase()}
									</span>
								)}
							</EditWrapper>
						</span>
					</div>
					<div className="submit-transaction-button-container">
						<Button
							onClick={() => {
								setDisplayReleasedAmountPopup(false);
							}}
							className="cancel-btn"
							type="default"
						>
							<EditWrapper stringId="P2P.OKAY">
								{STRINGS['P2P.OKAY']}
							</EditWrapper>
						</Button>
					</div>
				</div>
			</Dialog>

			{((isMobile && !isChat) || !isMobile) && (
				<div className="back-to-orders-link">
					<span
						onClick={() => {
							setDisplayOrder(false);
							router.push('/p2p');
						}}
						className="back-text"
					>
						<EditWrapper stringId="BACK_TEXT">
							<span>
								{'<'}
								{STRINGS['BACK_TEXT']}
							</span>
						</EditWrapper>
					</span>
				</div>
			)}
			{(isOrderCreated || isOrderVerified || isOrderConfirmed) &&
				((isMobile && !isChat) || !isMobile) && (
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
								<div className={isOrderCreated ? 'important-text' : ''}>
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
								{(isOrderVerified || isOrderConfirmed) && (
									<CheckCircleTwoTone />
								)}
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
								<div className={isOrderConfirmed ? 'important-text' : ''}>
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
			<div
				className={classnames(
					...[
						'P2pOrder p2p-order-wrapper',
						isMobile ? 'mobile-view-p2p' : '',
						isChat ? 'p2p-order-chat-wrapper' : '',
					]
				)}
			>
				{!isMobile && (
					<div className="wallet-assets_block p2p-order-container">
						<div className="p2p-order-details-container w-50">
							<div className="trade-assets-container">
								<Coin
									iconId={coin?.icon_id}
									type={isMobile ? 'CS12' : 'CS10'}
								/>
								<div className="d-flex flex-direction-column">
									<div className="d-flex">
										<div className="order-title">
											<EditWrapper stringId="P2P.ORDER">
												{STRINGS['P2P.ORDER']}:
											</EditWrapper>
										</div>
										<span className="ml-1 secondary-text">
											{selectedOrder.transaction_id}
										</span>
									</div>
									<span
										className={
											user?.id === selectedOrder?.merchant_id
												? 'asset-name asset-sell'
												: 'asset-name asset-buy'
										}
									>
										{user.id === selectedOrder.merchant_id ? (
											<EditWrapper stringId="P2P.SELL_COIN">
												{STRINGS['P2P.SELL_COIN']}
											</EditWrapper>
										) : (
											<EditWrapper stringId="P2P.BUY_COIN">
												{STRINGS['P2P.BUY_COIN']}
											</EditWrapper>
										)}{' '}
										{coin?.fullname} ({coin?.symbol?.toUpperCase()})
									</span>
								</div>
							</div>
							{/* <div
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
						></div> */}
							<div className="release-amount-container">
								<div
									className={
										user?.id === selectedOrder?.user_id
											? 'release-amount-title'
											: 'spend-amount-title'
									}
								>
									<EditWrapper stringId="P2P.AMOUNT_TO">
										{STRINGS['P2P.AMOUNT_TO']}
									</EditWrapper>{' '}
									<span>
										{user?.id === selectedOrder?.merchant_id
											? STRINGS['P2P.RELEASE']
											: STRINGS['P2P.SEND_UPPER']}
									</span>
									:
								</div>
								<div className="trading-amount-container">
									{user.id === selectedOrder?.merchant_id && (
										<div className="amount-field">
											<span className="important-text">
												{userReceiveAmount()}
											</span>
											<span className="important-text">
												{selectedOrder?.deal?.buying_asset?.toUpperCase()}
											</span>
											<Coin
												iconId={
													coins[selectedOrder?.deal?.buying_asset]?.icon_id
												}
												type={isMobile ? 'CS10' : 'CS4'}
											/>
										</div>
									)}
									{user.id === selectedOrder?.user_id && (
										<div className="amount-field">
											<span className="receive-amount important-text">
												{selectedOrder?.amount_fiat}
											</span>
											<span className="trading-asset important-text">
												{selectedOrder?.deal?.spending_asset?.toUpperCase()}
											</span>
											<Coin
												iconId={
													coins[selectedOrder?.deal?.spending_asset]?.icon_id
												}
												type={isMobile ? 'CS10' : 'CS4'}
											/>
										</div>
									)}
									<div>
										{user.id === selectedOrder?.merchant_id ? (
											<EditWrapper stringId="P2P.AMOUNT_SEND_RELEASE">
												{STRINGS['P2P.AMOUNT_SEND_RELEASE']}
											</EditWrapper>
										) : (
											<EditWrapper stringId="P2P.REQUIRED_FLAT_TRANSFER_AMOUNT">
												{STRINGS['P2P.REQUIRED_FLAT_TRANSFER_AMOUNT']}
											</EditWrapper>
										)}
									</div>
								</div>
							</div>
							<div className="asset-price-container">
								<div className="price-title">
									<EditWrapper stringId="P2P.PRICE">
										{STRINGS['P2P.PRICE']}
									</EditWrapper>
									:
								</div>
								<div className="trading-amount-container">
									<div className="amount-field">
										<span className="important-text">
											{formatAmount(
												selectedOrder?.deal?.spending_asset,
												selectedOrder?.price
											)}
										</span>
										<span className="important-text">
											{selectedOrder?.deal?.spending_asset?.toUpperCase()}
										</span>
										<Coin
											iconId={
												coins[selectedOrder?.deal?.spending_asset]?.icon_id
											}
											type={isMobile ? 'CS10' : 'CS4'}
										/>
									</div>
									<div className="amount-field">
										<span>
											<EditWrapper stringId="P2P.PER_COIN">
												{STRINGS['P2P.PER_COIN']}
											</EditWrapper>{' '}
										</span>
										<span>
											{selectedOrder?.deal?.buying_asset?.toUpperCase()}
										</span>
										<Coin
											iconId={coins[selectedOrder?.deal?.buying_asset]?.icon_id}
											type={isMobile ? 'CS10' : 'CS4'}
										/>
									</div>
								</div>
							</div>
							<div className="receive-amount-container">
								<div
									className={
										user?.id === selectedOrder?.merchant_id
											? 'receive-amount-title important-text font-weight-bold'
											: 'receive-amount-title'
									}
								>
									<EditWrapper stringId="P2P.RECEIVING_AMOUNT">
										{STRINGS['P2P.RECEIVING_AMOUNT']}
									</EditWrapper>
									:
								</div>
								{user.id === selectedOrder?.merchant_id && (
									<div className="trading-amount-container">
										<div className="amount-field">
											<span className="receive-amount important-text font-weight-bold">
												{selectedOrder?.amount_fiat}
											</span>
											<span className="important-text">
												{selectedOrder?.deal?.spending_asset?.toUpperCase()}
											</span>
											<Coin
												iconId={
													coins[selectedOrder?.deal?.spending_asset]?.icon_id
												}
												type={isMobile ? 'CS10' : 'CS4'}
											/>
										</div>
										<div className="amount-field">
											<span>
												{selectedOrder?.deal?.spending_asset?.toUpperCase()}
											</span>
											<span>
												<EditWrapper stringId="P2P.SPENDING_AMOUNT">
													{STRINGS['P2P.SPENDING_AMOUNT']}
												</EditWrapper>
											</span>
										</div>
									</div>
								)}

								{user.id === selectedOrder?.user_id && (
									<div className="trading-amount-container">
										<div className="amount-field">
											<span className="important-text">
												{userReceiveAmount()}
											</span>
											<span className="important-text">
												{selectedOrder?.deal?.buying_asset?.toUpperCase()}
											</span>
											<Coin
												iconId={
													coins[selectedOrder?.deal?.buying_asset]?.icon_id
												}
												type={isMobile ? 'CS10' : 'CS4'}
											/>
										</div>
										<div className="amount-field">
											<span>
												{selectedOrder?.deal?.buying_asset?.toUpperCase()}
											</span>
											<span>
												<EditWrapper stringId="P2P.BUYING_AMOUNT">
													{STRINGS['P2P.BUYING_AMOUNT']}
												</EditWrapper>
											</span>
										</div>
									</div>
								)}
							</div>
							<div className="trading-fee-container">
								<div>
									<EditWrapper stringId="P2P.FEE">
										{STRINGS['P2P.FEE']}
									</EditWrapper>
									:
								</div>
								{user.id === selectedOrder?.merchant_id && (
									<div className="important-text">
										<div>{p2p_config?.merchant_fee}%</div>
									</div>
								)}

								{user.id === selectedOrder?.user_id && (
									<div className="important-text">
										<div>{p2p_config?.user_fee}%</div>
									</div>
								)}
							</div>
							<div className="amount-transfer-container">
								<div className="transfer-title">
									<EditWrapper stringId="P2P.TRANSFER_DETAILS">
										{STRINGS['P2P.TRANSFER_DETAILS']}
									</EditWrapper>
								</div>
								{user.id === selectedOrder?.user_id && (
									<div className="my-2 secondary-text">
										<EditWrapper stringId="P2P.PAYMENT_INSTRUCTIONS">
											{STRINGS['P2P.PAYMENT_INSTRUCTIONS']}
										</EditWrapper>
									</div>
								)}

								{user.id === selectedOrder?.merchant_id && (
									<div className="my-2 secondary-text">
										<EditWrapper stringId="P2P.PAYMENT_ACCOUNT">
											{STRINGS['P2P.PAYMENT_ACCOUNT']}
										</EditWrapper>
									</div>
								)}

								<div
									className={
										user?.id === selectedOrder.merchant_id
											? 'payment-details active-sell'
											: 'payment-details active-buy'
									}
								>
									<div className="payment-methods-list">
										<div className="font-weight-bold">
											<EditWrapper stringId="P2P.PAYMENT_METHOD">
												{STRINGS['P2P.PAYMENT_METHOD']}
											</EditWrapper>
											:
										</div>
										<div>{selectedOrder?.payment_method_used?.system_name}</div>
									</div>

									{selectedOrder?.payment_method_used?.fields?.map(
										(x, index) => {
											return (
												<div className="payment-methods-list" key={index}>
													<div className="font-weight-bold">{x?.name}:</div>
													<div>{x?.value}</div>
												</div>
											);
										}
									)}
								</div>
							</div>
							<div className="order-verification-container secondary-text">
								{selectedOrder?.user_status === 'pending' && (
									<div className="mb-3 important-text order-timer-wrapper">
										<EditWrapper stringId="P2P.EXPECTED_TIME">
											{STRINGS.formatString(
												STRINGS['P2P.EXPECTED_TIME'],
												selectedOrder?.transaction_duration
											)}
										</EditWrapper>
										<Timer order={selectedOrder} />
									</div>
								)}
								{user.id === selectedOrder?.user_id && (
									<>
										{selectedOrder.user_status === 'pending' && (
											<>
												<div className="mb-3">
													<EditWrapper stringId="P2P.PAYMENT_TIME">
														{STRINGS['P2P.PAYMENT_TIME']}
													</EditWrapper>
												</div>
												<div className="mb-3">
													<EditWrapper stringId="P2P.ORDER_CANCELLED">
														{STRINGS['P2P.ORDER_CANCELLED']}
													</EditWrapper>
												</div>
											</>
										)}

										{selectedOrder.user_status === 'confirmed' && (
											<div className="mb-3">
												<EditWrapper stringId="P2P.FUNDS_CREDITED">
													{STRINGS['P2P.FUNDS_CREDITED']}
												</EditWrapper>
											</div>
										)}

										{selectedOrder.merchant_status === 'cancelled' && (
											<div className="mb-3">
												<EditWrapper stringId="P2P.VENDOR_CANCELLED">
													{STRINGS['P2P.VENDOR_CANCELLED']}
												</EditWrapper>
											</div>
										)}

										{selectedOrder.merchant_status === 'confirmed' && (
											<div className="mb-3 order-confirmed-container">
												<div className="d-flex">
													<span className="check-icon">
														<CheckCircleTwoTone />
													</span>
													<div
														className={
															isMobile
																? 'order-complete-title ml-3'
																: 'order-complete-title ml-1'
														}
													>
														<EditWrapper stringId="P2P.ORDER_COMPLETE">
															{STRINGS['P2P.ORDER_COMPLETE']}
														</EditWrapper>
													</div>
												</div>
												<div className="mt-2">
													{selectedOrder?.deal?.side === 'sell' ? (
														<EditWrapper stringId="P2P.FUNDS_TRANSFERRED">
															{STRINGS['P2P.FUNDS_TRANSFERRED']}
														</EditWrapper>
													) : (
														<EditWrapper stringId="P2P.FUNDS_TRANSFERRED_USER">
															{STRINGS['P2P.FUNDS_TRANSFERRED_USER']}
														</EditWrapper>
													)}
												</div>
												<div
													className="go-to-deposit-link blue-link"
													onClick={() => {
														router.replace('/transactions?tab=deposits');
													}}
												>
													<EditWrapper stringId="P2P.GO_DEPOSIT">
														<span className={!isMobile && 'fs-12'}>
															{STRINGS['P2P.GO_DEPOSIT']}
														</span>
													</EditWrapper>
												</div>
												{!hasFeedback && (
													<Button
														className="feedback-submit-btn mt-3"
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
												<div className="vendor-appealed-text">
													<EditWrapper stringId="P2P.VENDOR_APPEALED">
														{STRINGS['P2P.VENDOR_APPEALED']}
													</EditWrapper>
												</div>
											</>
										)}
										{selectedOrder.user_status === 'appeal' && (
											<>
												<div className="user-appealed-text">
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
											<div className="mb-3 order-confirmed-container">
												<div className="d-flex">
													<span className="check-icon">
														<CheckCircleTwoTone />
													</span>
													<div
														className={
															isMobile
																? 'order-complete-title ml-3'
																: 'order-complete-title ml-1'
														}
													>
														<EditWrapper stringId="P2P.ORDER_COMPLETE">
															{STRINGS['P2P.ORDER_COMPLETE']}
														</EditWrapper>
													</div>
												</div>
												<div className="mt-2">
													<EditWrapper stringId="P2P.ORDER_COMPLETE_VENDOR">
														{STRINGS['P2P.ORDER_COMPLETE_VENDOR']}
													</EditWrapper>
												</div>
												<div
													className="go-to-withdraw-link blue-link"
													onClick={() => {
														router.replace('/transactions?tab=withdrawals');
													}}
												>
													<EditWrapper stringId="P2P.GO_WITHDRAWALS">
														<span className={!isMobile && 'fs-12'}>
															{STRINGS['P2P.GO_WITHDRAWALS']}
														</span>
													</EditWrapper>
												</div>
												{!hasFeedback && (
													<Button
														className="feedback-submit-btn mt-3"
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

										{selectedOrder.user_status === 'pending' && (
											<>
												<div className="my-2">
													<EditWrapper stringId="P2P.PAYMENT_NOT_SENT">
														{STRINGS['P2P.PAYMENT_NOT_SENT']}
													</EditWrapper>
												</div>
												<div className="mb-2">
													<EditWrapper stringId="P2P.CONFIRM_AND_RELEASE">
														{STRINGS['P2P.CONFIRM_AND_RELEASE']}
													</EditWrapper>
												</div>
											</>
										)}
										{selectedOrder.user_status === 'cancelled' && (
											<>
												<div className="my-2">
													<EditWrapper stringId="P2P.TRANSACTION_CANCELLED">
														{STRINGS['P2P.TRANSACTION_CANCELLED']}
													</EditWrapper>
												</div>
											</>
										)}
										{selectedOrder.user_status === 'confirmed' &&
											selectedOrder?.merchant_status !== 'confirmed' && (
												<>
													<div className="mt-2">
														<EditWrapper stringId="P2P.BUYER_CONFIRMED">
															{STRINGS['P2P.BUYER_CONFIRMED']}
														</EditWrapper>
													</div>
													<div className="mt-1 mb-3">
														<EditWrapper stringId="P2P.CHECK_AND_RELEASE">
															{STRINGS['P2P.CHECK_AND_RELEASE']}
														</EditWrapper>
													</div>
												</>
											)}
										{user.id === selectedOrder.user_id &&
											selectedOrder.user_status === 'appeal' && (
												<>
													<div className="my-2">
														<EditWrapper stringId="P2P.USER_APPEALED">
															{STRINGS['P2P.USER_APPEALED']}
														</EditWrapper>
													</div>
												</>
											)}

										{user.id === selectedOrder.merchant_id &&
											selectedOrder.user_status === 'appeal' && (
												<>
													<div className="my-2">
														<EditWrapper stringId="P2P.BUYER_APPEALED_ORDER">
															{STRINGS['P2P.BUYER_APPEALED_ORDER']}
														</EditWrapper>
													</div>
												</>
											)}
									</>
								)}

								<div className="order-cancel-container">
									{user.id === selectedOrder?.user_id && (
										<>
											{selectedOrder.user_status === 'confirmed' &&
												selectedOrder.merchant_status === 'pending' && (
													<>
														<div
															className="blue-link mt-1"
															onClick={async () => {
																try {
																	setDisplayAppealModel(true);
																	setAppealSide('user');
																} catch (error) {
																	message.error(error.data.message);
																}
															}}
														>
															<EditWrapper stringId="P2P.APPEAL">
																<span className="text-decoration-underline appeal-link">
																	{STRINGS['P2P.APPEAL']}
																</span>
															</EditWrapper>
														</div>
														<div
															className="important-text mt-1"
															onClick={async () => {
																setDisplayCancelWarning(true);
															}}
														>
															<span className="cancel-link">
																<EditWrapper stringId="P2P.CANCEL_ORDER">
																	<span className="text-decoration-underline">
																		{STRINGS['P2P.CANCEL_ORDER']}
																	</span>
																</EditWrapper>
															</span>
														</div>
													</>
												)}
										</>
									)}

									{user.id === selectedOrder?.merchant_id &&
										selectedOrder?.merchant_status === 'pending' && (
											<span
												className={
													selectedOrder?.user_status !== 'confirmed'
														? 'appeal-confirm-button-container appeal-confirm-button-container-active'
														: 'appeal-confirm-button-container-active'
												}
											>
												<div
													className={
														selectedOrder?.user_status !== 'confirmed'
															? 'appeal-link blue-link disable-link'
															: 'appeal-link blue-link'
													}
													onClick={async () => {
														if (selectedOrder?.user_status === 'confirmed') {
															try {
																setDisplayAppealModel(true);
																setAppealSide('merchant');
															} catch (error) {
																message.error(error.data.message);
															}
														}
													}}
												>
													<EditWrapper stringId="P2P.APPEAL">
														{STRINGS['P2P.APPEAL']}
													</EditWrapper>
												</div>

												<Tooltip
													placement="rightBottom"
													title={
														selectedOrder.user_status !== 'confirmed'
															? STRINGS['P2P.BUYER_NOT_MADE_THE_PAYMENT']
															: ''
													}
												>
													<Button
														disabled={selectedOrder.user_status !== 'confirmed'}
														className="purpleButtonP2P"
														onClick={async () => {
															try {
																setDisplayConfirmWarning(true);
															} catch (error) {
																message.error(error.data.message);
															}
														}}
													>
														<EditWrapper stringId="P2P.CONFIRM_AND_RELEASE_CRYPTO">
															{STRINGS['P2P.CONFIRM_AND_RELEASE_CRYPTO']}
														</EditWrapper>
													</Button>
												</Tooltip>
											</span>
										)}
									{user.id === selectedOrder?.merchant_id &&
										selectedOrder?.merchant_status === 'appeal' && (
											<div className="user-appeal-description font-weight-bold">
												<EditWrapper stringId="P2P.USER_APPEALED">
													{STRINGS['P2P.USER_APPEALED']}
												</EditWrapper>
											</div>
										)}
								</div>
							</div>
						</div>
						<div className="user-chat-container w-50">
							<div className="chat-title">
								<Image
									iconId={'CHAT_P2P_ICON'}
									icon={ICONS['CHAT_P2P_ICON']}
									alt={'text'}
									wrapperClassName="margin-aligner"
								/>
								{user.id === selectedOrder?.merchant_id ? (
									<EditWrapper stringId="P2P.CHAT_WITH_USER">
										{STRINGS['P2P.CHAT_WITH_USER']}
									</EditWrapper>
								) : (
									<EditWrapper stringId="P2P.CHAT_WITH_VENDOR">
										{STRINGS['P2P.CHAT_WITH_VENDOR']}
									</EditWrapper>
								)}
							</div>
							<div className="chat-field">
								<div
									className="vendor-name-field"
									onClick={async () => {
										try {
											if (user.id === selectedOrder?.merchant_id) return;
											setSelectedProfile(selectedOrder?.merchant);
											const feedbacks = await fetchFeedback({
												merchant_id: selectedOrder?.merchant_id,
											});
											const profile = await fetchP2PProfile({
												user_id: selectedOrder?.merchant_id,
											});
											setUserFeedback(feedbacks.data);
											setUserProfile(profile);
											setDisplayUserFeedback(true);
										} catch (error) {
											return error;
										}
									}}
								>
									{user.id === selectedOrder?.merchant_id ? (
										<div className="font-weight-bold">
											<EditWrapper stringId="P2P.USER_NAME">
												{STRINGS['P2P.USER_NAME']}
											</EditWrapper>
										</div>
									) : (
										<div className="font-weight-bold">
											<EditWrapper stringId="P2P.VENDOR_NAME">
												{STRINGS['P2P.VENDOR_NAME']}
											</EditWrapper>
										</div>
									)}
									{user.id === selectedOrder?.merchant_id
										? selectedOrder?.buyer?.full_name || (
												<EditWrapper stringId="P2P.ANONYMOUS">
													{STRINGS['P2P.ANONYMOUS']}
												</EditWrapper>
										  )
										: selectedOrder?.merchant?.full_name || (
												<EditWrapper stringId="P2P.ANONYMOUS">
													{STRINGS['P2P.ANONYMOUS']}
												</EditWrapper>
										  )}
								</div>
								<div className="chat-details-container">
									{user.id === selectedOrder?.user_id && (
										<div className="d-flex flex-column">
											<div>
												{selectedOrder?.deal?.side === 'sell' ? (
													<EditWrapper stringId="P2P.ORDER_INITIATED">
														{STRINGS['P2P.ORDER_INITIATED']}
													</EditWrapper>
												) : (
													<EditWrapper stringId="P2P.ORDER_INITIATED_VENDOR">
														{STRINGS['P2P.ORDER_INITIATED_VENDOR']}
													</EditWrapper>
												)}

												<span className="ml-1">
													{selectedOrder?.merchant?.full_name || (
														<EditWrapper stringId="P2P.ANONYMOUS">
															{STRINGS['P2P.ANONYMOUS']}
														</EditWrapper>
													)}
												</span>
											</div>
											<span className="message-time">
												(
												{moment(selectedOrder?.created_at).format(
													'DD/MMM/YYYY, hh:mmA'
												)}
												)
											</span>
										</div>
									)}

									{user.id === selectedOrder?.user_id && (
										<div>
											<EditWrapper stringId="P2P.CONFIRM_PAYMENT">
												{STRINGS['P2P.CONFIRM_PAYMENT']}
											</EditWrapper>
										</div>
									)}

									{user.id === selectedOrder?.merchant_id && (
										<div className="d-flex flex-column">
											<div>
												<EditWrapper stringId="P2P.ORDER_INITIATED_VENDOR">
													{STRINGS['P2P.ORDER_INITIATED_VENDOR']}
												</EditWrapper>
												<span className="ml-1">
													{selectedOrder?.buyer?.full_name || (
														<EditWrapper stringId="P2P.ANONYMOUS">
															{STRINGS['P2P.ANONYMOUS']}
														</EditWrapper>
													)}
												</span>
											</div>
											<span className="message-time">
												(
												{moment(selectedOrder?.created_at).format(
													'DD/MMM/YYYY, hh:mmA'
												)}
												)
											</span>
										</div>
									)}
									{user.id === selectedOrder?.merchant_id && (
										<div>
											<EditWrapper stringId="P2P.CONFIRM_PAYMENT_VENDOR">
												{STRINGS['P2P.CONFIRM_PAYMENT_VENDOR']}
											</EditWrapper>
										</div>
									)}
									{user?.id === selectedOrder?.user_id &&
										selectedOrder?.transaction_status === 'active' &&
										selectedOrder?.user_status === 'pending' && (
											<div className="secondary-text">
												<EditWrapper stringId="P2P.CONFIRM_PAYMENT_TRANSFER">
													{STRINGS['P2P.CONFIRM_PAYMENT_TRANSFER']}
												</EditWrapper>
											</div>
										)}
								</div>

								<div ref={ref} className="chat-area">
									<div className="chat-message-container">
										{selectedOrder?.messages?.map((message, index) => {
											if (index === 0) {
												return (
													<div className="initial-message" key={index}>
														<div>
															{message.sender_id === selectedOrder?.merchant_id
																? selectedOrder?.merchant?.full_name
																: selectedOrder?.buyer?.full_name}
															:
														</div>
														<div>{message.message}</div>
														<div className="message-time">
															{moment(message?.created_at || new Date()).format(
																'DD/MMM/YYYY, hh:mmA '
															)}
														</div>
													</div>
												);
											} else {
												if (message.type === 'notification') {
													return (
														<div className="notification-message d-flex flex-column text-center my-3">
															{message.message === 'BUYER_PAID_ORDER' &&
															user.id === selectedOrder.user_id ? (
																selectedOrder?.deal?.side === 'sell' ? (
																	<EditWrapper
																		stringId={`P2P.BUYER_SENT_FUNDS`}
																	>
																		{STRINGS[`P2P.BUYER_SENT_FUNDS`]}
																	</EditWrapper>
																) : (
																	<EditWrapper
																		stringId={`P2P.BUYER_SENT_FUNDS_USER`}
																	>
																		{STRINGS[`P2P.BUYER_SENT_FUNDS_USER`]}
																	</EditWrapper>
																)
															) : (
																<EditWrapper
																	stringId={`P2P.${message.message}`}
																>
																	{STRINGS[`P2P.${message.message}`]}
																</EditWrapper>
															)}
															<span className="message-time">
																(
																{moment(
																	message?.created_at || new Date()
																).format('DD/MMM/YYYY, hh:mmA')}
																)
															</span>
															{user?.id === selectedOrder?.merchant_id &&
																selectedOrder?.merchant_status ===
																	'pending' && (
																	<div className="secondary-text">
																		<EditWrapper stringId="P2P.CONFIRM_PAYMENT_RELEASE">
																			{STRINGS['P2P.CONFIRM_PAYMENT_RELEASE']}
																		</EditWrapper>
																	</div>
																)}
														</div>
													);
												} else {
													if (message.sender_id === user.id) {
														return (
															<div className="user-message-wrapper">
																<div className="user-message-container">
																	<span className="user-name">
																		<EditWrapper stringId="P2P.YOU">
																			<span>{STRINGS['P2P.YOU']}:</span>
																		</EditWrapper>
																	</span>
																	<span className="user-message ml-2">
																		{message?.message}
																	</span>
																	<div className="message-time secondary-text">
																		{moment(
																			message?.created_at || new Date()
																		).format('DD/MMM/YYYY, hh:mmA ')}
																	</div>
																</div>
															</div>
														);
													} else {
														return (
															<div className="merchant-message-wrapper">
																<div className="merchant-message-container">
																	<div className="merchant-detail">
																		<div className="important-text">
																			{message?.receiver_id ===
																			selectedOrder?.merchant_id
																				? STRINGS['P2P.BUYER']
																				: selectedOrder?.merchant?.full_name ||
																				  STRINGS['P2P.ANONYMOUS']}
																			:
																		</div>
																		<div className="merchant-message">
																			{message?.message}
																		</div>
																	</div>
																	<div className="message-time secondary-text">
																		{moment(
																			message?.created_at || new Date()
																		).format('DD/MMM/YYYY, hh:mmA ')}
																	</div>
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
									className={
										selectedOrder?.transaction_status === 'complete'
											? 'disable-field active-field'
											: 'active-field'
									}
								>
									<div className="message-input-field w-100 mt-3">
										<Input
											value={chatMessage}
											disabled={selectedOrder.transaction_status !== 'active'}
											className={
												selectedOrder.transaction_status !== 'active'
													? 'greyButtonP2P'
													: ''
											}
											onChange={(e) => {
												setChatMessage(e.target.value);
											}}
											suffix={
												<div
													className={
														selectedOrder?.transaction_status !== 'active'
															? 'disabled-btn send-btn blue-link '
															: 'send-btn blue-link'
													}
													ref={buttonRef}
													onClick={() => {
														if (
															selectedOrder?.transaction_status === 'active'
														) {
															sendChatMessage();
														}
													}}
												>
													<EditWrapper stringId="P2P.SEND_UPPER">
														{STRINGS['P2P.SEND_UPPER']}
													</EditWrapper>
													<SendOutlined />
												</div>
											}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
				{isMobile && (
					<div className="p2p-order-container">
						{!isChat && (
							<P2POrderDetails
								user={user}
								coin={coin}
								coins={coins}
								router={router}
								p2p_config={p2p_config}
								hasFeedback={hasFeedback}
								formatAmount={formatAmount}
								userReceiveAmount={userReceiveAmount}
								selectedOrder={selectedOrder}
								setDisplayConfirmWarning={setDisplayConfirmWarning}
								setDisplayCancelWarning={setDisplayCancelWarning}
								setDisplayAppealModel={setDisplayAppealModel}
								setAppealSide={setAppealSide}
								setDisplayFeedbackModel={setDisplayFeedbackModel}
								ICONS={ICONS}
								updateTransaction={updateTransaction}
								updateStatus={updateStatus}
								updateP2PStatus={updateP2PStatus}
							/>
						)}
						{isChat && (
							<P2POrderChat
								user={user}
								ICONS={ICONS}
								selectedOrder={selectedOrder}
								chatMessage={chatMessage}
								setChatMessage={setChatMessage}
								sendChatMessage={sendChatMessage}
								setSelectedProfile={setSelectedProfile}
								setUserFeedback={setUserFeedback}
								setDisplayUserFeedback={setDisplayUserFeedback}
								setUserProfile={setUserProfile}
								isChat={isChat}
							/>
						)}
					</div>
				)}
			</div>

			{!isMobile &&
				user.id === selectedOrder?.user_id &&
				selectedOrder?.transaction_status === 'active' &&
				selectedOrder.user_status === 'pending' && (
					<div className="confirm-notify-button-container">
						<Button
							className="cancel-btn"
							onClick={async () => {
								try {
									setDisplayCancelWarning(true);
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
							className="confirm-btn"
							onClick={async () => {
								try {
									await updateTransaction({
										id: selectedOrder.id,
										user_status: 'confirmed',
									});
									updateP2PStatus();
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
	p2p_message: state.p2p.chat,
	p2p_status: state.p2p.status,
	p2p_transaction_id: state.p2p.transaction_id,
	user: state.user,
	p2p_config: state.app.constants.p2p_config,
	isChat: state.app.isChat,
});

export default connect(mapStateToProps)(withRouter(withConfig(P2POrder)));
