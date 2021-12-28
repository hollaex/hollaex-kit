import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import EventListener from 'react-event-listener';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';
import { changePair } from 'actions/appActions';

import TradeBlock from 'containers/Trade/components/TradeBlock';
import TVChartContainer from 'containers/Trade/ChartContainer';

import { Loader } from 'components';

import STRINGS from 'config/localizedStrings';
import withConfig from 'components/ConfigProvider/withConfig';

class ChartEmbed extends PureComponent {
	state = {
		chartHeight: 0,
		chartWidth: 0,
		symbol: '',
	};

	UNSAFE_componentWillMount() {
		const {
			isReady,
			router,
			constants: { features: { pro_trade = false } = {} } = {},
		} = this.props;
		if (!isReady || !pro_trade) {
			router.push('/summary');
		}
		this.setSymbol(this.props.routeParams.pair);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.routeParams.pair !== this.props.routeParams.pair) {
			this.setSymbol(nextProps.routeParams.pair);
		}
	}

	setSymbol = (symbol = '') => {
		this.props.changePair(symbol);
		this.setState({ symbol: '' }, () => {
			setTimeout(() => {
				this.setState({ symbol });
			}, 1000);
		});
	};

	setChartRef = (el) => {
		if (el) {
			this.chartBlock = el;
			this.onResize();
		}
	};

	onResize = () => {
		if (this.chartBlock) {
			this.setState({
				chartHeight: this.chartBlock.offsetHeight || 0,
				chartWidth: this.chartBlock.offsetWidth || 0,
			});
		}
	};

	render() {
		const { pair, pairData, activeTheme } = this.props;
		const { chartHeight, symbol } = this.state;

		if (symbol !== pair || !pairData) {
			return <Loader background={false} />;
		}

		return (
			<div className={classnames('trade-container', 'd-flex')}>
				<div className={classnames('trade-container', 'd-flex')}>
					<EventListener target="window" onResize={this.onResize} />
					<div
						className={classnames(
							'trade-col_main_wrapper',
							'flex-column',
							'd-flex',
							'f-1',
							'overflow-x'
						)}
					>
						<div
							className={classnames(
								'trade-main_content',
								'flex-auto',
								'd-flex',
								'chart-embed'
							)}
						>
							<TradeBlock
								stringId="CHART"
								title={STRINGS['CHART']}
								setRef={this.setChartRef}
								className="f-1 overflow-x chart-embed"
								pairData={pairData}
								pair={pair}
							>
								{pair && chartHeight > 0 && (
									<TVChartContainer
										activeTheme={activeTheme}
										symbol={symbol}
										pairData={pairData}
									/>
								)}
							</TradeBlock>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const pair = state.app.pair;
	const pairData = state.app.pairs[pair] || { pair_base: '', pair_2: '' };
	return {
		pair,
		pairData,
		activeTheme: state.app.theme,
		isReady: state.app.isReady,
		constants: state.app.constants,
	};
};

const mapDispatchToProps = (dispatch) => ({
	changePair: bindActionCreators(changePair, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(ChartEmbed));
