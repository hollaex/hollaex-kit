import React, { Component } from 'react';
import classnames from 'classnames';
import TradeBlock from './components/TradeBlock';
import PriceChart from './components/PriceChart';
import STRINGS from '../../config/localizedStrings';
import TradeHistory from './components/TradeHistory';
import { MobileDropdown } from '../../components';

class MobileChart extends Component {
	render() {
		const {
			props: {
				pair,
				pairData,
				activeTheme,
				chartHeight,
				chartWidth,
				tradeHistory,
				activeLanguage
			}
		} = this.props;

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
