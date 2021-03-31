import { timeFormat } from 'd3-time-format';
import { format } from 'd3-format';
import { isMobile } from 'react-device-detect';

import {
	yAccessor,
	yVolumeAccessor,
	OHLCChildren,
	FORMAT_Y_TICK,
} from './utils';
import {
	DARK_THEME_CHART_COLORS,
	WHITE_THEME_CHART_COLORS,
} from '../../config/constants';

const FONT_SIZE = isMobile ? 10 : 6;

const OHLC_TIME_FORMAT = '%Y-%m-%d %H:%M:%S';

export const COLORS = {
	SELL: 'red',
	BUY: 'green',
	LINE: 'black',
	FILL: 'green',
	AXIS: '#4D4D4D',
	BUY_CANDLE: 'green',
	SELL_CANDLE: '#ed1c24',
	BUY_VOLUME: 'lightgreen',
	SELL_VOLUME: '#ed1c24',
};

export const DARK_COLORS = {
	SELL: '#f69321',
	BUY: '#29abe2',
	LINE: '#b7b7ce',
	FILL: 'orange',
	AXIS: '#b7b7ce',
	BUY_CANDLE: '#29abe2',
	SELL_CANDLE: '#f69321',
	BUY_VOLUME: '#29abe2',
	SELL_VOLUME: '#f69321',
};

const THEME_COLORS = {
	dark: DARK_THEME_CHART_COLORS,
	white: WHITE_THEME_CHART_COLORS,
};

export const fillIndicator = (theme = 'white') => ({ close, open }) =>
	close > open ? THEME_COLORS[theme].BUY : THEME_COLORS[theme].SELL;

const CandleColor = (theme = 'white') => ({ open, close }) =>
	close > open ? THEME_COLORS[theme].BUY : THEME_COLORS[theme].SELL;

const VolumeBarColor = (theme = 'white') => ({ open, close }) =>
	close > open
		? THEME_COLORS[theme].BUY_VOLUME
		: THEME_COLORS[theme].SELL_VOLUME;

export const areaProps = {
	stroke: COLORS.STROKE,
	strokeWidth: 2,
	fill: COLORS.FILL,
	opacity: 1,
	className: '',
	yAccessor,
};

export const edgeIndicatorProps = (theme) => ({
	fill: fillIndicator(theme),
	yAccessor,
	orient: 'right',
	edgeAt: 'right',
	itemType: 'last',
	displayFormat: FORMAT_Y_TICK,
});

const OHLCOrigin = isMobile ? [0, -10] : [0, -25];

export const OHLCProps = {
	origin: OHLCOrigin,
	xDisplayFormat: timeFormat(OHLC_TIME_FORMAT),
	ohlcFormat: FORMAT_Y_TICK,
	volumeFormat: (v) => v,
	children: OHLCChildren,
};

export const CandlesProps = (theme) => ({
	wickStroke: CandleColor(theme),
	fill: CandleColor(theme),
	stroke: CandleColor(theme),
	candleStrokeWidth: 1,
	widthRatio: 0.8,
	opacity: 1,
});

export const CandleChartXAxis = {
	axisAt: 'bottom',
	orient: 'bottom',
	stroke: COLORS.AXIS,
	tickStroke: COLORS.AXIS,
	fontSize: FONT_SIZE,
};

export const CandleChartYAxis = {
	axisAt: 'right',
	orient: 'right',
	stroke: COLORS.AXIS,
	tickStroke: COLORS.AXIS,
	ticks: 5,
	fontSize: FONT_SIZE,
};

export const CandleChartEdgeIndicatorProps = {
	itemType: 'last',
	orient: 'right',
	edgeAt: 'right',
	yAccessor,
	fill: CandleColor,
	fontSize: FONT_SIZE,
};

export const BarSeriesProps = (theme) => ({
	yAccessor: yVolumeAccessor,
	fill: VolumeBarColor(theme),
	stroke: false,
	opacity: 0.5,
});

export const BarSeriesYAxis = {
	axisAt: 'left',
	orient: 'left',
	ticks: 5,
	tickFormat: format('.2s'),
	fontSize: FONT_SIZE,
};

export const BarSeriesChartProps = (height = 150, ratio = 2) => {
	const chartHeight = height / ratio;
	return {
		origin: (w, h) => [0, h - chartHeight],
		height: chartHeight,
		yExtents: yVolumeAccessor,
	};
};
