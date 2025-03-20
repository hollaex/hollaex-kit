import React from 'react';
import classnames from 'classnames';
import FieldWrapper from './FieldWrapper';

const renderIcon = ({ icon = '', label = '' }) => {
	return (
		<div>
			<img className="input_icon" src={icon} alt={label} />
		</div>
	);
};

const InputField = (props) => {
	const {
		input,
		type,
		placeholder,
		meta: { touched, error, active },
		onClick,
		fullWidth = false, // eslint-disable-line
		information,
		notification,
		options,
		hideCheck,
		outlineClassName,
		stringId,
		isEmail,
		emailMsg,
		onCrossClick,
		showCross,
		ishorizontalfield,
		isFocus,
		...rest
	} = props;
	const displayError = touched && error && !active;
	// const displayCheck = !fullWidth && input.value && !displayError && !active;
	return (
		<FieldWrapper {...props}>
			<div style={{ display: 'flex' }}>
				{options && renderIcon(options)}
				<input
					placeholder={placeholder}
					className={classnames('input_field-input', {
						error: displayError,
					})}
					type={type}
					{...input}
					{...rest}
					onFocus={(e) => {
						if (input.onFocus) input.onFocus(e);
					}}
					onBlur={(e) => {
						if (input.onBlur) input.onBlur(e);
					}}
					autoFocus={isFocus}
				/>
			</div>
		</FieldWrapper>
	);
};

export default InputField;
