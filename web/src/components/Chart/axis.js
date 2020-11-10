import React from 'react';

import {
	XAxis as BaseXAxis,
	YAxis as BaseYAxis,
} from 'react-stockcharts/lib/axes';

import { DARK_THEME_COLORS, WHITE_THEME_COLORS } from '../../config/constants';

const TickProps = (theme) => ({
	tickStroke: theme ? TXAxisStrokeColor[theme] : 'black',
	stroke: 'transparent',
});

export const YAxis = ({ height, theme, ...rest }) => {
	const ticks = Math.floor(height / 50);
	const props = {
		ticks,
		...TickProps(theme),
		...rest,
	};

	return <BaseYAxis {...props} />;
};

YAxis.defaultProps = {
	axisAt: 'right',
	orient: 'right',
};

export const XAxis = ({ width, theme, ...rest }) => {
	const ticks = Math.floor(width / 50);
	const props = {
		ticks,
		...TickProps(theme),
		...rest,
	};

	return <BaseXAxis {...props} />;
};

XAxis.defaultProps = {
	axisAt: 'bottom',
	orient: 'bottom',
};

const TXAxisStrokeColor = {
	dark: DARK_THEME_COLORS.sub_text,
	white: WHITE_THEME_COLORS.sub_text,
};

const TXStrokeColor = {
	dark: DARK_THEME_COLORS.border_main,
	white: WHITE_THEME_COLORS.border_main,
};

export const TXAxis = ({ theme, ...rest }) => {
	const props = {
		...rest,
		showTicks: false,
		stroke: theme ? TXStrokeColor[theme] : 'black',
		axisAt: 'top',
		orient: 'top',
	};
	return <XAxis {...props} />;
};
