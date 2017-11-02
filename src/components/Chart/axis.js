import React from 'react';

import {
  XAxis as BaseXAxis,
  YAxis as BaseYAxis,
} from "react-stockcharts/lib/axes";

export const YAxis = ({ height, ...rest }) => {
  const ticks = Math.floor(height / 50);
  console.log('YTicks', ticks, rest)
  return (
    <BaseYAxis
      {...rest}
      ticks={ticks}
    />
  );
}

YAxis.defaultProps = {
  axisAt: 'right',
  orient: 'right',
};


export const XAxis = ({ width, ...rest }) => {
  const ticks = Math.floor(width / 50);
  console.log('XTicks', ticks, rest)
  return (
    <BaseXAxis
      {...rest}
      ticks={ticks}
    />
  );
}

XAxis.defaultProps = {
  axisAt: 'bottom',
  orient: 'bottom',
};
