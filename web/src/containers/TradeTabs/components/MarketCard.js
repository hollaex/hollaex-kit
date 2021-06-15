import React, { Component } from 'react';
import { Transition } from 'react-transition-group';
import Image from 'components/Image';
import SparkLine from './SparkLine';
import classnames from 'classnames';
import { /*formatAverage,*/ formatToCurrency } from 'utils/currency';

class MarketCard extends Component {
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
		const { icons: ICONS, market, chartData, handleClick, index } = this.props;
		const { inProp, tickerDiff } = this.state;

		const {
			key,
			pair,
			symbol,
			pairTwo,
			fullname,
			ticker,
			increment_price,
			priceDifferencePercent,
			priceDifference,
		} = market;

		return (
			<div
				key={index}
				className="tabs-pair-details trade-tab-list pointer"
				onClick={() => handleClick(key)}
			>
				<div className="w-100">
					<div className="d-flex justify-content-between">
						<div className="d-flex">
							<div className="px-2">
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
									wrapperClassName="trade_tab-icons"
								/>
							</div>

							<div>
								<div className="trade_tab-pair-title">
									{symbol.toUpperCase()}/
									{pairTwo.symbol ? pairTwo.symbol.toUpperCase() : ''}
								</div>

								<div className="trade_tab-pair-sub-title">
									{fullname}/{pairTwo.fullname}
								</div>
							</div>

							<div className="pl-2">
								<span className="trade_tab-pair-price ml-1">
									{formatToCurrency(ticker.close, increment_price)}
								</span>
							</div>
						</div>

						<div className="trade_tab-ticker-container mr-2">
							<div className="d-flex justify-content-end">
								<Transition in={inProp} timeout={1000}>
									{(state) => (
										<div className="d-flex">
											<div
												className={classnames(
													'title-font',
													priceDifference < 0
														? 'price-diff-down trade-tab-price_diff_down'
														: 'price-diff-up trade-tab-price_diff_up',
													tickerDiff < 0
														? `glance-price-diff-down glance-trade-tab-price_diff_down ${state}`
														: `glance-price-diff-up glance-trade-tab-price_diff_up ${state}`
												)}
											>
												{priceDifferencePercent}
											</div>
										</div>
									)}
								</Transition>
							</div>
							<div className="trade_tab-pair-volume">
								{ticker.volume && `${ticker.volume} ${symbol.toUpperCase()}`}
							</div>
						</div>
					</div>
				</div>
				<div className="market-card__sparkline-wrapper w-100">
					<SparkLine
						data={chartData[key] || []}
						containerProps={{ style: { height: '100%', width: '100%' } }}
					/>
				</div>
			</div>
		);
	}
}

export default MarketCard;
