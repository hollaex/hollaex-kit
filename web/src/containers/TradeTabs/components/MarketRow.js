import React, { Component } from 'react';
import { Transition } from 'react-transition-group';
import Image from 'components/Image';
import SparkLine from './SparkLine';
import { formatToCurrency } from 'utils/currency';

class MarketRow extends Component {
	constructor(props) {
		super(props);
		const { market: { priceDifference = 0 } = {} } = this.props;
		this.state = {
			tickerDiff: priceDifference,
			inProp: false,
		};
	}

	UNSAFE_componentWillUpdate(nextProp) {
		const {
			market: { ticker },
		} = this.props;
		if (nextProp.market.ticker.close !== ticker.close) {
			const tickerDiff = nextProp.market.ticker.close - ticker.close;
			this.setState((prevState) => ({
				...prevState,
				tickerDiff,
				inProp: !prevState.inProp,
			}));
		}
	}

	render() {
		const { icons: ICONS, market, chartData, handleClick } = this.props;
		const { inProp, tickerDiff } = this.state;

		const {
			key,
			pair,
			symbol,
			pairTwo,
			ticker,
			increment_price,
			priceDifferencePercent,
		} = market;

		return (
			<tr
				className="table-row table-bottom-border"
				onClick={() => handleClick(key)}
			>
				<td className="sticky-col">
					<div className="d-flex align-items-center">
						<Image
							iconId={
								ICONS[`${pair.pair_base.toUpperCase()}_ICON`]
									? `${pair.pair_base.toUpperCase()}_ICON`
									: 'DEFAULT_ICON'
							}
							icon={
								ICONS[`${pair.pair_base.toUpperCase()}_ICON`]
									? ICONS[`${pair.pair_base.toUpperCase()}_ICON`]
									: ICONS['DEFAULT_ICON']
							}
							wrapperClassName="market-list__coin-icons"
						/>
						<div>
							{symbol.toUpperCase()}/
							{pairTwo.symbol ? pairTwo.symbol.toUpperCase() : ''}
						</div>
					</div>
				</td>
				<td>
					<span className="title-font ml-1">
						{formatToCurrency(ticker.close, increment_price)}
					</span>
				</td>
				<td>
					<Transition in={inProp} timeout={1000}>
						{(state) => (
							<div className="d-flex">
								<div
									className={
										tickerDiff < 0
											? `title-font price-diff-down trade-tab-price_diff_down ${state}`
											: `title-font price-diff-up trade-tab-price_diff_up ${state}`
									}
								>
									{priceDifferencePercent}
								</div>
							</div>
						)}
					</Transition>
				</td>
				<td>{ticker.volume}</td>
				<td className="td-chart">
					<SparkLine
						data={chartData[key] || []}
						containerProps={{ style: { height: '100%', width: '100%' } }}
					/>
				</td>
			</tr>
		);
	}
}

export default MarketRow;
