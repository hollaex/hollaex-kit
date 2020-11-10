import React from 'react';
import moment from 'moment';
import classname from 'classnames';

import { Input, DatePicker } from 'antd';

const dateFormat = 'YYYY/MM/DD';

const onInputChange = (onChange) => (event) => {
	const value = event.target.value;
	onChange(value.trim());
};

export const FilterInput = ({
	onChange,
	label,
	placeholder,
	description,
	defaultValue,
	className,
}) => (
	<div className={classname('filter-input-wrapper', className)}>
		<div className="filter-input-label">{label}</div>
		<div className="input-container">
			<Input
				defaultValue={defaultValue}
				onChange={onInputChange(onChange)}
				placeholder={placeholder}
			/>
			{description && <div className="input-description">{description}</div>}
		</div>
	</div>
);

const onDateChange = (onChange) => (date) => {
	onChange(date);
};

export const FilterDate = ({
	label,
	placeholder,
	onChange,
	description,
	defaultValue,
	className,
}) => {
	let formProps = {};
	if (defaultValue) {
		formProps.defaultValue = moment(new Date(defaultValue), dateFormat);
	}
	return (
		<div className={classname('filter-input-wrapper', className)}>
			<div className="filter-input-label">{label}</div>
			<div className="input-container">
				<DatePicker
					{...formProps}
					className="filter-date-field"
					onChange={onDateChange(onChange)}
					format={dateFormat}
					placeholder={placeholder}
				/>
				{description && <div className="input-description">{description}</div>}
			</div>
		</div>
	);
};
