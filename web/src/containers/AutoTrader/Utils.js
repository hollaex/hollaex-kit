import React from 'react';
import { isMobile } from 'react-device-detect';

import icons from 'config/icons/dark';
import STRINGS from 'config/localizedStrings';
import { Button, Coin, Dialog, EditWrapper, Image } from 'components';

export const AutoTraderEmptydata = ({ setIsRenderPopup }) => {
	return (
		<div className="auto-trader-empty-table">
			<Image
				icon={icons['AUTO_TRADER_ICON']}
				wrapperClassName="auto-trader-icon"
			/>
			<span>
				<EditWrapper stringId="AUTO_TRADER.NO_DATA_DESCRIPTION">
					{STRINGS['AUTO_TRADER.NO_DATA_DESCRIPTION']}
				</EditWrapper>
			</span>
			<span className="auto-trader-link">
				<EditWrapper stringId="AUTO_TRADER.AUTO_TRADE_LINK_DESC">
					{STRINGS.formatString(
						STRINGS['AUTO_TRADER.AUTO_TRADE_LINK_DESC'],
						<span
							className="blue-link text-decoration-underline text-capitalize"
							onClick={() =>
								setIsRenderPopup((prev) => ({
									...prev,
									isDisplayAutoTrader: true,
								}))
							}
						>
							{STRINGS['FOOTER.CLICK_HERE']}
						</span>
					)}
				</EditWrapper>
			</span>
		</div>
	);
};

