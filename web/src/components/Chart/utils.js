import React from 'react';
import classnames from 'classnames';
import { timeFormat } from 'd3-time-format';
import { format } from 'd3-format';
import moment from 'moment';
import { discontinuousTimeScaleProvider } from 'react-stockcharts/lib/scale';
import { last } from 'react-stockcharts/lib/utils';
import { isMobile } from 'react-device-detect';

export const X_GAP = 1;
export const Y_GAP = 10;

export const inputDateAccessor = ({ date }) => new Date(date);

export const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
	inputDateAccessor
);

const DesktopMargins = { left: 0, right: 75, top: 35, bottom: 30 };
const MobileMargins = { left: 0, right: 50, top: 15, bottom: 25 };
export const margins = isMobile ? MobileMargins : DesktopMargins;

export const yExtents = (modifier = 1) => (data) => {
	return [data.high + Y_GAP * modifier, data.low - Y_GAP * modifier];
};

export const generateXExtents = (xAccessor, data, limit = 50) => {
	const start = xAccessor(last(data));
	const end = xAccessor(data[Math.max(0, data.length - limit)]);
	const xExtents = [start, end];
	return xExtents;
};

const LabelData = ({ label, value = '-' }) => (
	<tspan className={classnames('ohlc_data_wrapper')}>
		<tspan className={classnames('ohlc_label')}>{label}: </tspan>
		<tspan className={classnames('ohlc_value')}>{value} </tspan>
	</tspan>
);

export const OHLCChildren = (props, moreProps, itemsToDisplay) => {
	const {
		displayTexts: { o, h, l, c, v },
		className,
	} = props;
	const { open, high, low, close, volume, x, y } = itemsToDisplay;
	return (
		<g className={classnames(className)} transform={`translate(${x}, ${y})`}>
			<text className={classnames('ohlc_wrapper')}>
				<LabelData label={o} value={open} />
				<LabelData label={h} value={high} />
				<LabelData label={l} value={low} />
				<LabelData label={c} value={close} />
				<LabelData label={v} value={volume} />
			</text>
		</g>
	);
};

export const tickFormat = timeFormat('%b %e');

export const FORMAT_DATE_X_TICK = timeFormat('%m/%d %H:%m %p');
export const FORMAT_Y_TICK = format(',.0d');

export const XAxisTickFormat = (date) => {
	const endPeriod = moment(date).add({ hours: 1 }).toDate();
	return `${FORMAT_DATE_X_TICK(date)} - ${FORMAT_DATE_X_TICK(endPeriod)}`;
};
export const yAccessor = ({ close }) => close;
export const yVolumeAccessor = ({ volume }) => volume;
