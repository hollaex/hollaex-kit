import React from 'react';
import classnames from 'classnames';
import { FLEX_CENTER_CLASSES } from '../../config/constants';

const getSizeClass = (size) => {
	switch (size) {
		case 'medium':
		case 'm':
			return 'm';
		case 'large':
		case 'big':
		case 'l':
		case 'b':
			return 'l';
		case 'small':
		case 's':
		default:
			return 's';
	}
};

const CurrencyBall = ({ name, symbol, size, className }) => (
	<div
		className={classnames(
			...FLEX_CENTER_CLASSES,
			'currency_ball-wrapper',
			'default-coin',
			symbol,
			getSizeClass(size),
			className
		)}
	>
		{name}
	</div>
);

export default CurrencyBall;