export const ConfirmAutoTrade = ({
	isDisplayConfirmPopup,
	setIsRenderPopup,
	onHandleClose,
	autoTradeDetails,
	coins,
	getBuyAssetAval,
	getSpendAssetAval,
	onHandleBack,
	onHandleConfirm,
	onHandleEdit,
	isConfirmAutoTrade,
	getDayLabel,
	timeZone,
}) => {
	const frequencyTrade = isConfirmAutoTrade
		? autoTradeDetails?.frequency
		: autoTradeDetails?.frequency === 'daily'
		? STRINGS['AUTO_TRADER.DAILY']
		: autoTradeDetails?.frequency === 'weekly'
		? STRINGS['AUTO_TRADER.WEEKLY']
		: autoTradeDetails?.frequency === 'monthly' &&
		  STRINGS['AUTO_TRADER.MONTHLY'];

	return (
		<Dialog
			isOpen={isDisplayConfirmPopup}
			onCloseDialog={() => {
				isConfirmAutoTrade
					? setIsRenderPopup((prev) => ({
							...prev,
							isDisplayConfirmPopup: false,
					  }))
					: setIsRenderPopup((prev) => ({
							...prev,
							isDisplayPlayAutoTrade: false,
					  }));
				onHandleClose();
			}}
			className="auto-trader-popup-wrapper auto-trader-confirm-popup-wrapper"
			shouldCloseOnOverlayClick={false}
		>
			<div className="auto-trader-popup-container auto-trader-confirm-popup-container">
				<EditWrapper stringId="AUTO_TRADER.REVIEW_AND_CONFIRM">
					<span className="auto-trader-title">
						{
							STRINGS[
								isConfirmAutoTrade
									? 'AUTO_TRADER.REVIEW_AND_CONFIRM'
									: 'AUTO_TRADER.ACTIVATE_AUTO_TRADE'
							]
						}
					</span>
				</EditWrapper>
				<div className="auto-trade-content-wrapper">
					<EditWrapper stringId="AUTO_TRADER.CONFIRM_DESC">
						<span className="secondary-text">
							{STRINGS['AUTO_TRADER.CONFIRM_DESC']}
						</span>
					</EditWrapper>
					<div className="selected-asset-details">
						<div className="asset-details">
							<span className="w-100">
								<span className="spend-asset-details">
									<EditWrapper stringId="AUTO_TRADER.SPEND_ASSET">
										<span className="important-text font-weight-bold">
											{STRINGS['AUTO_TRADER.SPEND_ASSET']}:
										</span>
									</EditWrapper>
									<span className="asset-icon">
										<Coin
											iconId={coins[autoTradeDetails?.spend_coin]?.icon_id}
											type={isMobile ? 'CS8' : 'CS4'}
										/>
									</span>
									<span className="mx-1">
										{coins[autoTradeDetails?.spend_coin]?.fullname}
									</span>
									<span>({autoTradeDetails?.spend_coin?.toUpperCase()})</span>
								</span>
								<span className="mt-2">
									<EditWrapper stringId="AUTO_TRADER.AVAL_BALANCE">
										<span className="secondary-text">
											{' '}
											(
											{STRINGS.formatString(
												STRINGS['AUTO_TRADER.AVAL_BALANCE'],
												<span>{getSpendAssetAval}</span>,
												<span>
													{autoTradeDetails?.spend_coin?.toUpperCase()}
												</span>
											)}
											)
										</span>
									</EditWrapper>
								</span>
							</span>
							{isConfirmAutoTrade && (
								<EditWrapper stringId="EDIT_TEXT">
									<span
										className="blue-link text-decoration-underline"
										onClick={() => onHandleEdit('confirmAmount')}
									>
										{STRINGS['EDIT_TEXT']}
									</span>
								</EditWrapper>
							)}
						</div>
						<div className="asset-details buy-asset-details-wrapper">
							<span className="spend-asset-details">
								<EditWrapper stringId="AUTO_TRADER.BUY_ASSET">
									<span className="important-text font-weight-bold">
										{STRINGS['AUTO_TRADER.BUY_ASSET']}:
									</span>
								</EditWrapper>
								<span className="asset-icon">
									<Coin
										iconId={coins[autoTradeDetails?.buy_coin]?.icon_id}
										type={isMobile ? 'CS8' : 'CS4'}
									/>
								</span>
								<span className="mx-1">
									{coins[autoTradeDetails?.buy_coin]?.fullname}
								</span>
								<span>({autoTradeDetails?.buy_coin?.toUpperCase()})</span>
							</span>
							<span>
								<EditWrapper stringId="AUTO_TRADER.AVAL_BALANCE">
									<span className="secondary-text">
										{' '}
										(
										{STRINGS.formatString(
											STRINGS['AUTO_TRADER.AVAL_BALANCE'],
											<span>{getBuyAssetAval}</span>,
											<span>{autoTradeDetails?.buy_coin?.toUpperCase()}</span>
										)}
										)
									</span>
								</EditWrapper>
							</span>
						</div>
					</div>
					<div className="spend-amount-details-wrapper">
						<span className="spend-amount-details">
							<span className="caps-first font-weight-bold">
								{frequencyTrade}
							</span>
							<EditWrapper stringId="SPEND_AMOUNT">
								<span className="font-weight-bold">
									{STRINGS['SPEND_AMOUNT']}:
								</span>
							</EditWrapper>
							<span className="asset-icon ml-1">
								<Coin
									iconId={coins[autoTradeDetails?.spend_coin]?.icon_id}
									type="CS5"
								/>
							</span>
							<span className="spend-asset-amount">
								{autoTradeDetails?.spend_amount}
							</span>
							<span className="spend-asset">
								{autoTradeDetails?.spend_coin?.toUpperCase()}
							</span>
						</span>
						{isConfirmAutoTrade && (
							<EditWrapper stringId="EDIT_TEXT">
								<span
									className="blue-link text-decoration-underline"
									onClick={() => onHandleEdit('confirmAmount')}
								>
									{STRINGS['EDIT_TEXT']}
								</span>
							</EditWrapper>
						)}
					</div>
					<div className="warning-message-content-wrapper">
						<span className="arrow-up-icon">↑</span>
						<div>
							<EditWrapper stringId="AUTO_TRADER.WARNING_MESSAGE_1">
								<span>{STRINGS['AUTO_TRADER.WARNING_MESSAGE_1']}</span>
							</EditWrapper>
						</div>
					</div>
					<div className="selected-trade-details">
						<span className="trade-details">
							<div className="frequency-trade-details secondary-text mt-1">
								<EditWrapper stringId="AUTO_TRADER.TIME_ZONE">
									<span className="important-text font-weight-bold">
										{STRINGS['AUTO_TRADER.TIME_ZONE']}
									</span>
								</EditWrapper>
								<span className="important-text">{timeZone}</span>
							</div>
							{isConfirmAutoTrade && (
								<EditWrapper stringId="EDIT_TEXT">
									<span
										className="blue-link text-decoration-underline"
										onClick={() => onHandleEdit('trade')}
									>
										{STRINGS['EDIT_TEXT']}
									</span>
								</EditWrapper>
							)}
						</span>
						<span className="trade-details">
							<EditWrapper stringId="AUTO_TRADER.FREQUENCY_TRADE">
								<span className="important-text font-weight-bold">
									{STRINGS['AUTO_TRADER.FREQUENCY_TRADE']}:
								</span>
							</EditWrapper>
							<span className="important-text ml-1 caps-first">
								{frequencyTrade}
							</span>
						</span>
						{(isConfirmAutoTrade &&
							autoTradeDetails?.frequency === STRINGS['AUTO_TRADER.WEEKLY']) ||
						autoTradeDetails?.frequency === 'weekly' ? (
							<span className="trade-details">
								<EditWrapper stringId="AUTO_TRADER.WEEKLY_TRADE_TITLE">
									<span className="important-text font-weight-bold">
										{STRINGS['AUTO_TRADER.WEEKLY_TRADE_TITLE']}:
									</span>
								</EditWrapper>
								<span className="trade-days-container">
									{autoTradeDetails?.week_days?.map((day) => {
										return (
											<span className="trade-days">{getDayLabel(day)}</span>
										);
									})}
								</span>
							</span>
						) : (
							((isConfirmAutoTrade &&
								autoTradeDetails?.frequency ===
									STRINGS['AUTO_TRADER.MONTHLY']) ||
								autoTradeDetails?.frequency === 'monthly') && (
								<span className="trade-details">
									<EditWrapper stringId="P2P.TRADE">
										<span className="important-text font-weight-bold">
											{STRINGS['P2P.TRADE']}
										</span>
										<span className="important-text font-weight-bold ml-1">
											{STRINGS['P2P.DATE']}:
										</span>
									</EditWrapper>
									<span className="important-text ml-1">
										{autoTradeDetails?.day_of_month}
									</span>
								</span>
							)
						)}
						<span className="trade-details">
							<EditWrapper stringId="AUTO_TRADER.TRADE_TIME">
								<span className="important-text font-weight-bold">
									{STRINGS['AUTO_TRADER.TRADE_TIME']}:
								</span>
							</EditWrapper>
							<span className="important-text ml-1">
								{autoTradeDetails?.trade_hour}
								<EditWrapper stringId="AUTO_TRADER.HOUR_TEXT">
									(
									<span className="important-text">
										{STRINGS['AUTO_TRADER.HOUR_TEXT']}
									</span>
									)
								</EditWrapper>
							</span>
						</span>
					</div>
					<div className="selected-trade-details mt-3 description-content-wrapper">
						<div className="description-content">
							<EditWrapper stringId="CONTACT_FORM.DESCRIPTION_LABEL">
								<span className="important-text font-weight-bold">
									{STRINGS['CONTACT_FORM.DESCRIPTION_LABEL']}:
								</span>
							</EditWrapper>
							<span className="important-text ml-1">
								{autoTradeDetails?.description}
							</span>
						</div>
						<div className="exit-btn">
							{isConfirmAutoTrade && (
								<EditWrapper stringId="EDIT_TEXT">
									<span
										className="blue-link text-decoration-underline"
										onClick={() => onHandleEdit('confirmDescription')}
									>
										{STRINGS['EDIT_TEXT']}
									</span>
								</EditWrapper>
							)}
						</div>
					</div>
				</div>
				<div className="button-container">
					<Button
						label={STRINGS['BACK_TEXT']}
						className="back-btn"
						onClick={() =>
							onHandleBack(isConfirmAutoTrade ? 'step4' : 'isAuoTradePlay')
						}
					/>
					<Button
						label={STRINGS['CONFIRM_TEXT']}
						className="next-btn"
						onClick={() => onHandleConfirm()}
					/>
				</div>
			</div>
		</Dialog>
	);
};
