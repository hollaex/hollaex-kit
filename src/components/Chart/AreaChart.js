import React, { Component } from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "react-stockcharts";

import {
	BarSeries,
	AreaSeries,
} from "react-stockcharts/lib/series";

import { XAxis, YAxis } from "react-stockcharts/lib/axes";

import {
	CrossHairCursor,
	MouseCoordinateX,
	MouseCoordinateY,
  EdgeIndicator,
} from "react-stockcharts/lib/coordinates";
import { OHLCTooltip } from "react-stockcharts/lib/tooltip";

import { SingleValueTooltip } from "react-stockcharts/lib/tooltip";
import { fitWidth } from "react-stockcharts/lib/helper";

import {
	xScaleProvider,
	margins,
	yExtents,
  generateXExtents,
	Y_GAP,
	X_GAP,
  tickFormat,
} from './utils';

import {
  OHLCProps,
  areaProps,
  edgeIndicatorProps,
} from './props';

class AreaChartWithEdge extends Component {
	render() {
		const {
      type,
      data: initialData,
      width,
      height,
      ratio,
      seriesName,
    } = this.props;

		const {
			data,
			xScale,
			xAccessor,
			displayXAccessor,
		} = xScaleProvider(initialData);

		const xExtents = generateXExtents(xAccessor, data);

		return (
			<ChartCanvas
        height={height}
				ratio={ratio}
				width={width}

				margin={margins}
				type={type}
				seriesName={seriesName}

				data={data}
				xScale={xScale}
				xAccessor={xAccessor}
				displayXAccessor={displayXAccessor}
				xExtents={xExtents}
      >
				<Chart id={1} yExtents={yExtents}>
					<XAxis axisAt="bottom" orient="bottom" />
					<YAxis axisAt="right" orient="right" ticks={10} />

					<MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={tickFormat} />
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />

					<AreaSeries {...areaProps} />
          <OHLCTooltip {...OHLCProps} />
          <EdgeIndicator  {...edgeIndicatorProps} />
				</Chart>
				<CrossHairCursor />
			</ChartCanvas>
		);
	}
}

AreaChartWithEdge.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

AreaChartWithEdge.defaultProps = {
	type: "svg",
  seriesName: 'AreaChart'
};
AreaChartWithEdge = fitWidth(AreaChartWithEdge);

export default AreaChartWithEdge;
