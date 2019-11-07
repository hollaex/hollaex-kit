import classnames from 'classnames';
import React from 'react';

const BlueLink = ({ text, ...rest }) => (
	<a
		{...rest}
		target="_blank"
		className={classnames('blue-link', 'dialog-link', 'pointer')}
	>
		{text}
	</a>
);

export default BlueLink;