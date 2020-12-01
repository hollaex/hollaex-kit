import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const ORDER_OPTIONS = [
	{
		label: 'Regular',
		value: 'regular',
	},
	{
		label: 'Stops',
		value: 'stops',
	},
];

const DropDown = () => {
	return (
		<div className="trade-form-select">
			<Select
				defaultValue={ORDER_OPTIONS[0].value}
				showArrow={false}
				bordered={false}
				size="small"
			>
				{ORDER_OPTIONS.map(({ value, label }, index) => (
					<Option
						name="selectedPairBase"
						value={value}
						key={index}
						className="d-flex"
					>
						{label}
					</Option>
				))}
			</Select>
		</div>
	);
};

export default DropDown;
