import classnames from 'classnames';
import React from 'react';

const BlueLink = ({ text, disabled = false, ...rest }) => (
	<a
		{...rest}
		target="_blank"
		disabled={disabled}
		className={classnames('blue-link', 'dialog-link', 'pointer')}
	>
		{text}
	</a>
);

export default BlueLink;
