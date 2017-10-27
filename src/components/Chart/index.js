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

import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { OHLCTooltip } from "react-stockcharts/lib/tooltip";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";

const Y_GAP = 10;
const X_GAP = 1;

class CandleChart extends React.Component {
	constructor(props) {
		super(props);
		this.saveNode = this.saveNode.bind(this);
		this.resetYDomain = this.resetYDomain.bind(this);
	}

	saveNode(node) {
		this.node = node;
	}

	resetYDomain() {
		this.node.resetYDomain();
	}

	render() {
		const { type, data: initialData, width, height, ratio, serieName } = this.props;
		const { mouseMoveEvent, panEvent, zoomEvent } = this.props;
		const { clamp } = this.props;

		const xScaleProvider = discontinuousTimeScaleProvider
			.inputDateAccessor(d => new Date(d.date));
		const {
			data,
			xScale,
			xAccessor,
			displayXAccessor,
		} = xScaleProvider(initialData);

		const start = xAccessor(last(data));
		const end = xAccessor(data[Math.max(0, data.length - 150)]);
		const xExtents = [start + X_GAP, end - X_GAP];

		const margin = { left: 25, right: 75, top: 30, bottom: 30 };

		const gridHeight = height - margin.top - margin.bottom;
		const gridWidth = width - margin.left - margin.right;

		const showGrid = true;
		const yGrid = showGrid ? { innerTickSize: -1 * gridWidth, tickStrokeOpacity: 0.2 } : {};
		const xGrid = showGrid ? { innerTickSize: -1 * gridHeight, tickStrokeOpacity: 0.2 } : {};

		return (
			<ChartCanvas ref={this.saveNode} height={height}
				ratio={ratio}
				width={width}
				margin={margin}

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
				<Chart id={1}	yExtents={[d => [d.high + Y_GAP, d.low - Y_GAP]]}>
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

          <MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%H:%M:%S")}
          />
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")}
          />

					<CandlestickSeries />
					<OHLCTooltip
            origin={[0, -20]}
            xDisplayFormat={timeFormat("%Y-%m-%d %H:%M:%S")}
          />
          <EdgeIndicator itemType="last"
            orient="right"
            edgeAt="right"
            yAccessor={d => d.close}
            fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}
          />
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
