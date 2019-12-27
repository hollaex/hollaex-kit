import React, { useState } from 'react';
import classnames from 'classnames';
import FieldWrapper from './FieldWrapper';

const renderIcon = ({ icon = '', label = '' }) => {
	return <div>
		<img className="input_icon" src={icon} alt={label} />
	</div>
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
		checkControl = false,
		checkControlCallback,
		...rest
	} = props;
	const displayError = touched && error && !active;
	const [ disableField, setDisableField ] = useState(true);

	// const displayCheck = !fullWidth && input.value && !displayError && !active;
	return (
		<FieldWrapper {...props}>
			<div style={{display: 'flex'}}>
				{checkControl
					? <div className={'d-flex align-items-center mr-2'}>
						<input
							type="checkbox"
							name="checkControl"
							className="checkfield-input"
							checked={disableField}
							disabled={rest.disabled}
							onChange={(e) => {
								checkControlCallback(e.target.checked)
								setDisableField(e.target.checked);
							}} />
					</div>
					: null
				}
				{options && renderIcon(options)}
				<input
					placeholder={placeholder}
					className={classnames('input_field-input', {
						error: displayError
					})}
					type={type}
					disabled={!disableField}
					{...input}
					{...rest}
				/>
			</div>
		</FieldWrapper>
	);
};

export default InputField;
