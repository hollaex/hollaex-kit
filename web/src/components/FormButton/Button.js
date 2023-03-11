import React from 'react';
import { Button } from 'antd';

const FormButton = ({
	type = 'primary',
	handleSubmit = () => {},
	disabled = true,
	size,
	className = '',
	style = null,
	buttonText = '',
	htmlType = '',
	secondaryClassName = '',
}) => {
	return (
		<div className={secondaryClassName}>
			<Button
				type={type}
				onClick={handleSubmit}
				disabled={disabled}
				size={size}
				className={className}
				style={style}
				htmlType={htmlType}
			>
				{buttonText}
			</Button>
		</div>
	);
};

export default FormButton;
