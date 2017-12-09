import { timeFormat } from "d3-time-format";

import {
  yAccessor,
  OHLCChildren,
  FORMAT_Y_TICK,
} from './utils';

export const fillIndicator = ({ close, open }) => close > open ? COLORS.BUY : COLORS.SELL;

export const COLORS = {
  SELL: 'red',
  BUY: 'blue',
  LINE: 'black',
  FILL: 'orange'
}

export const areaProps = {
  stroke: COLORS.STROKE,
  strokeWidth: 2,
  fill: COLORS.FILL,
  opacity: 1,
  className: '',
  yAccessor,
}

export const edgeIndicatorProps = {
  fill: fillIndicator,
  yAccessor,
  orient: 'right',
  edgeAt: 'right',
  itemType: 'last',
  displayFormat: FORMAT_Y_TICK,
}

export const OHLCProps = {
  origin: [0, -25],
  xDisplayFormat: timeFormat("%Y-%m-%d %H:%M:%S"),
  ohlcFormat: FORMAT_Y_TICK,
  children: OHLCChildren,
}
