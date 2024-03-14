import React, { useState } from 'react';
import { connect } from 'react-redux';
import { ReactSVG } from 'react-svg';
import { Button, Steps } from 'antd';
import { IconTitle, EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';
import { Switch, Select, Input } from 'antd';
const P2PPostDeal = ({
	data,
	onClose,
	coins,
	pairs,
	constants = {},
	icons: ICONS,
	transaction_limits,
	tiers = {},
}) => {
	const [step, setStep] = useState(1);

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
				<Steps current={step}>
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
							<Switch />
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
									<div>BUY</div>
									<div>
										<Select
											showSearch
											style={{ backgroundColor: '#303236' }}
											placeholder="USD"
											// value={}
											onChange={(e) => {}}
										>
											<Select.Option value={1}></Select.Option>
										</Select>
									</div>
									<div>Crypto you want to buy</div>
								</div>
								<div style={{ flex: 1 }}>{'>'}</div>
								<div style={{ flex: 1 }}>
									<div>Spend</div>
									<div>
										<Select
											showSearch
											style={{ backgroundColor: '#303236' }}
											placeholder="USD"
											// value={}
											onChange={(e) => {}}
										>
											<Select.Option value={1}></Select.Option>
										</Select>
									</div>
									<div>Fiat currency you want to spend</div>
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
											placeholder="DYNAMIC"
											// value={}
											onChange={(e) => {}}
										>
											<Select.Option value={1}></Select.Option>
										</Select>
									</div>
									<div>MARGIN</div>
									<div>
										<Input />
									</div>
									<div>Price and profit margin to set</div>
								</div>
								<div style={{ flex: 1 }}>{'>'}</div>
								<div style={{ flex: 1 }}>
									<div>USDT UNIT PRICE</div>
									<div style={{ fontSize: 25 }}>$1.05</div>
									<div>Price you'll advertise to buy</div>
								</div>
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
									<div>Total</div>
									<div>USDT you can buy </div>
									<div>
										<Input />
									</div>

									<div style={{ marginTop: 50, marginBottom: 50 }}></div>

									<div>BUY ORDER LIMITS</div>
									<div>Minimum and max USD buy order value</div>
									<div style={{ display: 'flex', gap: 10 }}>
										<div>
											<Input style={{ width: 150 }} />
										</div>
										<div>
											<Input style={{ width: 150 }} />
										</div>
									</div>
								</div>
							</div>
							<div style={{ flex: 1, borderLeft: 'grey 1px solid' }}></div>
							<div style={{ flex: 7, display: 'flex' }}>
								<div style={{ flex: 1 }}>
									<div>PAYMENT METHODS TO SEND FIAT</div>
									<div>Select up to 5 methods for USD</div>

									<div
										style={{
											width: 250,
											display: 'flex',
											justifyContent: 'space-between',
											border: '1px solid grey',
											padding: 5,
										}}
									>
										<div>SWIFT</div>
										<div>X</div>
									</div>
									<div
										style={{
											width: 250,
											display: 'flex',
											justifyContent: 'space-between',
											border: '1px solid grey',
											padding: 5,
										}}
									>
										<div>Bank transfer</div>
										<div>X</div>
									</div>
									<div
										style={{
											width: 250,
											display: 'flex',
											justifyContent: 'space-between',
											border: '1px solid grey',
											padding: 5,
										}}
									>
										<div>Paypal</div>
										<div>X</div>
									</div>
									<div
										style={{
											width: 250,
											display: 'flex',
											justifyContent: 'space-between',
											border: '1px solid grey',
											padding: 5,
										}}
									>
										<div>NETELLER</div>
										<div>X</div>
									</div>
									<div
										style={{
											width: 250,
											display: 'flex',
											justifyContent: 'space-between',
											border: '1px solid grey',
											padding: 5,
										}}
									>
										<div>BBVA</div>
										<div>X</div>
									</div>
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
									<div
										style={{
											width: 300,
											height: 100,
											border: '1px solid grey',
											padding: 10,
										}}
									>
										Please post within 15 minutes of the deal going
									</div>
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
									<div
										style={{
											width: 300,
											height: 100,
											border: '1px solid grey',
											padding: 10,
										}}
									>
										Visit our website
									</div>
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
						setStep(step - 1);
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
					onClick={() => {
						setStep(step + 1);
					}}
				>
					NEXT
				</Button>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	pairs: state.app.pairs,
	coins: state.app.coins,
	constants: state.app.constants,
	transaction_limits: state.app.transaction_limits,
});

export default connect(mapStateToProps)(withConfig(P2PPostDeal));
