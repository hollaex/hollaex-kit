import React from 'react';
import { Select } from 'antd';
import classname from 'classnames';

const Option = Select.Option;

export const SelectValue = ({
	label,
	defaultValue,
	onSelect,
	options,
	description,
	className,
}) => (
	<div className={classname('filter-select-wrapper', className)}>
		<div className="filter-select-label">{label}</div>
		<div className="input-container">
			<Select
				defaultValue={defaultValue}
				className="select-container filter-date-field"
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
			{description && <div className="input-description">{description}</div>}
		</div>
	</div>
);
