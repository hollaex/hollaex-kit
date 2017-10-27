import React from 'react';
import classnames from 'classnames';
import { timeFormat } from "d3-time-format";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { last } from "react-stockcharts/lib/utils";

export const X_GAP = 1;
export const Y_GAP = 10;

export const inputDateAccessor = (({ date }) => new Date(date));

export const xScaleProvider = discontinuousTimeScaleProvider
  .inputDateAccessor(inputDateAccessor);

export const margins = { left: 25, right: 75, top: 30, bottom: 30 };

export const yExtents = (data) => {
  return [
    data.high + Y_GAP,
    data.low - Y_GAP,
  ];
};

export const generateXExtents = (xAccessor, data) => {
  const start = xAccessor(last(data));
  const end = xAccessor(data[Math.max(0, data.length - 150)]);
  const xExtents = [start, end];
  return xExtents;
}

export const OHLCChildren = (props, moreProps, itemsToDisplay) => {
  const {
    displayTexts: { o, h, l, c, },
    className,
    textClassName,
  } = props;
  const { open, high, low, close, volume, x, y} = itemsToDisplay;
  return (
    <g
      className={classnames(className)}
      transform={`translate(${x}, ${y})`}
    >
      <text
        className={classnames('ohlc_wrapper')}
      >
        <tspan className={classnames('ohlc_data_wrapper')}>
          <tspan className={classnames('ohlc_label')}>{o}</tspan>
          <tspan className={classnames('ohlc_value')}>{open}</tspan>
        </tspan>
        <tspan className={classnames('ohlc_data_wrapper')}>
          <tspan className={classnames('ohlc_label')}>{h}</tspan>
          <tspan className={classnames('ohlc_value')}>{high}</tspan>
        </tspan>
        <tspan className={classnames('ohlc_data_wrapper')}>
          <tspan className={classnames('ohlc_label')}>{l}</tspan>
          <tspan className={classnames('ohlc_value')}>{low}</tspan>
        </tspan>
        <tspan className={classnames('ohlc_data_wrapper')}>
          <tspan className={classnames('ohlc_label')}>{c}</tspan>
          <tspan className={classnames('ohlc_value')}>{close}</tspan>
        </tspan>
      </text>
    </g>
  )
}

export const tickFormat = timeFormat("%b %e");
export const yAccessor = ({ close }) => close;
