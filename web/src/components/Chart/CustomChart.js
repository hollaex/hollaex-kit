import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isMobile } from 'react-device-detect';

import { ChartCanvas, Chart } from 'react-stockcharts';
import { BarSeries } from 'react-stockcharts/lib/series';

import { XAxis, YAxis, TXAxis } from './axis';

import {
	CrossHairCursor,
	MouseCoordinateX,
	MouseCoordinateY,
	EdgeIndicator,
} from 'react-stockcharts/lib/coordinates';
import { OHLCTooltip } from 'react-stockcharts/lib/tooltip';

import { fitWidth } from 'react-stockcharts/lib/helper';

import {
	xScaleProvider,
	margins,
	yExtents,
	generateXExtents,
	FORMAT_DATE_X_TICK,
	FORMAT_Y_TICK,
} from './utils';

import {
	OHLCProps,
	edgeIndicatorProps,
	BarSeriesProps,
	BarSeriesChartProps,
} from './props';

import STRINGS from '../../config/localizedStrings';

class CustomChart extends Component {
	render() {
		const {
			type,
			data: initialData,
			width,
			height,
			ratio,
			seriesName,
			modifier,
			theme,
			children,
		} = this.props;

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
				<Chart id={1} yExtents={yExtents(modifier)}>
					<XAxis width={width} theme={theme} />
					<YAxis height={height} theme={theme} />
					<TXAxis width={width} theme={theme} />

					{!isMobile && (
						<MouseCoordinateX
							at="top"
							orient="top"
							displayFormat={FORMAT_DATE_X_TICK}
						/>
					)}
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={FORMAT_Y_TICK}
					/>

					{children}
					<OHLCTooltip {...OHLCProps} displayTexts={STRINGS['CHART_TEXTS']} />
					<EdgeIndicator {...edgeIndicatorProps(theme)} />
				</Chart>
				<Chart id={2} {...BarSeriesChartProps(height, 4)}>
					<BarSeries {...BarSeriesProps(theme)} />
				</Chart>
				<CrossHairCursor />
			</ChartCanvas>
		);
	}
}

CustomChart.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(['svg', 'hybrid']).isRequired,
	dataCount: PropTypes.number,
	children: PropTypes.node.isRequired,
};

CustomChart.defaultProps = {
	type: 'svg',
	seriesName: 'Chart',
	dataCount: 0,
};

export default fitWidth(CustomChart);
