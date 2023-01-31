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
		meta: { error, active, visited, invalid, dirty },
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
		...rest
	} = props;
	const displayError = (dirty || (visited && invalid)) && error && !active;
	// const displayCheck = !fullWidth && input.value && !displayError && !active;
	const inputProps = { ...props, displayError };
	return (
		<FieldWrapper {...inputProps}>
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
					onBlur={() => {}}
				/>
			</div>
		</FieldWrapper>
	);
};

export default InputField;
