import React, { Component } from 'react';
import classnames from 'classnames';
// import { Link } from 'react-router';
import { connect } from 'react-redux';
import TradeBlock from './components/TradeBlock';
import STRINGS from 'config/localizedStrings';
import TradeHistory from './components/TradeHistory';
import TVChartContainer from './ChartContainer';

class MobileChart extends Component {
	state = {
		chartWidth: 0,
		chartHeight: 0,
	};

	setChartRef = (el) => {
		if (el) {
			this.setState({
				chartHeight: el.offsetHeight,
				chartWidth: el.offsetWidth,
			});
		}
	};

	render() {
		const {
			pair,
			pairData,
			activeLanguage,
			symbol,
			// constants,
		} = this.props;
		const { chartHeight } = this.state;
		// const pairValue = pair || 'xht-usdt';
		return (
			<div
				className={classnames(
					'flex-column',
					'd-flex',
					'justify-content-between',
					'f-1',
					'apply_rtl'
				)}
			>
				<TradeBlock
					title={
						<div className="d-flex justify-content-start align-items-center flex-row">
							{/* {STRINGS["CHART"]} */}
						</div>
					}
					setRef={this.setChartRef}
					className="f-1 overflow-x trade-chart"
					alignChildTitle={true}
				>
					{pair && chartHeight > 0 && (
						<TVChartContainer symbol={symbol} pairData={pairData} />
					)}
				</TradeBlock>
				<TradeBlock
					title={STRINGS['PUBLIC_SALES']}
					className="f-1 trade-public-sales"
				>
					<TradeHistory pairData={pairData} language={activeLanguage} />
				</TradeBlock>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	constants: state.app.constants,
});

export default connect(mapStateToProps)(MobileChart);
