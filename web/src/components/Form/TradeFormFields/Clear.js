import React from 'react';
import STRINGS from 'config/localizedStrings';

const Clear = (props) => {
	const { onClick } = props;

	return (
		<div className="d-flex justify-content-end mb-0">
			<span className="pointer text-uppercase blue-link" onClick={onClick}>
				{STRINGS['CLEAR']}
			</span>
		</div>
	);
};

export default Clear;
