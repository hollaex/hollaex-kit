import React from 'react';
import { InputNumber, Input, DatePicker, Select, Checkbox } from 'antd';
import moment from 'moment';
import TextArea from 'antd/lib/input/TextArea';
import classname from 'classnames';
import './index.css';

const dateFormat = 'YYYY/MM/DD';

export const renderInputField = ({
	input,
	label,
	type,
	meta: { touched, error, warning },
	prefix,
	placeholder,
	className,
	disabled = false,
}) => (
	<div className={classname('input_field', className)}>
		{label && <label>{label}</label>}
		<div>
			<Input
				placeholder={placeholder}
				prefix={prefix}
				{...input}
				type={type}
				disabled={disabled}
			/>
			{touched &&
				((error && <span className="red-text">{error}</span>) ||
					(warning && <span className="red-text">{warning}</span>))}
		</div>
	</div>
);

export const renderTextAreaField = ({
	input,
	label,
	type,
	meta: { touched, error, warning },
	prefix,
	placeholder,
	disabled = false,
}) => (
	<div className="input_field">
		{label && <label>{label}</label>}
		<div>
			<TextArea
				rows={3}
				placeholder={placeholder}
				prefix={prefix}
				{...input}
				type={type}
				disabled={disabled}
			/>
			{touched &&
				((error && <span className="red-text">{error}</span>) ||
					(warning && <span className="red-text">{warning}</span>))}
		</div>
	</div>
);

export const renderNumberField = ({
	input,
	label,
	meta: { touched, error, warning },
	...rest
}) => (
	<div className="input_field">
		{label && <label>{label}</label>}
		<div>
			<InputNumber {...rest} {...input} />
			{touched &&
				((error && <span className="red-text">{error}</span>) ||
					(warning && <span className="red-text">{warning}</span>))}
		</div>
	</div>
);

const renderDefaultOptions = (options) =>
	options.map((option, index) => {
		let value = !option.value && option.value !== '' ? option : option.value;
		return (
			<Select.Option value={value} key={index}>
				{option.label || option}
			</Select.Option>
		);
	});

export const renderSelectField = ({
	input: { onBlur, ...inputProps },
	options = [],
	label,
	meta: { touched, error, warning },
	disabled = false,
	multiSelect = false,
	renderOptions = renderDefaultOptions,
	...rest
}) => {
	let value = inputProps.value || '';
	if (
		(multiSelect || rest.mode === 'tags') &&
		typeof inputProps.value === 'string'
	) {
		value = inputProps.value ? inputProps.value.split(',') : [];
	}
	return (
		<div className="input_field">
			{label && <label>{label}</label>}
			<div>
				<Select
					mode={multiSelect ? 'multiple' : 'default'}
					{...inputProps}
					value={value}
					placeholder={label}
					disabled={disabled}
					{...rest}
				>
					{renderOptions(options)}
				</Select>
				{touched &&
					((error && <span className="red-text">{error}</span>) ||
						(warning && <span className="red-text">{warning}</span>))}
			</div>
		</div>
	);
};

export const renderDateField = ({
	input,
	label,
	placeholder,
	meta: { touched, error, warning },
	disabled = false,
}) => (
	<div className="input_field">
		{label && <label>{label}</label>}
		<div>
			<DatePicker
				defaultValue={moment(input.value || new Date(), dateFormat)}
				onChange={input.onChange}
				format={dateFormat}
				disabled={disabled}
				placeholder={placeholder}
				value={moment(input.value || new Date(), dateFormat)}
			/>
			{touched &&
				((error && <span className="red-text">{error}</span>) ||
					(warning && <span className="red-text">{warning}</span>))}
		</div>
	</div>
);

export const renderRangeField = ({
	input,
	label,
	meta: { touched, error, warning },
	disabled = false,
}) => (
	<div className="input_field">
		{label && <label>{label}</label>}
		<div>
			<DatePicker.RangePicker
				onChange={input.onChange}
				disabled={disabled}
				defaultValue={[
					moment(input.value[0], dateFormat),
					moment(input.value[1], dateFormat),
				]}
				format={dateFormat}
			/>
			{touched &&
				((error && <span className="red-text">{error}</span>) ||
					(warning && <span className="red-text">{warning}</span>))}
		</div>
	</div>
);

export const renderCheckField = ({
	input,
	label,
	meta: { touched, error, warning },
	disabled = false,
}) => (
	<div className="input_field">
		<div className="check_field">
			<Checkbox {...input} disabled={disabled}>
				{label}
			</Checkbox>
			{touched &&
				((error && <span className="red-text">{error}</span>) ||
					(warning && <span className="red-text">{warning}</span>))}
		</div>
	</div>
);
