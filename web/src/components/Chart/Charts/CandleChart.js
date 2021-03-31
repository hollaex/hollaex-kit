import React from 'react';
import PropTypes from 'prop-types';
import { CandlestickSeries } from 'react-stockcharts/lib/series';
import { fitWidth } from 'react-stockcharts/lib/helper';
import CustomChart from '../CustomChart';
import { CandlesProps } from '../props';

const CandleChart = React.forwardRef((props, ref) => (
	<CustomChart ref={ref} {...props}>
		<CandlestickSeries {...CandlesProps(props.theme)} />
	</CustomChart>
));

CandleChart.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(['svg', 'hybrid']).isRequired,
};

CandleChart.defaultProps = {
	type: 'svg',
	seriesName: 'AreaChart',
};

export default fitWidth(CandleChart);
