import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Alert } from 'antd';
import { SelectValue } from './SelectValues';
import { FilterInput, FilterDate } from './FilterInput';

const getFilters = (coinOptions) => [
	{
		label: 'Currency',
		placeholder: 'Currency',
		key: 'currency',
		className: 'adjacent-fields',
		options: coinOptions,
	},
	{
		label: 'Status',
		placeholder: 'Status',
		key: 'status',
		className: 'adjacent-fields pl-2',
		options: [
			{ value: 'true', text: 'Confirmed' },
			{ value: 'false', text: 'Pending' },
			{ value: 'dismissed', text: 'Dismissed' },
			{ value: 'rejected', text: 'Rejected' },
		],
	},
];

const getStatusValue = (key, params) => {
	if (
		key === 'status' &&
		params.dismissed !== undefined &&
		params[key] === undefined
	) {
		return 'dismissed';
	} else if (
		key === 'status' &&
		params.rejected !== undefined &&
		params[key] === undefined
	) {
		return 'rejected';
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
	hasChanges,
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
				{/* <div className="d-flex f-1" /> */}
				<div className="filters-wrapper-filters d-flex flex-direction-row">
					{/* <div className="d-flex"> */}
					{fieldProps.map(({ key, description, ...rest }, index) => (
						<SelectValue
							key={key}
							defaultValue={getStatusValue(key, params)}
							onSelect={onChange(key)}
							description={description}
							className={'adjacent-fields pl-2'}
							{...rest}
						/>
					))}
					{/* </div> */}
					{/* <div className="d-flex"> */}
					<FilterInput
						onChange={onChange('user_id')}
						label={'User Id'}
						defaultValue={params.user_id}
						className={'adjacent-fields pl-2'}
						placeholder="User id"
					/>
					<FilterInput
						onChange={onChange('transaction_id')}
						label="Transaction Id"
						className={'adjacent-fields pl-2'}
						defaultValue={params.transaction_id}
						placeholder="Transaction Id or Payment Id"
					/>
					{/* </div> */}
					<FilterInput
						onChange={onChange('address')}
						label="Address"
						defaultValue={params.address}
						placeholder="Address"
						className={'adjacent-fields pl-2'}
					/>
					{/* <div className="d-flex"> */}
					<FilterDate
						onChange={onChange('start_date')}
						label={'Start date'}
						defaultValue={params.start_date}
						className={'adjacent-fields pl-2'}
						placeholder="Start date"
					/>
					<FilterDate
						onChange={onChange('end_date')}
						label={'End date'}
						defaultValue={params.end_date}
						className={'adjacent-fields pl-2'}
						placeholder="End date"
					/>
					{/* </div> */}
				</div>
				<div className="filters-wrapper-buttons pl-2">
					<Button
						onClick={onClick}
						type="primary"
						icon={<SearchOutlined />}
						className="filter-button green-btn"
						disabled={!allowQuery}
					>
						Search
					</Button>
				</div>
			</div>
		</div>
	);
};
