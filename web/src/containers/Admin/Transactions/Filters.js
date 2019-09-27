import React from 'react';
import { Button, Alert } from 'antd';
import { SelectValue } from './SelectValues';
import { FilterInput } from './FilterInput';

const getFilters = (coinOptions) => [
	{
		label: 'Currency',
		placeholder: 'Currency',
		key: 'currency',
		options: coinOptions
	},
	{
		label: 'Type',
		placeholder: 'Type',
		key: 'type',
		options: [
			{ value: 'deposit', text: 'Deposits' },
			{ value: 'withdrawal', text: 'Withdrawals' }
		]
	},
	{
		label: 'Status',
		placeholder: 'Status',
		key: 'status',
		options: [
			{ value: 'true', text: 'Confirmed' },
			{ value: 'false', text: 'Pending' }
		]
	},
	{
		label: 'Dismissed',
		placeholder: 'Dismissed',
		key: 'dismissed',
		options: [{ value: 'true', text: 'Yes' }, { value: 'false', text: 'No' }]
	}
];

export const Filters = ({
	coins,
	onChange,
	params,
	onClick,
	loading,
	fetched,
	hasChanges
}) => {
	const coinOptions = [];
	Object.keys(coins).map((data) => {
		coinOptions.push({ value: data, text: data.toUpperCase() });
	});
	const fieldProps = getFilters(coinOptions);
	console.log('fieldProps', fieldProps);
	const allowQuery = !loading && hasChanges && Object.keys(params).length > 0;
	return (
		<div>
			<Alert
				message="Select some filters to perform a query on the deposits"
				type="info"
				showIcon
				className="filter-alert"
			/>
			{Object.keys(params).length === 0 && (
				<Alert
					message="You have to select at least one filter to perform a query"
					type="warning"
					showIcon
					className="filter-alert"
				/>
			)}
			<div className="filters-wrapper">
				<div className="filters-wrapper-filters">
					{fieldProps.map(({ key, ...rest }) => (
						<SelectValue
							key={key}
							value={params[key]}
							onSelect={onChange(key)}
							{...rest}
						/>
					))}
					<FilterInput
						onChange={onChange('transaction_id')}
						label=""
						defaultValue={params.transaction_id}
						placeholder="Transaction Id"
						description="Transaction Id"
					/>
					<FilterInput
						onChange={onChange('address')}
						label=""
						defaultValue={params.address}
						placeholder="Wallet Address"
						description="Wallet address"
					/>
				</div>
				<div className="filters-wrapper-buttons">
					<Button
						onClick={onClick}
						type="primary"
						icon="search"
						className="filter-button"
						disabled={!allowQuery}
					>
						Query
					</Button>
				</div>
			</div>
		</div>
	);
};
