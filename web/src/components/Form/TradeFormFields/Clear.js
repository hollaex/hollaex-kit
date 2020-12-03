import React from 'react';

const Clear = (props) => {
	const { onClick } = props;

	return (
		<div className="d-flex justify-content-end">
			<span className="pointer text-uppercase blue-link" onClick={onClick}>
				clear
			</span>
		</div>
	);
};

export default Clear;
