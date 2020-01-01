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
		checkLabel,
		checkControlCallback,
		...rest
	} = props;
	const displayError = touched && error && !active;
	const [ disableField, setDisableField ] = useState(true);

	// const displayCheck = !fullWidth && input.value && !displayError && !active;
	return (
		<div className={classnames({"d-flex": checkControl })}>
			{checkControl
				? <FieldWrapper
					className="custom-field-width mr-2"
					hideCheck={true}
					hideUnderline={true}
					fullWidth={true}
					>
					<div className={'d-flex align-items-center'}>
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
						<span>
							{checkLabel}
						</span>
					</div>
				</FieldWrapper>
				: null
			}
			<FieldWrapper {...props}>
				<div style={{display: 'flex'}}>
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
		</div>
	);
};

export default InputField;
