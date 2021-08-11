import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Alert } from 'antd';
// import { SelectValue } from '../Transactions/SelectValues';
import { FilterInput } from '../Transactions/FilterInput';

export const Filters = ({
	coins,
	onChange,
	params,
	onClick,
	loading,
	fetched,
	hasChanges,
}) => {
	// const coinOptions = [];
	// Object.keys(coins).forEach((data) => {
	// 	coinOptions.push({ value: data, text: data.toUpperCase() });
	// });
	// const fieldProps = getFilters(coinOptions);
	// const allowQuery = !loading && hasChanges && Object.keys(params).length > 0;
	return (
		<div>
			<Alert
				message="Select some filters"
				type="info"
				showIcon
				className="filter-alert"
			/>
			{/* {Object.keys(params).length === 0 && (
				<Alert
					message="You have to select at least one filter to perform a query"
					type="warning"
					showIcon
					className="filter-alert"
				/>
			)} */}
			<div className="filters-wrapper admin-deposit-wrapper">
				<div className="filters-wrapper-filters  d-flex flex-row">
					{/* {fieldProps.map(({ key, ...rest }) => (
						<SelectValue
							key={key}
							value={params[key]}
							onSelect={onChange(key)}
							className={'adjacent-fields pl-2'}
							{...rest}	
						/>
					))} */}
					<FilterInput
						onChange={() => { }}
						// label="Transaction Id"
						// defaultValue={params.transaction_id}
						placeholder="input name or symbol"
						// description="Transaction Id"
						className={'pl-2'}
					/>
				</div>
				<div className="filters-wrapper-buttons pl-2">
					<Button
						onClick={onClick}
						type="primary"
						icon={<SearchOutlined />}
						className="filter-button green-btn"
						// disabled={!allowQuery}
					>
						Search
					</Button>
				</div>
			</div>
		</div>
	);
};
