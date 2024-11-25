import React from 'react';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { Button, message, Tooltip } from 'antd';
import { CheckCircleTwoTone } from '@ant-design/icons';

import STRINGS from 'config/localizedStrings';
import { Coin, EditWrapper, Image } from 'components';
import { setIsChat } from 'actions/appActions';
import { Timer } from '../Utilis';

const P2POrderDetails = ({
	user,
	coin,
	coins,
	router,
	p2p_config,
	hasFeedback,
	formatAmount,
	userReceiveAmount,
	selectedOrder,
	setDisplayConfirmWarning,
	setDisplayCancelWarning,
	setDisplayAppealModel,
	setAppealSide,
	setDisplayFeedbackModel,
	setIsChat,
	ICONS,
	updateP2PStatus,
	updateStatus,
	updateTransaction,
}) => {
	const onHandleChat = () => {
		setIsChat(true);
		localStorage.setItem('isChat', true);
	};

	return (
		<div
			className={
				isMobile
					? 'p2p-order-details-container w-100'
					: 'p2p-order-details-container w-50'
			}
		>
			<div className="trade-assets-container">
				<Coin iconId={coin?.icon_id} type={isMobile ? 'CS12' : 'CS10'} />
				<div className="d-flex flex-direction-column">
					<div className="order-title">
						<EditWrapper stringId="P2P.ORDER">
							{STRINGS['P2P.ORDER']}:
						</EditWrapper>
					</div>
					<span className="secondary-text">
						{selectedOrder?.transaction_id}
					</span>
					<span
						className={
							user?.id === selectedOrder?.merchant_id
								? 'asset-name asset-sell'
								: 'asset-name asset-buy'
						}
					>
						{user?.id === selectedOrder?.merchant_id ? (
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
				{isMobile && (
					<div className="chat-link-container">
						<span onClick={() => onHandleChat()}>
							<EditWrapper stringId="USER_SETTINGS.TITLE_CHAT">
								<span className="chat-link text-decoration-underline">
									{STRINGS['USER_SETTINGS.TITLE_CHAT']?.toUpperCase()}
								</span>
							</EditWrapper>
						</span>
						<Image
							iconId={'CHAT_P2P_ICON'}
							icon={ICONS['CHAT_P2P_ICON']}
							alt={'text'}
							wrapperClassName="margin-aligner"
						/>
					</div>
				)}
			</div>
			{/* <div className='transaction-container'>
            <div>
            <EditWrapper stringId="P2P.TRANSACTION_ID">
            {STRINGS['P2P.TRANSACTION_ID']}
            </EditWrapper>
            </div>
            <span className='important-text'>{selectedOrder.transaction_id}</span>
            </div> */}
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
					{user?.id === selectedOrder?.merchant_id && (
						<div className="amount-field">
							<span className="important-text">{userReceiveAmount()}</span>
							<span className="important-text">
								{selectedOrder?.deal?.buying_asset?.toUpperCase()}
							</span>
							<Coin
								iconId={coins[selectedOrder?.deal?.buying_asset].icon_id}
								type={isMobile ? 'CS10' : 'CS4'}
							/>
						</div>
					)}
					{user?.id === selectedOrder?.user_id && (
						<div className="amount-field">
							<span className="receive-amount important-text">
								{selectedOrder?.amount_fiat}
							</span>
							<span className="trading-asset important-text">
								{selectedOrder?.deal?.spending_asset?.toUpperCase()}
							</span>
							<Coin
								iconId={coins[selectedOrder?.deal?.spending_asset].icon_id}
								type={isMobile ? 'CS10' : 'CS4'}
							/>
						</div>
					)}
					<div>
						{user?.id === selectedOrder?.merchant_id ? (
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
					<EditWrapper stringId="P2P.PRICE">{STRINGS['P2P.PRICE']}</EditWrapper>
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
							iconId={coins[selectedOrder?.deal?.spending_asset]?.icon_id}
							type={isMobile ? 'CS10' : 'CS4'}
						/>
					</div>
					<div className="amount-field">
						<span>
							<EditWrapper stringId="P2P.PER_COIN">
								{STRINGS['P2P.PER_COIN']}
							</EditWrapper>{' '}
						</span>
						<span>{selectedOrder?.deal?.buying_asset?.toUpperCase()}</span>
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
				{user?.id === selectedOrder?.merchant_id && (
					<div className="trading-amount-container">
						<div className="amount-field">
							<span className="receive-amount important-text font-weight-bold">
								{selectedOrder?.amount_fiat}
							</span>
							<span className="important-text">
								{selectedOrder?.deal?.spending_asset?.toUpperCase()}
							</span>
							<Coin
								iconId={coins[selectedOrder?.deal?.spending_asset]?.icon_id}
								type={isMobile ? 'CS10' : 'CS4'}
							/>
						</div>
						<div className="amount-field">
							<span>{selectedOrder?.deal?.spending_asset?.toUpperCase()}</span>
							<span>
								<EditWrapper stringId="P2P.SPENDING_AMOUNT">
									{STRINGS['P2P.SPENDING_AMOUNT']}
								</EditWrapper>
							</span>
						</div>
					</div>
				)}

				{user?.id === selectedOrder?.user_id && (
					<div className="trading-amount-container">
						<div className="amount-field">
							<span className="important-text">{userReceiveAmount()}</span>
							<span className="important-text">
								{selectedOrder?.deal?.buying_asset?.toUpperCase()}
							</span>
							<Coin
								iconId={coins[selectedOrder?.deal?.buying_asset]?.icon_id}
								type={isMobile ? 'CS10' : 'CS4'}
							/>
						</div>
						<div className="amount-field">
							<span>{selectedOrder?.deal?.buying_asset?.toUpperCase()}</span>
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
					<EditWrapper stringId="P2P.FEE">{STRINGS['P2P.FEE']}</EditWrapper>:
				</div>
				{user?.id === selectedOrder?.merchant_id && (
					<div className="important-text">
						<div>{p2p_config?.merchant_fee}%</div>
					</div>
				)}

				{user?.id === selectedOrder?.user_id && (
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
				{user?.id === selectedOrder?.user_id && (
					<div className="my-2 secondary-text">
						<EditWrapper stringId="P2P.PAYMENT_INSTRUCTIONS">
							{STRINGS['P2P.PAYMENT_INSTRUCTIONS']}
						</EditWrapper>
					</div>
				)}

				{user?.id === selectedOrder?.merchant_id && (
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

					{selectedOrder?.payment_method_used?.fields?.map((x) => {
						return (
							<div className="payment-methods-list">
								<div className="font-weight-bold">{x?.name}:</div>
								<div>{x?.value}</div>
							</div>
						);
					})}
				</div>
			</div>

			<div className="order-verification-container secondary-text">
				{selectedOrder?.user_status === 'pending' && (
					<div className="mb-3 important-text order-timer-wrapper">
						<EditWrapper stringId="P2P.EXPECTED_TIME">
							{STRINGS['P2P.EXPECTED_TIME']}
						</EditWrapper>
						<Timer order={selectedOrder} />
					</div>
				)}

				{user?.id === selectedOrder?.user_id && (
					<>
						{selectedOrder?.user_status === 'pending' && (
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

						{selectedOrder?.user_status === 'confirmed' && (
							<div className="mb-3">
								<EditWrapper stringId="P2P.FUNDS_CREDITED">
									{STRINGS['P2P.FUNDS_CREDITED']}
								</EditWrapper>
							</div>
						)}

						{selectedOrder?.merchant_status === 'cancelled' && (
							<div className="mb-3">
								<EditWrapper stringId="P2P.VENDOR_CANCELLED">
									{STRINGS['P2P.VENDOR_CANCELLED']}
								</EditWrapper>
							</div>
						)}

						{selectedOrder?.merchant_status === 'confirmed' && (
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
									<EditWrapper stringId="P2P.FUNDS_TRANSFERRED">
										{STRINGS['P2P.FUNDS_TRANSFERRED']}
									</EditWrapper>
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
						{selectedOrder?.merchant_status === 'appeal' && (
							<>
								<div className="vendor-appealed-text">
									<EditWrapper stringId="P2P.VENDOR_APPEALED">
										{STRINGS['P2P.VENDOR_APPEALED']}
									</EditWrapper>
								</div>
							</>
						)}
						{selectedOrder?.user_status === 'appeal' && (
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

				{user?.id === selectedOrder?.merchant_id && (
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
							</div>
						)}

						{selectedOrder?.user_status === 'pending' && (
							<>
								<div className="mt-2 mb-2">
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
						{selectedOrder?.user_status === 'cancelled' && (
							<div className="mt-2 mb-2">
								<EditWrapper stringId="P2P.TRANSACTION_CANCELLED">
									{STRINGS['P2P.TRANSACTION_CANCELLED']}
								</EditWrapper>
							</div>
						)}
						{selectedOrder?.user_status === 'confirmed' &&
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
						{user?.id === selectedOrder?.user_id &&
							selectedOrder.user_status === 'appeal' && (
								<div className="mt-2 mb-2">
									<EditWrapper stringId="P2P.USER_APPEALED">
										{STRINGS['P2P.USER_APPEALED']}
									</EditWrapper>
								</div>
							)}

						{user?.id === selectedOrder?.merchant_id &&
							selectedOrder.user_status === 'appeal' && (
								<div className="mt-2 mb-2">
									<EditWrapper stringId="P2P.BUYER_APPEALED_ORDER">
										{STRINGS['P2P.BUYER_APPEALED_ORDER']}
									</EditWrapper>
								</div>
							)}
					</>
				)}

				<div className="order-cancel-container">
					{user?.id === selectedOrder?.user_id && (
						<>
							{selectedOrder?.user_status === 'confirmed' &&
								selectedOrder?.merchant_status === 'pending' && (
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

					{user?.id === selectedOrder?.merchant_id &&
						selectedOrder?.merchant_status === 'pending' && (
							<span
								className={
									selectedOrder?.user_status !== 'confirmed'
										? 'appeal-confirm-button-container appeal-confirm-button-container-active'
										: 'appeal-confirm-button-container-active'
								}
							>
								<div
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
									className={
										selectedOrder?.user_status !== 'confirmed'
											? 'appeal-link blue-link disable-link'
											: 'appeal-link blue-link'
									}
								>
									<EditWrapper stringId="P2P.APPEAL">
										{STRINGS['P2P.APPEAL']}
									</EditWrapper>
								</div>

								<Tooltip
									placement="rightBottom"
									title={
										selectedOrder?.user_status !== 'confirmed'
											? STRINGS['P2P.BUYER_NOT_MADE_THE_PAYMENT']
											: ''
									}
								>
									<Button
										disabled={selectedOrder?.user_status !== 'confirmed'}
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
					{user?.id === selectedOrder?.merchant_id &&
						selectedOrder?.merchant_status === 'appeal' && (
							<div className="user-appeal-description font-weight-bold">
								<EditWrapper stringId="P2P.USER_APPEALED">
									{STRINGS['P2P.USER_APPEALED']}
								</EditWrapper>
							</div>
						)}
				</div>
			</div>
			{user.id === selectedOrder?.user_id &&
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
		</div>
	);
};

const mapDispatchToProps = (dispatch) => ({
	setIsChat: bindActionCreators(setIsChat, dispatch),
});

export default connect('', mapDispatchToProps)(withRouter(P2POrderDetails));
