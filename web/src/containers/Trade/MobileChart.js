import React, { Component, Fragment } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import TradeBlock from './components/TradeBlock';
import STRINGS from '../../config/localizedStrings';
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
			activeTheme,
			activeLanguage,
			symbol,
			constants,
		} = this.props;
		const { chartHeight } = this.state;
		const pairValue = pair || 'xht-usdt';
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
					className="f-1 overflow-x"
					alignChildTitle={true}
					tailHead={
						constants &&
						constants.features &&
						constants.features.quick_trade ? (
							<div className="quick-trade-tab p-1 mt-1">
								<Link to={`/quick-trade/${pairValue}`}>
									{STRINGS['QUICK_TRADE']}
								</Link>
							</div>
						) : (
							<Fragment />
						)
					}
				>
					{pair && chartHeight > 0 && (
						<TVChartContainer
							activeTheme={activeTheme}
							symbol={symbol}
							pairData={pairData}
						/>
					)}
				</TradeBlock>
				<TradeBlock title={STRINGS['PUBLIC_SALES']} className="f-1">
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
