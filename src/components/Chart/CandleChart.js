import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ChartCanvas, Chart } from 'react-stockcharts';

import { CandlestickSeries } from 'react-stockcharts/lib/series';

import { XAxis, YAxis, TXAxis } from './axis';

import {
	CrossHairCursor,
	MouseCoordinateX,
	MouseCoordinateY,
	EdgeIndicator
} from 'react-stockcharts/lib/coordinates';
import { OHLCTooltip } from 'react-stockcharts/lib/tooltip';

import { fitWidth } from 'react-stockcharts/lib/helper';

import { CandlesProps, edgeIndicatorProps, OHLCProps } from './props';

import {
	margins,
	yExtents,
	generateXExtents,
	xScaleProvider,
	FORMAT_DATE_X_TICK,
	FORMAT_Y_TICK
} from './utils';
import STRINGS from '../../config/localizedStrings';

class CandleChart extends Component {
	state = {
		gridX: {},
		gridY: {}
	};

	componentDidMount() {
		this.calculateGrid(this.props.width, this.props.height);
	}

	componentWillReceiveProps(nextProps) {
		if (
			nextProps.width !== this.props.width ||
			nextProps.height !== this.props.height
		) {
			this.calculateGrid(nextProps.width, nextProps.height);
		}
	}

	calculateGrid = (width, height) => {
		const gridHeight = height - margins.top - margins.bottom;
		const gridWidth = width - margins.left - margins.right;

		const gridY = { innerTickSize: -1 * gridWidth, tickStrokeOpacity: 0.2 };
		const gridX = { innerTickSize: -1 * gridHeight, tickStrokeOpacity: 0.2 };

		this.setState({ gridY, gridX });
	};

	render() {
		const {
			width,
			data: initialData,
			ratio,
			height,
			type,
			seriesName
		} = this.props;
		// const { gridY, gridX } = this.state;

		const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
			initialData
		);

		const dataCount = Math.max(this.props.dataCount || Math.floor(width / 10));
		const xExtents = generateXExtents(xAccessor, data, dataCount);

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
					<XAxis width={width} />
					<YAxis height={height} />
					<TXAxis width={width} />

					<MouseCoordinateX
						at="top"
						orient="top"
						displayFormat={FORMAT_DATE_X_TICK}
					/>
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={FORMAT_Y_TICK}
					/>

					<CandlestickSeries {...CandlesProps} />
					<EdgeIndicator {...edgeIndicatorProps} />
					<OHLCTooltip {...OHLCProps} displayTexts={STRINGS.CHART_TEXTS} />
				</Chart>
				<CrossHairCursor />
			</ChartCanvas>
		);
	}
}

CandleChart.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(['svg', 'hybrid']).isRequired,
	dataCount: PropTypes.number,
	seriesName: PropTypes.string
};

CandleChart.defaultProps = {
	type: 'svg',
	seriesName: 'CandleChart',
	dataCount: 0
};

export default fitWidth(CandleChart);
