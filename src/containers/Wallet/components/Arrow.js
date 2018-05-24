import React from 'react';

const Arrow = ({ onClick, label }) => (
	<div className="d-flex justify-content-center align-items-center f-1 arrow">
		<div onClick={onClick} className="previous-arrow">
			{label}
		</div>
	</div>
);

export default Arrow;