import React from 'react';
import { Tag, Button } from 'antd';

import { AdminHocForm } from '../../../components';

const Form = AdminHocForm('PLUGINS_FORM', 'plugins-form');

const PluginServiceForm = ({
	coins = {},
	initialValues,
	services,
	fields,
	handleSubmitPlugins,
	supportedCoins,
	connectCoinToVault
}) => {
	if (services === 'vault'
		&& initialValues.connected_coins
		&& initialValues.connected_coins.length) {
		return (
			<div className="mb-4">
				{Object.keys(coins).map((coin, index) => {
					let status = initialValues.connected_coins.includes(coin)
						? <Tag color="green">Connected</Tag>
						: supportedCoins.includes(coin)
							? <Button
								type="primary"
								size="small"
								onClick={() => connectCoinToVault(initialValues, coin)}
							>
								Connect
							</Button>
							: <Tag color="red">Not supported</Tag>;
					return (
						<div key={index} className="d-flex">
							<p className="w-25">{coin.toUpperCase()}:</p>
							<p>
								{status}
							</p>
						</div>
					)}
				)}
			</div>
		);
	}
	return (
		<div className="mb-4">
			<Form
				initialValues={initialValues}
				onSubmit={(formProps) => {
					handleSubmitPlugins(formProps, services);
				}}
				buttonText={services === 'vault' ? 'Connect' : 'Save'}
				fields={fields}
			/>
		</div>
	);
};

export default PluginServiceForm;
