import React from 'react';
import { Select } from 'antd';

const Option = Select.Option;

export const SelectValue = ({ label, defaultValue, onSelect, options }) => (
	<div className="select-wrapper">
		<div className="select-label">{label}</div>
		<Select
			defaultValue={defaultValue}
			className="select-container"
			onSelect={onSelect}
			placeholder={label}
		>
			<Option value="" key="">
				-----
			</Option>
			{options.map(({ value, text }) => (
				<Option value={value} key={value}>
					{text}
				</Option>
			))}
		</Select>
	</div>
);
