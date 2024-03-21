import React, { useState } from 'react';
import { connect } from 'react-redux';
import { ReactSVG } from 'react-svg';
import { Button, Steps, message, Modal } from 'antd';
import { IconTitle, EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { Switch, Select, Input } from 'antd';
import { postDeal } from './actions/p2pActions';
import { CloseOutlined } from '@ant-design/icons';
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
}) => {
	const [step, setStep] = useState(1);

	const [priceType, setPriceType] = useState();
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

	const dataSte = [
		{
			title: 'Set the type and price',
		},
		{
			title: 'Set the total amount and payment methods',
		},
		{
			title: 'Set terms and an automated response',
		},
	];
	const { Step } = Steps;
	return (
		<div
			style={{
				height: 600,
				backgroundColor: '#303236',
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
						<span style={{ fontSize: 18 }}>I want to buy</span>
						<span>
							<Switch checked disabled />
						</span>
						<span style={{ fontSize: 18 }}>I want to sell</span>
					</div>

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
							<div style={{ flex: 7, display: 'flex' }}>
								<div style={{ flex: 1 }}>
									<div>SELL</div>
									<div>
										<Select
											showSearch
											style={{ backgroundColor: '#303236' }}
											placeholder="USDT"
											value={buyingAsset}
											onChange={(e) => {
												setBuyingAsset(e);
											}}
										>
											{Object.values(coins || {})
												.filter((coin) => coin.type !== 'fiat')
												.map((coin) => (
													<Select.Option value={coin.symbol}>
														{coin.fullname}
													</Select.Option>
												))}
										</Select>
									</div>
									<div>Crypto you want to sell</div>
								</div>
								<div style={{ flex: 1, fontSize: 20 }}>{'>'}</div>
								<div style={{ flex: 1 }}>
									<div>RECEIVE</div>
									<div>
										<Select
											showSearch
											style={{ backgroundColor: '#303236' }}
											placeholder="USD"
											value={spendingAsset}
											onChange={(e) => {
												setSpendingAsset(e);
											}}
										>
											{Object.values(coins || {})
												.filter((coin) => coin.type === 'fiat')
												.map((coin) => (
													<Select.Option value={coin.symbol}>
														{coin.fullname}
													</Select.Option>
												))}
										</Select>
									</div>
									<div>Fiat currency you want to receive</div>
								</div>
							</div>
							<div style={{ flex: 1, borderLeft: 'grey 1px solid' }}></div>
							<div style={{ flex: 7, display: 'flex' }}>
								<div style={{ flex: 1 }}>
									<div>PRICE</div>
									<div>
										<Select
											showSearch
											style={{ backgroundColor: '#303236' }}
											placeholder="STATIC"
											value={priceType}
											onChange={(e) => {
												setPriceType(e);
											}}
										>
											<Select.Option value={'static'}>Static</Select.Option>
											<Select.Option value={'dynamic'}>Dynamic</Select.Option>
										</Select>
									</div>

									{priceType === 'static' && (
										<>
											<div style={{ marginTop: 10 }}>Fixed Price</div>
											<div>
												<Input
													value={exchangeRate}
													onChange={(e) => {
														setExchangeRate(e.target.value);
													}}
												/>
											</div>
										</>
									)}
									<div style={{ marginTop: 10 }}>SPREAD (%)</div>
									<div>
										<Input
											value={spread}
											onChange={(e) => {
												setSpread(e.target.value);
											}}
										/>
									</div>
									<div>Price and profit spread to set</div>
								</div>
								<div style={{ flex: 1, fontSize: 20 }}>{'>'}</div>

								{exchangeRate && (
									<div style={{ flex: 1 }}>
										<div>{spendingAsset.toUpperCase()} UNIT PRICE</div>
										<div style={{ fontSize: 25 }}>
											{exchangeRate * (1 + Number(spread || 0))}
										</div>
										<div>Price you'll advertise to sell</div>
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
									<div>Total {buyingAsset?.toUpperCase()} you can sell</div>
									<div>
										<Input
											value={totalOrderAmount}
											onChange={(e) => {
												setTotalOrderAmount(e.target.value);
											}}
										/>
									</div>

									<div style={{ marginTop: 50, marginBottom: 50 }}></div>

									<div>BUY ORDER LIMITS</div>
									<div>
										Minimum and max {spendingAsset?.toUpperCase()} buy order
										value in {spendingAsset?.toUpperCase()}
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
							<div style={{ flex: 7, display: 'flex' }}>
								<div style={{ flex: 1 }}>
									<div>PAYMENT METHODS TO SEND FIAT</div>
									<div>
										Select up to {p2p_config?.bank_payment_methods?.length || 0}{' '}
										methods for {spendingAsset?.toUpperCase()}
									</div>

									{p2p_config?.bank_payment_methods?.map((method) => {
										return (
											<div
												style={{
													width: 250,
													display: 'flex',
													justifyContent: 'space-between',
													border: '1px solid grey',
													padding: 5,
													cursor: 'pointer',
													fontWeight: paymentMethods?.find(
														(x) => x.system_name === method.system_name
													)
														? 'bold'
														: '300',
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
												<div>X</div>
											</div>
										);
									})}
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
										TERMS
									</div>
									<div>Terms and conditions for this deal </div>

									<Input.TextArea
										rows={4}
										value={terms}
										onChange={(e) => {
											setTerms(e.target.value);
										}}
										placeholder="Please post within 15 minutes of the deal going"
									/>
									{/* 									
									<div
										style={{
											width: 300,
											height: 100,
											border: '1px solid grey',
											padding: 10,
										}}
									>
										Please post within 15 minutes of the deal going
									</div> */}
								</div>
							</div>
							<div style={{ flex: 1, borderLeft: 'grey 1px solid' }}></div>
							<div style={{ flex: 7, display: 'flex' }}>
								<div style={{ flex: 1 }}>
									<div style={{ color: 'white', fontWeight: 'bold' }}>
										FIRST RESPONSE
									</div>
									<div>
										Chat response that you rcounter part will see upon entering
										the P2P deal room
									</div>
									<Input.TextArea
										rows={4}
										value={autoResponse}
										onChange={(e) => {
											setAutoResponse(e.target.value);
										}}
										placeholder="Visit our website"
									/>
									{/* <div
										style={{
											width: 300,
											height: 100,
											border: '1px solid grey',
											padding: 10,
										}}
									>
										Visit our website
									</div> */}
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
					position: 'absolute',
					top: 760,
					left: 350,
				}}
			>
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
					BACK
				</Button>
				<Button
					style={{
						backgroundColor: '#5E63F6',
						color: 'white',
						width: 200,
						height: 30,
					}}
					onClick={async () => {
						if (step < 3) {
							setStep(step + 1);
						} else {
							try {
								await postDeal({
									side: 'sell',
									price_type: priceType,
									buying_asset: buyingAsset,
									spending_asset: spendingAsset,
									exchange_rate: exchangeRate,
									spread: spread,
									total_order_amount: totalOrderAmount,
									min_order_value: minOrderValue,
									max_order_value: maxOrderValue,
									terms: terms,
									auto_response: autoResponse,
									payment_methods: paymentMethods,
								});

								setPriceType();
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
								setStep(1);

								message.success('Deal has been created');
								setTab('4');
								setRefresh(!refresh);
							} catch (error) {
								message.error(error.data.message);
							}
						}
					}}
				>
					NEXT
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
					Add Payment Method Details
				</div>

				{selectedMethod?.fields?.map((x, index) => {
					return (
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
						Back
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
						Complete
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
