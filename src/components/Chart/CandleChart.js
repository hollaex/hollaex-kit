import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "react-stockcharts";
import { CandlestickSeries } from "react-stockcharts/lib/series";

import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
	CrossHairCursor,
	MouseCoordinateX,
	MouseCoordinateY,
  EdgeIndicator,
} from "react-stockcharts/lib/coordinates";

import { OHLCTooltip } from "react-stockcharts/lib/tooltip";
import { fitWidth } from "react-stockcharts/lib/helper";

import {
	xScaleProvider,
	margins,
	yExtents,
	generateXExtents,
	Y_GAP,
	X_GAP,
} from './utils';

import {
  OHLCProps,
  edgeIndicatorProps,
} from './props';

class CandleChart extends React.Component {

	saveNode = (node) => {
		this.node = node;
	}

	resetYDomain = () => {
		this.node.resetYDomain();
	}

	render() {
		const {
			type, data: initialData,
			width,
			height,
			ratio,
			serieName,
			clamp,
			mouseMoveEvent,
			panEvent,
			zoomEvent,
		} = this.props;

		const {
			data,
			xScale,
			xAccessor,
			displayXAccessor,
		} = xScaleProvider(initialData);

		const xExtents = generateXExtents(xAccessor, data);

		const gridHeight = height - margins.top - margins.bottom;
		const gridWidth = width - margins.left - margins.right;

		const showGrid = true;
		const yGrid = showGrid ? { innerTickSize: -1 * gridWidth, tickStrokeOpacity: 0.2 } : {};
		const xGrid = showGrid ? { innerTickSize: -1 * gridHeight, tickStrokeOpacity: 0.2 } : {};

		return (
			<ChartCanvas ref={this.saveNode} height={height}
				ratio={ratio}
				width={width}
				margins={margins}

				mouseMoveEvent={mouseMoveEvent}
				panEvent={panEvent}
				zoomEvent={zoomEvent}
				clamp={clamp}

				type={type}
				seriesName={serieName}
				data={data}
				xScale={xScale}
				xExtents={xExtents}
				xAccessor={xAccessor}
				displayXAccessor={displayXAccessor}
      >
				<Chart id={1}	yExtents={[yExtents]}>
					<XAxis axisAt="bottom"
						orient="bottom"
						zoomEnabled={!zoomEvent}
						{...xGrid}
          />
					<YAxis axisAt="right"
						orient="right"
						ticks={5}
						zoomEnabled={!zoomEvent}
						{...yGrid}
					/>

          {/*}<MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%H:%M:%S")}
          />*/}
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")}
          />

					<CandlestickSeries />
					<OHLCTooltip {...OHLCProps} />
          <EdgeIndicator {...edgeIndicatorProps} />
				</Chart>
				<CrossHairCursor />
			</ChartCanvas>
		);
	}
}

CandleChart.propTypes = {
	serieName: PropTypes.string.isRequired,
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	height: PropTypes.number,
	ratio: PropTypes.number,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleChart.defaultProps = {
	type: "svg",
	mouseMoveEvent: true,
	panEvent: true,
	zoomEvent: true,
	clamp: false,
  ratio: 1,
	height: 400,
};

CandleChart = fitWidth(CandleChart);

export default CandleChart;
