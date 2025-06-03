import React, { Component } from 'react';
import { isMobile } from 'react-device-detect';
import { PriceChange, Coin } from 'components';
import SparkLine from './SparkLine';
import { formatToCurrency } from 'utils/currency';

class MarketCard extends Component {
	render() {
		const { market, chartData, handleClick, index } = this.props;

		const {
			key,
			pairTwo,
			fullname,
			ticker,
			increment_price,
			display_name,
			pair_base_display,
			pair_2_display,
			icon_id,
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
								<Coin iconId={icon_id} type={isMobile ? 'CS8' : 'CS9'} />
							</div>

							<div>
								<div className="trade_tab-pair-title">{display_name}</div>

								<div className="trade_tab-pair-sub-title">
									{fullname}/{pairTwo.fullname}
								</div>
							</div>
						</div>
						<div className="d-flex flex-direction-column align-end mr-2">
							<div className="d-flex align-start pl-2">
								<div className="trade_tab-pair-price ml-1">
									{formatToCurrency(ticker.close, increment_price)}
								</div>
								<div className="ml-2 trade_tab-pair-volume">
									{pair_2_display}
								</div>
							</div>
							<div className="d-flex justify-content-end align-center">
								<div className="d-flex justify-content-end">
									<PriceChange market={market} key={key} />
								</div>
								<div className=" ml-2 trade_tab-pair-volume">
									<span className="pr-2">Vol:</span>
									<span>
										{ticker.volume && `${ticker.volume} ${pair_base_display}`}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="market-card__sparkline-wrapper market-cards w-100">
					<SparkLine
						key={`${key}-${
							(chartData[key] &&
								chartData[key]?.close &&
								chartData[key]?.close?.length) ||
							0
						}`}
						data={
							!chartData[key] ||
							(chartData[key] &&
								chartData[key]?.close &&
								chartData[key]?.close?.length < 2)
								? { close: [0.1, 0.1, 0.1], open: [] }
								: chartData[key]
						}
						containerProps={{ style: { height: '100%', width: '100%' } }}
					/>
				</div>
			</div>
		);
	}
}

export default MarketCard;
