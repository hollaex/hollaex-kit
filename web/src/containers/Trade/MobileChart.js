import React, { Component, Fragment } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import TradeBlock from './components/TradeBlock';
import STRINGS from '../../config/localizedStrings';
import TradeHistory from './components/TradeHistory';
import TVChartContainer from './ChartContainer';
import MarketSelector from 'components/AppBar/MarketSelector';

class MobileChart extends Component {
	state = {
		chartWidth: 0,
		chartHeight: 0,
		isMarketSelectorOpen: false,
	};

	setChartRef = (el) => {
		if (el) {
			this.setState({
				chartHeight: el.offsetHeight,
				chartWidth: el.offsetWidth,
			});
		}
	};

	toggleMarketSelector = () => {
		this.setState((prevState) => ({
			...prevState,
			isMarketSelectorOpen: !prevState.isMarketSelectorOpen,
		}));
	};

	closeAddTabMenu = () => {
		this.setState({
			isMarketSelectorOpen: false,
		});
	};

	render() {
		const {
			pair,
			pairData,
			activeTheme,
			activeLanguage,
			goToPair,
			symbol,
			constants,
			goToMarkets,
		} = this.props;
		const { chartHeight, isMarketSelectorOpen } = this.state;
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
							<div
								className={classnames(
									'app_bar-pair-content',
									'd-flex',
									'justify-content-between',
									'px-2'
								)}
							>
								<div
									className="d-flex align-items-center"
									onClick={this.toggleMarketSelector}
								>
									<span className="pt-2">{pair}</span>
									<i
										className={classnames(
											'arrow small ml-3',
											isMarketSelectorOpen ? 'up' : 'down'
										)}
									/>
								</div>
								{isMarketSelectorOpen && (
									<MarketSelector
										triggerId="market-selector"
										wrapperClassName="mobile-chart__market-selector-wrapper"
										onViewMarketsClick={goToMarkets}
										closeAddTabMenu={this.closeAddTabMenu}
										addTradePairTab={goToPair}
									/>
								)}
							</div>
						</div>
					}
					setRef={this.setChartRef}
					className="f-1 overflow-x"
					alignChildTitle={true}
					tailHead={
						constants.broker_enabled ? (
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
