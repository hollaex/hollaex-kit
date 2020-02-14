import React from 'react';
import { Button, Alert } from 'antd';
import { SelectValue } from './SelectValues';
import { FilterInput, FilterDate } from './FilterInput';

const getFilters = (coinOptions) => [
	{
		label: 'Currency',
		placeholder: 'Currency',
		key: 'currency',
		className: 'adjacent-fields',
		options: coinOptions
	},
	{
		label: 'Status',
		placeholder: 'Status',
		key: 'status',
		className: 'adjacent-fields pl-2',
		options: [
			{ value: 'true', text: 'Confirmed' },
			{ value: 'false', text: 'Pending' },
			{ value: 'dismissed', text: 'Dismissed' }
		]
	}
];

const getStatusValue = (key, params) => {
	if (key === 'status'
		&& params.dismissed !== undefined) {
		return 'dismissed';
	} else {
		return params[key];
	}
};

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
	Object.keys(coins).forEach((data) => {
		coinOptions.push({ value: data, text: data.toUpperCase() });
	});
	const fieldProps = getFilters(coinOptions);
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
				<div className="d-flex f-1"></div>
				<div className="filters-wrapper-filters">
					<div className="d-flex">
						{fieldProps.map(({ key, description, ...rest }, index) => (
							<SelectValue
								key={key}
								defaultValue={getStatusValue(key, params)}
								onSelect={onChange(key)}
								description={description}
								className={'adjacent-fields'}
								{...rest}
							/>
						))}
						
					</div>
					<div className="d-flex">
						<FilterInput
							onChange={onChange('user_id')}
							label={"User id"}
							defaultValue={params.user_id}
							className={'adjacent-fields'}
							placeholder="User id"
						/>
						<FilterInput
							onChange={onChange('transaction_id')}
							label="Transaction id"
							className={'adjacent-fields pl-2'}
							defaultValue={params.transaction_id}
							placeholder="Transaction Id or Payment Id(Bank Id)"
							description="Transaction Id or Payment Id(Bank Id)"
						/>
					</div>
					<FilterInput
						onChange={onChange('address')}
						label=""
						defaultValue={params.address}
						placeholder="Address or TrxId"
						description="Bitcoin/Ethereum address or Bank TrxId"
					/>
					<div className="d-flex">
						<FilterDate
							onChange={onChange('start_date')}
							label={"Start date"}
							defaultValue={params.start_date}
							className={'adjacent-fields mr-2'}
							placeholder="Start date"
						/>
						<FilterDate
							onChange={onChange('end_date')}
							label={"End date"}
							defaultValue={params.end_date}
							className={'adjacent-fields'}
							placeholder="End date"
						/>
					</div>
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
