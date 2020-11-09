import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';
import { FLEX_CENTER_CLASSES } from '../../config/constants';

const COMMON_CLASSES = [
	'text-uppercase',
	'action_button',
	'pointer',
	...FLEX_CENTER_CLASSES,
];

export const LinkButton = ({ path, text, buttonClassName }) => {
	return (
		<Link to={path} className="d-flex f-1 h-100">
			<div className={classnames(...COMMON_CLASSES, buttonClassName)}>
				{text}
			</div>
		</Link>
	);
};

LinkButton.defaultProps = {
	path: '',
	text: '',
	buttonClassName: '',
};
