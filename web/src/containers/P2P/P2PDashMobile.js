import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, Input, InputNumber, message, Select } from 'antd';
import { CloseOutlined, ExclamationCircleFilled } from '@ant-design/icons';

import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { Coin, Dialog, EditWrapper } from 'components';

const P2PDashMobile = ({
	buyValue,
	filterCoin,
	filterAmount,
	filterMethod,
	filterRegion,
	filterDigital,
	formatRate,
	amountFiat,
	amountCurrency,
	selectedDeal,
	selectedMethod,
	setSelectedDeal,
	setDisplayOrderCreation,
	setAmountCurrency,
	setAmountFiat,
	setSelectedMethod,
	formatAmount,
	coins,
	handleVendorFeedback,
	userProfile,
	myMethods,
	setTab,
}) => {
	const [displayTrading, setDisplayTrading] = useState(false);
	const [spentAmountInput, setSpentAmountInput] = useState(false);
	const [receiveAmountInput, setReceiveAmountInput] = useState(false);

	const onHandleFocus = (text) => {
		if (text === 'spent amount') {
			setSpentAmountInput(true);
		} else {
			setReceiveAmountInput(true);
		}
	};

	const handleCloseTrading = () => {
		setDisplayTrading(false);
		setSelectedMethod();
		setAmountCurrency();
		setAmountFiat();
		setSelectedDeal();
	};

	const isDisabled =
		!selectedDeal?.id ||
		amountFiat <= 0 ||
		!amountFiat ||
		!selectedMethod?.system_name ||
		selectedDeal?.min_order_value > amountFiat ||
		selectedDeal?.max_order_value < amountFiat;

	return (
		<div className="stake_theme p2p-trade-details">
			{buyValue
				?.filter(
					(deal) =>
						(filterCoin ? filterCoin === deal.spending_asset : true) &&
						(filterDigital ? filterDigital === deal.buying_asset : true) &&
						(filterAmount ? filterAmount < deal.max_order_value : true) &&
						(filterMethod
							? deal.payment_methods.find((x) => x.system_name === filterMethod)
							: true) &&
						(filterRegion ? filterRegion === deal.region : true)
				)
				.map((deal) => {
					return (
						<>
							{displayTrading && (
								<Dialog
									isOpen={displayTrading}
									onCloseDialog={() => handleCloseTrading()}
									className="trading-popup-wrapper fs-16"
								>
									<div className="trading-popup-container">
										<div className="d-flex justify-content-between">
											<div className="trading-side-container">
												<span className="trade-text font-weight-bold">
													{selectedDeal.side === 'sell'
														? STRINGS['P2P.BUY_COIN']
														: STRINGS['P2P.SELL_COIN']}
												</span>
												<span className="font-weight-bold">
													{selectedDeal?.buying_asset.toUpperCase()}{' '}
												</span>
												<EditWrapper stringId="P2P.PRICE">
													<span className="secondary-text">
														@{STRINGS['P2P.PRICE']}
													</span>
												</EditWrapper>
												<span
													className={
														selectedDeal?.side === 'sell'
															? 'asset-buy-field'
															: 'asset-sell-field'
													}
												>
													{formatRate(
														selectedDeal?.exchange_rate,
														selectedDeal?.spread,
														selectedDeal?.spending_asset,
														selectedDeal?.side
													)}
												</span>
												<span
													className={
														selectedDeal?.side === 'sell'
															? 'asset-buy-field'
															: 'asset-sell-field'
													}
												>
													{selectedDeal?.spending_asset.toUpperCase()}
												</span>
											</div>
											<span
												className="secondary-text close-icon"
												onClick={() => handleCloseTrading()}
											>
												<CloseOutlined />
											</span>
										</div>
										<div className="trading-payment-detail">
											<div
												className={
													spentAmountInput
														? 'p2p-amount-spent active-focus'
														: 'p2p-amount-spent'
												}
											>
												<span className="amount-spent-title">
													<EditWrapper stringId="P2P.SPEND_AMOUNT">
														{STRINGS['P2P.SPEND_AMOUNT']}
													</EditWrapper>
													:
												</span>
												<div className="amount-spent-field-container">
													<span className="spent-asset-name ">
														<span className="spent-asset-icon">
															<Coin
																iconId={
																	coins[selectedDeal?.spending_asset]?.icon_id
																}
																type="CS9"
															/>
														</span>
														{selectedDeal?.spending_asset?.toUpperCase()}
													</span>
													<InputNumber
														className={
															amountFiat <= 0 ||
															!amountFiat ||
															selectedDeal?.min_order_value > amountFiat ||
															selectedDeal?.max_order_value < amountFiat
																? 'error-field amount-spent-field w-75'
																: 'amount-spent-field w-75'
														}
														value={amountFiat}
														onChange={(e) => {
															setAmountFiat(e);
															const currencyAmount =
																Number(e) /
																Number(
																	selectedDeal?.exchange_rate *
																		(1 +
																			Number(selectedDeal?.spread / 100 || 0))
																);

															const formatted = formatAmount(
																selectedDeal?.buying_asset,
																currencyAmount
															);

															setAmountCurrency(formatted);
														}}
														placeholder="0"
														autoFocus={true}
														onFocus={() => onHandleFocus('spent amount')}
														onBlur={() => setSpentAmountInput(false)}
													/>
												</div>
											</div>
											<div className="error-field-container">
												{selectedDeal?.min_order_value > amountFiat && (
													<div className="error-message">
														<ExclamationCircleFilled />
														<EditWrapper
															stringId={STRINGS.formatString(
																STRINGS['P2P.MINIMUM_AMOUNT_WARNING'],
																STRINGS['P2P.SPEND_AMOUNT'].toLowerCase(),
																selectedDeal?.min_order_value
															)}
														>
															<span className="error-message ml-1">
																{STRINGS.formatString(
																	STRINGS['P2P.MINIMUM_AMOUNT_WARNING'],
																	STRINGS['P2P.SPEND_AMOUNT'].toLowerCase(),
																	selectedDeal?.min_order_value
																)}
															</span>
														</EditWrapper>
													</div>
												)}
												{selectedDeal?.max_order_value < amountFiat && (
													<div className="error-message">
														<ExclamationCircleFilled />
														<EditWrapper
															stringId={STRINGS.formatString(
																STRINGS['P2P.MAXIMUM_AMOUNT_WARNING'],
																STRINGS['P2P.SPEND_AMOUNT'].toLowerCase(),
																selectedDeal?.max_order_value
															)}
														>
															<span className="error-message ml-1">
																{STRINGS.formatString(
																	STRINGS['P2P.MAXIMUM_AMOUNT_WARNING'],
																	STRINGS['P2P.SPEND_AMOUNT'].toLowerCase(),
																	selectedDeal?.max_order_value
																)}
															</span>
														</EditWrapper>
													</div>
												)}
											</div>
											<div
												className={
													receiveAmountInput
														? 'active-focus p2p-amount-receive'
														: 'p2p-amount-receive'
												}
											>
												<div className="amount-receive-title">
													<span>
														<EditWrapper stringId="P2P.AMOUNT_TO_RECEIVE">
															{STRINGS['P2P.AMOUNT_TO_RECEIVE']}:
														</EditWrapper>
													</span>
												</div>
												<div className="amount-receive-field-container">
													<span className="spent-asset-name ">
														<span className="spent-asset-icon">
															<Coin
																iconId={
																	coins[selectedDeal?.buying_asset]?.icon_id
																}
																type="CS9"
															/>
														</span>
														{selectedDeal?.buying_asset?.toUpperCase()}
													</span>
													<Input
														className="amount-receive-field w-75"
														readOnly
														value={amountCurrency}
														placeholder="0"
														onFocus={() => onHandleFocus('receive amount')}
														onBlur={() => setReceiveAmountInput(false)}
													/>
												</div>
											</div>
											<div className="payment-method-field">
												{selectedDeal?.side === 'sell' ? (
													<span
														className={
															!selectedMethod?.system_name
																? 'payment-method-field-container'
																: 'payment-method-field-container'
														}
													>
														<Select
															showSearch
															className={
																selectedDeal?.min_order_value <= amountFiat &&
																selectedDeal?.max_order_value >= amountFiat &&
																!selectedMethod?.system_name
																	? 'payment-method-field payment-method-error-field w-100'
																	: 'payment-method-field w-100'
															}
															dropdownClassName="p2p-custom-style-dropdown"
															placeholder="Payment Method"
															value={selectedMethod?.system_name}
															onChange={(e) => {
																setSelectedMethod(
																	deal.payment_methods.find(
																		(x) => x.system_name === e
																	)
																);
															}}
														>
															{selectedDeal?.payment_methods.map((method) => {
																return (
																	<Select.Option value={method.system_name}>
																		{method.system_name}
																	</Select.Option>
																);
															})}
														</Select>
													</span>
												) : selectedDeal?.payment_methods?.filter((a) =>
														myMethods?.find(
															(x) =>
																x.name.toLowerCase() ===
																a.system_name?.toLowerCase()
														)
												  ).length === 0 ? (
													<span className="add-payment-container">
														<Button
															onClick={() => {
																setTab('2');
																setDisplayTrading(false);
															}}
															className="purpleButtonP2P add-payment-button w-100"
														>
															<EditWrapper stringId="P2P.ADD_PAYMENT_METHOD">
																{STRINGS['P2P.ADD_PAYMENT_METHOD']}
															</EditWrapper>
														</Button>
													</span>
												) : (
													selectedDeal?.payment_methods?.filter((a) =>
														myMethods?.find(
															(x) =>
																x.name.toLowerCase() ===
																a.system_name?.toLowerCase()
														)
													).length > 0 && (
														<span
															className={
																!selectedMethod?.system_name
																	? 'payment-method-field-container'
																	: 'payment-method-field-container'
															}
														>
															<Select
																className={
																	selectedDeal?.min_order_value <= amountFiat &&
																	selectedDeal?.max_order_value >= amountFiat &&
																	!selectedMethod?.system_name
																		? 'payment-method-field payment-method-error-field w-100'
																		: 'payment-method-field w-100'
																}
																dropdownClassName="p2p-custom-style-dropdown"
																showSearch
																placeholder="Payment Method"
																value={selectedMethod?.system_name}
																onChange={(e) => {
																	setSelectedMethod(
																		myMethods.find((x) => x.name === e).details
																	);
																}}
															>
																{selectedDeal?.payment_methods
																	?.filter((a) =>
																		myMethods?.find(
																			(x) =>
																				x.name.toLowerCase() ===
																				a.system_name?.toLowerCase()
																		)
																	)
																	.map((method) => {
																		return (
																			<Select.Option value={method.system_name}>
																				{method.system_name}
																			</Select.Option>
																		);
																	})}
															</Select>
														</span>
													)
												)}
												<Button
													className={`
														${isDisabled ? 'inactive-btn' : ''}
														${selectedDeal?.side === 'sell' ? 'greenButtonP2P' : 'redButtonP2P'}`}
													disabled={isDisabled}
													onClick={async () => {
														try {
															setDisplayOrderCreation(true);
														} catch (error) {
															message.error(error.data.message);
														}
													}}
												>
													{selectedDeal?.side === 'sell' ? 'BUY' : 'SELL'}{' '}
													{selectedDeal?.buying_asset.toUpperCase()} {'>'}
												</Button>
											</div>
										</div>
										<div className="error-field-container mb-5">
											{selectedDeal?.min_order_value <= amountFiat &&
												selectedDeal?.max_order_value >= amountFiat &&
												!selectedMethod?.system_name && (
													<span className="error-message">
														<ExclamationCircleFilled />
														<EditWrapper stringId="P2P.SELECT_PAYMENT_METHOD_AND_AMOUNT">
															<span className="ml-1">
																{
																	STRINGS[
																		'P2P.SELECT_PAYMENT_METHOD_AND_AMOUNT'
																	]
																}
															</span>
														</EditWrapper>
													</span>
												)}
										</div>
										<div className="asset-avaliable-amount">
											<div className="p2p-avaliable-price mt-3">
												<EditWrapper stringId="P2P.AVAILABLE">
													{STRINGS['P2P.AVAILABLE']}:
												</EditWrapper>
												<span className="ml-1 deal-amount secondary-text">
													{selectedDeal?.total_order_amount}{' '}
												</span>
												<span className="deal-amount secondary-text">
													{selectedDeal?.buying_asset.toUpperCase()}
												</span>
											</div>
											<div className="p2p-limit-price">
												<div className="p2p-avaliable-price">
													<EditWrapper stringId="P2P.LIMIT">
														{STRINGS['P2P.LIMIT']}:
													</EditWrapper>
													<span>
														<span className="ml-1 deal-amount secondary-text">
															{selectedDeal?.min_order_value} -{' '}
															{selectedDeal?.max_order_value}{' '}
														</span>
														<span className="deal-amount secondary-text">
															{selectedDeal?.spending_asset.toUpperCase()}
														</span>
													</span>
												</div>
											</div>
										</div>
										<div className="asset-avaliable-amount">
											<div className="vendor-details">
												<div className="vendor-name">
													<EditWrapper stringId="P2P.VENDOR">
														<span>{STRINGS['P2P.VENDOR']}:</span>
													</EditWrapper>
													<span className="vendor-name ml-2 secondary-text">
														{selectedDeal?.merchant.full_name || (
															<EditWrapper stringId="P2P.ANONYMOUS">
																{STRINGS['P2P.ANONYMOUS']}
															</EditWrapper>
														)}
													</span>
													<span className="ml-2 secondary-text">
														{(userProfile?.positiveFeedbackRate || 0).toFixed(
															2
														)}
														%
													</span>
												</div>
												<span
													onClick={() => handleVendorFeedback(selectedDeal)}
												>
													<EditWrapper stringId="VIEW">
														(
														<span className="text-decoration-underline blue-link">
															{STRINGS['VIEW']?.toUpperCase()}
														</span>
														)
													</EditWrapper>
												</span>
											</div>
											<div>
												<EditWrapper stringId="P2P.ORDERS_COMPLETED">
													<span>{STRINGS['P2P.ORDERS_COMPLETED']}</span>
												</EditWrapper>
												<span className="ml-2 secondary-text">
													{userProfile?.totalTransactions}
												</span>
											</div>
										</div>
										<div className="asset-avaliable-amount payment-time-limit-container">
											<div className="payment-description">
												<EditWrapper
													stringId={STRINGS.formatString(
														STRINGS['P2P.PAYMENT_TIME_LIMIT_LABEL'],
														STRINGS['P2P.30_MINUTES']
													)}
												>
													{STRINGS.formatString(
														STRINGS['P2P.PAYMENT_TIME_LIMIT_LABEL'],
														<span className="payment-time-limit secondary-text">
															{STRINGS['P2P.30_MINUTES']}
														</span>
													)}
												</EditWrapper>
											</div>
											<div className="p2p-terms-condition">
												<EditWrapper stringId="P2P.TERMS_CONDITIONS">
													{STRINGS['P2P.TERMS_CONDITIONS']}:
												</EditWrapper>
												<span className="deal-terms ml-2 secondary-text">
													{selectedDeal?.terms}
												</span>
											</div>
										</div>
									</div>
								</Dialog>
							)}
							<div className="p2p-trade-assets">
								<span className="vendor-name">
									{deal.merchant.full_name || (
										<EditWrapper stringId="P2P.ANONYMOUS">
											{STRINGS['P2P.ANONYMOUS']}
										</EditWrapper>
									)}
								</span>
								<div className="amount-detail">
									<span className="amount-field font-weight-bold">{`${formatRate(
										deal.exchange_rate,
										deal.spread,
										deal.spending_asset,
										deal.side
									)}`}</span>
									<span className="spend-asset">
										{deal.spending_asset.toUpperCase()}
									</span>
								</div>
								<div className="p2p-avaliable-price mt-5">
									<EditWrapper stringId="P2P.AVAILABLE">
										{STRINGS['P2P.AVAILABLE']}:
									</EditWrapper>
									<span className="ml-1 deal-amount important-text">
										{deal.total_order_amount}{' '}
									</span>
									<span className="deal-amount important-text">
										{deal.buying_asset.toUpperCase()}
									</span>
									<span className="asset-icon">
										<Coin
											iconId={coins[deal?.buying_asset].icon_id}
											type="CS11"
										/>
									</span>
								</div>
								<div className="p2p-limit-price mt-3">
									<div className="p2p-avaliable-price">
										<EditWrapper stringId="P2P.LIMIT">
											{STRINGS['P2P.LIMIT']}:
										</EditWrapper>
										<span>
											<span className="ml-1 deal-amount important-text">
												{deal.min_order_value} - {deal.max_order_value}{' '}
											</span>
											<span className="deal-amount important-text">
												{deal.spending_asset.toUpperCase()}
											</span>
										</span>
									</div>
								</div>
								<div className="custom-line"></div>
								<div className="trade-payment-container">
									<div className="payment-details">
										<span className="payments important-text">
											{deal.payment_methods
												.map((method) => method.system_name)
												.join(', ')}
										</span>
									</div>
									<div className="trade-button-container">
										<Button
											className={
												deal.side === 'sell'
													? 'greenButtonP2P trade-btn'
													: 'redButtonP2P trade-btn'
											}
											onClick={() => {
												setDisplayTrading(true);
												setSelectedDeal(deal);
											}}
										>
											{deal.side === 'sell' ? 'BUY' : 'SELL'}{' '}
											{deal.buying_asset.toUpperCase()} {'>'}
										</Button>
									</div>
								</div>
							</div>
						</>
					);
				})}
		</div>
	);
};

const mapStateToProps = (state) => ({
	coins: state.app.coins,
});

export default connect(mapStateToProps)(withConfig(P2PDashMobile));
