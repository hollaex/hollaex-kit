import React from 'react';

import { Input } from 'antd';

const onInputChange = (onChange) => (event) => {
	const value = event.target.value;
	onChange(value.trim());
};

export const FilterInput = ({ onChange, label, placeholder, description }) => (
	<div className="input-wrapper">
		<div className="input-label">{label}</div>
		<div className="input-container">
			<Input onChange={onInputChange(onChange)} placeholder={placeholder} />
			{description && <div className="input-description">{description}</div>}
		</div>
	</div>
);
