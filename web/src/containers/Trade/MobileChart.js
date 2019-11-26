import React, { Component } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';
import TradeBlock from './components/TradeBlock';
// import PriceChart from './components/PriceChart';
import STRINGS from '../../config/localizedStrings';
import TradeHistory from './components/TradeHistory';
import MobileDropdownWrapper from './components/MobileDropdownWrapper';
import TVChartContainer from './Chart'

class MobileChart extends Component {
	state = {
		chartWidth: 0,
		chartHeight: 0
	};

	setChartRef = (el) => {
		if (el) {
			this.setState({
				chartHeight: el.offsetHeight,
				chartWidth: el.offsetWidth
			});
		}
	};

	render() {
		const {
			pair,
			pairData,
			activeTheme,
			tradeHistory,
			activeLanguage,
			goToPair,
			// orderLimits,
			symbol
		} = this.props;
		const { chartHeight } = this.state;
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
							{/* {STRINGS.CHART} */}
							<MobileDropdownWrapper goToPair={goToPair} className="ml-3" />
						</div>
					}
					setRef={this.setChartRef}
					className="f-1 overflow-x"
					alignChildTitle={true}
					tailHead={
						<div className="quick-trade-tab p-1 mt-1">
							<Link to="/quick-trade/hex-usdt">
								{STRINGS.QUICK_TRADE}
							</Link>
						</div>
					}
				>
					{pair &&
						chartHeight > 0 && (
							<TVChartContainer activeTheme={activeTheme} symbol={symbol} tradeHistory={tradeHistory} pairData={pairData}/>
						)}
				</TradeBlock>
				<TradeBlock title={STRINGS.PUBLIC_SALES} className="f-1">
					<TradeHistory data={tradeHistory} language={activeLanguage} />
				</TradeBlock>
			</div>
		);
	}
}

export default MobileChart;
