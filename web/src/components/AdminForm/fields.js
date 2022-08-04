import React from 'react';
import {
	InputNumber,
	Input,
	DatePicker,
	Select,
	Checkbox,
	Radio,
	Tooltip,
} from 'antd';
import moment from 'moment';
import TextArea from 'antd/lib/input/TextArea';
import classname from 'classnames';
import { CloseCircleOutlined } from '@ant-design/icons';
import './index.css';

const dateFormatDefault = 'YYYY/MM/DD';

export const renderInputField = ({
	input,
	label,
	type,
	meta: { touched, error, warning },
	prefix,
	placeholder,
	className,
	disabled = false,
	isClosable = false,
	closeCallback = () => {},
	description = '',
	isTooltip = false,
	tooltipTitle = '',
	inputDefaultValue,
	currentActiveTab = '',
	fieldsCount = 1,
}) => {
	return (
		<div className={classname('input_field', className)}>
			{label && <label>{label}</label>}
			{description ? <div>{description}</div> : null}
			<div>
				<div className="d-flex align-items-center">
					{isTooltip ? (
						<Tooltip placement="bottom" title={tooltipTitle}>
							<span className="w-100">
								<Input
									placeholder={placeholder}
									prefix={prefix}
									{...input}
									type={type}
									disabled={disabled}
									defaultValue={inputDefaultValue}
								/>
							</span>
						</Tooltip>
					) : (
						<Input
							placeholder={placeholder}
							prefix={prefix}
							{...input}
							type={type}
							disabled={disabled}
						/>
					)}
					{(isClosable && !currentActiveTab) ||
					(isClosable &&
						currentActiveTab &&
						currentActiveTab !== 'offRamp' &&
						fieldsCount !== 1) ? (
						<CloseCircleOutlined
							className="close-icon"
							onClick={closeCallback}
						/>
					) : null}
				</div>
				{touched &&
					((error && <span className="red-text">{error}</span>) ||
						(warning && <span className="red-text">{warning}</span>))}
			</div>
		</div>
	);
};

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
	description = '',
	...rest
}) => (
	<div className="input_field">
		{label && <label>{label}</label>}
		{description ? <div>{description}</div> : null}
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
	placeholder,
	...rest
}) => {
	let value;
	if (inputProps.value) {
		value = inputProps.value || '';
	}
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
					placeholder={placeholder || label}
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
	description = '',
	dateFormat = dateFormatDefault,
	showTime = false,
	clearIcon,
}) => (
	<div className="input_field">
		{label && <label>{label}</label>}
		{description ? <div>{description}</div> : null}
		<div>
			<DatePicker
				defaultValue={input.value ? moment(input.value, dateFormat) : ''}
				onChange={input.onChange}
				format={dateFormat}
				disabled={disabled}
				showTime={showTime}
				placeholder={placeholder}
				value={input.value ? moment(input.value, dateFormat) : ''}
				clearIcon={clearIcon}
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
					moment(input.value[0], dateFormatDefault),
					moment(input.value[1], dateFormatDefault),
				]}
				format={dateFormatDefault}
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

export const renderBooleanField = ({
	input,
	label,
	meta: { touched, error, warning },
	disabled = false,
	description = '',
	isPayment = false,
}) => {
	return (
		<div className="input_field">
			{label && <label>{label}</label>}
			{description ? <div>{description}</div> : null}
			<div className="check_field">
				<Radio.Group {...input} disabled={disabled}>
					<Radio value={true}>
						{isPayment ? (
							<div>
								<div className="mb-2">Required</div>
								<span>(important payment detail)</span>
							</div>
						) : (
							<div>True</div>
						)}
					</Radio>
					<Radio value={false}>
						{isPayment ? (
							<div>
								<div className="mb-2">Optional</div>
								<span>(optional payment detail)</span>
							</div>
						) : (
							<div>False</div>
						)}
					</Radio>
				</Radio.Group>
				{touched &&
					((error && <span className="red-text">{error}</span>) ||
						(warning && <span className="red-text">{warning}</span>))}
			</div>
		</div>
	);
};
