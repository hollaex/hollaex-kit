import React, { Component } from 'react';
import classnames from 'classnames';
import TradeBlock from './components/TradeBlock';
import PriceChart from './components/PriceChart';
import STRINGS from '../../config/localizedStrings';
import TradeHistory from './components/TradeHistory';
import { MobileDropdown } from '../../components';

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
			pair, pairData, activeTheme, tradeHistory, activeLanguage
		} = this.props;
		const { chartHeight, chartWidth } = this.state;
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
					title={STRINGS.CHART}
					setRef={this.setChartRef}
					className="f-1 overflow-x"
				>
					{pair &&
						chartHeight > 0 && (
							<PriceChart
								height={chartHeight}
								width={chartWidth}
								theme={activeTheme}
								pair={pair}
								pairBase={pairData.pair_base}
							/>
						)}
				</TradeBlock>
				<TradeBlock title={STRINGS.TRADE_HISTORY} className="f-1">
					<TradeHistory data={tradeHistory} language={activeLanguage} />
				</TradeBlock>
			</div>
		);
	}
}

export default MobileChart;
