import { timeFormat } from "d3-time-format";
import { format } from "d3-format";

import {
  yAccessor,
  OHLCChildren,
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
}

export const OHLCProps = {
  origin: [0, -20],
  xDisplayFormat: timeFormat("%Y-%m-%d %H:%M:%S"),
  ohlcFormat: (value) => value,
  displayTexts: {
    d: 'Date',
    o: 'Open',
    h: 'High',
    l: 'Low',
    c: 'Close',
    v: 'Volume',
  },
  children: OHLCChildren,
}
