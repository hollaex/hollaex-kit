import React from 'react';
import { connect } from 'react-redux';
import { ReactSVG } from 'react-svg';
import { Switch } from 'antd';
import { IconTitle, EditWrapper } from 'components';
import STRINGS from 'config/localizedStrings';
import { Button, Select, Input } from 'antd';

import withConfig from 'components/ConfigProvider/withConfig';
const P2PDash = ({
	data,
	onClose,
	coins,
	pairs,
	constants = {},
	icons: ICONS,
	transaction_limits,
	tiers = {},
}) => {
	return (
		<div
			className="fee-limits-wrapper"
			style={{
				height: 800,
				backgroundColor: '#303236',
				width: '100%',
				padding: 20,
			}}
		>
			<div
				style={{
					textAlign: 'center',
					display: 'flex',
					gap: 10,
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<span>I want to buy</span>
				<span>
					<Switch />
				</span>
				<span>I want to sell</span>
			</div>
			<div
				style={{
					textAlign: 'center',
					display: 'flex',
					gap: 10,
					marginTop: 25,
					marginBottom: 25,
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<span style={{ fontWeight: 'bold' }}>Crypto</span>
				<Button ghost>BTC</Button>
				<Button ghost>XHT</Button>
				<Button ghost>USDT</Button>
				<Button ghost>ETH</Button>
			</div>

			<div
				style={{
					textAlign: 'center',
					display: 'flex',
					gap: 10,
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<div style={{ display: 'flex', gap: 10 }}>
					<span>Spend Fiat currency</span>
					<span>
						<Select
							showSearch
							style={{ backgroundColor: '#303236' }}
							placeholder="USD"
							// value={}
							onChange={(e) => {}}
						>
							<Select.Option value={1}></Select.Option>
						</Select>
					</span>
				</div>
				<div style={{ display: 'flex', gap: 10 }}>
					<span>Amount</span>
					<span>
						<Input placeholder="Input spend amount" />
					</span>
				</div>

				<div style={{ display: 'flex', gap: 10 }}>
					<span>Payment Method</span>
					<span>
						<Select
							showSearch
							style={{ backgroundColor: '#303236' }}
							placeholder="All payment methods"
							// value={}
							onChange={(e) => {}}
						>
							<Select.Option value={1}></Select.Option>
						</Select>
					</span>
				</div>

				<div style={{ display: 'flex', gap: 10 }}>
					<span>Available Regions</span>
					<span>
						<Select
							showSearch
							style={{ backgroundColor: '#303236' }}
							placeholder="All Region"
							// value={}
							onChange={(e) => {}}
						>
							<Select.Option value={1}></Select.Option>
						</Select>
					</span>
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

export default connect(mapStateToProps)(withConfig(P2PDash));
