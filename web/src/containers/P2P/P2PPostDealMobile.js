import React from 'react';
import { connect } from 'react-redux';
import { Button, Input, InputNumber, Select, Switch } from 'antd';
import { ArrowRightOutlined, SyncOutlined } from '@ant-design/icons';

import withConfig from 'components/ConfigProvider/withConfig';
import STRINGS from 'config/localizedStrings';
import { Coin, EditWrapper } from 'components';
import { COUNTRIES_OPTIONS } from 'utils/countries';

const P2pPostDealMobile = ({
	p2p_config,
	step,
	selectedDealEdit,
	p2pSide,
	setP2pSide,
	currStep,
	priceType,
	spread,
	setSpread,
	dynamicRate,
	exchangeRate,
	formatAmount,
	spendingAsset,
	formatRate,
	setDynamicPair,
	getDynamicRate,
	buyingAsset,
	setExchangeRate,
	brokerData,
	dynamicPair,
	coins,
	setBuyingAsset,
	setPriceType,
	setSpendingAsset,
	setDynamicRate,
	handleNextStep,
	handlePreviousStep,
	region,
	setRegion,
	paymentMethods,
	setPaymentMethods,
	setSelectedMethod,
	totalOrderAmount,
	setTotalOrderAmount,
	minOrderValue,
	setMinOrderValue,
	maxOrderValue,
	setMaxOrderValue,
	setAddMethodDetails,
	terms,
	setTerms,
	autoResponse,
	setAutoResponse,
}) => {
	return (
		<div className="p2p-post-deal-mobile-container">
			{selectedDealEdit && (
				<div className="update-deal-container">
					<span className="sync-icon important-text">
						<SyncOutlined />
					</span>
					<div>
						<EditWrapper stringId="P2P.UPDATE_DEAL">
							<span className="p2p-update-deal important-text">
								{STRINGS['P2P.UPDATE_DEAL']}
							</span>
						</EditWrapper>
					</div>
				</div>
			)}
			{step === 1 && (
				<div
					className={
						selectedDealEdit ? 'toggle-container' : 'mt-5  toggle-container'
					}
				>
					<span
						className={`${
							p2pSide === 'buy'
								? 'secondary-text toggle-buy-text'
								: 'secondary-text'
						}`}
					>
						<EditWrapper stringId="P2P.I_WANT_TO_BUY">
							{STRINGS['P2P.I_WANT_TO_BUY']}
						</EditWrapper>
					</span>
					<span className="toggle-button">
						<Switch
							checked={p2pSide === 'sell' ? true : false}
							className={p2pSide === 'sell' ? 'toggle-sell' : 'toggle-buy'}
							onChange={(checked) => {
								if (step !== 1) return;
								if (p2p_config.side === 'sell' && !checked) return;
								if (p2p_config.side === 'buy' && checked) return;

								if (checked) {
									setP2pSide('sell');
								} else {
									setP2pSide('buy');
								}
							}}
							disabled={selectedDealEdit}
						/>
					</span>
					<span
						className={`${
							p2pSide === 'sell'
								? 'secondary-text toggle-sell-text'
								: 'secondary-text'
						}`}
					>
						<EditWrapper stringId="P2P.I_WANT_TO_SELL">
							{STRINGS['P2P.I_WANT_TO_SELL']}
						</EditWrapper>
					</span>
				</div>
			)}
			{(step === 2 || step === 3) && (
				<div className="toggle-container trading-side-asset">
					{p2pSide === 'sell' ? (
						<div className="toggle-sell-text">
							<EditWrapper
								stringId={STRINGS.formatString(
									STRINGS['P2P.SELLING'],
									<span>{buyingAsset?.toUpperCase()}</span>
								)}
							>
								{STRINGS.formatString(
									STRINGS['P2P.SELLING'],
									<span>{buyingAsset?.toUpperCase()}</span>
								)}
							</EditWrapper>
						</div>
					) : (
						<div className="toggle-buy-text">
							<EditWrapper
								stringId={STRINGS.formatString(
									STRINGS['P2P.BUYING'],
									<span>{spendingAsset?.toUpperCase()}</span>
								)}
							>
								{STRINGS.formatString(
									STRINGS['P2P.BUYING'],
									<span>{spendingAsset?.toUpperCase()}</span>
								)}
							</EditWrapper>
						</div>
					)}
				</div>
			)}
			<div className="p2p-post-deal-steps">
				<div className="custom-step-one">
					<div className="custom-stepper">
						<span className="custom-circle-active important-text">1</span>
						<span
							className={step === 1 ? 'custom-line-active' : 'custom-line'}
						></span>
					</div>
					<div
						className={
							currStep?.stepOne
								? 'important-text font-weight-bold terms-content w-100 mt-3'
								: 'terms-content w-100 mt-3'
						}
					>
						<EditWrapper>{STRINGS['P2P.STEP_SET_TYPE_PRICE']}</EditWrapper>
						{step === 1 && (
							<div className="p2p-trade-field-container">
								<div className="p2p-buy-sell-field">
									<div className="trade-asset-field">
										<div className="font-weight-bold">
											{p2pSide === 'sell' ? (
												<EditWrapper stringId="P2P.SELL_UPPER">
													{STRINGS['P2P.SELL_UPPER']}
												</EditWrapper>
											) : (
												<EditWrapper stringId="P2P.BUY_UPPER">
													{STRINGS['P2P.BUY_UPPER']}
												</EditWrapper>
											)}
										</div>
										<div className="select-asset-field">
											{buyingAsset && (
												<Coin
													iconId={coins[buyingAsset]?.icon_id}
													type="CS12"
												/>
											)}
											<Select
												showSearch
												className="p2p-custom-input-field"
												dropdownClassName="p2p-custom-style-dropdown selected-asset-dropdown"
												placeholder={STRINGS['P2P.SELECT_CRYPTO']}
												value={buyingAsset}
												onChange={(e) => {
													setBuyingAsset(e);
												}}
											>
												{p2p_config?.digital_currencies.map((coin) => (
													<Select.Option value={coin}>
														{coin?.toUpperCase()}
													</Select.Option>
												))}
											</Select>
										</div>
										<div className="crypto-text secondary-text">
											{p2pSide === 'sell' ? (
												<EditWrapper stringId="P2P.CRYPTO_WANT_TO_SELL">
													{STRINGS['P2P.CRYPTO_WANT_TO_SELL']}
												</EditWrapper>
											) : (
												<EditWrapper stringId="P2P.CRYPTO_WANT_TO_BUY">
													{STRINGS['P2P.CRYPTO_WANT_TO_BUY']}
												</EditWrapper>
											)}
										</div>
									</div>
									<div className="p2p-buy-sell-arrow-field">
										<ArrowRightOutlined />
									</div>
									<div className="trade-asset-field">
										<div className="font-weight-bold">
											{p2pSide === 'sell' ? (
												<EditWrapper stringId="P2P.RECEIVE">
													{STRINGS['P2P.RECEIVE']}
												</EditWrapper>
											) : (
												<EditWrapper stringId="P2P.SEND_UPPER">
													{STRINGS['P2P.SEND_UPPER']}
												</EditWrapper>
											)}
										</div>
										<div className="mt-2">
											<Select
												showSearch
												className="p2p-custom-input-field"
												dropdownClassName="p2p-custom-style-dropdown selected-asset-dropdown"
												placeholder={STRINGS['P2P.SELECT_FIAT']}
												value={spendingAsset}
												onChange={(e) => {
													setSpendingAsset(e);
												}}
											>
												{p2p_config?.fiat_currencies?.map((coin) => (
													<Select.Option value={coin}>
														{coin?.toUpperCase()}
													</Select.Option>
												))}
											</Select>
										</div>
										<div className="crypto-text secondary-text">
											{p2pSide === 'sell' ? (
												<EditWrapper stringId="P2P.FIAT_CURRENCY_WANT_TO_RECEIVE">
													{STRINGS['P2P.FIAT_CURRENCY_WANT_TO_RECEIVE']}
												</EditWrapper>
											) : (
												<EditWrapper stringId="P2P.FIAT_CURRENCY_WANT_TO_SPEND">
													{STRINGS['P2P.FIAT_CURRENCY_WANT_TO_SPEND']}
												</EditWrapper>
											)}
										</div>
									</div>
								</div>
								<div className="custom-border-line"></div>
								<div className="p2p-price-field-container">
									<div className="p2p-price-field">
										<div>
											<div className="mb-2 font-weight-bold">
												<EditWrapper stringId="P2P.TYPE">
													{STRINGS['P2P.TYPE']}
												</EditWrapper>
												:
											</div>
											<div>
												<Select
													showSearch
													className="p2p-custom-input-field"
													dropdownClassName="p2p-custom-style-dropdown selected-type-dropdown"
													placeholder="STATIC"
													value={priceType}
													onChange={(e) => {
														setPriceType(e);
														setExchangeRate();
														setDynamicRate();
														setDynamicPair();
													}}
												>
													<Select.Option value={'static'}>
														{STRINGS['P2P.STATIC']}
													</Select.Option>
													<Select.Option value={'dynamic'}>
														{STRINGS['P2P.DYNAMIC']}
													</Select.Option>
												</Select>
											</div>
										</div>
										{priceType === 'static' && (
											<div className="mt-5">
												<div className="mb-2 font-weight-bold">
													<EditWrapper stringId="P2P.PRICE_UPPER">
														{STRINGS['P2P.PRICE_UPPER']}
													</EditWrapper>{' '}
													{/* {spendingAsset
                                                         ? `(${spendingAsset?.toUpperCase()})`
                                                    : ''} */}
												</div>
												<div className="currency-field mt-2">
													<InputNumber
														value={exchangeRate}
														onChange={(e) => {
															if (!buyingAsset) return;
															if (isNaN(e)) return;
															if (e >= 0) {
																setExchangeRate(e);
															}
														}}
													/>
												</div>
											</div>
										)}
										{priceType === 'dynamic' && (
											<div className="mt-5">
												<div className="mb-2 font-weight-bold">
													<EditWrapper stringId="P2P.PRICE_UPPER">
														{STRINGS['P2P.PRICE_UPPER']}
													</EditWrapper>{' '}
													{/* {spendingAsset
                                                         ? `(${spendingAsset?.toUpperCase()})`
                                                    : ''} */}
												</div>
												<div>
													<Select
														showSearch
														className="p2p-custom-input-field"
														dropdownClassName="p2p-custom-style-dropdown selected-type-dropdown"
														placeholder="Select Dynamic Pair"
														value={dynamicPair}
														onChange={(e) => {
															setDynamicPair(e);
															getDynamicRate(e);
														}}
													>
														{brokerData
															.filter((broker) => broker.type === 'dynamic')
															.map((broker) => (
																<Select.Option value={broker.symbol}>
																	{broker.symbol}
																</Select.Option>
															))}
													</Select>
												</div>
												<div className="secondary-text mt-2">
													<span>
														<EditWrapper stringId="P2P.RATE">
															{STRINGS['P2P.RATE']}
														</EditWrapper>
													</span>
													<span className="important-text">
														{' '}
														{dynamicRate
															? `$${formatAmount('', dynamicRate)}`
															: '-'}
													</span>
												</div>
											</div>
										)}
										<div className="mt-5">
											<div className="mb-2 font-weight-bold">
												<EditWrapper stringId="P2P.SPREAD_PERCENTAGE">
													{STRINGS['P2P.SPREAD_PERCENTAGE']}
												</EditWrapper>
											</div>
											<div className="currency-field mt-2">
												<InputNumber
													value={spread}
													onChange={(e) => {
														if (isNaN(e)) return;
														if (e >= 0) {
															setSpread(e);
														}
													}}
												/>
											</div>
											<div className="secondary-text mt-2">
												<EditWrapper stringId="P2P.PRICE_PROFIT_SPREAD_SET">
													{STRINGS['P2P.PRICE_PROFIT_SPREAD_SET']}
												</EditWrapper>
											</div>
										</div>
									</div>
									{(exchangeRate || dynamicRate) && (
										<div className="equal-symbol">{'='}</div>
									)}
									{exchangeRate && (
										<div className="exchange-rate-container">
											<div className="mb-2 font-weight-bold">
												<EditWrapper stringId="P2P.UNIT_PRICE">
													{STRINGS['P2P.UNIT_PRICE']}
												</EditWrapper>
											</div>
											<div className="p2p-assets-rate">
												${formatRate(exchangeRate, spread, spendingAsset)}
												<sup className="ml-3">
													{spendingAsset?.toUpperCase()}
												</sup>
											</div>
											<div className="secondary-text mt-2">
												{p2pSide === 'sell' ? (
													<EditWrapper
														stringId={STRINGS.formatString(
															STRINGS['P2P.PRICE_ADVERTISE'],
															<span>{STRINGS['SIDES.SELL']}</span>
														)}
													>
														{STRINGS.formatString(
															STRINGS['P2P.PRICE_ADVERTISE'],
															<span className="sell-text">
																{STRINGS['SIDES.SELL']}
															</span>
														)}
													</EditWrapper>
												) : (
													<EditWrapper
														stringId={STRINGS.formatString(
															STRINGS['P2P.PRICE_ADVERTISE'],
															<span>{STRINGS['SIDES.BUY']}</span>
														)}
													>
														{STRINGS.formatString(
															STRINGS['P2P.PRICE_ADVERTISE'],
															<span className="buy-text">
																{STRINGS['SIDES.BUY']}
															</span>
														)}
													</EditWrapper>
												)}{' '}
												{/* {buyingAsset ? `${buyingAsset?.toUpperCase()}` : ''} */}
											</div>
										</div>
									)}
									{dynamicRate && (
										<div className="dynamic-rate-container">
											<div>
												<EditWrapper stringId="P2P.UNIT_PRICE">
													{STRINGS['P2P.UNIT_PRICE']}
												</EditWrapper>
											</div>
											<div className="p2p-assets-rate">
												${formatRate(dynamicRate, spread, spendingAsset)}
												<sup className="ml-3">
													{spendingAsset?.toUpperCase()}
												</sup>
											</div>
											<div className="secondary-text mt-2">
												{p2pSide === 'sell' ? (
													<EditWrapper
														stringId={STRINGS.formatString(
															STRINGS['P2P.PRICE_ADVERTISE'],
															<span>{STRINGS['SIDES.SELL']}</span>
														)}
													>
														{STRINGS.formatString(
															STRINGS['P2P.PRICE_ADVERTISE'],
															<span className="sell-text">
																{STRINGS['SIDES.SELL']}
															</span>
														)}
													</EditWrapper>
												) : (
													<EditWrapper
														stringId={STRINGS.formatString(
															STRINGS['P2P.PRICE_ADVERTISE'],
															<span>{STRINGS['SIDES.BUY']}</span>
														)}
													>
														{STRINGS.formatString(
															STRINGS['P2P.PRICE_ADVERTISE'],
															<span className="buy-text">
																{STRINGS['SIDES.BUY']}
															</span>
														)}
													</EditWrapper>
												)}{' '}
												{/* {buyingAsset ? `${buyingAsset?.toUpperCase()}` : ''} */}
											</div>
										</div>
									)}
								</div>
								<Button
									className="purpleButtonP2P next-btn"
									onClick={() => handleNextStep()}
								>
									<EditWrapper stringId="P2P.NEXT">
										{STRINGS['P2P.NEXT']}
									</EditWrapper>
								</Button>
							</div>
						)}
					</div>
				</div>
				<div className="custom-step-two">
					<div className="custom-stepper">
						<span
							className={
								currStep?.stepTwo || currStep?.stepThree
									? 'custom-circle-active important-text'
									: ' custom-circle-inactive custom-circle-active secondary-text'
							}
						>
							2
						</span>
						<span
							className={
								step === 2
									? 'custom-line-active'
									: currStep?.stepThree
									? 'custom-line'
									: 'custom-line-inactive'
							}
						></span>
					</div>
					<div
						className={
							currStep?.stepTwo
								? 'important-text font-weight-bold terms-content mt-3 w-100'
								: 'terms-content mt-3 w-100'
						}
					>
						<EditWrapper>
							{STRINGS['P2P.STEP_SET_TOTAL_AMOUNT_PAYMENT_METHODS']}
						</EditWrapper>
						{step === 2 && (
							<div className="p2p-trade-field-container p2p-payment-method-container">
								<div className="p2p-buy-sell-field w-100">
									<div className="total-amount-order-container w-100">
										<div className="p2p-total-amount-wrapper">
											{p2pSide === 'sell' ? (
												<div className="total-amount-field">
													<div className="total-amount-text">
														<EditWrapper stringId="P2P.TOTAL_AMOUNT">
															<span className="important-text font-weight-bold">
																{STRINGS['P2P.TOTAL_AMOUNT']?.toUpperCase()}
															</span>
														</EditWrapper>
													</div>
													<div className="buy-sell-description-text secondary-text">
														<span className="mr-2">
															{buyingAsset?.toUpperCase()}
														</span>
														<EditWrapper
															stringId={STRINGS.formatString(
																STRINGS['P2P.BUY_SELL_DESC'],
																STRINGS['SIDES_VALUES.sell']
															)}
														>
															{STRINGS.formatString(
																STRINGS['P2P.BUY_SELL_DESC'],
																STRINGS['SIDES_VALUES.sell']
															)}
														</EditWrapper>
													</div>
												</div>
											) : (
												<div className="total-amount-field">
													<div className="total-amount-text">
														<EditWrapper stringId="P2P.TOTAL_AMOUNT">
															<span className="important-text font-weight-bold">
																{STRINGS['P2P.TOTAL_AMOUNT']?.toUpperCase()}
															</span>
														</EditWrapper>
													</div>
													<div className="buy-sell-description-text secondary-text">
														<span className="mr-2">
															{spendingAsset?.toUpperCase()}
														</span>
														<EditWrapper
															stringId={STRINGS.formatString(
																STRINGS['P2P.BUY_SELL_DESC'],
																STRINGS['SIDES_VALUES.buy']
															)}
														>
															{STRINGS.formatString(
																STRINGS['P2P.BUY_SELL_DESC'],
																STRINGS['SIDES_VALUES.buy']
															)}
														</EditWrapper>
													</div>
												</div>
											)}
											<div className="total-amount-input-field">
												<Input
													value={totalOrderAmount}
													onChange={(e) => {
														setTotalOrderAmount(e.target.value);
													}}
													suffix={
														<div>
															<span className="mr-2">
																{p2pSide === 'sell'
																	? buyingAsset?.toUpperCase()
																	: spendingAsset?.toUpperCase()}
															</span>
															<span className="selected-asset-icon">
																<Coin
																	iconId={
																		coins[
																			p2pSide === 'sell'
																				? buyingAsset
																				: spendingAsset
																		]?.icon_id
																	}
																	type="CS11"
																/>
															</span>
														</div>
													}
												/>
											</div>
										</div>
										{p2pSide === 'sell' ? (
											<div className="payment-receive-container">
												<div className="payment-text">
													<EditWrapper stringId="P2P.PAYMENT_METHODS_RECEIVE_FIAT">
														<span className="important-text font-weight-bold">
															{' '}
															{STRINGS['P2P.PAYMENT_METHODS_RECEIVE_FIAT']}
														</span>
													</EditWrapper>
												</div>
												<div className="secondary-text my-4">
													<EditWrapper stringId="P2P.SELECT_PAYMENT_METHODS_1">
														{STRINGS['P2P.SELECT_PAYMENT_METHODS_1']}
													</EditWrapper>{' '}
													{p2p_config?.bank_payment_methods?.length || 0}{' '}
													<EditWrapper stringId="P2P.SELECT_PAYMENT_METHODS_2">
														{STRINGS['P2P.SELECT_PAYMENT_METHODS_2']}
													</EditWrapper>{' '}
													{spendingAsset?.toUpperCase()}
												</div>
												{p2p_config?.bank_payment_methods?.map((method) => {
													return (
														<div className="payment-list">
															<div
																className={
																	paymentMethods?.find(
																		(x) => x.system_name === method.system_name
																	)
																		? 'whiteTextP2P payment-method'
																		: 'greyTextP2P payment-method'
																}
																onClick={() => {
																	const newSelected = [...paymentMethods];
																	if (
																		newSelected.find(
																			(x) =>
																				x.system_name === method.system_name
																		)
																	) {
																		setPaymentMethods(
																			newSelected.filter(
																				(x) =>
																					x.system_name !== method.system_name
																			)
																		);
																	} else {
																		newSelected.push(method);
																		setPaymentMethods(newSelected);
																		setSelectedMethod(method);
																		setAddMethodDetails(true);
																	}
																}}
															>
																<div>{method.system_name}</div>
																{paymentMethods?.find(
																	(x) => x.system_name === method.system_name
																) && <div className="whiteTextP2P">✔</div>}
															</div>
															{paymentMethods?.find(
																(x) => x.system_name === method.system_name
															) && (
																<div
																	onClick={() => {
																		setSelectedMethod(method);
																		setAddMethodDetails(true);
																	}}
																	className="edit-link"
																>
																	<EditWrapper stringId="P2P.EDIT_UPPERCASE">
																		<span className="blue-link text-decoration-underline">
																			{STRINGS['P2P.EDIT_UPPERCASE']}
																		</span>
																	</EditWrapper>
																</div>
															)}
														</div>
													);
												})}
											</div>
										) : (
											<div className="payment-receive-container">
												<div className="payment-text">
													<EditWrapper stringId="P2P.PAYMENT_METHODS_SEND_FIAT">
														<span className="important-text font-weight-bold">
															{STRINGS['P2P.PAYMENT_METHODS_SEND_FIAT']}
														</span>
													</EditWrapper>
												</div>
												<div className="secondary-text my-4">
													<EditWrapper stringId="P2P.SELECT_PAYMENT_METHODS_1">
														{STRINGS['P2P.SELECT_PAYMENT_METHODS_1']}
													</EditWrapper>{' '}
													{p2p_config?.bank_payment_methods?.length || 0}{' '}
													<EditWrapper stringId="P2P.SELECT_PAYMENT_METHODS_2">
														{STRINGS['P2P.SELECT_PAYMENT_METHODS_2']}
													</EditWrapper>{' '}
													{spendingAsset?.toUpperCase()}
												</div>
												{p2p_config?.bank_payment_methods?.map((method) => {
													return (
														<div className="payment-list">
															<div
																className={
																	paymentMethods?.find(
																		(x) => x.system_name === method.system_name
																	)
																		? 'whiteTextP2P payment-method'
																		: 'greyTextP2P payment-method'
																}
																onClick={() => {
																	const newSelected = [...paymentMethods];
																	if (
																		newSelected.find(
																			(x) =>
																				x.system_name === method.system_name
																		)
																	) {
																		setPaymentMethods(
																			newSelected.filter(
																				(x) =>
																					x.system_name !== method.system_name
																			)
																		);
																	} else {
																		newSelected.push(method);
																		setPaymentMethods(newSelected);
																	}
																}}
															>
																<div>{method.system_name}</div>
																{paymentMethods?.find(
																	(x) => x.system_name === method.system_name
																) && <div className="whiteTextP2P">✔</div>}
															</div>
														</div>
													);
												})}
											</div>
										)}
									</div>
								</div>
								<div className="p2p-payment-method-wrapper">
									<div className="order-limit-container">
										{p2pSide === 'sell' ? (
											<div className="total-amount-text">
												<EditWrapper stringId="P2P.BUY_ORDER_LIMITS">
													<span className="important-text font-weight-bold">
														{STRINGS['P2P.BUY_ORDER_LIMITS']}
													</span>
												</EditWrapper>
											</div>
										) : (
											<div className="total-amount-text">
												<EditWrapper stringId="P2P.SELL_ORDER_LIMITS">
													<span className="important-text font-weight-bold">
														{STRINGS['P2P.SELL_ORDER_LIMITS']}
													</span>
												</EditWrapper>
											</div>
										)}
										{p2pSide === 'sell' ? (
											<div className="buy-sell-description-text secondary-text">
												<EditWrapper
													stringId={STRINGS.formatString(
														STRINGS['P2P.MIN_MAX_ORDER_VALUE_1'],
														<span>{spendingAsset?.toUpperCase()}</span>,
														STRINGS['P2P.MIN_MAX_ORDER_VALUE_3']
													)}
												>
													{STRINGS.formatString(
														STRINGS['P2P.MIN_MAX_ORDER_VALUE_1'],
														<span>{spendingAsset?.toUpperCase()}</span>,
														STRINGS['P2P.MIN_MAX_ORDER_VALUE_3']
													)}
												</EditWrapper>{' '}
											</div>
										) : (
											<div className="buy-sell-description-text secondary-text">
												<EditWrapper
													stringId={STRINGS.formatString(
														STRINGS['P2P.MIN_MAX_ORDER_VALUE_1'],
														<span>{buyingAsset?.toUpperCase()}</span>,
														STRINGS['P2P.MIN_MAX_ORDER_VALUE_2']
													)}
												></EditWrapper>{' '}
												{STRINGS.formatString(
													STRINGS['P2P.MIN_MAX_ORDER_VALUE_1'],
													<span>{buyingAsset?.toUpperCase()}</span>,
													STRINGS['P2P.MIN_MAX_ORDER_VALUE_2']
												)}
											</div>
										)}
										<div className="max-min-field-wrapper w-100">
											<div className="w-50">
												<div className="total-amount-input-field min-input-field">
													<Input
														value={minOrderValue}
														placeholder="MIN"
														onChange={(e) => {
															setMinOrderValue(e.target.value);
														}}
														suffix={
															p2pSide === 'sell'
																? spendingAsset?.toUpperCase()
																: buyingAsset?.toUpperCase()
														}
													/>
												</div>
												{p2pSide === 'sell' && (
													<div className="value-description">
														{minOrderValue
															? (
																	minOrderValue /
																	formatRate(
																		exchangeRate || dynamicRate,
																		spread,
																		spendingAsset
																	)
															  ).toFixed(4) +
															  ' ' +
															  buyingAsset?.toUpperCase()
															: ''}{' '}
													</div>
												)}
											</div>
											<span className="tilt-symbol important-text">~</span>
											<div className="w-50">
												<div className="total-amount-input-field max-input-field">
													<Input
														value={maxOrderValue}
														placeholder="MAX"
														onChange={(e) => {
															setMaxOrderValue(e.target.value);
														}}
														suffix={
															p2pSide === 'sell'
																? spendingAsset?.toUpperCase()
																: buyingAsset?.toUpperCase()
														}
													/>
												</div>
												{p2pSide === 'sell' && (
													<div className="value-description">
														{maxOrderValue
															? (
																	maxOrderValue /
																	formatRate(
																		exchangeRate || dynamicRate,
																		spread,
																		spendingAsset
																	)
															  ).toFixed(4) +
															  ' ' +
															  buyingAsset?.toUpperCase()
															: ''}{' '}
													</div>
												)}
											</div>
										</div>
									</div>
									<div className="select-region-container">
										<div className="region-title">
											<EditWrapper stringId="P2P.REGION">
												<span className="important-text font-weight-bold">
													{STRINGS['P2P.REGION']?.toUpperCase()}
												</span>
											</EditWrapper>
										</div>
										<div className="secondary-text my-2">
											<EditWrapper stringId="P2P.SELECT_REGION">
												{STRINGS['P2P.SELECT_REGION']}
											</EditWrapper>
										</div>
										<Select
											showSearch
											className="p2p-custom-input-field"
											dropdownClassName="p2p-custom-style-dropdown"
											filterOption={(input, option) =>
												option.props.children
													.toLowerCase()
													.indexOf(input.toLowerCase()) >= 0 ||
												option.props.value
													.toLowerCase()
													.indexOf(input.toLowerCase()) >= 0
											}
											placeholder="Select Region"
											value={region}
											onChange={(e) => {
												setRegion(e);
											}}
										>
											{COUNTRIES_OPTIONS.map((cn) => (
												<Select.Option value={cn.value}>
													{cn.label}
												</Select.Option>
											))}
										</Select>
									</div>
								</div>
								<div className="p2p-trade-button-container">
									<Button
										className="purpleButtonP2P back-btn"
										onClick={() => handlePreviousStep()}
									>
										<EditWrapper stringId="P2P.BACK_UPPER">
											{STRINGS['P2P.BACK_UPPER']}
										</EditWrapper>
									</Button>
									<Button
										className="purpleButtonP2P next-btn"
										onClick={() => handleNextStep()}
									>
										<EditWrapper stringId="P2P.NEXT">
											{STRINGS['P2P.NEXT']}
										</EditWrapper>
									</Button>
								</div>
							</div>
						)}
					</div>
				</div>
				<div className="custom-step-three">
					<div className="custom-stepper">
						<span
							className={
								currStep.stepThree
									? 'custom-circle-active important-text'
									: ' custom-circle-inactive custom-circle-active secondary-text'
							}
						>
							3
						</span>
					</div>
					<div
						className={
							currStep?.stepThree
								? 'important-text font-weight-bold terms-content mt-3'
								: 'terms-content mt-3'
						}
					>
						<EditWrapper>
							{STRINGS['P2P.STEP_SET_TERMS_AUTO_RESPONSE']}
						</EditWrapper>
					</div>
				</div>
				{step === 3 && (
					<div className="p2p-trade-field-container p2p-deal-terms-container mt-5">
						<div className="terms-conditions-wrapper w-100">
							<div className="terms-input-field w-100">
								<div className="whiteTextP2P terms-title">
									<EditWrapper stringId="P2P.TERMS">
										<span className="font-weight-bold">
											{STRINGS['P2P.TERMS']}
										</span>
									</EditWrapper>
								</div>
								<div className="secondary-text terms-description">
									<EditWrapper stringId="P2P.TERMS_CONDITIONS_DEAL">
										{STRINGS['P2P.TERMS_CONDITIONS_DEAL']}
									</EditWrapper>
								</div>
								<Input.TextArea
									className="terms-and-condition-field important-text"
									rows={4}
									value={terms}
									onChange={(e) => {
										setTerms(e.target.value);
									}}
									placeholder={STRINGS['P2P.TERMS_AND_CONDITION_DESCRIPTION']}
								/>
							</div>
						</div>
						<div className="response-field-wrapper terms-conditions-wrapper w-100">
							<div className="terms-input-field w-100">
								<div className="whiteTextP2P terms-title">
									<EditWrapper stringId="P2P.FIRST_RESPONSE">
										<span className="font-weight-bold">
											{STRINGS['P2P.FIRST_RESPONSE']}
										</span>
									</EditWrapper>
								</div>
								<div className="secondary-text terms-description">
									<EditWrapper stringId="P2P.CHAT_RESPONSE">
										{STRINGS['P2P.CHAT_RESPONSE']}
									</EditWrapper>
								</div>
								<Input.TextArea
									className="terms-and-condition-field important-text"
									rows={4}
									value={autoResponse}
									onChange={(e) => {
										setAutoResponse(e.target.value);
									}}
									placeholder={STRINGS['P2P.VISIT_OUR_WEBSITE']}
								/>
							</div>
						</div>
						<div className="p2p-trade-button-container">
							<Button
								className="purpleButtonP2P back-btn"
								onClick={() => handlePreviousStep()}
							>
								<EditWrapper stringId="P2P.BACK_UPPER">
									{STRINGS['P2P.BACK_UPPER']}
								</EditWrapper>
							</Button>
							<Button
								className="purpleButtonP2P next-btn"
								onClick={() => handleNextStep()}
							>
								<EditWrapper stringId="CONFIRM_TEXT">
									{STRINGS['CONFIRM_TEXT']?.toUpperCase()}
								</EditWrapper>
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	pairs: state.app.pairs,
	coins: state.app.coins,
	broker: state.app.broker,
	constants: state.app.constants,
	transaction_limits: state.app.transaction_limits,
	p2p_config: state.app.constants.p2p_config,
});

export default connect(mapStateToProps)(withConfig(P2pPostDealMobile));
