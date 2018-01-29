import React from 'react';

import {
	XAxis as BaseXAxis,
	YAxis as BaseYAxis
} from 'react-stockcharts/lib/axes';

export const YAxis = ({ height, ...rest }) => {
	const ticks = Math.floor(height / 50);
	const props = {
		ticks,
		stroke: 'transparent',
		...rest
	};

	return <BaseYAxis {...props} />;
};

YAxis.defaultProps = {
	axisAt: 'right',
	orient: 'right'
};

export const XAxis = ({ width, ...rest }) => {
	const ticks = Math.floor(width / 50);
	const props = {
		ticks,
		stroke: 'transparent',
		...rest
	};

	return <BaseXAxis {...props} />;
};

XAxis.defaultProps = {
	axisAt: 'bottom',
	orient: 'bottom'
};

export const TXAxis = ({ ...rest }) => {
	const props = {
		...rest,
		showTicks: false,
		stroke: 'black',
		axisAt: 'top',
		orient: 'top'
	};

	return <XAxis {...props} />;
};
