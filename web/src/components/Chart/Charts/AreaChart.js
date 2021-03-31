import React from 'react';
import PropTypes from 'prop-types';
import { AreaSeries } from 'react-stockcharts/lib/series';
import { fitWidth } from 'react-stockcharts/lib/helper';
import CustomChart from '../CustomChart';
import { areaProps } from '../props';
const AreaChart = (props) => (
	<CustomChart {...props}>
		<AreaSeries {...areaProps} />
	</CustomChart>
);

AreaChart.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(['svg', 'hybrid']).isRequired,
};

AreaChart.defaultProps = {
	type: 'svg',
	seriesName: 'AreaChart',
};

export default fitWidth(AreaChart);
