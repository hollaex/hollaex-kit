import React from 'react';
import classnames from 'classnames';
import { EditWrapper } from 'components';

const InputField = (props) => {
	const {
		input,
		label,
		meta: { touched, error, active },
		currency,
		initializeEffect = false,
		setRef = () => {},
		...rest
	} = props;
	return (
		<div className="trade_input-wrapper">
			<div className="trade_input-label">
				{typeof label === 'string' ? <EditWrapper>{label}</EditWrapper> : label}
			</div>
			<div
				className={classnames('trade_input-input-wrapper', {
					'initialize-animation': initializeEffect,
				})}
			>
				<input ref={setRef} {...input} {...rest} />
				{currency && (
					<div className="trade_input-input-currency d-flex justify-content-center align-items-center mr-2">
						{currency}
					</div>
				)}
				{touched && !active && error && (
					<div className="warning_text">{error}</div>
				)}
			</div>
		</div>
	);
};

export default InputField;
