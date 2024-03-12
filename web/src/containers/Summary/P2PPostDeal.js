import React from 'react';
import { connect } from 'react-redux';
import { ReactSVG } from 'react-svg';
import { Steps } from 'antd';
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
			<div>kasdjksaj</div>

			<div>
				<Steps current={2}>
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
				</div>
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
