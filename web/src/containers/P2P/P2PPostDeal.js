import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';
import { Button, message } from 'antd';
import { Switch, Select, Input, InputNumber } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

import './_P2P.scss';
import classnames from 'classnames';
import STRINGS from 'config/localizedStrings';
import BigNumber from 'bignumber.js';
import withConfig from 'components/ConfigProvider/withConfig';
import { Coin, Dialog, EditWrapper } from 'components';
import { COUNTRIES_OPTIONS } from 'utils/countries';
import { createTestBroker } from 'containers/Admin/Trades/actions';
import { editDeal, postDeal } from './actions/p2pActions';

const P2PPostDeal = ({
	data,
	onClose,
	coins,
	pairs,
	constants = {},
	icons: ICONS,
	broker,
	transaction_limits,
	tiers = {},
	p2p_config,
	setTab,
	setRefresh,
	refresh,
	selectedDealEdit,
	setSelectedDealEdit,
}) => {
	const [step, setStep] = useState(1);
	const [p2pSide, setP2pSide] = useState(
		p2p_config.side === 'all' || p2p_config.side === 'sell' ? 'sell' : 'buy'
	);
	const [priceType, setPriceType] = useState('static');
	const [buyingAsset, setBuyingAsset] = useState();
	const [spendingAsset, setSpendingAsset] = useState();
	const [exchangeRate, setExchangeRate] = useState();
	const [spread, setSpread] = useState();
	const [totalOrderAmount, setTotalOrderAmount] = useState();
	const [minOrderValue, setMinOrderValue] = useState();
	const [maxOrderValue, setMaxOrderValue] = useState();
	const [terms, setTerms] = useState();
	const [autoResponse, setAutoResponse] = useState();
	const [paymentMethods, setPaymentMethods] = useState([]);
	const [selectedMethod, setSelectedMethod] = useState({});
	const [addMethodDetails, setAddMethodDetails] = useState();
	const [region, setRegion] = useState();
	const [brokerData, setBrokerData] = useState([]);
	const [dynamicPair, setDynamicPair] = useState();
	const [dynamicRate, setDynamicRate] = useState();
	const [currStep, setCurrStep] = useState({
		stepOne: true,
		stepTwo: false,
		stepThree: false,
	});

	useEffect(() => {
		if (selectedDealEdit) {
			setPriceType(selectedDealEdit?.price_type);
			setBuyingAsset(selectedDealEdit?.buying_asset);
			setSpendingAsset(selectedDealEdit?.spending_asset);
			setExchangeRate(selectedDealEdit?.exchange_rate);
			setSpread(selectedDealEdit?.spread);
			setTotalOrderAmount(selectedDealEdit?.total_order_amount);
			setMinOrderValue(selectedDealEdit?.min_order_value);
			setMaxOrderValue(selectedDealEdit?.max_order_value);
			setTerms(selectedDealEdit?.terms);
			setAutoResponse(selectedDealEdit?.auto_response);
			setPaymentMethods(selectedDealEdit?.payment_methods);
			setRegion(selectedDealEdit?.region);
			setP2pSide(selectedDealEdit?.side);
			setStep(1);
		} else {
			setPriceType('static');
			setBuyingAsset();
			setSpendingAsset();
			setExchangeRate();
			setSpread();
			setTotalOrderAmount();
			setMinOrderValue();
			setMaxOrderValue();
			setTerms();
			setAutoResponse();
			setPaymentMethods([]);
			setRegion();
			setStep(1);
		}

		getBrokerData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedDealEdit]);

	const getBrokerData = async () => {
		try {
			const res = broker;
			setBrokerData(res);
		} catch (error) {
			if (error) {
				message.error(error.message);
			}
		}
	};

	const getDynamicRate = async (pair) => {
		try {
			const broker = brokerData.find((broker) => broker.symbol === pair);
			const { formula, increment_size } = broker;
			const result = await createTestBroker({
				formula,
				increment_size,
				spread: 1,
			});

			setDynamicRate(result.data.buy_price);
		} catch (error) {
			if (error) {
				message.error(error.message);
			}
		}
	};
	const formatAmount = (currency, amount) => {
		const formattedAmount = new BigNumber(amount).decimalPlaces(4).toNumber();
		return formattedAmount;
	};

	const formatRate = (rate, spread, asset) => {
		const amount =
			p2pSide === 'sell'
				? rate * (1 + Number(spread / 100 || 0))
				: rate * (1 - Number(spread / 100 || 0));
		return formatAmount(asset, amount);
	};

	return (
		<div>
			<div
				className={classnames(
					...[
						'P2pOrder',
						'p2p-post-deal-container',
						isMobile ? 'mobile-view-p2p-post' : '',
					]
				)}
			>
				<div className="post-deal-description">
					<div
						className={
							currStep?.stepOne
								? 'important-text font-weight-bold terms-content'
								: 'terms-content'
						}
					>
						<EditWrapper>{STRINGS['P2P.STEP_SET_TYPE_PRICE']}</EditWrapper>
					</div>
					<div
						className={
							currStep?.stepTwo
								? 'important-text font-weight-bold terms-content'
								: 'terms-content'
						}
					>
						<EditWrapper>
							{STRINGS['P2P.STEP_SET_TOTAL_AMOUNT_PAYMENT_METHODS']}
						</EditWrapper>
					</div>
					<div
						className={
							currStep?.stepThree
								? 'important-text font-weight-bold terms-content'
								: 'terms-content'
						}
					>
						<EditWrapper>
							{STRINGS['P2P.STEP_SET_TERMS_AUTO_RESPONSE']}
						</EditWrapper>
					</div>
				</div>
				<div className="custom-step-container">
					<span
						className={
							currStep?.stepOne
								? 'important-text font-weight-bold custom-step step-active step-one '
								: 'custom-step step-one'
						}
					>
						1
					</span>
					<span
						className={
							currStep?.stepTwo
								? 'custom-line-active custom-line'
								: 'custom-line'
						}
					></span>
					<span
						className={
							currStep?.stepTwo
								? 'important-text font-weight-bold custom-step step-active'
								: 'custom-step'
						}
					>
						2
					</span>
					<span
						className={
							currStep?.stepThree
								? 'custom-line-active custom-line'
								: 'custom-line'
						}
					></span>
					<span
						className={
							currStep?.stepThree
								? 'important-text font-weight-bold custom-step step-three step-active'
								: 'custom-step step-three'
						}
					>
						3
					</span>
				</div>
				<div className="stake_theme p2p-post-deal-content-container">
					<div className="p2p-post-deal-content">
						{selectedDealEdit && (
							<div className="p2p-update-deal">
								<EditWrapper stringId="P2P.UPDATE_DEAL">
									{STRINGS['P2P.UPDATE_DEAL']}
								</EditWrapper>
							</div>
						)}
						{step === 1 && (
							<div
								className={
									selectedDealEdit
										? 'toggle-container'
										: 'mt-1  toggle-container'
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
										className={
											p2pSide === 'sell' ? 'toggle-sell' : 'toggle-buy'
										}
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
							<div className="toggle-container trade-">
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
						{step === 1 && (
							<div className="p2p-trade-field-container">
								<div className="p2p-buy-sell-field w-50">
									<div>
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
										<div className="mt-2 select-asset-field">
											{buyingAsset && (
												<Coin iconId={coins[buyingAsset]?.icon_id} type="CS4" />
											)}
											<Select
												showSearch
												className="p2p-custom-input-field"
												dropdownClassName="p2p-custom-style-dropdown"
												placeholder="USDT"
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
									<div>
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
												dropdownClassName="p2p-custom-style-dropdown"
												placeholder="USD"
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
													dropdownClassName="p2p-custom-style-dropdown"
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
											<div>
												<div className="mb-2 font-weight-bold">
													<EditWrapper stringId="P2P.PRICE_UPPER">
														{STRINGS['P2P.PRICE_UPPER']}
													</EditWrapper>{' '}
													{/* {spendingAsset
													? `(${spendingAsset?.toUpperCase()})`
													: ''} */}
												</div>
												<div className="currency-field">
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
											<div>
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
														dropdownClassName="p2p-custom-style-dropdown"
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
										<div>
											<div className="mb-2 font-weight-bold">
												<EditWrapper stringId="P2P.SPREAD_PERCENTAGE">
													{STRINGS['P2P.SPREAD_PERCENTAGE']}
												</EditWrapper>
											</div>
											<div className="currency-field">
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
												<sup>{spendingAsset?.toUpperCase()}</sup>
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
												<sup>{spendingAsset?.toUpperCase()}</sup>
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
							</div>
						)}

						{step === 2 && (
							<div className="p2p-trade-field-container p2p-payment-method-container">
								<div className="p2p-buy-sell-field w-50">
									<div className="total-amount-order-container">
										<div className="p2p-total-amount-wrapper">
											{p2pSide === 'sell' ? (
												<div className="total-amount-field">
													<div className="total-amount-text">
														<EditWrapper stringId="P2P.TOTAL_AMOUNT">
															{STRINGS['P2P.TOTAL_AMOUNT']}
														</EditWrapper>
													</div>
													<div className="buy-sell-description-text secondary-text">
														<span className="mr-1">
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
															{STRINGS['P2P.TOTAL_AMOUNT']}
														</EditWrapper>
													</div>
													<div className="buy-sell-description-text secondary-text">
														<span className="mr-1">
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
															<span>
																{p2pSide === 'sell'
																	? buyingAsset?.toUpperCase()
																	: spendingAsset?.toUpperCase()}
															</span>
															<Coin
																iconId={
																	coins[
																		p2pSide === 'sell'
																			? buyingAsset
																			: spendingAsset
																	]?.icon_id
																}
																type="CS4"
															/>
														</div>
													}
												/>
											</div>
										</div>

										<div className="order-limit-container">
											{p2pSide === 'sell' ? (
												<div className="total-amount-text">
													<EditWrapper stringId="P2P.BUY_ORDER_LIMITS">
														{STRINGS['P2P.BUY_ORDER_LIMITS']}
													</EditWrapper>
												</div>
											) : (
												<div className="total-amount-text">
													<EditWrapper stringId="P2P.SELL_ORDER_LIMITS">
														{STRINGS['P2P.SELL_ORDER_LIMITS']}
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

											<div className="max-min-field-wrapper">
												<div>
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
												<span className="tilt-symbol">~</span>
												<div>
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
									</div>
								</div>
								<div className="p2p-price-field-container p2p-payment-method-wrapper">
									{p2pSide === 'sell' ? (
										<div className="payment-receive-container">
											<div className="payment-text">
												<EditWrapper stringId="P2P.PAYMENT_METHODS_RECEIVE_FIAT">
													{STRINGS['P2P.PAYMENT_METHODS_RECEIVE_FIAT']}
												</EditWrapper>
											</div>
											<div className="secondary-text my-2">
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
																		(x) => x.system_name === method.system_name
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
													{STRINGS['P2P.PAYMENT_METHODS_SEND_FIAT']}
												</EditWrapper>
											</div>
											<div className="secondary-text my-2">
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
																		(x) => x.system_name === method.system_name
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

									<div className="select-region-container">
										<div className="region-title">
											<EditWrapper stringId="P2P.REGION">
												{STRINGS['P2P.REGION']}
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
							</div>
						)}

						{step === 3 && (
							<div className="p2p-trade-field-container p2p-deal-terms-container">
								<div className="terms-conditions-wrapper w-50">
									<div className="terms-input-field w-100">
										<div className="whiteTextP2P terms-title">
											<EditWrapper stringId="P2P.TERMS">
												{STRINGS['P2P.TERMS']}
											</EditWrapper>
										</div>
										<div className="secondary-text mb-3">
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
											placeholder={
												STRINGS['P2P.TERMS_AND_CONDITION_DESCRIPTION']
											}
										/>
									</div>
								</div>
								<div className="response-field-wrapper terms-conditions-wrapper w-50">
									<div className="terms-input-field w-100">
										<div className="whiteTextP2P terms-title">
											<EditWrapper stringId="P2P.FIRST_RESPONSE">
												{STRINGS['P2P.FIRST_RESPONSE']}
											</EditWrapper>
										</div>
										<div className="secondary-text mb-3">
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
							</div>
						)}
					</div>
				</div>

				<Dialog
					className="stake_theme payment-method-details-popup-wrapper"
					isOpen={addMethodDetails}
					onCloseDialog={() => {
						setAddMethodDetails(false);
					}}
				>
					<div className="whiteTextP2P add-payment-method-title">
						<EditWrapper stringId="P2P.ADD_PAYMENT_METHOD_DETAILS">
							{STRINGS['P2P.ADD_PAYMENT_METHOD_DETAILS']}
						</EditWrapper>
					</div>
					{selectedMethod?.fields?.map((x, index) => {
						return (
							<div className="whiteTextP2P payment-method-field">
								<div>{x?.name}:</div>
								<Input
									value={x.value}
									onChange={(e) => {
										if (!selectedMethod.fields[index].value)
											selectedMethod.fields[index].value = '';
										selectedMethod.fields[index].value = e.target.value;

										const newSelected = [...paymentMethods];
										const Index = newSelected.findIndex(
											(x) => x.system_name === selectedMethod.system_name
										);

										newSelected[Index].fields = selectedMethod.fields;
										setPaymentMethods(newSelected);
									}}
								/>
							</div>
						);
					})}

					<div className="payment-button-container">
						<Button
							onClick={() => {
								setAddMethodDetails(false);
							}}
							className="purpleButtonP2P back-btn"
							type="default"
						>
							<EditWrapper stringId="P2P.BACK_UPPER">
								{STRINGS['P2P.BACK_UPPER']}
							</EditWrapper>
						</Button>
						<Button
							onClick={async () => {
								setAddMethodDetails(false);
							}}
							className="purpleButtonP2P complete-btn"
							type="default"
						>
							<EditWrapper stringId="P2P.COMPLETE">
								{STRINGS['P2P.COMPLETE']}
							</EditWrapper>
						</Button>
					</div>
				</Dialog>
			</div>
			<div
				className={classnames(['postDealButton', 'post-deal-button-wrapper'])}
			>
				{step !== 1 && (
					<Button
						className="purpleButtonP2P back-btn"
						onClick={() => {
							if (step > 1) {
								setStep(step - 1);
								if (step === 2) {
									setCurrStep({
										...currStep,
										stepTwo: false,
									});
								}
								if (step === 3) {
									setCurrStep({
										...currStep,
										stepThree: false,
									});
								}
							}
						}}
					>
						<EditWrapper stringId="P2P.BACK_UPPER">
							{STRINGS['P2P.BACK_UPPER']}
						</EditWrapper>
					</Button>
				)}
				<Button
					className="purpleButtonP2P next-btn"
					onClick={async () => {
						if (
							step === 1 &&
							(!priceType ||
								!buyingAsset ||
								!spendingAsset ||
								(priceType === 'static' && !exchangeRate) ||
								(priceType === 'dynamic' && !dynamicRate))
						) {
							message.error(STRINGS['P2P.PLEASE_FILL_INPUTS']);
							return;
						}

						if (
							step === 2 &&
							(!totalOrderAmount ||
								!minOrderValue ||
								!maxOrderValue ||
								paymentMethods.length === 0 ||
								!region)
						) {
							message.error(STRINGS['P2P.PLEASE_FILL_INPUTS']);
							return;
						}

						if (step < 3) {
							if (step === 1) {
								setCurrStep({
									...currStep,
									stepTwo: true,
								});
							}
							if (step === 2) {
								setCurrStep({
									...currStep,
									stepThree: true,
								});
							}
							setStep(step + 1);
						} else {
							try {
								if (autoResponse.length > 240) {
									message.error(STRINGS['P2P.AUTO_RESPONSE_LIMIT']);
									return;
								}

								if (terms.length > 240) {
									message.error(STRINGS['P2P.TERMS_RESPONSE_LIMIT']);
									return;
								}

								if (selectedDealEdit) {
									await editDeal({
										id: selectedDealEdit.id,
										side: p2pSide,
										price_type: priceType,
										dynamic_pair: dynamicPair,
										buying_asset: buyingAsset,
										spending_asset: spendingAsset,
										exchange_rate: Number(exchangeRate || 0),
										spread: Number(spread),
										region,
										total_order_amount: Number(totalOrderAmount),
										min_order_value: Number(minOrderValue),
										max_order_value: Number(maxOrderValue),
										terms: terms,
										auto_response: autoResponse,
										payment_methods: paymentMethods,
									});
									setSelectedDealEdit();
								} else {
									await postDeal({
										side: p2pSide,
										price_type: priceType,
										dynamic_pair: dynamicPair,
										buying_asset: buyingAsset,
										spending_asset: spendingAsset,
										exchange_rate: Number(exchangeRate || 0),
										spread: Number(spread),
										region,
										total_order_amount: Number(totalOrderAmount),
										min_order_value: Number(minOrderValue),
										max_order_value: Number(maxOrderValue),
										terms: terms,
										auto_response: autoResponse,
										payment_methods: paymentMethods,
									});
								}

								setPriceType('static');
								setBuyingAsset();
								setSpendingAsset();
								setExchangeRate();
								setSpread();
								setTotalOrderAmount();
								setMinOrderValue();
								setMaxOrderValue();
								setTerms();
								setAutoResponse();
								setPaymentMethods([]);
								setRegion();
								setStep(1);

								message.success(
									`${
										selectedDealEdit
											? STRINGS['P2P.DEAL_EDITED']
											: STRINGS['P2P.DEAL_CREATED']
									}`
								);
								setTab('4');
								setRefresh(!refresh);
							} catch (error) {
								message.error(error.data.message);
							}
						}
					}}
				>
					<EditWrapper stringId="P2P.NEXT">{STRINGS['P2P.NEXT']}</EditWrapper>
				</Button>
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

export default connect(mapStateToProps)(withConfig(P2PPostDeal));
