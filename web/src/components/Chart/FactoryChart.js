import React from 'react';
import PropTypes from 'prop-types';
import CandleChart from './Charts/CandleChart';
import AreaChart from './Charts/AreaChart';

export const CHART_TYPES = {
	AREA: 'CHART_TYPE_AREA',
	CANDLE: 'CHART_TYPE_CANDLE',
};

export const FactoryChart = ({ chartType, symbol, orderLimits, ...props }) => {
	switch (chartType) {
		case CHART_TYPES.AREA:
			return <AreaChart dataCount={100} {...props} />;
		case CHART_TYPES.CANDLE:
		default:
			const modifier = 1 * orderLimits[symbol].PRICE.STEP;
			return <CandleChart modifier={modifier} {...props} />;
	}
};

FactoryChart.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(['svg', 'hybrid']).isRequired,
	chartType: PropTypes.string.isRequired,
};

FactoryChart.defaultProps = {
	type: 'svg',
	seriesName: 'AreaChart',
};
