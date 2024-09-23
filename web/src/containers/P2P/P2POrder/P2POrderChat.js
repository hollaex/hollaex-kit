import React, { useEffect, useRef } from 'react';
import { isMobile } from 'react-device-detect';
import { Input } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import moment from 'moment';

import '../_P2P.scss';
import STRINGS from 'config/localizedStrings';
import { EditWrapper, Image } from 'components';
import { fetchFeedback, fetchP2PProfile } from '../actions/p2pActions';

const P2POrderChat = ({
	user,
	ICONS,
	selectedOrder,
	chatMessage,
	setChatMessage,
	sendChatMessage,
	setSelectedProfile,
	setUserFeedback,
	setDisplayUserFeedback,
	setUserProfile,
	isChat,
	setIsChat,
}) => {
	const ref = useRef(null);
	const buttonRef = useRef(null);

	const handleKeyDown = (event) => {
		if (event.key === 'Enter') {
			buttonRef.current.click();
		}
	};

	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		ref.current.scroll({
			top: 9999,
			behavior: 'smooth',
		});
	}, [selectedOrder.messages]);

	return (
		<div
			className={
				isMobile ? 'user-chat-container w-100' : 'user-chat-container w-50'
			}
		>
			<div className="p2p-chat-container">
				{isChat && (
					<div
						className="back-to-orders-link"
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
				<div className="chat-title">
					<Image
						iconId={'CHAT_P2P_ICON'}
						icon={ICONS['CHAT_P2P_ICON']}
						alt={'text'}
						wrapperClassName="margin-aligner"
					/>
					{user?.id === selectedOrder?.merchant_id ? (
						<EditWrapper stringId="P2P.CHAT_WITH_USER">
							{STRINGS['P2P.CHAT_WITH_USER']}
						</EditWrapper>
					) : (
						<EditWrapper stringId="P2P.CHAT_WITH_VENDOR">
							{STRINGS['P2P.CHAT_WITH_VENDOR']}
						</EditWrapper>
					)}
				</div>
			</div>
			<div className="chat-field">
				<div
					className="vendor-name-field"
					onClick={async () => {
						try {
							if (user?.id === selectedOrder?.merchant_id) return;
							setSelectedProfile(selectedOrder?.merchant);
							const feedbacks = await fetchFeedback({
								merchant_id: selectedOrder?.merchant_id,
							});
							const profile = await fetchP2PProfile({
								user_id: selectedOrder?.merchant_id,
							});
							setUserFeedback(feedbacks?.data);
							setUserProfile(profile);
							setDisplayUserFeedback(true);
						} catch (error) {
							return error;
						}
					}}
				>
					{user?.id === selectedOrder?.merchant_id ? (
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
					{user?.id === selectedOrder?.merchant_id
						? (
								<span className="secondary-text ml-2">
									{selectedOrder?.buyer?.full_name}
								</span>
						  ) || (
								<div className="secondary-text ml-2">
									<EditWrapper stringId="P2P.ANONYMOUS">
										{STRINGS['P2P.ANONYMOUS']}
									</EditWrapper>
								</div>
						  )
						: (
								<span className="secondary-text ml-2">
									{selectedOrder?.merchant?.full_name}{' '}
								</span>
						  ) || (
								<div className="secondary-text ml-2">
									<EditWrapper stringId="P2P.ANONYMOUS">
										{STRINGS['P2P.ANONYMOUS']}
									</EditWrapper>
								</div>
						  )}
				</div>
				<div className="chat-details-container secondary-text">
					{user?.id === selectedOrder?.user_id && (
						<div className="d-flex flex-column">
							<div>
								<EditWrapper stringId="P2P.ORDER_INITIATED">
									{STRINGS['P2P.ORDER_INITIATED']}
								</EditWrapper>
								<span className="ml-2">
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

					{user?.id === selectedOrder?.user_id && (
						<div>
							<EditWrapper stringId="P2P.CONFIRM_PAYMENT">
								{STRINGS['P2P.CONFIRM_PAYMENT']}
							</EditWrapper>
						</div>
					)}

					{user?.id === selectedOrder?.merchant_id && (
						<div className="d-flex flex-column">
							<div>
								<EditWrapper stringId="P2P.ORDER_INITIATED_VENDOR">
									{STRINGS['P2P.ORDER_INITIATED_VENDOR']}
								</EditWrapper>
								<span className="ml-2">
									{selectedOrder?.buyer?.full_name || (
										<EditWrapper stringId="P2P.ANONYMOUS">
											{STRINGS['P2P.ANONYMOUS']}
										</EditWrapper>
									)}
								</span>
							</div>
							<span className="message-time">
								(
								{moment(selectedOrder?.created_at)?.format(
									'DD/MMM/YYYY, hh:mmA'
								)}
								)
							</span>
						</div>
					)}
					{user?.id === selectedOrder?.merchant_id && (
						<div>
							<EditWrapper stringId="P2P.CONFIRM_PAYMENT_VENDOR">
								{STRINGS['P2P.CONFIRM_PAYMENT_VENDOR']}
							</EditWrapper>
						</div>
					)}
				</div>

				<div ref={ref} className="chat-area">
					<div className="chat-message-container">
						{selectedOrder?.messages?.map((message, index) => {
							if (index === 0) {
								return (
									<div className="initial-message">
										<div>
											{message.sender_id === selectedOrder?.merchant_id
												? selectedOrder?.merchant?.full_name
												: selectedOrder?.buyer?.full_name}
											:
										</div>
										<div>{message.message}</div>
										<div className="message-time">
											(
											{moment(message?.created_at || new Date()).format(
												'DD/MMM/YYYY, hh:mmA'
											)}
											)
										</div>
									</div>
								);
							} else {
								if (message.type === 'notification') {
									return (
										<div className="notification-message d-flex flex-column text-center secondary-text my-3">
											{message.message === 'BUYER_PAID_ORDER' &&
											user?.id === selectedOrder?.user_id ? (
												<EditWrapper stringId={`P2P.BUYER_SENT_FUNDS`}>
													{STRINGS[`P2P.BUYER_SENT_FUNDS`]}
												</EditWrapper>
											) : (
												<EditWrapper stringId={`P2P.${message?.message}`}>
													{STRINGS[`P2P.${message?.message}`]}
												</EditWrapper>
											)}
											<span className="message-time">
												(
												{moment(message?.created_at || new Date())?.format(
													'DD/MMM/YYYY, hh:mmA'
												)}
												)
											</span>
										</div>
									);
								} else {
									if (message?.sender_id === user?.id) {
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
														(
														{moment(message?.created_at || new Date()).format(
															'DD/MMM/YYYY, hh:mmA'
														)}
														)
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
																: selectedOrder?.merchant?.full_name}
															:
														</div>
														<div className="merchant-message">
															{message?.message}
														</div>
													</div>
													<div className="message-time secondary-text">
														(
														{moment(message?.created_at || new Date())?.format(
															'DD/MMM/YYYY, hh:mmA'
														)}
														)
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
									onClick={
										selectedOrder?.transaction_status === 'active' &&
										sendChatMessage
									}
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
	);
};

export default P2POrderChat;
