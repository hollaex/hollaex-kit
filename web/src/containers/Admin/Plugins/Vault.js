import React from 'react';
import { Tag, Button, Tabs } from 'antd';
import BlockchainTransaction from '../BlockchainTransaction';

const TabPane = Tabs.TabPane;

const VaultForm = ({
	coins = {},
	initialValues,
	supportedCoins,
	connectCoinToVault,
}) => {
	return (
		<div className="app_container-content">
			<Tabs>
				<TabPane tab={'Coins'} key={'coins'}>
					<div className="mb-4">
						{Object.keys(coins).map((coin, index) => {
							let status = initialValues.connected_coins.includes(coin) ? (
								<Tag color="green">Connected</Tag>
							) : supportedCoins.includes(coin) ? (
								<Button
									type="primary"
									size="small"
									onClick={() => connectCoinToVault(initialValues, coin)}
								>
									Connect
								</Button>
							) : (
								<Tag color="red">Not supported</Tag>
							);
							return (
								<div key={index} className="d-flex">
									<p className="w-25">{coin.toUpperCase()}:</p>
									<p>{status}</p>
								</div>
							);
						})}
					</div>
				</TabPane>
				<TabPane tab={'Check Transaction Status'} key={'transaction status'}>
					<BlockchainTransaction />
				</TabPane>
			</Tabs>
		</div>
	);
};

export default VaultForm;
