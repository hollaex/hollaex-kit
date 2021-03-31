import React from 'react';
import classnames from 'classnames';
import FieldWrapper from './FieldWrapper';

const TextAreaField = (props) => {
	const {
		input,
		type,
		placeholder,
		meta: { touched, error, active },
		onClick,
		fullWidth = false, // eslint-disable-line
		information,
		notification,
		rows,
		...rest
	} = props;
	const displayError = touched && error && !active;
	// const displayCheck = !fullWidth && input.value && !displayError && !active;
	return (
		<FieldWrapper {...props}>
			<textarea
				rows={rows ? rows : '1'}
				placeholder={placeholder}
				className={classnames('input_field-input', {
					error: displayError,
				})}
				type={type}
				{...input}
				{...rest}
			/>
		</FieldWrapper>
	);
};

export default TextAreaField;
