import React from 'react';
import classnames from 'classnames';

const Arrow = ({ onClick, className }) => (
	<div
		className={classnames('justify-content-center', 'f-1', 'arrow', className)}
		onClick={onClick}
	/>
);

export default Arrow;
