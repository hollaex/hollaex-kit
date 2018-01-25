import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ChartCanvas, Chart } from 'react-stockcharts';

import { AreaSeries } from 'react-stockcharts/lib/series';

import { XAxis, YAxis, TXAxis } from './axis';

import {
	CrossHairCursor,
	MouseCoordinateX,
	MouseCoordinateY,
	EdgeIndicator
} from 'react-stockcharts/lib/coordinates';
import { OHLCTooltip } from 'react-stockcharts/lib/tooltip';

import { fitWidth } from 'react-stockcharts/lib/helper';

import {
	xScaleProvider,
	margins,
	yExtents,
	generateXExtents,
	FORMAT_DATE_X_TICK,
	FORMAT_Y_TICK
} from './utils';

import { OHLCProps, areaProps, edgeIndicatorProps } from './props';

import STRINGS from '../../config/localizedStrings';

class AreaChartWithEdge extends Component {
	render() {
		const {
			type,
			data: initialData,
			width,
			height,
			ratio,
			seriesName
		} = this.props;

		const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
			initialData
		);

		const dataCount = this.props.dataCount || Math.floor(width / 5);
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

					<AreaSeries {...areaProps} />
					<OHLCTooltip {...OHLCProps} displayTexts={STRINGS.CHART_TEXTS} />
					<EdgeIndicator {...edgeIndicatorProps} />
				</Chart>
				<CrossHairCursor />
			</ChartCanvas>
		);
	}
}

AreaChartWithEdge.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	dataCount: PropTypes.number,
	type: PropTypes.oneOf(['svg', 'hybrid']).isRequired
};

AreaChartWithEdge.defaultProps = {
	type: 'svg',
	seriesName: 'AreaChart'
};
AreaChartWithEdge = fitWidth(AreaChartWithEdge);

export default AreaChartWithEdge;
