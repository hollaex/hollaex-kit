import { timeFormat } from 'd3-time-format';
import { format } from 'd3-format';

import { yAccessor, OHLCChildren, FORMAT_Y_TICK } from './utils';

const OHLC_TIME_FORMAT = '%Y-%m-%d %H:%M:%S';

export const COLORS = {
	SELL: 'red',
	BUY: 'blue',
	LINE: 'black',
	FILL: 'orange',
	AXIS: '#4D4D4D',
	BUY_CANDLE: 'blue',
	SELL_CANDLE: '#f7941e'
};

export const DARK_COLORS = {
	SELL: '#f69321',
	BUY: '#29abe2',
	LINE: '#b7b7ce',
	FILL: 'orange',
	AXIS: '#b7b7ce',
	BUY_CANDLE: '#29abe2',
	SELL_CANDLE: '#f69321'
};

export const fillIndicator = ({ close, open }) =>
	close > open ? COLORS.BUY : COLORS.SELL;

const CandleColor = ({ open, close }) =>
	close > open ? COLORS.BUY_CANDLE : COLORS.SELL_CANDLE;

export const areaProps = {
	stroke: COLORS.STROKE,
	strokeWidth: 2,
	fill: COLORS.FILL,
	opacity: 1,
	className: '',
	yAccessor
};

export const edgeIndicatorProps = {
	fill: fillIndicator,
	yAccessor,
	orient: 'right',
	edgeAt: 'right',
	itemType: 'last',
	displayFormat: FORMAT_Y_TICK
};

export const OHLCProps = {
	origin: [0, -25],
	xDisplayFormat: timeFormat(OHLC_TIME_FORMAT),
	ohlcFormat: FORMAT_Y_TICK,
	children: OHLCChildren
};

export const CandlesProps = {
	wickStroke: CandleColor,
	fill: CandleColor,
	stroke: CandleColor,
	candleStrokeWidth: 1,
	widthRatio: 0.8,
	opacity: 1
};

export const CandleChartXAxis = {
	axisAt: 'bottom',
	orient: 'bottom',
	stroke: COLORS.AXIS,
	tickStroke: COLORS.AXIS,
	fontSize: 10
};

export const CandleChartYAxis = {
	axisAt: 'right',
	orient: 'right',
	stroke: COLORS.AXIS,
	tickStroke: COLORS.AXIS,
	ticks: 5,
	fontSize: 10
};

export const CandleChartEdgeIndicatorProps = {
	itemType: 'last',
	orient: 'right',
	edgeAt: 'right',
	yAccessor,
	fill: CandleColor,
	fontSize: 10
};

export const BarSeriesProps = {
	yAccessor,
	fill: CandleColor,
	opacity: 0.5
};

export const BarSeriesYAxis = {
	axisAt: 'left',
	orient: 'left',
	ticks: 5,
	tickFormat: format('.2s'),
	fontSize: 10
};

export const BarSeriesChartProps = (height = 150, ratio = 2) => {
	const chartHeight = height / ratio;
	return {
		origin: (w, h) => [0, h - chartHeight],
		height: chartHeight,
		yExtents: ({ volume }) => volume
	};
};
