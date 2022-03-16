import React, { Component } from 'react';
import { PriceChange, Image } from 'components';
import SparkLine from './SparkLine';
import { formatToCurrency } from 'utils/currency';

class MarketRow extends Component {
	render() {
		const { icons: ICONS, market, chartData, handleClick } = this.props;

		const { key, pair, symbol, pairTwo, ticker, increment_price } = market;

		return (
			<tr
				id={`market-list-row-${key}`}
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
							imageWrapperClassName="currency-ball-image-wrapper"
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
					<span className="title-font ml-2">
						{pairTwo.symbol ? pairTwo.symbol.toUpperCase() : ''}
					</span>
				</td>
				<td>
					<PriceChange market={market} />
				</td>
				<td>
					<span className="title-font ml-1">{ticker.volume}</span>
					<span className="title-font ml-2">{symbol.toUpperCase()}</span>
				</td>
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
