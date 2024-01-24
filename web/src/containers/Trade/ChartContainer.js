import React, { Suspense, lazy } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { LoadingOutlined } from '@ant-design/icons';

import withConfig from 'components/ConfigProvider/withConfig';
import { ErrorBoundary } from 'components';
import { tradeHistorySelector } from './utils';
import { setChartHigh } from 'actions/orderbookAction';

const TVChartContainer = lazy(() => import('./Chart'));

const ChartContainer = (props) => (
	<ErrorBoundary>
		<Suspense
			fallback={
				<div className="d-flex h-100 w-100 content-center align-center blue-link my-3">
					<LoadingOutlined />
				</div>
			}
		>
			<TVChartContainer {...props} />
		</Suspense>
	</ErrorBoundary>
);

const mapStateToProps = (state) => {
	const { data: tradeHistory } = tradeHistorySelector(state);

	return {
		tradeHistory,
		constants: state.app.constants,
		activeTheme: state.app.theme,
	};
};

const mapDispatchToProps = (dispatch) => ({
	setChartHigh: bindActionCreators(setChartHigh, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(ChartContainer));
