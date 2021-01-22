import React from 'react';
import { connect } from 'react-redux';
import withConfig from 'components/ConfigProvider/withConfig';

import TVChartContainer from './Chart';
import { tradeHistorySelector } from './utils';

const ChartContainer = (props) => <TVChartContainer {...props} />;

const mapStateToProps = (state) => {
	const { data: tradeHistory } = tradeHistorySelector(state);

	return {
		tradeHistory,
		constants: state.app.constants,
	};
};

export default connect(mapStateToProps)(withConfig(ChartContainer));
