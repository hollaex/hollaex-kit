import React from 'react';
import { Input } from 'antd';
import classname from 'classnames';

const onInputChange = (onChange) => (event) => {
	const value = event.target.value;
	onChange(value.trim());
};

export const FilterInput = ({
	onChange,
	label,
	placeholder,
	description,
	className,
}) => (
	<div className={classname('filter-input-wrapper', className)}>
		<div className="filter-input-label">{label}</div>
		<div className="input-container">
			<Input onChange={onInputChange(onChange)} placeholder={placeholder} />
			{description && <div className="input-description">{description}</div>}
		</div>
	</div>
);
