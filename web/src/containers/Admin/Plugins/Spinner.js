import React from 'react';
import { STATIC_ICONS } from 'config/icons';

const Spinner = () => {
	return (
		<div className="spinner-container">
			<img src={STATIC_ICONS.SPINNER} alt="spinner" />
			<div className="ml-2">Processing. Please wait...</div>
		</div>
	);
};

export default Spinner;
