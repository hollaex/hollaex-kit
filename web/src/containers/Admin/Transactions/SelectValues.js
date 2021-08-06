import React from 'react';
import { Select } from 'antd';
import classname from 'classnames';

const Option = Select.Option;

export const SelectValue = ({
	label,
	defaultValue,
	onSelect,
	options,
	className,
}) => (
	<div className={classname('filter-select-wrapper', className)}>
		<div className="filter-select-label">{label}</div>
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
