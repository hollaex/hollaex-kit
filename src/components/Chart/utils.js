import React from 'react';
import classnames from 'classnames';
import { timeFormat } from 'd3-time-format';
import { format } from 'd3-format';
import moment from 'moment';
import { discontinuousTimeScaleProvider } from 'react-stockcharts/lib/scale';
import { last } from 'react-stockcharts/lib/utils';

export const X_GAP = 1;
export const Y_GAP = 10;

export const inputDateAccessor = ({ date }) => new Date(date);

export const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
	inputDateAccessor
);

export const margins = { left: 0, right: 75, top: 35, bottom: 30 };

export const yExtents = (data) => {
	return [data.high + Y_GAP, data.low - Y_GAP];
};

export const generateXExtents = (xAccessor, data) => {
	const start = xAccessor(last(data));
	const end = xAccessor(data[Math.max(0, data.length - 150)]);
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
	const { displayTexts: { o, h, l, c }, className } = props;
	const { open, high, low, close, x, y } = itemsToDisplay;
	return (
		<g className={classnames(className)} transform={`translate(${x}, ${y})`}>
			<text className={classnames('ohlc_wrapper')}>
				<LabelData label={o} value={open} />
				<LabelData label={h} value={high} />
				<LabelData label={l} value={low} />
				<LabelData label={c} value={close} />
			</text>
		</g>
	);
};

export const tickFormat = timeFormat('%b %e');

export const FORMAT_DATE_X_TICK = timeFormat('%m/%d %H:%m %p');
export const FORMAT_Y_TICK = format(',.0d');

export const XAxisTickFormat = (date) => {
	const endPeriod = moment(date)
		.add(5, 'm')
		.toDate();
	return `${FORMAT_DATE_X_TICK(date)} - ${FORMAT_DATE_X_TICK(endPeriod)}`;
};
export const yAccessor = ({ close }) => close;
