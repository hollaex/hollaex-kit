/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ReactSVG } from 'react-svg';
import { Button, Steps, message, Modal } from 'antd';
import { IconTitle, EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { Switch, Select, Input } from 'antd';
import { postDeal, editDeal } from './actions/p2pActions';
import { CloseOutlined } from '@ant-design/icons';
import { formatToCurrency } from 'utils/currency';
import { COUNTRIES_OPTIONS } from 'utils/countries';
import { isMobile } from 'react-device-detect';
import classnames from 'classnames';
import BigNumber from 'bignumber.js';
import './_P2P.scss';

const P2PPostDeal = ({
	data,
	onClose,
	coins,
	pairs,
	constants = {},
	icons: ICONS,
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

	const dataSte = [
		{
			title: STRINGS['P2P.STEP_SET_TYPE_PRICE'],
		},
		{
			title: STRINGS['P2P.STEP_SET_TOTAL_AMOUNT_PAYMENT_METHODS'],
		},
		{
			title: STRINGS['P2P.STEP_SET_TERMS_AUTO_RESPONSE'],
		},
	];
	const { Step } = Steps;

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
	}, [selectedDealEdit]);

	const formatAmount = (currency, amount) => {
		const formattedAmount = new BigNumber(amount).decimalPlaces(4).toNumber();
		return formattedAmount;
	};

	const formatRate = (rate, spread, asset) => {
		const amount = rate * (1 + Number(spread / 100 || 0));
		return formatAmount(asset, amount);
	};

	return (
		<div
			className={classnames(
				...['P2pOrder', isMobile ? 'mobile-view-p2p-post' : '']
			)}
			style={{
				height: isMobile ? 800 : 600,
				width: '100%',
				padding: 20,
			}}
		>
			<div>
				<Steps current={step - 1}>
					{dataSte.map((item, index) => (
						<Step key={index} title={item.title} />
					))}
				</Steps>
			</div>

			<div>
				<div style={{ marginTop: 50 }}>
					<div
						style={{
							textAlign: 'center',
							display: 'flex',
							gap: 10,
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<span style={{ fontSize: 18 }}>
							<EditWrapper stringId="P2P.I_WANT_TO_BUY">
								{STRINGS['P2P.I_WANT_TO_BUY']}
							</EditWrapper>
						</span>
						<span>
							<Switch checked disabled />
						</span>
						<span style={{ fontSize: 18 }}>
							<EditWrapper stringId="P2P.I_WANT_TO_SELL">
								{STRINGS['P2P.I_WANT_TO_SELL']}
							</EditWrapper>
						</span>
					</div>

					{selectedDealEdit && (
						<div
							style={{
								fontSize: 17,
								textAlign: 'center',
								marginTop: 20,
								color: 'white',
							}}
						>
							<EditWrapper stringId="P2P.UPDATE_DEAL">
								{STRINGS['P2P.UPDATE_DEAL']}
							</EditWrapper>
						</div>
					)}

					{step === 1 && (
						<div
							style={{
								display: 'flex',
								gap: 120,
								marginTop: 40,
								padding: 30,
								border: 'grey 1px solid',
							}}
						>
							<div style={{ flex: 7, display: 'flex', gap: 10 }}>
								<div style={{ flex: 1 }}>
									<div>
										<EditWrapper stringId="P2P.SELL_UPPER">
											{STRINGS['P2P.SELL_UPPER']}
										</EditWrapper>
									</div>
									<div>
										<Select
											showSearch
											style={{ backgroundColor: '#303236', width: 150 }}
											placeholder="USDT"
											value={buyingAsset}
											onChange={(e) => {
												setBuyingAsset(e);
											}}
										>
											{p2p_config?.digital_currencies
												.filter((coin) => coin === 'usdt')
												.map((coin) => (
													<Select.Option value={coin}>
														{coin?.toUpperCase()}
													</Select.Option>
												))}
										</Select>
									</div>
									<div style={{ marginTop: 4 }}>
										<EditWrapper stringId="P2P.CRYPTO_WANT_TO_SELL">
											{STRINGS['P2P.CRYPTO_WANT_TO_SELL']}
										</EditWrapper>
									</div>
								</div>
								<div
									style={{
										flex: 1,
										fontSize: 25,
										position: 'relative',
										left: 25,
									}}
								>
									{/* {'>'} */}
								</div>
								<div style={{ flex: 1 }}>
									<div>
										<EditWrapper stringId="P2P.RECEIVE">
											{STRINGS['P2P.RECEIVE']}
										</EditWrapper>
									</div>
									<div>
										<Select
											showSearch
											style={{ backgroundColor: '#303236', width: 150 }}
											placeholder="USD"
											value={spendingAsset}
											onChange={(e) => {
												setSpendingAsset(e);
											}}
										>
											{p2p_config?.fiat_currencies.map((coin) => (
												<Select.Option value={coin}>
													{coin?.toUpperCase()}
												</Select.Option>
											))}
										</Select>
									</div>
									<div style={{ marginTop: 4 }}>
										<EditWrapper stringId="P2P.FIAT_CURRENCY_WANT_TO_RECEIVE">
											{STRINGS['P2P.FIAT_CURRENCY_WANT_TO_RECEIVE']}
										</EditWrapper>
									</div>
								</div>
							</div>
							<div style={{ flex: 1, borderLeft: 'grey 1px solid' }}></div>
							<div style={{ flex: 7, display: 'flex' }}>
								<div style={{ flex: 1 }}>
									{/* <div>
										<EditWrapper stringId="P2P.PRICE_UPPER">
											{STRINGS['P2P.PRICE_UPPER']}
										</EditWrapper>
									</div> */}
									{/* <div>
										<Select
											showSearch
											style={{ backgroundColor: '#303236' }}
											placeholder="STATIC"
											value={priceType}
											onChange={(e) => {
												setPriceType(e);
											}}
										>
											<Select.Option value={'static'}>
												{STRINGS['P2P.STATIC']}
											</Select.Option>
										</Select>
									</div> */}

									{priceType === 'static' && (
										<>
											<div style={{ marginTop: 10 }}>
												<EditWrapper stringId="P2P.PRICE_UPPER">
													{STRINGS['P2P.PRICE_UPPER']}
												</EditWrapper>
											</div>
											<div>
												<Input
													style={{ width: isMobile ? 120 : 200 }}
													value={exchangeRate}
													onChange={(e) => {
														if (!buyingAsset) return;
														setExchangeRate(e.target.value);
													}}
												/>
											</div>
										</>
									)}
									<div style={{ marginTop: 10 }}>
										<EditWrapper stringId="P2P.SPREAD_PERCENTAGE">
											{STRINGS['P2P.SPREAD_PERCENTAGE']}
										</EditWrapper>
									</div>
									<div>
										<Input
											style={{ width: isMobile ? 120 : 200 }}
											value={spread}
											onChange={(e) => {
												setSpread(e.target.value);
											}}
										/>
									</div>
									<div style={{ marginTop: 4 }}>
										<EditWrapper stringId="P2P.PRICE_PROFIT_SPREAD_SET">
											{STRINGS['P2P.PRICE_PROFIT_SPREAD_SET']}
										</EditWrapper>
									</div>
								</div>
								<div
									style={{
										flex: 1,
										fontSize: 25,
										position: 'relative',
										left: 5,
									}}
								>
									{/* {'>'} */}
								</div>

								{exchangeRate && (
									<div style={{ flex: 1 }}>
										<div>
											<EditWrapper stringId="P2P.UNIT_PRICE">
												{STRINGS['P2P.UNIT_PRICE']}
											</EditWrapper>
										</div>
										<div style={{ fontSize: 25 }}>
											{formatRate(exchangeRate, spread, spendingAsset)}
										</div>
										<div>
											<EditWrapper stringId="P2P.PRICE_ADVERTISE_SELL">
												{STRINGS['P2P.PRICE_ADVERTISE_SELL']}
											</EditWrapper>
										</div>
									</div>
								)}
							</div>
						</div>
					)}

					{step === 2 && (
						<div
							style={{
								display: 'flex',
								gap: 120,
								marginTop: 40,
								padding: 30,
								border: 'grey 1px solid',
							}}
						>
							<div style={{ flex: 7, display: 'flex' }}>
								<div style={{ flex: 1 }}>
									<div>
										<EditWrapper stringId="P2P.TOTAL_ASSET_SELL_1">
											{STRINGS['P2P.TOTAL_ASSET_SELL_1']}
										</EditWrapper>{' '}
										{buyingAsset?.toUpperCase()}{' '}
										<EditWrapper stringId="P2P.TOTAL_ASSET_SELL_2">
											{STRINGS['P2P.TOTAL_ASSET_SELL_2']}
										</EditWrapper>
									</div>
									<div>
										<Input
											value={totalOrderAmount}
											onChange={(e) => {
												setTotalOrderAmount(e.target.value);
											}}
										/>
									</div>

									<div style={{ marginTop: 50, marginBottom: 50 }}></div>

									<div>
										<EditWrapper stringId="P2P.BUY_ORDER_LIMITS">
											{STRINGS['P2P.BUY_ORDER_LIMITS']}
										</EditWrapper>
									</div>
									<div>
										<EditWrapper stringId="P2P.MIN_MAX_ORDER_VALUE_1">
											{STRINGS['P2P.MIN_MAX_ORDER_VALUE_1']}
										</EditWrapper>{' '}
										{spendingAsset?.toUpperCase()}{' '}
										<EditWrapper stringId="P2P.MIN_MAX_ORDER_VALUE_2">
											{STRINGS['P2P.MIN_MAX_ORDER_VALUE_2']}
										</EditWrapper>{' '}
										{spendingAsset?.toUpperCase()}
									</div>
									<div style={{ display: 'flex', gap: 10 }}>
										<div>
											<Input
												style={{ width: 150 }}
												value={minOrderValue}
												onChange={(e) => {
													setMinOrderValue(e.target.value);
												}}
											/>
										</div>
										<div>
											<Input
												style={{ width: 150 }}
												value={maxOrderValue}
												onChange={(e) => {
													setMaxOrderValue(e.target.value);
												}}
											/>
										</div>
									</div>
								</div>
							</div>
							<div style={{ flex: 1, borderLeft: 'grey 1px solid' }}></div>
							<div
								style={{
									flex: 7,
									display: 'flex',
									flexDirection: 'column',
									gap: 25,
								}}
							>
								<div style={{ flex: 1 }}>
									<div>
										<EditWrapper stringId="P2P.PAYMENT_METHODS_SEND_FIAT">
											{STRINGS['P2P.PAYMENT_METHODS_SEND_FIAT']}
										</EditWrapper>
									</div>
									<div>
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
											<div style={{ display: 'flex', gap: 5 }}>
												<div
													style={{
														width: 250,
														display: 'flex',
														justifyContent: 'space-between',
														border: '1px solid grey',
														padding: 5,
														cursor: 'pointer',
														color: paymentMethods?.find(
															(x) => x.system_name === method.system_name
														)
															? 'white'
															: 'grey',
													}}
													onClick={() => {
														const newSelected = [...paymentMethods];

														if (
															newSelected.find(
																(x) => x.system_name === method.system_name
															)
														) {
															setPaymentMethods(
																newSelected.filter(
																	(x) => x.system_name !== method.system_name
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
													) && <div style={{ color: 'white' }}>✔</div>}
												</div>
												{paymentMethods?.find(
													(x) => x.system_name === method.system_name
												) && (
													<div
														onClick={() => {
															setSelectedMethod(method);
															setAddMethodDetails(true);
														}}
														style={{ color: 'white', cursor: 'pointer' }}
													>
														<EditWrapper stringId="P2P.EDIT_UPPERCASE">
															<span style={{ textDecoration: 'underline' }}>
																{STRINGS['P2P.EDIT_UPPERCASE']}
															</span>
														</EditWrapper>
													</div>
												)}
											</div>
										);
									})}
								</div>

								<div style={{ flex: 1 }}>
									<div>
										<EditWrapper stringId="P2P.REGION">
											{STRINGS['P2P.REGION']}
										</EditWrapper>
									</div>
									<div>
										<EditWrapper stringId="P2P.SELECT_REGION">
											{STRINGS['P2P.SELECT_REGION']}
										</EditWrapper>
									</div>
									<Select
										showSearch
										filterOption={(input, option) =>
											option.props.children
												.toLowerCase()
												.indexOf(input.toLowerCase()) >= 0 ||
											option.props.value
												.toLowerCase()
												.indexOf(input.toLowerCase()) >= 0
										}
										style={{ backgroundColor: '#303236', width: 200 }}
										placeholder="Select Region"
										value={region}
										onChange={(e) => {
											setRegion(e);
										}}
									>
										{COUNTRIES_OPTIONS.map((cn) => (
											<Select.Option value={cn.value}>{cn.label}</Select.Option>
										))}
									</Select>
								</div>
							</div>
						</div>
					)}

					{step === 3 && (
						<div
							style={{
								display: 'flex',
								gap: 120,
								marginTop: 40,
								padding: 30,
								border: 'grey 1px solid',
							}}
						>
							<div style={{ flex: 7, display: 'flex' }}>
								<div style={{ flex: 1 }}>
									<div style={{ color: 'white', fontWeight: 'bold' }}>
										<EditWrapper stringId="P2P.TERMS">
											{STRINGS['P2P.TERMS']}
										</EditWrapper>
									</div>
									<div>
										<EditWrapper stringId="P2P.TERMS_CONDITIONS_DEAL">
											{STRINGS['P2P.TERMS_CONDITIONS_DEAL']}
										</EditWrapper>
									</div>

									<Input.TextArea
										rows={4}
										value={terms}
										onChange={(e) => {
											setTerms(e.target.value);
										}}
										placeholder="Please post within 15 minutes of the deal going"
									/>
								</div>
							</div>
							<div style={{ flex: 1, borderLeft: 'grey 1px solid' }}></div>
							<div style={{ flex: 7, display: 'flex' }}>
								<div style={{ flex: 1 }}>
									<div style={{ color: 'white', fontWeight: 'bold' }}>
										<EditWrapper stringId="P2P.FIRST_RESPONSE">
											{STRINGS['P2P.FIRST_RESPONSE']}
										</EditWrapper>
									</div>
									<div>
										<EditWrapper stringId="P2P.CHAT_RESPONSE">
											{STRINGS['P2P.CHAT_RESPONSE']}
										</EditWrapper>
									</div>
									<Input.TextArea
										rows={4}
										value={autoResponse}
										onChange={(e) => {
											setAutoResponse(e.target.value);
										}}
										placeholder="Visit our website"
									/>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			<div
				style={{
					display: 'flex',
					gap: 15,
					justifyContent: 'center',
					alignItems: 'flex-end',
					position: 'relative',
					top: '5%',
				}}
			>
				{step !== 1 && (
					<Button
						style={{
							backgroundColor: '#5E63F6',
							color: 'white',
							width: 200,
							height: 30,
						}}
						onClick={() => {
							if (step > 1) {
								setStep(step - 1);
							}
						}}
					>
						<EditWrapper stringId="P2P.BACK_UPPER">
							{STRINGS['P2P.BACK_UPPER']}
						</EditWrapper>
					</Button>
				)}
				<Button
					style={{
						backgroundColor: '#5E63F6',
						color: 'white',
						width: 200,
						height: 30,
					}}
					onClick={async () => {
						if (
							step === 1 &&
							(!priceType || !buyingAsset || !spendingAsset || !exchangeRate)
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
										side: 'sell',
										price_type: priceType,
										buying_asset: buyingAsset,
										spending_asset: spendingAsset,
										exchange_rate: Number(exchangeRate),
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
										side: 'sell',
										price_type: priceType,
										buying_asset: buyingAsset,
										spending_asset: spendingAsset,
										exchange_rate: Number(exchangeRate),
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

			<Modal
				maskClosable={false}
				closeIcon={<CloseOutlined style={{ color: 'white' }} />}
				bodyStyle={{
					backgroundColor: '#1A1B1E',
					marginTop: 60,
				}}
				visible={addMethodDetails}
				footer={null}
				onCancel={() => {
					setAddMethodDetails(false);
				}}
			>
				<div style={{ marginBottom: 20, fontSize: 17 }}>
					<EditWrapper stringId="P2P.ADD_PAYMENT_METHOD_DETAILS">
						{STRINGS['P2P.ADD_PAYMENT_METHOD_DETAILS']}
					</EditWrapper>
				</div>

				{selectedMethod?.fields?.map((x, index) => {
					return (
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								marginBottom: 10,
							}}
						>
							<div>{x?.name}:</div>
							<Input
								style={{ width: 300 }}
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
							setAddMethodDetails(false);
						}}
						style={{
							backgroundColor: '#5E63F6',
							color: 'white',
							flex: 1,
							height: 35,
						}}
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
						style={{
							backgroundColor: '#5E63F6',
							color: 'white',
							flex: 1,
							height: 35,
						}}
						type="default"
					>
						<EditWrapper stringId="P2P.COMPLETE">
							{STRINGS['P2P.COMPLETE']}
						</EditWrapper>
					</Button>
				</div>
			</Modal>
		</div>
	);
};

const mapStateToProps = (state) => ({
	pairs: state.app.pairs,
	coins: state.app.coins,
	constants: state.app.constants,
	transaction_limits: state.app.transaction_limits,
	p2p_config: state.app.constants.p2p_config,
});

export default connect(mapStateToProps)(withConfig(P2PPostDeal));
