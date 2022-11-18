import React, { useState } from 'react';
import { Select, Input, Button } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import STRINGS from 'config/localizedStrings';

const TradeInputGroup = ({ markets, goToTrade }) => {
	const [market, setMarket] = useState(markets[0]);

	return (
		<Input.Group compact className="d-flex wallet-trade-group caps">
			<Select
				style={{
					width: 100,
				}}
				size="small"
				dropdownClassName="custom-select-style caps"
				options={markets.map((pair) => ({
					value: pair,
					label: pair,
				}))}
				suffixIcon={<CaretDownOutlined />}
				value={market}
				onChange={setMarket}
			/>
			<Button
				ghost
				type="primary"
				size="small"
				className="caps"
				disabled={!market}
				onClick={() => goToTrade(market)}
			>
				{STRINGS['TRADE_TAB_TRADE']}
			</Button>
		</Input.Group>
	);
};

export default TradeInputGroup;
